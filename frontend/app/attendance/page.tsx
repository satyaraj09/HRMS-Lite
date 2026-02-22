"use client";
import { useEffect, useState } from "react";
import api from "@/lib/api";
import Loader from "@/components/Loader";
import EmptyState from "@/components/EmptyState";
import ErrorAlert from "@/components/ErrorAlert";

interface Employee {
  id: string;
  full_name: string;
}

interface Record {
  id: string;
  employee: string;
  date: string;
  status: "Present" | "Absent";
}

export default function AttendancePage() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [records, setRecords] = useState<Record[]>([]);
  const [filteredRecords, setFilteredRecords] = useState<Record[]>([]);
  const [form, setForm] = useState({
    employee: "",
    date: "",
    status: "Present",
  });
  const [filterDate, setFilterDate] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchData = async () => {
    setLoading(true);
    try {
      const [empRes, attRes] = await Promise.all([
        api.get("/employees/"),
        api.get("/attendances/"),
      ]);
      const emps = Array.isArray(empRes.data)
        ? empRes.data
        : empRes.data.results || [];
      const recs = Array.isArray(attRes.data)
        ? attRes.data
        : attRes.data.results || [];
      setEmployees(emps);
      setRecords(recs);
      setFilteredRecords(recs);
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (!filterDate) {
      setFilteredRecords(records);
    } else {
      setFilteredRecords(records.filter((r) => r.date === filterDate));
    }
  }, [filterDate, records]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await api.post("/attendances/", form);
      setForm({ employee: "", date: "", status: "Present" });
      fetchData();
    } catch (err: any) {
      setError(err.response?.data?.error || "Attendance already marked.");
    } finally {
      setLoading(false);
    }
  };

  const getEmployeeName = (uuid: string) =>
    employees.find((e) => e.id === uuid)?.full_name || "Unknown";

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-8">
      <h1 className="text-3xl font-bold text-gray-900">Attendance</h1>

      <section className="bg-white rounded-lg shadow p-6 space-y-4">
        <h2 className="text-xl font-semibold text-gray-900">Mark Attendance</h2>
        {error && <ErrorAlert message={error} />}
        <form onSubmit={handleSubmit} className="grid md:grid-cols-4 gap-4">
          <select
            required
            className="border rounded px-3 py-2 focus:ring focus:ring-blue-200"
            value={form.employee}
            onChange={(e) => setForm({ ...form, employee: e.target.value })}
            disabled={loading}
          >
            <option value="">Select Employee</option>
            {employees.map((emp) => (
              <option key={emp.id} value={emp.id}>
                {emp.full_name}
              </option>
            ))}
          </select>
          <input
            type="date"
            required
            className="border rounded px-3 py-2 focus:ring focus:ring-blue-200"
            value={form.date}
            onChange={(e) => setForm({ ...form, date: e.target.value })}
            disabled={loading}
          />
          <select
            className="border rounded px-3 py-2 focus:ring focus:ring-blue-200"
            value={form.status}
            onChange={(e) => setForm({ ...form, status: e.target.value })}
            disabled={loading}
          >
            <option>Present</option>
            <option>Absent</option>
          </select>
          <button
            type="submit"
            className="bg-blue-600 text-white rounded px-4 py-2 hover:bg-blue-700 transition"
            disabled={loading}
          >
            {loading ? "Submitting..." : "Submit"}
          </button>
        </form>
      </section>

      <section className="bg-white rounded-lg shadow overflow-hidden">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center p-6 border-b">
          <input
            type="date"
            className="border rounded px-3 py-2 focus:ring focus:ring-blue-200"
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
          />
          <button
            onClick={() => setFilterDate("")}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition text-sm"
          >
            Clear Filter
          </button>
        </div>
        {loading ? (
          <Loader />
        ) : filteredRecords.length === 0 ? (
          <EmptyState message="No records for selected date." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">
                    Employee
                  </th>
                  <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">
                    Date
                  </th>
                  <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredRecords.map((r) => (
                  <tr key={r.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium text-gray-900">
                      {getEmployeeName(r.employee)}
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {new Date(r.date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2 py-1 rounded text-sm ${
                          r.status === "Present"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {r.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}

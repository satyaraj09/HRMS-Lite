"use client";
import { useEffect, useState } from "react";
import api from "@/lib/api";
import Loader from "@/components/Loader";
import EmptyState from "@/components/EmptyState";
import ErrorAlert from "@/components/ErrorAlert";

interface Employee {
  id: string;
  full_name: string;
  email: string;
  department: string;
}

export default function EmployeesPage() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [filtered, setFiltered] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [form, setForm] = useState({
    full_name: "",
    email: "",
    department: "",
  });
  const [error, setError] = useState("");

  const fetchEmployees = async () => {
    try {
      const res = await api.get("/employees/");
      const data = Array.isArray(res.data) ? res.data : res.data.results || [];
      setEmployees(data);
      setFiltered(data);
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to fetch");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post("/employees/", form);
      setForm({ full_name: "", email: "", department: "" });
      fetchEmployees();
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to add");
    }
  };

  const deleteEmployee = async (id: string) => {
    if (!confirm("Delete employee?")) return;
    try {
      await api.delete(`/employees/${id}/`);
      fetchEmployees();
    } catch {
      setError("Failed to delete");
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  useEffect(() => {
    const term = search.toLowerCase();
    setFiltered(
      employees.filter(
        (emp) =>
          emp.full_name.toLowerCase().includes(term) ||
          emp.email.toLowerCase().includes(term) ||
          emp.department.toLowerCase().includes(term),
      ),
    );
  }, [search, employees]);

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-8">
      <h1 className="text-3xl font-bold text-gray-900">Employees</h1>

      <section className="bg-white rounded-lg shadow p-6 space-y-4">
        <h2 className="text-xl font-semibold text-gray-900">Add Employee</h2>
        {error && <ErrorAlert message={error} />}
        <form onSubmit={handleSubmit} className="grid md:grid-cols-4 gap-4">
          <input
            required
            placeholder="Full Name"
            className="border rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-200"
            value={form.full_name}
            onChange={(e) => setForm({ ...form, full_name: e.target.value })}
          />
          <input
            required
            type="email"
            placeholder="Email"
            className="border rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-200"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
          <input
            required
            placeholder="Department"
            className="border rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-200"
            value={form.department}
            onChange={(e) => setForm({ ...form, department: e.target.value })}
          />
          <button
            type="submit"
            className="bg-blue-600 text-white rounded px-4 py-2 hover:bg-blue-700 transition"
          >
            Add
          </button>
        </form>
      </section>

      <section className="bg-white rounded-lg shadow overflow-hidden">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">Employee List</h2>
          <input
            placeholder="Search..."
            className="border rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-200 max-w-md"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {loading ? (
          <Loader />
        ) : filtered.length === 0 ? (
          <EmptyState message="No matching employees." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">
                    Name
                  </th>
                  <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">
                    Email
                  </th>
                  <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">
                    Department
                  </th>
                  <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filtered.map((emp) => (
                  <tr key={emp.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium text-gray-900">
                      {emp.full_name}
                    </td>
                    <td className="px-6 py-4 text-gray-600">{emp.email}</td>
                    <td className="px-6 py-4">
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                        {emp.department}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => deleteEmployee(emp.id)}
                        className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700 transition"
                      >
                        Delete
                      </button>
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

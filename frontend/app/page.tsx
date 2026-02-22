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

export default function Dashboard() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [attendance, setAttendance] = useState({ present: 0, absent: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const today = new Date().toISOString().split("T")[0];
        const [empRes, attRes] = await Promise.all([
          api.get("/employees/"),
          api.get(`/attendances/?date=${today}`),
        ]);

        const emps = Array.isArray(empRes.data)
          ? empRes.data
          : empRes.data.results || [];
        setEmployees(emps);

        const attData = Array.isArray(attRes.data)
          ? attRes.data
          : attRes.data.results || [];
        const present = attData.filter(
          (a: any) => a.status === "Present",
        ).length;
        const absent = attData.filter((a: any) => a.status === "Absent").length;
        setAttendance({ present, absent });
      } catch (err: any) {
        setError(err.response?.data?.error || "Failed to load data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <Loader />;
  if (error) return <ErrorAlert message={error} />;

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-8">
      <header className="space-y-1">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Today's overview & recent employees</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 bg-white rounded-lg shadow text-center">
          <div className="text-2xl font-bold text-gray-900">
            {employees.length}
          </div>
          <div className="text-gray-500 uppercase text-sm">Total Employees</div>
        </div>
        <div className="p-6 bg-white rounded-lg shadow text-center">
          <div className="text-2xl font-bold text-green-600">
            {attendance.present}
          </div>
          <div className="text-gray-500 uppercase text-sm">Present Today</div>
        </div>
        <div className="p-6 bg-white rounded-lg shadow text-center">
          <div className="text-2xl font-bold text-red-600">
            {attendance.absent}
          </div>
          <div className="text-gray-500 uppercase text-sm">Absent Today</div>
        </div>
      </div>

      <section className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">
            Recent Employees
          </h2>
        </div>
        {employees.length === 0 ? (
          <EmptyState message="No employees. Add from Employees page." />
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
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {employees.slice(0, 10).map((emp) => (
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

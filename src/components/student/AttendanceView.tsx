"use client";

import React, { useState, useEffect } from "react";
import { AttendanceRecord } from "@/lib/services/attendanceService";
import { attendanceService } from "@/lib/services/attendanceService";
import Table from "../ui/Table";

export default function AttendanceView() {
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedMonth, setSelectedMonth] = useState<string>(
    new Date().toISOString().slice(0, 7)
  );

  useEffect(() => {
    fetchAttendance();
  }, [selectedMonth]);

  const fetchAttendance = async () => {
    try {
      setLoading(true);
      // For now, we'll use a mock student ID - in a real app, this would come from auth context
      const studentId = 1; // This should be dynamic based on logged-in student
      const data = await attendanceService.getAttendanceByStudentId(studentId);

      // Filter by selected month
      const filteredData = data.filter((record) =>
        record.date.startsWith(selectedMonth)
      );

      setAttendance(filteredData);
      setError(null);
    } catch (err) {
      console.error("Failed to fetch attendance:", err);
      setError("Failed to fetch attendance records");
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "present":
        return "bg-green-100 text-green-800";
      case "absent":
        return "bg-red-100 text-red-800";
      case "late":
        return "bg-yellow-100 text-yellow-800";
      case "excused":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "present":
        return "✓";
      case "absent":
        return "✗";
      case "late":
        return "⏰";
      case "excused":
        return "ℹ";
      default:
        return "?";
    }
  };

  const calculateAttendanceStats = () => {
    const total = attendance.length;
    const present = attendance.filter(
      (record) => record.status === "present"
    ).length;
    const absent = attendance.filter(
      (record) => record.status === "absent"
    ).length;
    const late = attendance.filter((record) => record.status === "late").length;
    const excused = attendance.filter(
      (record) => record.status === "excused"
    ).length;
    const percentage = total > 0 ? Math.round((present / total) * 100) : 0;

    return { total, present, absent, late, excused, percentage };
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="text-sm text-red-700">{error}</div>
      </div>
    );
  }

  const stats = calculateAttendanceStats();

  return (
    <div className="space-y-6">
      {/* Header and Month Selection */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-semibold text-gray-900">
            My Attendance
          </h2>
          <div className="flex items-center space-x-4">
            <label className="text-sm font-medium text-gray-700">Month:</label>
            <input
              type="month"
              className="rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
            />
          </div>
        </div>

        {/* Attendance Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold text-gray-900">
              {stats.total}
            </div>
            <div className="text-sm text-gray-600">Total Days</div>
          </div>
          <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold text-green-600">
              {stats.present}
            </div>
            <div className="text-sm text-gray-600">Present</div>
          </div>
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold text-red-600">
              {stats.absent}
            </div>
            <div className="text-sm text-gray-600">Absent</div>
          </div>
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold text-yellow-600">
              {stats.late}
            </div>
            <div className="text-sm text-gray-600">Late</div>
          </div>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold text-blue-600">
              {stats.excused}
            </div>
            <div className="text-sm text-gray-600">Excused</div>
          </div>
        </div>

        {/* Overall Attendance Rate */}
        <div className="mt-4 text-center">
          <div className="text-3xl font-bold text-blue-600">
            {stats.percentage}%
          </div>
          <div className="text-sm text-gray-600">Overall Attendance Rate</div>
        </div>
      </div>

      {/* Attendance Table */}
      <Table
        title={`Attendance Records for ${new Date(
          selectedMonth + "-01"
        ).toLocaleDateString("en-US", { month: "long", year: "numeric" })}`}
        responsive={true}
        emptyMessage="No attendance records found for this month"
        tableWrapperClassName="bg-white shadow-lg"
        tableHeader={
          <>
            <th className="px-6 py-4 text-left text-sm font-medium text-black uppercase tracking-wider">
              Date
            </th>
            <th className="px-6 py-4 text-center text-sm font-medium text-black uppercase tracking-wider">
              Status
            </th>
            <th className="px-6 py-4 text-center text-sm font-medium text-black uppercase tracking-wider">
              Day of Week
            </th>
          </>
        }
        tableContent={
          <>
            {attendance.map((record, index) => (
              <tr
                key={index}
                className="hover:bg-gray-50 transition duration-150 ease-in-out"
              >
                <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                  {new Date(record.date).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                      record.status
                    )}`}
                  >
                    <span className="mr-1">{getStatusIcon(record.status)}</span>
                    {record.status.charAt(0).toUpperCase() +
                      record.status.slice(1)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center text-gray-500">
                  {new Date(record.date).toLocaleDateString("en-US", {
                    weekday: "long",
                  })}
                </td>
              </tr>
            ))}
          </>
        }
      />

      {/* No Records Message */}
      {attendance.length === 0 && !loading && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-yellow-400"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800">
                No Attendance Records
              </h3>
              <div className="text-sm text-yellow-700">
                No attendance records found for the selected month. This could
                mean attendance hasn't been taken yet or there are no records
                for this period.
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

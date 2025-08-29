"use client";

import React, { useState, useEffect } from "react";
import { User, UserAttendance, AttendanceStatus } from "@/types";
import { userService } from "@/lib/services/userService";
import { attendanceService } from "@/lib/services/attendanceService";
import Table from "../ui/Table";

export default function UserAttendanceManager() {
  const [users, setUsers] = useState<User[]>([]);
  const [attendance, setAttendance] = useState<UserAttendance[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split("T")[0]
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await userService.getUsers();
      setUsers(data);

      // Initialize attendance for all users
      const initialAttendance: UserAttendance[] = data.map((user) => ({
        user_id: user.id,
        user_name: user.name,
        status: "present" as AttendanceStatus,
      }));

      console.log("Users data:", data);
      console.log("Initial attendance:", initialAttendance);

      setAttendance(initialAttendance);
    } catch (err) {
      console.error("Failed to fetch users:", err);
      setError("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  const handleDateChange = (date: string) => {
    setSelectedDate(date);
  };

  const handleAttendanceChange = (userId: number, status: AttendanceStatus) => {
    setAttendance((prev) =>
      prev.map((user) => (user.user_id === userId ? { ...user, status } : user))
    );
  };

  const handleBulkAction = (status: AttendanceStatus) => {
    setAttendance((prev) =>
      prev.map((user) => ({
        ...user,
        status,
      }))
    );
  };

  const handleSaveAttendance = async () => {
    if (attendance.length === 0) return;

    try {
      setLoading(true);

      // Prepare attendance data in the format expected by createAttendance
      const attendanceArray = attendance.map((user) => ({
        user_id: user.user_id,
        status: user.status,
      }));

      // Use the createAttendance method for users
      await attendanceService.createUserAttendance(
        selectedDate,
        attendanceArray
      );

      // Clear any existing error
      setError(null);
    } catch (err) {
      console.error("Failed to save attendance:", err);
      setError("Failed to save attendance");
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: AttendanceStatus) => {
    switch (status) {
      case "present":
        return "text-white font-semibold";
      case "absent":
        return "text-white font-semibold";
      case "late":
        return "text-white font-semibold";
      case "excused":
        return "text-white font-semibold";
      default:
        return "text-white font-semibold";
    }
  };

  const getStatusStyle = (status: AttendanceStatus) => {
    switch (status) {
      case "present":
        return { backgroundColor: "var(--success)" };
      case "absent":
        return { backgroundColor: "var(--danger)" };
      case "late":
        return { backgroundColor: "var(--warning)" };
      case "excused":
        return { backgroundColor: "var(--primary)" };
      default:
        return { backgroundColor: "var(--foreground-muted)" };
    }
  };

  if (loading && users.length === 0) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header and Controls */}
      <div className="glass-card">
        <h2
          className="text-2xl font-semibold mb-4"
          style={{ color: "var(--foreground)" }}
        >
          User/Employee Attendance Management
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {/* Date Selection */}
          <div>
            <label
              className="block text-sm font-medium mb-2"
              style={{ color: "var(--foreground-muted)" }}
            >
              Date
            </label>
            <input
              type="date"
              className="modern-input w-full px-3 py-2"
              value={selectedDate}
              onChange={(e) => handleDateChange(e.target.value)}
            />
          </div>

          {/* Save Button */}
          <div className="flex items-end">
            <button
              onClick={handleSaveAttendance}
              disabled={loading}
              className="btn-primary w-full px-4 py-2 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Saving..." : "Save Attendance"}
            </button>
          </div>
        </div>

        {/* Bulk Actions */}
        {users.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            <span
              className="text-sm font-medium mr-2"
              style={{ color: "var(--foreground-muted)" }}
            >
              Quick Actions:
            </span>
            <button
              onClick={() => handleBulkAction("present")}
              className="px-3 py-1 rounded-md text-sm font-medium transition-colors"
              style={{
                backgroundColor: "var(--success-light)",
                color: "var(--success)",
              }}
            >
              Mark All Present
            </button>
            <button
              onClick={() => handleBulkAction("absent")}
              className="px-3 py-1 rounded-md text-sm font-medium transition-colors"
              style={{
                backgroundColor: "var(--danger-light)",
                color: "var(--danger)",
              }}
            >
              Mark All Absent
            </button>
            <button
              onClick={() => handleBulkAction("late")}
              className="px-3 py-1 rounded-md text-sm font-medium transition-colors"
              style={{
                backgroundColor: "var(--warning-light)",
                color: "var(--warning)",
              }}
            >
              Mark All Late
            </button>
          </div>
        )}

        {/* Error Display */}
        {error && (
          <div
            className="glass-card"
            style={{ backgroundColor: "var(--danger-light)" }}
          >
            <div className="text-sm" style={{ color: "var(--danger)" }}>
              {error}
            </div>
          </div>
        )}
      </div>

      {/* Attendance Table */}
      {users.length > 0 && (
        <Table
          title={`User Attendance for ${new Date(
            selectedDate
          ).toLocaleDateString()}`}
          responsive={true}
          emptyMessage="No users found"
          tableWrapperClassName="glass-card"
          tableHeader={
            <>
              <th
                className="px-6 py-4 text-left text-sm font-medium uppercase tracking-wider"
                style={{ color: "var(--foreground)" }}
              >
                User Name
              </th>
              <th
                className="px-6 py-4 text-center text-sm font-medium uppercase tracking-wider"
                style={{ color: "var(--foreground)" }}
              >
                Status
              </th>
            </>
          }
          tableContent={
            <>
              {attendance.map((user, index) => {
                console.log("Rendering user:", user);
                return (
                  <tr key={index} className="theme-table-row">
                    <td
                      className="px-6 py-4 whitespace-nowrap font-medium"
                      style={{ color: "var(--foreground)" }}
                    >
                      {user.user_name || "No Name"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <select
                        value={user.status}
                        onChange={(e) =>
                          handleAttendanceChange(
                            user.user_id,
                            e.target.value as AttendanceStatus
                          )
                        }
                        className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                          user.status
                        )} border-0`}
                        style={{
                          ...getStatusStyle(user.status),
                          color: "white",
                        }}
                      >
                        <option value="present">Present</option>
                        <option value="absent">Absent</option>
                        <option value="late">Late</option>
                        <option value="excused">Excused</option>
                      </select>
                    </td>
                  </tr>
                );
              })}
            </>
          }
        />
      )}

      {/* Attendance Summary */}
      {attendance.length > 0 && (
        <div className="glass-card">
          <h3
            className="text-lg font-semibold mb-4"
            style={{ color: "var(--foreground)" }}
          >
            Attendance Summary
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="text-center">
              <div
                className="text-2xl font-bold"
                style={{ color: "var(--foreground)" }}
              >
                {attendance.length}
              </div>
              <div
                className="text-sm"
                style={{ color: "var(--foreground-muted)" }}
              >
                Total Users
              </div>
            </div>
            <div className="text-center">
              <div
                className="text-2xl font-bold"
                style={{ color: "var(--success)" }}
              >
                {attendance.filter((u) => u.status === "present").length}
              </div>
              <div
                className="text-sm"
                style={{ color: "var(--foreground-muted)" }}
              >
                Present
              </div>
            </div>
            <div className="text-center">
              <div
                className="text-2xl font-bold"
                style={{ color: "var(--danger)" }}
              >
                {attendance.filter((u) => u.status === "absent").length}
              </div>
              <div
                className="text-sm"
                style={{ color: "var(--foreground-muted)" }}
              >
                Absent
              </div>
            </div>
            <div className="text-center">
              <div
                className="text-2xl font-bold"
                style={{ color: "var(--warning)" }}
              >
                {attendance.filter((u) => u.status === "late").length}
              </div>
              <div
                className="text-sm"
                style={{ color: "var(--foreground-muted)" }}
              >
                Late
              </div>
            </div>
            <div className="text-center">
              <div
                className="text-2xl font-bold"
                style={{ color: "var(--primary)" }}
              >
                {attendance.filter((u) => u.status === "excused").length}
              </div>
              <div
                className="text-sm"
                style={{ color: "var(--foreground-muted)" }}
              >
                Excused
              </div>
            </div>
          </div>
          <div className="mt-4 text-center">
            <div
              className="text-3xl font-bold"
              style={{ color: "var(--primary)" }}
            >
              {Math.round(
                (attendance.filter((u) => u.status === "present").length /
                  attendance.length) *
                  100
              )}
              %
            </div>
            <div
              className="text-sm"
              style={{ color: "var(--foreground-muted)" }}
            >
              Attendance Rate
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

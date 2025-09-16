"use client";

import React, { useState, useEffect } from "react";
import {
  Class,
  Student,
  ClassAttendance,
  StudentAttendance,
  AttendanceStatus,
} from "@/types";
import { classService } from "@/lib/services/classService";
import { studentService } from "@/lib/services/studentService";
import { attendanceService } from "@/lib/services/attendanceService";
import Table from "../ui/Table";

export default function TeacherAttendance() {
  const [classes, setClasses] = useState<Class[]>([]);
  const [selectedClass, setSelectedClass] = useState<Class | null>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const [attendance, setAttendance] = useState<StudentAttendance[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split("T")[0]
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [existingAttendance, setExistingAttendance] =
    useState<ClassAttendance | null>(null);

  useEffect(() => {
    fetchClasses();
  }, []);

  useEffect(() => {
    if (selectedClass) {
      fetchStudents(selectedClass.id);
      fetchExistingAttendance(selectedClass.id);
    }
  }, [selectedClass]);

  const fetchClasses = async () => {
    try {
      const data = await classService.getClasses();
      setClasses(data);
    } catch (err) {
      console.error("Failed to fetch classes:", err);
    }
  };

  const fetchStudents = async (classId: number) => {
    try {
      setLoading(true);
      const data = await studentService.getStudentsByClass(classId);
      setStudents(data);

      // Initialize attendance for all students
      const initialAttendance: StudentAttendance[] = data.map((student) => ({
        student_id: student.id,
        student_name: student.student_name,
        status: "present" as AttendanceStatus,
      }));
      setAttendance(initialAttendance);
    } catch (err) {
      console.error("Failed to fetch students:", err);
      setError("Failed to fetch students");
    } finally {
      setLoading(false);
    }
  };

  const fetchExistingAttendance = async (classId: number) => {
    try {
      const data = await attendanceService.getAttendanceByClass(classId);
      if (data) {
        setExistingAttendance(data);
        setAttendance(data.students);
      } else {
        setExistingAttendance(null);
      }
    } catch (err) {
      console.error("Failed to fetch existing attendance:", err);
    }
  };

  const handleClassChange = (classId: string) => {
    const selectedClassData = classes.find((c) => c.id.toString() === classId);
    setSelectedClass(selectedClassData || null);
  };

  const handleDateChange = (date: string) => {
    setSelectedDate(date);
  };

  const handleAttendanceChange = (
    studentId: number,
    status: AttendanceStatus
  ) => {
    setAttendance((prev) =>
      prev.map((student) =>
        student.student_id === studentId ? { ...student, status } : student
      )
    );
  };



  const handleBulkAction = (status: AttendanceStatus) => {
    setAttendance((prev) =>
      prev.map((student) => ({
        ...student,
        status,
      }))
    );
  };

  const handleSaveAttendance = async () => {
    if (!selectedClass || attendance.length === 0) return;

    try {
      setLoading(true);
      const attendanceData = {
        class_id: selectedClass.id,
        class_name: selectedClass.class_name,
        date: selectedDate,
        students: attendance,
      };

      if (existingAttendance) {
        await attendanceService.updateClassAttendance(
          existingAttendance.id!,
          attendanceData
        );
      } else {
        await attendanceService.createClassAttendance(attendanceData);
      }

      // Refresh existing attendance
      await fetchExistingAttendance(selectedClass.id);
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

  if (loading && !selectedClass) {
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
        <h2 className="text-2xl font-semibold mb-4" style={{ color: "var(--foreground)" }}>
          Take Attendance
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {/* Class Selection */}
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: "var(--foreground-muted)" }}>
              Select Class
            </label>
            <select
              className="modern-input w-full px-3 py-2"
              value={selectedClass?.id.toString() || ""}
              onChange={(e) => handleClassChange(e.target.value)}
            >
              <option value="">Choose a class...</option>
              {classes.map((cls) => (
                <option key={cls.id} value={cls.id.toString()}>
                  {cls.class_name} (Grade {cls.level_grade})
                </option>
              ))}
            </select>
          </div>

          {/* Date Selection */}
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: "var(--foreground-muted)" }}>
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
              disabled={!selectedClass || loading}
              className="btn-primary w-full px-4 py-2 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading
                ? "Saving..."
                : existingAttendance
                ? "Update Attendance"
                : "Save Attendance"}
            </button>
          </div>
        </div>

        {/* Bulk Actions */}
        {selectedClass && (
          <div className="flex flex-wrap gap-2 mb-4">
            <span className="text-sm font-medium mr-2" style={{ color: "var(--foreground-muted)" }}>
              Quick Actions:
            </span>
            <button
              onClick={() => handleBulkAction("present")}
              className="px-3 py-1 rounded-md text-sm font-medium transition-colors"
              style={{ backgroundColor: "var(--success-light)", color: "var(--success)" }}
            >
              Mark All Present
            </button>
            <button
              onClick={() => handleBulkAction("absent")}
              className="px-3 py-1 rounded-md text-sm font-medium transition-colors"
              style={{ backgroundColor: "var(--danger-light)", color: "var(--danger)" }}
            >
              Mark All Absent
            </button>
            <button
              onClick={() => handleBulkAction("late")}
              className="px-3 py-1 rounded-md text-sm font-medium transition-colors"
              style={{ backgroundColor: "var(--warning-light)", color: "var(--warning)" }}
            >
              Mark All Late
            </button>
          </div>
        )}

        {/* Error Display */}
        {error && (
          <div className="glass-card" style={{ backgroundColor: "var(--danger-light)" }}>
            <div className="text-sm" style={{ color: "var(--danger)" }}>{error}</div>
          </div>
        )}
      </div>

      {/* Attendance Table */}
      {selectedClass && students.length > 0 && (
        <Table
          title={`${selectedClass.class_name} - Attendance for ${new Date(
            selectedDate
          ).toLocaleDateString()}`}
          responsive={true}
          emptyMessage="No students found in this class"
          tableWrapperClassName="glass-card"
          tableHeader={
            <>
              <th className="px-6 py-4 text-left text-sm font-medium uppercase tracking-wider" style={{ color: "var(--foreground)" }}>
                Student Name
              </th>
              <th className="px-6 py-4 text-center text-sm font-medium uppercase tracking-wider" style={{ color: "var(--foreground)" }}>
                Status
              </th>

            </>
          }
          tableContent={
            <>
              {attendance.map((student, index) => (
                <tr
                  key={index}
                  className="theme-table-row"
                >
                  <td className="px-6 py-4 whitespace-nowrap font-medium" style={{ color: "var(--foreground)" }}>
                    {student.student_name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <select
                      value={student.status}
                      onChange={(e) =>
                        handleAttendanceChange(
                          student.student_id,
                          e.target.value as AttendanceStatus
                        )
                      }
                      className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                        student.status
                      )} border-0`}
                      style={{
                        ...getStatusStyle(student.status),
                        color: "white"
                      }}
                    >
                      <option value="present">Present</option>
                      <option value="absent">Absent</option>
                      <option value="late">Late</option>
                      <option value="excused">Excused</option>
                    </select>
                  </td>

                </tr>
              ))}
            </>
          }
        />
      )}

      {/* Attendance Summary */}
      {selectedClass && attendance.length > 0 && (
        <div className="glass-card">
          <h3 className="text-lg font-semibold mb-4" style={{ color: "var(--foreground)" }}>
            Attendance Summary
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold" style={{ color: "var(--foreground)" }}>
                {attendance.length}
              </div>
              <div className="text-sm" style={{ color: "var(--foreground-muted)" }}>Total Students</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold" style={{ color: "var(--success)" }}>
                {attendance.filter((s) => s.status === "present").length}
              </div>
              <div className="text-sm" style={{ color: "var(--foreground-muted)" }}>Present</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold" style={{ color: "var(--danger)" }}>
                {attendance.filter((s) => s.status === "absent").length}
              </div>
              <div className="text-sm" style={{ color: "var(--foreground-muted)" }}>Absent</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold" style={{ color: "var(--warning)" }}>
                {attendance.filter((s) => s.status === "late").length}
              </div>
              <div className="text-sm" style={{ color: "var(--foreground-muted)" }}>Late</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold" style={{ color: "var(--primary)" }}>
                {attendance.filter((s) => s.status === "excused").length}
              </div>
              <div className="text-sm" style={{ color: "var(--foreground-muted)" }}>Excused</div>
            </div>
          </div>
          <div className="mt-4 text-center">
            <div className="text-3xl font-bold" style={{ color: "var(--primary)" }}>
              {Math.round(
                (attendance.filter((s) => s.status === "present").length /
                  attendance.length) *
                  100
              )}
              %
            </div>
            <div className="text-sm" style={{ color: "var(--foreground-muted)" }}>Attendance Rate</div>
          </div>
        </div>
      )}
    </div>
  );
}

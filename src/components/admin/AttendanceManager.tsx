"use client";

import React, { useState, useEffect } from "react";
import {
  Class,
  Student,
  StudentAttendance,
  AttendanceStatus,
  BehaviorType,
  BehaviorCreatePayload,
  Behavior,
} from "@/types";
import { classService } from "@/lib/services/classService";
import { studentService } from "@/lib/services/studentService";
import { attendanceService } from "@/lib/services/attendanceService";
import { behaviorService } from "@/lib/services/behaviorService";
import Table from "../ui/Table";

export default function AttendanceManager() {
  const [classes, setClasses] = useState<Class[]>([]);
  const [selectedClass, setSelectedClass] = useState<Class | null>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const [attendance, setAttendance] = useState<StudentAttendance[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split("T")[0]
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Behavior states
  const [behaviors, setBehaviors] = useState<{
    [studentId: number]: { type: BehaviorType | ""; description: string };
  }>({});

  const behaviorTypes: BehaviorType[] = [
    "Exam Issues",
    "Attendance Problems",
    "Academic Integrity",
    "Behavior Concerns",
    "Social Skills",
    "Work Habits",
    "Practical Skills",
    "Good Behavior",
  ];

  useEffect(() => {
    fetchClasses();
  }, []);

  useEffect(() => {
    if (selectedClass) {
      fetchStudents(selectedClass.id);
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
        student_name: student.student_name, // Now this matches the Student type
        status: "present" as AttendanceStatus,
      }));

      // Initialize behaviors for all students
      const initialBehaviors: {
        [studentId: number]: { type: BehaviorType | ""; description: string };
      } = {};
      data.forEach((student) => {
        initialBehaviors[student.id] = { type: "", description: "" };
      });
      setBehaviors(initialBehaviors);

      console.log("Students data:", data);
      console.log("Initial attendance:", initialAttendance);

      setAttendance(initialAttendance);
    } catch (err) {
      console.error("Failed to fetch students:", err);
      setError("Failed to fetch students");
    } finally {
      setLoading(false);
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

  const handleBehaviorTypeChange = (
    studentId: number,
    type: BehaviorType | ""
  ) => {
    setBehaviors((prev) => ({
      ...prev,
      [studentId]: { ...prev[studentId], type },
    }));
  };

  const handleBehaviorDescriptionChange = (
    studentId: number,
    description: string
  ) => {
    setBehaviors((prev) => ({
      ...prev,
      [studentId]: { ...prev[studentId], description },
    }));
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

      // Prepare attendance data in the format expected by createAttendance
      const attendanceArray = attendance.map((student) => ({
        student_id: student.student_id,
        status: student.status,
      }));

      // Use the new createAttendance method
      await attendanceService.createAttendance(selectedDate, attendanceArray);

      // Create behaviors for students who have behavior data
      const behaviorPromises: Promise<Behavior>[] = [];

      Object.entries(behaviors).forEach(([studentIdStr, behaviorData]) => {
        const studentId = parseInt(studentIdStr);
        if (behaviorData.type && behaviorData.description.trim()) {
          const behaviorPayload: BehaviorCreatePayload = {
            student_id: studentId,
            description: behaviorData.description.trim(),
            type: behaviorData.type,
          };
          behaviorPromises.push(
            behaviorService.createBehavior(behaviorPayload)
          );
        }
      });

      if (behaviorPromises.length > 0) {
        await Promise.all(behaviorPromises);
      }

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
        <h2
          className="text-2xl font-semibold mb-4"
          style={{ color: "var(--foreground)" }}
        >
          Attendance Management
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {/* Class Selection */}
          <div>
            <label
              className="block text-sm font-medium mb-2"
              style={{ color: "var(--foreground-muted)" }}
            >
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
              disabled={!selectedClass || loading}
              className="btn-primary w-full px-4 py-2 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Saving..." : "Save Attendance"}
            </button>
          </div>
        </div>

        {/* Bulk Actions */}
        {selectedClass && (
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
              <th
                className="px-6 py-4 text-left text-sm font-medium uppercase tracking-wider"
                style={{ color: "var(--foreground)" }}
              >
                Student Name
              </th>
              <th
                className="px-6 py-4 text-center text-sm font-medium uppercase tracking-wider"
                style={{ color: "var(--foreground)" }}
              >
                Status
              </th>

              <th
                className="px-6 py-4 text-center text-sm font-medium uppercase tracking-wider"
                style={{ color: "var(--foreground)" }}
              >
                Behavior Type
              </th>
              <th
                className="px-6 py-4 text-center text-sm font-medium uppercase tracking-wider"
                style={{ color: "var(--foreground)" }}
              >
                Behavior Description
              </th>
            </>
          }
          tableContent={
            <>
              {attendance.map((student, index) => {
                console.log("Rendering student:", student);
                return (
                  <tr key={index} className="theme-table-row">
                    <td
                      className="px-6 py-4 whitespace-nowrap font-medium"
                      style={{ color: "var(--foreground)" }}
                    >
                      {student.student_name || "No Name"}
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
                          color: "white",
                        }}
                      >
                        <option value="present">Present</option>
                        <option value="absent">Absent</option>
                        <option value="late">Late</option>
                        <option value="excused">Excused</option>
                      </select>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <select
                        value={behaviors[student.student_id]?.type || ""}
                        onChange={(e) =>
                          handleBehaviorTypeChange(
                            student.student_id,
                            e.target.value as BehaviorType | ""
                          )
                        }
                        className="modern-input w-full px-3 py-1 text-sm"
                      >
                        <option value="">Select behavior type...</option>
                        {behaviorTypes.map((type) => (
                          <option key={type} value={type}>
                            {type}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="text"
                        placeholder="Describe behavior..."
                        value={behaviors[student.student_id]?.description || ""}
                        onChange={(e) =>
                          handleBehaviorDescriptionChange(
                            student.student_id,
                            e.target.value
                          )
                        }
                        className="modern-input w-full px-3 py-1 text-sm"
                      />
                    </td>
                  </tr>
                );
              })}
            </>
          }
        />
      )}

      {/* Attendance Summary */}
      {selectedClass && attendance.length > 0 && (
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
                Total Students
              </div>
            </div>
            <div className="text-center">
              <div
                className="text-2xl font-bold"
                style={{ color: "var(--success)" }}
              >
                {attendance.filter((s) => s.status === "present").length}
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
                {attendance.filter((s) => s.status === "absent").length}
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
                {attendance.filter((s) => s.status === "late").length}
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
                {attendance.filter((s) => s.status === "excused").length}
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
                (attendance.filter((s) => s.status === "present").length /
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

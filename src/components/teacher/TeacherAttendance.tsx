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
        notes: "",
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

  const handleNotesChange = (studentId: number, notes: string) => {
    setAttendance((prev) =>
      prev.map((student) =>
        student.student_id === studentId ? { ...student, notes } : student
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
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">
          Take Attendance
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {/* Class Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Class
            </label>
            <select
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Date
            </label>
            <input
              type="date"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={selectedDate}
              onChange={(e) => handleDateChange(e.target.value)}
            />
          </div>

          {/* Save Button */}
          <div className="flex items-end">
            <button
              onClick={handleSaveAttendance}
              disabled={!selectedClass || loading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg font-medium transition-colors"
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
            <span className="text-sm font-medium text-gray-700 mr-2">
              Quick Actions:
            </span>
            <button
              onClick={() => handleBulkAction("present")}
              className="px-3 py-1 bg-green-100 text-green-800 rounded-md text-sm hover:bg-green-200 transition-colors"
            >
              Mark All Present
            </button>
            <button
              onClick={() => handleBulkAction("absent")}
              className="px-3 py-1 bg-red-100 text-red-800 rounded-md text-sm hover:bg-red-200 transition-colors"
            >
              Mark All Absent
            </button>
            <button
              onClick={() => handleBulkAction("late")}
              className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-md text-sm hover:bg-yellow-200 transition-colors"
            >
              Mark All Late
            </button>
          </div>
        )}

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="text-sm text-red-700">{error}</div>
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
          tableWrapperClassName="bg-white shadow-lg"
          tableHeader={
            <>
              <th className="px-6 py-4 text-left text-sm font-medium text-black uppercase tracking-wider">
                Student Name
              </th>
              <th className="px-6 py-4 text-center text-sm font-medium text-black uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-4 text-center text-sm font-medium text-black uppercase tracking-wider">
                Notes
              </th>
            </>
          }
          tableContent={
            <>
              {attendance.map((student, index) => (
                <tr
                  key={index}
                  className="hover:bg-gray-50 transition duration-150 ease-in-out"
                >
                  <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
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
                      )} border-0 focus:ring-2 focus:ring-blue-500`}
                    >
                      <option value="present">Present</option>
                      <option value="absent">Absent</option>
                      <option value="late">Late</option>
                      <option value="excused">Excused</option>
                    </select>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="text"
                      placeholder="Add notes..."
                      value={student.notes || ""}
                      onChange={(e) =>
                        handleNotesChange(student.student_id, e.target.value)
                      }
                      className="w-full px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </td>
                </tr>
              ))}
            </>
          }
        />
      )}

      {/* Attendance Summary */}
      {selectedClass && attendance.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Attendance Summary
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">
                {attendance.length}
              </div>
              <div className="text-sm text-gray-600">Total Students</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {attendance.filter((s) => s.status === "present").length}
              </div>
              <div className="text-sm text-gray-600">Present</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">
                {attendance.filter((s) => s.status === "absent").length}
              </div>
              <div className="text-sm text-gray-600">Absent</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">
                {attendance.filter((s) => s.status === "late").length}
              </div>
              <div className="text-sm text-gray-600">Late</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {attendance.filter((s) => s.status === "excused").length}
              </div>
              <div className="text-sm text-gray-600">Excused</div>
            </div>
          </div>
          <div className="mt-4 text-center">
            <div className="text-3xl font-bold text-blue-600">
              {Math.round(
                (attendance.filter((s) => s.status === "present").length /
                  attendance.length) *
                  100
              )}
              %
            </div>
            <div className="text-sm text-gray-600">Attendance Rate</div>
          </div>
        </div>
      )}
    </div>
  );
}

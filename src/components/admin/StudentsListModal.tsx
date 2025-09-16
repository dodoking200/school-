import { useState, useEffect, useCallback } from "react";
import { Student } from "@/types";
import { studentService } from "@/lib/services/studentService";
import {
  attendanceService,
  AttendanceRecord,
} from "@/lib/services/attendanceService";
import { toast } from "react-toastify";

interface StudentsListModalProps {
  isOpen: boolean;
  onClose: () => void;
  classData: {
    id: number;
    class_name: string;
    level_grade: number;
  };
}

export default function StudentsListModal({
  isOpen,
  onClose,
  classData,
}: StudentsListModalProps) {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [studentAttendance, setStudentAttendance] = useState<
    AttendanceRecord[]
  >([]);
  const [attendanceLoading, setAttendanceLoading] = useState<boolean>(false);

  const fetchStudentsByClass = useCallback(async () => {
    try {
      setLoading(true);
      const data = await studentService.getStudentsByClass(classData.id);
      setStudents(data);
    } catch (error) {
      console.error("Failed to fetch students", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to fetch students"
      );
    } finally {
      setLoading(false);
    }
  }, [classData.id]);

  const fetchStudentAttendance = useCallback(async (studentId: number) => {
    try {
      setAttendanceLoading(true);
      const data = await attendanceService.getAttendanceByStudentId(studentId);
      setStudentAttendance(data);
    } catch (error) {
      console.error("Failed to fetch attendance", error);
      toast.error("Failed to fetch attendance data");
    } finally {
      setAttendanceLoading(false);
    }
  }, []);

  const handleStudentClick = (student: Student) => {
    setSelectedStudent(student);
    fetchStudentAttendance(student.id);
  };

  const calculateAttendanceStats = (attendance: AttendanceRecord[]) => {
    const stats = {
      present: 0,
      absent: 0,
      late: 0,
      excused: 0,
      total: attendance.length,
    };

    attendance.forEach((record) => {
      switch (record.status) {
        case "present":
          stats.present++;
          break;
        case "absent":
          stats.absent++;
          break;
        case "late":
          stats.late++;
          break;
        case "excused":
          stats.excused++;
          break;
      }
    });

    return stats;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "present":
        return "text-green-600 bg-green-100";
      case "absent":
        return "text-red-600 bg-red-100";
      case "late":
        return "text-yellow-600 bg-yellow-100";
      case "excused":
        return "text-blue-600 bg-blue-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  useEffect(() => {
    if (isOpen && classData.id) {
      fetchStudentsByClass();
    }
  }, [isOpen, classData.id, fetchStudentsByClass]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-6xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            Students in {classData.class_name} (Grade {classData.level_grade})
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
          >
            ×
          </button>
        </div>

        {loading ? (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            <p className="mt-2 text-gray-600">Loading students...</p>
          </div>
        ) : students.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500 text-lg">
              No students found in this class.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Students List */}
            <div className="lg:col-span-1">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Students List
              </h3>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {students.map((student) => (
                  <div
                    key={student.id}
                    onClick={() => handleStudentClick(student)}
                    className={`p-3 rounded-lg border cursor-pointer transition-all hover:shadow-md ${
                      selectedStudent?.id === student.id
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className="font-medium text-gray-900">
                      {student.student_name}
                    </div>
                    <div className="text-sm text-gray-500">{student.email}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Student Details and Attendance */}
            <div className="lg:col-span-2">
              {selectedStudent ? (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Student Information
                  </h3>

                  {/* Student Basic Info */}
                  <div className="bg-gray-50 rounded-lg p-4 mb-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-gray-500">
                          Name
                        </label>
                        <p className="text-gray-900">
                          {selectedStudent.student_name}
                        </p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">
                          Email
                        </label>
                        <p className="text-gray-900">{selectedStudent.email}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">
                          Phone
                        </label>
                        <p className="text-gray-900">{selectedStudent.phone}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">
                          Birth Date
                        </label>
                        <p className="text-gray-900">
                          {new Date(
                            selectedStudent.birth_date
                          ).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Attendance Statistics */}
                  <div className="mb-6">
                    <h4 className="text-md font-semibold text-gray-900 mb-3">
                      Attendance Overview
                    </h4>
                    {attendanceLoading ? (
                      <div className="text-center py-4">
                        <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900"></div>
                        <p className="mt-2 text-gray-600">
                          Loading attendance...
                        </p>
                      </div>
                    ) : studentAttendance.length > 0 ? (
                      <div>
                        <div className="grid grid-cols-4 gap-4 mb-4">
                          {(() => {
                            const stats =
                              calculateAttendanceStats(studentAttendance);
                            return (
                              <>
                                <div className="text-center p-3 bg-green-50 rounded-lg">
                                  <div className="text-2xl font-bold text-green-600">
                                    {stats.present}
                                  </div>
                                  <div className="text-sm text-green-600">
                                    Present
                                  </div>
                                </div>
                                <div className="text-center p-3 bg-red-50 rounded-lg">
                                  <div className="text-2xl font-bold text-red-600">
                                    {stats.absent}
                                  </div>
                                  <div className="text-sm text-red-600">
                                    Absent
                                  </div>
                                </div>
                                <div className="text-center p-3 bg-yellow-50 rounded-lg">
                                  <div className="text-2xl font-bold text-yellow-600">
                                    {stats.late}
                                  </div>
                                  <div className="text-sm text-yellow-600">
                                    Late
                                  </div>
                                </div>
                                <div className="text-center p-3 bg-blue-50 rounded-lg">
                                  <div className="text-2xl font-bold text-blue-600">
                                    {stats.excused}
                                  </div>
                                  <div className="text-sm text-blue-600">
                                    Excused
                                  </div>
                                </div>
                              </>
                            );
                          })()}
                        </div>

                        {/* Recent Attendance Records */}
                        <div>
                          <h5 className="text-sm font-medium text-gray-700 mb-2">
                            Recent Attendance Records
                          </h5>
                          <div className="max-h-48 overflow-y-auto">
                            {studentAttendance.map((record) => (
                              <div
                                key={record.id}
                                className="flex items-center justify-between py-2 border-b border-gray-100"
                              >
                                <span className="text-sm text-gray-600">
                                  {new Date(record.date).toLocaleDateString()}
                                </span>
                                <span
                                  className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                                    record.status
                                  )}`}
                                >
                                  {record.status.charAt(0).toUpperCase() +
                                    record.status.slice(1)}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-4 text-gray-500">
                        No attendance records found for this student.
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  Select a student to view details and attendance information.
                </div>
              )}
            </div>
          </div>
        )}

        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="bg-gray-500 hover:bg-gray-700 text-white px-4 py-2 rounded-md"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

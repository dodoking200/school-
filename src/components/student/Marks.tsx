"use client";

import React, { useState, useEffect } from "react";
import Table from "../ui/Table";
import { SemesterMarks, SubjectMarks } from "@/types";
import { studentService } from "@/lib/services/studentService";

export default function Marks() {
  const [semester, setSemester] = useState<string>("1");
  const [marks, setMarks] = useState<SemesterMarks[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedSubject, setExpandedSubject] = useState<number | null>(null);

  useEffect(() => {
    const fetchMarks = async () => {
      try {
        setLoading(true);
        const data = await studentService.getStudentMarks();
        setMarks(data);
        setError(null);
        console.log("Fetched marks data:", data);
      } catch (err) {
        setError("Failed to fetch marks");
        console.error("Error fetching marks:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMarks();
  }, []);

  // Get unique grade types across all subjects
  const getGradeTypes = (): string[] => {
    const types = new Set<string>();
    marks.forEach((semester) => {
      semester.subjects.forEach((subject) => {
        subject.grade_types.forEach((gradeType) => {
          types.add(gradeType.type);
        });
      });
    });
    return Array.from(types);
  };

  // Get current semester data
  const currentSemester = marks.find(
    (s) => s.semester_id.toString() === semester
  );

  // Get subjects for current semester
  const currentSubjects = currentSemester?.subjects || [];

  // Get grade types for current semester
  const gradeTypes = getGradeTypes();

  // Get score for a specific subject and grade type
  const getScore = (subject: SubjectMarks, gradeType: string): string => {
    const gradeTypeData = subject.grade_types.find(
      (gt) => gt.type === gradeType
    );
    if (!gradeTypeData || gradeTypeData.assignments.length === 0) {
      return "-";
    }

    // Show average score for the grade type with proper formatting
    return gradeTypeData.typeAverage?.toFixed(2) || "0.00";
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
        <div className="flex">
          <div className="flex-shrink-0">
            <svg
              className="h-5 w-5 text-red-400"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">Error</h3>
            <div className="mt-2 text-sm text-red-700">{error}</div>
          </div>
        </div>
      </div>
    );
  }

  if (marks.length === 0) {
    return (
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
              No Marks Available
            </h3>
            <div className="text-sm text-yellow-700">
              No marks have been recorded yet.
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Semester Selection */}
      <div className="glass-card">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold" style={{ color: "var(--foreground)" }}>
            Academic Performance
          </h2>
          <select
            name="semester"
            className="modern-input px-3 py-2 text-sm"
            style={{ background: "var(--card-bg)", color: "var(--foreground)" }}
            value={semester}
            onChange={(e) => setSemester(e.target.value)}
          >
            {marks.map((sem) => (
              <option key={sem.semester_id} value={sem.semester_id.toString()}>
                {sem.semester_name}
              </option>
            ))}
          </select>
        </div>

        {/* Semester Summary */}
        {currentSemester && (
          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="glass-card !p-3" style={{ backgroundColor: "var(--primary-light)" }}>
              <div className="text-sm font-medium" style={{ color: "var(--primary)" }}>
                Semester Average
              </div>
              <div className="text-2xl font-bold" style={{ color: "var(--primary)" }}>
                {currentSemester.semesterAverage?.toFixed(2) || "0.00"}%
              </div>
            </div>
            <div className="glass-card !p-3" style={{ backgroundColor: "var(--accent-light)" }}>
              <div className="text-sm font-medium" style={{ color: "var(--accent)" }}>
                Total Assignments
              </div>
              <div className="text-2xl font-bold" style={{ color: "var(--accent)" }}>
                {currentSemester.totalSemesterAssignments || 0}
              </div>
            </div>
            <div className="glass-card !p-3" style={{ backgroundColor: "var(--secondary-light)" }}>
              <div className="text-sm font-medium" style={{ color: "var(--secondary)" }}>
                Total Score
              </div>
              <div className="text-2xl font-bold" style={{ color: "var(--secondary)" }}>
                {currentSemester.totalSemesterScore?.toFixed(2) || "0.00"}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Marks Table */}
      <Table
        title={`${currentSemester?.semester_name || "Semester"} Marks`}
        responsive={true}
        emptyMessage="No marks available for this semester"
        tableWrapperClassName="bg-white shadow-lg"
        tableHeader={
          <>
            <th
              scope="col"
              className="px-6 py-4 w-[25%] text-center text-sm text-black font-bold uppercase tracking-wider"
            >
              Subject
            </th>
            {gradeTypes.map((type) => (
              <th
                key={type}
                scope="col"
                className="px-6 py-4 text-center text-sm font-medium text-black uppercase tracking-wider"
              >
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </th>
            ))}
            <th
              scope="col"
              className="px-6 py-4 text-center text-sm text-black font-bold uppercase tracking-wider"
            >
              Average
            </th>
            <th
              scope="col"
              className="px-6 py-4 text-center text-sm text-black font-bold uppercase tracking-wider"
            >
              Total
            </th>
          </>
        }
        tableContent={
          <>
            {currentSubjects.map((subject) => (
              <React.Fragment key={subject.subject_id}>
                <tr
                  className="theme-table-row cursor-pointer hover:bg-gray-50"
                  onClick={() => setExpandedSubject(
                    expandedSubject === subject.subject_id ? null : subject.subject_id
                  )}
                >
                  <td className="px-6 py-4 whitespace-nowrap font-medium" style={{ color: "var(--foreground)" }}>
                    <div className="flex items-center">
                      <span className="mr-2">
                        {expandedSubject === subject.subject_id ? '▼' : '▶'}
                      </span>
                      {subject.subject_name}
                    </div>
                  </td>
                  {gradeTypes.map((gradeType) => (
                    <td
                      key={gradeType}
                      className="px-6 py-4 whitespace-nowrap text-center" 
                      style={{ color: "var(--foreground-muted)" }}
                    >
                      {getScore(subject, gradeType)}
                    </td>
                  ))}
                  <td className="px-6 py-4 whitespace-nowrap text-center font-medium" style={{ color: "var(--primary)" }}>
                    {subject.subjectAverage?.toFixed(2) || "0.00"}%
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center font-medium" style={{ color: "var(--accent)" }}>
                    {subject.totalScore?.toFixed(2) || "0.00"}
                  </td>
                </tr>
                
                {/* Expanded Details Row */}
                {expandedSubject === subject.subject_id && (
                  <tr className="bg-gray-50">
                    <td colSpan={gradeTypes.length + 3} className="px-6 py-4">
                      <div className="space-y-4">
                        {subject.grade_types.map((gradeType) => (
                          <div key={gradeType.type} className="border rounded-lg p-4 bg-white">
                            <h4 className="font-semibold text-lg mb-3 capitalize" style={{ color: "var(--primary)" }}>
                              {gradeType.type} (Average: {gradeType.typeAverage?.toFixed(2) || "0.00"}) - Total Assignments: {gradeType.assignment_count || 0}
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                              {gradeType.assignments.map((assignment, idx) => (
                                <div key={idx} className="border rounded p-3 bg-gray-50">
                                  <div className="text-sm font-medium">Assignment {idx + 1}</div>
                                  <div className="text-lg font-bold" style={{ color: "var(--primary)" }}>
                                    {assignment.score?.toFixed(2) || "0.00"} / {assignment.max_score?.toFixed(2) || "0.00"}
                                  </div>
                                  <div className="text-sm" style={{ color: "var(--foreground-muted)" }}>
                                    {assignment.percentage?.toFixed(2) || "0.00"}%
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </>
        }
      />
    </div>
  );
}

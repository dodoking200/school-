import React, { useState, useEffect } from "react";
import { teacherService } from "@/lib/services/teacherService";
import { subjectService } from "@/lib/services/subjectService";
import { semesterService } from "@/lib/services/semesterService";

interface MarkInputModalProps {
  isOpen: boolean;
  onClose: () => void;
  studentName: string;
  studentId: number;
  onSubmit: (success: boolean) => void;
}

interface Subject {
  id: number;
  name: string;
}

interface Semester {
  id: number;
  semester_name: string;
}

export default function MarkInputModal({
  isOpen,
  onClose,
  studentName,
  studentId,
  onSubmit,
}: MarkInputModalProps) {
  const [mark, setMark] = useState<number>(0);
  const [maxScore, setMaxScore] = useState<number>(100);
  const [type, setType] = useState<string>("exam");
  const [subjectId, setSubjectId] = useState<number>(0);
  const [semesterId, setSemesterId] = useState<number>(0);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [semesters, setSemesters] = useState<Semester[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      fetchSubjectsAndSemesters();
    }
  }, [isOpen]);

  const fetchSubjectsAndSemesters = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch subjects and semesters
      const [subjectsData, semestersData] = await Promise.all([
        subjectService.getSubjects(),
        semesterService.getSemesters(),
      ]);

      setSubjects(subjectsData);
      setSemesters(semestersData);

      // Set default values
      if (subjectsData.length > 0) setSubjectId(subjectsData[0].id);
      if (semestersData.length > 0) setSemesterId(semestersData[0].id);
    } catch (err) {
      console.error("Failed to fetch subjects/semesters:", err);
      setError("Failed to load subjects and semesters");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!subjectId || !semesterId) {
      setError("Please select both subject and semester");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      await teacherService.inputMarks({
        student_id: studentId,
        subject_id: subjectId,
        semester_id: semesterId,
        min_score: 0,
        max_score: maxScore,
        grade: mark,
        type: type as "worksheet" | "exam" | "quiz" | "assignment",
      });

      onSubmit(true);
      onClose();
    } catch (err) {
      console.error("Failed to submit marks:", err);
      setError("Failed to submit marks. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            Input Mark for {studentName}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
            disabled={loading}
          >
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="subject"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Subject
            </label>
            <select
              id="subject"
              value={subjectId}
              onChange={(e) => setSubjectId(Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
              required
              disabled={loading}
            >
              <option value="">Select Subject</option>
              {subjects.map((subject) => (
                <option key={subject.id} value={subject.id}>
                  {subject.name}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label
              htmlFor="semester"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Semester
            </label>
            <select
              id="semester"
              value={semesterId}
              onChange={(e) => setSemesterId(Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
              required
              disabled={loading}
            >
              <option value="">Select Semester</option>
              {semesters.map((semester) => (
                <option key={semester.id} value={semester.id}>
                  {semester.semester_name}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label
              htmlFor="type"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Assessment Type
            </label>
            <select
              id="type"
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
              disabled={loading}
            >
              <option value="exam">Exam</option>
              <option value="quiz">Quiz</option>
              <option value="assignment">Assignment</option>
              <option value="worksheet">Worksheet</option>
            </select>
          </div>

          <div className="mb-4">
            <label
              htmlFor="maxScore"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Maximum Score
            </label>
            <input
              type="number"
              id="maxScore"
              min="1"
              max="1000"
              value={maxScore}
              onChange={(e) => setMaxScore(Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
              required
              disabled={loading}
            />
          </div>

          <div className="mb-6">
            <label
              htmlFor="mark"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Student Score
            </label>
            <input
              type="number"
              id="mark"
              min="0"
              max={maxScore}
              value={mark}
              onChange={(e) => setMark(Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
              required
              disabled={loading}
            />
            <p className="text-xs text-gray-500 mt-1">
              Score out of {maxScore}
            </p>
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-[var(--primary)] border border-transparent rounded-md text-sm font-medium text-white hover:bg-[var(--primary-hover)] disabled:opacity-50"
              disabled={loading}
            >
              {loading ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

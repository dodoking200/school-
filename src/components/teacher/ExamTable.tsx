"use client";
import React, { useState, useEffect } from "react";
import { Exam } from "@/types";
import { apiClient } from "@/lib/apiClient";

export default function ExamTable() {
  const [exams, setExams] = useState<Exam[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchExams();
  }, []);

  const fetchExams = async () => {
    try {
      setLoading(true);
      const response = await apiClient<Exam[]>("/exams/exams");

      if (response.success && response.data) {
        setExams(response.data);
      } else {
        setError("Failed to fetch exams");
      }
    } catch (err) {
      setError("An error occurred while fetching exams");
      console.error("Error fetching exams:", err);
    } finally {
      setLoading(false);
    }
  };

  const formatDateTime = (dateTimeString: string) => {
    try {
      const date = new Date(dateTimeString);
      return date.toLocaleString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return "Invalid date";
    }
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="glass-card">
        <div className="text-center py-8">
          <p className="text-red-500 mb-4">{error}</p>
          <button
            onClick={fetchExams}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (exams.length === 0) {
    return (
      <div className="glass-card">
        <div className="text-center py-8">
          <p className="text-foreground-muted">No exams found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="glass-card">
      <div className="flex justify-between items-center mb-6">
        <h2
          className="text-2xl font-semibold"
          style={{ color: "var(--foreground)" }}
        >
          Exams
        </h2>
        <button
          onClick={fetchExams}
          className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
        >
          Refresh
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-border">
              <th
                className="text-left py-3 px-4 font-semibold"
                style={{ color: "var(--foreground)" }}
              >
                ID
              </th>
              <th
                className="text-left py-3 px-4 font-semibold"
                style={{ color: "var(--foreground)" }}
              >
                Title
              </th>
              <th
                className="text-left py-3 px-4 font-semibold"
                style={{ color: "var(--foreground)" }}
              >
                Type
              </th>
              <th
                className="text-left py-3 px-4 font-semibold"
                style={{ color: "var(--foreground)" }}
              >
                Duration
              </th>
              <th
                className="text-left py-3 px-4 font-semibold"
                style={{ color: "var(--foreground)" }}
              >
                Total Marks
              </th>
              <th
                className="text-left py-3 px-4 font-semibold"
                style={{ color: "var(--foreground)" }}
              >
                Passing Marks
              </th>
              <th
                className="text-left py-3 px-4 font-semibold"
                style={{ color: "var(--foreground)" }}
              >
                Start Date
              </th>
              <th
                className="text-left py-3 px-4 font-semibold"
                style={{ color: "var(--foreground)" }}
              >
                End Date
              </th>
              <th
                className="text-left py-3 px-4 font-semibold"
                style={{ color: "var(--foreground)" }}
              >
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {exams.map((exam) => (
              <tr
                key={exam.id}
                className="border-b border-border hover:bg-accent-light transition-colors"
              >
                <td
                  className="py-3 px-4 text-sm font-mono"
                  style={{ color: "var(--foreground)" }}
                >
                  #{exam.id}
                </td>
                <td className="py-3 px-4">
                  <div>
                    <div
                      className="font-medium"
                      style={{ color: "var(--foreground)" }}
                    >
                      {exam.title}
                    </div>
                    <div className="text-sm text-foreground-muted mt-1">
                      {exam.description}
                    </div>
                  </div>
                </td>
                <td className="py-3 px-4">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {exam.exam_type}
                  </span>
                </td>
                <td
                  className="py-3 px-4 text-sm"
                  style={{ color: "var(--foreground)" }}
                >
                  {formatDuration(exam.time_limit)}
                </td>
                <td
                  className="py-3 px-4 text-sm"
                  style={{ color: "var(--foreground)" }}
                >
                  {exam.total_mark}
                </td>
                <td
                  className="py-3 px-4 text-sm"
                  style={{ color: "var(--foreground)" }}
                >
                  {exam.passing_mark}
                </td>
                <td
                  className="py-3 px-4 text-sm"
                  style={{ color: "var(--foreground)" }}
                >
                  {formatDateTime(exam.start_datetime)}
                </td>
                <td
                  className="py-3 px-4 text-sm"
                  style={{ color: "var(--foreground)" }}
                >
                  {formatDateTime(exam.end_datetime)}
                </td>
                <td className="py-3 px-4">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      exam.announced
                        ? "bg-green-100 text-green-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {exam.announced ? "Announced" : "Draft"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 text-sm text-foreground-muted">
        Total: {exams.length} exam{exams.length !== 1 ? "s" : ""}
      </div>
    </div>
  );
}

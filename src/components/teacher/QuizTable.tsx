"use client";
import React, { useState, useEffect } from "react";
import { Exam } from "@/types"; // Reusing Exam type since quiz structure is identical
import { apiClient } from "@/lib/apiClient";

export default function QuizTable() {
  const [quizzes, setQuizzes] = useState<Exam[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchQuizzes();
  }, []);

  const fetchQuizzes = async () => {
    try {
      setLoading(true);
      const response = await apiClient<Exam[]>("/exams/quizzes");

      if (response.success && response.data) {
        setQuizzes(response.data);
      } else {
        setError("Failed to fetch quizzes");
      }
    } catch (err) {
      setError("An error occurred while fetching quizzes");
      console.error("Error fetching quizzes:", err);
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
            onClick={fetchQuizzes}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (quizzes.length === 0) {
    return (
      <div className="glass-card">
        <div className="text-center py-8">
          <p className="text-foreground-muted">No quizzes found.</p>
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
          Quizzes
        </h2>
        <button
          onClick={fetchQuizzes}
          className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
        >
          Refresh
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-200">
                ID
              </th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-200">
                Title
              </th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-200">
                Type
              </th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-200">
                Duration
              </th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-200">
                Total Marks
              </th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-200">
                Passing Marks
              </th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-200">
                Start Date
              </th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-200">
                End Date
              </th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-200">
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {quizzes.map((quiz) => (
              <tr
                key={quiz.id}
                className="border-b border-border hover:bg-accent-light transition-colors"
              >
                <td
                  className="py-3 px-4 text-sm font-mono"
                  style={{ color: "var(--foreground)" }}
                >
                  #{quiz.id}
                </td>
                <td className="py-3 px-4">
                  <div>
                    <div
                      className="font-medium"
                      style={{ color: "var(--foreground)" }}
                    >
                      {quiz.title}
                    </div>
                    <div className="text-sm text-foreground-muted mt-1">
                      {quiz.description}
                    </div>
                  </div>
                </td>
                <td className="py-3 px-4">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                    {quiz.exam_type}
                  </span>
                </td>
                <td
                  className="py-3 px-4 text-sm"
                  style={{ color: "var(--foreground)" }}
                >
                  {formatDuration(quiz.time_limit)}
                </td>
                <td
                  className="py-3 px-4 text-sm"
                  style={{ color: "var(--foreground)" }}
                >
                  {quiz.total_mark}
                </td>
                <td
                  className="py-3 px-4 text-sm"
                  style={{ color: "var(--foreground)" }}
                >
                  {quiz.passing_mark}
                </td>
                <td
                  className="py-3 px-4 text-sm"
                  style={{ color: "var(--foreground)" }}
                >
                  {formatDateTime(quiz.start_datetime)}
                </td>
                <td
                  className="py-3 px-4 text-sm"
                  style={{ color: "var(--foreground)" }}
                >
                  {formatDateTime(quiz.end_datetime)}
                </td>
                <td className="py-3 px-4">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      quiz.announced
                        ? "bg-green-100 text-green-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {quiz.announced ? "Announced" : "Draft"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 text-sm text-foreground-muted">
        Total: {quizzes.length} quiz{quizzes.length !== 1 ? "zes" : ""}
      </div>
    </div>
  );
}

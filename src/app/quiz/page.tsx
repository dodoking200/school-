"use client";
import Header from "@/components/layout/Header";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { quizApi } from "@/lib/apiClient";

export default function QuizLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [quizId, setQuizId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || !quizId) {
      setError("All fields are required");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await quizApi.authenticateQuizAccess({
        email,
        password,
        quizId
      });

      if (response.success && response.data) {
        // Store quiz session data
        sessionStorage.setItem(
          "quizSession",
          JSON.stringify({
            email,
            quizId,
            quiz: response.data.quiz,
            student: response.data.student
          })
        );
        router.push(`/quiz/${quizId}`);
      } else {
        setError("Authentication failed");
      }
    } catch (error) {
      console.error("Quiz authentication error:", error);
      setError(error instanceof Error ? error.message : "Failed to authenticate. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "var(--background)" }}>
      <Header />
      <main className="flex-grow flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 py-12 relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-1/2 -right-1/2 w-full h-full bg-gradient-to-br from-primary/5 to-transparent rounded-full" />
          <div className="absolute -bottom-1/2 -left-1/2 w-full h-full bg-gradient-to-tr from-secondary/5 to-transparent rounded-full" />
        </div>

        <div className="relative z-10 w-full max-w-md">
          <div className="glass-card !p-8">
            {/* Quiz Icon */}
            <div className="text-center mb-8">
              <div 
                className="w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center"
                style={{ background: "var(--gradient-primary)" }}
              >
                <span className="text-3xl">🧠</span>
              </div>
              <h2 className="text-3xl font-bold mb-2" style={{ color: "var(--foreground)" }}>
                Join Quiz
              </h2>
              <p className="text-sm" style={{ color: "var(--foreground-muted)" }}>
                Enter your credentials to access the quiz
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}
              
              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-semibold mb-2"
                    style={{ color: "var(--foreground)" }}
                  >
                    📧 Email Address
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setError("");
                    }}
                    className="modern-input w-full"
                    placeholder="student@school.edu"
                    disabled={loading}
                  />
                </div>
                
                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm font-semibold mb-2"
                    style={{ color: "var(--foreground)" }}
                  >
                    🔒 Password
                  </label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setError("");
                    }}
                    className="modern-input w-full"
                    placeholder="Enter your password"
                    disabled={loading}
                  />
                </div>
                
                <div>
                  <label
                    htmlFor="quizId"
                    className="block text-sm font-semibold mb-2"
                    style={{ color: "var(--foreground)" }}
                  >
                    🆔 Quiz ID
                  </label>
                  <input
                    id="quizId"
                    name="quizId"
                    type="text"
                    required
                    value={quizId}
                    onChange={(e) => {
                      setQuizId(e.target.value);
                      setError("");
                    }}
                    className="modern-input w-full"
                    placeholder="Enter quiz identifier"
                    disabled={loading}
                  />
                </div>
              </div>
              
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary w-full py-3 px-6 text-base font-semibold transition-all duration-300 hover:transform hover:translateY(-1px) hover:shadow-xl flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      <span>Authenticating...</span>
                    </>
                  ) : (
                    <>
                      <span>🚀</span>
                      <span>Start Quiz</span>
                    </>
                  )}
                </button>
              </div>
            </form>
            
            {/* Footer */}
            <div className="mt-8 pt-6 border-t" style={{ borderColor: "var(--card-border)" }}>
              <p className="text-xs text-center" style={{ color: "var(--foreground-muted)" }}>
                💡 Make sure you have a stable internet connection
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

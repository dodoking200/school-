"use client";
import Header from "@/components/layout/Header";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

export default function QuizLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [quizId, setQuizId] = useState("");
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && password && quizId) {
      sessionStorage.setItem(
        "quizCredentials",
        JSON.stringify({ email, password })
      );
      router.push(`/quiz/${quizId}`);
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
                    onChange={(e) => setEmail(e.target.value)}
                    className="modern-input w-full"
                    placeholder="student@school.edu"
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
                    onChange={(e) => setPassword(e.target.value)}
                    className="modern-input w-full"
                    placeholder="Enter your password"
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
                    onChange={(e) => setQuizId(e.target.value)}
                    className="modern-input w-full"
                    placeholder="Enter quiz identifier"
                  />
                </div>
              </div>
              
              <div className="pt-4">
                <button
                  type="submit"
                  className="btn-primary w-full py-3 px-6 text-base font-semibold transition-all duration-300 hover:transform hover:translateY(-1px) hover:shadow-xl flex items-center justify-center space-x-2"
                >
                  <span>🚀</span>
                  <span>Start Quiz</span>
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

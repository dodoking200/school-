"use client";
import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { dummyQuiz } from "@/lib/dummy-data";
import Header from "@/components/layout/Header";
import Timer from "@/components/quiz/Timer";
import Question from "@/components/quiz/Question";

export default function QuizPage() {
  const params = useParams();
  const router = useRouter();
  const quizId = params.quizId;

  const [credentials, setCredentials] = useState<{
    email: string;
    password: string;
  } | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<{ [key: number]: string }>({});

  useEffect(() => {
    const storedCredentials = sessionStorage.getItem("quizCredentials");
    if (storedCredentials) {
      setCredentials(JSON.parse(storedCredentials));
    } else {
      router.push("/quiz");
    }
  }, [router]);

  const submitQuiz = useCallback(() => {
    // In a real app, you'd send the answers to the server.
    // For now, we'll just log them.
    console.log("Quiz submitted!", { ...credentials, quizId, answers });
    alert("Quiz submitted! Check the console for your answers.");
    sessionStorage.removeItem("quizCredentials");
    router.push("/");
  }, [credentials, quizId, answers, router]);

  const handleAnswerSelect = (questionId: number, optionId: string) => {
    setAnswers((prevAnswers) => ({
      ...prevAnswers,
      [questionId]: optionId,
    }));
  };

  const handleNext = () => {
    if (currentQuestionIndex < dummyQuiz.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  if (!credentials) {
    return (
      <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  const currentQuestion = dummyQuiz.questions[currentQuestionIndex];

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "var(--background)" }}>
      <Header />
      <main className="flex-grow flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 py-12 relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-1/4 w-64 h-64 bg-gradient-to-br from-primary/10 to-transparent rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-gradient-to-tl from-secondary/10 to-transparent rounded-full blur-3xl" />
        </div>

        <div className="relative z-10 w-full max-w-4xl">
          {/* Quiz Header */}
          <div className="glass-card !p-6 mb-8">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              <div className="flex items-center space-x-4">
                <div 
                  className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: "var(--gradient-primary)" }}
                >
                  <span className="text-2xl">🧠</span>
                </div>
                <div>
                  <h2 className="text-2xl font-bold" style={{ color: "var(--foreground)" }}>
                    {dummyQuiz.title}
                  </h2>
                  <p className="text-sm" style={{ color: "var(--foreground-muted)" }}>
                    Question {currentQuestionIndex + 1} of {dummyQuiz.questions.length}
                  </p>
                </div>
              </div>
              <div className="lg:flex-shrink-0">
                <Timer initialTime={10 * 60} onTimeUp={submitQuiz} />
              </div>
            </div>
            
            {/* Progress Bar */}
            <div className="mt-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium" style={{ color: "var(--foreground-muted)" }}>
                  Progress
                </span>
                <span className="text-sm font-bold" style={{ color: "var(--primary)" }}>
                  {Math.round(((currentQuestionIndex + 1) / dummyQuiz.questions.length) * 100)}%
                </span>
              </div>
              <div className="w-full h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div
                  className="h-full transition-all duration-500 ease-out rounded-full"
                  style={{
                    background: "var(--gradient-primary)",
                    width: `${((currentQuestionIndex + 1) / dummyQuiz.questions.length) * 100}%`,
                  }}
                />
              </div>
            </div>
          </div>

          {/* Question Content */}
          <div className="glass-card !p-8 mb-8">
            <Question
              question={currentQuestion}
              selectedAnswer={answers[currentQuestion.id]}
              onAnswerSelect={handleAnswerSelect}
            />
          </div>

          {/* Navigation */}
          <div className="glass-card !p-6">
            <div className="flex flex-col sm:flex-row justify-between gap-4">
              <button
                onClick={handlePrevious}
                disabled={currentQuestionIndex === 0}
                className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center space-x-2 ${
                  currentQuestionIndex === 0 
                    ? 'opacity-50 cursor-not-allowed' 
                    : 'hover:transform hover:translateY(-1px) hover:shadow-lg'
                }`}
                style={{
                  background: currentQuestionIndex === 0 ? "var(--background-muted)" : "var(--card-bg)",
                  color: currentQuestionIndex === 0 ? "var(--foreground-muted)" : "var(--foreground)",
                  border: `2px solid ${currentQuestionIndex === 0 ? "var(--background-muted)" : "var(--card-border)"}`,
                }}
              >
                <span>←</span>
                <span>Previous</span>
              </button>
              
              <div className="flex items-center space-x-2">
                {dummyQuiz.questions.map((_, index) => (
                  <div
                    key={index}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${
                      index === currentQuestionIndex
                        ? 'scale-125'
                        : index < currentQuestionIndex
                        ? ''
                        : 'opacity-50'
                    }`}
                    style={{
                      background: index <= currentQuestionIndex 
                        ? "var(--primary)" 
                        : "var(--background-muted)",
                    }}
                  />
                ))}
              </div>
              
              {currentQuestionIndex < dummyQuiz.questions.length - 1 ? (
                <button
                  onClick={handleNext}
                  className="btn-primary px-6 py-3 font-semibold flex items-center space-x-2"
                >
                  <span>Next</span>
                  <span>→</span>
                </button>
              ) : (
                <button
                  onClick={submitQuiz}
                  className="px-6 py-3 rounded-xl font-semibold transition-all duration-300 hover:transform hover:translateY(-1px) hover:shadow-xl flex items-center space-x-2"
                  style={{
                    background: "var(--gradient-success)",
                    color: "white",
                  }}
                >
                  <span>🏁</span>
                  <span>Submit Quiz</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

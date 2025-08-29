"use client";
import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { quizApi, QuizData } from "@/lib/apiClient";
import Header from "@/components/layout/Header";
import Timer from "@/components/quiz/Timer";
import Question from "@/components/quiz/Question";
import QuizResultsModal from "@/components/quiz/QuizResultsModal";

interface QuizSession {
  email: string;
  quizId: string;
  quiz: {
    id: number;
    uuid: string;
    title: string;
    description: string;
    time_limit: number;
    total_mark: number;
  };
  student: {
    id: number;
    user_id: number;
    name: string;
  };
}

export default function QuizPage() {
  const params = useParams();
  const router = useRouter();
  const quizId = params.quizId as string;

  const [quizSession, setQuizSession] = useState<QuizSession | null>(null);
  const [quizData, setQuizData] = useState<QuizData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<{ [key: number]: string }>({});
  const [showResultsModal, setShowResultsModal] = useState(false);
  const [quizResults, setQuizResults] = useState<{
    totalScore: number;
    totalQuestions: number;
    correctAnswers: number;
    passed: boolean;
    passingScore: number;
    totalMark: number;
  } | null>(null);

  useEffect(() => {
    const loadQuizSession = async () => {
      try {
        const storedSession = sessionStorage.getItem("quizSession");
        if (!storedSession) {
          router.push("/quiz");
          return;
        }

        const session: QuizSession = JSON.parse(storedSession);
        if (session.quizId !== quizId) {
          router.push("/quiz");
          return;
        }

        setQuizSession(session);

        // Fetch quiz data
        const response = await quizApi.getQuizData(quizId, session.email);
        if (response.success && response.data) {
          setQuizData(response.data);
        } else {
          setError("Failed to load quiz data");
        }
      } catch (err) {
        console.error("Error loading quiz:", err);
        setError(err instanceof Error ? err.message : "Failed to load quiz");
      } finally {
        setLoading(false);
      }
    };

    loadQuizSession();
  }, [router, quizId]);

  const submitQuiz = useCallback(async () => {
    if (!quizSession || !quizData) return;

    try {
      setLoading(true);
      
      // Convert answers to the expected format
      const formattedAnswers = Object.entries(answers).map(([questionId, optionId]) => ({
        questionId: parseInt(questionId),
        optionId: optionId
      }));

      const response = await quizApi.submitQuizAnswers(quizId, {
        email: quizSession.email,
        answers: formattedAnswers
      });

      if (response.success && response.data) {
        const result = response.data;
        setQuizResults({
          ...result,
          totalMark: quizData.total_mark
        });
        setShowResultsModal(true);
      } else {
        alert("Failed to submit quiz. Please try again.");
      }
    } catch (error) {
      console.error("Submit quiz error:", error);
      alert(error instanceof Error ? error.message : "Failed to submit quiz. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [quizSession, quizData, answers, quizId, router]);

  const handleAnswerSelect = (questionId: number, optionId: string) => {
    setAnswers((prevAnswers) => ({
      ...prevAnswers,
      [questionId]: optionId,
    }));
  };

  const handleNext = () => {
    if (quizData && currentQuestionIndex < quizData.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleCloseResultsModal = () => {
    setShowResultsModal(false);
    sessionStorage.removeItem("quizSession");
    router.push("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col" style={{ background: "var(--background)" }}>
        <Header />
        <div className="flex-grow flex items-center justify-center">
          <div className="glass-card !p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-lg font-medium" style={{ color: "var(--foreground)" }}>
              Loading quiz...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !quizSession || !quizData) {
    return (
      <div className="min-h-screen flex flex-col" style={{ background: "var(--background)" }}>
        <Header />
        <div className="flex-grow flex items-center justify-center">
          <div className="glass-card !p-8 text-center">
            <p className="text-lg font-medium text-red-600 mb-4">
              {error || "Failed to load quiz"}
            </p>
            <button
              onClick={() => router.push("/quiz")}
              className="btn-primary px-6 py-2"
            >
              Back to Quiz Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  const currentQuestion = quizData.questions[currentQuestionIndex];

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
                    {quizData.title}
                  </h2>
                  <p className="text-sm" style={{ color: "var(--foreground-muted)" }}>
                    Question {currentQuestionIndex + 1} of {quizData.questions.length}
                  </p>
                </div>
              </div>
              <div className="lg:flex-shrink-0">
                <Timer initialTime={quizData.time_limit * 60} onTimeUp={submitQuiz} />
              </div>
            </div>
            
            {/* Progress Bar */}
            <div className="mt-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium" style={{ color: "var(--foreground-muted)" }}>
                  Progress
                </span>
                <span className="text-sm font-bold" style={{ color: "var(--primary)" }}>
                  {Math.round(((currentQuestionIndex + 1) / quizData.questions.length) * 100)}%
                </span>
              </div>
              <div className="w-full h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div
                  className="h-full transition-all duration-500 ease-out rounded-full"
                  style={{
                    background: "var(--gradient-primary)",
                    width: `${((currentQuestionIndex + 1) / quizData.questions.length) * 100}%`,
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
                {quizData.questions.map((_, index) => (
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
              
              {currentQuestionIndex < quizData.questions.length - 1 ? (
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

      {/* Quiz Results Modal */}
      {quizResults && (
        <QuizResultsModal
          isOpen={showResultsModal}
          onClose={handleCloseResultsModal}
          results={quizResults}
          quizTitle={quizData.title}
          studentName={quizSession.student.name}
        />
      )}
    </div>
  );
}

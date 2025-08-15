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
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <Header />
      <main className="flex-grow flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
        <div className="w-full max-w-2xl bg-white p-8 rounded-lg shadow-md">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">
              {dummyQuiz.title}
            </h2>
            <Timer initialTime={10 * 60} onTimeUp={submitQuiz} />
          </div>

          <Question
            question={currentQuestion}
            selectedAnswer={answers[currentQuestion.id]}
            onAnswerSelect={handleAnswerSelect}
          />

          <div className="flex justify-between mt-8">
            <button
              onClick={handlePrevious}
              disabled={currentQuestionIndex === 0}
              className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md disabled:opacity-50"
            >
              Previous
            </button>
            {currentQuestionIndex < dummyQuiz.questions.length - 1 && (
              <button
                onClick={handleNext}
                className="px-4 py-2 bg-[var(--primary)] text-white rounded-md"
              >
                Next
              </button>
            )}
            {currentQuestionIndex === dummyQuiz.questions.length - 1 && (
              <button
                onClick={submitQuiz}
                className="px-4 py-2 bg-green-500 text-white rounded-md"
              >
                Submit
              </button>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

"use client";
import { useState } from "react";
import { Question } from "@/types";
import Table from "@/components/ui/Table";
import QuestionInput from "./QuestionInput";

// Mock data for initial display
const initialQuestions: Question[] = [
  {
    id: 1,
    quizQuestion: "What is the capital of France?",
    choices: ["Berlin", "Madrid", "Paris", "Rome"],
    correctAnswer: "Paris",
    questionType: "multiple-choice",
  },
  {
    id: 2,
    quizQuestion: "The Earth is flat.",
    choices: ["True", "False"],
    correctAnswer: "False",
    questionType: "true-false",
  },
];

export default function QuestionsView() {
  const [questions, setQuestions] = useState<Question[]>(initialQuestions);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);

  const handleAddQuestionClick = () => {
    setEditingQuestion(null);
    setIsModalOpen(true);
  };

  const handleEditQuestionClick = (question: Question) => {
    setEditingQuestion(question);
    setIsModalOpen(true);
  };

  const handleDeleteQuestion = (id: number) => {
    if (window.confirm("Are you sure you want to delete this question?")) {
      setQuestions(questions.filter((q) => q.id !== id));
    }
  };

  const handleSaveQuestion = (questionData: Omit<Question, 'id'>) => {
    if (editingQuestion) {
      setQuestions(
        questions.map((q) =>
          q.id === editingQuestion.id ? { ...editingQuestion, ...questionData } : q
        )
      );
    } else {
      setQuestions([
        ...questions,
        { ...questionData, id: Date.now() },
      ]);
    }
    setIsModalOpen(false);
  };

  const tableHeader = (
    <>
      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Question</th>
      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
    </>
  );

  const tableContent = questions.map((question) => (
    <tr key={question.id}>
      <td className="px-6 py-4 whitespace-nowrap text-left">{question.quizQuestion}</td>
      <td className="px-6 py-4 whitespace-nowrap text-left">{question.questionType}</td>
      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
        <button
          onClick={() => handleEditQuestionClick(question)}
          className="text-indigo-600 hover:text-indigo-900"
        >
          Edit
        </button>
        <button
          onClick={() => handleDeleteQuestion(question.id)}
          className="ml-4 text-red-600 hover:text-red-900"
        >
          Remove
        </button>
      </td>
    </tr>
  ));

  return (
    <div>
      <Table
        title="Questions"
        tableHeader={tableHeader}
        tableContent={tableContent}
        actions={
          <button
            onClick={handleAddQuestionClick}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Add Question
          </button>
        }
      />
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center z-50">
          <div className="relative mx-auto p-5 border w-full max-w-4xl shadow-lg rounded-md bg-white">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">
              {editingQuestion ? "Edit Question" : "Add New Question"}
            </h2>
            <QuestionInput
              question={editingQuestion}
              onSave={handleSaveQuestion}
              onClose={() => setIsModalOpen(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
}

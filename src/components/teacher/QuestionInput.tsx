import { useState, useEffect } from "react";
import { Question } from "@/types";

interface QuestionInputProps {
  question: Question | null;
  onSave: (questionData: Omit<Question, "id">) => void;
  onClose: () => void;
}

export default function QuestionInput({
  question,
  onSave,
  onClose,
}: QuestionInputProps) {
  const [formData, setFormData] = useState({
    quizQuestion: "",
    choices: ["", ""],
    correctAnswer: "",
    questionType: "multiple-choice" as "multiple-choice" | "true-false",
  });

  useEffect(() => {
    if (question) {
      setFormData({
        quizQuestion: question.quizQuestion,
        choices: question.choices,
        correctAnswer: question.correctAnswer,
        questionType: question.questionType,
      });
    } else {
      // Reset for new question
      setFormData({
        quizQuestion: "",
        choices: ["", ""],
        correctAnswer: "",
        questionType: "multiple-choice",
      });
    }
  }, [question]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    if (name === "questionType") {
      const newType = value as "multiple-choice" | "true-false";
      if (newType === "true-false") {
        setFormData((prev) => ({
          ...prev,
          questionType: "true-false",
          correctAnswer: "",
          choices: ["True", "False"],
        }));
      } else {
        setFormData((prev) => ({
          ...prev,
          questionType: "multiple-choice",
          correctAnswer: "",
          choices: prev.choices.length > 2 ? prev.choices : ["", ""],
        }));
      }
    } else if (name === "choice") {
      const index = parseInt(e.target.dataset.index || "0");
      const newChoices = [...formData.choices];
      newChoices[index] = value;
      setFormData((prev) => ({ ...prev, choices: newChoices }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const addChoice = () => {
    if (formData.questionType === "multiple-choice") {
      setFormData((prev) => ({
        ...prev,
        choices: [...prev.choices, ""],
      }));
    }
  };

  const removeChoice = (index: number) => {
    if (
      formData.questionType === "multiple-choice" &&
      formData.choices.length > 2
    ) {
      const newChoices = formData.choices.filter((_, i) => i !== index);

      let newCorrectAnswer = formData.correctAnswer;
      const removedIndex = index;
      const correctIndex = "ABCD".indexOf(formData.correctAnswer);

      if (correctIndex === removedIndex) {
        newCorrectAnswer = "";
      } else if (correctIndex > removedIndex) {
        newCorrectAnswer = "ABCD"[correctIndex - 1];
      }

      setFormData((prev) => ({
        ...prev,
        choices: newChoices,
        correctAnswer: newCorrectAnswer,
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-4xl mx-auto bg-white rounded-xl p-5"
    >
      {/* Question Type Selector */}
      <div className="mb-4">
        <label htmlFor="questionType" className="block mb-1 font-medium">
          Question Type
        </label>
        <select
          id="questionType"
          name="questionType"
          value={formData.questionType}
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded"
        >
          <option value="multiple-choice">Multiple Choice</option>
          <option value="true-false">True/False</option>
        </select>
      </div>

      {/* Quiz Question */}
      <div className="mb-4">
        <label htmlFor="quizQuestion" className="block mb-1 font-medium">
          Quiz Question
        </label>
        <input
          type="text"
          id="quizQuestion"
          name="quizQuestion"
          value={formData.quizQuestion}
          onChange={handleChange}
          placeholder="Enter your quiz question"
          className="w-full p-2 border border-gray-300 rounded"
        />
      </div>

      {/* Choices */}
      <div className="mb-4">
        {formData.choices.map((choice, index) => (
          <div key={index} className="mb-2">
            <label className="block mb-1 font-medium">
              {formData.questionType === "true-false" && index < 2
                ? index === 0
                  ? "True"
                  : "False"
                : `Choice ${String.fromCharCode(65 + index)}`}
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                data-index={index}
                name="choice" // Add name attribute here
                value={choice}
                onChange={handleChange}
                placeholder={
                  formData.questionType === "true-false" && index < 2
                    ? index === 0
                      ? "True"
                      : "False"
                    : `Enter choice ${String.fromCharCode(65 + index)}`
                }
                className={`w-full p-2 border border-gray-300 rounded ${
                  formData.questionType === "true-false" && index < 2
                    ? "bg-gray-100 cursor-not-allowed"
                    : ""
                }`}
                disabled={formData.questionType === "true-false" && index < 2}
              />
              {formData.questionType === "multiple-choice" && index >= 2 && (
                <button
                  type="button"
                  onClick={() => removeChoice(index)}
                  className="px-3 py-2 bg-red-100 text-red-600 rounded hover:bg-red-200"
                >
                  Remove
                </button>
              )}
            </div>
          </div>
        ))}

        {formData.questionType === "multiple-choice" && (
          <button
            type="button"
            onClick={addChoice}
            className="mt-2 px-3 py-2 bg-blue-100 text-blue-600 rounded hover:bg-blue-200"
          >
            Add Choice
          </button>
        )}
      </div>

      {/* Correct Answer */}
      <div className="mb-4">
        <label htmlFor="correctAnswer" className="block mb-1 font-medium">
          Correct Answer
        </label>
        <select
          id="correctAnswer"
          name="correctAnswer"
          value={formData.correctAnswer}
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded"
        >
          <option value="">Select correct answer</option>
          {formData.questionType === "true-false" ? (
            <>
              <option value="True">True</option>
              <option value="False">False</option>
            </>
          ) : (
            formData.choices.map((_, index) => (
              <option key={index} value={String.fromCharCode(65 + index)}>
                {String.fromCharCode(65 + index)}
              </option>
            ))
          )}
        </select>
      </div>

      <div className="flex justify-end gap-4 mt-6">
        <button
          type="button"
          onClick={onClose}
          className="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300 transition"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="bg-[var(--primary)] text-white px-4 py-2 rounded hover:bg-[var(--primary-hover)] transition w-full"
        >
          Save Question
        </button>
      </div>
    </form>
  );
}

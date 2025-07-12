import { useState } from "react";

export default function QuizForm() {
  const [formData, setFormData] = useState({
    quizQuestion: "",
    choiceA: "",
    choiceB: "",
    choiceC: "",
    choiceD: "",
    correctAnswer: "",
    questionType: "multiple-choice" as "multiple-choice" | "true-false",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    if (name === "questionType") {
      if (value === "true-false") {
        // Switch to True/False mode
        setFormData((prev) => ({
          ...prev,
          questionType: "true-false",
          correctAnswer: "",
          choiceA: "True",
          choiceB: "False",
        }));
      } else {
        // Switch back to Multiple Choice mode
        setFormData((prev) => ({
          ...prev,
          questionType: "multiple-choice",
          correctAnswer: "",
          choiceA: "", // Reset A
          choiceB: "", // Reset B
        }));
      }
    } else {
      // Regular input updates
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    // Add your submission logic here
  };

  return (
    <div className="p-6  ">
      <h1 className="text-xl font-bold mb-4">Quiz Management</h1>

      <form
        onSubmit={handleSubmit}
        className="max-w-4xl mx-auto bg-white shadow-md rounded-xl p-5"
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

        {/* Choices A & B (Always visible) */}
        <div className="mb-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="choiceA" className="block mb-1 font-medium">
                {formData.questionType === "true-false" ? "True" : "Choice A"}
              </label>
              <input
                type="text"
                id="choiceA"
                name="choiceA"
                value={formData.choiceA}
                onChange={handleChange}
                placeholder={
                  formData.questionType === "true-false"
                    ? "True"
                    : "Enter choice A"
                }
                className={`w-full p-2 border border-gray-300 rounded ${
                  formData.questionType === "true-false"
                    ? "bg-gray-100 cursor-not-allowed"
                    : ""
                }`}
                disabled={formData.questionType === "true-false"}
              />
            </div>
            <div>
              <label htmlFor="choiceB" className="block mb-1 font-medium">
                {formData.questionType === "true-false" ? "False" : "Choice B"}
              </label>
              <input
                type="text"
                id="choiceB"
                name="choiceB"
                value={formData.choiceB}
                onChange={handleChange}
                placeholder={
                  formData.questionType === "true-false"
                    ? "False"
                    : "Enter choice B"
                }
                className={`w-full p-2 border border-gray-300 rounded ${
                  formData.questionType === "true-false"
                    ? "bg-gray-100 cursor-not-allowed"
                    : ""
                }`}
                disabled={formData.questionType === "true-false"}
              />
            </div>
          </div>
        </div>

        {/* Choices C & D (Only for multiple choice) */}
        {formData.questionType === "multiple-choice" && (
          <div className="mb-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="choiceC" className="block mb-1 font-medium">
                  Choice C
                </label>
                <input
                  type="text"
                  id="choiceC"
                  name="choiceC"
                  value={formData.choiceC}
                  onChange={handleChange}
                  placeholder="Enter choice C"
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>
              <div>
                <label htmlFor="choiceD" className="block mb-1 font-medium">
                  Choice D
                </label>
                <input
                  type="text"
                  id="choiceD"
                  name="choiceD"
                  value={formData.choiceD}
                  onChange={handleChange}
                  placeholder="Enter choice D"
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>
            </div>
          </div>
        )}

        {/* Correct Answer */}
        <div className="mb-4">
          <label htmlFor="correctAnswer" className="block mb-1 font-medium">
            Correct Answer
          </label>
          {formData.questionType === "multiple-choice" ? (
            <select
              id="correctAnswer"
              name="correctAnswer"
              value={formData.correctAnswer}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
            >
              <option value="">Select correct answer</option>
              <option value="A">A</option>
              <option value="B">B</option>
              <option value="C">C</option>
              <option value="D">D</option>
            </select>
          ) : (
            <select
              id="correctAnswer"
              name="correctAnswer"
              value={formData.correctAnswer}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
            >
              <option value="">Select correct answer</option>
              <option value="True">True</option>
              <option value="False">False</option>
            </select>
          )}
        </div>

        <button
          type="submit"
          className="bg-[var(--primary)] text-white px-4 py-2 rounded hover:bg-[var(--primary-hover)] transition w-full"
        >
          Submit Quiz
        </button>
      </form>
    </div>
  );
}

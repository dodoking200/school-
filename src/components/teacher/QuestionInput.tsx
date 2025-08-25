import { useState, useEffect } from "react";
import { QuestionItem, SubjectQuestions } from "@/types";

interface QuestionInputProps {
  question: QuestionItem | null;
  onSave: (questionData: {
    question_text: string;
    type: string;
    options: { text: string; is_correct: boolean }[];
    subject_id: number;
  }) => void;
  onClose: () => void;
  isSubmitting?: boolean;
  subjects?: SubjectQuestions[];
}

export default function QuestionInput({
  question,
  onSave,
  onClose,
  isSubmitting = false,
  subjects = [],
}: QuestionInputProps) {
  const [formData, setFormData] = useState({
    question_text: "",
    type: "mcq" as string,
    options: [
      { text: "", is_correct: false },
      { text: "", is_correct: false },
      { text: "", is_correct: false },
      { text: "", is_correct: false },
    ],
    subject_id: subjects.length > 0 ? subjects[0].subject_id : 1,
  });

  useEffect(() => {
    if (question) {
      setFormData({
        question_text: question.question_text,
        type: question.type,
        options: question.options.map((opt) => ({
          text: opt.option_text,
          is_correct: opt.is_correct,
        })),
        subject_id: subjects.length > 0 ? subjects[0].subject_id : 1,
      });
    } else {
      // Reset for new question
      setFormData({
        question_text: "",
        type: "mcq",
        options: [
          { text: "", is_correct: false },
          { text: "", is_correct: false },
          { text: "", is_correct: false },
          { text: "", is_correct: false },
        ],
        subject_id: subjects.length > 0 ? subjects[0].subject_id : 1,
      });
    }
  }, [question, subjects]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;

    if (name === "type") {
      setFormData((prev) => ({
        ...prev,
        type: value,
      }));
    } else if (name === "option") {
      const index = parseInt(e.target.dataset.index || "0");
      const newOptions = [...formData.options];
      newOptions[index] = { ...newOptions[index], text: value };
      setFormData((prev) => ({ ...prev, options: newOptions }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleCorrectAnswerChange = (index: number) => {
    const newOptions = formData.options.map((option, i) => ({
      ...option,
      is_correct: i === index,
    }));
    setFormData((prev) => ({ ...prev, options: newOptions }));
  };

  const addOption = () => {
    setFormData((prev) => ({
      ...prev,
      options: [...prev.options, { text: "", is_correct: false }],
    }));
  };

  const removeOption = (index: number) => {
    if (formData.options.length > 2) {
      const newOptions = formData.options.filter((_, i) => i !== index);
      // If we removed the correct answer, reset it
      if (formData.options[index].is_correct) {
        newOptions[0].is_correct = true;
      }
      setFormData((prev) => ({ ...prev, options: newOptions }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate that at least one option is correct
    const hasCorrectAnswer = formData.options.some(
      (option) => option.is_correct
    );
    if (!hasCorrectAnswer) {
      alert("Please select at least one correct answer");
      return;
    }

    // Validate that all options have text
    const hasEmptyOptions = formData.options.some(
      (option) => !option.text.trim()
    );
    if (hasEmptyOptions) {
      alert("Please fill in all option texts");
      return;
    }

    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {subjects.length > 0 && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Subject
          </label>
          <select
            name="subject_id"
            value={formData.subject_id}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
            disabled={isSubmitting}
          >
            {subjects.map((subject) => (
              <option key={subject.subject_id} value={subject.subject_id}>
                {subject.subject_name}
              </option>
            ))}
          </select>
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Question Text
        </label>
        <textarea
          name="question_text"
          value={formData.question_text}
          onChange={handleChange}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Enter your question here..."
          required
          disabled={isSubmitting}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Question Type
        </label>
        <select
          name="type"
          value={formData.type}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          disabled={isSubmitting}
        >
          <option value="mcq">Multiple Choice</option>
          <option value="true_false">True/False</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Options
        </label>
        <div className="space-y-3">
          {formData.options.map((option, index) => (
            <div key={index} className="flex items-center gap-3">
              <input
                type="radio"
                name="correctAnswer"
                checked={option.is_correct}
                onChange={() => handleCorrectAnswerChange(index)}
                className="text-blue-600 focus:ring-blue-500"
                disabled={isSubmitting}
              />
              <input
                type="text"
                name="option"
                data-index={index}
                value={option.text}
                onChange={handleChange}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder={`Option ${index + 1}`}
                required
                disabled={isSubmitting}
              />
              {formData.options.length > 2 && (
                <button
                  type="button"
                  onClick={() => removeOption(index)}
                  className="px-2 py-1 text-red-600 hover:text-red-800 disabled:opacity-50"
                  disabled={isSubmitting}
                >
                  Remove
                </button>
              )}
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={addOption}
          className="mt-2 px-3 py-1 text-sm text-blue-600 hover:text-blue-800 border border-blue-300 rounded hover:bg-blue-50 disabled:opacity-50"
          disabled={isSubmitting}
        >
          + Add Option
        </button>
      </div>

      <div className="flex justify-end gap-3 pt-4">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 disabled:opacity-50"
          disabled={isSubmitting}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={isSubmitting}
        >
          {isSubmitting
            ? question
              ? "Updating..."
              : "Creating..."
            : question
            ? "Update Question"
            : "Create Question"}
        </button>
      </div>
    </form>
  );
}

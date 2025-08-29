"use client";
import { useState, useEffect } from "react";
import { ExamCreatePayload, ExamQuestion, SubjectQuestions } from "@/types";

interface ExamInputProps {
  onSave: (examData: ExamCreatePayload) => Promise<void>;
  onClose: () => void;
  isSubmitting: boolean;
  subjects: SubjectQuestions[];
  selectedQuestionIds: number[];
}

export default function ExamInput({
  onSave,
  onClose,
  isSubmitting,
  subjects,
  selectedQuestionIds,
}: ExamInputProps) {
  const [formData, setFormData] = useState<ExamCreatePayload>({
    title: "",
    description: "",
    semester_id: 1, // Default value, you might want to fetch available semesters
    subject_id: subjects.length > 0 ? subjects[0].subject_id : 0,
    time_limit: 60,
    total_mark: 20,
    passing_mark: 10,
    start_datetime: "",
    end_datetime: "",
    announced: true,
    exam_type: "quiz",
    questions: [],
  });

  const [questionMarks, setQuestionMarks] = useState<{ [key: number]: number }>({});

  // Initialize question marks when selectedQuestionIds change
  useEffect(() => {
    const initialMarks: { [key: number]: number } = {};
    selectedQuestionIds.forEach((id) => {
      initialMarks[id] = 1; // Default mark of 1
    });
    setQuestionMarks(initialMarks);
  }, [selectedQuestionIds]);

  // Update questions array when questionMarks change
  useEffect(() => {
    const questions: ExamQuestion[] = selectedQuestionIds.map((id) => ({
      question_id: id,
      mark: questionMarks[id] || 1,
    }));
    setFormData((prev) => ({ ...prev, questions }));
  }, [selectedQuestionIds, questionMarks]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    let parsedValue: string | number | boolean = value;

    if (type === "number") {
      parsedValue = parseInt(value) || 0;
    } else if (type === "checkbox") {
      parsedValue = (e.target as HTMLInputElement).checked;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: parsedValue,
    }));
  };

  const handleQuestionMarkChange = (questionId: number, mark: number) => {
    setQuestionMarks((prev) => ({
      ...prev,
      [questionId]: mark,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate that total mark equals sum of question marks
    const totalQuestionMarks = Object.values(questionMarks).reduce((sum, mark) => sum + mark, 0);
    if (totalQuestionMarks !== formData.total_mark) {
      alert(`Total mark (${formData.total_mark}) must equal the sum of question marks (${totalQuestionMarks})`);
      return;
    }

    await onSave(formData);
  };

  const getSubjectName = (subjectId: number) => {
    const subject = subjects.find((s) => s.subject_id === subjectId);
    return subject ? subject.subject_name : "Unknown Subject";
  };

  const getQuestionText = (questionId: number) => {
    for (const subject of subjects) {
      const question = subject.questions.find((q) => q.question_id === questionId);
      if (question) return question.question_text;
    }
    return "Unknown Question";
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Exam Title *
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter exam title"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Subject *
          </label>
          <select
            name="subject_id"
            value={formData.subject_id}
            onChange={handleInputChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            {subjects.map((subject) => (
              <option key={subject.subject_id} value={subject.subject_id}>
                {subject.subject_name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Semester ID *
          </label>
          <input
            type="number"
            name="semester_id"
            value={formData.semester_id}
            onChange={handleInputChange}
            required
            min="1"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Exam Type *
          </label>
          <select
            name="exam_type"
            value={formData.exam_type}
            onChange={handleInputChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="quiz">Quiz</option>
            <option value="midterm">Midterm</option>
            <option value="final">Final</option>
            <option value="assignment">Assignment</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Time Limit (minutes) *
          </label>
          <input
            type="number"
            name="time_limit"
            value={formData.time_limit}
            onChange={handleInputChange}
            required
            min="1"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Total Mark *
          </label>
          <input
            type="number"
            name="total_mark"
            value={formData.total_mark}
            onChange={handleInputChange}
            required
            min="1"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Passing Mark *
          </label>
          <input
            type="number"
            name="passing_mark"
            value={formData.passing_mark}
            onChange={handleInputChange}
            required
            min="1"
            max={formData.total_mark}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Start Date & Time *
          </label>
          <input
            type="datetime-local"
            name="start_datetime"
            value={formData.start_datetime}
            onChange={handleInputChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            End Date & Time *
          </label>
          <input
            type="datetime-local"
            name="end_datetime"
            value={formData.end_datetime}
            onChange={handleInputChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Description
        </label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleInputChange}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Enter exam description"
        />
      </div>

      <div className="flex items-center">
        <input
          type="checkbox"
          name="announced"
          checked={formData.announced}
          onChange={handleInputChange}
          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
        />
        <label className="ml-2 block text-sm text-gray-700">
          Announce this exam to students
        </label>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Question Marks Distribution
        </label>
        <div className="bg-gray-50 p-4 rounded-md">
          <p className="text-sm text-gray-600 mb-3">
            Total Mark: {formData.total_mark} | 
            Sum of Question Marks: {Object.values(questionMarks).reduce((sum, mark) => sum + mark, 0)}
            {Object.values(questionMarks).reduce((sum, mark) => sum + mark, 0) !== formData.total_mark && (
              <span className="text-red-500 ml-2">⚠️ Marks don't match!</span>
            )}
          </p>
          <div className="space-y-2">
            {selectedQuestionIds.map((questionId) => (
              <div key={questionId} className="flex items-center justify-between p-2 bg-white rounded border">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-700">
                    {getQuestionText(questionId)}
                  </p>
                  <p className="text-xs text-gray-500">
                    Subject: {getSubjectName(formData.subject_id)}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <label className="text-sm text-gray-600">Mark:</label>
                  <input
                    type="number"
                    value={questionMarks[questionId] || 1}
                    onChange={(e) => handleQuestionMarkChange(questionId, parseInt(e.target.value) || 1)}
                    min="1"
                    max={formData.total_mark}
                    className="w-16 px-2 py-1 border border-gray-300 rounded text-center"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        <button
          type="button"
          onClick={onClose}
          disabled={isSubmitting}
          className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 disabled:opacity-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50"
        >
          {isSubmitting ? "Creating..." : "Create Exam"}
        </button>
      </div>
    </form>
  );
}

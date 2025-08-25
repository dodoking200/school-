"use client";
import { useState, useEffect } from "react";
import { SubjectQuestions, QuestionItem } from "@/types";
import Table from "@/components/ui/Table";
import QuestionInput from "./QuestionInput";
import { questionService } from "@/lib/services/questionService";

export default function QuestionsView() {
  const [subjectsData, setSubjectsData] = useState<SubjectQuestions[]>([]);
  const [filteredData, setFilteredData] = useState<SubjectQuestions[]>([]);
  const [selectedSubject, setSelectedSubject] = useState<number | "all">("all");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<QuestionItem | null>(
    null
  );
  const [expandedQuestionId, setExpandedQuestionId] = useState<number | null>(
    null
  );
  const [selectedQuestionIds, setSelectedQuestionIds] = useState<number[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch questions data
  const fetchQuestions = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await questionService.getTeacherQuestions();
      setSubjectsData(data);
      setFilteredData(data);

      // Check if teacher has subjects but no questions
      const totalQuestions = data.reduce(
        (total, subject) => total + subject.questions.length,
        0
      );
      if (data.length > 0 && totalQuestions === 0) {
        setError(
          "You have subjects assigned but no questions created yet. Start by adding your first question!"
        );
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to fetch questions"
      );
      console.error("Error fetching questions:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, []);

  // Filter data based on selected subject
  useEffect(() => {
    if (selectedSubject === "all") {
      setFilteredData(subjectsData);
    } else {
      const filtered = subjectsData.filter(
        (subject) => subject.subject_id === selectedSubject
      );
      setFilteredData(filtered);
    }
  }, [selectedSubject, subjectsData]);

  // Get all unique questions from filtered data
  const allQuestions = filteredData.flatMap((subject) =>
    subject.questions.map((question) => ({
      ...question,
      subject_name: subject.subject_name,
      subject_id: subject.subject_id,
    }))
  );

  const handleSelectQuestion = (id: number) => {
    setSelectedQuestionIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleSelectAllQuestions = () => {
    if (selectedQuestionIds.length === allQuestions.length) {
      setSelectedQuestionIds([]);
    } else {
      setSelectedQuestionIds(allQuestions.map((q) => q.question_id));
    }
  };

  const handleQuestionClick = (id: number) => {
    setExpandedQuestionId(expandedQuestionId === id ? null : id);
  };

  const handleAddQuestionClick = () => {
    setEditingQuestion(null);
    setIsModalOpen(true);
  };

  const handleEditQuestionClick = (question: QuestionItem) => {
    setEditingQuestion(question);
    setIsModalOpen(true);
  };

  const handleDeleteQuestion = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this question?")) {
      try {
        await questionService.deleteQuestion(id);
        // Refresh the questions list
        await fetchQuestions();
        // Clear selection if the deleted question was selected
        setSelectedQuestionIds((prev) => prev.filter((qId) => qId !== id));
        alert("Question deleted successfully!");
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Failed to delete question";
        alert(`Error deleting question: ${errorMessage}`);
        console.error("Error deleting question:", error);
      }
    }
  };

  const handleSaveQuestion = async (questionData: {
    question_text: string;
    type: string;
    options: { text: string; is_correct: boolean }[];
    subject_id: number;
  }) => {
    try {
      setIsSubmitting(true);

      if (editingQuestion) {
        // Update existing question
        await questionService.updateQuestion(
          editingQuestion.question_id,
          questionData
        );
        alert("Question updated successfully!");
      } else {
        // Create new question
        await questionService.createQuestion(questionData);
      }

      // Refresh the questions list
      await fetchQuestions();
      setIsModalOpen(false);
      setEditingQuestion(null);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to save question";
      alert(`Error saving question: ${errorMessage}`);
      console.error("Error saving question:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Subject filter component
  const subjectFilter = (
    <div className="flex items-center gap-3">
      {subjectsData.length > 0 ? (
        <>
          <select
            id="subject-filter"
            value={selectedSubject}
            onChange={(e) =>
              setSelectedSubject(
                e.target.value === "all" ? "all" : Number(e.target.value)
              )
            }
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">All Subjects</option>
            {subjectsData.map((subject) => (
              <option key={subject.subject_id} value={subject.subject_id}>
                {subject.subject_name}
              </option>
            ))}
          </select>
        </>
      ) : (
        <div className="text-sm text-amber-600 bg-amber-50 px-3 py-2 rounded border border-amber-200">
          ⚠️ No subjects assigned yet. Please contact an administrator to assign
          subjects to your account.
        </div>
      )}
    </div>
  );

  const tableHeader = (
    <>
      <th className="p-4">
        <input
          type="checkbox"
          checked={
            allQuestions.length > 0 &&
            selectedQuestionIds.length === allQuestions.length
          }
          onChange={handleSelectAllQuestions}
        />
      </th>
      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
        Subject
      </th>
      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
        Question
      </th>
      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
        Type
      </th>
      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
        Actions
      </th>
    </>
  );

  const tableContent = (
    <>
      {isLoading ? (
        <tr>
          <td colSpan={5} className="text-center py-4">
            Loading questions...
          </td>
        </tr>
      ) : error ? (
        <tr>
          <td colSpan={5} className="text-center py-4 text-red-500">
            Error: {error}
          </td>
        </tr>
      ) : allQuestions.length === 0 ? (
        <tr>
          <td colSpan={5} className="text-center py-4">
            <div className="text-gray-600 mb-2">
              <strong>No questions available yet</strong>
            </div>
            <div className="text-sm">
              {subjectsData.length > 0
                ? "You have subjects assigned but no questions created yet. Start by adding your first question!"
                : "No subjects have been assigned to you yet. Please contact an administrator."}
            </div>
            {subjectsData.length > 0 && (
              <div className="mt-4">
                <button
                  onClick={handleAddQuestionClick}
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Add Your First Question
                </button>
              </div>
            )}
          </td>
        </tr>
      ) : (
        allQuestions.flatMap((question) => {
          const isExpanded = expandedQuestionId === question.question_id;
          return [
            <tr
              key={question.question_id}
              onClick={() => handleQuestionClick(question.question_id)}
              className="cursor-pointer hover:bg-gray-50"
            >
              <td className="p-4">
                <input
                  type="checkbox"
                  checked={selectedQuestionIds.includes(question.question_id)}
                  onChange={() => handleSelectQuestion(question.question_id)}
                  onClick={(e) => e.stopPropagation()}
                />
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-left">
                {question.subject_name}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-left">
                {question.question_text}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-left">
                {question.type}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEditQuestionClick(question);
                  }}
                  className="text-indigo-600 hover:text-indigo-900"
                >
                  Edit
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteQuestion(question.question_id);
                  }}
                  className="ml-4 text-red-600 hover:text-red-900"
                >
                  Remove
                </button>
              </td>
            </tr>,
            isExpanded && (
              <tr key={`${question.question_id}-expanded`}>
                <td colSpan={5} className="p-4 bg-gray-100 text-left">
                  <div className="font-bold mb-2">Options:</div>
                  <ul className="list-disc pl-5">
                    {question.options.map((option) => (
                      <li
                        key={option.option_id}
                        className={
                          option.is_correct ? "text-green-600 font-bold" : ""
                        }
                      >
                        {option.option_text}
                        {option.is_correct ? " (Correct)" : ""}
                      </li>
                    ))}
                  </ul>
                </td>
              </tr>
            ),
          ];
        })
      )}
    </>
  );

  return (
    <div>
      <Table
        title="Questions"
        filter={subjectFilter}
        tableHeader={tableHeader}
        tableContent={tableContent}
        actions={
          <div className="flex gap-4">
            {subjectsData.length > 0 ? (
              <>
                <button
                  onClick={() => {
                    console.log("Selected question IDs:", selectedQuestionIds);
                    alert(
                      `Creating exam with ${selectedQuestionIds.length} questions.`
                    );
                  }}
                  className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded disabled:bg-gray-400"
                  disabled={selectedQuestionIds.length === 0}
                >
                  Create Exam ({selectedQuestionIds.length})
                </button>
                <button
                  onClick={handleAddQuestionClick}
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                >
                  Add Question
                </button>
              </>
            ) : (
              <div className="text-sm text-gray-600">
                No subjects assigned yet
              </div>
            )}
          </div>
        }
      />

      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-600/50 overflow-y-auto h-full w-full flex items-center justify-center z-50">
          <div className="relative mx-auto p-5 border w-full max-w-4xl shadow-lg rounded-md bg-white">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">
              {editingQuestion ? "Edit Question" : "Add New Question"}
            </h2>
            <QuestionInput
              question={editingQuestion}
              onSave={handleSaveQuestion}
              onClose={() => {
                setIsModalOpen(false);
                setEditingQuestion(null);
              }}
              isSubmitting={isSubmitting}
              subjects={subjectsData}
            />
          </div>
        </div>
      )}
    </div>
  );
}

"use client";

import React, { useState, useEffect } from "react";
import { UpcomingQuiz, UpcomingExam } from "@/types";
import { examService } from "@/lib/services/examService";
import { formatDate, formatTime, getTimeRemaining } from "@/lib/utils";
import { CalendarIcon, ClockIcon, BookOpenIcon, TrophyIcon } from "@heroicons/react/24/outline";

export default function ExamSchedule() {
  const [quizzes, setQuizzes] = useState<UpcomingQuiz[]>([]);
  const [exams, setExams] = useState<UpcomingExam[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'quizzes' | 'exams'>('quizzes');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [quizzesData, examsData] = await Promise.all([
        examService.getUpcomingQuizzes(),
        examService.getUpcomingExams()
      ]);
      
      setQuizzes(quizzesData);
      setExams(examsData);
    } catch (err) {
      console.error('Error fetching exam data:', err);
      setError('Failed to load upcoming quizzes and exams. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const renderExamCard = (item: UpcomingQuiz | UpcomingExam, type: 'quiz' | 'exam') => (
    <div 
      key={item.id} 
      className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500 hover:shadow-lg transition-shadow duration-200"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <BookOpenIcon className="w-5 h-5 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-900">{item.title}</h3>
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${
              type === 'quiz' 
                ? 'bg-purple-100 text-purple-800' 
                : 'bg-orange-100 text-orange-800'
            }`}>
              {type === 'quiz' ? 'Quiz' : 'Exam'}
            </span>
          </div>
          <p className="text-gray-600 text-sm mb-3">{item.description}</p>
          
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="flex items-center gap-2">
              <CalendarIcon className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-700">
                {formatDate(item.start_datetime)}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <ClockIcon className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-700">
                {formatTime(item.start_datetime)}
              </span>
            </div>
          </div>
        </div>
        
        <div className="text-right">
          <div className="text-2xl font-bold text-blue-600 mb-1">
            {item.total_mark}
          </div>
          <div className="text-xs text-gray-500">Total Marks</div>
        </div>
      </div>

      <div className="border-t pt-4">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-4">
            <span className="text-gray-600">
              <strong>Subject:</strong> {item.subject_name}
            </span>
            <span className="text-gray-600">
              <strong>Duration:</strong> {item.time_limit} min
            </span>
          </div>
          <div className="text-right">
            <div className="text-xs text-gray-500 mb-1">Time Remaining</div>
            <div className={`font-medium ${
              getTimeRemaining(item.start_datetime) === 'Expired' 
                ? 'text-red-600' 
                : 'text-green-600'
            }`}>
              {getTimeRemaining(item.start_datetime)}
            </div>
          </div>
        </div>
        
        <div className="mt-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrophyIcon className="w-4 h-4 text-yellow-500" />
            <span className="text-sm text-gray-600">
              Passing: {item.passing_mark}/{item.total_mark}
            </span>
          </div>

        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading upcoming quizzes and exams...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-600 mb-4">
          <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">Error Loading Data</h3>
        <p className="text-gray-600 mb-4">{error}</p>
        <button 
          onClick={fetchData}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200"
        >
          Try Again
        </button>
      </div>
    );
  }

  const hasQuizzes = quizzes.length > 0;
  const hasExams = exams.length > 0;

  if (!hasQuizzes && !hasExams) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 mb-4">
          <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No Upcoming Assessments</h3>
        <p className="text-gray-600">You don&apos;t have any upcoming quizzes or exams at the moment.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Upcoming Assessments</h1>
          <p className="text-gray-600">Stay prepared for your upcoming quizzes and exams</p>
        </div>
        <button 
          onClick={fetchData}
          className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors duration-200"
        >
          Refresh
        </button>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('quizzes')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'quizzes'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Quizzes ({quizzes.length})
          </button>
          <button
            onClick={() => setActiveTab('exams')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'exams'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Exams ({exams.length})
          </button>
        </nav>
      </div>

      {/* Content */}
      <div className="space-y-6">
        {activeTab === 'quizzes' && (
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Upcoming Quizzes</h2>
            {hasQuizzes ? (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {quizzes.map(quiz => renderExamCard(quiz, 'quiz'))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                No upcoming quizzes scheduled.
              </div>
            )}
          </div>
        )}

        {activeTab === 'exams' && (
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Upcoming Exams</h2>
            {hasExams ? (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {exams.map(exam => renderExamCard(exam, 'exam'))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                No upcoming exams scheduled.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

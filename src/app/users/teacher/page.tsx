"use client";
import SideNav from "@/components/layout/SideNav";
import { SideNavButton } from "@/components/ui/SideNavButton";
import React, { useState } from "react";
import { House, BookCheck, NotepadText, CalendarCheck } from "lucide-react";
import Students from "@/components/teacher/Students";
import QuestionsView from "@/components/teacher/QuestionsView";
import TeacherSchedule from "@/components/teacher/TeacherSchedule";
import TeacherAttendance from "@/components/teacher/TeacherAttendance";

export default function TeacherPage() {
  const [activeButton, setActiveButton] = useState<string>("Dashboard");

  return (
    <div className="flex  min-h-screen">
      <SideNav>
        <SideNavButton
          icon="home"
          active={activeButton === "Dashboard"}
          onClick={() => setActiveButton("Dashboard")}
        >
          <House />
        </SideNavButton>
        <SideNavButton
          icon="grading"
          active={activeButton === "Marks"}
          onClick={() => setActiveButton("Marks")}
        >
          <BookCheck />
        </SideNavButton>
        <SideNavButton
          icon="assignment"
          active={activeButton === "Quizzes"}
          onClick={() => setActiveButton("Quizzes")}
        >
          <NotepadText />
        </SideNavButton>
        <SideNavButton
          icon="event"
          active={activeButton === "Schedule"}
          onClick={() => setActiveButton("Schedule")}
        >
          <CalendarCheck />
        </SideNavButton>
        <SideNavButton
          icon="attendance"
          active={activeButton === "Attendance"}
          onClick={() => setActiveButton("Attendance")}
        >
          <BookCheck />
        </SideNavButton>
      </SideNav>
      <main className="flex-1 bg-white p-4 ml-64 ">
        <h1 className="text-3xl font-bold mb-6 text-black">
          teacher Dashboard
        </h1>
        {activeButton == "Dashboard" && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Welcome to Your Teacher Dashboard
            </h2>
            <p className="text-gray-600 mb-6">
              Manage your classes, view schedules, create quizzes, and track
              student progress from this central location.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-medium text-blue-900 mb-2">
                  Quick Actions
                </h3>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• View your schedule</li>
                  <li>• Create new quizzes</li>
                  <li>• Check student marks</li>
                </ul>
              </div>
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h3 className="font-medium text-green-900 mb-2">
                  Today&apos;s Classes
                </h3>
                <p className="text-sm text-green-700">
                  Click on Schedule to view your daily classes
                </p>
              </div>
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                <h3 className="font-medium text-purple-900 mb-2">
                  Student Management
                </h3>
                <p className="text-sm text-purple-700">
                  Access student information and marks
                </p>
              </div>
            </div>
          </div>
        )}
        {activeButton == "Quizzes" && <QuestionsView />}
        {activeButton == "Marks" && <Students />}
        {activeButton == "Schedule" && <TeacherSchedule />}
        {activeButton == "Attendance" && <TeacherAttendance />}
      </main>
    </div>
  );
}

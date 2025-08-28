"use client";
import SideNav from "@/components/layout/SideNav";
import { SideNavButton } from "@/components/ui/SideNavButton";
import React, { useState } from "react";
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
          Dashboard
        </SideNavButton>
        <SideNavButton
          icon="grading"
          active={activeButton === "Marks"}
          onClick={() => setActiveButton("Marks")}
        >
          Student Marks
        </SideNavButton>
        <SideNavButton
          icon="assignment"
          active={activeButton === "Quizzes"}
          onClick={() => setActiveButton("Quizzes")}
        >
          Quizzes
        </SideNavButton>
        <SideNavButton
          icon="event"
          active={activeButton === "Schedule"}
          onClick={() => setActiveButton("Schedule")}
        >
          Schedule
        </SideNavButton>
        <SideNavButton
          icon="attendance"
          active={activeButton === "Attendance"}
          onClick={() => setActiveButton("Attendance")}
        >
          Attendance
        </SideNavButton>
      </SideNav>
      <main className="flex-1 p-4 ml-64" style={{ background: "var(--background)" }}>
        <h1 className="text-3xl font-bold mb-6" style={{ color: "var(--foreground)" }}>
          teacher Dashboard
        </h1>
        {activeButton == "Dashboard" && (
          <div className="glass-card">
            <h2 className="text-2xl font-semibold mb-4" style={{ color: "var(--foreground)" }}>
              Welcome to Your Teacher Dashboard
            </h2>
            <p className="mb-6" style={{ color: "var(--foreground-muted)" }}>
              Manage your classes, view schedules, create quizzes, and track
              student progress from this central location.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="glass-card !p-4" style={{ backgroundColor: "var(--primary-light)" }}>
                <h3 className="font-medium mb-2" style={{ color: "var(--primary)" }}>
                  Quick Actions
                </h3>
                <ul className="text-sm space-y-1" style={{ color: "var(--primary)" }}>
                  <li>• View your schedule</li>
                  <li>• Create new quizzes</li>
                  <li>• Check student marks</li>
                </ul>
              </div>
              <div className="glass-card !p-4" style={{ backgroundColor: "var(--accent-light)" }}>
                <h3 className="font-medium mb-2" style={{ color: "var(--accent)" }}>
                  Today&apos;s Classes
                </h3>
                <p className="text-sm" style={{ color: "var(--accent)" }}>
                  Click on Schedule to view your daily classes
                </p>
              </div>
              <div className="glass-card !p-4" style={{ backgroundColor: "var(--secondary-light)" }}>
                <h3 className="font-medium mb-2" style={{ color: "var(--secondary)" }}>
                  Student Management
                </h3>
                <p className="text-sm" style={{ color: "var(--secondary)" }}>
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

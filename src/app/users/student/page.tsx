"use client";
import SideNav from "@/components/layout/SideNav";
import { SideNavButton } from "@/components/ui/SideNavButton";
import React, { useState } from "react";
import ExamSchedule from "@/components/student/ExamSchedule";
import Schedule from "@/components/student/Schedule";
import Marks from "@/components/student/Marks";
import AttendanceView from "@/components/student/AttendanceView";

export default function StudentPage() {
  const [activeButton, setActiveButton] = useState<string>("home");

  return (
    <div className="flex min-h-screen">
      <SideNav>
        <SideNavButton
          icon="home"
          active={activeButton === "home"}
          onClick={() => setActiveButton("home")}
        >
          Dashboard
        </SideNavButton>
        <SideNavButton
          icon="Marks"
          active={activeButton === "Marks"}
          onClick={() => setActiveButton("Marks")}
        >
          Marks
        </SideNavButton>
        <SideNavButton
          icon="Quizzes"
          active={activeButton === "Quizzes"}
          onClick={() => setActiveButton("Quizzes")}
        >
          Exams
        </SideNavButton>
        <SideNavButton
          icon="Schedule"
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
          Student Dashboard
        </h1>
        {activeButton == "home" && (
          <div className="glass-card">
            <h2 className="text-2xl font-semibold mb-4" style={{ color: "var(--foreground)" }}>
              Welcome to Your Student Portal
            </h2>
            <p className="mb-6" style={{ color: "var(--foreground-muted)" }}>
              Access your marks, schedules, exams, and attendance all in one place.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="glass-card !p-4" style={{ backgroundColor: "var(--primary-light)" }}>
                <h3 className="font-medium mb-2" style={{ color: "var(--primary)" }}>
                  Academic Performance
                </h3>
                <p className="text-sm" style={{ color: "var(--primary)" }}>
                  View your marks and grades
                </p>
              </div>
              <div className="glass-card !p-4" style={{ backgroundColor: "var(--accent-light)" }}>
                <h3 className="font-medium mb-2" style={{ color: "var(--accent)" }}>
                  Upcoming Exams
                </h3>
                <p className="text-sm" style={{ color: "var(--accent)" }}>
                  Check your exam schedule
                </p>
              </div>
              <div className="glass-card !p-4" style={{ backgroundColor: "var(--secondary-light)" }}>
                <h3 className="font-medium mb-2" style={{ color: "var(--secondary)" }}>
                  Class Schedule
                </h3>
                <p className="text-sm" style={{ color: "var(--secondary)" }}>
                  View your daily schedule
                </p>
              </div>
              <div className="glass-card !p-4" style={{ backgroundColor: "var(--warning-light)" }}>
                <h3 className="font-medium mb-2" style={{ color: "var(--warning)" }}>
                  Attendance
                </h3>
                <p className="text-sm" style={{ color: "var(--warning)" }}>
                  Track your attendance
                </p>
              </div>
            </div>
          </div>
        )}
        {activeButton == "Quizzes" && <ExamSchedule />}
        {activeButton == "Schedule" && <Schedule />}
        {activeButton == "Marks" && <Marks />}
        {activeButton == "Attendance" && <AttendanceView />}
      </main>
    </div>
  );
}

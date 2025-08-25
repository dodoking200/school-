"use client";
import SideNav from "@/components/layout/SideNav";
import { SideNavButton } from "@/components/ui/SideNavButton";
import React, { useState } from "react";
import { CalendarCheck, File, FileChartColumn, House } from "lucide-react";
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
          <House />
        </SideNavButton>
        <SideNavButton
          icon="Marks"
          active={activeButton === "Marks"}
          onClick={() => setActiveButton("Marks")}
        >
          <FileChartColumn />
        </SideNavButton>
        <SideNavButton
          icon="Quizzes"
          active={activeButton === "Quizzes"}
          onClick={() => setActiveButton("Quizzes")}
        >
          <File />
        </SideNavButton>
        <SideNavButton
          icon="Schedule"
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
          <FileChartColumn />
        </SideNavButton>
      </SideNav>
      <main className="flex-1 bg-white p-4 ml-64  ">
        <h1 className="text-3xl font-bold mb-6 text-black">
          Student Dashboard
        </h1>
        {activeButton == "Quizzes" && <ExamSchedule />}
        {activeButton == "Schedule" && <Schedule />}
        {activeButton == "Marks" && <Marks />}
        {activeButton == "Attendance" && <AttendanceView />}
      </main>
    </div>
  );
}

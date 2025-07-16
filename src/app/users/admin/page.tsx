"use client";
import SideNav from "@/components/layout/SideNav";
import StudentInfo from "@/components/teacher/StudentsInfo";
import { SideNavButton } from "@/components/ui/SideNavButton";
import React, { useState } from "react";

export default function AdminPage() {
  const [activeButton, setActiveButton] = useState<string>("Dashboard");

  return (
    <div className="flex min-h-screen">
      <SideNav>
        <SideNavButton
          icon="home"
          active={activeButton === "Dashboard"}
          onClick={() => setActiveButton("Dashboard")}
        >
          home
        </SideNavButton>
        <SideNavButton
          icon="grading"
          active={activeButton === "Marks"}
          onClick={() => setActiveButton("Marks")}
        >
          Marks
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
      </SideNav>
      <main className="flex-1 bg-white p-4 ml-64">
        {activeButton == "Schedule" && <StudentInfo />}
      </main>
    </div>
  );
}

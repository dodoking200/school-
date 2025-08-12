"use client";
import SideNav from "@/components/layout/SideNav";
import { SideNavButton } from "@/components/ui/SideNavButton";
import React, { useState } from "react";
import { House, BookCheck, NotepadText, CalendarCheck } from "lucide-react";
import Students from "@/components/teacher/Students";
import QuestionsView from "@/components/teacher/QuestionsView";

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
      </SideNav>
      <main className="flex-1 bg-white p-4 ml-64 ">
        <h1 className="text-3xl font-bold mb-6 text-black">
          teacher Dashboard
        </h1>
        {activeButton == "Quizzes" && <QuestionsView />}
        {activeButton == "Marks" && <Students />}
      </main>
    </div>
  );
}

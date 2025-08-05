"use client";
import SideNav from "@/components/layout/SideNav";
import StudentInfo from "@/components/admin/StudentsInfo";
import UserInfo from "@/components/admin/UserInfo";
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
          icon="student"
          active={activeButton === "student"}
          onClick={() => setActiveButton("student")}
        >
          Students
        </SideNavButton>
        <SideNavButton
          icon="user"
          active={activeButton === "user"}
          onClick={() => setActiveButton("user")}
        >
          Users
        </SideNavButton>
      </SideNav>
      <main className="flex-1 bg-white p-4 ml-64 ">
        <h1 className="text-3xl font-bold mb-6 text-black">admin Dashboard</h1>
        {activeButton === "student" && <StudentInfo />}
        {activeButton === "user" && <UserInfo />}
      </main>
    </div>
  );
}

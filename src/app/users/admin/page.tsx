"use client";
import SideNav from "@/components/layout/SideNav";
import StudentInfo from "@/components/admin/StudentsInfo";
import UserInfo from "@/components/admin/UserInfo";
import RolesInfo from "@/components/admin/RolesInfo";
import AcademicYearInfo from "@/components/admin/AcademicYearInfo";
import SubjectsInfo from "@/components/admin/SubjectsInfo";
import ClassesInfo from "@/components/admin/ClassesInfo";
import AttendanceManager from "@/components/admin/AttendanceManager";
import UserAttendanceManager from "@/components/admin/UserAttendanceManager";
import TeacherAttendanceManager from "@/components/admin/TeacherAttendanceManager";
import { SideNavButton } from "@/components/ui/SideNavButton";
import React, { useState } from "react";
import TeacherInfo from "@/components/admin/TeacherInfo";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChartBarIcon,
  UserGroupIcon,
  AcademicCapIcon,
  ClockIcon,
  CalendarDaysIcon,
} from "@heroicons/react/24/outline";

// Dashboard stats for welcome screen
const dashboardStats = [
  {
    title: "Total Students",
    value: "1,234",
    change: "+5.2%",
    icon: UserGroupIcon,
    color: "from-blue-500 to-cyan-500",
    bgColor: "bg-blue-50",
  },
  {
    title: "Active Teachers",
    value: "87",
    change: "+2.1%",
    icon: AcademicCapIcon,
    color: "from-purple-500 to-pink-500",
    bgColor: "bg-purple-50",
  },
  {
    title: "Classes Today",
    value: "24",
    change: "+0.8%",
    icon: ClockIcon,
    color: "from-green-500 to-teal-500",
    bgColor: "bg-green-50",
  },
  {
    title: "Attendance Rate",
    value: "94.2%",
    change: "+1.5%",
    icon: ChartBarIcon,
    color: "from-orange-500 to-red-500",
    bgColor: "bg-orange-50",
  },
];

export default function AdminPage() {
  const [activeButton, setActiveButton] = useState<string>("Dashboard");

  const renderDashboardContent = () => {
    if (activeButton === "Dashboard") {
      return (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-8"
        >
          {/* Welcome Section */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="glass-card p-8"
          >
            <div className="flex items-center gap-4">
              <div className="w-3 h-12 bg-gradient-primary rounded-full" />
              <div>
                <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                  Welcome to Admin Dashboard ✨
                </h1>
                <p className="text-lg text-gray-600 dark:text-gray-300">
                  Manage your school with powerful modern tools and insights.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Statistics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {dashboardStats.map((stat, index) => {
              const IconComponent = stat.icon;
              return (
                <motion.div
                  key={stat.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                  whileHover={{ scale: 1.02, y: -5 }}
                  className="glass-card group cursor-pointer"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div
                      className={`w-12 h-12 rounded-2xl ${stat.bgColor} dark:bg-gray-800 flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}
                    >
                      <IconComponent className={`w-6 h-6 text-blue-500`} />
                    </div>
                    <div
                      className={`text-right text-sm font-semibold px-2 py-1 rounded-lg bg-gradient-to-r ${stat.color} text-white`}
                    >
                      {stat.change}
                    </div>
                  </div>

                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                      {stat.title}
                    </p>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white">
                      {stat.value}
                    </p>
                  </div>

                  {/* Decorative bottom line */}
                  <div
                    className={`mt-4 h-1 bg-gradient-to-r ${stat.color} rounded-full opacity-20 group-hover:opacity-40 transition-opacity duration-300`}
                  />
                </motion.div>
              );
            })}
          </div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="glass-card p-6"
          >
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              Quick Actions
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
              {[
                {
                  title: "Manage Students",
                  desc: "Add, edit, and view student records",
                  action: () => setActiveButton("student"),
                },
                {
                  title: "Manage Teachers",
                  desc: "Handle teacher information and assignments",
                  action: () => setActiveButton("teacher"),
                },
                {
                  title: "Student Attendance",
                  desc: "Track and manage student attendance",
                  action: () => setActiveButton("attendance"),
                },
                {
                  title: "User Attendance",
                  desc: "Track and manage user/employee attendance",
                  action: () => setActiveButton("user_attendance"),
                },
                {
                  title: "Teacher Attendance",
                  desc: "Track and manage teacher attendance",
                  action: () => setActiveButton("teacher_attendance"),
                },
              ].map((action, index) => (
                <motion.button
                  key={action.title}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={action.action}
                  className="p-4 text-left rounded-2xl bg-white/50 dark:bg-gray-800/50 border border-white/20 dark:border-gray-700/20 hover:bg-white/70 dark:hover:bg-gray-700/70 transition-all duration-300 group"
                >
                  <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {action.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                    {action.desc}
                  </p>
                </motion.button>
              ))}
            </div>
          </motion.div>
        </motion.div>
      );
    }

    // Component mapping
    const components = {
      student: <StudentInfo />,
      teacher: <TeacherInfo />,
      user: <UserInfo />,
      roles: <RolesInfo />,
      academic_year: <AcademicYearInfo />,
      subjects: <SubjectsInfo />,
      classes: <ClassesInfo />,
      attendance: <AttendanceManager />,
      user_attendance: <UserAttendanceManager />,
      teacher_attendance: <TeacherAttendanceManager />,
    };

    return components[activeButton as keyof typeof components] || null;
  };

  return (
    <div className="flex min-h-screen relative">
      {/* Animated Background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900" />
        <div className="absolute inset-0 opacity-30 dark:opacity-20">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-300 dark:bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl animate-pulse" />
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-yellow-300 dark:bg-yellow-600 rounded-full mix-blend-multiply filter blur-3xl animate-pulse animation-delay-2000" />
          <div className="absolute -bottom-8 left-1/3 w-96 h-96 bg-pink-300 dark:bg-pink-600 rounded-full mix-blend-multiply filter blur-3xl animate-pulse animation-delay-4000" />
        </div>
      </div>

      <SideNav>
        <SideNavButton
          icon="home"
          active={activeButton === "Dashboard"}
          onClick={() => setActiveButton("Dashboard")}
        >
          Dashboard
        </SideNavButton>

        <SideNavButton
          icon="student"
          active={activeButton === "student"}
          onClick={() => setActiveButton("student")}
        >
          Students
        </SideNavButton>

        <SideNavButton
          icon="teacher"
          active={activeButton === "teacher"}
          onClick={() => setActiveButton("teacher")}
        >
          Teachers
        </SideNavButton>

        <SideNavButton
          icon="user"
          active={activeButton === "user"}
          onClick={() => setActiveButton("user")}
        >
          Users
        </SideNavButton>

        <SideNavButton
          icon="shield"
          active={activeButton === "roles"}
          onClick={() => setActiveButton("roles")}
        >
          Roles
        </SideNavButton>

        <SideNavButton
          icon="calendar"
          active={activeButton === "academic_year"}
          onClick={() => setActiveButton("academic_year")}
        >
          Academic Year
        </SideNavButton>

        <SideNavButton
          icon="auto_stories"
          active={activeButton === "subjects"}
          onClick={() => setActiveButton("subjects")}
        >
          Subjects
        </SideNavButton>

        <SideNavButton
          icon="class"
          active={activeButton === "classes"}
          onClick={() => setActiveButton("classes")}
        >
          Classes
        </SideNavButton>

        <SideNavButton
          icon="attendance"
          active={activeButton === "attendance"}
          onClick={() => setActiveButton("attendance")}
        >
          Student Attendance
        </SideNavButton>

        <SideNavButton
          icon="user"
          active={activeButton === "user_attendance"}
          onClick={() => setActiveButton("user_attendance")}
        >
          User Attendance
        </SideNavButton>

        <SideNavButton
          icon="teacher"
          active={activeButton === "teacher_attendance"}
          onClick={() => setActiveButton("teacher_attendance")}
        >
          Teacher Attendance
        </SideNavButton>
      </SideNav>

      <main className="flex-1 ml-64 min-h-screen relative z-10">
        <div className="p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeButton}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              {renderDashboardContent()}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}

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
import TuitionPaymentManager from "@/components/admin/TuitionPaymentManager";
import { SideNavButton } from "@/components/ui/SideNavButton";
import React, { useState, useEffect } from "react";
import TeacherInfo from "@/components/admin/TeacherInfo";
import { motion, AnimatePresence } from "framer-motion";
import { apiClient } from "@/lib/apiClient";
import { useRouter } from "next/navigation";
import {
  ChartBarIcon,
  UserGroupIcon,
  AcademicCapIcon,
  ClockIcon,
} from "@heroicons/react/24/outline";
import { Can } from "@/lib/can";

// Dashboard stats configuration (data will be loaded from API)
const dashboardStatsConfig = [
  {
    title: "Total Students",
    key: "totalStudents",
    icon: UserGroupIcon,
    color: "from-blue-500 to-cyan-500",
    bgColor: "bg-blue-50",
  },
  {
    title: "Active Teachers",
    key: "activeTeachers",
    icon: AcademicCapIcon,
    color: "from-purple-500 to-pink-500",
    bgColor: "bg-purple-50",
  },
  {
    title: "Classes Today",
    key: "classesToday",
    icon: ClockIcon,
    color: "from-green-500 to-teal-500",
    bgColor: "bg-green-50",
  },
  {
    title: "Attendance Rate",
    key: "attendanceRate",
    icon: ChartBarIcon,
    color: "from-orange-500 to-red-500",
    bgColor: "bg-orange-50",
  },
];

type StatPrimitive = number | string;
type StatObject = { value: number | string; change?: string };
type DashboardStats = {
  totalStudents?: StatPrimitive | StatObject;
  activeTeachers?: StatPrimitive | StatObject;
  classesToday?: StatPrimitive | StatObject;
  attendanceRate?: StatPrimitive | StatObject;
  [key: string]: unknown;
};

export default function AdminPage() {
  const [activeButton, setActiveButton] = useState<string>("Dashboard");
  const [dashboardStats, setDashboardStats] = useState<DashboardStats | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Helper function to get authentication token
  const getToken = () => {
    // Check both localStorage and sessionStorage, matching the auth system
    return localStorage.getItem("token") || sessionStorage.getItem("token");
  };

  // Fetch dashboard statistics
  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        setLoading(true);
        setError(null);

        const token = getToken();
        if (!token) {
          setError("No authentication token found. Please login again.");
          // Redirect to login after a delay
          setTimeout(() => {
            router.push("/");
          }, 2000);
          return;
        }

        // Use the existing apiClient which handles auth automatically
        const response = await apiClient<
          DashboardStats | { data: DashboardStats }
        >("/dashboard/stats");

        console.log("Dashboard API Response:", response);

        if (response.success && response.data) {
          console.log("API response.data:", response.data);
          // Some endpoints wrap payload in { data: ... }. Support both shapes safely.
          const payload = response.data as unknown;
          const statsData =
            payload &&
            typeof payload === "object" &&
            "data" in (payload as Record<string, unknown>)
              ? ((payload as { data: DashboardStats }).data as DashboardStats)
              : (payload as DashboardStats);
          console.log("Extracted stats data:", statsData);
          setDashboardStats(statsData);
        } else {
          console.error("API response not successful:", response);
          throw new Error("Failed to fetch dashboard statistics");
        }
      } catch (err) {
        console.error("Error fetching dashboard stats:", err);
        let errorMessage = "Failed to load dashboard statistics";

        if (err instanceof Error) {
          console.error("Error details:", {
            message: err.message,
            stack: err.stack,
          });

          if (
            err.message.includes("Authentication failed") ||
            err.message.includes("401")
          ) {
            errorMessage = "Session expired. Please login again.";
            setTimeout(() => {
              router.push("/");
            }, 2000);
          } else if (
            err.message.includes("permission") ||
            err.message.includes("403")
          ) {
            errorMessage =
              "You do not have permission to view dashboard statistics.";
          } else if (err.message.includes("Network error")) {
            errorMessage =
              "Unable to connect to server. Please check your connection.";
          } else {
            errorMessage = err.message;
          }
        }

        setError(errorMessage);

        // DON'T set fallback stats when there's an error - let the error state show instead
        // The error display will show the retry button
      } finally {
        setLoading(false);
      }
    };

    if (activeButton === "Dashboard") {
      fetchDashboardStats();
    }
  }, [activeButton, router]);

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
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {dashboardStatsConfig.map((_, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                  className="glass-card group cursor-pointer"
                >
                  <div className="animate-pulse">
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 rounded-2xl bg-gray-200 dark:bg-gray-700"></div>
                      <div className="w-16 h-6 bg-gray-200 dark:bg-gray-700 rounded"></div>
                    </div>
                    <div className="space-y-2">
                      <div className="w-24 h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
                      <div className="w-16 h-8 bg-gray-200 dark:bg-gray-700 rounded"></div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : error ? (
            <div className="glass-card p-8 text-center">
              <p className="text-red-600 dark:text-red-400 mb-4">
                ⚠️ Failed to load dashboard statistics
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {error}
              </p>
              <button
                onClick={() => window.location.reload()}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Retry
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {dashboardStatsConfig.map((config, index) => {
                const IconComponent = config.icon;
                const statData = dashboardStats?.[config.key];
                const value =
                  statData &&
                  typeof statData === "object" &&
                  "value" in statData
                    ? (statData as { value: number | string }).value
                    : statData;
                const change =
                  statData &&
                  typeof statData === "object" &&
                  "change" in statData
                    ? (statData as { change: string }).change
                    : "+0.0%";
                console.log(`Stat ${config.key}:`, {
                  statData,
                  value,
                  change,
                  dashboardStats,
                });

                return (
                  <motion.div
                    key={config.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                    whileHover={{ scale: 1.02, y: -5 }}
                    className="glass-card group cursor-pointer"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div
                        className={`w-12 h-12 rounded-2xl ${config.bgColor} dark:bg-gray-800 flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}
                      >
                        <IconComponent className={`w-6 h-6 text-blue-500`} />
                      </div>
                      <div
                        className={`text-right text-sm font-semibold px-2 py-1 rounded-lg bg-gradient-to-r ${config.color} text-white`}
                      >
                        {change}
                      </div>
                    </div>

                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                        {config.title}
                      </p>
                      <p className="text-3xl font-bold text-gray-900 dark:text-white">
                        {typeof value === "number" || typeof value === "string"
                          ? typeof value === "number"
                            ? value.toLocaleString()
                            : value
                          : "0"}
                      </p>
                    </div>

                    {/* Decorative bottom line */}
                    <div
                      className={`mt-4 h-1 bg-gradient-to-r ${config.color} rounded-full opacity-20 group-hover:opacity-40 transition-opacity duration-300`}
                    />
                  </motion.div>
                );
              })}
            </div>
          )}

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
              ].map((action) => (
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
      tuition_payments: <TuitionPaymentManager />,
    };

    return components[activeButton as keyof typeof components] || null;
  };

  return (
    <Can permission="view_dashboard">
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
          <Can permission="view_dashboard">
            <SideNavButton
              icon="home"
              active={activeButton === "Dashboard"}
              onClick={() => setActiveButton("Dashboard")}
            >
              Dashboard
            </SideNavButton>
          </Can>
          <Can permission="manage_students">
            <SideNavButton
              icon="student"
              active={activeButton === "student"}
              onClick={() => setActiveButton("student")}
            >
              Students
            </SideNavButton>
          </Can>
          <Can permission="manage_teachers">
            <SideNavButton
              icon="teacher"
              active={activeButton === "teacher"}
              onClick={() => setActiveButton("teacher")}
            >
              Teachers
            </SideNavButton>
          </Can>
          <Can permission="manage_users">
            <SideNavButton
              icon="user"
              active={activeButton === "user"}
              onClick={() => setActiveButton("user")}
            >
              Users
            </SideNavButton>
          </Can>
          <Can permission="manage_roles">
            <SideNavButton
              icon="shield"
              active={activeButton === "roles"}
              onClick={() => setActiveButton("roles")}
            >
              Roles
            </SideNavButton>
          </Can>
          <Can permission="manage_academic_years">
            <SideNavButton
              icon="calendar"
              active={activeButton === "academic_year"}
              onClick={() => setActiveButton("academic_year")}
            >
              Academic Year
            </SideNavButton>
          </Can>
          <Can permission="manage_subjects">
            <SideNavButton
              icon="auto_stories"
              active={activeButton === "subjects"}
              onClick={() => setActiveButton("subjects")}
            >
              Subjects
            </SideNavButton>
          </Can>
          <Can permission="manage_classes">
            <SideNavButton
              icon="class"
              active={activeButton === "classes"}
              onClick={() => setActiveButton("classes")}
            >
              Classes
            </SideNavButton>
          </Can>
          <Can permission="manage_student_attendance">
            <SideNavButton
              icon="attendance"
              active={activeButton === "attendance"}
              onClick={() => setActiveButton("attendance")}
            >
              Student Attendance
            </SideNavButton>
          </Can>
          <Can permission="manage_staff_attendance">
            <SideNavButton
              icon="user"
              active={activeButton === "user_attendance"}
              onClick={() => setActiveButton("user_attendance")}
            >
              User Attendance
            </SideNavButton>
          </Can>
          <Can permission="manage_staff_attendance">
            <SideNavButton
              icon="teacher"
              active={activeButton === "teacher_attendance"}
              onClick={() => setActiveButton("teacher_attendance")}
            >
              Teacher Attendance
            </SideNavButton>
          </Can>
          <Can permission="manage_tuition_payments">
            <SideNavButton
              icon="currency_dollar"
              active={activeButton === "tuition_payments"}
              onClick={() => setActiveButton("tuition_payments")}
            >
              Tuition Payments
            </SideNavButton>
          </Can>
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
    </Can>
  );
}

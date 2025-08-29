"use client";
import { useAuth } from "@/lib/useAuth";
import {
  ArrowRightStartOnRectangleIcon,
  UserCircleIcon,
} from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";
import { User } from "@/types";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import ThemeToggle from "@/components/ui/ThemeToggle";

interface SideNavProps {
  children: React.ReactNode;
}

export default function SideNav({ children }: SideNavProps) {
  const { logout, getCurrentUser } = useAuth();
  const [user, setUser] = useState<User | null>(null);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const currentUser = getCurrentUser();
    setUser(currentUser);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const getRoleColor = (role: string) => {
    switch (role?.toLowerCase()) {
      case "admin":
        return "bg-gradient-to-r from-red-500 to-pink-500";
      case "teacher":
        return "bg-gradient-to-r from-purple-500 to-indigo-500";
      case "student":
        return "bg-gradient-to-r from-blue-500 to-cyan-500";
      default:
        return "bg-gradient-to-r from-gray-500 to-slate-500";
    }
  };

  return (
    <motion.aside
      initial={{ x: -300, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="flex flex-col h-screen w-64 fixed z-50 bg-white/10 dark:bg-gray-900/10 backdrop-blur-2xl border border-white/20 dark:border-gray-700/20 border-r-white/30 dark:border-r-gray-600/30"
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5 dark:opacity-10">
        <div
          className="absolute inset-0 dark:hidden"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23000' fill-opacity='0.1' fill-rule='evenodd'%3E%3Cpath d='m0 40l40-40h-40v40zm40 0v-40h-40l40 40z'/%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
        <div
          className="absolute inset-0 hidden dark:block"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23fff' fill-opacity='0.05' fill-rule='evenodd'%3E%3Cpath d='m0 40l40-40h-40v40zm40 0v-40h-40l40 40z'/%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
      </div>

      {/* Fixed Top Section - User Profile */}
      <div className="relative z-10 p-6 flex-shrink-0">
        {/* Modern User Profile Card */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
          className="p-4 rounded-2xl bg-white/10 dark:bg-gray-800/10 backdrop-blur-sm border border-white/20 dark:border-gray-700/20 shadow-lg hover:bg-white/15 dark:hover:bg-gray-700/15 transition-all duration-300"
        >
          <div className="flex items-center gap-4">
            {/* Avatar with Dynamic Gradient */}
            <div
              className={cn(
                "relative w-12 h-12 rounded-2xl flex items-center justify-center text-white font-bold text-sm shadow-lg",
                getRoleColor(user?.role || "")
              )}
            >
              {user?.name ? (
                getInitials(user.name)
              ) : (
                <UserCircleIcon className="w-6 h-6" />
              )}

              {/* Online Status Indicator */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.5, type: "spring", stiffness: 500 }}
                className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white dark:border-gray-800 shadow-sm"
              />
            </div>

            {/* User Info */}
            <div className="flex-1 min-w-0">
              <motion.p
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="font-bold text-gray-900 dark:text-gray-100 truncate text-base"
              >
                {user?.name || "Loading..."}
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className={cn(
                  "inline-flex px-2 py-1 rounded-lg text-xs font-semibold text-white mt-1",
                  getRoleColor(user?.role || "")
                )}
              >
                {user?.role || "Role not available"}
              </motion.div>
            </div>
          </div>

          {/* Decorative Gradient Line */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.4, duration: 0.6, ease: "easeOut" }}
            className="mt-3 h-1 bg-gradient-primary rounded-full opacity-20"
          />
        </motion.div>
      </div>

      {/* Scrollable Middle Section - Navigation Menu */}
      <div className="relative z-10 flex-1 min-h-0">
        {/* Top gradient indicator for scroll */}
        <div className="absolute top-0 left-0 right-0 h-6 bg-gradient-to-b from-white/20 to-transparent dark:from-gray-900/20 pointer-events-none z-10" />

        <motion.nav
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, staggerChildren: 0.1 }}
          className="h-full overflow-y-auto scrollbar-thin scrollbar-thumb-white/20 dark:scrollbar-thumb-gray-600/20 scrollbar-track-transparent hover:scrollbar-thumb-white/30 dark:hover:scrollbar-thumb-gray-600/30 px-6 py-2"
        >
          <motion.div className="flex flex-col gap-1 pb-4">
            {children}
          </motion.div>
        </motion.nav>

        {/* Bottom gradient indicator for scroll */}
        <div className="absolute bottom-0 left-0 right-0 h-6 bg-gradient-to-t from-white/20 to-transparent dark:from-gray-900/20 pointer-events-none z-10" />
      </div>

      {/* Fixed Bottom Section - Theme Toggle and Logout */}
      <div className="relative z-10 flex-shrink-0">
        {/* Theme Toggle */}
        <div className="px-6 pb-4">
          <div className="flex items-center justify-between mb-4 pt-3">
            <span className="text-sm font-semibold text-gray-600 dark:text-gray-300">
              Theme
            </span>
            <ThemeToggle />
          </div>
        </div>

        {/* Modern Logout Button */}
        <div className="p-6">
          <motion.button
            whileHover={{
              scale: 1.05,
              backgroundColor: "rgba(239, 68, 68, 0.1)",
              borderColor: "rgba(239, 68, 68, 0.3)",
            }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            onClick={logout}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className="flex items-center gap-3 w-full px-4 py-3 rounded-2xl font-semibold text-sm transition-all duration-300 bg-white/5 dark:bg-gray-800/20 backdrop-blur-sm border border-white/10 dark:border-gray-700/20 text-gray-600 dark:text-gray-300 hover:text-red-500 dark:hover:text-red-400 hover:shadow-lg group"
          >
            <motion.div
              animate={{ rotate: isHovered ? 180 : 0 }}
              transition={{ duration: 0.3 }}
              className="w-10 h-10 rounded-xl bg-red-50 dark:bg-red-900/20 flex items-center justify-center group-hover:bg-red-100 dark:group-hover:bg-red-800/30 transition-colors duration-300"
            >
              <ArrowRightStartOnRectangleIcon className="w-5 h-5 text-red-500" />
            </motion.div>

            <span>Logout</span>

            {/* Hover Effect Arrow */}
            <AnimatePresence>
              {isHovered && (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.2 }}
                  className="ml-auto"
                >
                  <ArrowRightStartOnRectangleIcon className="w-4 h-4 text-red-500" />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        </div>
      </div>

      {/* Decorative Elements */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
        className="absolute top-10 right-10 w-32 h-32 opacity-5 pointer-events-none"
        style={{
          background: "conic-gradient(from 0deg, #667eea, #764ba2, #667eea)",
          borderRadius: "50%",
        }}
      />

      <motion.div
        animate={{ rotate: -360 }}
        transition={{ duration: 45, repeat: Infinity, ease: "linear" }}
        className="absolute bottom-20 left-6 w-24 h-24 opacity-5 pointer-events-none"
        style={{
          background: "conic-gradient(from 180deg, #f093fb, #f5576c, #f093fb)",
          borderRadius: "30%",
        }}
      />
    </motion.aside>
  );
}

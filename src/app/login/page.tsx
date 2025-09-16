import Header from "@/components/layout/Header";
import LoginForm from "@/components/loginform/LoginForm";
import React from "react";

// LoginPage component
export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col" style={{ background: "var(--background)" }}>
      {/* Header Section */}
      <Header />

      {/* Main Content Area for Login Form */}
      <main className="flex-grow flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 py-12 relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full opacity-20 blur-3xl" style={{ background: "var(--gradient-primary)" }} />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full opacity-20 blur-3xl" style={{ background: "var(--gradient-secondary)" }} />
          <div className="absolute top-3/4 left-3/4 w-64 h-64 rounded-full opacity-15 blur-2xl" style={{ background: "var(--gradient-success)" }} />
        </div>

        {/* Login Form Container */}
        <div className="relative z-10">
          <LoginForm />
        </div>
      </main>
    </div>
  );
}

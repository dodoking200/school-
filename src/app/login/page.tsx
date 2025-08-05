import Header from "@/components/layout/Header";
import LoginForm from "@/components/loginform/LoginForm";
import React from "react";

// LoginPage component
export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Header Section */}
      <Header />

      {/* Main Content Area for Login Form */}
      <main className="flex-grow flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
        {/* Login Form Container */}
        <LoginForm />
      </main>
    </div>
  );
}

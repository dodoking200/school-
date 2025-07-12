"use client";
import React, { useState } from "react";
import InputField from "../ui/InputField";

export default function LoginForm() {
  const [username, setUserName] = useState("");
  const [password, setPassword] = useState("");
  function handelUsername(username: string) {
    setUserName(username);
  }
  function handelPassword(password: string) {
    setPassword(password);
  }
  return (
    <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-xl">
      {/* Login Title */}
      <div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Welcome Back
        </h2>
      </div>
      {/* Login Form */}
      <form className="mt-8 space-y-6" action="#" method="POST">
        <div className="rounded-md  -space-y-px">
          {/* Username Field */}
          <InputField
            label="Username"
            value={username}
            onChange={handelUsername}
          />
          {/* Password Field */}
          <InputField
            label="Password"
            value={password}
            onChange={handelPassword}
          />
        </div>

        {/* Remember Me Checkbox and Forgot Password Link */}
        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center">
            <input
              id="remember-me"
              name="remember-me"
              type="checkbox"
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            />
            <label
              htmlFor="remember-me"
              className="ml-2 block text-sm text-gray-900"
            >
              Remember Me
            </label>
          </div>
        </div>

        {/* Login Button */}
        <div>
          <button
            type="submit"
            className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-4xl text-white bg-[var(--primary)] hover:bg-[var(--primary-hover)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--primary-hover] mt-6"
          >
            Login
          </button>
        </div>
      </form>
    </div>
  );
}

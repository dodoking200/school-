"use client";
import React from "react";

interface SideNavButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: React.ReactNode;
  children: React.ReactNode;
  active?: boolean;
  onClick: () => void; // Add onClick to props
}
export function SideNavButton({
  icon,
  children,
  active = false,
  onClick,
  ...props
}: SideNavButtonProps) {
  return (
    <button
      className={`flex items-center gap-3 text-black  px-4 py-2 rounded-2xl w-full text-left transition font-medium ${
        active ? "bg-gray-200 " : " hover:bg-gray-100"
      }`}
      onClick={onClick}
      {...props}
    >
      <span className="material-icons text-lg">{children}</span>
      {icon}
    </button>
  );
}

import React from "react";
interface ConnectWithUsItemProps {
  title: string;
  children: React.ReactNode;
}

export default function ConnectWithUsItem({
  title,
  children,
}: ConnectWithUsItemProps) {
  return (
    <a
      href="#"
      className="text-gray-600 hover:text-[var(--primary-hover)] flex flex-col items-center"
    >
      <span className="material-icons text-4xl bg-[#e8ecea] rounded-4xl p-1">
        {children}
      </span>
      <span>{title}</span>
    </a>
  );
}

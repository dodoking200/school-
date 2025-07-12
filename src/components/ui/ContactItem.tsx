import React from "react";
interface ContactItemProps {
  title: string;
  description: string;
  children: React.ReactNode;
}
export default function ContactItem({
  children,
  title,
  description,
}: ContactItemProps) {
  return (
    <li className="flex items-start">
      <div className="flex-shrink-0">
        <div className="bg-gray-300 text-black p-3 rounded-lg">{children} </div>
      </div>
      <div className="ml-4">
        <h4 className="text-lg font-medium text-gray-700">{title}</h4>
        <p className="text-gray-600">{description}</p>
      </div>
    </li>
  );
}

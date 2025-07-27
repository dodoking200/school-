import React from "react";
interface TableProps {
  title: string;
  children: React.ReactNode;
  filter?: React.ReactNode;
}

export default function Table({ title, children, filter }: TableProps) {
  return (
    <div className="p-6">
      <div className="mb-4">
        <div className=" flex-wrap flex justify-between">
          <div>
            <h2 className="text-xl font-semibold mb-3 text-black">{title}</h2>
          </div>
          <div className=" text-black">{filter}</div>
        </div>
        <div className="bg-white rounded-4xl shadow-md overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            {children}
          </table>
        </div>
      </div>
    </div>
  );
}

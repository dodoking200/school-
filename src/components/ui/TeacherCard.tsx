import React from "react";
import Image from "next/image";
interface TeacherCardProps {
  teacherName: string;
  imageUrl: string;
  children: React.ReactNode;
}

export default function TeacherCard({
  teacherName,
  imageUrl,
  children,
}: TeacherCardProps) {
  return (
    <div className="text-center max-w-xs">
      <Image
        src={imageUrl}
        alt={teacherName}
        width={300}
        height={300}
        className="w-60 h-60 rounded-full mx-auto mb-4 object-cover"
      />
      <h3 className="text-xl font-semibold text-gray-800">{teacherName}</h3>
      <p className="text-gray-600 text-sm">{children}</p>
    </div>
  );
}

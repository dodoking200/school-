import React from "react";
import Image from "next/image";
interface NewsCardProps {
  title: string;
  description: string;
  imageUrl: string;
}

export default function NewsCard({
  title,
  description,
  imageUrl,
}: NewsCardProps) {
  return (
    <div className="w-110 bg-gray-100 dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
      <Image
        src={imageUrl}
        alt={title}
        className="w-full h-48 object-cover"
        width={400}
        height={400}
      />
      <div className="p-6">
        <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2">{title}</h3>
        <p className="text-gray-600 dark:text-gray-400 text-sm">{description}</p>
      </div>
    </div>
  );
}

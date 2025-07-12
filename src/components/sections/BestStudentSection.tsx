import React from "react";
import Image from "next/image";

export default function BestStudentSection() {
  return (
    <section className="min-h-[600px] py-16 px-8 bg-gray-100 flex flex-col md:flex-row items-center justify-center gap-12">
      <div className="text-center md:text-left max-w-md">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">Best Student</h2>
        <h3 className="text-xl font-semibold text-gray-800 mb-2">
          Ghaith Aljbban- Academic Excellence Award
        </h3>
        <p className="text-gray-600">
          Ghaith Aljbban, a senior, has consistently demonstrated exceptional
          academic performance and leadership qualities.
        </p>
      </div>
      <Image
        src="/student.jpg"
        alt="Ethan Harper"
        className="w-55 h-55 rounded-full object-cover shadow-lg"
        width={550}
        height={550}
      />
    </section>
  );
}

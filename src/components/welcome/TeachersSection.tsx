import React from "react";
import TeacherCard from "../ui/TeacherCard";

export default function TeachersSection() {
  return (
    <section className="py-16 px-8 bg-white dark:bg-gray-800 min-h-[600px] flex-auto justify-center content-center ">
      <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-200 text-center mb-12">
        Our Teachers
      </h2>

      <div className="flex flex-wrap justify-center  gap-14">
        <TeacherCard teacherName="Gayth Mobayed" imageUrl="/teacher1.jpg">
          Head of English, brings Literature to life with her engaging teaching
          style.
        </TeacherCard>

        <TeacherCard teacherName="Moaze Jalate" imageUrl="/teacher2.jpg">
          Math Department Chair, fosters critical thinking and problem-solving
          skills.
        </TeacherCard>

        <TeacherCard teacherName="Jalal Al Kakhe" imageUrl="/teacher3.jpg">
          Science Lead, inspires students with her passion for scientific
          discovery.
        </TeacherCard>
      </div>
    </section>
  );
}

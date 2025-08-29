import React from "react";
import NewsCard from "../ui/NewsCard";

export default function NewsEventsSection() {
  return (
    <section className="py-16 px-8 bg-white dark:bg-gray-800 min-h-[600px]">
      <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-200 text-center mb-12">
        Latest News & Events
      </h2>
      <div className="flex flex-wrap justify-center gap-8">
        <NewsCard
          title="Annual Science Fair"
          description=" Join us for a day of discovery and innovation."
          imageUrl="/Annual Science Fair.jpg"
        />
        <NewsCard
          title="Innovation Challenge Winners"
          description=" Celebrating our student's creativity and problem-solving
              skills."
          imageUrl="/Innovation Challenge Winners.jpg"
        />
        <NewsCard
          title="Fall Sports Season Begins"
          description="Support our teams as they compete this season."
          imageUrl="/Fall Sports Season Begins.jpg"
        />
      </div>
    </section>
  );
}

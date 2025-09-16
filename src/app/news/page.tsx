import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import NewsCard from "@/components/ui/NewsCard";
import React from "react";

const news = [
  {
    title: "Annual Science Fair",
    description: " Join us for a day of discovery and innovation.",
    imageUrl: "/Annual Science Fair.jpg",
  },
  {
    title: "Innovation Challenge Winners",
    description:
      " Celebrating our student's creativity and problem-solving skills.",
    imageUrl: "/Innovation Challenge Winners.jpg",
  },
  {
    title: "Fall Sports Season Begins",
    description: "Support our teams as they compete this season.",
    imageUrl: "/Fall Sports Season Begins.jpg",
  },
];

export default function NewsPage() {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <Header />
      <div className="flex flex-wrap  min-h-screen justify-center items-center gap-8 m-10 ">
        {news.map((x) => (
          <NewsCard
            title={x.title}
            description={x.description}
            imageUrl={x.imageUrl}
            key={x.title}
          />
        ))}
      </div>
      <Footer />
    </div>
  );
}

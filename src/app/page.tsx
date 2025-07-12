"use client";

import BestStudentSection from "@/components/sections/BestStudentSection";
import ConnectWithUS from "@/components/sections/ConnectWithUS";
import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import HeroSection from "@/components/sections/HeroSection";
import NewsEventsSection from "@/components/sections/NewsEventsSection";
import TeachersSection from "@/components/sections/TeachersSection";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <HeroSection />
      <TeachersSection />
      <BestStudentSection />
      <NewsEventsSection />
      <ConnectWithUS />
      <Footer />
    </div>
  );
}

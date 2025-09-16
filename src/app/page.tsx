"use client";

import BestStudentSection from "@/components/welcome/BestStudentSection";
import ConnectWithUS from "@/components/welcome/ConnectWithUS";
import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import HeroSection from "@/components/welcome/HeroSection";
import NewsEventsSection from "@/components/welcome/NewsEventsSection";
import TeachersSection from "@/components/welcome/TeachersSection";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
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

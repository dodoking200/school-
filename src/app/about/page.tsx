import React from "react";
import Image from "next/image"; // For optimized image handling
import { GraduationCap, Users, Heart, Globe } from "lucide-react"; // Icons for Core Values
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

// AboutPage component
export default function AboutPage() {
  // Placeholder data for core values - can be moved to a separate file or fetched from an API
  const coreValues = [
    {
      icon: <GraduationCap size={32} className="text-[var(--primary)] mb-3" />,
      title: "Excellence",
      description:
        "We strive for the highest standards in all academic and extracurricular pursuits.",
    },
    {
      icon: <Users size={32} className="text-[var(--primary)] mb-3" />,
      title: "Community",
      description:
        "We foster a supportive and inclusive environment where every individual is valued.",
    },
    {
      icon: <Heart size={32} className="text-[var(--primary)] mb-3" />,
      title: "Integrity",
      description:
        "We uphold honesty, ethical behavior, and respect in all our interactions.",
    },
    {
      icon: <Globe size={32} className="text-[var(--primary)] mb-3" />,
      title: "Global Awareness",
      description:
        "We encourage students to understand and engage with diverse cultures and global issues.",
    },
  ];

  return (
    <div className="bg-gray-100 min-h-screen">
      <Header />
      {/* Main container for content */}
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
        {/* About Academy Heights Section */}
        <section className="min-h-3/12 mb-12 md:mb-20 text-center md:text-left">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            About Academy Heights
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto md:mx-0">
            Discover our rich history, unwavering mission, core values, and the
            dedicated individuals who shape our community.
          </p>
        </section>

        {/* Our History Section */}
        <section className="min-h-3/12 mb-12 md:mb-20">
          <h2 className="text-3xl font-semibold text-gray-700 mb-6 text-center md:text-left">
            Our History
          </h2>
          <p className="text-gray-600 leading-relaxed mb-8 text-center md:text-left">
            Academy Heights was founded in 1985 by Dr. Eleanor Vance with a
            vision to create a nurturing and challenging educational
            environment. Starting as a small institution with just 50 students,
            the school has grown into a renowned center of learning, serving
            over 500 students today. Our journey has been marked by a commitment
            to academic excellence, innovation, and fostering a supportive
            community.
          </p>
          {/* Images for Our History */}
          <div className="grid bg-white md:grid-cols-2 gap-6 md:gap-8">
            <div className="relative h-80 md:h-80 w-full rounded-lg overflow-hidden shadow-lg">
              {/* Replace with actual image path */}
              <Image
                src="/about2.jpg"
                alt="Academy Heights Campus Exterior"
                layout="fill"
                objectFit="cover"
              />
            </div>
            <div className="relative h-80 md:h-80 w-full rounded-lg overflow-hidden shadow-lg">
              {/* Replace with actual image path */}
              <Image
                src="/about1.jpg"
                alt="Students Collaborating"
                layout="fill"
                objectFit="cover"
              />
            </div>
          </div>
        </section>

        {/* Mission Statement Section */}
        <section className="min-h-3/12 mb-12 md:mb-20">
          <h2 className="text-3xl font-semibold text-gray-700 mb-6 text-center md:text-left">
            Mission Statement
          </h2>
          <p className="text-gray-600 leading-relaxed text-center md:text-left">
            Our mission is to inspire and empower students to achieve their full
            potential, fostering intellectual curiosity, creativity, and a
            lifelong love of learning. We are dedicated to cultivating
            responsible global citizens who contribute positively to their
            communities and the world.
          </p>
        </section>

        {/* Core Values Section */}
        <section className="min-h-3/12">
          <h2 className="text-3xl font-semibold text-gray-700 mb-8 text-center md:text-left">
            Core Values
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {coreValues.map((value) => (
              <div
                key={value.title}
                className="bg-white p-6 rounded-4xl shadow-md text-center hover:shadow-xl transition-shadow duration-300"
              >
                <div className="flex justify-center items-center mb-4">
                  {value.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  {value.title}
                </h3>
                <p className="text-gray-600 text-sm">{value.description}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

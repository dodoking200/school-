import React from "react";

export default function HeroSection() {
  return (
    <section
      className="relative min-h-[750px] bg-cover bg-center flex items-center justify-center text-white m-10 rounded-4xl "
      style={{ backgroundImage: "url('/hero.jpg')" }}
    >
      <div className="absolute inset-0 bg-black opacity-50 rounded-4xl"></div>
      <div className="relative z-10 text-center">
        <h1 className="text-5xl font-bold mb-4">Welcome to Academy Heights</h1>
        <p className="text-xl mb-8">
          Inspiring Excellence, Fostering Community, Shaping Futures
        </p>
        <button className="bg-[var(--primary)] text-white px-8 py-3 rounded-4xl text-lg hover:bg-[var(--primary-hover)] transition">
          Explore Our Campus
        </button>
      </div>
    </section>
  );
}

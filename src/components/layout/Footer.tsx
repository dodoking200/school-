import React from "react";

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white py-8 px-8 text-center text-sm">
      <nav className="flex justify-center gap-8 mb-4">
        <a href="#" className="hover:text-[var(--primary-hover)]">
          Privacy Policy
        </a>
        <a href="#" className="hover:text-[var(--primary-hover)]">
          Terms of Service
        </a>
        <a href="#" className="hover:text-[var(--primary-hover)]">
          Contact Us
        </a>
      </nav>
      <p>&copy; 2025 Academy Heights. All rights reserved.</p>
    </footer>
  );
}

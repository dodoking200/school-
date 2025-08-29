import React from "react";
import Image from "next/image";
import Link from "next/link";
import ThemeToggle from "@/components/ui/ThemeToggle";

export default function Header() {
  return (
    <header 
      className="shadow-md py-4 px-8 flex justify-between items-center backdrop-blur-lg border-b transition-all duration-300"
      style={{
        background: "var(--card-bg)",
        borderColor: "var(--card-border)"
      }}
    >
      <div className="flex items-center gap-2">
        <span className="material-icons text-[var(--primary)]">
          <Image src="/school.png" alt="school" width={35} height={35} />
        </span>
        <span 
          className="font-bold text-xl"
          style={{ color: "var(--foreground)" }}
        >
          Academy Heights
        </span>
      </div>
      <div className="flex justify-center items-center gap-5">
        <nav className="hidden md:flex gap-6 font-medium">
          <Link 
            href="/quiz" 
            className="transition-colors duration-300 hover:text-[var(--primary)]"
            style={{ color: "var(--foreground-muted)" }}
          >
            Quiz
          </Link>
          <Link 
            href="/about" 
            className="transition-colors duration-300 hover:text-[var(--primary)]"
            style={{ color: "var(--foreground-muted)" }}
          >
            About
          </Link>
          <Link 
            href="/contact" 
            className="transition-colors duration-300 hover:text-[var(--primary)]"
            style={{ color: "var(--foreground-muted)" }}
          >
            Contact
          </Link>
          <Link 
            href="/news" 
            className="transition-colors duration-300 hover:text-[var(--primary)]"
            style={{ color: "var(--foreground-muted)" }}
          >
            News & Events
          </Link>
          <Link 
            href="/" 
            className="transition-colors duration-300 hover:text-[var(--primary)]"
            style={{ color: "var(--foreground-muted)" }}
          >
            Home
          </Link>
        </nav>
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <Link href="/login">
            <button className="btn-primary px-6 py-2 rounded-xl font-semibold transition-all duration-300 hover:transform hover:translateY(-1px)">
              Login
            </button>
          </Link>
        </div>
      </div>
    </header>
  );
}

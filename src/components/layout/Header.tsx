import React from "react";
import Image from "next/image";
import Link from "next/link";

export default function Header() {
  return (
    <header className="bg-white shadow-md  py-4 px-8 flex justify-between items-center">
      <div className="flex items-center gap-2">
        <span className="material-icons text-[var(--primary)]">
          <Image src="/school.png" alt="school" width={35} height={35} />
        </span>
        <span className="font-bold text-xl text-gray-800">Academy Heights</span>
      </div>
      <div className=" flex justify-center items-center gap-5">
        <nav className="hidden md:flex gap-6 text-gray-600 font-medium">
          <Link href="/quiz" className="hover:text-[var(--primary)]">
            Quiz
          </Link>
          <Link href="/about" className="hover:text-[var(--primary)]">
            About
          </Link>
          <Link href="/contact" className="hover:text-[var(--primary)]">
            Contact
          </Link>
          <Link href="/news" className="hover:text-[var(--primary)]">
            News & Events
          </Link>
          <Link href="/" className="hover:text-[var(--primary)]">
            Home
          </Link>
        </nav>
        <Link href="/login">
          <button className="bg-[var(--primary)] text-white px-4 py-2 rounded-4xl hover:bg-[var(--primary-hover)] transition">
            Login
          </button>
        </Link>
      </div>
    </header>
  );
}

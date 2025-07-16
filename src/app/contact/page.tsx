import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import ContactUs from "@/components/welcome/ContactUs";
import React from "react";

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <ContactUs />
      <Footer />
    </div>
  );
}

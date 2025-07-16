import React from "react";
import ConnectWithUSItem from "../ui/ConnectWithUsItem";
import { Facebook, Twitter, Instagram } from "lucide-react";
export default function ConnectWithUS() {
  return (
    <section className="py-12 px-8 bg-gray-100 text-center min-h-[100px]">
      <h2 className="text-3xl font-bold text-gray-800 mb-8">Connect With Us</h2>
      <div className="flex justify-center gap-10">
        <ConnectWithUSItem title="Facebook">
          <Facebook size={35} />
        </ConnectWithUSItem>
        <ConnectWithUSItem title="Twitter">
          <Twitter size={35} />
        </ConnectWithUSItem>
        <ConnectWithUSItem title="Instagram">
          <Instagram size={35} />
        </ConnectWithUSItem>
      </div>
    </section>
  );
}

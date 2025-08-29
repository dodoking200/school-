import React from "react";
import { Phone, Mail, MapPin } from "lucide-react"; // Assuming lucide-react for icons
import ContactItem from "../ui/ContactItem";

// ContactUs component
export default function ContactUs() {
  return (
    <section className="py-12 min-h-[750px] m-10 md:py-20 bg-gray-100 dark:bg-gray-900">
      <div className="container mx-auto px-4 md:px-6">
        {/* Section Title */}
        <div className="mb-10 md:mb-16 text-center md:text-left">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-gray-200 mb-2">
            Contact Us
          </h2>
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            We&apos;re here to help. Reach out to us with any questions or
            inquiries you may have.
          </p>
        </div>

        <div className=" flex-row gap-8 md:gap-12 items-start">
          {/* Contact Information Column */}
          <div>
            {/* General Inquiries Subsection */}
            <div className="mb-8">
              <h3 className="text-2xl font-semibold text-gray-700 dark:text-gray-300 mb-3">
                General Inquiries
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                For general questions about Academy Heights, our programs, or
                admissions, please contact us using the information below:
              </p>
              {/* Contact Details List */}
              <ul className="space-y-4">
                {/* Phone */}
                <ContactItem title="Phone" description="555-123-4567">
                  <Phone size={24} />
                </ContactItem>

                <ContactItem
                  title="Email"
                  description="info@academyheights.edu"
                >
                  <Mail size={24} />
                </ContactItem>

                <ContactItem
                  title="Address"
                  description="123 Academy Heights Drive, Anytown, CA 91234"
                >
                  <MapPin size={24} />
                </ContactItem>
              </ul>
            </div>

            {/* Visit Us Subsection */}
            <div>
              <h3 className="text-2xl font-semibold text-gray-700 dark:text-gray-300 mb-3">
                Visit Us
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                We welcome visitors to our campus. Please schedule an
                appointment in advance to ensure we can accommodate your visit.
              </p>
            </div>
          </div>

          {/* Map Column */}
          <div className="mt-8 md:mt-0">
            <div className="bg-gray-200 dark:bg-gray-700 h-80 md:h-96 rounded-lg shadow-md flex items-center justify-center">
              {/* Example of how you might embed an iframe map, replace with actual map embed code */}
              <iframe
                src="https://www.openstreetmap.org/export/embed.html?bbox=36.301716864109046%2C33.51842544375166%2C36.305257380008705%2C33.5203395925472&amp;layer=mapnik&amp;marker=33.519382523444115%2C36.30348712205887"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={true}
                loading="lazy"
                title="Campus Location"
                className="rounded-lg"
              ></iframe>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

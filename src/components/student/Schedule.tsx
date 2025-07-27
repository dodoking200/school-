import React from "react";
import Table from "../ui/Table";

// Define types
interface TimeSlot {
  id: number;
  time: string;
}

interface DayType {
  day: string;
  subjects: string[];
}

export default function Schedule() {
  // Time slots data
  const timeSlots: TimeSlot[] = [
    { id: 1, time: "9:00 AM - 10:00 AM" },
    { id: 2, time: "10:00 AM - 11:00 AM" },
    { id: 3, time: "11:00 AM - 12:00 PM" },
    { id: 4, time: "1:00 PM - 2:00 PM" },
    { id: 5, time: "2:00 PM - 3:00 PM" },
  ];

  // Schedule data
  const days: DayType[] = [
    {
      day: "Monday",
      subjects: ["Mathematics", "Physics", "Chemistry", "English", "History"],
    },
    {
      day: "Tuesday",
      subjects: ["Mathematics", "Physics", "Chemistry", "English", "History"],
    },
    {
      day: "Wednesday",
      subjects: ["Mathematics", "Physics", "Chemistry", "English", "History"],
    },
    {
      day: "Thursday",
      subjects: ["Mathematics", "Physics", "Chemistry", "English", "History"],
    },
    {
      day: "Friday",
      subjects: ["Mathematics", "Physics", "Chemistry", "English", "History"],
    },
  ];

  return (
    <Table title="Schedule">
      <thead>
        <tr className="bg-gray-200">
          <th
            scope="col"
            className="px-6 py-4  text-left text-sm  text-black font-bold uppercase tracking-wider"
          >
            Day
          </th>
          {timeSlots.map((slot) => (
            <th
              key={slot.id}
              scope="col"
              className="px-6 py-4  text-left text-sm font-medium text-black uppercase tracking-wider"
            >
              {slot.time}
            </th>
          ))}
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-200">
        {days.map((day, index) => (
          <tr
            key={index}
            className="hover:bg-gray-50 transition duration-150 ease-in-out"
          >
            <td className="px-6 py-4 whitespace-nowrap  font-medium text-gray-900">
              {day.day}
            </td>
            {day.subjects.map((subject, idx) => (
              <td
                key={idx}
                className="px-6 py-4 whitespace-nowrap  text-gray-500"
              >
                {subject}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </Table>
  );
}

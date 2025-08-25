"use client";

import React, { useEffect, useState } from "react";
import { TeacherScheduleDay } from "@/types";
import { scheduleService } from "@/lib/services/scheduleService";
import Table from "../ui/Table";

const TeacherSchedule: React.FC = () => {
  const [schedule, setSchedule] = useState<TeacherScheduleDay[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Normalize day names for better matching (handles typos and case differences)
  const normalizeDayName = (name: string) => {
    const normalized = name.toLowerCase().replace(/[^a-z]/g, "");

    // Handle common typos in day names
    const dayCorrections: { [key: string]: string } = {
      wedenesday: "wednesday",
      tuesay: "tuesday",
      monday: "monday", // already correct
      thursday: "thursday", // already correct
      friday: "friday", // already correct
      saturday: "saturday", // already correct
      sunday: "sunday", // already correct
    };

    return dayCorrections[normalized] || normalized;
  };

  useEffect(() => {
    const fetchSchedule = async () => {
      try {
        setLoading(true);
        const data = await scheduleService.getTeacherSchedule();
        setSchedule(data);
        setError(null);
      } catch (err) {
        setError("Failed to fetch schedule");
        console.error("Error fetching schedule:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSchedule();
  }, []);

  const formatTime = (time: string) => {
    return new Date(`2000-01-01T${time}`).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  // Create time slots from the schedule data
  const getTimeSlots = () => {
    const allTimes = new Set<string>();
    schedule.forEach((day) => {
      day.subjects.forEach((subject) => {
        allTimes.add(
          `${formatTime(subject.start_time)} - ${formatTime(subject.end_time)}`
        );
      });
    });
    return Array.from(allTimes).sort();
  };

  // Get subject for a specific day and time slot
  const getSubjectForDayAndTime = (dayName: string, timeSlot: string) => {
    const normalizedDayName = normalizeDayName(dayName);
    const day = schedule.find(
      (d) => normalizeDayName(d.name) === normalizedDayName
    );

    if (!day) {
      console.log(
        `No day found for "${dayName}" (normalized: "${normalizedDayName}")`
      );
      console.log(
        "Available days:",
        schedule.map((d) => ({
          original: d.name,
          normalized: normalizeDayName(d.name),
        }))
      );
      return "-";
    }

    const subject = day.subjects.find((s) => {
      const formattedTime = `${formatTime(s.start_time)} - ${formatTime(
        s.end_time
      )}`;
      const matches = formattedTime === timeSlot;
      if (!matches) {
        console.log(
          `Time mismatch for ${dayName}: expected "${timeSlot}", got "${formattedTime}"`
        );
      }
      return matches;
    });

    return subject ? subject.subject_name : "-";
  };

  // Standard days of the week - match the API response exactly
  const weekDays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday"];

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg
              className="h-5 w-5 text-red-400"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">Error</h3>
            <div className="mt-2 text-sm text-red-700">{error}</div>
          </div>
        </div>
      </div>
    );
  }

  if (schedule.length === 0) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg
              className="h-5 w-5 text-yellow-400"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-yellow-800">
              No Schedule Available
            </h3>
            <div className="text-sm text-yellow-700">
              No schedule has been assigned yet. Please contact an
              administrator.
            </div>
          </div>
        </div>
      </div>
    );
  }

  const timeSlots = getTimeSlots();
  console.log("Generated time slots:", timeSlots);

  return (
    <Table
      title="My Teaching Schedule"
      isLoading={loading}
      emptyMessage="No schedule available"
      tableWrapperClassName="bg-white shadow-lg"
      tableHeader={
        <>
          <th
            scope="col"
            className="px-6 py-4 w-[20%] text-center text-sm text-black font-bold uppercase tracking-wider"
          >
            Day
          </th>
          {timeSlots.map((timeSlot, index) => (
            <th
              key={index}
              scope="col"
              className="px-6 py-4 text-center text-sm font-medium text-black uppercase tracking-wider"
            >
              {timeSlot}
            </th>
          ))}
        </>
      }
      tableContent={
        <>
          {weekDays.map((day, dayIndex) => {
            // Check if this day has any subjects
            const hasSubjects = schedule.some(
              (d) => normalizeDayName(d.name) === normalizeDayName(day)
            );

            return (
              <tr
                key={dayIndex}
                className={`hover:bg-gray-50 transition duration-150 ease-in-out ${
                  hasSubjects ? "bg-blue-50" : ""
                }`}
              >
                <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                  {day}
                </td>
                {timeSlots.map((timeSlot, timeIndex) => (
                  <td
                    key={timeIndex}
                    className="px-6 py-4 whitespace-nowrap text-gray-500"
                  >
                    {getSubjectForDayAndTime(day, timeSlot)}
                  </td>
                ))}
              </tr>
            );
          })}
        </>
      }
    />
  );
};

export default TeacherSchedule;

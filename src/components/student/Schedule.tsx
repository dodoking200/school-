import React, { useState, useEffect, useCallback } from "react";
import Table from "../ui/Table";
import {
  studentScheduleService,
  StudentScheduleData,
  Subject,
} from "../../lib/services/studentScheduleService";
import { toast } from "react-toastify";

export default function Schedule() {
  const [scheduleData, setScheduleData] = useState<StudentScheduleData[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeSlots, setTimeSlots] = useState<string[]>([]);

  // Fetch schedule data from student schedule endpoint
  const fetchScheduleData = useCallback(async () => {
    try {
      setLoading(true);
      const data = await studentScheduleService.getStudentSchedule();

      // Extract all unique time slots across all days
      const uniqueTimeSlots = new Set<string>();
      
      data.forEach((day) => {
        day.subjects.forEach((subject) => {
          const timeSlot = `${subject.start_time} - ${subject.end_time}`;
          uniqueTimeSlots.add(timeSlot);
        });
      });

      // Sort time slots by start time
      const sortedTimeSlots = Array.from(uniqueTimeSlots).sort((a, b) => {
        const timeA = a.split(" - ")[0];
        const timeB = b.split(" - ")[0];
        return timeA.localeCompare(timeB);
      });

      setTimeSlots(sortedTimeSlots);
      setScheduleData(data);
    } catch (err: unknown) {
      console.error("Failed to fetch schedule data:", err);
      const errorMessage =
        err instanceof Error ? err.message : "Failed to fetch schedule data";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchScheduleData();
  }, [fetchScheduleData]);

  // Helper function to find subject for a specific day and time slot
  const getSubjectForTimeSlot = (dayName: string, timeSlot: string): Subject | undefined => {
    const day = scheduleData.find((d) => d.day_name.toLowerCase() === dayName.toLowerCase());
    if (!day) return undefined;
    
    return day.subjects.find((subject) => {
      const subjectTimeSlot = `${subject.start_time} - ${subject.end_time}`;
      return subjectTimeSlot === timeSlot;
    });
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        <p className="mt-2 text-gray-600">Loading schedule data...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-black">Student Schedule</h2>
        <button
          onClick={fetchScheduleData}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm"
        >
          Refresh
        </button>
      </div>

      {scheduleData.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No schedule data available.
        </div>
      ) : (
        <Table
          title="Schedule"
          tableHeader={
            <>
              <th
                scope="col"
                className="px-6 py-4 text-center text-sm text-black font-bold uppercase tracking-wider"
              >
                Day
              </th>
              {timeSlots.map((timeSlot) => (
                <th
                  key={timeSlot}
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
              {scheduleData.map((dayData) => (
                <tr
                  key={dayData.day_id}
                  className="hover:bg-gray-50 transition duration-150 ease-in-out"
                >
                  <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900 capitalize">
                    {dayData.day_name}
                  </td>
                  {timeSlots.map((timeSlot) => {
                    const subject = getSubjectForTimeSlot(dayData.day_name, timeSlot);
                    return (
                      <td
                        key={timeSlot}
                        className="px-6 py-4 whitespace-nowrap text-gray-500"
                      >
                        {subject ? (
                          <div className="text-center">
                            <p className="font-medium text-blue-600">
                              {subject.subject_name || 'N/A'}
                            </p>
                          </div>
                        ) : (
                          <div className="text-center text-gray-400">-</div>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </>
          }
        />
      )}
    </div>
  );
}

import React, { useState, useEffect, useCallback } from "react";
import Table from "../ui/Table";
import {
  studentScheduleService,
  StudentScheduleData,
} from "../../lib/services/studentScheduleService";
import { toast } from "react-toastify";

interface OrganizedScheduleData {
  [dayName: string]: {
    [timeSlot: string]: StudentScheduleData;
  };
}

export default function Schedule() {
  const [scheduleData, setScheduleData] = useState<OrganizedScheduleData>({});
  const [loading, setLoading] = useState(true);
  const [days, setDays] = useState<string[]>([]);
  const [timeSlots, setTimeSlots] = useState<string[]>([]);

  // Fetch schedule data from student schedule endpoint
  const fetchScheduleData = useCallback(async () => {
    try {
      setLoading(true);
      const data = await studentScheduleService.getStudentSchedule();

      // Organize data by day and time slot
      const organizedData: OrganizedScheduleData = {};
      const uniqueDays = new Set<string>();
      const uniqueTimeSlots = new Set<string>();

      data.forEach((item: StudentScheduleData) => {
        const dayName = item.day_name;
        const timeSlot = `${item.start_time} - ${item.end_time}`;

        uniqueDays.add(dayName);
        uniqueTimeSlots.add(timeSlot);

        if (!organizedData[dayName]) {
          organizedData[dayName] = {};
        }
        organizedData[dayName][timeSlot] = item;
      });

      setDays(Array.from(uniqueDays).sort());
      setTimeSlots(
        Array.from(uniqueTimeSlots).sort((a, b) => {
          const timeA = a.split(" - ")[0];
          const timeB = b.split(" - ")[0];
          return timeA.localeCompare(timeB);
        })
      );
      setScheduleData(organizedData);
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

      {days.length === 0 ? (
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
                className="px-6 py-4  text-center text-sm  text-black font-bold uppercase tracking-wider"
              >
                Day
              </th>
              {timeSlots.map((timeSlot) => (
                <th
                  key={timeSlot}
                  scope="col"
                  className="px-6 py-4  text-center text-sm font-medium text-black uppercase tracking-wider"
                >
                  {timeSlot}
                </th>
              ))}
            </>
          }
          tableContent={
            <>
              {days.map((day) => (
                <tr
                  key={day}
                  className="hover:bg-gray-50 transition duration-150 ease-in-out"
                >
                  <td className="px-6 py-4 whitespace-nowrap  font-medium text-gray-900">
                    {day}
                  </td>
                  {timeSlots.map((timeSlot) => {
                    const scheduleItem = scheduleData[day]?.[timeSlot];
                    return (
                      <td
                        key={timeSlot}
                        className="px-6 py-4 whitespace-nowrap  text-gray-500"
                      >
                        {scheduleItem ? (
                          <div className="text-center">
                            <p className="font-medium text-blue-600">
                              {scheduleItem.subject_name}
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

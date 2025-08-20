import React, { useState, useEffect, useCallback } from "react";
import { Class, Schedule, Day, Period, Subject, Teacher } from "@/types";
import Table from "../ui/Table";
import ScheduleEditModal from "./ScheduleEditModal";
import { scheduleService } from "@/lib/services/scheduleService";
import { dayService } from "@/lib/services/dayService";
import { periodService } from "@/lib/services/periodService";
import { subjectService } from "@/lib/services/subjectService";
import { teacherService } from "@/lib/services/teacherService";
import { toast } from "react-toastify";

interface ScheduleInputTableProps {
  classData: Class;
}

interface ScheduleData {
  [dayId: number]: {
    [periodId: number]: Schedule;
  };
}

const ScheduleInputTable: React.FC<ScheduleInputTableProps> = ({
  classData,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCell, setSelectedCell] = useState<{
    dayId: number;
    periodId: number;
  } | null>(null);
  const [scheduleData, setScheduleData] = useState<ScheduleData>({});
  const [days, setDays] = useState<Day[]>([]);
  const [periods, setPeriods] = useState<Period[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingSchedule, setEditingSchedule] = useState<Schedule | null>(null);

  // Fetch all required data
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [schedules, daysData, periodsData, subjectsData, teachersData] =
        await Promise.all([
          scheduleService.getSchedulesByClass(classData.id),
          dayService.getAllDays(),
          periodService.getAllPeriods(),
          subjectService.getSubjects(),
          teacherService.getTeachers(),
        ]);

      setDays(daysData);
      setPeriods(periodsData);
      setSubjects(subjectsData);
      setTeachers(teachersData);

      // Organize schedule data by day and period
      const organizedData: ScheduleData = {};
      schedules.forEach((schedule) => {
        if (!organizedData[schedule.day_id]) {
          organizedData[schedule.day_id] = {};
        }
        organizedData[schedule.day_id][schedule.period_id] = schedule;
      });

      setScheduleData(organizedData);
    } catch (error) {
      console.error("Failed to fetch data:", error);
      toast.error("Failed to fetch schedule data");
    } finally {
      setLoading(false);
    }
  }, [classData.id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleOpenModal = (dayId: number, periodId: number) => {
    const existingSchedule = scheduleData[dayId]?.[periodId];
    setEditingSchedule(existingSchedule || null);
    setSelectedCell({ dayId, periodId });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedCell(null);
    setEditingSchedule(null);
    setIsModalOpen(false);
  };

  const handleSubmitModal = async (data: {
    subject_id: number;
    teacher_id: number;
  }) => {
    if (!selectedCell) return;

    try {
      if (editingSchedule) {
        // Update existing schedule
        await scheduleService.updateSchedule(editingSchedule.id, {
          subject_id: data.subject_id,
          teacher_id: data.teacher_id,
        });
        toast.success("Schedule updated successfully");
      } else {
        // Create new schedule
        await scheduleService.createSchedule({
          class_id: classData.id,
          day_id: selectedCell.dayId,
          period_id: selectedCell.periodId,
          subject_id: data.subject_id,
          teacher_id: data.teacher_id,
        });
        toast.success("Schedule created successfully");
      }

      // Refresh data
      await fetchData();
      handleCloseModal();
    } catch (error) {
      console.error("Failed to save schedule:", error);
      toast.error("Failed to save schedule");
    }
  };

  const handleDeleteSchedule = async (schedule: Schedule) => {
    if (!confirm("Are you sure you want to delete this schedule?")) return;

    try {
      await scheduleService.deleteSchedule(schedule.id);
      toast.success("Schedule deleted successfully");
      await fetchData();
    } catch (error) {
      console.error("Failed to delete schedule:", error);
      toast.error("Failed to delete schedule");
    }
  };

  const getSubjectName = (subjectId: number) => {
    return subjects.find((s) => s.id === subjectId)?.name || "Unknown";
  };

  const getTeacherName = (teacherId: number) => {
    return teachers.find((t) => t.id === teacherId)?.name || "Unknown";
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
        <h2 className="text-xl font-semibold text-black">
          Schedule for {classData.name}
        </h2>
        <button
          onClick={fetchData}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm"
        >
          Refresh
        </button>
      </div>

      <Table
        tableHeader={
          <>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Day
            </th>
            {periods.map((period) => (
              <th
                key={period.id}
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                {period.start_time} - {period.end_time}
              </th>
            ))}
          </>
        }
        tableContent={
          <>
            {days.map((day) => (
              <tr key={day.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {day.name}
                </td>
                {periods.map((period) => {
                  const schedule = scheduleData[day.id]?.[period.id];
                  return (
                    <td
                      key={period.id}
                      className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
                    >
                      {schedule ? (
                        <div className="space-y-1">
                          <p className="font-medium">
                            {getSubjectName(schedule.subject_id)}
                          </p>
                          <p className="text-xs text-gray-600">
                            {getTeacherName(schedule.teacher_id)}
                          </p>
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleOpenModal(day.id, period.id)}
                              className="text-blue-600 hover:text-blue-900 text-xs"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteSchedule(schedule)}
                              className="text-red-600 hover:text-red-900 text-xs"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      ) : (
                        <button
                          onClick={() => handleOpenModal(day.id, period.id)}
                          className="text-green-600 hover:text-green-900 text-xs"
                        >
                          Add
                        </button>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </>
        }
      />

      {selectedCell && (
        <ScheduleEditModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onSubmit={handleSubmitModal}
          day={days.find((d) => d.id === selectedCell.dayId)?.name || ""}
          timeSlot={`${
            periods.find((p) => p.id === selectedCell.periodId)?.start_time ||
            ""
          } - ${
            periods.find((p) => p.id === selectedCell.periodId)?.end_time || ""
          }`}
          subjects={subjects}
          teachers={teachers}
          editingSchedule={editingSchedule}
        />
      )}
    </div>
  );
};

export default ScheduleInputTable;

import React, { useState, useEffect } from "react";
import { Subject, Teacher, Schedule } from "@/types";

interface ScheduleEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { subject_id: number; teacher_id: number }) => void;
  day: string;
  timeSlot: string;
  subjects: Subject[];
  teachers: Teacher[];
  editingSchedule: Schedule | null;
}

const ScheduleEditModal: React.FC<ScheduleEditModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  day,
  timeSlot,
  subjects,
  teachers,
  editingSchedule,
}) => {
  const [subjectId, setSubjectId] = useState<number>(0);
  const [teacherId, setTeacherId] = useState<number>(0);

  useEffect(() => {
    if (editingSchedule) {
      setSubjectId(editingSchedule.subject_id);
      setTeacherId(editingSchedule.teacher_id);
    } else {
      setSubjectId(0);
      setTeacherId(0);
    }
  }, [editingSchedule]);

  if (!isOpen) return null;

  const handleSubmit = () => {
    if (subjectId && teacherId) {
      onSubmit({ subject_id: subjectId, teacher_id: teacherId });
    }
  };

  const isFormValid = subjectId > 0 && teacherId > 0;

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-md w-96">
        <h2 className="text-xl font-semibold mb-4">
          {editingSchedule ? "Edit" : "Add"} Schedule for {day} at {timeSlot}
        </h2>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Subject
          </label>
          <select
            value={subjectId}
            onChange={(e) => setSubjectId(Number(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value={0}>Select a subject</option>
            {subjects.map((subject) => (
              <option key={subject.id} value={subject.id}>
                {subject.name}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Teacher
          </label>
          <select
            value={teacherId}
            onChange={(e) => setTeacherId(Number(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value={0}>Select a teacher</option>
            {teachers.map((teacher) => (
              <option key={teacher.id} value={teacher.id}>
                {teacher.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="bg-gray-500 hover:bg-gray-700 text-white px-4 py-2 rounded-md"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!isFormValid}
            className={`px-4 py-2 rounded-md text-white ${
              isFormValid
                ? "bg-blue-600 hover:bg-blue-800"
                : "bg-gray-400 cursor-not-allowed"
            }`}
          >
            {editingSchedule ? "Update" : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ScheduleEditModal;

import React, { useState } from 'react';

interface ScheduleEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { subject: string, teacher: string }) => void;
  day: string;
  timeSlot: string;
}

const ScheduleEditModal: React.FC<ScheduleEditModalProps> = ({ isOpen, onClose, onSubmit, day, timeSlot }) => {
  const [subject, setSubject] = useState('');
  const [teacher, setTeacher] = useState('');

  if (!isOpen) return null;

  const handleSubmit = () => {
    onSubmit({ subject, teacher });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-md">
        <h2 className="text-xl font-semibold mb-4">Edit Schedule for {day} at {timeSlot}</h2>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Subject</label>
          <input
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Teacher</label>
          <input
            type="text"
            value={teacher}
            onChange={(e) => setTeacher(e.target.value)}
            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
        <div className="flex justify-end">
          <button onClick={onClose} className="bg-gray-500 hover:bg-gray-700 text-white px-4 py-2 rounded-md mr-2">
            Cancel
          </button>
          <button onClick={handleSubmit} className="bg-blue-600 hover:bg-blue-800 text-white px-4 py-2 rounded-md">
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default ScheduleEditModal;

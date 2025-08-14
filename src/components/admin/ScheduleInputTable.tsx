import React, { useState } from 'react';
import { Class } from '@/types';
import Table from '../ui/Table';
import ScheduleEditModal from './ScheduleEditModal';

interface ScheduleInputTableProps {
  classData: Class;
}

const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
const timeSlots = ["8:00 - 9:00", "9:00 - 10:00", "10:00 - 11:00", "11:00 - 12:00", "12:00 - 1:00"];

const initialScheduleData = {
  "Monday": {
    "8:00 - 9:00": { subject: "Math", teacher: "Mr. Smith" },
    "9:00 - 10:00": { subject: "Science", teacher: "Ms. Jones" },
  },
  "Tuesday": {
    "10:00 - 11:00": { subject: "English", teacher: "Mr. Williams" },
  }
};

const ScheduleInputTable: React.FC<ScheduleInputTableProps> = ({ classData }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCell, setSelectedCell] = useState<{ day: string, timeSlot: string } | null>(null);
  const [scheduleData, setScheduleData] = useState(initialScheduleData);

  const handleOpenModal = (day: string, timeSlot: string) => {
    setSelectedCell({ day, timeSlot });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedCell(null);
    setIsModalOpen(false);
  };

  const handleSubmitModal = (data: { subject: string, teacher: string }) => {
    if (selectedCell) {
      setScheduleData(prevData => ({
        ...prevData,
        [selectedCell.day]: {
          ...prevData[selectedCell.day],
          [selectedCell.timeSlot]: data,
        }
      }));
    }
    handleCloseModal();
  };

  return (
    <div>
      <h2 className="text-xl font-semibold text-black mb-4">
        Schedule for {classData.name}
      </h2>
      <Table
        tableHeader={
          <>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time Slot</th>
            {days.map(day => (
              <th key={day} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{day}</th>
            ))}
          </>
        }
        tableContent={
          <>
            {timeSlots.map(timeSlot => (
              <tr key={timeSlot}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{timeSlot}</td>
                {days.map(day => {
                  const cellData = scheduleData[day]?.[timeSlot];
                  return (
                    <td key={day} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {cellData ? (
                        <div>
                          <p>{cellData.subject}</p>
                          <p className="text-xs">{cellData.teacher}</p>
                          <button onClick={() => handleOpenModal(day, timeSlot)} className="text-blue-600 hover:text-blue-900 text-xs">Edit</button>
                        </div>
                      ) : (
                        <button onClick={() => handleOpenModal(day, timeSlot)} className="text-green-600 hover:text-green-900 text-xs">Add</button>
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
          day={selectedCell.day}
          timeSlot={selectedCell.timeSlot}
        />
      )}
    </div>
  );
};

export default ScheduleInputTable;

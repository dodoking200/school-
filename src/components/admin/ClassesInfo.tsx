import { useState } from "react";
import Table from "../ui/Table";
import ClassModal from "./ClassModal";
import { Class } from "@/types";
import ScheduleInputTable from "./ScheduleInputTable";

export default function ClassesInfo() {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedClass, setSelectedClass] = useState<Class | null>(null);
  const [selectedScheduleClass, setSelectedScheduleClass] = useState<Class | null>(null);
  const [classes, setClasses] = useState<Class[]>([
    {
      id: 1,
      name: "Class A",
      floor: 1,
      grade: 10,
    },
    {
      id: 2,
      name: "Class B",
      floor: 1,
      grade: 11,
    },
    {
      id: 3,
      name: "Class C",
      floor: 2,
      grade: 9,
    },
  ]);

  const handleAddClass = () => {
    setSelectedClass(null);
    setIsModalOpen(true);
  };

  const handleEditClass = (classData: Class) => {
    setSelectedClass(classData);
    setIsModalOpen(true);
  };

  const handleDeleteClass = (classId: number) => {
    setClasses(classes.filter((c) => c.id !== classId));
  };

  const handleSubmitClass = (classData: Omit<Class, 'id'> & { id?: number }) => {
    if (classData.id) {
      setClasses(classes.map(c =>
        c.id === classData.id ? { ...classData as Class } : c
      ));
    } else {
      const newId = Math.max(0, ...classes.map(c => c.id)) + 1;
      setClasses([...classes, { ...classData, id: newId } as Class]);
    }
  };

  const handleScheduleClick = (classData: Class) => {
    setSelectedScheduleClass(classData);
  };

  const handleBackToClasses = () => {
    setSelectedScheduleClass(null);
  };

  if (selectedScheduleClass) {
    return (
      <div>
        <button
          onClick={handleBackToClasses}
          className="bg-gray-500 hover:bg-gray-700 text-white px-4 py-2 rounded-md mb-4"
        >
          Back to Classes
        </button>
        <ScheduleInputTable classData={selectedScheduleClass} />
      </div>
    );
  }

  return (
    <>
      <ClassModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmitClass}
        classData={selectedClass}
        title={selectedClass ? "Edit Class" : "Add New Class"}
      />
      <Table
        title="Class Info"
        actions={
          <button
            onClick={handleAddClass}
            className="bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white px-4 py-2 rounded-md"
          >
            Add Class
          </button>
        }
        tableHeader={
          <>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Name
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Floor
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Grade
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Actions
            </th>
          </>
        }
        tableContent={
          <>
            {classes.map((classData) => (
              <tr
                key={classData.id}
                className=" text-left hover:bg-gray-50 transition duration-150"
              >
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {classData.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {classData.floor}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {classData.grade}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <button
                    className="text-indigo-600 hover:text-indigo-900"
                    onClick={() => handleEditClass(classData)}
                  >
                    Edit
                  </button>
                  <button
                    className="text-red-600 hover:text-red-900 ml-4"
                    onClick={() => handleDeleteClass(classData.id)}
                  >
                    Remove
                  </button>
                  <button
                    className="text-blue-600 hover:text-blue-900 ml-4"
                    onClick={() => handleScheduleClick(classData)}
                  >
                    Schedule
                  </button>
                </td>
              </tr>
            ))}
          </>
        }
      />
    </>
  );
}

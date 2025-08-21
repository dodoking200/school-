import { useState, useEffect } from "react";
import Table from "../ui/Table";
import ClassModal from "./ClassModal";
import { Class } from "@/types";
import ScheduleInputTable from "./ScheduleInputTable";
import StudentsListModal from "./StudentsListModal";
import { classService } from "@/lib/services/classService";
import { toast } from "react-toastify";

export default function ClassesInfo() {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedClass, setSelectedClass] = useState<Class | null>(null);
  const [selectedScheduleClass, setSelectedScheduleClass] =
    useState<Class | null>(null);
  const [selectedStudentsClass, setSelectedStudentsClass] =
    useState<Class | null>(null);
  const [classes, setClasses] = useState<Class[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [deletionStatus, setDeletionStatus] = useState<
    Record<
      number,
      {
        canDelete: boolean;
        reason: string;
        studentCount?: number;
        scheduleCount?: number;
      }
    >
  >({});

  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    try {
      setLoading(true);
      const data = await classService.getClasses();
      setClasses(data);

      // Fetch deletion status for all classes
      const statusPromises = data.map(async (classData) => {
        try {
          const status = await classService.canDeleteClass(classData.id);
          return { id: classData.id, status };
        } catch (error) {
          console.error(
            `Failed to fetch deletion status for class ${classData.id}:`,
            error
          );
          return {
            id: classData.id,
            status: {
              canDelete: false,
              reason: "Error checking deletion status",
            },
          };
        }
      });

      const statusResults = await Promise.all(statusPromises);
      const statusMap = statusResults.reduce((acc, { id, status }) => {
        acc[id] = status;
        return acc;
      }, {} as Record<number, { canDelete: boolean; reason: string; studentCount?: number; scheduleCount?: number }>);

      setDeletionStatus(statusMap);
    } catch (error) {
      console.error("Failed to fetch classes", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to fetch classes"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleAddClass = () => {
    setSelectedClass(null);
    setIsModalOpen(true);
  };

  const handleEditClass = (classData: Class) => {
    setSelectedClass(classData);
    setIsModalOpen(true);
  };

  const handleDeleteClass = async (classId: number) => {
    try {
      // First check if the class can be deleted
      const deletionStatus = await classService.canDeleteClass(classId);

      if (!deletionStatus.canDelete) {
        toast.error(deletionStatus.reason);
        return;
      }

      // If it can be deleted, proceed with deletion
      await classService.deleteClass(classId);
      fetchClasses();
      toast.success("Class deleted successfully");
    } catch (error) {
      console.error("Failed to delete class", error);

      // Check for specific foreign key constraint error
      if (
        error instanceof Error &&
        error.message.includes("foreign key constraint")
      ) {
        toast.error(
          "Cannot delete this class because it has students assigned to it. Please remove all students from this class first."
        );
      } else {
        toast.error(
          error instanceof Error ? error.message : "Failed to delete class"
        );
      }
    }
  };

  const handleSubmitClass = async (
    classData: Omit<Class, "id"> & { id?: number }
  ) => {
    try {
      if (classData.id) {
        await classService.updateClass(classData.id, classData);
        toast.success("Class updated successfully");
      } else {
        await classService.createClass(classData as Omit<Class, "id">);
        toast.success("Class created successfully");
      }
      fetchClasses();
      setIsModalOpen(false);
    } catch (error) {
      console.error("Failed to save class", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to save class"
      );
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
            {loading ? (
              <tr>
                <td colSpan={4} className="text-center py-4">
                  Loading classes...
                </td>
              </tr>
            ) : classes.length === 0 ? (
              <tr>
                <td colSpan={4} className="text-center py-4">
                  No classes found
                </td>
              </tr>
            ) : (
              classes.map((classData) => (
                <tr
                  key={classData.id}
                  className=" text-left hover:bg-gray-50 transition duration-150"
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {classData.class_name}
                    {(() => {
                      const status = deletionStatus[classData.id];
                      if (
                        status &&
                        !status.canDelete &&
                        status.studentCount &&
                        status.studentCount > 0
                      ) {
                        return (
                          <div className="text-xs text-blue-500 mt-1">
                            {status.studentCount} student(s) assigned
                          </div>
                        );
                      }
                      return null;
                    })()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {classData.floor_number}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {classData.level_grade}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <button
                      className="text-indigo-600 hover:text-indigo-900"
                      onClick={() => handleEditClass(classData)}
                    >
                      Edit
                    </button>
                    <button
                      className={`ml-4 ${
                        deletionStatus[classData.id]?.canDelete
                          ? "text-red-600 hover:text-red-900"
                          : "text-gray-400 cursor-not-allowed"
                      }`}
                      onClick={() => handleDeleteClass(classData.id)}
                      disabled={!deletionStatus[classData.id]?.canDelete}
                      title={
                        deletionStatus[classData.id]?.reason ||
                        "Checking deletion status..."
                      }
                    >
                      Remove
                    </button>
                    <button
                      className="text-blue-600 hover:text-blue-900 ml-4"
                      onClick={() => handleScheduleClick(classData)}
                    >
                      Schedule
                    </button>
                    <button
                      className="text-purple-600 hover:text-purple-900 ml-4"
                      onClick={() => setSelectedStudentsClass(classData)}
                    >
                      Students
                    </button>
                  </td>
                </tr>
              ))
            )}
          </>
        }
      />
      {selectedStudentsClass && (
        <StudentsListModal
          isOpen={!!selectedStudentsClass}
          onClose={() => setSelectedStudentsClass(null)}
          classData={selectedStudentsClass}
        />
      )}
    </>
  );
}

import { useState, useEffect } from "react";
import Table from "../ui/Table";
import ClassModal from "./ClassModal";
import { Class } from "@/types";
import ScheduleInputTable from "./ScheduleInputTable";
import StudentsListModal from "./StudentsListModal";
import { classService } from "@/lib/services/classService";
import { toast } from "react-toastify";
import { AddColorIcon, EditColorIcon, DeleteColorIcon } from "@/components/icons/ColorfulIcons";

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
            className="btn-primary flex items-center gap-2"
          >
            <AddColorIcon size={18} />
            <span>Add Class</span>
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
                    <div className="flex items-center gap-2 flex-wrap">
                      <button
                        className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-lg font-semibold hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 text-sm flex items-center gap-2"
                        onClick={() => handleEditClass(classData)}
                      >
                        <EditColorIcon size={16} />
                        <span>Edit</span>
                      </button>
                      <button
                        className={`px-4 py-2 rounded-lg font-semibold hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 text-sm flex items-center gap-2 ${
                          deletionStatus[classData.id]?.canDelete
                            ? "bg-gradient-to-r from-red-500 to-red-600 text-white"
                            : "bg-gray-300 text-gray-500 cursor-not-allowed"
                        }`}
                        onClick={() => handleDeleteClass(classData.id)}
                        disabled={!deletionStatus[classData.id]?.canDelete}
                        title={
                          deletionStatus[classData.id]?.reason ||
                          "Checking deletion status..."
                        }
                      >
                        <DeleteColorIcon size={16} />
                        <span>Remove</span>
                      </button>
                      <button
                        className="text-blue-600 hover:text-blue-900 font-medium"
                        onClick={() => handleScheduleClick(classData)}
                      >
                        Schedule
                      </button>
                      <button
                        className="text-purple-600 hover:text-purple-900 font-medium"
                        onClick={() => setSelectedStudentsClass(classData)}
                      >
                        Students
                      </button>
                    </div>
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

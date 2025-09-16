import { useState, useEffect } from "react";
import Table from "../ui/Table";
import TeacherModal from "./TeacherModal";
import { Teacher, TeacherCreatePayload } from "@/types";
import { teacherService } from "@/lib/services/teacherService";
import { subjectService } from "@/lib/services/subjectService";
import { toast } from "react-toastify";
import { EditColorIcon, DeleteColorIcon, AddColorIcon } from "@/components/icons/ColorfulIcons";

export default function TeacherInfo() {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);
  const [teachers, setTeachers] = useState<Teacher[]>([]);

  const [loading, setLoading] = useState<boolean>(true);
  const [modalLoading, setModalLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [subjects, setSubjects] = useState<{ id: number; name: string }[]>([]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [techerData, subjectData] = await Promise.all([
        teacherService.getTeachers(),
        subjectService.getSubjectsList(),
      ]);
      setTeachers(techerData);
      setSubjects(subjectData);
      setError(null);
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : typeof err === "string"
          ? err
          : "An unknown error occurred";
      setError(errorMessage);
      toast.error(`Failed to load data: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Handle opening the modal for adding a new teacher
  const handleAddTeacher = () => {
    setSelectedTeacher(null);
    setIsModalOpen(true);
  };

  // Handle opening the modal for editing an existing teacher
  const handleEditTeacher = (teacher: Teacher) => {
    setSelectedTeacher(teacher);
    setIsModalOpen(true);
  };

  const handleSubmitTeacher = async (
    teacherData: Teacher | TeacherCreatePayload
  ) => {
    try {
      setModalLoading(true);
      setError(null);

      if ("id" in teacherData) {
        // For updating, check if subject_ids exists, otherwise extract from subjects
        const subject_ids =
          "subject_ids" in teacherData
            ? (teacherData as TeacherCreatePayload).subject_ids
            : teacherData.subjects?.map((s) => s.id) || [];
        console.log("Updating teacher with data:", {
          id: teacherData.id,
          name: teacherData.name,
          email: teacherData.email,
          phone: teacherData.phone,
          birth_date: teacherData.birth_date,
          specialization: teacherData.specialization,
          hire_date: teacherData.hire_date,
          qualification: teacherData.qualification,
          subject_ids: subject_ids,
        });
        await teacherService.updateTeacher(teacherData.id, {
          name: teacherData.name,
          email: teacherData.email,
          phone: teacherData.phone,
          birth_date: teacherData.birth_date,
          specialization: teacherData.specialization,
          hire_date: teacherData.hire_date,
          qualification: teacherData.qualification,
          subject_ids: subject_ids,
        });
      } else {
        const payload: TeacherCreatePayload = {
          name: teacherData.name,
          email: teacherData.email,
          phone: teacherData.phone,
          birth_date: teacherData.birth_date,
          specialization: teacherData.specialization ?? "",
          hire_date: teacherData.hire_date ?? "",
          qualification: teacherData.qualification ?? "",
          subject_ids: teacherData.subject_ids ?? [],
        };
        await teacherService.createTeacher(payload);
      }

      // Refresh the teachers list after successful operation
      await fetchData();
      // Close modal after successful operation
      setIsModalOpen(false);
      setSelectedTeacher(null);
    } catch (error) {
      console.error("Failed to save teacher", error);
      setError(
        error instanceof Error ? error.message : "Failed to save teacher"
      );
      toast.error(
        `Failed to save teacher: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    } finally {
      setModalLoading(false);
    }
  };

  // Handle removing a teacher
  const handleRemoveTeacher = async (teacherId: number) => {
    await teacherService.deleteTeacher(teacherId);
    setTeachers((prev) => prev.filter((t) => t.id !== teacherId));
  };

  return (
    <>
      <TeacherModal
        subjects={subjects}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmitTeacher}
        teacher={selectedTeacher}
        title={selectedTeacher ? "Edit Teacher" : "Add New Teacher"}
        isLoading={modalLoading}
      />
      <Table
        title="Teacher Info"
        actions={
          <div className="flex space-x-2">
            <button
              onClick={handleAddTeacher}
              className="btn-primary flex items-center gap-2"
            >
              <AddColorIcon size={18} />
              <span>Add Teacher</span>
            </button>
          </div>
        }
        tableHeader={
          <>
            <th
              scope="col"
              className="px-6 py-4 text-left text-sm font-bold text-white tracking-wide"
            >
              👨‍🏫 Name
            </th>
            <th
              scope="col"
              className="px-6 py-4 text-left text-sm font-bold text-white tracking-wide"
            >
              📧 Email
            </th>
            <th
              scope="col"
              className="px-6 py-4 text-left text-sm font-bold text-white tracking-wide"
            >
              📱 Phone
            </th>
            <th
              scope="col"
              className="px-6 py-4 text-left text-sm font-bold text-white tracking-wide"
            >
              🎂 Birthdate
            </th>
            <th
              scope="col"
              className="px-6 py-4 text-left text-sm font-bold text-white tracking-wide"
            >
              📚 Subjects
            </th>
            <th
              scope="col"
              className="px-6 py-4 text-left text-sm font-bold text-white tracking-wide"
            >
              ⚡ Actions
            </th>
          </>
        }
        tableContent={
          <>
            {loading ? (
              <tr>
                <td colSpan={7} className="text-center py-4">
                  Loading teachers...
                </td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan={7} className="text-center py-4 text-red-500">
                  Error: {error}
                </td>
              </tr>
            ) : teachers.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-4">
                  No teachers found
                </td>
              </tr>
            ) : (
              teachers.map((teacher) => (
                <tr
                  key={teacher.id}
                  className="text-left hover:bg-primary-50/50 hover:scale-[1.01] transition-all duration-200 group"
                >
                  <td className="px-6 py-5 whitespace-nowrap text-sm font-semibold text-gray-900 group-hover:text-primary-600">
                    {teacher.name}
                  </td>
                  <td className="px-6 py-5 whitespace-nowrap text-sm text-gray-600">
                    {teacher.email}
                  </td>
                  <td className="px-6 py-5 whitespace-nowrap text-sm text-gray-600">
                    {teacher.phone}
                  </td>
                  <td className="px-6 py-5 whitespace-nowrap text-sm text-gray-600">
                    {teacher.birth_date}
                  </td>
                  <td className="px-6 py-5 whitespace-nowrap text-sm text-gray-600">
                    {teacher.subjects
                      ?.map((subject) => subject.name)
                      .join(", ")}
                  </td>
                  <td className="px-6 py-5 whitespace-nowrap text-sm">
                    <div className="flex items-center gap-2">
                      <button
                        className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-lg font-semibold hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 text-sm flex items-center gap-2"
                        onClick={() => handleEditTeacher(teacher)}
                      >
                        <EditColorIcon size={16} />
                        <span>Edit</span>
                      </button>
                      <button
                        className="bg-gradient-to-r from-red-500 to-red-600 text-white px-4 py-2 rounded-lg font-semibold hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 text-sm flex items-center gap-2"
                        onClick={() => handleRemoveTeacher(teacher.id)}
                      >
                        <DeleteColorIcon size={16} />
                        <span>Remove</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </>
        }
      />
    </>
  );
}

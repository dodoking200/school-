import { useState, useEffect } from "react";
import Table from "../ui/Table";
import TeacherModal from "./TeacherModal";
import { Teacher, TeacherCreatePayload } from "@/types";
import { teacherService } from "@/lib/services/teacherService";
import { subjectService } from "@/lib/services/subjectService";
import { toast } from "react-toastify";

export default function TeacherInfo() {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [selectedTeacherIds, setSelectedTeacherIds] = useState<number[]>([]);
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
        const subject_ids = 'subject_ids' in teacherData ? (teacherData as TeacherCreatePayload).subject_ids : (teacherData.subjects?.map(s => s.id) || []);
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
      toast.error(`Failed to save teacher: ${error instanceof Error ? error.message : "Unknown error"}`);
    } finally {
      setModalLoading(false);
    }
  };

  // Handle removing a teacher
  const handleRemoveTeacher = async (teacherId: number) => {
    await teacherService.deleteTeacher(teacherId);
    setTeachers((prev) => prev.filter((t) => t.id !== teacherId));
  };

  const handleCheckboxChange = (teacherId: number) => {
    setSelectedTeacherIds((prevSelectedIds) => {
      if (prevSelectedIds.includes(teacherId)) {
        return prevSelectedIds.filter((id) => id !== teacherId);
      } else {
        return [...prevSelectedIds, teacherId];
      }
    });
  };

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedTeacherIds(teachers.map((teacher) => teacher.id));
    } else {
      setSelectedTeacherIds([]);
    }
  };

  const handleSubmitAttendance = () => {
    console.log("Selected Teacher IDs:", selectedTeacherIds);
    alert(`Selected Teacher IDs: ${selectedTeacherIds.join(", ")}`);
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
              className="bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white px-4 py-2 rounded-md"
            >
              Add Teacher
            </button>
            <button
              onClick={handleSubmitAttendance}
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md"
            >
              Submit Attendance
            </button>
          </div>
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
              Email
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Phone
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Birthdate
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Subjects
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Actions
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              <input
                type="checkbox"
                onChange={handleSelectAll}
                className="form-checkbox h-5 w-5 text-indigo-600 mr-2"
              />
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
                  className=" text-left hover:bg-gray-50 transition duration-150"
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {teacher.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {teacher.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {teacher.phone}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {teacher.birth_date}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {teacher.subjects?.map((subject) => subject.name).join(", ")}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <button
                      className="text-indigo-600 hover:text-indigo-900"
                      onClick={() => handleEditTeacher(teacher)}
                    >
                      Edit
                    </button>
                    <button
                      className="text-red-600 hover:text-red-900 ml-4"
                      onClick={() => handleRemoveTeacher(teacher.id)}
                    >
                      Remove
                    </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <input
                      type="checkbox"
                      className="form-checkbox h-5 w-5 text-indigo-600"
                      checked={selectedTeacherIds.includes(teacher.id)}
                      onChange={() => handleCheckboxChange(teacher.id)}
                    />
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

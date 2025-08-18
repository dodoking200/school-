import { useState, useEffect } from "react";
import Table from "../ui/Table";
import TeacherModal from "./TeacherModal";
import { Teacher } from "@/types";
import { teacherService, UpsertTeacherPayload } from "@/lib/services/teacherService";

export default function TeacherInfo() {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [selectedTeacherIds, setSelectedTeacherIds] = useState<number[]>([]);

  useEffect(() => {
    const fetchTeachers = async () => {
      const data = await teacherService.getTeachers();
      setTeachers(data);
    };
    fetchTeachers();
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

  // Handle submitting the teacher form
  const handleSubmitTeacher = async (teacherData: any) => {
    if (teacherData.id) {
      await teacherService.updateTeacher(teacherData.id, {
        name: teacherData.name,
        email: teacherData.email,
        phone: teacherData.phone,
        birth_date: teacherData.birthdate,
        // subject_ids may be provided from modal if changed
        subject_ids: teacherData.subject_ids,
      });
    } else {
      const payload: UpsertTeacherPayload = {
        name: teacherData.name,
        email: teacherData.email,
        phone: teacherData.phone,
        birth_date: teacherData.birthdate,
        specialization: teacherData.specialization,
        hire_date: teacherData.hire_date,
        qualification: teacherData.qualification,
        subject_ids: teacherData.subject_ids,
      };
      await teacherService.createTeacher(payload);
    }
    const refreshed = await teacherService.getTeachers();
    setTeachers(refreshed);
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
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmitTeacher}
        teacher={
          selectedTeacher
            ? {
                ...selectedTeacher,
                birthdate: selectedTeacher.birth_date,
                subject_ids: selectedTeacher.subject_ids,
                specialization: selectedTeacher.specialization,
                hire_date: selectedTeacher.hire_date,
                qualification: selectedTeacher.qualification,
              }
            : null
        }
        title={selectedTeacher ? "Edit Teacher" : "Add New Teacher"}
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
            {teachers.map((teacher) => (
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
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-.500">
                  {teacher.subjects.join(", ")}
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
            ))}
          </>
        }
      />
    </>
  );
}

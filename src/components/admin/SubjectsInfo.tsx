import { useState, useEffect } from "react";
import Table from "../ui/Table";
import SubjectModal from "./SubjectModal";
import { Subject } from "@/types";
import { subjectService } from "@/lib/services/subjectService";

export default function SubjectsInfo() {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchSubjects();
  }, []);

  const fetchSubjects = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await subjectService.getSubjects();
      setSubjects(data);
    } catch (error) {
      console.error("Failed to fetch subjects", error);
      setError(
        error instanceof Error ? error.message : "Failed to fetch subjects"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleAddSubject = () => {
    setSelectedSubject(null);
    setIsModalOpen(true);
  };

  const handleEditSubject = (subject: Subject) => {
    setSelectedSubject(subject);
    setIsModalOpen(true);
  };

  const handleDeleteSubject = (subjectId: number) => {
    setSubjects(subjects.filter((subject) => subject.id !== subjectId));
  };

  const handleSubmitSubject = (subjectData: {
    id?: number;
    name: string;
    grade: string;
  }) => {
    if (subjectData.id) {
      setSubjects(
        subjects.map((subject) =>
          subject.id === subjectData.id
            ? { ...subject, name: subjectData.name, grade: subjectData.grade }
            : subject
        )
      );
    } else {
      const newId = Math.max(0, ...subjects.map((s) => s.id)) + 1;
      setSubjects([...subjects, { ...subjectData, id: newId }]);
    }
  };

  return (
    <>
      <SubjectModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmitSubject}
        subject={selectedSubject}
        title={selectedSubject ? "Edit Subject" : "Add New Subject"}
      />
      <Table
        title="Subjects"
        actions={
          <button
            onClick={handleAddSubject}
            className="bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white px-4 py-2 rounded-md"
          >
            Add Subject
          </button>
        }
        filter={null}
        tableHeader={
          <>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Subject Name
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
                <td colSpan={3} className="text-center py-4">
                  Loading subjects...
                </td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan={3} className="text-center py-4 text-red-500">
                  Error: {error}
                </td>
              </tr>
            ) : subjects.length === 0 ? (
              <tr>
                <td colSpan={3} className="text-center py-4">
                  No subjects found
                </td>
              </tr>
            ) : (
              subjects.map((subject) => (
                <tr
                  key={subject.id}
                  className=" text-left hover:bg-gray-50 transition duration-150"
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {subject.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {subject.grade || "No grade"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <button
                      className="text-indigo-600 hover:text-indigo-900"
                      onClick={() => handleEditSubject(subject)}
                    >
                      Edit
                    </button>
                    <button
                      className="text-red-600 hover:text-red-900 ml-4"
                      onClick={() => handleDeleteSubject(subject.id)}
                    >
                      Remove
                    </button>
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

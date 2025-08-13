import { useState, useEffect } from "react";
import Table from "../ui/Table";
import SubjectModal from "./SubjectModal";
import { Subject } from "@/types";

export default function SubjectsInfo() {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
  const [subjects, setSubjects] = useState<Subject[]>([]);

  useEffect(() => {
    setSubjects([
      { id: 1, name: "Mathematics" },
      { id: 2, name: "Science" },
      { id: 3, name: "English" },
      { id: 4, name: "History" },
      { id: 5, name: "Art" },
    ]);
  }, []);

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

  const handleSubmitSubject = (subjectData: { id?: number; name: string }) => {
    if (subjectData.id) {
      setSubjects(
        subjects.map((subject) =>
          subject.id === subjectData.id
            ? { ...subject, name: subjectData.name }
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
              ID
            </th>
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
              Actions
            </th>
          </>
        }
        tableContent={
          <>
            {subjects.map((subject) => (
              <tr
                key={subject.id}
                className=" text-left hover:bg-gray-50 transition duration-150"
              >
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {subject.id}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {subject.name}
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
            ))}
          </>
        }
      />
    </>
  );
}

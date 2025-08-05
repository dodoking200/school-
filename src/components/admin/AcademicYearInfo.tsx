import { useState, useEffect } from "react";
import Table from "../ui/Table";
import AcademicYearModal from "./AcademicYearModal";
import { AcademicYear } from "@/types";

export default function AcademicYearInfo() {
  const [academicYears, setAcademicYears] = useState<AcademicYear[]>([]);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedAcademicYear, setSelectedAcademicYear] = useState<AcademicYear | null>(null);

  useEffect(() => {
    setAcademicYears([
      {
        id: 1,
        name: "2023-2024",
        tuition_fee: 10000,
        created_at: "2023-01-01",
        updated_at: "2023-01-01",
      },
      {
        id: 2,
        name: "2024-2025",
        tuition_fee: 10500,
        created_at: "2024-01-01",
        updated_at: "2024-01-01",
      },
    ]);
  }, []);

  const handleAddAcademicYear = () => {
    setSelectedAcademicYear(null);
    setIsModalOpen(true);
  };

  const handleEditAcademicYear = (academicYear: AcademicYear) => {
    setSelectedAcademicYear(academicYear);
    setIsModalOpen(true);
  };

  const handleSubmitAcademicYear = (academicYearData: {
    id?: number;
    name: string;
    tuition_fee: number;
  }) => {
    const now = new Date().toISOString();
    if (academicYearData.id) {
      setAcademicYears(academicYears.map(ay =>
        ay.id === academicYearData.id ? { ...ay, ...academicYearData, updated_at: now } : ay
      ));
    } else {
      const newId = Math.max(0, ...academicYears.map(ay => ay.id)) + 1;
      setAcademicYears([...academicYears, { ...academicYearData, id: newId, created_at: now, updated_at: now }]);
    }
  };

  return (
    <>
      <AcademicYearModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmitAcademicYear}
        academicYear={selectedAcademicYear}
        title={selectedAcademicYear ? "Edit Academic Year" : "Add New Academic Year"}
      />
      <Table
        title="Academic Years"
        actions={
          <button
            onClick={handleAddAcademicYear}
            className="bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white px-4 py-2 rounded-md"
          >
            Add Academic Year
          </button>
        }
        tableHeader={
          <>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Academic Year
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Tuition Fee
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
            {academicYears.map((academicYear) => (
              <tr
                key={academicYear.id}
                className=" text-left hover:bg-gray-50 transition duration-150"
              >
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {academicYear.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {academicYear.tuition_fee}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <button
                    className="text-indigo-600 hover:text-indigo-900"
                    onClick={() => handleEditAcademicYear(academicYear)}
                  >
                    Edit
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

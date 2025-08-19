import { useState, useEffect } from "react";
import Table from "../ui/Table";
import AcademicYearModal from "./AcademicYearModal";
import { AcademicYear, AcademicYearCreatePayload } from "@/types";
import { academicYearService } from "@/lib/services/academicYearService";

export default function AcademicYearInfo() {
  const [academicYears, setAcademicYears] = useState<AcademicYear[]>([]);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedAcademicYear, setSelectedAcademicYear] =
    useState<AcademicYear | null>(null);

  useEffect(() => {
    fetchAcademicYears();
  }, []);

  const fetchAcademicYears = async () => {
    try {
      const data = await academicYearService.getAcademicYears();
      setAcademicYears(data);
    } catch (error) {
      console.error("Failed to fetch academic years", error);
    }
  };

  const handleAddAcademicYear = () => {
    setSelectedAcademicYear(null);
    setIsModalOpen(true);
  };

  const handleEditAcademicYear = (academicYear: AcademicYear) => {
    setSelectedAcademicYear(academicYear);
    setIsModalOpen(true);
  };

  const handleDeleteAcademicYear = async (id: number) => {
    try {
      await academicYearService.deleteAcademicYear(id);
      fetchAcademicYears();
    } catch (error) {
      console.error("Failed to delete academic year", error);
    }
  };

  const handleSubmitAcademicYear = async (
    academicYearData: AcademicYearCreatePayload & { id?: number }
  ) => {
    try {
      if (academicYearData.id) {
        await academicYearService.updateAcademicYear(
          academicYearData.id,
          academicYearData
        );
      } else {
        await academicYearService.createAcademicYear(academicYearData);
      }
      fetchAcademicYears();
    } catch (error) {
      console.error("Failed to save academic year", error);
    }
  };

  return (
    <>
      <AcademicYearModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmitAcademicYear}
        academicYear={selectedAcademicYear}
        title={
          selectedAcademicYear ? "Edit Academic Year" : "Add New Academic Year"
        }
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
              Start Year
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              End Year
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
                  {academicYear.start_year}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {academicYear.end_year}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {academicYear.full_tuition}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <button
                    className="text-indigo-600 hover:text-indigo-900"
                    onClick={() => handleEditAcademicYear(academicYear)}
                  >
                    Edit
                  </button>
                  <button
                    className="text-red-600 hover:text-red-900 ml-4"
                    onClick={() => handleDeleteAcademicYear(academicYear.id)}
                  >
                    Delete
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

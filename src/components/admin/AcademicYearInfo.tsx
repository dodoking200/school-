import { useState, useEffect } from "react";
import Table from "../ui/Table";
import AcademicYearModal from "./AcademicYearModal";
import { AcademicYear, AcademicYearCreatePayload } from "@/types";
import { academicYearService } from "@/lib/services/academicYearService";
import { AddColorIcon, EditColorIcon, DeleteColorIcon } from "@/components/icons/ColorfulIcons";

export default function AcademicYearInfo() {
  const [academicYears, setAcademicYears] = useState<AcademicYear[]>([]);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedAcademicYear, setSelectedAcademicYear] =
    useState<AcademicYear | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    fetchAcademicYears();
  }, []);

  const fetchAcademicYears = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await academicYearService.getAcademicYears();
      setAcademicYears(data);
    } catch (error) {
      console.error("Failed to fetch academic years", error);
      setError(
        error instanceof Error
          ? error.message
          : "Failed to fetch academic years"
      );
    } finally {
      setLoading(false);
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
      setError(null);
      await academicYearService.deleteAcademicYear(id);
      fetchAcademicYears();
    } catch (error) {
      console.error("Failed to delete academic year", error);
      setError(
        error instanceof Error
          ? error.message
          : "Failed to delete academic year"
      );
    }
  };

  const handleSubmitAcademicYear = async (
    academicYearData: AcademicYearCreatePayload & { id?: number }
  ) => {
    try {
      setError(null);
      if (academicYearData.id) {
        await academicYearService.updateAcademicYear(
          academicYearData.id,
          academicYearData
        );
      } else {
        await academicYearService.createAcademicYear(academicYearData);
      }
      fetchAcademicYears();
      setIsModalOpen(false);
    } catch (error) {
      console.error("Failed to save academic year", error);
      setError(
        error instanceof Error ? error.message : "Failed to save academic year"
      );
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
            className="btn-primary flex items-center gap-2"
          >
            <AddColorIcon size={18} />
            <span>Add Academic Year</span>
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
            {loading ? (
              <tr>
                <td
                  colSpan={4}
                  className="px-6 py-4 text-center text-sm text-gray-500"
                >
                  <div className="flex justify-center items-center">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900"></div>
                    <span className="ml-2">Loading academic years...</span>
                  </div>
                </td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan={4} className="text-center py-4 text-red-500">
                  Error: {error}
                </td>
              </tr>
            ) : academicYears.length === 0 ? (
              <tr>
                <td
                  colSpan={4}
                  className="px-6 py-4 text-center text-sm text-gray-500"
                >
                  No academic years found
                </td>
              </tr>
            ) : (
              academicYears.map((academicYear) => (
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
                    <div className="flex items-center gap-2">
                      <button
                        className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-lg font-semibold hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 text-sm flex items-center gap-2"
                        onClick={() => handleEditAcademicYear(academicYear)}
                      >
                        <EditColorIcon size={16} />
                        <span>Edit</span>
                      </button>
                      <button
                        className="bg-gradient-to-r from-red-500 to-red-600 text-white px-4 py-2 rounded-lg font-semibold hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 text-sm flex items-center gap-2"
                        onClick={() => handleDeleteAcademicYear(academicYear.id)}
                      >
                        <DeleteColorIcon size={16} />
                        <span>Delete</span>
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

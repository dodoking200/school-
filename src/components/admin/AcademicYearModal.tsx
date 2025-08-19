import { useState, useEffect } from "react";
import { AcademicYear, AcademicYearCreatePayload } from "@/types";

interface AcademicYearModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (
    academicYearData: AcademicYearCreatePayload & { id?: number }
  ) => void;
  academicYear: AcademicYear | null;
  title: string;
}

export default function AcademicYearModal({
  isOpen,
  onClose,
  onSubmit,
  academicYear,
  title,
}: AcademicYearModalProps) {
  const [startYear, setStartYear] = useState("");
  const [endYear, setEndYear] = useState("");
  const [fullTuition, setFullTuition] = useState<number>(0);

  useEffect(() => {
    if (academicYear) {
      setStartYear(academicYear.start_year);
      setEndYear(academicYear.end_year);
      setFullTuition(academicYear.full_tuition);
    } else {
      setStartYear("");
      setEndYear("");
      setFullTuition(0);
    }
  }, [academicYear]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      id: academicYear?.id,
      start_year: startYear,
      end_year: endYear,
      full_tuition: fullTuition,
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50  flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">{title}</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Start Year
            </label>
            <input
              type="date"
              value={startYear}
              onChange={(e) => setStartYear(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              End Year
            </label>
            <input
              type="date"
              value={endYear}
              onChange={(e) => setEndYear(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Full Tuition
            </label>
            <input
              type="number"
              value={fullTuition}
              onChange={(e) => setFullTuition(Number(e.target.value))}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
          </div>
          <div className="flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="mr-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-[var(--primary)] rounded-md hover:bg-[var(--primary-hover)]"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

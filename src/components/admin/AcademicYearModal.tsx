import { useState, useEffect } from "react";
import { AcademicYear } from "@/types";

interface AcademicYearModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (academicYearData: {
    id?: number;
    name: string;
    tuition_fee: number;
  }) => void;
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
  const [name, setName] = useState("");
  const [tuitionFee, setTuitionFee] = useState<number>(0);

  useEffect(() => {
    if (academicYear) {
      setName(academicYear.name);
      setTuitionFee(academicYear.tuition_fee);
    } else {
      setName("");
      setTuitionFee(0);
    }
  }, [academicYear]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ id: academicYear?.id, name, tuition_fee: tuitionFee });
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
              Academic Year Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Tuition Fee
            </label>
            <input
              type="number"
              value={tuitionFee}
              onChange={(e) => setTuitionFee(Number(e.target.value))}
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

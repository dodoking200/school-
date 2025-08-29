"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  TuitionPayment,
  TuitionPaymentCreatePayload,
  StudentBalance,
  OutstandingPayment,
} from "@/lib/services/tuitionPaymentService";
import { tuitionPaymentService } from "@/lib/services/tuitionPaymentService";
import { studentService } from "@/lib/services/studentService";
import { Student } from "@/types";
import {
  SearchColorIcon,
  AddColorIcon,
  EditColorIcon,
  DeleteColorIcon,
} from "@/components/icons/ColorfulIcons";
import Table from "../ui/Table";

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (payment: TuitionPaymentCreatePayload) => void;
  students: Student[];
  loading: boolean;
}

const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  students,
  loading,
}) => {
  const [formData, setFormData] = useState<TuitionPaymentCreatePayload>({
    amount: 0,
    payment_date: new Date().toISOString().split("T")[0],
    payment_method: "cash",
    student_id: 0,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.student_id && formData.amount > 0) {
      onSubmit(formData);
      setFormData({
        amount: 0,
        payment_date: new Date().toISOString().split("T")[0],
        payment_method: "cash",
        student_id: 0,
      });
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="glass-card w-full max-w-md p-6"
          onClick={(e) => e.stopPropagation()}
        >
          <h3
            className="text-xl font-semibold mb-4"
            style={{ color: "var(--foreground)" }}
          >
            💰 Add New Payment
          </h3>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                className="block text-sm font-medium mb-2"
                style={{ color: "var(--foreground-muted)" }}
              >
                Student
              </label>
              <select
                required
                value={formData.student_id}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    student_id: Number(e.target.value),
                  })
                }
                className="modern-input w-full"
              >
                <option value={0}>Select a student...</option>
                {students.map((student) => (
                  <option key={student.id} value={student.id}>
                    {student.student_name} - Grade {student.grade_level}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                className="block text-sm font-medium mb-2"
                style={{ color: "var(--foreground-muted)" }}
              >
                Amount ($)
              </label>
              <input
                type="number"
                required
                min="0.01"
                step="0.01"
                value={formData.amount}
                onChange={(e) =>
                  setFormData({ ...formData, amount: Number(e.target.value) })
                }
                className="modern-input w-full"
                placeholder="Enter payment amount"
              />
            </div>

            <div>
              <label
                className="block text-sm font-medium mb-2"
                style={{ color: "var(--foreground-muted)" }}
              >
                Payment Date
              </label>
              <input
                type="date"
                required
                value={formData.payment_date}
                onChange={(e) =>
                  setFormData({ ...formData, payment_date: e.target.value })
                }
                className="modern-input w-full"
              />
            </div>

            <div>
              <label
                className="block text-sm font-medium mb-2"
                style={{ color: "var(--foreground-muted)" }}
              >
                Payment Method
              </label>
              <select
                required
                value={formData.payment_method}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    payment_method: e.target.value as "cash" | "bank_transfer",
                  })
                }
                className="modern-input w-full"
              >
                <option value="cash">💵 Cash</option>
                <option value="bank_transfer">🏦 Bank Transfer</option>
              </select>
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={
                  loading || !formData.student_id || formData.amount <= 0
                }
                className="flex-1 btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Adding..." : "Add Payment"}
              </button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default function TuitionPaymentManager() {
  const [payments, setPayments] = useState<TuitionPayment[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [studentBalances, setStudentBalances] = useState<StudentBalance[]>([]);
  const [outstandingPayments, setOutstandingPayments] = useState<
    OutstandingPayment[]
  >([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStudent, setSelectedStudent] = useState<string>("");
  const [selectedPaymentMethod, setSelectedPaymentMethod] =
    useState<string>("");
  const [dateFrom, setDateFrom] = useState<string>("");
  const [dateTo, setDateTo] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [successMessage, setSuccessMessage] = useState<string>("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [paymentsData, studentsData, balancesData, outstandingData] =
        await Promise.all([
          tuitionPaymentService.getAllTuitionPayments(),
          studentService.getStudents(),
          Promise.all(
            (
              await studentService.getStudents()
            ).map((student) =>
              tuitionPaymentService
                .getStudentBalance(student.id)
                .catch(() => null)
            )
          ),
          tuitionPaymentService.getOutstandingPayments(),
        ]);

      setPayments(paymentsData);
      setStudents(studentsData);
      setStudentBalances(balancesData.filter(Boolean) as StudentBalance[]);
      setOutstandingPayments(outstandingData);
    } catch (error) {
      console.error("Failed to fetch data:", error);
      setErrorMessage("Failed to fetch data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleAddPayment = async (paymentData: TuitionPaymentCreatePayload) => {
    try {
      setLoading(true);
      await tuitionPaymentService.createTuitionPayment(paymentData);
      setSuccessMessage("Payment added successfully!");
      setIsModalOpen(false);
      fetchData(); // Refresh data

      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (error) {
      console.error("Failed to add payment:", error);
      setErrorMessage("Failed to add payment. Please try again.");
      setTimeout(() => setErrorMessage(""), 5000);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyPayment = async (paymentId: number) => {
    try {
      await tuitionPaymentService.verifyPayment(paymentId);
      setSuccessMessage("Payment verified successfully!");
      fetchData();
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (error) {
      console.error("Failed to verify payment:", error);
      setErrorMessage("Failed to verify payment. Please try again.");
      setTimeout(() => setErrorMessage(""), 5000);
    }
  };

  const handleDeletePayment = async (paymentId: number) => {
    if (window.confirm("Are you sure you want to delete this payment?")) {
      try {
        await tuitionPaymentService.deleteTuitionPayment(paymentId);
        setSuccessMessage("Payment deleted successfully!");
        fetchData();
        setTimeout(() => setSuccessMessage(""), 3000);
      } catch (error) {
        console.error("Failed to delete payment:", error);
        setErrorMessage("Failed to delete payment. Please try again.");
        setTimeout(() => setErrorMessage(""), 5000);
      }
    }
  };

  // Filter payments based on search and filters
  const filteredPayments = payments.filter((payment) => {
    const student = students.find((s) => s.id === payment.student_id);
    const studentName = student?.student_name || "";

    const matchesSearch =
      searchTerm === "" ||
      studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.amount.toString().includes(searchTerm);

    const matchesStudent =
      selectedStudent === "" ||
      payment.student_id.toString() === selectedStudent;

    const matchesMethod =
      selectedPaymentMethod === "" ||
      payment.payment_method === selectedPaymentMethod;

    const matchesDateFrom = !dateFrom || payment.payment_date >= dateFrom;
    const matchesDateTo = !dateTo || payment.payment_date <= dateTo;

    return (
      matchesSearch &&
      matchesStudent &&
      matchesMethod &&
      matchesDateFrom &&
      matchesDateTo
    );
  });

  // Calculate summary statistics
  const totalPayments = filteredPayments.length;
  const totalAmount = filteredPayments.reduce(
    (sum, payment) => sum + payment.amount,
    0
  );
  const verifiedPayments = filteredPayments.filter((p) => p.verified_by).length;
  const outstandingAmount = outstandingPayments.reduce(
    (sum, payment) => sum + payment.remaining_tuition,
    0
  );

  return (
    <div className="space-y-6">
      {/* Header and Controls */}
      <div className="glass-card">
        <h2
          className="text-2xl font-semibold mb-4"
          style={{ color: "var(--foreground)" }}
        >
          💰 Tuition Payment Management
        </h2>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div
            className="text-center p-4 rounded-lg"
            style={{ backgroundColor: "var(--primary-light)" }}
          >
            <div
              className="text-2xl font-bold"
              style={{ color: "var(--primary)" }}
            >
              ${totalAmount.toLocaleString()}
            </div>
            <div
              className="text-sm"
              style={{ color: "var(--foreground-muted)" }}
            >
              Total Payments
            </div>
          </div>
          <div
            className="text-center p-4 rounded-lg"
            style={{ backgroundColor: "var(--success-light)" }}
          >
            <div
              className="text-2xl font-bold"
              style={{ color: "var(--success)" }}
            >
              {totalPayments}
            </div>
            <div
              className="text-sm"
              style={{ color: "var(--foreground-muted)" }}
            >
              Total Transactions
            </div>
          </div>
          <div
            className="text-center p-4 rounded-lg"
            style={{ backgroundColor: "var(--warning-light)" }}
          >
            <div
              className="text-2xl font-bold"
              style={{ color: "var(--warning)" }}
            >
              {verifiedPayments}
            </div>
            <div
              className="text-sm"
              style={{ color: "var(--foreground-muted)" }}
            >
              Verified Payments
            </div>
          </div>
          <div
            className="text-center p-4 rounded-lg"
            style={{ backgroundColor: "var(--danger-light)" }}
          >
            <div
              className="text-2xl font-bold"
              style={{ color: "var(--danger)" }}
            >
              ${outstandingAmount.toLocaleString()}
            </div>
            <div
              className="text-sm"
              style={{ color: "var(--foreground-muted)" }}
            >
              Outstanding
            </div>
          </div>
        </div>

        {/* Error and Success Messages */}
        {errorMessage && (
          <div
            className="mb-4 p-4 rounded-md"
            style={{ backgroundColor: "var(--danger-light)" }}
          >
            <div className="text-sm" style={{ color: "var(--danger)" }}>
              {errorMessage}
            </div>
          </div>
        )}
        {successMessage && (
          <div
            className="mb-4 p-4 rounded-md"
            style={{ backgroundColor: "var(--success-light)" }}
          >
            <div className="text-sm" style={{ color: "var(--success)" }}>
              {successMessage}
            </div>
          </div>
        )}
      </div>

      {/* Outstanding Payments Section */}
      {outstandingPayments.length > 0 && (
        <div className="glass-card">
          <h3
            className="text-lg font-semibold mb-4"
            style={{ color: "var(--foreground)" }}
          >
            ⚠️ Outstanding Payments
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr
                  className="border-b"
                  style={{ borderColor: "var(--border)" }}
                >
                  <th
                    className="text-left p-3"
                    style={{ color: "var(--foreground-muted)" }}
                  >
                    Student
                  </th>
                  <th
                    className="text-left p-3"
                    style={{ color: "var(--foreground-muted)" }}
                  >
                    Email
                  </th>
                  <th
                    className="text-left p-3"
                    style={{ color: "var(--foreground-muted)" }}
                  >
                    Academic Year
                  </th>
                  <th
                    className="text-right p-3"
                    style={{ color: "var(--foreground-muted)" }}
                  >
                    Outstanding Amount
                  </th>
                </tr>
              </thead>
              <tbody>
                {outstandingPayments.slice(0, 5).map((payment) => (
                  <tr key={payment.student_id} className="theme-table-row">
                    <td
                      className="p-3 font-medium"
                      style={{ color: "var(--foreground)" }}
                    >
                      {payment.student_name}
                    </td>
                    <td
                      className="p-3"
                      style={{ color: "var(--foreground-muted)" }}
                    >
                      {payment.student_email}
                    </td>
                    <td
                      className="p-3"
                      style={{ color: "var(--foreground-muted)" }}
                    >
                      {payment.start_year} - {payment.end_year}
                    </td>
                    <td
                      className="p-3 text-right font-bold"
                      style={{ color: "var(--danger)" }}
                    >
                      ${payment.remaining_tuition.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Payments Table */}
      <Table
        title="Payment History"
        actions={
          <div className="flex items-center space-x-4">
            {/* Search Bar */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search payments..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="modern-input w-64 pl-12 pr-4"
              />
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <SearchColorIcon size={18} />
              </div>
            </div>

            {/* Add Payment Button */}
            <button
              onClick={() => setIsModalOpen(true)}
              disabled={students.length === 0}
              className="btn-primary flex items-center gap-2"
            >
              <AddColorIcon size={18} />
              <span>Add Payment</span>
            </button>
          </div>
        }
        filter={
          <div className="flex flex-wrap gap-4">
            <select
              value={selectedStudent}
              onChange={(e) => setSelectedStudent(e.target.value)}
              className="modern-input !w-auto min-w-32"
            >
              <option value="">👥 All Students</option>
              {students.map((student) => (
                <option key={student.id} value={student.id.toString()}>
                  {student.student_name}
                </option>
              ))}
            </select>

            <select
              value={selectedPaymentMethod}
              onChange={(e) => setSelectedPaymentMethod(e.target.value)}
              className="modern-input !w-auto min-w-32"
            >
              <option value="">💳 All Methods</option>
              <option value="cash">💵 Cash</option>
              <option value="bank_transfer">🏦 Bank Transfer</option>
            </select>

            <input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className="modern-input !w-auto"
              placeholder="From Date"
            />

            <input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className="modern-input !w-auto"
              placeholder="To Date"
            />
          </div>
        }
        tableHeader={
          <>
            <th
              className="px-6 py-4 text-left text-sm font-medium uppercase tracking-wider"
              style={{ color: "var(--foreground)" }}
            >
              Student
            </th>
            <th
              className="px-6 py-4 text-center text-sm font-medium uppercase tracking-wider"
              style={{ color: "var(--foreground)" }}
            >
              Amount
            </th>
            <th
              className="px-6 py-4 text-center text-sm font-medium uppercase tracking-wider"
              style={{ color: "var(--foreground)" }}
            >
              Date
            </th>
            <th
              className="px-6 py-4 text-center text-sm font-medium uppercase tracking-wider"
              style={{ color: "var(--foreground)" }}
            >
              Method
            </th>
            <th
              className="px-6 py-4 text-center text-sm font-medium uppercase tracking-wider"
              style={{ color: "var(--foreground)" }}
            >
              Status
            </th>
            <th
              className="px-6 py-4 text-center text-sm font-medium uppercase tracking-wider"
              style={{ color: "var(--foreground)" }}
            >
              Actions
            </th>
          </>
        }
        tableContent={
          <>
            {filteredPayments.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="px-6 py-8 text-center"
                  style={{ color: "var(--foreground-muted)" }}
                >
                  {loading ? "Loading payments..." : "No payments found"}
                </td>
              </tr>
            ) : (
              filteredPayments.map((payment) => {
                const student = students.find(
                  (s) => s.id === payment.student_id
                );
                return (
                  <tr key={payment.id} className="theme-table-row">
                    <td
                      className="px-6 py-4 whitespace-nowrap font-medium"
                      style={{ color: "var(--foreground)" }}
                    >
                      {student?.student_name || "Unknown Student"}
                    </td>
                    <td
                      className="px-6 py-4 whitespace-nowrap text-center font-bold"
                      style={{ color: "var(--success)" }}
                    >
                      ${payment.amount.toLocaleString()}
                    </td>
                    <td
                      className="px-6 py-4 whitespace-nowrap text-center"
                      style={{ color: "var(--foreground-muted)" }}
                    >
                      {new Date(payment.payment_date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          payment.payment_method === "cash"
                            ? "bg-green-100 text-green-800"
                            : "bg-blue-100 text-blue-800"
                        }`}
                      >
                        {payment.payment_method === "cash"
                          ? "💵 Cash"
                          : "🏦 Bank Transfer"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          payment.verified_by
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {payment.verified_by ? "✅ Verified" : "⏳ Pending"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <div className="flex justify-center space-x-2">
                        {!payment.verified_by && (
                          <button
                            onClick={() => handleVerifyPayment(payment.id)}
                            className="p-1 text-green-600 hover:text-green-800 transition-colors"
                            title="Verify Payment"
                          >
                            ✅
                          </button>
                        )}
                        <button
                          onClick={() => handleDeletePayment(payment.id)}
                          className="p-1 text-red-600 hover:text-red-800 transition-colors"
                          title="Delete Payment"
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </>
        }
        tableWrapperClassName="glass-card"
        responsive={true}
        emptyMessage="No payments found"
      />

      {/* Payment Modal */}
      <PaymentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleAddPayment}
        students={students}
        loading={loading}
      />
    </div>
  );
}

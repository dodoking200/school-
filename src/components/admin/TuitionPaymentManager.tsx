"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  TuitionPayment,
  TuitionPaymentCreatePayload,
  OutstandingPayment,
} from "@/lib/services/tuitionPaymentService";
import { tuitionPaymentService } from "@/lib/services/tuitionPaymentService";
import { studentService } from "@/lib/services/studentService";
import { Student } from "@/types";
import OutstandingPayments from "./OutstandingPayments";
import PaymentHistory from "./PaymentHistory";

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
  // Helper function to safely parse payment amounts
  const parsePaymentAmount = (amount: string | number): number => {
    if (typeof amount === "number") return amount;
    if (typeof amount === "string") {
      const cleanAmount = amount.replace(/[^\d.-]/g, "");
      const parsed = parseFloat(cleanAmount);
      return isNaN(parsed) ? 0 : parsed;
    }
    return 0;
  };

  // Helper function to safely parse outstanding amounts
  const parseOutstandingAmount = (amount: string | number): number => {
    if (typeof amount === "number") return amount;
    if (typeof amount === "string") {
      const cleanAmount = amount.replace(/[^\d.-]/g, "");
      const parsed = parseFloat(cleanAmount);
      return isNaN(parsed) ? 0 : parsed;
    }
    return 0;
  };

  const [payments, setPayments] = useState<TuitionPayment[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [outstandingPayments, setOutstandingPayments] = useState<
    OutstandingPayment[]
  >([]);
  const [outstandingPagination, setOutstandingPagination] = useState<
    | {
        current_page: string;
        per_page: string;
        total: string;
        total_pages: string;
        has_next: boolean;
        has_prev: boolean;
      }
    | undefined
  >(undefined);
  const [paymentsPagination, setPaymentsPagination] = useState<
    | {
        current_page: string;
        per_page: string;
        total: string;
        total_pages: string;
        has_next: boolean;
        has_prev: boolean;
      }
    | undefined
  >(undefined);
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
  const [activeTab, setActiveTab] = useState<"outstanding" | "history">(
    "outstanding"
  );

  useEffect(() => {
    fetchData();
  }, []);

  // Pagination handlers for outstanding payments
  const handleOutstandingPageChange = (page: number) => {
    fetchOutstandingPayments(page);
  };

  // Pagination handlers for payments history
  const handlePaymentsPageChange = (page: number) => {
    fetchPayments(page);
  };

  // Separate function to fetch outstanding payments with pagination
  const fetchOutstandingPayments = async (page: number = 1) => {
    try {
      const outstandingData =
        await tuitionPaymentService.getOutstandingPayments(page, 10);

      // Remove duplicates from outstanding payments based on student_id and start_year
      const uniqueOutstandingData = outstandingData.payments
        ? outstandingData.payments.filter(
            (payment, index, self) =>
              index ===
              self.findIndex(
                (p) =>
                  p.student_id === payment.student_id &&
                  p.start_year === payment.start_year
              )
          )
        : [];

      setOutstandingPayments(uniqueOutstandingData);
      setOutstandingPagination(outstandingData.pagination);
    } catch (error) {
      console.error("Failed to fetch outstanding payments:", error);
      setErrorMessage(
        "Failed to fetch outstanding payments. Please try again."
      );
    }
  };

  // Separate function to fetch payments with pagination
  const fetchPayments = async (page: number = 1, limit: number = 5) => {
    try {
      const paymentsData = await tuitionPaymentService.getAllTuitionPayments({
        page,
        limit,
      });

      setPayments(paymentsData.data || []);
      setPaymentsPagination(paymentsData.pagination);
    } catch (error) {
      console.error("Failed to fetch payments:", error);
      setErrorMessage("Failed to fetch payments. Please try again.");
    }
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const studentsData = await studentService.getAllStudents();
      setStudents(studentsData || []);

      // Fetch payments and outstanding payments with pagination
      await Promise.all([fetchPayments(), fetchOutstandingPayments()]);
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
      await Promise.all([fetchPayments(), fetchOutstandingPayments()]);

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
      await Promise.all([fetchPayments(), fetchOutstandingPayments()]);
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
        await Promise.all([fetchPayments(), fetchOutstandingPayments()]);
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
  const totalAmount = filteredPayments.reduce((sum, payment) => {
    const amount = parsePaymentAmount(payment.amount);
    console.log(
      `Payment ID: ${payment.id}, Amount: ${
        payment.amount
      } (${typeof payment.amount}), Parsed: ${amount}, Running Sum: ${
        sum + amount
      }`
    );
    return sum + amount;
  }, 0);
  const verifiedPayments = filteredPayments.filter((p) => p.verified_by).length;
  // Debug: Log the outstanding payments data
  console.log("Outstanding Payments Data:", outstandingPayments);
  console.log("Outstanding Payments Length:", outstandingPayments.length);
  console.log("Outstanding Pagination:", outstandingPagination);

  const outstandingAmount = outstandingPayments.reduce((sum, payment) => {
    const amount = parseOutstandingAmount(payment.remaining_tuition);
    console.log(
      `Student: ${payment.student_name}, Raw: ${
        payment.remaining_tuition
      }, Parsed: ${amount}, Running Sum: ${sum + amount}`
    );
    return sum + amount;
  }, 0);

  console.log("Final Outstanding Amount:", outstandingAmount);

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

      {/* Tab Navigation */}
      <div className="glass-card mb-6">
        <div className="flex border-b border-gray-200 dark:border-gray-700">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setActiveTab("outstanding")}
            className={`flex-1 py-4 px-6 text-center font-semibold transition-all duration-300 relative ${
              activeTab === "outstanding"
                ? "text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20"
                : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800/50"
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <span className="text-2xl">⚠️</span>
              <span>Outstanding Payments</span>
              {outstandingPayments.length > 0 && (
                <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                  {outstandingPayments.length}
                </span>
              )}
            </div>
            {activeTab === "outstanding" && (
              <motion.div
                layoutId="activeTab"
                className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-red-500 to-pink-500 rounded-t-full"
              />
            )}
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setActiveTab("history")}
            className={`flex-1 py-4 px-6 text-center font-semibold transition-all duration-300 relative ${
              activeTab === "history"
                ? "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20"
                : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800/50"
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <span className="text-2xl">📊</span>
              <span>Payment History</span>
              {payments.length > 0 && (
                <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                  {payments.length}
                </span>
              )}
            </div>
            {activeTab === "history" && (
              <motion.div
                layoutId="activeTab"
                className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-t-full"
              />
            )}
          </motion.button>
        </div>
      </div>

      {/* Tab Content */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
        {activeTab === "outstanding" && (
          <OutstandingPayments
            outstandingPayments={outstandingPayments}
            onAddPaymentClick={(studentId) => {
              setSelectedStudent(studentId);
              setIsModalOpen(true);
            }}
            onRefresh={() => fetchOutstandingPayments()}
            loading={loading}
            pagination={outstandingPagination}
            onPageChange={handleOutstandingPageChange}
          />
        )}

        {activeTab === "history" && (
          <PaymentHistory
            payments={payments}
            students={students}
            loading={loading}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            selectedStudent={selectedStudent}
            setSelectedStudent={setSelectedStudent}
            selectedPaymentMethod={selectedPaymentMethod}
            setSelectedPaymentMethod={setSelectedPaymentMethod}
            dateFrom={dateFrom}
            setDateFrom={setDateFrom}
            dateTo={dateTo}
            setDateTo={setDateTo}
            onAddPaymentClick={() => setIsModalOpen(true)}
            onVerifyPayment={handleVerifyPayment}
            onDeletePayment={handleDeletePayment}
            pagination={paymentsPagination}
            onPageChange={handlePaymentsPageChange}
          />
        )}
      </motion.div>

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

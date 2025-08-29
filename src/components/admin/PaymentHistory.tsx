"use client";

import React from "react";
import { motion } from "framer-motion";
import { TuitionPayment } from "@/lib/services/tuitionPaymentService";
import { Student } from "@/types";
import {
  SearchColorIcon,
  AddColorIcon,
} from "@/components/icons/ColorfulIcons";
import Table from "../ui/Table";

interface PaymentHistoryProps {
  payments: TuitionPayment[];
  students: Student[];
  loading: boolean;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  selectedStudent: string;
  setSelectedStudent: (student: string) => void;
  selectedPaymentMethod: string;
  setSelectedPaymentMethod: (method: string) => void;
  dateFrom: string;
  setDateFrom: (date: string) => void;
  dateTo: string;
  setDateTo: (date: string) => void;
  onAddPaymentClick: () => void;
  onVerifyPayment: (paymentId: number) => void;
  onDeletePayment: (paymentId: number) => void;
  pagination?: {
    current_page: string;
    per_page: string;
    total: string;
    total_pages: string;
    has_next: boolean;
    has_prev: boolean;
  };
  onPageChange?: (page: number) => void;
}

export default function PaymentHistory({
  payments,
  students,
  loading,
  searchTerm,
  setSearchTerm,
  selectedStudent,
  setSelectedStudent,
  selectedPaymentMethod,
  setSelectedPaymentMethod,
  dateFrom,
  setDateFrom,
  dateTo,
  setDateTo,
  onAddPaymentClick,
  onVerifyPayment,
  onDeletePayment,
  pagination,
  onPageChange,
}: PaymentHistoryProps) {
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

  // Handle page change
  const handlePageChange = (page: number) => {
    onPageChange?.(page);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
    >
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
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onAddPaymentClick}
              disabled={students.length === 0 || loading}
              className="btn-primary flex items-center gap-2 disabled:opacity-50"
            >
              <AddColorIcon size={18} />
              <span>Add Payment</span>
            </motion.button>
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
                  {loading ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="animate-spin text-lg">🔄</div>
                      Loading payments...
                    </div>
                  ) : (
                    <div>
                      <div className="text-4xl mb-2">📊</div>
                      <div>No payments found matching your criteria</div>
                    </div>
                  )}
                </td>
              </tr>
            ) : (
              filteredPayments.map((payment, index) => {
                const student = students.find(
                  (s) => s.id === payment.student_id
                );
                return (
                  <motion.tr
                    key={payment.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className="theme-table-row hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                  >
                    <td
                      className="px-6 py-4 whitespace-nowrap font-medium"
                      style={{ color: "var(--foreground)" }}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-lg">👤</span>
                        {student?.student_name || "Unknown Student"}
                      </div>
                    </td>
                    <td
                      className="px-6 py-4 whitespace-nowrap text-center font-bold"
                      style={{ color: "var(--success)" }}
                    >
                      <div className="flex items-center justify-center gap-1">
                        <span className="text-lg">💰</span>$
                        {parsePaymentAmount(payment.amount).toLocaleString()}
                      </div>
                    </td>
                    <td
                      className="px-6 py-4 whitespace-nowrap text-center"
                      style={{ color: "var(--foreground-muted)" }}
                    >
                      <div className="flex items-center justify-center gap-1">
                        <span>📅</span>
                        {new Date(payment.payment_date).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium flex items-center justify-center gap-1 w-fit mx-auto ${
                          payment.payment_method === "cash"
                            ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
                            : "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400"
                        }`}
                      >
                        {payment.payment_method === "cash" ? "💵" : "🏦"}
                        {payment.payment_method === "cash"
                          ? "Cash"
                          : "Bank Transfer"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium flex items-center justify-center gap-1 w-fit mx-auto ${
                          payment.verified_by
                            ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
                            : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400"
                        }`}
                      >
                        {payment.verified_by ? "✅" : "⏳"}
                        {payment.verified_by ? "Verified" : "Pending"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <div className="flex justify-center space-x-2">
                        {!payment.verified_by && (
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => onVerifyPayment(payment.id)}
                            className="p-2 text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300 transition-colors rounded-lg hover:bg-green-50 dark:hover:bg-green-900/20"
                            title="Verify Payment"
                          >
                            <span className="text-lg">✅</span>
                          </motion.button>
                        )}
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => onDeletePayment(payment.id)}
                          className="p-2 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 transition-colors rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20"
                          title="Delete Payment"
                        >
                          <span className="text-lg">🗑️</span>
                        </motion.button>
                      </div>
                    </td>
                  </motion.tr>
                );
              })
            )}
          </>
        }
        tableWrapperClassName="glass-card"
        responsive={true}
        emptyMessage="No payments found"
      />

      {/* Pagination Controls */}
      {pagination && (
        <div className="mt-6">
          {/* Pagination Info */}
          <div className="flex items-center justify-between mb-4 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
            <div
              className="text-sm"
              style={{ color: "var(--foreground-muted)" }}
            >
              Showing {(Number(pagination.current_page) - 1) * 5 + 1} to{" "}
              {Math.min(
                Number(pagination.current_page) * 5,
                Number(pagination.total)
              )}{" "}
              of {pagination.total} results
            </div>
          </div>

          {/* Pagination Navigation */}
          {Number(pagination.total_pages) > 1 && (
            <div className="flex items-center justify-center gap-2">
              <button
                onClick={() =>
                  handlePageChange(Number(pagination.current_page) - 1)
                }
                disabled={Number(pagination.current_page) === 1}
                className="px-3 py-2 rounded-md text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  backgroundColor:
                    Number(pagination.current_page) !== 1
                      ? "var(--primary-light)"
                      : "var(--foreground-muted)",
                  color:
                    Number(pagination.current_page) !== 1
                      ? "var(--primary)"
                      : "var(--foreground-muted)",
                }}
              >
                ← Previous
              </button>

              <div className="px-3 py-2 rounded-md text-sm font-medium bg-primary text-white">
                Page {pagination.current_page} of {pagination.total_pages}
              </div>

              <button
                onClick={() =>
                  handlePageChange(Number(pagination.current_page) + 1)
                }
                disabled={
                  Number(pagination.current_page) ===
                  Number(pagination.total_pages)
                }
                className="px-3 py-2 rounded-md text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  backgroundColor:
                    Number(pagination.current_page) !==
                    Number(pagination.total_pages)
                      ? "var(--primary-light)"
                      : "var(--foreground-muted)",
                  color:
                    Number(pagination.current_page) !==
                    Number(pagination.total_pages)
                      ? "var(--primary)"
                      : "var(--foreground-muted)",
                }}
              >
                Next →
              </button>
            </div>
          )}
        </div>
      )}
    </motion.div>
  );
}

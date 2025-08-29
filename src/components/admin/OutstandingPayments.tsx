"use client";

import React from "react";
import { motion } from "framer-motion";
import { OutstandingPayment } from "@/lib/services/tuitionPaymentService";
import { AddColorIcon } from "@/components/icons/ColorfulIcons";

interface OutstandingPaymentsProps {
  outstandingPayments: OutstandingPayment[];
  onAddPaymentClick: (studentId: string) => void;
  onRefresh: () => void;
  loading?: boolean;
}

export default function OutstandingPayments({
  outstandingPayments,
  onAddPaymentClick,
  onRefresh,
  loading = false,
}: OutstandingPaymentsProps) {
  // Helper function to generate unique keys for React components
  const generateUniqueKey = (
    payment: OutstandingPayment,
    index: number
  ): string => {
    return `outstanding-${payment.student_id}-${payment.start_year}-${index}`;
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

  // Calculate total outstanding amount
  const totalOutstanding = outstandingPayments.reduce((sum, payment) => {
    const amount = parseOutstandingAmount(payment.remaining_tuition);
    return sum + amount;
  }, 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="glass-card mb-6"
    >
      <div className="flex items-center justify-between mb-4">
        <h3
          className="text-xl font-semibold flex items-center gap-2"
          style={{ color: "var(--foreground)" }}
        >
          <span className="text-2xl">⚠️</span>
          Outstanding Payments ({outstandingPayments.length} students)
        </h3>
        <div className="flex items-center gap-4">
          <div className="text-sm text-gray-600 dark:text-gray-400 font-medium">
            Total Outstanding:{" "}
            <span
              className="text-lg font-bold"
              style={{ color: "var(--danger)" }}
            >
              ${totalOutstanding.toLocaleString()}
            </span>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onRefresh}
            disabled={loading}
            className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 underline disabled:opacity-50 flex items-center gap-1"
            title="Refresh outstanding payments"
          >
            <span className={loading ? "animate-spin" : ""}>🔄</span>
            {loading ? "Refreshing..." : "Refresh"}
          </motion.button>
        </div>
      </div>

      {outstandingPayments.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr
                className="border-b"
                style={{ borderColor: "var(--border)" }}
              >
                <th
                  className="text-left p-3 font-medium"
                  style={{ color: "var(--foreground-muted)" }}
                >
                  👤 Student Name
                </th>
                <th
                  className="text-left p-3 font-medium"
                  style={{ color: "var(--foreground-muted)" }}
                >
                  📧 Email
                </th>
                <th
                  className="text-left p-3 font-medium"
                  style={{ color: "var(--foreground-muted)" }}
                >
                  📱 Phone
                </th>
                <th
                  className="text-left p-3 font-medium"
                  style={{ color: "var(--foreground-muted)" }}
                >
                  📅 Academic Year
                </th>
                <th
                  className="text-right p-3 font-medium"
                  style={{ color: "var(--foreground-muted)" }}
                >
                  💰 Outstanding Amount
                </th>
                <th
                  className="text-center p-3 font-medium"
                  style={{ color: "var(--foreground-muted)" }}
                >
                  ⚡ Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {outstandingPayments.map((payment, index) => (
                <motion.tr
                  key={generateUniqueKey(payment, index)}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="theme-table-row hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                >
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
                    {payment.student_phone}
                  </td>
                  <td
                    className="p-3"
                    style={{ color: "var(--foreground-muted)" }}
                  >
                    {new Date(payment.start_year).getFullYear()} -{" "}
                    {new Date(payment.end_year).getFullYear()}
                  </td>
                  <td
                    className="p-3 text-right font-bold text-lg"
                    style={{ color: "var(--danger)" }}
                  >
                    ${parseFloat(payment.remaining_tuition).toLocaleString()}
                  </td>
                  <td className="p-3 text-center">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() =>
                        onAddPaymentClick(payment.student_id.toString())
                      }
                      className="btn-primary text-sm px-3 py-1.5 flex items-center gap-1 mx-auto"
                      title="Add Payment for this Student"
                    >
                      <AddColorIcon size={14} />
                      Add Payment
                    </motion.button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center py-12"
        >
          <div className="text-6xl mb-4">🎉</div>
          <div
            className="text-lg font-medium mb-2"
            style={{ color: "var(--success)" }}
          >
            All Caught Up!
          </div>
          <div className="text-gray-500 dark:text-gray-400">
            All students are up to date with their payments!
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}

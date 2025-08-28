import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { cn } from "@/lib/utils";

interface TableProps {
  /** Title of the table */
  title?: string;
  /** Table header content (thead element) */
  tableHeader?: React.ReactNode;
  /** Table body content (tbody element) */
  tableContent?: React.ReactNode;
  /** Optional filter component to display in the header */
  filter?: React.ReactNode;
  /** Optional additional actions (buttons, links) to display in the header */
  actions?: React.ReactNode;
  /** Optional custom class names for the container */
  className?: string;
  /** Optional custom class names for the table element */
  tableClassName?: string;
  /** Optional custom class names for the title */
  titleClassName?: string;
  /** Optional custom class names for the filter container */
  filterClassName?: string;
  /** Optional custom class names for the actions container */
  actionsClassName?: string;
  /** Optional custom class names for the table wrapper */
  tableWrapperClassName?: string;
  /** Optional custom class names for the thead element */
  theadClassName?: string;
  /** Optional custom class names for the tbody element */
  tbodyClassName?: string;
  /** Optional flag to make the table compact (less padding) */
  compact?: boolean;
  /** Optional flag to make the table responsive */
  responsive?: boolean;
  /** Optional flag to hide the header section (title, filter, actions) */
  hideHeader?: boolean;
  /** Optional custom header component to replace the default header */
  customHeader?: React.ReactNode;
  /** Optional footer content */
  footer?: React.ReactNode;
  /** Optional loading state */
  isLoading?: boolean;
  /** Optional empty state message when there's no data */
  emptyMessage?: string;
}

export default function Table({
  title,
  tableHeader,
  tableContent,
  filter,
  actions,
  className = "",
  tableClassName = "",
  titleClassName = "",
  filterClassName = "",
  actionsClassName = "",
  tableWrapperClassName = "",
  theadClassName = "",
  tbodyClassName = "",
  compact = false,
  responsive = true,
  hideHeader = false,
  customHeader,
  footer,
  isLoading,
  emptyMessage,
}: TableProps) {
  // Determine container padding based on compact mode
  const containerPadding = compact ? "p-4" : "p-6";

  // Determine if the table has content
  const hasContent = tableContent || tableHeader;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className={cn(containerPadding, className)}
    >
      {/* Modern Header Section */}
      {!hideHeader && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-8"
        >
          {customHeader || (
            <div className="glass-card !p-6">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                {/* Title Section */}
                {title && (
                  <div className={cn("flex-1", titleClassName)}>
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: 0.2 }}
                      className="flex items-center gap-4"
                    >
                      <div className="w-2 h-8 bg-gradient-primary rounded-full" />
                      <div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">
                          {title}
                        </h1>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                          Manage your data with modern interface
                        </p>
                      </div>
                    </motion.div>
                  </div>
                )}
                
                {/* Filter and Actions Section */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                  {filter && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.4, delay: 0.3 }}
                      className={cn("flex items-center gap-3", filterClassName)}
                    >
                      {filter}
                    </motion.div>
                  )}
                  
                  {actions && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.4, delay: 0.4 }}
                      className={cn("flex items-center gap-3", actionsClassName)}
                    >
                      {actions}
                    </motion.div>
                  )}
                </div>
              </div>
            </div>
          )}
        </motion.div>
      )}

      {/* Modern Table Container */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className={cn(
          "bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-3xl shadow-modern-xl border border-white/20 dark:border-gray-700/20 overflow-hidden",
          "hover:shadow-modern-2xl transition-all duration-500",
          tableWrapperClassName
        )}
        style={{
          background: "var(--card-bg)",
        }}
      >
        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="p-12 text-center"
            >
              <div className="flex flex-col items-center gap-4">
                <div className="loading-spinner w-8 h-8" />
                <p className="text-gray-500 dark:text-gray-400 font-medium">Loading amazing data...</p>
              </div>
            </motion.div>
          ) : !hasContent && emptyMessage ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="p-12 text-center"
            >
              <div className="flex flex-col items-center gap-4">
                <div className="w-16 h-16 bg-gradient-to-r from-gray-100 dark:from-gray-800 to-gray-200 dark:to-gray-700 rounded-2xl flex items-center justify-center">
                  <MagnifyingGlassIcon className="w-8 h-8 text-gray-400 dark:text-gray-500" />
                </div>
                <div>
                  <p className="text-lg font-semibold text-gray-600 dark:text-gray-300 mb-2">No Data Found</p>
                  <p className="text-gray-500 dark:text-gray-400">{emptyMessage}</p>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="content"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className={responsive ? "overflow-x-auto" : ""}
            >
              <table
                className={cn(
                  "min-w-full",
                  tableClassName
                )}
              >
                {/* Modern Table Header */}
                {tableHeader && (
                  <thead className={cn(
                    "bg-gradient-primary text-white relative",
                    theadClassName
                  )}>
                    <tr className="relative">
                      {tableHeader}
                    </tr>
                    {/* Decorative Bottom Border */}
                    <tr className="absolute bottom-0 left-0 w-full h-1">
                      <td colSpan={100} className="p-0">
                        <div className="h-1 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500" />
                      </td>
                    </tr>
                  </thead>
                )}
                
                {/* Modern Table Body */}
                {tableContent && (
                  <tbody
                    className={cn(
                      "bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm divide-y divide-gray-100 dark:divide-gray-700",
                      tbodyClassName
                    )}
                  >
                    {tableContent}
                  </tbody>
                )}
              </table>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Modern Footer */}
      {footer && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.5 }}
          className="mt-6 glass-card !p-4"
        >
          {footer}
        </motion.div>
      )}
    </motion.div>
  );
}

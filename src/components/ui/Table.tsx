import React from "react";

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
  theadClassName = "bg-gray-50",
  tbodyClassName = "bg-white divide-y divide-gray-200",
  compact = false,
  responsive = true,
  hideHeader = false,
  customHeader,
  footer,
  isLoading,
  emptyMessage,
}: TableProps) {
  // Determine container padding based on compact mode
  const containerPadding = compact ? "p-3" : "p-6";

  // Determine if the table has content
  const hasContent = tableContent || tableHeader;

  return (
    <div className={`${containerPadding} ${className}`}>
      <div className="mb-4">
        {!hideHeader &&
          (customHeader || (
            <div className="flex-wrap flex justify-between items-center mb-4">
              {title && (
                <div className={titleClassName || "flex-1"}>
                  <h2 className="text-xl font-semibold text-black">{title}</h2>
                </div>
              )}
              {filter && (
                <div className={`text-black ${filterClassName}`}>{filter}</div>
              )}
              {actions && (
                <div className={`ml-2 ${actionsClassName}`}>{actions}</div>
              )}
            </div>
          ))}

        <div
          className={`bg-white rounded-4xl shadow-md overflow-hidden ${tableWrapperClassName}`}
        >
          {isLoading ? (
            <div className="p-6 text-center text-gray-500">Loading...</div>
          ) : !hasContent && emptyMessage ? (
            <div className="p-6 text-center text-gray-500">{emptyMessage}</div>
          ) : (
            <div className={responsive ? "overflow-x-auto" : ""}>
              <table
                className={`min-w-full divide-y divide-gray-200 ${tableClassName}`}
              >
                {/* Use tableHeader and tableContent props */}
                {tableHeader ? (
                  <thead className={theadClassName}>
                    <tr className="bg-gray-200 border-b border-gray-300">
                      {tableHeader}
                    </tr>
                  </thead>
                ) : null}
                {tableContent ? (
                  <tbody
                    className={
                      tbodyClassName +
                      " text-g-white divide-y divide-gray-200 text-center"
                    }
                  >
                    {tableContent}
                  </tbody>
                ) : null}
              </table>
            </div>
          )}
        </div>

        {footer && <div className="mt-4">{footer}</div>}
      </div>
    </div>
  );
}

import { useState, useRef } from "react";
import { UploadColorIcon, DownloadColorIcon, CloseColorIcon } from "@/components/icons/ColorfulIcons";

interface ExcelUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpload: (file: File) => Promise<void>;
  title: string;
}

export default function ExcelUploadModal({
  isOpen,
  onClose,
  onUpload,
  title,
}: ExcelUploadModalProps) {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      // Validate file type
      const validTypes = [
        "application/vnd.ms-excel",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        ".xls",
        ".xlsx",
      ];
      
      const isValidType = validTypes.some(type => 
        selectedFile.type === type || selectedFile.name.endsWith(type)
      );

      if (!isValidType) {
        setError("Please select a valid Excel file (.xls or .xlsx)");
        setFile(null);
        return;
      }

      // Validate file size (max 5MB)
      if (selectedFile.size > 5 * 1024 * 1024) {
        setError("File size must be less than 5MB");
        setFile(null);
        return;
      }

      setFile(selectedFile);
      setError("");
      setSuccess("");
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError("Please select a file to upload");
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);
    setError("");
    setSuccess("");

    try {
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      await onUpload(file);
      
      clearInterval(progressInterval);
      setUploadProgress(100);
      setSuccess("File uploaded successfully!");
      
      // Reset form after successful upload
      setTimeout(() => {
        setFile(null);
        setUploadProgress(0);
        setSuccess("");
        onClose();
      }, 2000);

    } catch (error) {
      setError(error instanceof Error ? error.message : "Upload failed");
      setUploadProgress(0);
    } finally {
      setIsUploading(false);
    }
  };

  const handleClose = () => {
    if (!isUploading) {
      setFile(null);
      setError("");
      setSuccess("");
      setUploadProgress(0);
      onClose();
    }
  };

  const downloadTemplate = () => {
    // Create a sample Excel template content
    const templateContent = `Name,Email,Phone,Birth Date,Grade Level,Class Name,Discount Percentage
John Doe,john.doe@example.com,+1234567890,2005-01-15,9,Class A,0
Jane Smith,jane.smith@example.com,+1234567891,2005-03-20,10,Class B,10
Mike Johnson,mike.johnson@example.com,+1234567892,2004-07-10,11,Class C,0`;

    const blob = new Blob([templateContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'students_template.csv';
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            {title}
          </h2>
          <button
            onClick={handleClose}
            disabled={isUploading}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 disabled:opacity-50"
          >
            <CloseColorIcon size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* File Upload Area */}
          <div className="space-y-4">
            <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center hover:border-primary-500 dark:hover:border-primary-400 transition-colors">
              <input
                ref={fileInputRef}
                type="file"
                accept=".xls,.xlsx,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                onChange={handleFileChange}
                className="hidden"
                disabled={isUploading}
              />
              
              {!file ? (
                <div 
                  className="cursor-pointer"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <UploadColorIcon size={48} className="mx-auto text-gray-400 dark:text-gray-500 mb-4" />
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    <span className="text-primary-600 dark:text-primary-400 font-medium">
                      Click to upload
                    </span>{" "}
                    or drag and drop
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-500">
                    Excel files (.xls, .xlsx) up to 5MB
                  </p>
                </div>
              ) : (
                <div className="text-center">
                  <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-3">
                    <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                    {file.name}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploading}
                    className="mt-2 text-xs text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 underline disabled:opacity-50"
                  >
                    Change file
                  </button>
                </div>
              )}
            </div>

            {/* Template Download */}
            <div className="text-center">
              <button
                onClick={downloadTemplate}
                className="inline-flex items-center gap-2 text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 underline"
              >
                <DownloadColorIcon size={16} />
                Download Excel Template
              </button>
            </div>
          </div>

          {/* Instructions */}
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            <h3 className="font-medium text-gray-900 dark:text-white mb-2">
              📋 Instructions:
            </h3>
            <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
              <li>• Use the template format for best results</li>
              <li>• Required columns: Name, Email, Phone, Birth Date, Grade Level, Class Name</li>
              <li>• Grade Level must be 9, 10, 11, or 12</li>
              <li>• Discount Percentage is optional (0-100)</li>
              <li>• Birth Date format: YYYY-MM-DD</li>
            </ul>
          </div>

          {/* Progress Bar */}
          {isUploading && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                <span>Uploading...</span>
                <span>{uploadProgress}%</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
              <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            </div>
          )}

          {/* Success Message */}
          {success && (
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
              <p className="text-sm text-green-600 dark:text-green-400">{success}</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={handleClose}
            disabled={isUploading}
            className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleUpload}
            disabled={!file || isUploading}
            className="px-4 py-2 text-sm font-medium text-white bg-primary-600 border border-transparent rounded-md hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
          >
            {isUploading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <UploadColorIcon size={16} />
                Upload
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

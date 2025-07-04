import React from "react";
import { X, Upload, FileText } from "lucide-react";

interface ImportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ImportModal: React.FC<ImportModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg p-6 w-full max-w-md mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-800">Import Data</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mb-6">
          <div className="flex items-center space-x-2 mb-3">
            <FileText className="w-5 h-5 text-blue-500" />
            <span className="font-medium text-gray-700">Supported Format</span>
          </div>
          <div className="bg-gray-50 rounded-md p-3 text-sm text-gray-600">
            <p className="mb-2">Please upload files in the following format:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>CSV files with headers</li>
              <li>Excel files (.xlsx, .xls)</li>
              <li>JSON files with array structure</li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col space-y-3">
          <button
            disabled
            className="flex items-center justify-center space-x-2 w-full px-4 py-2 bg-gray-100 text-gray-400 rounded-md cursor-not-allowed"
          >
            <Upload className="w-4 h-4" />
            <span>Upload File - Coming Soon</span>
          </button>

          <button
            onClick={onClose}
            className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImportModal;

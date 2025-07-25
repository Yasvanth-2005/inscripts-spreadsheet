import React, { useState } from "react";
import { X } from "lucide-react";

interface AddSheetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddSheet: (name: string) => void;
}

const AddSheetModal: React.FC<AddSheetModalProps> = ({
  isOpen,
  onClose,
  onAddSheet,
}) => {
  const [sheetName, setSheetName] = useState("");

  if (!isOpen) return null;

  const handleAdd = () => {
    if (sheetName.trim()) {
      onAddSheet(sheetName.trim());
      setSheetName("");
      onClose();
    }
  };

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
          <h2 className="text-lg font-semibold text-gray-800">Add New Sheet</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <input
          type="text"
          value={sheetName}
          onChange={(e) => setSheetName(e.target.value)}
          placeholder="Sheet name"
          className="w-full border border-gray-300 rounded-md px-3 py-2 mb-4 text-sm"
        />
        <div className="flex justify-end space-x-2">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleAdd}
            className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
            disabled={!sheetName.trim()}
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddSheetModal;

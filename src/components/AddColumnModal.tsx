import React, { useState } from "react";

interface AddColumnModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddColumn: (mainHeaderName: string, headerName: string) => void;
}

const AddColumnModal: React.FC<AddColumnModalProps> = ({
  isOpen,
  onClose,
  onAddColumn,
}) => {
  const [mainHeaderName, setMainHeaderName] = useState("");
  const [headerName, setHeaderName] = useState("");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (headerName.trim()) {
      onAddColumn(mainHeaderName.trim(), headerName.trim());
      setMainHeaderName("");
      setHeaderName("");
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg p-6 w-full max-w-sm"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-lg font-semibold mb-4">Add New Column</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={mainHeaderName}
            onChange={(e) => setMainHeaderName(e.target.value)}
            placeholder="Enter group name (Optional)"
            className="w-full border border-gray-300 rounded-md px-3 py-2 mb-4"
            autoFocus
          />
          <input
            type="text"
            value={headerName}
            onChange={(e) => setHeaderName(e.target.value)}
            placeholder="Enter column name"
            className="w-full border border-gray-300 rounded-md px-3 py-2 mb-4"
          />
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
            >
              Add Column
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddColumnModal;

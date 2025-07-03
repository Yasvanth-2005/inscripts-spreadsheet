import React from "react";
import { X, GitFork } from "lucide-react";

interface NewActionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const NewActionModal: React.FC<NewActionModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-800">New Action</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="text-center py-8">
          <div className="flex justify-center mb-4">
            <GitFork className="w-12 h-12 text-gray-400" />
          </div>
          <h3 className="text-xl font-medium text-gray-700 mb-2">
            Coming Soon
          </h3>
          <p className="text-gray-500 mb-6">
            New action functionality is currently under development. Stay tuned
            for updates!
          </p>

          <button
            onClick={onClose}
            className="px-6 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
};

export default NewActionModal;

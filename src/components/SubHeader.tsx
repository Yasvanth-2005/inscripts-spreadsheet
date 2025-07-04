import React from "react";
import {
  HardDriveDownload,
  GitBranch,
  MessageSquareQuote,
  Sparkles,
  Plus,
} from "lucide-react";

const SubHeader: React.FC = () => {
  return (
    <div className="bg-white px-4 py-2 flex items-center justify-between border-b border-gray-200 overflow-x-auto whitespace-nowrap">
      <div className="flex items-center space-x-3">
        <div className="flex items-center space-x-2 text-sm">
          <GitBranch className="w-5 h-5 text-blue-500 flex-shrink-0" />
          <span className="font-medium text-gray-800">
            Q3 Financial Overview
          </span>
          <HardDriveDownload className="w-4 h-4 text-gray-400 flex-shrink-0" />
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <button
          className="px-3 py-1 text-sm bg-purple-50 text-purple-700 rounded-md flex items-center space-x-2 hover:bg-purple-100 disabled:opacity-70"
          disabled
        >
          <MessageSquareQuote className="w-4 h-4" />
          <span>Answer a question</span>
        </button>
        <button
          className="px-3 py-1 text-sm bg-orange-50 text-orange-700 rounded-md flex items-center space-x-2 hover:bg-orange-100 disabled:opacity-70"
          disabled
        >
          <Sparkles className="w-4 h-4" />
          <span>Extract</span>
        </button>
        <button
          className="p-2 text-gray-500 hover:bg-gray-100 rounded-md disabled:opacity-50 flex-shrink-0"
          disabled
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default SubHeader;

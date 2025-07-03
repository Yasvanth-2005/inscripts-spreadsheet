import React from "react";
import { Plus } from "lucide-react";
import { Sheet } from "../types/spreadsheet";

interface FilterTabsProps {
  sheets: Sheet[];
  activeSheetId: string;
  onTabChange: (tabId: string) => void;
  onAddSheet: () => void;
}

const FilterTabs: React.FC<FilterTabsProps> = ({
  sheets,
  activeSheetId,
  onTabChange,
  onAddSheet,
}) => {
  return (
    <div className="bg-white border-b border-gray-200">
      <div className="flex items-center px-2 sm:px-4 overflow-x-auto">
        {sheets.map((sheet) => (
          <button
            key={sheet.id}
            onClick={() => onTabChange(sheet.id)}
            className={`px-3 sm:px-4 py-3 text-xs sm:text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
              sheet.id === activeSheetId
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300"
            }`}
          >
            {sheet.name}
          </button>
        ))}

        <button
          onClick={onAddSheet}
          className="ml-2 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md transition-colors flex-shrink-0"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default FilterTabs;

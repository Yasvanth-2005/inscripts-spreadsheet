import React from 'react';
import { SelectedCell } from '../types/spreadsheet';
import { getCellId } from '../utils/spreadsheet';

interface StatusBarProps {
  selectedCell: SelectedCell | null;
  totalCells: number;
}

const StatusBar: React.FC<StatusBarProps> = ({ selectedCell, totalCells }) => {
  const selectedCellId = selectedCell ? getCellId(selectedCell.row, selectedCell.column) : null;

  return (
    <div className="bg-gray-50 border-t border-gray-200 px-4 py-2 text-sm text-gray-600">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <span>
            Cell: {selectedCellId || 'None'}
          </span>
          <span>
            Ready
          </span>
        </div>
        
        <div className="flex items-center space-x-4">
          <span>
            Total cells: {totalCells.toLocaleString()}
          </span>
          <span>
            Zoom: 100%
          </span>
        </div>
      </div>
    </div>
  );
};

export default StatusBar;
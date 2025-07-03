import React, { useState, useEffect } from 'react';
import { FunctionSquare as Function } from 'lucide-react';

interface FormulaBarProps {
  selectedCell: string | null;
  cellValue: string | number | null;
  onValueChange: (value: string) => void;
}

const FormulaBar: React.FC<FormulaBarProps> = ({
  selectedCell,
  cellValue,
  onValueChange,
}) => {
  const [inputValue, setInputValue] = useState('');

  useEffect(() => {
    setInputValue(cellValue?.toString() || '');
  }, [cellValue]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onValueChange(inputValue);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit(e);
    }
  };

  return (
    <div className="bg-white border-b border-gray-200 px-4 py-2">
      <div className="flex items-center space-x-3">
        <div className="flex items-center space-x-2">
          <Function className="w-4 h-4 text-gray-500" />
          <div className="text-sm font-medium text-gray-700 min-w-[60px]">
            {selectedCell || 'A1'}
          </div>
        </div>
        
        <div className="flex-1">
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              className="w-full px-3 py-1.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter value or formula..."
            />
          </form>
        </div>
      </div>
    </div>
  );
};

export default FormulaBar;
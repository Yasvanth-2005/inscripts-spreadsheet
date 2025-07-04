import React, { useState, useRef, useEffect } from "react";
import { Cell } from "../types/spreadsheet";
import clsx from "clsx";

interface SpreadsheetCellProps {
  value?: string | number;
  isSelected: boolean;
  isColumnSelected?: boolean;
  onClick?: () => void;
  onDoubleClick?: () => void;
  onChange?: (value: string | number) => void;
  searchTerm?: string;

  cell?: Cell;
  isHeader?: boolean;
  isHighlighted?: boolean;
  onSelect?: () => void;
  onValueChange?: (value: string | number) => void;
  onKeyDown?: (
    e: React.KeyboardEvent,
    rowIndex: number,
    colIndex: number
  ) => void;
  rowIndex?: number;
  colIndex?: number;
  className?: string;
  style?: React.CSSProperties;
}

const SpreadsheetCell: React.FC<SpreadsheetCellProps> = ({
  // New props
  value,
  isSelected,
  isColumnSelected = false,
  onClick,
  onDoubleClick,
  onChange,
  searchTerm = "",

  // Legacy props
  cell,
  isHeader = false,
  isHighlighted = false,
  onSelect,
  onValueChange,
  onKeyDown,
  rowIndex = 0,
  colIndex = 0,
  className = "",
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const cellRef = useRef<HTMLDivElement>(null);
  const selectAllOnEdit = useRef(false);

  // Determine which interface is being used
  const isNewInterface = value !== undefined;
  const cellValue = isNewInterface
    ? value?.toString() || ""
    : cell?.value?.toString() || "";
  const cellType = isNewInterface ? undefined : cell?.type;

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      if (selectAllOnEdit.current) {
        inputRef.current.select();
        selectAllOnEdit.current = false;
      }
    }
  }, [isEditing]);

  useEffect(() => {
    if (isSelected && cellRef.current && !isEditing) {
      cellRef.current.focus();
    }
  }, [isSelected, isEditing]);

  const handleClick = () => {
    if (isNewInterface && onClick) {
      onClick();
    } else if (onSelect) {
      onSelect();
    }
  };

  const handleDoubleClick = () => {
    if (isNewInterface && onDoubleClick) {
      onDoubleClick();
    }

    if (!isHeader) {
      selectAllOnEdit.current = true;
      setIsEditing(true);
      setEditValue(cellValue);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (isEditing) {
      if (e.key === "Enter") {
        handleSubmit();
        e.preventDefault();
      } else if (e.key === "Escape") {
        setIsEditing(false);
        setEditValue("");
        e.preventDefault();
      } else if (e.key === "Tab") {
        handleSubmit();
        e.preventDefault();
        if (onKeyDown) {
          onKeyDown(e, rowIndex, colIndex);
        }
      }
    } else {
      if (e.key === "Enter" || e.key === "F2") {
        if (!isHeader) {
          selectAllOnEdit.current = true;
          setIsEditing(true);
          setEditValue(cellValue);
        }
        e.preventDefault();
      } else if (e.key === "Delete" || e.key === "Backspace") {
        if (!isHeader) {
          if (isNewInterface && onChange) {
            onChange("");
          } else if (onValueChange) {
            onValueChange("");
          }
        }
        e.preventDefault();
      } else if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
        if (!isHeader) {
          selectAllOnEdit.current = false;
          setIsEditing(true);
          setEditValue(e.key);
        }
        e.preventDefault();
      } else {
        if (onKeyDown) {
          onKeyDown(e, rowIndex, colIndex);
        }
      }
    }
  };

  const handleSubmit = () => {
    setIsEditing(false);
    if (editValue !== cellValue) {
      if (isNewInterface && onChange) {
        onChange(editValue);
      } else if (onValueChange) {
        onValueChange(editValue);
      }
    }
  };

  const handleBlur = () => {
    if (isEditing) {
      handleSubmit();
    }
  };

  const getStatusColor = (status: string) => {
    const lowerCaseStatus = status.toLowerCase();
    switch (lowerCaseStatus) {
      case "in progress":
        return "bg-yellow-100 text-yellow-800";
      case "need to start":
        return "bg-blue-100 text-blue-800";
      case "pending":
        return "bg-blue-100 text-blue-800";
      case "complete":
        return "bg-green-100 text-green-800";
      case "blocked":
        return "bg-red-100 text-red-800";
      default:
        return "";
    }
  };

  const getPriorityColor = (priority: string) => {
    const lowerCasePriority = priority.toLowerCase();
    switch (lowerCasePriority) {
      case "high":
        return "text-red-600";
      case "medium":
        return "text-yellow-600";
      case "low":
        return "text-blue-600";
      default:
        return "";
    }
  };

  const highlightSearchTerm = (text: string, term: string) => {
    if (!term || !text) return text;

    const regex = new RegExp(`(${term})`, "gi");
    const parts = text.split(regex);

    return parts.map((part, index) =>
      regex.test(part) ? (
        <mark key={index} className="bg-yellow-200">
          {part}
        </mark>
      ) : (
        part
      )
    );
  };

  const isURL = (text: string) => {
    try {
      const url = new URL(text);
      return url.protocol === "http:" || url.protocol === "https:";
    } catch {
      return false;
    }
  };

  const renderCellContent = () => {
    if (isEditing) {
      return (
        <input
          ref={inputRef}
          type="text"
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          className="w-full h-full bg-transparent outline-none border-none p-0 text-sm"
        />
      );
    }

    if (cellType === "status" && cellValue) {
      return (
        <span
          className={`px-1 py-0.5 rounded-full font-medium inline-block text-sm ${getStatusColor(
            cellValue
          )}`}
          style={{ lineHeight: "1.2" }}
        >
          {highlightSearchTerm(cellValue, searchTerm)}
        </span>
      );
    }

    if (cellType === "priority" && cellValue) {
      return (
        <span
          className={`font-medium text-sm ${getPriorityColor(cellValue)}`}
          style={{ lineHeight: "1.2" }}
        >
          {highlightSearchTerm(cellValue, searchTerm)}
        </span>
      );
    }

    if (cellType === "url" && cellValue) {
      return (
        <a
          href={cellValue}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:text-blue-800 underline cursor-pointer truncate text-sm"
          style={{ lineHeight: "1.2" }}
          onClick={(e) => e.stopPropagation()}
        >
          {highlightSearchTerm(cellValue, searchTerm)}
        </a>
      );
    }

    // Auto-detect status, priority, and URLs for new interface
    if (isNewInterface && cellValue) {
      const lowerValue = cellValue.toLowerCase();

      // Check for URL values
      if (isURL(cellValue)) {
        return (
          <a
            href={cellValue}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-800 underline cursor-pointer truncate text-sm"
            style={{ lineHeight: "1.2" }}
            onClick={(e) => e.stopPropagation()}
          >
            {highlightSearchTerm(cellValue, searchTerm)}
          </a>
        );
      }

      // Check for status values
      if (
        [
          "in progress",
          "need to start",
          "pending",
          "complete",
          "blocked",
        ].includes(lowerValue)
      ) {
        return (
          <span
            className={`px-1 py-0.5 rounded-full font-medium inline-block text-sm ${getStatusColor(
              cellValue
            )}`}
            style={{ lineHeight: "1.2" }}
          >
            {highlightSearchTerm(cellValue, searchTerm)}
          </span>
        );
      }

      // Check for priority values
      if (["high", "medium", "low"].includes(lowerValue)) {
        return (
          <span
            className={`font-medium text-sm ${getPriorityColor(cellValue)}`}
            style={{ lineHeight: "1.2" }}
          >
            {highlightSearchTerm(cellValue, searchTerm)}
          </span>
        );
      }
    }

    return (
      <span
        className="truncate text-sm overflow-hidden text-ellipsis whitespace-nowrap"
        style={{ lineHeight: "1.2" }}
      >
        {highlightSearchTerm(cellValue, searchTerm)}
      </span>
    );
  };

  return (
    <div
      ref={cellRef}
      className={clsx(
        "h-8 border-r border-b border-gray-300 relative cursor-cell flex items-center px-1 sm:px-3 text-sm min-h-8 max-h-8 overflow-hidden",
        {
          "bg-gray-50 font-medium text-gray-700 sticky top-0 z-20": isHeader,
          "bg-primary-100": isColumnSelected && !isSelected,
          "bg-primary-50 border-primary-300 ring-1 ring-primary-500 ring-inset":
            isSelected && !isHeader,
          "bg-yellow-100 border-yellow-300":
            isHighlighted && !isSelected && !isHeader,
          "bg-white hover:bg-gray-50":
            !isSelected && !isHeader && !isHighlighted && !isColumnSelected,
        },
        className
      )}
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
      onKeyDown={handleKeyDown}
      tabIndex={isSelected ? 0 : -1}
      style={{ height: "32px" }}
    >
      <div className="w-full overflow-hidden">{renderCellContent()}</div>

      {isSelected && !isHeader && !isEditing && (
        <div className="absolute -bottom-1 -right-1 w-2 h-2 bg-primary-600 border border-white" />
      )}
    </div>
  );
};

export default SpreadsheetCell;

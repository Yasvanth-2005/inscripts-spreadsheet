import React, { useState, useRef, useEffect, useMemo } from "react";
import { SpreadsheetData, SelectedCell } from "../types/spreadsheet";
import { getCellId, headers, mainHeadersConfig } from "../utils/spreadsheet";
import SpreadsheetCell from "./SpreadsheetCell";
import {
  Tag,
  User,
  UserCheck,
  Flag,
  DollarSign,
  ChevronDown,
  FileText,
  Calendar,
  Music,
  MessageSquareQuote,
  Sparkles,
  GitBranch,
  HardDriveDownload,
} from "lucide-react";

interface SpreadsheetGridProps {
  data: SpreadsheetData;
  rows: number;
  columns: number;
  selectedCell: SelectedCell;
  searchTerm: string;
  onCellSelect: (row: number, column: number) => void;
  onCellDoubleClick: (row: number, column: number) => void;
  onCellValueChange: (
    row: number,
    column: number,
    value: string | number
  ) => void;
  onAddColumn: () => void;
  selectedColumns: number[];
  hiddenColumns: number[];
  sortOrder: { column: number; direction: "asc" | "desc" }[];
  onSortIndicatorClick: (column: number, e: React.MouseEvent) => void;
  onCellKeyDown: (e: React.KeyboardEvent, row: number, col: number) => void;
  onClearSortForColumn: (column: number) => void;
}

const SpreadsheetGrid: React.FC<SpreadsheetGridProps> = ({
  data,
  rows,
  columns,
  selectedCell,
  searchTerm,
  onCellSelect,
  onCellDoubleClick,
  onCellValueChange,
  onAddColumn,
  selectedColumns,
  hiddenColumns,
  sortOrder,
  onSortIndicatorClick,
  onCellKeyDown,
  onClearSortForColumn,
}) => {
  const gridRef = useRef<HTMLDivElement>(null);
  const [columnWidths, setColumnWidths] = useState<Record<number, number>>({});
  const [isResizing, setIsResizing] = useState(false);
  const [resizingCol, setResizingCol] = useState<number | null>(null);
  const [startX, setStartX] = useState(0);
  const [startWidth, setStartWidth] = useState(0);

  const visibleColumns = useMemo(() => {
    return Array.from({ length: columns }, (_, i) => i).filter(
      (col) => !hiddenColumns.includes(col)
    );
  }, [columns, hiddenColumns]);

  // Initialize column widths
  useEffect(() => {
    const initialWidths: Record<number, number> = {};
    visibleColumns.forEach((col) => {
      initialWidths[col] = col === 0 ? 250 : 150; // Set Job Request width to 250px, others to 150px
    });
    setColumnWidths(initialWidths);
  }, [visibleColumns]);

  const handleMouseDown = (e: React.MouseEvent, colIndex: number) => {
    setIsResizing(true);
    setResizingCol(colIndex);
    setStartX(e.clientX);
    setStartWidth(columnWidths[colIndex] || 150); // Use current width or default
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing || resizingCol === null) return;

      const newWidth = startWidth + (e.clientX - startX);
      setColumnWidths((prevWidths) => ({
        ...prevWidths,
        [resizingCol]: Math.max(50, newWidth), // Minimum width of 50px
      }));
    };

    const handleMouseUp = () => {
      setIsResizing(false);
      setResizingCol(null);
    };

    if (isResizing) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    } else {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isResizing, resizingCol, startX, startWidth]);

  const sortedData = useMemo(() => {
    let newData = { ...data };

    // Apply sort order
    const sortedColumnIndices = sortOrder.map((s) => s.column);
    const primarySort = sortOrder[0];

    if (primarySort) {
      const colIndex = primarySort.column;
      const direction = primarySort.direction;

      const rowsToSort = Object.keys(newData)
        .filter((id) => {
          const [row] = id.split("-").map(Number);
          return row > 0; // Exclude header row (row 0)
        })
        .map((id) => {
          const [row] = id.split("-").map(Number);
          return row;
        })
        .filter((value, index, self) => self.indexOf(value) === index) // Get unique row numbers
        .sort((rowA, rowB) => {
          const cellA = newData[getCellId(rowA, colIndex)]?.value;
          const cellB = newData[getCellId(rowB, colIndex)]?.value;

          if (typeof cellA === "string" && typeof cellB === "string") {
            return direction === "asc"
              ? cellA.localeCompare(cellB)
              : cellB.localeCompare(cellA);
          }
          if (typeof cellA === "number" && typeof cellB === "number") {
            return direction === "asc" ? cellA - cellB : cellB - cellA;
          }
          return 0;
        });

      const newOrderedData: SpreadsheetData = {};
      const newHeaders: SpreadsheetData = {};

      // Copy header row
      for (let col = 0; col < columns; col++) {
        const headerCellId = getCellId(0, col);
        newHeaders[headerCellId] = newData[headerCellId];
      }

      // Copy sorted data rows
      sortedColumnIndices.forEach(() => {
        rowsToSort.forEach((row, newRowIndex) => {
          for (let col = 0; col < columns; col++) {
            const originalCellId = getCellId(row, col);
            const newCellId = getCellId(newRowIndex + 1, col); // Adjust row index for new order
            newOrderedData[newCellId] = newData[originalCellId];
          }
        });
      });

      // Fill in remaining empty cells for the new order
      for (let row = 1; row <= rows; row++) {
        for (let col = 0; col < columns; col++) {
          const cellId = getCellId(row, col);
          if (!newOrderedData[cellId]) {
            newOrderedData[cellId] = {
              id: cellId,
              value: null,
              type: "text",
            };
          }
        }
      }
      newData = { ...newHeaders, ...newOrderedData };
    } else {
      // If no sort, ensure data is reset to original positions for all rows beyond headers
      for (let row = 1; row <= rows; row++) {
        for (let col = 0; col < columns; col++) {
          const cellId = getCellId(row, col);
          if (!newData[cellId]) {
            newData[cellId] = {
              id: cellId,
              value: null,
              type: "text",
            };
          }
        }
      }
    }

    return newData;
  }, [data, sortOrder, rows, columns]);

  const gridTemplateColumns = useMemo(() => {
    const visibleWidths = visibleColumns.map((col) => `${columnWidths[col]}px`);
    return `50px ${visibleWidths.join(" ")} 40px`;
  }, [visibleColumns, columnWidths]);

  const filteredData = useMemo(() => {
    return sortedData;
  }, [sortedData]);

  const actualRows = useMemo(() => {
    return rows;
  }, [rows]);

  const getHeaderIcon = (headerText: string | number | null) => {
    const text = String(headerText).toLowerCase();
    switch (text) {
      case "job request":
        return <FileText className="w-4 h-4 mr-2 text-gray-500" />;
      case "submitted":
        return <Calendar className="w-4 h-4 mr-2 text-gray-500" />;
      case "status":
        return <Tag className="w-4 h-4 mr-2 text-gray-500" />;
      case "submitter":
        return <User className="w-4 h-4 mr-2 text-gray-500" />;
      case "assigned":
        return <UserCheck className="w-4 h-4 mr-2 text-gray-500" />;
      case "priority":
        return <Flag className="w-4 h-4 mr-2 text-gray-500" />;
      case "est. value":
        return <DollarSign className="w-4 h-4 mr-2 text-gray-500" />;
      default:
        return null;
    }
  };

  const getHeaderText = (headerText: string | number | null) => {
    const text = String(headerText);
    if (text.toLowerCase() === "est. value") {
      return "Est. Value";
    }
    return text;
  };

  // Function to get Lucide icon component based on string name
  const getLucideIcon = (iconName: string) => {
    switch (iconName) {
      case "GitBranch":
        return GitBranch;
      case "Music":
        return Music;
      case "MessageSquareQuote":
        return MessageSquareQuote;
      case "Sparkles":
        return Sparkles;
      case "HardDriveDownload":
        return HardDriveDownload;
      default:
        return null;
    }
  };

  return (
    <div className="flex-1 overflow-auto bg-white">
      <div
        ref={gridRef}
        className="grid gap-0 border-l border-t border-gray-300 min-w-max"
        style={{
          gridTemplateColumns,
          gridTemplateRows: "32px 32px auto", // Two header rows and then auto for content
          cursor: isResizing ? "col-resize" : "default",
        }}
      >
        {/* Top Header Row */}
        {/* Empty cell for # column */}
        <div
          className="sticky left-0 top-0 z-20 bg-gray-100 border-r border-b border-gray-300 h-8 min-h-8 max-h-8"
          style={{ gridColumn: "1 / span 1", gridRow: "1" }}
        />

        {mainHeadersConfig.map((mainHeader, mainHeaderIndex) => {
          const startColName = mainHeader.columns[0];
          const endColName = mainHeader.columns[mainHeader.columns.length - 1];

          const startIndex = headers.indexOf(startColName);
          const endIndex = headers.indexOf(endColName);

          if (startIndex === -1 || endIndex === -1) {
            console.warn(`Main header columns not found: ${mainHeader.title}`);
            return null;
          }

          const span = endIndex - startIndex + 1;
          const gridColumnStart = startIndex + 2; // +1 for # column, +1 for 1-indexed grid

          const IconComponent = getLucideIcon(mainHeader.icon);
          const bgColor = `bg-${mainHeader.color}-100`;
          const textColor = `text-${mainHeader.color}-800`;

          // Special handling for URL spacer, which should be white
          if (mainHeader.title === "URL Spacer") {
            return (
              <div
                key={`main-header-${mainHeaderIndex}`}
                className="sticky top-0 z-10 bg-white border-r border-b border-gray-300 h-8 min-h-8 max-h-8"
                style={{
                  gridColumn: `${gridColumnStart} / span ${span}`,
                  gridRow: "1",
                }}
              />
            );
          }

          return (
            <div
              key={`main-header-${mainHeaderIndex}`}
              className={`sticky top-0 z-10 ${bgColor} ${textColor} border-r border-b border-gray-300 flex items-center justify-center px-2 text-sm font-medium h-8 min-h-8 max-h-8`}
              style={{
                gridColumn: `${gridColumnStart} / span ${span}`,
                gridRow: "1",
              }}
            >
              {IconComponent && <IconComponent className="w-4 h-4 mr-1" />}
              <span>{mainHeader.title}</span>
            </div>
          );
        })}

        {/* Add Column button for the top header row */}
        <div
          className="sticky top-0 z-10 bg-gray-100 border-l border-b border-gray-300 flex items-center justify-center h-8 min-h-8 max-h-8"
          style={{ gridColumn: `${columns + 2} / span 1`, gridRow: "1" }}
        >
          <button
            onClick={onAddColumn}
            className="w-6 h-6 flex items-center justify-center text-gray-500 hover:text-gray-700 hover:bg-gray-200 rounded"
            title="Add Column"
          >
            +
          </button>
        </div>

        {/* Row header for second header row */}
        <div
          className="sticky left-0 top-0 z-20 bg-gray-100 border-r border-b border-gray-300 flex items-center justify-center text-xs font-medium text-gray-600 h-8 min-h-8 max-h-8"
          style={{ height: "32px", gridColumn: "1 / span 1", gridRow: "2" }}
        >
          #
        </div>

        {/* Column headers (second header row) */}
        {visibleColumns.map((col, index) => (
          <div
            key={`header-${col}`}
            className={`sticky top-0 z-10 border-r border-b border-gray-300 flex items-center justify-between px-2 text-sm font-medium h-8 min-h-8 max-h-8 cursor-pointer select-none ${
              selectedColumns.includes(col)
                ? "bg-primary-200"
                : "bg-gray-100 hover:bg-gray-200 text-gray-600"
            }`}
            style={{ gridColumn: `${index + 2} / span 1`, gridRow: "2" }}
            onClick={() => onCellSelect(0, col)}
            onDoubleClick={() => onCellDoubleClick(0, col)}
          >
            <div className="flex items-center">
              {getHeaderIcon(sortedData[getCellId(0, col)]?.value)}
              <span className="truncate">
                {getHeaderText(sortedData[getCellId(0, col)]?.value) ||
                  `Column ${col + 1}`}
              </span>
            </div>
            <div className="flex items-center">
              {sortOrder.find((s) => s.column === col) && (
                <>
                  <span
                    className="text-primary-600 cursor-pointer hover:text-primary-800"
                    onClick={(e) => onSortIndicatorClick(col, e)}
                  >
                    {sortOrder.find((s) => s.column === col)?.direction ===
                    "asc"
                      ? "↑"
                      : "↓"}
                    <span className="text-xs ml-0.5">
                      {sortOrder.findIndex((s) => s.column === col) + 1}
                    </span>
                  </span>
                  <button
                    className="ml-1 text-gray-400 hover:text-red-500 text-xs focus:outline-none"
                    title="Clear Sort"
                    onClick={(e) => {
                      e.stopPropagation();
                      onClearSortForColumn(col);
                    }}
                  >
                    ×
                  </button>
                </>
              )}
              <ChevronDown className="w-4 h-4 ml-1 text-gray-400 opacity-50" />
            </div>

            {/* Resize handle */}
            <div
              className="absolute right-0 top-0 w-1 h-full cursor-col-resize hover:bg-primary-500 opacity-25 hover:opacity-75 z-30"
              onMouseDown={(e) => handleMouseDown(e, col)}
              style={{ width: "2px" }}
            />
          </div>
        ))}

        {/* Empty cell for add column button column in the second header row */}
        <div
          className="sticky top-0 z-10 bg-gray-100 border-r border-b border-gray-300 h-8 min-h-8 max-h-8"
          style={{ gridColumn: `${columns + 2} / span 1`, gridRow: "2" }}
        />

        {/* Data rows - start from row 1, not row 0 */}
        {Array.from({ length: actualRows - 1 }, (_, index) => index + 1).map(
          (row) => (
            <React.Fragment key={`row-${row}`}>
              {/* Row number */}
              <div
                className="sticky left-0 z-10 bg-gray-100 border-r border-b border-gray-300 flex items-center justify-center text-xs font-medium text-gray-600 h-8 min-h-8 max-h-8"
                style={{ gridColumn: "1 / span 1", gridRow: `${row + 2}` }}
              >
                {row}
              </div>

              {/* Data cells */}
              {visibleColumns.map((col, index) => {
                const cellData = filteredData[getCellId(row, col)];
                const isJobRequest = col === 0;

                return (
                  <SpreadsheetCell
                    key={`${row}-${col}`}
                    value={cellData?.value || ""}
                    isSelected={
                      selectedCell.row === row && selectedCell.column === col
                    }
                    isColumnSelected={selectedColumns.includes(col)}
                    onClick={() => onCellSelect(row, col)}
                    onDoubleClick={() => onCellDoubleClick(row, col)}
                    onChange={(value) => onCellValueChange(row, col, value)}
                    searchTerm={searchTerm}
                    cell={cellData}
                    isHeader={false}
                    isHighlighted={false}
                    rowIndex={row}
                    colIndex={col}
                    onKeyDown={onCellKeyDown}
                    className={isJobRequest ? "line-clamp-1" : ""}
                    style={{
                      gridColumn: `${index + 2} / span 1`,
                      gridRow: `${row + 2}`,
                    }}
                  />
                );
              })}

              {/* Empty cell for add column button column */}
              <div
                className="border-r border-b border-gray-300 h-8 min-h-8 max-h-8"
                style={{
                  gridColumn: `${columns + 2} / span 1`,
                  gridRow: `${row + 2}`,
                }}
              />
            </React.Fragment>
          )
        )}
      </div>
    </div>
  );
};

export default SpreadsheetGrid;

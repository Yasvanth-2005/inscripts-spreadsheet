import React, {
  useCallback,
  useState,
  useRef,
  useEffect,
  useMemo,
} from "react";
import { SpreadsheetData, SelectedCell } from "../types/spreadsheet";
import { getCellId } from "../utils/spreadsheet";
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
}) => {
  const [horizontalScroll, setHorizontalScroll] = useState(0);
  const [columnWidths, setColumnWidths] = useState<number[]>(() => {
    const initialWidths = [250, 120, 120, 150, 200, 150, 100, 120, 150];
    for (let i = initialWidths.length; i < columns; i++) {
      initialWidths.push(120);
    }
    return initialWidths;
  });
  const [isMobile, setIsMobile] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [resizingColumn, setResizingColumn] = useState<number | null>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    if (columnWidths.length < columns) {
      const newWidths = [...columnWidths];
      for (let i = columnWidths.length; i < columns; i++) {
        newWidths.push(120);
      }
      setColumnWidths(newWidths);
    } else if (columnWidths.length > columns) {
      setColumnWidths((prev) => prev.slice(0, columns));
    }
  }, [columns, columnWidths.length]);

  const handleMouseDown = useCallback(
    (e: React.MouseEvent, columnIndex: number) => {
      e.preventDefault();
      setIsResizing(true);
      setResizingColumn(columnIndex);

      const startX = e.clientX;
      const startWidth = columnWidths[columnIndex];

      const handleMouseMove = (e: MouseEvent) => {
        const deltaX = e.clientX - startX;
        const newWidth = Math.max(50, startWidth + deltaX);

        setColumnWidths((prev) => {
          const newWidths = [...prev];
          newWidths[columnIndex] = newWidth;
          return newWidths;
        });
      };

      const handleMouseUp = () => {
        setIsResizing(false);
        setResizingColumn(null);
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
      };

      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    },
    [columnWidths]
  );

  const isCellHighlighted = useCallback(
    (cell: any) => {
      if (!searchTerm.trim()) return false;
      const cellValue = cell.value?.toString().toLowerCase() || "";
      return cellValue.includes(searchTerm.toLowerCase());
    },
    [searchTerm]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent, rowIndex: number, colIndex: number) => {
      let newRow = rowIndex;
      let newCol = colIndex;

      switch (e.key) {
        case "ArrowUp":
          newRow = Math.max(0, rowIndex - 1);
          break;
        case "ArrowDown":
          newRow = Math.min(rows - 1, rowIndex + 1);
          break;
        case "ArrowLeft":
          newCol = Math.max(0, colIndex - 1);
          break;
        case "ArrowRight":
          newCol = Math.min(columns - 1, colIndex + 1);
          break;
        case "Tab":
          if (e.shiftKey) {
            // Shift+Tab - move left/up
            if (colIndex > 0) {
              newCol = colIndex - 1;
            } else if (rowIndex > 0) {
              newRow = rowIndex - 1;
              newCol = columns - 1;
            }
          } else {
            // Tab - move right/down
            if (colIndex < columns - 1) {
              newCol = colIndex + 1;
            } else if (rowIndex < rows - 1) {
              newRow = rowIndex + 1;
              newCol = 0;
            }
          }
          break;
        case "Home":
          if (e.ctrlKey) {
            newRow = 0;
            newCol = 0;
          } else {
            newCol = 0;
          }
          break;
        case "End":
          if (e.ctrlKey) {
            newRow = rows - 1;
            newCol = columns - 1;
          } else {
            newCol = columns - 1;
          }
          break;
        default:
          return; // Don't prevent default for other keys
      }

      if (newRow !== rowIndex || newCol !== colIndex) {
        onCellSelect(newRow, newCol);
        e.preventDefault();
      }
    },
    [onCellSelect, rows, columns]
  );

  const scrollLeft = () => {
    setHorizontalScroll(Math.max(0, horizontalScroll - 200));
  };

  const scrollRight = () => {
    setHorizontalScroll(horizontalScroll + 200);
  };

  // Filter out hidden columns
  const visibleColumns = useMemo(() => {
    return Array.from({ length: columns }, (_, index) => index).filter(
      (col) => !hiddenColumns.includes(col)
    );
  }, [columns, hiddenColumns]);

  // Sort data based on sort order - improved logic
  const sortedData = useMemo(() => {
    if (sortOrder.length === 0) return data;

    // Get all data rows (excluding header)
    const dataRows = Array.from({ length: rows - 1 }, (_, i) => i + 1).filter(
      (row) => {
        // Check if row has any data
        for (let col = 0; col < columns; col++) {
          const cellData = data[getCellId(row, col)];
          if (cellData && cellData.value !== null && cellData.value !== "") {
            return true;
          }
        }
        return false;
      }
    );

    // Sort the data rows
    const sortedRows = dataRows.sort((a, b) => {
      for (const sort of sortOrder) {
        const aCell = data[getCellId(a, sort.column)];
        const bCell = data[getCellId(b, sort.column)];
        const aValue = aCell?.value || "";
        const bValue = bCell?.value || "";

        // Convert to string for comparison, handle numbers
        let aStr: string, bStr: string;
        let aNum: number, bNum: number;

        // Try to parse as numbers first
        aNum = parseFloat(String(aValue).replace(/[,$]/g, ""));
        bNum = parseFloat(String(bValue).replace(/[,$]/g, ""));

        if (!isNaN(aNum) && !isNaN(bNum)) {
          // Both are numbers
          if (aNum < bNum) return sort.direction === "asc" ? -1 : 1;
          if (aNum > bNum) return sort.direction === "asc" ? 1 : -1;
        } else {
          // String comparison
          aStr = String(aValue).toLowerCase();
          bStr = String(bValue).toLowerCase();

          if (aStr < bStr) return sort.direction === "asc" ? -1 : 1;
          if (aStr > bStr) return sort.direction === "asc" ? 1 : -1;
        }
      }
      return 0;
    });

    // Reconstruct data with sorted rows
    const newData: SpreadsheetData = {};

    // Keep header row unchanged
    for (let col = 0; col < columns; col++) {
      const headerCellId = getCellId(0, col);
      newData[headerCellId] = data[headerCellId];
    }

    // Place sorted data rows
    sortedRows.forEach((originalRow, index) => {
      const newRow = index + 1;
      for (let col = 0; col < columns; col++) {
        const originalCellId = getCellId(originalRow, col);
        const newCellId = getCellId(newRow, col);
        newData[newCellId] = data[originalCellId];
      }
    });

    // Fill remaining rows with empty cells
    for (let row = sortedRows.length + 1; row < rows; row++) {
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

    return newData;
  }, [data, sortOrder, rows, columns]);

  const gridTemplateColumns = useMemo(() => {
    const visibleWidths = visibleColumns.map((col) => `${columnWidths[col]}px`);
    return `50px ${visibleWidths.join(" ")} 40px`;
  }, [visibleColumns, columnWidths]);

  const filteredData = useMemo(() => {
    // Always return all data, let cells handle highlighting
    return sortedData;
  }, [sortedData]);

  // Calculate actual number of rows with data for proper row numbering
  const actualRows = useMemo(() => {
    return rows; // Use the sheet's row count directly for consistent numbering
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
      return "Est. V...";
    }
    return text;
  };

  return (
    <div className="flex-1 overflow-auto bg-white">
      <div
        ref={gridRef}
        className="grid gap-0 border-l border-t border-gray-300 min-w-max"
        style={{
          gridTemplateColumns,
          cursor: isResizing ? "col-resize" : "default",
        }}
      >
        {/* Row header for header row */}
        <div
          className="sticky left-0 top-0 z-20 bg-gray-100 border-r border-b border-gray-300 flex items-center justify-center text-xs font-medium text-gray-600 h-8 min-h-8 max-h-8"
          style={{ height: "32px" }}
        >
          #
        </div>

        {/* Column headers */}
        {visibleColumns.map((col) => (
          <div
            key={`header-${col}`}
            className={`sticky top-0 z-10 bg-gray-100 border-r border-b border-gray-300 flex items-center justify-between px-2 text-sm font-medium text-gray-600 h-8 min-h-8 max-h-8 relative cursor-pointer select-none ${
              selectedColumns.includes(col)
                ? "bg-primary-200"
                : "hover:bg-gray-200"
            }`}
            onClick={() => onCellSelect(0, col)}
            onDoubleClick={() => onCellDoubleClick(0, col)}
            style={{ height: "32px" }}
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
                <span
                  className="text-primary-600 cursor-pointer hover:text-primary-800"
                  onClick={(e) => onSortIndicatorClick(col, e)}
                >
                  {sortOrder.find((s) => s.column === col)?.direction === "asc"
                    ? "↑"
                    : "↓"}
                  <span className="text-xs ml-0.5">
                    {sortOrder.findIndex((s) => s.column === col) + 1}
                  </span>
                </span>
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

        {/* Add column button */}
        <div
          className="sticky top-0 z-10 bg-gray-100 border-r border-b border-gray-300 flex items-center justify-center h-8 min-h-8 max-h-8"
          style={{ height: "32px" }}
        >
          <button
            onClick={onAddColumn}
            className="w-6 h-6 flex items-center justify-center text-gray-500 hover:text-gray-700 hover:bg-gray-200 rounded"
            title="Add Column"
          >
            +
          </button>
        </div>

        {/* Data rows - start from row 1, not row 0 */}
        {Array.from({ length: actualRows - 1 }, (_, index) => index + 1).map(
          (row) => (
            <React.Fragment key={`row-${row}`}>
              {/* Row number */}
              <div
                className="sticky left-0 z-10 bg-gray-100 border-r border-b border-gray-300 flex items-center justify-center text-xs font-medium text-gray-600 h-8 min-h-8 max-h-8"
                style={{ height: "32px" }}
              >
                {row}
              </div>

              {/* Data cells */}
              {visibleColumns.map((col) => {
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
                  />
                );
              })}

              {/* Empty cell for add column button column */}
              <div
                className="border-r border-b border-gray-300 h-8 min-h-8 max-h-8"
                style={{ height: "32px" }}
              />
            </React.Fragment>
          )
        )}
      </div>
    </div>
  );
};

export default SpreadsheetGrid;

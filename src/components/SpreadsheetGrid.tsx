import React, { useState, useRef, useEffect, useMemo } from "react";
import { SpreadsheetData, SelectedCell } from "../types/spreadsheet";
import { getCellId, MainHeaderConfig } from "../utils/spreadsheet";
import SpreadsheetCell from "./SpreadsheetCell";
import {
  User,
  Flag,
  ChevronDown,
  FileText,
  Calendar,
  Music,
  MessageSquareQuote,
  Sparkles,
  HardDriveDownload,
  LucideIcon,
  Link,
  CheckCircle,
  IndianRupee,
  GitFork,
  MoreHorizontal,
  Filter,
  SlidersHorizontal,
  GitBranch,
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
  mainHeaderConfig: MainHeaderConfig[];
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
  mainHeaderConfig,
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

  useEffect(() => {
    const initialWidths: Record<number, number> = {};
    visibleColumns.forEach((col) => {
      initialWidths[col] = 150;
      if (col === 0) {
        initialWidths[col] = 250;
      }
    });
    setColumnWidths(initialWidths);
  }, [visibleColumns]);

  const handleMouseDown = (e: React.MouseEvent, colIndex: number) => {
    setIsResizing(true);
    setResizingCol(colIndex);
    setStartX(e.clientX);
    setStartWidth(columnWidths[colIndex] || 150);
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing || resizingCol === null) return;

      const newWidth = startWidth + (e.clientX - startX);
      setColumnWidths((prevWidths) => ({
        ...prevWidths,
        [resizingCol]: Math.max(50, newWidth),
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
    const primarySort = sortOrder[0];

    if (primarySort) {
      const colIndex = primarySort.column;
      const direction = primarySort.direction;
      const rowIndices = Array.from({ length: rows - 1 }, (_, i) => i + 1);
      rowIndices.sort((rowA, rowB) => {
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
      for (let col = 0; col < columns; col++) {
        const headerCellId = getCellId(0, col);
        newOrderedData[headerCellId] = newData[headerCellId];
      }
      rowIndices.forEach((row, newRowIndex) => {
        for (let col = 0; col < columns; col++) {
          const originalCellId = getCellId(row, col);
          const newCellId = getCellId(newRowIndex + 1, col);
          newOrderedData[newCellId] = newData[originalCellId];
        }
      });
      newData = newOrderedData;
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

  const adjustedMainHeaderConfig = useMemo(() => {
    return mainHeaderConfig
      .map((header) => {
        let adjustedFromColumn = header.fromColumn;
        let adjustedToColumn = header.toColumn;

        const hiddenBeforeFrom = hiddenColumns.filter(
          (col) => col < header.fromColumn
        ).length;
        const hiddenBeforeTo = hiddenColumns.filter(
          (col) => col <= header.toColumn
        ).length;

        adjustedFromColumn = header.fromColumn - hiddenBeforeFrom;
        adjustedToColumn = header.toColumn - hiddenBeforeTo;

        return {
          ...header,
          fromColumn: adjustedFromColumn,
          toColumn: adjustedToColumn,
        };
      })
      .filter((header) => header.fromColumn <= header.toColumn);
  }, [mainHeaderConfig, hiddenColumns]);

  const getLucideIcon = (iconName: string): LucideIcon | null => {
    switch (iconName) {
      case "Link":
        return Link;
      case "Music":
        return Music;
      case "MessageSquareQuote":
        return MessageSquareQuote;
      case "Sparkles":
        return Sparkles;
      case "HardDriveDownload":
        return HardDriveDownload;
      case "GitFork":
        return GitFork;
      case "Filter":
        return Filter;
      case "SlidersHorizontal":
        return SlidersHorizontal;
      case "GitBranch":
        return GitBranch;
      default:
        return null;
    }
  };

  const getHeaderIcon = (headerText: string | number | null) => {
    const text = String(headerText).toLowerCase();
    switch (text) {
      case "job request":
        return <FileText className="w-4 h-4 mr-2 text-gray-500" />;
      case "submitted":
        return <Calendar className="w-4 h-4 mr-2 text-gray-500" />;
      case "status":
        return <CheckCircle className="w-4 h-4 mr-2 text-gray-500" />;
      case "submitter":
        return <User className="w-4 h-4 mr-2 text-gray-500" />;
      case "url":
        return <Link className="w-4 h-4 mr-2 text-gray-500" />;
      case "assigned":
        return <GitBranch className="w-4 h-4 mr-2 text-gray-500" />;
      case "priority":
        return <Flag className="w-4 h-4 mr-2 text-gray-500" />;
      case "est. value":
        return <IndianRupee className="w-4 h-4 mr-2 text-gray-500" />;
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

  const getSubheaderStyle = (headerValue: string, columnIndex: number) => {
    const mainHeaderColor = getColumnColorFromMainHeader(columnIndex);
    if (mainHeaderColor) {
      return mainHeaderColor;
    }

    switch (headerValue) {
      case "assigned":
        return { backgroundColor: "#E2E2E2", color: "#444" };
      case "priority":
        return { backgroundColor: "#E2E2E2", color: "#444" };
      case "due date":
        return { backgroundColor: "#EAE3FC", color: "#5F4B8B" };
      case "est. value":
        return { backgroundColor: "#FFE9E0", color: "#C97B63" };
      case "extract":
        return { backgroundColor: "#FFE9E0", color: "#C97B63" };
      case "answer a question":
        return { backgroundColor: "#EAE3FC", color: "#5F4B8B" };
      default:
        return { backgroundColor: "#E2E2E2", color: "#444" };
    }
  };

  const getColumnColorFromMainHeader = (columnIndex: number) => {
    for (const header of mainHeaderConfig) {
      // Adjust for 1-based mainHeaderConfig indices
      if (
        columnIndex >= header.fromColumn - 1 &&
        columnIndex <= header.toColumn - 1
      ) {
        if (header.colorClass) {
          return { backgroundColor: header.colorClass, color: "#444" };
        }
        break;
      }
    }
    return null;
  };

  return (
    <div className="flex-1 overflow-auto bg-white">
      <div
        ref={gridRef}
        className="grid gap-0 border-l border-t border-gray-300 min-w-max"
        style={{
          gridTemplateColumns,
          gridTemplateRows: "32px 32px auto",
          cursor: isResizing ? "col-resize" : "default",
        }}
      >
        {/* Top Header Row */}
        {/* Empty cell for # column */}
        <div
          className="sticky left-0 top-0 z-20 bg-gray-100 border-r border-b border-gray-300 h-8 min-h-8 max-h-8"
          style={{ gridColumn: "1 / span 1", gridRow: "1" }}
        />

        {adjustedMainHeaderConfig.map(
          (header: MainHeaderConfig, index: number) => {
            const colSpan = header.toColumn - header.fromColumn + 1;
            const IconComponent = header.icon
              ? getLucideIcon(header.icon)
              : null;

            return (
              <div
                key={`main-header-${index}`}
                className={`sticky top-0 z-10 border-r border-b border-gray-300 flex items-center px-2 text-sm font-medium h-8 min-h-8 max-h-8 ${
                  header.label === "Q3 Financial Overview"
                    ? "justify-between"
                    : "justify-center"
                }`}
                style={{
                  gridColumn: `${header.fromColumn + 1} / span ${colSpan}`,
                  gridRow: "1",
                  backgroundColor: header.colorClass || "",
                }}
              >
                <div className="flex items-center ">
                  {IconComponent && (
                    <IconComponent
                      className={`w-4 h-4 mr-1 ${
                        header.label === "Q3 Financial Overview"
                          ? "text-blue-500"
                          : ""
                      }`}
                    />
                  )}
                  {header.label && (
                    <span className="font-medium whitespace-nowrap">
                      {header.label}
                    </span>
                  )}
                </div>
                {(header.label === "ABC" ||
                  header.label === "Answer a question" ||
                  header.label === "Extract") && (
                  <MoreHorizontal className="w-4 h-4 text-gray-400 opacity-50 ml-1" />
                )}
                {header.label === "Q3 Financial Overview" && (
                  <HardDriveDownload className="w-4 h-4 text-gray-400 flex-shrink-0 ml-1" />
                )}
              </div>
            );
          }
        )}

        {/* Add Column button for the top header row */}
        <div
          className="sticky top-0 z-10 bg-gray-100 border-l border-b border-gray-300 flex items-center justify-center h-8 min-h-8 max-h-8"
          style={{
            gridColumn: `${visibleColumns.length + 2} / span 1`,
            gridRow: "1",
          }}
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
          className="sticky left-0 top-0 z-20 bg-gray-100 border-r border-b border-gray-300 flex items-center justify-center text-base font-medium text-gray-600 h-8 min-h-8 max-h-8"
          style={{ height: "32px", gridColumn: "1 / span 1", gridRow: "2" }}
        >
          #
        </div>

        {/* Column headers (second header row) */}
        {visibleColumns.map((originalCol, visibleIndex) => {
          const headerValue = (
            sortedData[getCellId(0, originalCol)]?.value || ""
          )
            .toString()
            .toLowerCase();
          const subheaderStyle = getSubheaderStyle(headerValue, originalCol);
          return (
            <div
              key={`header-${originalCol}`}
              className={`sticky top-0 z-10 border-r border-b border-gray-300 flex items-center justify-between px-2 text-sm font-medium h-8 min-h-8 max-h-8 cursor-pointer select-none`}
              style={{
                gridColumn: `${visibleIndex + 2} / span 1`,
                gridRow: "2",
                ...subheaderStyle,
              }}
              onClick={() => onCellSelect(0, originalCol)}
              onDoubleClick={() => onCellDoubleClick(0, originalCol)}
            >
              <div className="flex items-center">
                {getHeaderIcon(sortedData[getCellId(0, originalCol)]?.value)}
                <span className="whitespace-nowrap">
                  {getHeaderText(
                    sortedData[getCellId(0, originalCol)]?.value
                  ) || `Column ${originalCol + 1}`}
                </span>
              </div>
              <div className="flex items-center">
                {sortOrder.find((s) => s.column === originalCol) && (
                  <>
                    <span
                      className="text-primary-600 cursor-pointer hover:text-primary-800"
                      onClick={(e) => onSortIndicatorClick(originalCol, e)}
                    >
                      {sortOrder.find((s) => s.column === originalCol)
                        ?.direction === "asc"
                        ? "↑"
                        : "↓"}
                      <span className="text-xs ml-0.5">
                        {sortOrder.findIndex((s) => s.column === originalCol) +
                          1}
                      </span>
                    </span>
                    <button
                      className="ml-1 text-gray-400 hover:text-red-500 text-xs focus:outline-none"
                      title="Clear Sort"
                      onClick={(e) => {
                        e.stopPropagation();
                        onClearSortForColumn(originalCol);
                      }}
                    >
                      ×
                    </button>
                  </>
                )}
                <ChevronDown className="w-4 h-4 ml-1 text-gray-400 opacity-50" />
              </div>
              <div
                className="absolute right-0 top-0 w-1 h-full cursor-col-resize hover:bg-primary-500 opacity-25 hover:opacity-75 z-30"
                onMouseDown={(e) => handleMouseDown(e, originalCol)}
                style={{ width: "2px" }}
              />
            </div>
          );
        })}

        {/* Empty cell for add column button column in the second header row */}
        <div
          className="sticky top-0 z-10 bg-gray-100 border-r border-b border-gray-300 h-8 min-h-8 max-h-8"
          style={{
            gridColumn: `${visibleColumns.length + 2} / span 1`,
            gridRow: "2",
          }}
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
              {visibleColumns.map((originalCol, visibleIndex) => {
                const headerValue = (
                  sortedData[getCellId(0, originalCol)]?.value || ""
                )
                  .toString()
                  .toLowerCase();
                const isCenter =
                  headerValue === "status" || headerValue === "priority";
                const cellData = filteredData[getCellId(row, originalCol)];
                const isJobRequest = originalCol === 0;
                return (
                  <SpreadsheetCell
                    key={`${row}-${originalCol}`}
                    value={cellData?.value || ""}
                    isSelected={
                      selectedCell.row === row &&
                      selectedCell.column === originalCol
                    }
                    isColumnSelected={selectedColumns.includes(originalCol)}
                    onClick={() => onCellSelect(row, originalCol)}
                    onDoubleClick={() => onCellDoubleClick(row, originalCol)}
                    onChange={(value) =>
                      onCellValueChange(row, originalCol, value)
                    }
                    searchTerm={searchTerm}
                    cell={cellData}
                    isHeader={false}
                    isHighlighted={false}
                    rowIndex={row}
                    colIndex={originalCol}
                    onKeyDown={onCellKeyDown}
                    className={`${isJobRequest ? "line-clamp-1" : ""} ${
                      isCenter ? "text-center" : ""
                    }`}
                    style={{
                      gridColumn: `${visibleIndex + 2} / span 1`,
                      gridRow: `${row + 2}`,
                    }}
                  />
                );
              })}

              {/* Empty cell for add column button column */}
              <div
                className="border-r border-b border-gray-300 h-8 min-h-8 max-h-8"
                style={{
                  gridColumn: `${visibleColumns.length + 2} / span 1`,
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

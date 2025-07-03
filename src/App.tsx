import { useState, useCallback } from "react";
import Header from "./components/Header";
import Toolbar from "./components/Toolbar";
import SubHeader from "./components/SubHeader";
import SpreadsheetGrid from "./components/SpreadsheetGrid";
import FilterTabs from "./components/FilterTabs";
import AddColumnModal from "./components/AddColumnModal";
import { SpreadsheetData, SelectedCell, Sheet } from "./types/spreadsheet";
import {
  generateInitialData,
  generateSheetData,
  getCellId,
  createEmptyCell,
} from "./utils/spreadsheet";

const initialTabs = [
  { id: "all-orders", name: "All Orders" },
  { id: "pending", name: "Pending" },
  { id: "reviewed", name: "Reviewed" },
  { id: "arrived", name: "Arrived" },
];

function App() {
  const [sheets, setSheets] = useState<Sheet[]>(() => {
    return initialTabs.map((tab) => {
      const { data, rows, columns } = generateSheetData(tab.id);
      return { id: tab.id, name: tab.name, data, rows, columns };
    });
  });
  const [activeSheetId, setActiveSheetId] = useState<string>(sheets[0].id);

  const [selectedCell, setSelectedCell] = useState<SelectedCell>({
    row: 6,
    column: 0,
  });
  const [selectedColumns, setSelectedColumns] = useState<number[]>([]);
  const [hiddenColumns, setHiddenColumns] = useState<number[]>([]);
  const [sortOrder, setSortOrder] = useState<
    { column: number; direction: "asc" | "desc" }[]
  >([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddColumnModalOpen, setIsAddColumnModalOpen] = useState(false);

  const getActiveSheet = useCallback(() => {
    return sheets.find((sheet) => sheet.id === activeSheetId)!;
  }, [sheets, activeSheetId]);

  const handleCellSelect = useCallback((row: number, column: number) => {
    setSelectedCell({ row, column });
    if (row === 0) {
      // Header clicked - handle column selection
      setSelectedColumns((prev) => {
        if (prev.includes(column)) {
          // Column already selected, remove it
          return prev.filter((col) => col !== column);
        } else {
          // Add column to selection
          return [...prev, column];
        }
      });
    } else {
      // Regular cell clicked - clear column selection
      setSelectedColumns([]);
    }
  }, []);

  const handleCellDoubleClick = useCallback((row: number, column: number) => {
    if (row === 0) {
      // Double-click on header - deselect column
      setSelectedColumns((prev) => prev.filter((col) => col !== column));
    }
  }, []);

  const handleSortIndicatorClick = useCallback(
    (column: number, e: React.MouseEvent) => {
      e.stopPropagation(); // Prevent column selection
      setSortOrder((prev) => {
        const existingIndex = prev.findIndex((item) => item.column === column);
        if (existingIndex >= 0) {
          // Toggle direction if already in sort order
          const newOrder = [...prev];
          newOrder[existingIndex].direction =
            newOrder[existingIndex].direction === "asc" ? "desc" : "asc";
          return newOrder;
        } else {
          // Add new column to sort order
          return [...prev, { column, direction: "asc" }];
        }
      });
    },
    []
  );

  const handleCellKeyDown = useCallback(
    (e: React.KeyboardEvent, row: number, col: number) => {
      const activeSheet = getActiveSheet();
      if (!activeSheet) return;

      const visibleColumns = Array.from(
        { length: activeSheet.columns },
        (_, index) => index
      ).filter((c) => !hiddenColumns.includes(c));

      const currentVisibleIndex = visibleColumns.findIndex((c) => c === col);

      let nextRow = row;
      let nextCol = col;
      let nextColIndex = currentVisibleIndex;
      let shouldNavigate = false;

      if (e.key === "Tab") {
        e.preventDefault();
        shouldNavigate = true;

        if (e.shiftKey) {
          // Shift + Tab
          nextColIndex--;
          if (nextColIndex < 0) {
            nextRow = Math.max(0, row - 1);
            nextColIndex = visibleColumns.length - 1;
          }
        } else {
          // Tab
          nextColIndex++;
          if (nextColIndex >= visibleColumns.length) {
            nextRow = Math.min(activeSheet.rows - 1, row + 1);
            nextColIndex = 0;
          }
        }
        nextCol = visibleColumns[nextColIndex];
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        e.stopPropagation();
        shouldNavigate = true;
        nextRow = Math.max(0, row - 1);
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        e.stopPropagation();
        shouldNavigate = true;
        nextRow = Math.min(activeSheet.rows - 1, row + 1);
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        e.stopPropagation();
        shouldNavigate = true;
        nextColIndex = Math.max(0, currentVisibleIndex - 1);
        nextCol = visibleColumns[nextColIndex];
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        e.stopPropagation();
        shouldNavigate = true;
        nextColIndex = Math.min(
          visibleColumns.length - 1,
          currentVisibleIndex + 1
        );
        nextCol = visibleColumns[nextColIndex];
      }

      if (shouldNavigate) {
        if (nextRow < 0) {
          nextRow = activeSheet.rows - 1;
        }

        handleCellSelect(nextRow, nextCol);
      }
    },
    [getActiveSheet, hiddenColumns, handleCellSelect]
  );

  const handleCellValueChange = useCallback(
    (row: number, column: number, value: string | number) => {
      const cellId = getCellId(row, column);
      setSheets((prevSheets) =>
        prevSheets.map((sheet) => {
          if (sheet.id === activeSheetId) {
            const newData: SpreadsheetData = {
              ...sheet.data,
              [cellId]: {
                ...sheet.data[cellId],
                value: value,
                type: (typeof value === "number" ? "number" : "text") as
                  | "text"
                  | "number",
              },
            };
            let newSheet = { ...sheet, data: newData };

            if (row === sheet.rows - 1 && value) {
              const newRowIndex = sheet.rows;
              for (let col = 0; col < sheet.columns; col++) {
                const newCellId = getCellId(newRowIndex, col);
                newData[newCellId] = createEmptyCell(newRowIndex, col);
              }
              newSheet.rows = sheet.rows + 1;
            }

            return newSheet;
          }
          return sheet;
        })
      );
    },
    [activeSheetId]
  );

  const handleAddColumn = useCallback(
    (name: string) => {
      setSheets((prevSheets) =>
        prevSheets.map((sheet) => {
          if (sheet.id === activeSheetId) {
            const newColumns = sheet.columns + 1;
            const newColIndex = sheet.columns;
            const newData: SpreadsheetData = { ...sheet.data };

            const headerCellId = getCellId(0, newColIndex);
            newData[headerCellId] = {
              id: headerCellId,
              value: name,
              type: "text",
            };

            for (let i = 1; i < sheet.rows; i++) {
              const cellId = getCellId(i, newColIndex);
              newData[cellId] = createEmptyCell(i, newColIndex);
            }

            return { ...sheet, columns: newColumns, data: newData };
          }
          return sheet;
        })
      );
    },
    [activeSheetId]
  );

  const handleToolbarAction = useCallback(
    (action: string) => {
      if (action === "addColumn") {
        setIsAddColumnModalOpen(true);
      } else if (action === "hide-fields" && selectedColumns.length > 0) {
        setHiddenColumns((prev) => [...new Set([...prev, ...selectedColumns])]);
        setSelectedColumns([]);
      } else if (action === "show-all") {
        setHiddenColumns([]);
      } else if (action === "clear-sort") {
        setSortOrder([]);
      } else if (action === "sort" && selectedColumns.length > 0) {
        setSortOrder((prev) => {
          const newOrder = [...prev];
          selectedColumns.forEach((col) => {
            const isAlreadySorted = newOrder.some(
              (item) => item.column === col
            );
            if (!isAlreadySorted) {
              newOrder.push({ column: col, direction: "asc" });
            }
          });
          return newOrder;
        });
        setSelectedColumns([]);
      }
      console.log(`Executing toolbar action: ${action}`);
    },
    [selectedColumns]
  );

  const handleSheetChange = useCallback((sheetId: string) => {
    setActiveSheetId(sheetId);
    setSelectedColumns([]);
    setHiddenColumns([]);
    setSortOrder([]);
  }, []);

  const handleSearchChange = useCallback((term: string) => {
    setSearchTerm(term);
  }, []);

  const handleExport = useCallback(() => {
    const activeSheet = getActiveSheet();
    if (!activeSheet) return;

    const csvData = [];
    const visibleColumns = Array.from(
      { length: activeSheet.columns },
      (_, index) => index
    ).filter((c) => !hiddenColumns.includes(c));

    // Add headers
    const headers = visibleColumns.map((col) => {
      const cellId = getCellId(0, col);
      return activeSheet.data[cellId]?.value || `Column ${col + 1}`;
    });
    csvData.push(headers.join(","));

    // Add data rows
    for (let row = 1; row < activeSheet.rows; row++) {
      const rowData = visibleColumns.map((col) => {
        const cellId = getCellId(row, col);
        const value = activeSheet.data[cellId]?.value || "";
        // Escape commas and quotes in CSV
        return typeof value === "string" && value.includes(",")
          ? `"${value.replace(/"/g, '""')}"`
          : value;
      });
      csvData.push(rowData.join(","));
    }

    const csvContent = csvData.join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `${activeSheet.name.replace(/\s+/g, "_")}_export.csv`
    );
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, [getActiveSheet, hiddenColumns]);

  const handleHideFields = useCallback(() => {
    if (selectedColumns.length > 0) {
      setHiddenColumns((prev) => [...new Set([...prev, ...selectedColumns])]);
      setSelectedColumns([]);
    }
  }, [selectedColumns]);

  const handleShowAll = useCallback(() => {
    setHiddenColumns([]);
  }, []);

  const handleSort = useCallback(() => {
    if (selectedColumns.length > 0) {
      setSortOrder((prev) => {
        const newOrder = [...prev];
        selectedColumns.forEach((col) => {
          const isAlreadySorted = newOrder.some((item) => item.column === col);
          if (!isAlreadySorted) {
            newOrder.push({ column: col, direction: "asc" });
          }
        });
        return newOrder;
      });
      setSelectedColumns([]);
    }
  }, [selectedColumns]);

  const handleClearSort = useCallback(() => {
    setSortOrder([]);
  }, []);

  const activeSheet = getActiveSheet();

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      <Header onSearchChange={handleSearchChange} />

      <Toolbar
        onAction={handleToolbarAction}
        isColumnSelected={selectedColumns.length > 0}
        onHideFields={handleHideFields}
        onShowAll={handleShowAll}
        onSort={handleSort}
        onClearSort={handleClearSort}
        selectedColumns={selectedColumns}
        hiddenColumns={hiddenColumns}
        sheets={sheets}
        currentSheet={activeSheetId}
        onExport={handleExport}
      />

      <SubHeader />

      <div className="flex-1 overflow-auto">
        <SpreadsheetGrid
          key={activeSheet.id}
          data={activeSheet.data}
          rows={activeSheet.rows}
          columns={activeSheet.columns}
          selectedCell={selectedCell}
          searchTerm={searchTerm}
          onCellSelect={handleCellSelect}
          onCellDoubleClick={handleCellDoubleClick}
          onCellValueChange={handleCellValueChange}
          onAddColumn={() => setIsAddColumnModalOpen(true)}
          selectedColumns={selectedColumns}
          hiddenColumns={hiddenColumns}
          sortOrder={sortOrder}
          onSortIndicatorClick={handleSortIndicatorClick}
          onCellKeyDown={handleCellKeyDown}
        />
      </div>

      <div className="bg-white border-t border-gray-200">
        <FilterTabs
          sheets={sheets}
          activeSheetId={activeSheetId}
          onTabChange={handleSheetChange}
          onAddSheet={() => {
            /* TODO: Implement add sheet modal */
          }}
        />
      </div>
      <AddColumnModal
        isOpen={isAddColumnModalOpen}
        onClose={() => setIsAddColumnModalOpen(false)}
        onAddColumn={(name) => {
          handleAddColumn(name);
          setIsAddColumnModalOpen(false);
        }}
      />
    </div>
  );
}

export default App;

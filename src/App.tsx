import { useState, useCallback } from "react";
import Header from "./components/Header";
import Toolbar from "./components/Toolbar";
import SpreadsheetGrid from "./components/SpreadsheetGrid";
import FilterTabs from "./components/FilterTabs";
import AddColumnModal from "./components/AddColumnModal";
import AddSheetModal from "./components/AddSheetModal";
import { SpreadsheetData, SelectedCell, Sheet } from "./types/spreadsheet";
import {
  generateSheetData,
  getCellId,
  createEmptyCell,
  mainHeaderConfig as initialMainHeaderConfig,
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
  const [isAddSheetModalOpen, setIsAddSheetModalOpen] = useState(false);
  const [mainHeaderConfig, setMainHeaderConfig] = useState(
    initialMainHeaderConfig
  );

  const getActiveSheet = useCallback(() => {
    return sheets.find((sheet) => sheet.id === activeSheetId)!;
  }, [sheets, activeSheetId]);

  const handleCellSelect = useCallback((row: number, column: number) => {
    setSelectedCell({ row, column });
    if (row === 0) {
      setSelectedColumns((prev) => {
        if (prev.includes(column)) {
          return prev.filter((col) => col !== column);
        } else {
          return [...prev, column];
        }
      });
    } else {
      setSelectedColumns([]);
    }
  }, []);

  const handleCellDoubleClick = useCallback((row: number, column: number) => {
    if (row === 0) {
      setSelectedColumns((prev) => prev.filter((col) => col !== column));
    }
  }, []);

  const handleSortIndicatorClick = useCallback(
    (column: number, e: React.MouseEvent) => {
      e.stopPropagation();
      setSortOrder((prev) => {
        const existingIndex = prev.findIndex((item) => item.column === column);
        if (existingIndex >= 0) {
          const newOrder = [...prev];
          if (newOrder[existingIndex].direction === "asc") {
            newOrder[existingIndex].direction = "desc";
          } else {
            newOrder[existingIndex].direction = "asc";
          }
          return newOrder;
        } else {
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
          nextColIndex--;
          if (nextColIndex < 0) {
            nextRow = Math.max(0, row - 1);
            nextColIndex = visibleColumns.length - 1;
          }
        } else {
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
            const newSheet = { ...sheet, data: newData };

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
    (mainHeaderName: string | undefined, headerName: string) => {
      const groupName =
        mainHeaderName && mainHeaderName.trim() ? mainHeaderName : " ";
      setSheets((prevSheets) =>
        prevSheets.map((sheet) => {
          if (sheet.id === activeSheetId) {
            const newColumns = sheet.columns + 1;
            const newColIndex = sheet.columns;
            const newData: SpreadsheetData = { ...sheet.data };

            const headerCellId = getCellId(0, newColIndex);
            newData[headerCellId] = {
              id: headerCellId,
              value: headerName,
              type: "text",
            };

            const subHeaderCellId = getCellId(1, newColIndex);
            newData[subHeaderCellId] = {
              id: subHeaderCellId,
              value: " ",
              type: "text",
            };

            for (let i = 2; i < sheet.rows; i++) {
              const cellId = getCellId(i, newColIndex);
              newData[cellId] = createEmptyCell(i, newColIndex);
            }

            return { ...sheet, columns: newColumns, data: newData };
          }
          return sheet;
        })
      );
      setMainHeaderConfig((prev) => {
        const lastCol = prev.reduce((max, h) => Math.max(max, h.toColumn), -1);
        const existing = prev.find((h) => h.label === groupName);
        if (existing) {
          return prev.map((h) =>
            h.label === groupName ? { ...h, toColumn: h.toColumn + 1 } : h
          );
        } else {
          return [
            ...prev,
            {
              label: groupName,
              fromColumn: lastCol + 1,
              toColumn: lastCol + 1,
              type: "main",
              colorClass: "#F3F4F6",
            },
          ];
        }
      });
    },
    [activeSheetId]
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

    const headers = visibleColumns.map((col) => {
      const cellId = getCellId(0, col);
      return activeSheet.data[cellId]?.value || `Column ${col + 1}`;
    });
    csvData.push(headers.join(","));

    for (let row = 1; row < activeSheet.rows; row++) {
      const rowData = visibleColumns.map((col) => {
        const cellId = getCellId(row, col);
        const value = activeSheet.data[cellId]?.value || "";

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

  const handleClearSortForColumn = useCallback((column: number) => {
    setSortOrder((prev) => prev.filter((item) => item.column !== column));
  }, []);

  const handleAddSheet = useCallback(
    (name: string) => {
      const currentSheet = sheets.find((s) => s.id === activeSheetId);
      if (!currentSheet) return;
      const newId = name.toLowerCase().replace(/\s+/g, "-") + "-" + Date.now();

      const newData: SpreadsheetData = {};
      for (let col = 0; col < currentSheet.columns; col++) {
        const headerCellId = getCellId(0, col);
        newData[headerCellId] = {
          ...currentSheet.data[headerCellId],
          id: getCellId(0, col),
        };
      }
      setSheets((prev) => [
        ...prev,
        {
          id: newId,
          name,
          data: newData,
          rows: currentSheet.rows,
          columns: currentSheet.columns,
        },
      ]);
      setActiveSheetId(newId);
    },
    [sheets, activeSheetId]
  );

  const activeSheet = getActiveSheet();

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      <Header onSearchChange={handleSearchChange} />

      <Toolbar
        isColumnSelected={selectedColumns.length > 0}
        onHideFields={handleHideFields}
        onShowAll={handleShowAll}
        onSort={handleSort}
        hiddenColumns={hiddenColumns}
        onExport={handleExport}
      />

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
          onClearSortForColumn={handleClearSortForColumn}
          mainHeaderConfig={mainHeaderConfig}
        />
      </div>

      <div className="bg-white border-t border-gray-200">
        <FilterTabs
          sheets={sheets}
          activeSheetId={activeSheetId}
          onTabChange={handleSheetChange}
          onAddSheet={() => setIsAddSheetModalOpen(true)}
        />
      </div>
      <AddColumnModal
        isOpen={isAddColumnModalOpen}
        onClose={() => setIsAddColumnModalOpen(false)}
        onAddColumn={(name, column) => {
          handleAddColumn(name, column);
          setIsAddColumnModalOpen(false);
        }}
      />
      <AddSheetModal
        isOpen={isAddSheetModalOpen}
        onClose={() => setIsAddSheetModalOpen(false)}
        onAddSheet={(name) => {
          handleAddSheet(name);
          setIsAddSheetModalOpen(false);
        }}
      />
    </div>
  );
}

export default App;

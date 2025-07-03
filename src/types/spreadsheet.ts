export interface Task {
  id: number;
  jobRequest: string;
  submitted: string;
  status: "In progress" | "Need to start" | "Complete" | "Blocked" | "Pending";
  submitter: string;
  url: string;
  assigned: string;
  priority: "High" | "Medium" | "Low";
  dueDate: string;
  estValue: string;
}

export interface Sheet {
  id: string;
  name: string;
  data: SpreadsheetData;
  rows: number;
  columns: number;
}

export interface Cell {
  id: string;
  value: string | number | null;
  type: "text" | "number" | "status" | "priority" | "date" | "url";
  format?: CellFormat;
}

export interface CellFormat {
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  fontSize?: number;
  fontColor?: string;
  backgroundColor?: string;
  textAlign?: "left" | "center" | "right";
}

// Support both cell-based access (getCellId) and array-like access
export interface SpreadsheetData {
  [key: string]: Cell;
}

// Alternative data structure for easier array-like access
export interface SpreadsheetDataArray {
  [row: number]: {
    [column: number]: string | number | null;
  };
}

export interface SelectedCell {
  row: number;
  column: number;
}

export interface FilterTab {
  id: string;
  label: string;
  count?: number;
  active: boolean;
}

import { Cell, SpreadsheetData, Task } from "../types/spreadsheet";

export const columnToLetter = (column: number): string => {
  const columns = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L"];
  return columns[column] || "";
};

export const getCellId = (row: number, column: number): string => {
  return `${columnToLetter(column)}${row + 1}`;
};

export const createEmptyCell = (row: number, column: number): Cell => {
  return {
    id: getCellId(row, column),
    value: null,
    type: "text",
  };
};

export const allOrdersTasks: Task[] = [
  {
    id: 1,
    jobRequest: "Launch social media campaign for product launch",
    submitted: "15-10-2024",
    status: "In progress",
    submitter: "John Doe",
    url: "https://www.johnlaunch.com/social-media-campaign",
    assigned: "Sophie Choudhury",
    priority: "Medium",
    dueDate: "20-11-2024",
    estValue: "4,500.000",
  },
  {
    id: 2,
    jobRequest: "Update press kit for company redesign",
    submitted: "28-10-2024",
    status: "Need to start",
    submitter: "Irfan Khan",
    url: "https://www.irfankhan.com/press-kit-redesign",
    assigned: "Tejas Pandey",
    priority: "High",
    dueDate: "30-10-2024",
    estValue: "3,600.000",
  },
  {
    id: 3,
    jobRequest: "Finalize user testing feedback for app",
    submitted: "05-12-2024",
    status: "In progress",
    submitter: "Mark Johnson",
    url: "https://www.markjohnson.com/user-testing-feedback",
    assigned: "Rachel Lee",
    priority: "Medium",
    dueDate: "10-12-2024",
    estValue: "4,750.000",
  },
  {
    id: 4,
    jobRequest: "Design new features for the website",
    submitted: "10-01-2025",
    status: "Complete",
    submitter: "Emily Green",
    url: "https://www.emilygreen.com/website-features",
    assigned: "Tom Wright",
    priority: "Low",
    dueDate: "15-01-2025",
    estValue: "5,900.000",
  },
  {
    id: 5,
    jobRequest: "Prepare financial report for Q4",
    submitted: "25-01-2025",
    status: "Blocked",
    submitter: "Jessica Brown",
    url: "https://www.jessicabrown.com/financial-report-q4",
    assigned: "Kevin Smith",
    priority: "Low",
    dueDate: "30-01-2025",
    estValue: "2,800.000",
  },
];

export const pendingTasks: Task[] = [
  {
    id: 6,
    jobRequest: "Create marketing materials for Q1",
    submitted: "05-02-2025",
    status: "Need to start",
    submitter: "Alice Cooper",
    url: "https://www.alicemarketing.com/q1-materials",
    assigned: "Maria Garcia",
    priority: "High",
    dueDate: "28-02-2025",
    estValue: "6,200.000",
  },
  {
    id: 7,
    jobRequest: "Set up customer feedback system",
    submitted: "08-02-2025",
    status: "Pending",
    submitter: "David Wilson",
    url: "https://www.davidfeedback.com/customer-system",
    assigned: "James Rodriguez",
    priority: "Medium",
    dueDate: "15-03-2025",
    estValue: "3,800.000",
  },
  {
    id: 8,
    jobRequest: "Develop mobile app prototype",
    submitted: "12-02-2025",
    status: "Need to start",
    submitter: "Sarah Miller",
    url: "https://www.sarahmobile.com/app-prototype",
    assigned: "Alex Thompson",
    priority: "High",
    dueDate: "20-03-2025",
    estValue: "8,500.000",
  },
];

export const reviewedTasks: Task[] = [
  {
    id: 9,
    jobRequest: "Website performance optimization",
    submitted: "20-01-2025",
    status: "In progress",
    submitter: "Chris Evans",
    url: "https://www.chrisoptimize.com/website-performance",
    assigned: "Lisa Anderson",
    priority: "High",
    dueDate: "05-03-2025",
    estValue: "7,200.000",
  },
  {
    id: 10,
    jobRequest: "Database migration project",
    submitted: "25-01-2025",
    status: "In progress",
    submitter: "Robert Taylor",
    url: "https://www.robertdb.com/database-migration",
    assigned: "Diana Chen",
    priority: "Medium",
    dueDate: "10-03-2025",
    estValue: "5,400.000",
  },
];

export const arrivedTasks: Task[] = [
  {
    id: 11,
    jobRequest: "Deploy new security features",
    submitted: "15-01-2025",
    status: "Complete",
    submitter: "Michael Brown",
    url: "https://www.michaelsecurity.com/security-features",
    assigned: "Jennifer Wilson",
    priority: "High",
    dueDate: "01-02-2025",
    estValue: "9,100.000",
  },
  {
    id: 12,
    jobRequest: "Update API documentation",
    submitted: "18-01-2025",
    status: "Complete",
    submitter: "Linda Davis",
    url: "https://www.lindaapi.com/api-documentation",
    assigned: "Kevin Zhang",
    priority: "Low",
    dueDate: "05-02-2025",
    estValue: "2,300.000",
  },
  {
    id: 13,
    jobRequest: "Implement payment gateway",
    submitted: "22-01-2025",
    status: "Complete",
    submitter: "Susan Johnson",
    url: "https://www.susanpayment.com/payment-gateway",
    assigned: "Daniel Lee",
    priority: "High",
    dueDate: "08-02-2025",
    estValue: "6,800.000",
  },
];

// Keep original for backward compatibility
export const sampleTasks = allOrdersTasks;

export const headers = [
  "Job Request",
  "Submitted",
  "Status",
  "Submitter",
  "URL",
  "Assigned",
  "Priority",
  "Due Date",
  "Est. Value",
];

export const mainHeadersConfig = [
  {
    title: "Q3 Financial Overview",
    icon: "GitBranch",
    color: "gray",
    columns: ["Job Request", "Submitted", "Status", "Submitter"],
  },
  {
    title: "URL Spacer",
    icon: "",
    color: "white",
    columns: ["URL"],
  },
  {
    title: "ABC",
    icon: "Music",
    color: "green",
    columns: ["Assigned"],
  },
  {
    title: "Answer a question",
    icon: "MessageSquareQuote",
    color: "purple",
    columns: ["Priority", "Due Date"],
  },
  {
    title: "Extract",
    icon: "Sparkles",
    color: "orange",
    columns: ["Est. Value"],
  },
];

const createSheetData = (
  tasks: Task[]
): {
  data: SpreadsheetData;
  rows: number;
  columns: number;
} => {
  const data: SpreadsheetData = {};
  const columns = headers.length;

  // Create headers
  headers.forEach((header, colIndex) => {
    const cellId = getCellId(0, colIndex);
    data[cellId] = {
      id: cellId,
      value: header,
      type: "text",
    };
  });

  // Create task rows
  tasks.forEach((task, rowIndex) => {
    const actualRow = rowIndex + 1;

    data[getCellId(actualRow, 0)] = {
      id: getCellId(actualRow, 0),
      value: task.jobRequest,
      type: "text",
    };
    data[getCellId(actualRow, 1)] = {
      id: getCellId(actualRow, 1),
      value: task.submitted,
      type: "date",
    };
    data[getCellId(actualRow, 2)] = {
      id: getCellId(actualRow, 2),
      value: task.status,
      type: "status",
    };
    data[getCellId(actualRow, 3)] = {
      id: getCellId(actualRow, 3),
      value: task.submitter,
      type: "text",
    };
    data[getCellId(actualRow, 4)] = {
      id: getCellId(actualRow, 4),
      value: task.url,
      type: "url",
    };
    data[getCellId(actualRow, 5)] = {
      id: getCellId(actualRow, 5),
      value: task.assigned,
      type: "text",
    };
    data[getCellId(actualRow, 6)] = {
      id: getCellId(actualRow, 6),
      value: task.priority,
      type: "priority",
    };
    data[getCellId(actualRow, 7)] = {
      id: getCellId(actualRow, 7),
      value: task.dueDate,
      type: "date",
    };
    data[getCellId(actualRow, 8)] = {
      id: getCellId(actualRow, 8),
      value: task.estValue,
      type: "text",
    };
  });

  const rows = Math.max(tasks.length + 1, 25); // Ensure at least 25 rows

  // Fill empty cells for remaining rows
  for (let row = tasks.length + 1; row < rows; row++) {
    for (let col = 0; col < columns; col++) {
      const cellId = getCellId(row, col);
      if (!data[cellId]) {
        data[cellId] = createEmptyCell(row, col);
      }
    }
  }

  return { data, rows, columns };
};

export const generateInitialData = (): {
  data: SpreadsheetData;
  rows: number;
  columns: number;
} => {
  return createSheetData(allOrdersTasks);
};

export const generateSheetData = (
  sheetType: string
): {
  data: SpreadsheetData;
  rows: number;
  columns: number;
} => {
  switch (sheetType) {
    case "all-orders":
      return createSheetData(allOrdersTasks);
    case "pending":
      return createSheetData(pendingTasks);
    case "reviewed":
      return createSheetData(reviewedTasks);
    case "arrived":
      return createSheetData(arrivedTasks);
    default:
      return createSheetData([]);
  }
};

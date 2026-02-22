export interface Employee {
  id: string;
  full_name: string;
  email: string;
  department: string;
}

export interface Attendance {
  id: number;
  employee: string;
  date: string;
  status: "Present" | "Absent";
}

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

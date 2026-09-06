export interface User {
  id: number;
  email: string;
  fullName: string;
  role: string;
  createdAt: string;
}

export interface Organization {
  id: number;
  name: string;
  slug: string;
  createdAt: string;
}

export interface Project {
  id: number;
  name: string;
  key: string;
  description: string | null;
  createdAt: string;
}

export type TaskStatus = "TODO" | "IN_PROGRESS" | "IN_REVIEW" | "DONE";
export type TaskPriority = "LOW" | "MEDIUM" | "HIGH" | "URGENT";

export interface Task {
  id: number;
  taskKey: string;
  title: string;
  description: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  assigneeId: number | null;
  assigneeName: string | null;
  reporterId: number;
  reporterName: string;
  dueDate: string | null;
  createdAt: string;
}
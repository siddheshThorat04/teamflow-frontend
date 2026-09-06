import { apiClient } from "./client";
import type { Task, TaskStatus, TaskPriority } from "../types";

export interface CreateTaskRequest {
  title: string;
  description?: string;
  priority?: TaskPriority;
  assigneeId?: number;
  dueDate?: string;
}

export interface UpdateTaskRequest {
  title?: string;
  description?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  assigneeId?: number;
  dueDate?: string;
}

export async function getTasksForProject(projectId: number): Promise<Task[]> {
  const response = await apiClient.get<Task[]>(`/api/projects/${projectId}/tasks`);
  return response.data;
}

export async function createTask(projectId: number, data: CreateTaskRequest): Promise<Task> {
  const response = await apiClient.post<Task>(`/api/projects/${projectId}/tasks`, data);
  return response.data;
}

export async function updateTask(
  projectId: number,
  taskId: number,
  data: UpdateTaskRequest
): Promise<Task> {
  const response = await apiClient.patch<Task>(`/api/projects/${projectId}/tasks/${taskId}`, data);
  return response.data;
}
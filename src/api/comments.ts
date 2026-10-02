import { apiClient } from "./client";

export interface Comment {
  id: number;
  content: string;
  authorId: number;
  authorName: string;
  createdAt: string;
}

export async function getCommentsForTask(taskId: number): Promise<Comment[]> {
  const response = await apiClient.get<Comment[]>(`/api/tasks/${taskId}/comments`);
  return response.data;
}

export async function addComment(taskId: number, content: string): Promise<Comment> {
  const response = await apiClient.post<Comment>(`/api/tasks/${taskId}/comments`, { content });
  return response.data;
}
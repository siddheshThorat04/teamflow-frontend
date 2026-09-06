import { apiClient } from "./client";
import type { Project } from "../types";

export async function getProjectsForOrg(orgSlug: string): Promise<Project[]> {
  const response = await apiClient.get<Project[]>(`/api/organizations/${orgSlug}/projects`);
  return response.data;
}

export async function createProject(
  orgSlug: string,
  data: { name: string; key: string; description?: string }
): Promise<Project> {
  const response = await apiClient.post<Project>(`/api/organizations/${orgSlug}/projects`, data);
  return response.data;
}
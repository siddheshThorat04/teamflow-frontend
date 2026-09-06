import { apiClient } from "./client";
import type { Organization } from "../types";

export async function getMyOrganizations(): Promise<Organization[]> {
  const response = await apiClient.get<Organization[]>("/api/organizations");
  return response.data;
}

export async function createOrganization(name: string): Promise<Organization> {
  const response = await apiClient.post<Organization>("/api/organizations", { name });
  return response.data;
}

export async function getOrganizationBySlug(slug: string): Promise<Organization> {
  const response = await apiClient.get<Organization>(`/api/organizations/${slug}`);
  return response.data;
}
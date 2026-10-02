import { apiClient } from "./client";

export interface OrganizationMember {
  userId: number;
  email: string;
  fullName: string;
  role: "OWNER" | "ADMIN" | "MEMBER";
}

export async function getMembers(orgSlug: string): Promise<OrganizationMember[]> {
  const response = await apiClient.get<OrganizationMember[]>(`/api/organizations/${orgSlug}/members`);
  return response.data;
}

export async function addMember(orgSlug: string, email: string): Promise<void> {
  await apiClient.post(`/api/organizations/${orgSlug}/members`, { email });
}
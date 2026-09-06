import { apiClient } from "./client";
import type { User } from "../types";

export interface RegisterRequest {
  email: string;
  password: string;
  fullName: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
}

export async function register(data: RegisterRequest): Promise<User> {
  const response = await apiClient.post<User>("/api/auth/register", data);
  return response.data;
}

export async function login(data: LoginRequest): Promise<AuthResponse> {
  const response = await apiClient.post<AuthResponse>("/api/auth/login", data);
  return response.data;
}
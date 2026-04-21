export interface User {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  companyName: string;
  createdAt: string;
  lastLoginAt: string | null;
  roles: string[];
}

export interface PagedResult<T> {
  items: T[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  companyName: string;
  roles: string[];
}

export interface AuthState {
  token: string | null;
  user: LoginResponse | null;
  isAuthenticated: boolean;
}

export interface CreateUserDto {
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  companyName: string;
  password: string;
  roles: string[];
}

export interface UpdateUserDto {
  email: string;
  firstName: string;
  lastName: string;
  companyName: string;
  roles: string[];
}
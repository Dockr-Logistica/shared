export enum UserRole {
  SUPER_ADMIN = 'super_admin',
  ADMIN = 'admin',
  USER = 'user',
}

export type UserStatus = 'active' | 'inactive' | 'blocked' | 'deleted';

export interface UserBase {
  full_name: string;
  email: string;
  cpf: string;
  phone: string | null;
}

export interface UserCreate extends UserBase {
  password: string;
  company_id: string;
}

export interface UserUpdate {
  full_name?: string;
  email?: string;
  cpf?: string;
  phone?: string | null;
  is_active?: boolean;
}

export interface UserResponse extends UserBase {
  id: string;
  is_active: boolean;
  role: UserRole;
  company_id: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  blocked_at: string | null;
  blocked_reason: string | null;
  last_access_at: string | null;
  status: UserStatus;
}

export interface UserListResponse {
  items: UserResponse[];
  total: number;
  skip: number;
  limit: number;
}

export interface UserListParams {
  status?: UserStatus;
  company_id?: string;
  search?: string;
  skip?: number;
  limit?: number;
  include_deleted?: boolean;
}

export interface BlockUserRequest {
  reason: string;
}

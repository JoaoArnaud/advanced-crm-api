export type UserRole = "ADMIN" | "USER";

export interface User {
  id: string;
  name: string;
  email: string;
  companyId: string;
  role: UserRole;
  createdAt?: string;
  updatedAt?: string;
}

export type LeadStatus = "HOT" | "WARM" | "COLD";

export interface Lead {
  id: string;
  name: string;
  email?: string | null;
  phone?: string | null;
  status: LeadStatus;
  cnpj?: string | null;
  cpf?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface Client {
  id: string;
  name: string;
  email?: string | null;
  phone?: string | null;
  cnpj?: string | null;
  leadOriginId?: string | null;
  leadOrigin?: {
    id: string;
    name: string;
    status?: LeadStatus;
  } | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface RegisterUserPayload {
  name: string;
  email: string;
  password: string;
  companyId: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface UpdateUserPayload {
  name?: string;
  companyId?: string;
  role?: UserRole;
}

export interface LeadPayload {
  name: string;
  email?: string | null;
  phone?: string | null;
  status: LeadStatus;
  cnpj?: string | null;
  cpf?: string | null;
}

export type LeadUpdatePayload = Partial<LeadPayload>;

export interface ClientPayload {
  name: string;
  email?: string | null;
  phone?: string | null;
  cnpj?: string | null;
  leadOriginId?: string | null;
}

export type ClientUpdatePayload = Partial<ClientPayload>;

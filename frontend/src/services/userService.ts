import { axiosInstance } from "./apiClient";
import {
  LoginPayload,
  RegisterUserPayload,
  UpdateUserPayload,
  User,
} from "@/types/api";

export const userService = {
  register(payload: RegisterUserPayload) {
    return axiosInstance.post<User>("/users", payload);
  },
  login(payload: LoginPayload) {
    return axiosInstance.post<User>("/users/login", payload);
  },
  getById(userId: string) {
    return axiosInstance.get<User>(`/users/${userId}`);
  },
  update(userId: string, payload: UpdateUserPayload) {
    return axiosInstance.patch<User>(`/users/${userId}`, payload);
  },
};

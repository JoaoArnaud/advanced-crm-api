import { axiosInstance } from "./apiClient";
import { Client, ClientPayload, ClientUpdatePayload } from "@/types/api";

export const clientService = {
  list(companyId: string) {
    return axiosInstance.get<Client[]>(`/companies/${companyId}/clients`);
  },
  create(companyId: string, payload: ClientPayload) {
    return axiosInstance.post<Client>(
      `/companies/${companyId}/clients`,
      payload,
    );
  },
  update(companyId: string, clientId: string, payload: ClientUpdatePayload) {
    return axiosInstance.patch<Client>(
      `/companies/${companyId}/clients/${clientId}`,
      payload,
    );
  },
  remove(companyId: string, clientId: string) {
    return axiosInstance.delete<void>(
      `/companies/${companyId}/clients/${clientId}`,
    );
  },
};

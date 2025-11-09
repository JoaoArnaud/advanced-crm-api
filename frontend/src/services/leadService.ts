import { axiosInstance } from "./apiClient";
import { Lead, LeadPayload, LeadUpdatePayload } from "@/types/api";

export const leadService = {
  list(companyId: string) {
    return axiosInstance.get<Lead[]>(`/companies/${companyId}/leads`);
  },
  create(companyId: string, payload: LeadPayload) {
    return axiosInstance.post<Lead>(`/companies/${companyId}/leads`, payload);
  },
  update(companyId: string, leadId: string, payload: LeadUpdatePayload) {
    return axiosInstance.patch<Lead>(
      `/companies/${companyId}/leads/${leadId}`,
      payload,
    );
  },
  remove(companyId: string, leadId: string) {
    return axiosInstance.delete<void>(
      `/companies/${companyId}/leads/${leadId}`,
    );
  },
};

"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  Client,
  ClientPayload,
  ClientUpdatePayload,
  Lead,
  LeadPayload,
  LeadUpdatePayload,
} from "@/types/api";
import { useAuth } from "@/contexts/AuthContext";
import { leadService } from "@/services/leadService";
import { clientService } from "@/services/clientService";

interface CRMDataContextValue {
  leads: Lead[];
  clients: Client[];
  loading: boolean;
  error: string | null;
  fetchAll: () => Promise<void>;
  createLead: (payload: LeadPayload) => Promise<Lead | null>;
  updateLead: (leadId: string, payload: LeadUpdatePayload) => Promise<Lead | null>;
  deleteLead: (leadId: string) => Promise<void>;
  createClient: (payload: ClientPayload) => Promise<Client | null>;
  updateClient: (
    clientId: string,
    payload: ClientUpdatePayload,
  ) => Promise<Client | null>;
  deleteClient: (clientId: string) => Promise<void>;
  clearError: () => void;
}

const CRMDataContext = createContext<CRMDataContextValue | undefined>(undefined);

export function CRMDataProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleError = useCallback((message: string) => {
    setError(message);
  }, []);

  const companyId = user?.companyId;

  const fetchAll = useCallback(async () => {
    if (!companyId) {
      setLeads([]);
      setClients([]);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const [leadsResponse, clientsResponse] = await Promise.all([
        leadService.list(companyId),
        clientService.list(companyId),
      ]);
      setLeads(leadsResponse.data);
      setClients(clientsResponse.data);
    } catch (err) {
      console.error(err);
      handleError("Não foi possível carregar os dados da empresa.");
    } finally {
      setLoading(false);
    }
  }, [companyId, handleError]);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const createLead = useCallback(
    async (payload: LeadPayload) => {
      if (!companyId) {
        handleError("Empresa não encontrada para o usuário atual.");
        return null;
      }
      try {
        const { data } = await leadService.create(companyId, payload);
        setLeads((prev) => [...prev, data]);
        return data;
      } catch (err) {
        console.error(err);
        handleError("Erro ao criar lead.");
        throw err;
      }
    },
    [companyId, handleError],
  );

  const updateLead = useCallback(
    async (leadId: string, payload: LeadUpdatePayload) => {
      if (!companyId) {
        handleError("Empresa não encontrada para o usuário atual.");
        return null;
      }
      try {
        const { data } = await leadService.update(companyId, leadId, payload);
        setLeads((prev) =>
          prev.map((lead) => (lead.id === leadId ? data : lead)),
        );
        return data;
      } catch (err) {
        console.error(err);
        handleError("Erro ao atualizar lead.");
        throw err;
      }
    },
    [companyId, handleError],
  );

  const deleteLead = useCallback(
    async (leadId: string) => {
      if (!companyId) {
        handleError("Empresa não encontrada para o usuário atual.");
        return;
      }
      try {
        await leadService.remove(companyId, leadId);
        setLeads((prev) => prev.filter((lead) => lead.id !== leadId));
      } catch (err) {
        console.error(err);
        handleError("Erro ao remover lead.");
        throw err;
      }
    },
    [companyId, handleError],
  );

  const createClient = useCallback(
    async (payload: ClientPayload) => {
      if (!companyId) {
        handleError("Empresa não encontrada para o usuário atual.");
        return null;
      }
      try {
        const { data } = await clientService.create(companyId, payload);
        setClients((prev) => [...prev, data]);
        return data;
      } catch (err) {
        console.error(err);
        handleError("Erro ao criar cliente.");
        throw err;
      }
    },
    [companyId, handleError],
  );

  const updateClient = useCallback(
    async (clientId: string, payload: ClientUpdatePayload) => {
      if (!companyId) {
        handleError("Empresa não encontrada para o usuário atual.");
        return null;
      }
      try {
        const { data } = await clientService.update(
          companyId,
          clientId,
          payload,
        );
        setClients((prev) =>
          prev.map((client) => (client.id === clientId ? data : client)),
        );
        return data;
      } catch (err) {
        console.error(err);
        handleError("Erro ao atualizar cliente.");
        throw err;
      }
    },
    [companyId, handleError],
  );

  const deleteClient = useCallback(
    async (clientId: string) => {
      if (!companyId) {
        handleError("Empresa não encontrada para o usuário atual.");
        return;
      }
      try {
        await clientService.remove(companyId, clientId);
        setClients((prev) => prev.filter((client) => client.id !== clientId));
      } catch (err) {
        console.error(err);
        handleError("Erro ao remover cliente.");
        throw err;
      }
    },
    [companyId, handleError],
  );

  const clearError = useCallback(() => setError(null), []);

  const value = useMemo(
    () => ({
      leads,
      clients,
      loading,
      error,
      fetchAll,
      createLead,
      updateLead,
      deleteLead,
      createClient,
      updateClient,
      deleteClient,
      clearError,
    }),
    [
      clients,
      createClient,
      createLead,
      deleteClient,
      deleteLead,
      error,
      fetchAll,
      leads,
      loading,
      updateClient,
      updateLead,
      clearError,
    ],
  );

  return (
    <CRMDataContext.Provider value={value}>
      {children}
    </CRMDataContext.Provider>
  );
}

export function useCRMData() {
  const context = useContext(CRMDataContext);
  if (!context) {
    throw new Error("useCRMData must be used within a CRMDataProvider");
  }
  return context;
}

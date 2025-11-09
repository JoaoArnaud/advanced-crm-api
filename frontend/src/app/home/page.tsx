"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  IconButton,
  Paper,
  Snackbar,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { Plus, Edit3, Trash2 } from "lucide-react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { useProtectedRoute } from "@/hooks/useProtectedRoute";
import { useCRMData } from "@/contexts/CRMDataContext";
import { Lead, Client, LeadPayload, ClientPayload } from "@/types/api";
import { LeadDialog } from "@/components/LeadDialog";
import { ClientDialog } from "@/components/ClientDialog";
import { ConfirmDialog } from "@/components/ConfirmDialog";

type DeleteTarget =
  | { type: "lead"; record: Lead }
  | { type: "client"; record: Client }
  | null;

export default function HomePage() {
  useProtectedRoute();

  const {
    leads,
    clients,
    loading,
    error,
    clearError,
    createLead,
    updateLead,
    deleteLead,
    createClient,
    updateClient,
    deleteClient,
  } = useCRMData();

  const [leadDialog, setLeadDialog] = useState<{
    open: boolean;
    record: Lead | null;
  }>({ open: false, record: null });
  const [clientDialog, setClientDialog] = useState<{
    open: boolean;
    record: Client | null;
  }>({ open: false, record: null });
  const [deleteTarget, setDeleteTarget] = useState<DeleteTarget>(null);
  const [submitting, setSubmitting] = useState(false);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error";
  }>({ open: false, message: "", severity: "success" });

  useEffect(() => {
    if (error) {
      setSnackbar({ open: true, message: error, severity: "error" });
      clearError();
    }
  }, [clearError, error]);

  const sortedLeads = useMemo(
    () =>
      [...leads].sort((a, b) => {
        return (b.createdAt ? Date.parse(b.createdAt) : 0) - (a.createdAt ? Date.parse(a.createdAt) : 0);
      }),
    [leads],
  );

  const sortedClients = useMemo(
    () =>
      [...clients].sort((a, b) => {
        return (b.createdAt ? Date.parse(b.createdAt) : 0) - (a.createdAt ? Date.parse(a.createdAt) : 0);
      }),
    [clients],
  );

  const formatDate = (value?: string) => {
    if (!value) return "-";
    return new Date(value).toLocaleString("pt-BR");
  };

  const handleLeadSubmit = async (payload: LeadPayload) => {
    try {
      setSubmitting(true);
      const result = leadDialog.record
        ? await updateLead(leadDialog.record.id, payload)
        : await createLead(payload);
      if (!result) {
        setSnackbar({
          open: true,
          message: "Não foi possível salvar o lead.",
          severity: "error",
        });
        return;
      }
      setSnackbar({
        open: true,
        message: leadDialog.record ? "Lead atualizado com sucesso!" : "Lead criado com sucesso!",
        severity: "success",
      });
      setLeadDialog({ open: false, record: null });
    } catch (err) {
      console.error(err);
      setSnackbar({
        open: true,
        message: "Erro ao salvar lead. Tente novamente.",
        severity: "error",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleClientSubmit = async (payload: ClientPayload) => {
    try {
      setSubmitting(true);
      const result = clientDialog.record
        ? await updateClient(clientDialog.record.id, payload)
        : await createClient(payload);
      if (!result) {
        setSnackbar({
          open: true,
          message: "Não foi possível salvar o cliente.",
          severity: "error",
        });
        return;
      }
      setSnackbar({
        open: true,
        message: clientDialog.record ? "Cliente atualizado com sucesso!" : "Cliente criado com sucesso!",
        severity: "success",
      });
      setClientDialog({ open: false, record: null });
    } catch (err) {
      console.error(err);
      setSnackbar({
        open: true,
        message: "Erro ao salvar cliente. Tente novamente.",
        severity: "error",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      setSubmitting(true);
      if (deleteTarget.type === "lead") {
        await deleteLead(deleteTarget.record.id);
        setSnackbar({ open: true, message: "Lead removido.", severity: "success" });
      } else {
        await deleteClient(deleteTarget.record.id);
        setSnackbar({ open: true, message: "Cliente removido.", severity: "success" });
      }
      setDeleteTarget(null);
    } catch (err) {
      console.error(err);
      setSnackbar({
        open: true,
        message: "Não foi possível completar a exclusão.",
        severity: "error",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const renderSkeleton = (
    <Stack justifyContent="center" alignItems="center" sx={{ py: 5 }}>
      <CircularProgress />
      <Typography sx={{ mt: 2 }} color="text.secondary">
        Carregando dados...
      </Typography>
    </Stack>
  );

  const renderEmptyState = (message: string) => (
    <Box sx={{ py: 3 }}>
      <Typography color="text.secondary">{message}</Typography>
    </Box>
  );

  return (
    <DashboardLayout>
      <Stack spacing={4}>
        <Paper sx={{ p: 3 }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={2}>
            <Box>
              <Typography variant="h5" fontWeight={600}>
                Leads
              </Typography>
              <Typography color="text.secondary">
                Consulte e mantenha o funil comercial da sua empresa.
              </Typography>
            </Box>
            <Button
              variant="contained"
              startIcon={<Plus size={18} />}
              onClick={() => setLeadDialog({ open: true, record: null })}
            >
              Novo Lead
            </Button>
          </Stack>
          {loading && leads.length === 0 ? (
            renderSkeleton
          ) : (
            <TableContainer sx={{ mt: 3 }}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>ID</TableCell>
                    <TableCell>Nome</TableCell>
                    <TableCell>E-mail</TableCell>
                    <TableCell>Telefone</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>CNPJ</TableCell>
                    <TableCell>CPF</TableCell>
                    <TableCell>Criado em</TableCell>
                    <TableCell align="right">Ações</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {sortedLeads.map((lead) => (
                    <TableRow key={lead.id} hover>
                      <TableCell>{lead.id}</TableCell>
                      <TableCell>{lead.name}</TableCell>
                      <TableCell>{lead.email ?? "-"}</TableCell>
                      <TableCell>{lead.phone ?? "-"}</TableCell>
                      <TableCell>
                        <Chip
                          label={lead.status}
                          color={
                            lead.status === "HOT"
                              ? "error"
                              : lead.status === "WARM"
                              ? "warning"
                              : "default"
                          }
                          size="small"
                        />
                      </TableCell>
                      <TableCell>{lead.cnpj ?? "-"}</TableCell>
                      <TableCell>{lead.cpf ?? "-"}</TableCell>
                      <TableCell>{formatDate(lead.createdAt)}</TableCell>
                      <TableCell align="right">
                        <IconButton
                          size="small"
                          onClick={() => setLeadDialog({ open: true, record: lead })}
                        >
                          <Edit3 size={16} />
                        </IconButton>
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => setDeleteTarget({ type: "lead", record: lead })}
                        >
                          <Trash2 size={16} />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              {sortedLeads.length === 0 && !loading && renderEmptyState("Nenhum lead encontrado para esta empresa.")}
            </TableContainer>
          )}
        </Paper>

        <Paper sx={{ p: 3 }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={2}>
            <Box>
              <Typography variant="h5" fontWeight={600}>
                Clientes
              </Typography>
              <Typography color="text.secondary">
                Acompanhe os clientes ativos e vincule a origem do lead.
              </Typography>
            </Box>
            <Button
              variant="contained"
              startIcon={<Plus size={18} />}
              onClick={() => setClientDialog({ open: true, record: null })}
            >
              Novo Cliente
            </Button>
          </Stack>
          {loading && clients.length === 0 ? (
            renderSkeleton
          ) : (
            <TableContainer sx={{ mt: 3 }}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>ID</TableCell>
                    <TableCell>Nome</TableCell>
                    <TableCell>E-mail</TableCell>
                    <TableCell>Telefone</TableCell>
                    <TableCell>CNPJ</TableCell>
                    <TableCell>Lead Origin</TableCell>
                    <TableCell align="right">Ações</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {sortedClients.map((client) => (
                    <TableRow key={client.id} hover>
                      <TableCell>{client.id}</TableCell>
                      <TableCell>{client.name}</TableCell>
                      <TableCell>{client.email ?? "-"}</TableCell>
                      <TableCell>{client.phone ?? "-"}</TableCell>
                      <TableCell>{client.cnpj ?? "-"}</TableCell>
                      <TableCell>
                        {client.leadOrigin ? (
                          <Stack direction="row" spacing={1} alignItems="center">
                            <Typography variant="body2">{client.leadOrigin.name}</Typography>
                            {client.leadOrigin.status && (
                              <Chip label={client.leadOrigin.status} size="small" variant="outlined" />
                            )}
                          </Stack>
                        ) : (
                          "-"
                        )}
                      </TableCell>
                      <TableCell align="right">
                        <IconButton
                          size="small"
                          onClick={() => setClientDialog({ open: true, record: client })}
                        >
                          <Edit3 size={16} />
                        </IconButton>
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => setDeleteTarget({ type: "client", record: client })}
                        >
                          <Trash2 size={16} />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              {sortedClients.length === 0 && !loading && renderEmptyState("Nenhum cliente cadastrado ainda.")}
            </TableContainer>
          )}
        </Paper>
      </Stack>

      <LeadDialog
        open={leadDialog.open}
        title={leadDialog.record ? "Editar Lead" : "Novo Lead"}
        initialData={leadDialog.record ?? undefined}
        submitting={submitting}
        onClose={() => setLeadDialog({ open: false, record: null })}
        onSubmit={handleLeadSubmit}
      />

      <ClientDialog
        open={clientDialog.open}
        title={clientDialog.record ? "Editar Cliente" : "Novo Cliente"}
        initialData={clientDialog.record ?? undefined}
        leads={leads}
        submitting={submitting}
        onClose={() => setClientDialog({ open: false, record: null })}
        onSubmit={handleClientSubmit}
      />

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        confirming={submitting}
        title="Confirmar exclusão"
        description={
          deleteTarget?.type === "lead"
            ? `Deseja remover o lead "${deleteTarget.record.name}"?`
            : `Deseja remover o cliente "${deleteTarget?.record.name}"?`
        }
      />

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
          severity={snackbar.severity}
          variant="filled"
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </DashboardLayout>
  );
}

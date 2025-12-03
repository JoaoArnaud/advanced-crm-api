"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Avatar,
  Box,
  Button,
  Chip,
  CircularProgress,
  IconButton,
  LinearProgress,
  Paper,
  Skeleton,
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
import {
  BarChart3,
  Edit3,
  Plus,
  Trash2,
  TrendingUp,
  UserCheck,
  UserPlus,
  Users,
} from "lucide-react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { useProtectedRoute } from "@/hooks/useProtectedRoute";
import { useCRMData } from "@/contexts/CRMDataContext";
import { Lead, Client, LeadPayload, ClientPayload } from "@/types/api";
import { LeadDialog } from "@/components/LeadDialog";
import { ClientDialog } from "@/components/ClientDialog";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { LeadStatusDonutChart } from "@/components/LeadStatusDonutChart";
import { LeadClientMonthlyChart } from "@/components/LeadClientMonthlyChart";
import { MetricCard, SectionCard } from "@/components/dashboard/Cards";

type DeleteTarget =
  | { type: "lead"; record: Lead }
  | { type: "client"; record: Client }
  | null;

function formatDate(value?: string) {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return date.toLocaleString("pt-BR");
}

const rtf = new Intl.RelativeTimeFormat("pt-BR", { numeric: "auto" });

function formatRelativeTime(value?: string) {
  if (!value) return "Data indisponível";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Data indisponível";
  const diff = Date.now() - date.getTime();
  const minutes = Math.round(diff / 60000);
  if (Math.abs(minutes) < 60) {
    return rtf.format(-minutes, "minute");
  }
  const hours = Math.round(minutes / 60);
  if (Math.abs(hours) < 24) {
    return rtf.format(-hours, "hour");
  }
  const days = Math.round(hours / 24);
  return rtf.format(-days, "day");
}

function percentageChange(current: number, previous: number) {
  if (previous === 0) {
    return current > 0 ? "+100% vs período anterior" : "Sem variação recente";
  }
  const diff = ((current - previous) / previous) * 100;
  const sign = diff >= 0 ? "+" : "";
  return `${sign}${diff.toFixed(1)}% vs período anterior`;
}

function TableSkeleton({ columns }: { columns: number }) {
  return (
    <TableBody>
      {Array.from({ length: 4 }).map((_, rowIndex) => (
        <TableRow key={rowIndex}>
          {Array.from({ length: columns }).map((__, colIndex) => (
            <TableCell key={colIndex}>
              <Skeleton width={colIndex === columns - 1 ? 120 : "80%"} />
            </TableCell>
          ))}
        </TableRow>
      ))}
    </TableBody>
  );
}

function getInitials(name: string) {
  const parts = name.trim().split(" ").filter(Boolean);
  if (parts.length === 0) return "CL";
  const [first, second] = parts;
  return `${first[0] ?? ""}${second?.[0] ?? ""}`.toUpperCase();
}

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
    convertLeadToClient,
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
  const [convertingLeadId, setConvertingLeadId] = useState<string | null>(null);
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

  const sortedLeads = useMemo(() => {
    return [...leads].sort((a, b) => {
      return (b.createdAt ? Date.parse(b.createdAt) : 0) - (a.createdAt ? Date.parse(a.createdAt) : 0);
    });
  }, [leads]);

  const sortedClients = useMemo(() => {
    return [...clients].sort((a, b) => {
      return (b.createdAt ? Date.parse(b.createdAt) : 0) - (a.createdAt ? Date.parse(a.createdAt) : 0);
    });
  }, [clients]);

  const range30d = Date.now() - 30 * 24 * 60 * 60 * 1000;
  const previousRangeStart = range30d - 30 * 24 * 60 * 60 * 1000;

  const leadsLast30 = useMemo(
    () =>
      leads.filter((lead) => {
        const created = lead.createdAt ? Date.parse(lead.createdAt) : 0;
        return created >= range30d;
      }),
    [leads, range30d],
  );

  const leadsPrev30 = useMemo(
    () =>
      leads.filter((lead) => {
        const created = lead.createdAt ? Date.parse(lead.createdAt) : 0;
        return created >= previousRangeStart && created < range30d;
      }),
    [leads, previousRangeStart, range30d],
  );

  const clientsLast30 = useMemo(
    () =>
      clients.filter((client) => {
        const created = client.createdAt ? Date.parse(client.createdAt) : 0;
        return created >= range30d;
      }),
    [clients, range30d],
  );

  const clientsPrev30 = useMemo(
    () =>
      clients.filter((client) => {
        const created = client.createdAt ? Date.parse(client.createdAt) : 0;
        return created >= previousRangeStart && created < range30d;
      }),
    [clients, previousRangeStart, range30d],
  );

  const conversionCount = useMemo(
    () => clients.filter((client) => Boolean(client.leadOriginId)).length,
    [clients],
  );

  const conversionRate = useMemo(() => {
    if (leads.length === 0) return 0;
    const rate = (conversionCount / leads.length) * 100;
    return Math.min(100, Math.round(rate * 10) / 10);
  }, [conversionCount, leads.length]);

  const pipeline = useMemo(() => {
    const counts = { HOT: 0, WARM: 0, COLD: 0 };
    leads.forEach((lead) => {
      if (lead.status === "HOT" || lead.status === "WARM" || lead.status === "COLD") {
        counts[lead.status] += 1;
      }
    });
    const total = Math.max(1, leads.length);
    return [
      { key: "HOT" as const, label: "Quentes", count: counts.HOT, color: "error" as const, value: (counts.HOT / total) * 100 },
      { key: "WARM" as const, label: "Em contato", count: counts.WARM, color: "warning" as const, value: (counts.WARM / total) * 100 },
      { key: "COLD" as const, label: "Frias", count: counts.COLD, color: "info" as const, value: (counts.COLD / total) * 100 },
    ];
  }, [leads]);

  const activities = useMemo(() => {
    const combined: Array<{
      id: string;
      name: string;
      action: string;
      createdAt?: string;
      type: "lead" | "client";
    }> = [
      ...leads.map((lead) => ({
        id: `lead-${lead.id}`,
        name: lead.name,
        action: `Lead ${lead.status.toLowerCase()} criado`,
        createdAt: lead.createdAt,
        type: "lead" as const,
      })),
      ...clients.map((client) => ({
        id: `client-${client.id}`,
        name: client.name,
        action: client.leadOrigin ? "Cliente vindo de lead" : "Cliente criado",
        createdAt: client.createdAt,
        type: "client" as const,
      })),
    ];
    return combined
      .sort((a, b) => (b.createdAt ? Date.parse(b.createdAt) : 0) - (a.createdAt ? Date.parse(a.createdAt) : 0))
      .slice(0, 6);
  }, [clients, leads]);

  const topClients = useMemo(
    () =>
      [...clients]
        .sort((a, b) => (b.createdAt ? Date.parse(b.createdAt) : 0) - (a.createdAt ? Date.parse(a.createdAt) : 0))
        .slice(0, 5),
    [clients],
  );

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

  const handleConvertLead = async (lead: Lead) => {
    try {
      setConvertingLeadId(lead.id);
      const result = await convertLeadToClient(lead);
      if (!result) {
        setSnackbar({
          open: true,
          message: "Não foi possível converter o lead.",
          severity: "error",
        });
        return;
      }
      setSnackbar({
        open: true,
        message: "Lead convertido em cliente com sucesso!",
        severity: "success",
      });
    } catch (err) {
      console.error(err);
      setSnackbar({
        open: true,
        message: "Erro ao converter lead. Tente novamente.",
        severity: "error",
      });
    } finally {
      setConvertingLeadId(null);
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

  return (
    <DashboardLayout>
      <Stack spacing={3}>
        <Stack
          direction={{ xs: "column", md: "row" }}
          justifyContent="space-between"
          spacing={2}
          alignItems={{ xs: "flex-start", md: "center" }}
        >
          <Box>
            <Typography variant="h4" fontWeight={800}>
              Dashboard
            </Typography>
            <Typography color="text.secondary">
              Visão geral em tempo real do seu pipeline multi-tenant.
            </Typography>
          </Box>
          <Stack direction="row" spacing={1} flexWrap="wrap">
            <Button
              variant="outlined"
              startIcon={<Plus size={16} />}
              onClick={() => setLeadDialog({ open: true, record: null })}
            >
              Novo Lead
            </Button>
            <Button
              variant="contained"
              startIcon={<Plus size={16} />}
              onClick={() => setClientDialog({ open: true, record: null })}
            >
              Novo Cliente
            </Button>
          </Stack>
        </Stack>

        <Stack direction={{ xs: "column", md: "row" }} spacing={2} flexWrap="wrap">
          <Box sx={{ flex: 1, minWidth: 240 }}>
            <MetricCard
              title="Total de Clientes"
              value={clients.length.toLocaleString("pt-BR")}
              helper={`${clientsLast30.length} novos nos últimos 30 dias`}
              icon={Users}
              loading={loading}
            />
          </Box>
          <Box sx={{ flex: 1, minWidth: 240 }}>
            <MetricCard
              title="Leads Ativos"
              value={leads.length.toLocaleString("pt-BR")}
              helper={percentageChange(leadsLast30.length, leadsPrev30.length)}
              icon={UserPlus}
              loading={loading}
            />
          </Box>
          <Box sx={{ flex: 1, minWidth: 240 }}>
            <MetricCard
              title="Conversões"
              value={`${conversionRate.toFixed(1)}%`}
              helper={`${conversionCount} clientes vieram de leads`}
              icon={TrendingUp}
              loading={loading}
            />
          </Box>
          <Box sx={{ flex: 1, minWidth: 240 }}>
            <MetricCard
              title="Novos Clientes (30d)"
              value={clientsLast30.length.toLocaleString("pt-BR")}
              helper={percentageChange(clientsLast30.length, clientsPrev30.length)}
              icon={BarChart3}
              loading={loading}
            />
          </Box>
        </Stack>

        <Stack spacing={2} id="relatorios">
          <Stack direction={{ xs: "column", lg: "row" }} spacing={2}>
            <Box sx={{ flex: 1 }}>
              <LeadClientMonthlyChart leads={leads} clients={clients} loading={loading} />
            </Box>
            <Box sx={{ flex: { lg: "0 0 380px", xs: 1 } }}>
              <Stack spacing={2}>
                <SectionCard
                  title="Pipeline de Leads"
                  subtitle={`${leads.length} leads ativos no funil`}
                >
                  <Stack spacing={2}>
                    {loading
                      ? Array.from({ length: 3 }).map((_, index) => (
                          <Skeleton key={index} variant="rounded" height={32} />
                        ))
                      : pipeline.map((stage) => (
                          <Stack key={stage.key} spacing={0.5}>
                            <Stack direction="row" justifyContent="space-between" alignItems="center">
                              <Typography variant="body2" fontWeight={700}>
                                {stage.label}
                              </Typography>
                              <Chip
                                label={`${stage.count} leads`}
                                size="small"
                                color={stage.color}
                                variant="outlined"
                              />
                            </Stack>
                            <LinearProgress
                              variant="determinate"
                              value={stage.value}
                              color={stage.color}
                              sx={{ height: 8, borderRadius: 8 }}
                            />
                          </Stack>
                        ))}
                  </Stack>
                </SectionCard>
                <LeadStatusDonutChart leads={leads} loading={loading} />
              </Stack>
            </Box>
          </Stack>
        </Stack>

        <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
          <Box sx={{ flex: 1 }}>
            <SectionCard
              title="Atividades recentes"
              subtitle="Últimas ações de leads e clientes"
            >
              <Stack spacing={2} sx={{ mt: 1 }}>
                {loading
                  ? Array.from({ length: 4 }).map((_, index) => (
                      <Skeleton key={index} variant="rounded" height={56} />
                    ))
                  : activities.map((activity) => (
                      <Stack
                        key={activity.id}
                        direction="row"
                        spacing={2}
                        alignItems="center"
                        sx={{ p: 1, borderRadius: 2, bgcolor: "action.hover" }}
                      >
                        <Avatar
                          sx={{
                            width: 40,
                            height: 40,
                            bgcolor: activity.type === "client" ? "primary.main" : "secondary.main",
                            color: activity.type === "client" ? "primary.contrastText" : "text.primary",
                            fontWeight: 700,
                          }}
                        >
                          {activity.name.slice(0, 2).toUpperCase()}
                        </Avatar>
                        <Box sx={{ flex: 1, minWidth: 0 }}>
                          <Typography fontWeight={700} noWrap>
                            {activity.name}
                          </Typography>
                          <Typography variant="body2" color="text.secondary" noWrap>
                            {activity.action}
                          </Typography>
                        </Box>
                        <Chip
                          label={formatRelativeTime(activity.createdAt)}
                          size="small"
                          variant="outlined"
                        />
                      </Stack>
                    ))}
                {!loading && activities.length === 0 ? (
                  <Typography color="text.secondary">Nenhuma atividade registrada ainda.</Typography>
                ) : null}
              </Stack>
            </SectionCard>
          </Box>
          <Box sx={{ flex: 1 }}>
            <SectionCard
              title="Principais clientes"
              subtitle="Últimos clientes convertidos ou criados"
            >
              <Stack spacing={2} sx={{ mt: 1 }}>
                {loading
                  ? Array.from({ length: 4 }).map((_, index) => (
                      <Skeleton key={index} variant="rounded" height={60} />
                    ))
                  : topClients.map((client, index) => (
                      <Stack
                        key={client.id}
                        direction="row"
                        spacing={2}
                        alignItems="center"
                        sx={{ p: 1, borderRadius: 2, border: "1px solid", borderColor: "divider" }}
                      >
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          width={20}
                          sx={{ fontWeight: 700 }}
                        >
                          #{index + 1}
                        </Typography>
                        <Avatar
                          sx={{
                            bgcolor: "primary.main",
                            color: "primary.contrastText",
                            fontWeight: 700,
                          }}
                        >
                          {getInitials(client.name)}
                        </Avatar>
                        <Box sx={{ flex: 1, minWidth: 0 }}>
                          <Typography fontWeight={700} noWrap>
                            {client.name}
                          </Typography>
                          <Typography variant="body2" color="text.secondary" noWrap>
                            {client.leadOrigin
                              ? `Originado do lead ${client.leadOrigin.name}`
                              : "Cliente direto"}
                          </Typography>
                        </Box>
                        <Chip
                          label={formatRelativeTime(client.createdAt)}
                          size="small"
                          variant="outlined"
                        />
                      </Stack>
                    ))}
                {!loading && topClients.length === 0 ? (
                  <Typography color="text.secondary">Nenhum cliente cadastrado ainda.</Typography>
                ) : null}
              </Stack>
            </SectionCard>
          </Box>
        </Stack>

        <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
          <Box sx={{ flex: 1 }} id="leads">
            <SectionCard
              title="Leads"
              subtitle="Consulte e mantenha o funil comercial da empresa."
              action={
                <Button
                  variant="contained"
                  startIcon={<Plus size={16} />}
                  onClick={() => setLeadDialog({ open: true, record: null })}
                >
                  Novo Lead
                </Button>
              }
            >
              <TableContainer component={Paper} variant="outlined">
                <Table size="small">
                  <TableHead>
                    <TableRow>
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
                  {loading && sortedLeads.length === 0 ? (
                    <TableSkeleton columns={8} />
                  ) : (
                    <TableBody>
                      {sortedLeads.map((lead) => {
                        const isConverting = convertingLeadId === lead.id;
                        const anotherConversionInProgress =
                          Boolean(convertingLeadId) && convertingLeadId !== lead.id;
                        return (
                          <TableRow key={lead.id} hover>
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
                                    : "info"
                                }
                                size="small"
                              />
                            </TableCell>
                            <TableCell>{lead.cnpj ?? "-"}</TableCell>
                            <TableCell>{lead.cpf ?? "-"}</TableCell>
                            <TableCell>{formatDate(lead.createdAt)}</TableCell>
                            <TableCell align="right">
                              <Button
                                size="small"
                                variant="outlined"
                                startIcon={
                                  isConverting ? (
                                    <CircularProgress size={16} color="inherit" />
                                  ) : (
                                    <UserCheck size={16} />
                                  )
                                }
                                sx={{ mr: 1 }}
                                disabled={isConverting || anotherConversionInProgress}
                                onClick={() => handleConvertLead(lead)}
                              >
                                Converter
                              </Button>
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
                        );
                      })}
                    </TableBody>
                  )}
                </Table>
                {sortedLeads.length === 0 && !loading ? (
                  <Box sx={{ p: 2 }}>
                    <Typography color="text.secondary">
                      Nenhum lead encontrado para esta empresa.
                    </Typography>
                  </Box>
                ) : null}
              </TableContainer>
            </SectionCard>
          </Box>

          <Box sx={{ flex: 1 }} id="clientes">
            <SectionCard
              title="Clientes"
              subtitle="Acompanhe clientes ativos e origens de leads."
              action={
                <Button
                  variant="contained"
                  startIcon={<Plus size={16} />}
                  onClick={() => setClientDialog({ open: true, record: null })}
                >
                  Novo Cliente
                </Button>
              }
            >
              <TableContainer component={Paper} variant="outlined">
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Nome</TableCell>
                      <TableCell>E-mail</TableCell>
                      <TableCell>Telefone</TableCell>
                      <TableCell>CNPJ</TableCell>
                      <TableCell>Lead Origin</TableCell>
                      <TableCell>Criado em</TableCell>
                      <TableCell align="right">Ações</TableCell>
                    </TableRow>
                  </TableHead>
                  {loading && sortedClients.length === 0 ? (
                    <TableSkeleton columns={7} />
                  ) : (
                    <TableBody>
                      {sortedClients.map((client) => (
                        <TableRow key={client.id} hover>
                          <TableCell>{client.name}</TableCell>
                          <TableCell>{client.email ?? "-"}</TableCell>
                          <TableCell>{client.phone ?? "-"}</TableCell>
                          <TableCell>{client.cnpj ?? "-"}</TableCell>
                          <TableCell>
                            {client.leadOrigin ? (
                              <Stack direction="row" spacing={1} alignItems="center">
                                <Typography variant="body2">
                                  {client.leadOrigin.name}
                                </Typography>
                                {client.leadOrigin.status ? (
                                  <Chip
                                    label={client.leadOrigin.status}
                                    size="small"
                                    variant="outlined"
                                  />
                                ) : null}
                              </Stack>
                            ) : (
                              "-"
                            )}
                          </TableCell>
                          <TableCell>{formatDate(client.createdAt)}</TableCell>
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
                  )}
                </Table>
                {sortedClients.length === 0 && !loading ? (
                  <Box sx={{ p: 2 }}>
                    <Typography color="text.secondary">
                      Nenhum cliente cadastrado ainda.
                    </Typography>
                  </Box>
                ) : null}
              </TableContainer>
            </SectionCard>
          </Box>
        </Stack>
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

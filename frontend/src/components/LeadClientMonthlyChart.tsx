"use client";

import { useMemo } from "react";
import dynamic from "next/dynamic";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Paper, Stack, Typography, Box, useTheme } from "@mui/material";
import { Lead, Client } from "@/types/api";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const BarChart = dynamic(
  () => import("react-chartjs-2").then((mod) => mod.Bar),
  { ssr: false },
);

interface LeadClientMonthlyChartProps {
  leads: Lead[];
  clients: Client[];
  title?: string;
}

type MonthlyBucket = {
  label: string;
  timestamp: number;
  leads: number;
  clients: number;
};

export function LeadClientMonthlyChart({
  leads,
  clients,
  title = "Leads x Clientes por mês",
}: LeadClientMonthlyChartProps) {
  const theme = useTheme();

  const monthlyData = useMemo(() => {
    const buckets = new Map<string, MonthlyBucket>();

    const registerEntry = (dateValue: string | undefined, type: "leads" | "clients") => {
      if (!dateValue) return;
      const date = new Date(dateValue);
      if (Number.isNaN(date.getTime())) return;
      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
      const timestamp = Date.UTC(date.getFullYear(), date.getMonth(), 1);
      const label = date.toLocaleDateString("pt-BR", {
        month: "short",
        year: "numeric",
      });
      if (!buckets.has(key)) {
        buckets.set(key, {
          label,
          timestamp,
          leads: 0,
          clients: 0,
        });
      }
      const bucket = buckets.get(key)!;
      bucket[type] += 1;
    };

    leads.forEach((lead) => registerEntry(lead.createdAt, "leads"));
    clients.forEach((client) => registerEntry(client.createdAt, "clients"));

    const sortedBuckets = Array.from(buckets.values()).sort(
      (a, b) => a.timestamp - b.timestamp,
    );

    return {
      labels: sortedBuckets.map((bucket) => bucket.label),
      leadCounts: sortedBuckets.map((bucket) => bucket.leads),
      clientCounts: sortedBuckets.map((bucket) => bucket.clients),
    };
  }, [clients, leads]);

  const chartData = useMemo(
    () => ({
      labels: monthlyData.labels,
      datasets: [
        {
          label: "Leads",
          data: monthlyData.leadCounts,
          backgroundColor: theme.palette.primary.main,
          borderRadius: 6,
          barThickness: 24,
        },
        {
          label: "Clientes",
          data: monthlyData.clientCounts,
          backgroundColor: theme.palette.success.main,
          borderRadius: 6,
          barThickness: 24,
        },
      ],
    }),
    [monthlyData, theme.palette.primary.main, theme.palette.success.main],
  );

  const chartOptions = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      interaction: {
        mode: "index" as const,
        intersect: false,
      },
      plugins: {
        legend: {
          position: "bottom" as const,
        },
        tooltip: {
          callbacks: {
            label: (context: { dataset: { label?: string }; formattedValue: string }) => {
              const label = context.dataset.label ?? "";
              return `${label}: ${context.formattedValue}`;
            },
          },
        },
      },
      scales: {
        x: {
          stacked: false,
          grid: {
            display: false,
          },
        },
        y: {
          beginAtZero: true,
          ticks: {
            precision: 0,
          },
        },
      },
    }),
    [],
  );

  return (
    <Paper sx={{ p: 3 }}>
      <Stack spacing={3}>
        <Typography variant="h6" fontWeight={600}>
          {title}
        </Typography>
        <Box sx={{ height: 320 }}>
          {monthlyData.labels.length > 0 ? (
            <BarChart data={chartData} options={chartOptions} />
          ) : (
            <Stack
              alignItems="center"
              justifyContent="center"
              sx={{ height: 1, color: "text.secondary" }}
            >
              <Typography variant="body2">
                Não há dados suficientes para exibir o gráfico.
              </Typography>
            </Stack>
          )}
        </Box>
      </Stack>
    </Paper>
  );
}

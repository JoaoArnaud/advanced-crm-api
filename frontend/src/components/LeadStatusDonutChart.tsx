"use client";

import { useMemo } from "react";
import dynamic from "next/dynamic";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Box, Card, CardContent, Skeleton, Stack, Typography, useTheme } from "@mui/material";
import { Lead } from "@/types/api";

ChartJS.register(ArcElement, Tooltip, Legend);

const DoughnutChart = dynamic(
  () => import("react-chartjs-2").then((mod) => mod.Doughnut),
  { ssr: false },
);

interface LeadStatusDonutChartProps {
  leads: Lead[];
  title?: string;
  maxWidth?: number | string;
  loading?: boolean;
}

export function LeadStatusDonutChart({
  leads,
  title = "Distribuição de Leads por Status",
  maxWidth,
  loading,
}: LeadStatusDonutChartProps) {
  const theme = useTheme();

  const statusCounts = useMemo(() => {
    return leads.reduce(
      (acc, lead) => {
        if (lead.status === "HOT" || lead.status === "WARM" || lead.status === "COLD") {
          acc[lead.status] += 1;
          return acc;
        }
        acc.OTHER += 1;
        return acc;
      },
      { HOT: 0, WARM: 0, COLD: 0, OTHER: 0 },
    );
  }, [leads]);

  const statusConfig = useMemo(
    () => [
      { key: "HOT" as const, label: "HOT", color: theme.palette.error.main },
      { key: "WARM" as const, label: "WARM", color: theme.palette.warning.main },
      { key: "COLD" as const, label: "COLD", color: theme.palette.info.main },
    ],
    [theme.palette],
  );

  const chartData = useMemo(
    () => ({
      labels: statusConfig.map((status) => status.label),
      datasets: [
        {
          data: statusConfig.map((status) => statusCounts[status.key]),
          backgroundColor: statusConfig.map((status) => status.color),
          borderWidth: 2,
          borderColor: theme.palette.background.paper,
        },
      ],
    }),
    [statusConfig, statusCounts, theme.palette.background.paper],
  );

  const chartOptions = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      cutout: "60%",
      plugins: {
        legend: {
          display: false,
        },
        tooltip: {
          callbacks: {
            label: (context: { label?: string; formattedValue: string }) => {
              const label = context.label ?? "";
              return `${label}: ${context.formattedValue}`;
            },
          },
        },
      },
    }),
    [],
  );

  return (
    <Card
      sx={{
        height: "100%",
        width: "100%",
        maxWidth: maxWidth ?? "100%",
      }}
    >
      <CardContent>
        <Stack spacing={3}>
          <Typography variant="h6" fontWeight={700}>
            {title}
          </Typography>
          {loading ? (
            <Skeleton variant="rounded" height={220} />
          ) : (
            <Stack
              direction={{ xs: "column", md: "row" }}
              spacing={3}
              alignItems="center"
              justifyContent="space-between"
            >
              <Box sx={{ flex: 1, width: "100%", minWidth: 0 }}>
                <Box sx={{ height: 240 }}>
                  <DoughnutChart data={chartData} options={chartOptions} />
                </Box>
              </Box>
              <Box sx={{ flex: 1 }}>
                <Stack spacing={1.5}>
                  {statusConfig.map((status) => (
                    <Stack
                      key={status.key}
                      direction="row"
                      alignItems="center"
                      justifyContent="space-between"
                      spacing={1}
                    >
                      <Stack direction="row" spacing={1} alignItems="center">
                        <Box
                          sx={{
                            width: 12,
                            height: 12,
                            borderRadius: "50%",
                            bgcolor: status.color,
                          }}
                        />
                        <Typography variant="body2" fontWeight={600}>
                          {status.label}
                        </Typography>
                      </Stack>
                      <Typography variant="body2" color="text.secondary">
                        {statusCounts[status.key]} leads
                      </Typography>
                    </Stack>
                  ))}
                </Stack>
              </Box>
            </Stack>
          )}
        </Stack>
      </CardContent>
    </Card>
  );
}

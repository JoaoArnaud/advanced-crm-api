"use client";

import type { ReactNode } from "react";
import { Box, Card, CardContent, Chip, Skeleton, Stack, Typography } from "@mui/material";
import type { LucideIcon } from "lucide-react";

type MetricCardProps = {
  title: string;
  value: string;
  helper?: string;
  trendLabel?: string;
  icon?: LucideIcon;
  loading?: boolean;
};

export function MetricCard({
  title,
  value,
  helper,
  trendLabel,
  icon: Icon,
  loading,
}: MetricCardProps) {
  return (
    <Card sx={{ height: "100%" }}>
      <CardContent>
        <Stack direction="row" alignItems="flex-start" spacing={2}>
          {Icon ? (
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: 2,
                bgcolor: "primary.main",
                color: "primary.contrastText",
                display: "grid",
                placeItems: "center",
              }}
            >
              <Icon size={18} />
            </Box>
          ) : null}
          <Stack spacing={0.75} sx={{ flex: 1 }}>
            <Typography variant="body2" color="text.secondary" fontWeight={600}>
              {title}
            </Typography>
            {loading ? (
              <Skeleton width="60%" height={32} />
            ) : (
              <Typography variant="h5" fontWeight={800}>
                {value}
              </Typography>
            )}
            {helper ? (
              <Typography variant="body2" color="text.secondary">
                {helper}
              </Typography>
            ) : null}
            {trendLabel ? (
              <Chip
                label={trendLabel}
                size="small"
                color="success"
                variant="outlined"
                sx={{ alignSelf: "flex-start", fontWeight: 700, mt: 0.5 }}
              />
            ) : null}
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
}

type SectionCardProps = {
  title: string;
  subtitle?: string;
  action?: ReactNode;
  children: ReactNode;
};

export function SectionCard({ title, subtitle, action, children }: SectionCardProps) {
  return (
    <Card>
      <CardContent>
        <Stack
          direction="row"
          alignItems={{ xs: "flex-start", sm: "center" }}
          spacing={2}
          justifyContent="space-between"
          sx={{ pb: 1 }}
        >
          <Box>
            <Typography variant="h6" fontWeight={700}>
              {title}
            </Typography>
            {subtitle ? (
              <Typography variant="body2" color="text.secondary">
                {subtitle}
              </Typography>
            ) : null}
          </Box>
          {action}
        </Stack>
        {children}
      </CardContent>
    </Card>
  );
}

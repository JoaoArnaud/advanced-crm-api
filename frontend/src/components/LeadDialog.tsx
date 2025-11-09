"use client";

import { useEffect, useState, type ChangeEvent } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  Stack,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import type { SelectChangeEvent } from "@mui/material/Select";
import { z } from "zod";
import { Lead, LeadPayload, LeadStatus } from "@/types/api";

interface LeadDialogProps {
  open: boolean;
  title: string;
  initialData?: Lead;
  submitting?: boolean;
  onClose: () => void;
  onSubmit: (payload: LeadPayload) => Promise<void> | void;
}

const leadSchema = z.object({
  name: z.string().trim().min(2, "Informe o nome do lead."),
  email: z
    .string()
    .trim()
    .email("E-mail inválido.")
    .optional()
    .or(z.literal("")),
  phone: z.string().trim().optional().or(z.literal("")),
  status: z.enum(["HOT", "WARM", "COLD"]),
  cnpj: z.string().trim().optional().or(z.literal("")),
  cpf: z.string().trim().optional().or(z.literal("")),
});

type LeadFormValues = z.infer<typeof leadSchema>;

export function LeadDialog({
  open,
  title,
  initialData,
  submitting,
  onClose,
  onSubmit,
}: LeadDialogProps) {
  const [values, setValues] = useState<LeadFormValues>({
    name: "",
    email: "",
    phone: "",
    status: "HOT",
    cnpj: "",
    cpf: "",
  });
  const [errors, setErrors] = useState<Record<keyof LeadFormValues, string | null>>({
    name: null,
    email: null,
    phone: null,
    status: null,
    cnpj: null,
    cpf: null,
  });

  useEffect(() => {
    if (initialData) {
      setValues({
        name: initialData.name ?? "",
        email: initialData.email ?? "",
        phone: initialData.phone ?? "",
        status: initialData.status ?? "HOT",
        cnpj: initialData.cnpj ?? "",
        cpf: initialData.cpf ?? "",
      });
    } else {
      setValues({
        name: "",
        email: "",
        phone: "",
        status: "HOT",
        cnpj: "",
        cpf: "",
      });
    }
    setErrors({
      name: null,
      email: null,
      phone: null,
      status: null,
      cnpj: null,
      cpf: null,
    });
  }, [initialData, open]);

  const handleSubmit = async () => {
    const validation = leadSchema.safeParse(values);
    if (!validation.success) {
      const fieldErrors = validation.error.flatten().fieldErrors;
      setErrors((prev) => ({
        ...prev,
        name: fieldErrors.name?.[0] ?? null,
        email: fieldErrors.email?.[0] ?? null,
        phone: fieldErrors.phone?.[0] ?? null,
        status: fieldErrors.status?.[0] ?? null,
        cnpj: fieldErrors.cnpj?.[0] ?? null,
        cpf: fieldErrors.cpf?.[0] ?? null,
      }));
      return;
    }
    const payload: LeadPayload = {
      name: values.name.trim(),
      status: values.status as LeadStatus,
      email: values.email?.trim() || undefined,
      phone: values.phone?.trim() || undefined,
      cnpj: values.cnpj?.trim() || undefined,
      cpf: values.cpf?.trim() || undefined,
    };
    await onSubmit(payload);
  };

  const handleChange =
    (field: keyof LeadFormValues) =>
    (
      event:
        | ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
        | SelectChangeEvent<string>,
    ) => {
      const value = event.target.value;
      setValues((prev) => ({ ...prev, [field]: value }));
      setErrors((prev) => ({ ...prev, [field]: null }));
    };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{title}</DialogTitle>
      <DialogContent dividers>
        <Stack spacing={2} sx={{ mt: 1 }}>
          <TextField
            label="Nome"
            value={values.name}
            onChange={handleChange("name")}
            error={Boolean(errors.name)}
            helperText={errors.name}
            required
            fullWidth
          />
          <TextField
            label="E-mail"
            value={values.email}
            onChange={handleChange("email")}
            error={Boolean(errors.email)}
            helperText={errors.email}
            type="email"
          />
          <TextField
            label="Telefone"
            value={values.phone}
            onChange={handleChange("phone")}
            error={Boolean(errors.phone)}
            helperText={errors.phone}
          />
          <TextField
            select
            label="Status"
            value={values.status}
            onChange={handleChange("status")}
            error={Boolean(errors.status)}
            helperText={errors.status}
            required
          >
            <MenuItem value="HOT">HOT</MenuItem>
            <MenuItem value="WARM">WARM</MenuItem>
            <MenuItem value="COLD">COLD</MenuItem>
          </TextField>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <TextField
                label="CNPJ"
                value={values.cnpj}
                onChange={handleChange("cnpj")}
                error={Boolean(errors.cnpj)}
                helperText={errors.cnpj}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="CPF"
                value={values.cpf}
                onChange={handleChange("cpf")}
                error={Boolean(errors.cpf)}
                helperText={errors.cpf}
                fullWidth
              />
            </Grid>
          </Grid>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="inherit" disabled={submitting}>
          Cancelar
        </Button>
        <Button onClick={handleSubmit} variant="contained" disabled={submitting}>
          Salvar
        </Button>
      </DialogActions>
    </Dialog>
  );
}

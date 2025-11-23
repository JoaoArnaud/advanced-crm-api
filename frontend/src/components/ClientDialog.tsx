"use client";

import { useEffect, useState, type ChangeEvent } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Stack,
} from "@mui/material";
import { z } from "zod";
import { Client, ClientPayload } from "@/types/api";

interface ClientDialogProps {
  open: boolean;
  title: string;
  initialData?: Client;
  submitting?: boolean;
  onClose: () => void;
  onSubmit: (payload: ClientPayload) => Promise<void> | void;
}

const clientSchema = z.object({
  name: z.string().trim().min(2, "Informe o nome do cliente."),
  email: z
    .string()
    .trim()
    .email("E-mail inválido.")
    .optional()
    .or(z.literal("")),
  phone: z.string().trim().optional().or(z.literal("")),
  cnpj: z.string().trim().optional().or(z.literal("")),
});

type ClientFormValues = z.infer<typeof clientSchema>;

export function ClientDialog({
  open,
  title,
  initialData,
  submitting,
  onClose,
  onSubmit,
}: ClientDialogProps) {
  const [values, setValues] = useState<ClientFormValues>({
    name: "",
    email: "",
    phone: "",
    cnpj: "",
  });
  const [errors, setErrors] = useState<Record<keyof ClientFormValues, string | null>>({
    name: null,
    email: null,
    phone: null,
    cnpj: null,
  });

  useEffect(() => {
    if (initialData) {
      setValues({
        name: initialData.name ?? "",
        email: initialData.email ?? "",
        phone: initialData.phone ?? "",
        cnpj: initialData.cnpj ?? "",
      });
    } else {
      setValues({
        name: "",
        email: "",
        phone: "",
        cnpj: "",
      });
    }
    setErrors({
      name: null,
      email: null,
      phone: null,
      cnpj: null,
    });
  }, [initialData, open]);

  const handleSubmit = async () => {
    const validation = clientSchema.safeParse(values);
    if (!validation.success) {
      const fieldErrors = validation.error.flatten().fieldErrors;
      setErrors((prev) => ({
        ...prev,
        name: fieldErrors.name?.[0] ?? null,
        email: fieldErrors.email?.[0] ?? null,
        phone: fieldErrors.phone?.[0] ?? null,
        cnpj: fieldErrors.cnpj?.[0] ?? null,
      }));
      return;
    }

    const payload: ClientPayload = {
      name: values.name.trim(),
      email: values.email?.trim() || undefined,
      phone: values.phone?.trim() || undefined,
      cnpj: values.cnpj?.trim() || undefined,
    };

    await onSubmit(payload);
  };

  const handleChange =
    (field: keyof ClientFormValues) =>
    (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const value = event.target.value as string;
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
            label="CNPJ"
            value={values.cnpj}
            onChange={handleChange("cnpj")}
            error={Boolean(errors.cnpj)}
            helperText={errors.cnpj}
          />
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

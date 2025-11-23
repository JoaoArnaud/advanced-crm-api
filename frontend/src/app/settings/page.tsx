"use client";

import { useEffect, useState, type ChangeEvent } from "react";
import {
  Alert,
  Button,
  Paper,
  Snackbar,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { z } from "zod";
import { DashboardLayout } from "@/components/DashboardLayout";
import { useProtectedRoute } from "@/hooks/useProtectedRoute";
import { useAuth } from "@/contexts/AuthContext";
import { userService } from "@/services/userService";
import { UpdateUserPayload } from "@/types/api";

const profileSchema = z.object({
  name: z.string().trim().min(2, "Informe o nome."),
  companyId: z.string().trim().uuid("Informe um UUID válido."),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export default function SettingsPage() {
  const { user } = useProtectedRoute();
  const { updateUserContext } = useAuth();

  const [formValues, setFormValues] = useState<ProfileFormValues>({
    name: "",
    companyId: "",
  });
  const [errors, setErrors] = useState<
    Partial<Record<keyof ProfileFormValues, string>>
  >({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error";
  }>({ open: false, message: "", severity: "success" });

  useEffect(() => {
    const loadUser = async () => {
      if (!user?.id) {
        setLoading(false);
        return;
      }
      try {
        const { data } = await userService.getById(user.id);
        setFormValues({
          name: data.name,
          companyId: data.companyId,
        });
      } catch (err) {
        console.error(err);
        setSnackbar({
          open: true,
          message: "Não foi possível carregar os dados do usuário.",
          severity: "error",
        });
      } finally {
        setLoading(false);
      }
    };
    loadUser();
  }, [user?.id]);

  const handleSubmit = async () => {
    const validation = profileSchema.safeParse(formValues);
    if (!validation.success) {
      const fieldErrors = validation.error.flatten().fieldErrors;
      setErrors({
        name: fieldErrors.name?.[0],
        companyId: fieldErrors.companyId?.[0],
      });
      return;
    }

    if (!user?.id) {
      setSnackbar({
        open: true,
        message: "Usuário não encontrado.",
        severity: "error",
      });
      return;
    }

    const payload: UpdateUserPayload = {
      name: validation.data.name.trim(),
      companyId: validation.data.companyId.trim(),
    };

    try {
      setSaving(true);
      const { data } = await userService.update(user.id, payload);
      updateUserContext(data);
      setSnackbar({
        open: true,
        message: "Dados atualizados com sucesso!",
        severity: "success",
      });
    } catch (err) {
      console.error(err);
      setSnackbar({
        open: true,
        message: "Erro ao salvar alterações.",
        severity: "error",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleChange =
    (field: keyof ProfileFormValues) =>
    (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setFormValues((prev) => ({ ...prev, [field]: event.target.value }));
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    };

  return (
    <DashboardLayout>
      <Stack alignItems="center" sx={{ width: "100%", py: { xs: 2, md: 4 } }}>
        <Paper sx={{ width: "100%", maxWidth: 640, p: 4 }}>
          <Typography variant="h5" fontWeight={600}>
            Configurações
          </Typography>
          <Typography color="text.secondary" sx={{ mb: 3 }}>
            Atualize os dados atrelados à sua conta.
          </Typography>

          {loading ? (
            <Typography>Carregando informações...</Typography>
          ) : (
            <Stack spacing={2}>
              <TextField
                label="Nome"
                value={formValues.name}
                onChange={handleChange("name")}
                error={Boolean(errors.name)}
                helperText={errors.name}
                fullWidth
              />
              <TextField
                label="E-mail"
                value={user?.email ?? ""}
                InputProps={{ readOnly: true }}
                fullWidth
              />
              <TextField
                label="Company ID (UUID)"
                value={formValues.companyId}
                onChange={handleChange("companyId")}
                error={Boolean(errors.companyId)}
                helperText={errors.companyId}
                fullWidth
              />
              <Stack direction="row" justifyContent="flex-end">
                <Button variant="contained" onClick={handleSubmit} disabled={saving}>
                  Salvar alterações
                </Button>
              </Stack>
            </Stack>
          )}
        </Paper>
      </Stack>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
      >
        <Alert
          severity={snackbar.severity}
          onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
          variant="filled"
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </DashboardLayout>
  );
}

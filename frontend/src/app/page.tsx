"use client";

import { useState } from "react";
import {
  Box,
  Tabs,
  Tab,
  Paper,
  TextField,
  Button,
  Typography,
  Stack,
  Snackbar,
  Alert,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { useAuth } from "@/contexts/AuthContext";

const registerSchema = z.object({
  name: z.string().trim().min(2, "Informe o nome."),
  email: z.string().trim().email("E-mail inválido."),
  password: z.string().min(8, "A senha deve ter no mínimo 8 caracteres."),
  companyId: z.string().uuid("Informe um UUID válido."),
});

const loginSchema = z.object({
  email: z.string().trim().email("E-mail inválido."),
  password: z.string().min(1, "Informe a senha."),
});

type RegisterFormValues = z.infer<typeof registerSchema>;
type LoginFormValues = z.infer<typeof loginSchema>;

export default function AuthPage() {
  const [tab, setTab] = useState(0);
  const [registerValues, setRegisterValues] = useState<RegisterFormValues>({
    name: "",
    email: "",
    password: "",
    companyId: "",
  });
  const [loginValues, setLoginValues] = useState<LoginFormValues>({
    email: "",
    password: "",
  });
  const [registerErrors, setRegisterErrors] = useState<
    Partial<Record<keyof RegisterFormValues, string>>
  >({});
  const [loginErrors, setLoginErrors] = useState<
    Partial<Record<keyof LoginFormValues, string>>
  >({});
  const [submitting, setSubmitting] = useState(false);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: "success" | "error" }>({
    open: false,
    message: "",
    severity: "success",
  });

  const { registerUser, loginUser } = useAuth();
  const router = useRouter();

  const showMessage = (message: string, severity: "success" | "error" = "success") => {
    setSnackbar({ open: true, message, severity });
  };

  const handleRegister = async () => {
    const validation = registerSchema.safeParse(registerValues);
    if (!validation.success) {
      const fieldErrors = validation.error.flatten().fieldErrors;
      setRegisterErrors({
        name: fieldErrors.name?.[0],
        email: fieldErrors.email?.[0],
        password: fieldErrors.password?.[0],
        companyId: fieldErrors.companyId?.[0],
      });
      return;
    }
    try {
      setSubmitting(true);
      await registerUser(validation.data);
      showMessage("Cadastro realizado com sucesso!");
      router.push("/home");
    } catch (err: unknown) {
      console.error(err);
      showMessage("Erro ao cadastrar. Verifique os dados e tente novamente.", "error");
    } finally {
      setSubmitting(false);
    }
  };

  const handleLogin = async () => {
    const validation = loginSchema.safeParse(loginValues);
    if (!validation.success) {
      const fieldErrors = validation.error.flatten().fieldErrors;
      setLoginErrors({
        email: fieldErrors.email?.[0],
        password: fieldErrors.password?.[0],
      });
      return;
    }
    try {
      setSubmitting(true);
      await loginUser(validation.data);
      showMessage("Login realizado. Redirecionando...");
      router.push("/home");
    } catch (err) {
      console.error(err);
      showMessage("Credenciais inválidas.", "error");
    } finally {
      setSubmitting(false);
    }
  };

  const renderRegisterForm = () => (
    <Stack spacing={2} sx={{ mt: 2 }}>
      <TextField
        label="Nome"
        value={registerValues.name}
        onChange={(event) => {
          setRegisterValues((prev) => ({ ...prev, name: event.target.value }));
          setRegisterErrors((prev) => ({ ...prev, name: undefined }));
        }}
        error={Boolean(registerErrors.name)}
        helperText={registerErrors.name}
        fullWidth
      />
      <TextField
        label="E-mail"
        type="email"
        value={registerValues.email}
        onChange={(event) => {
          setRegisterValues((prev) => ({ ...prev, email: event.target.value }));
          setRegisterErrors((prev) => ({ ...prev, email: undefined }));
        }}
        error={Boolean(registerErrors.email)}
        helperText={registerErrors.email}
        fullWidth
      />
      <TextField
        label="Senha"
        type="password"
        value={registerValues.password}
        onChange={(event) => {
          setRegisterValues((prev) => ({
            ...prev,
            password: event.target.value,
          }));
          setRegisterErrors((prev) => ({ ...prev, password: undefined }));
        }}
        error={Boolean(registerErrors.password)}
        helperText={registerErrors.password}
        fullWidth
      />
      <TextField
        label="Company ID (UUID)"
        value={registerValues.companyId}
        onChange={(event) => {
          setRegisterValues((prev) => ({
            ...prev,
            companyId: event.target.value,
          }));
          setRegisterErrors((prev) => ({ ...prev, companyId: undefined }));
        }}
        error={Boolean(registerErrors.companyId)}
        helperText={registerErrors.companyId}
        fullWidth
      />
      <Button
        variant="contained"
        onClick={handleRegister}
        disabled={submitting}
        fullWidth
      >
        Cadastrar
      </Button>
    </Stack>
  );

  const renderLoginForm = () => (
    <Stack spacing={2} sx={{ mt: 2 }}>
      <TextField
        label="E-mail"
        type="email"
        value={loginValues.email}
        onChange={(event) => {
          setLoginValues((prev) => ({ ...prev, email: event.target.value }));
          setLoginErrors((prev) => ({ ...prev, email: undefined }));
        }}
        error={Boolean(loginErrors.email)}
        helperText={loginErrors.email}
        fullWidth
      />
      <TextField
        label="Senha"
        type="password"
        value={loginValues.password}
        onChange={(event) => {
          setLoginValues((prev) => ({
            ...prev,
            password: event.target.value,
          }));
          setLoginErrors((prev) => ({ ...prev, password: undefined }));
        }}
        error={Boolean(loginErrors.password)}
        helperText={loginErrors.password}
        fullWidth
      />
      <Button
        variant="contained"
        onClick={handleLogin}
        disabled={submitting}
        fullWidth
      >
        Entrar
      </Button>
    </Stack>
  );

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        p: 2,
      }}
    >
      <Paper sx={{ width: "100%", maxWidth: 520, p: 4 }}>
        <Typography variant="h4" textAlign="center" fontWeight={600}>
          Advanced CRM
        </Typography>
        <Typography variant="body1" textAlign="center" color="text.secondary" sx={{ mt: 1 }}>
          Acesse sua conta ou crie um novo acesso para começar.
        </Typography>

        <Tabs
          value={tab}
          onChange={(_, value) => setTab(value)}
          sx={{ mt: 3 }}
          variant="fullWidth"
        >
          <Tab label="Cadastro" />
          <Tab label="Login" />
        </Tabs>

        {tab === 0 ? renderRegisterForm() : renderLoginForm()}
      </Paper>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          severity={snackbar.severity}
          onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
          variant="filled"
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

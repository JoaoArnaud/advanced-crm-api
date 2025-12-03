"use client";

import { useState } from "react";
import {
  Box,
  Avatar,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Stack,
  Tooltip,
  Typography,
  useTheme,
} from "@mui/material";
import {
  BarChart3,
  LayoutDashboard,
  LogOut,
  Menu as MenuIcon,
  Moon,
  Settings,
  Sun,
  UserPlus,
  Users,
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useColorMode } from "@/components/LayoutProviders";
import { NotificationMenu } from "@/components/NotificationMenu";
import { SearchBar } from "@/components/SearchBar";

const drawerWidth = 260;

const navItems = [
  { label: "Dashboard", path: "/home", icon: LayoutDashboard },
  { label: "Clientes", path: "/home#clientes", icon: Users },
  { label: "Leads", path: "/home#leads", icon: UserPlus },
  { label: "Relatórios", path: "/home#relatorios", icon: BarChart3 },
  { label: "Configurações", path: "/settings", icon: Settings },
];

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
  const { mode, toggleMode } = useColorMode();
  const theme = useTheme();
  const router = useRouter();
  const pathname = usePathname();
  const { logout, user } = useAuth();

  const handleNavigate = (path: string) => {
    router.push(path);
    setOpen(false);
  };

  const drawerContent = (
    <Box
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        bgcolor: "var(--color-sidebar)",
        color: "var(--color-sidebar-foreground)",
      }}
    >
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{ px: 3, py: 2.5 }}
      >
        <Stack direction="row" spacing={1.5} alignItems="center">
          <Box
            sx={{
              width: 36,
              height: 36,
              borderRadius: 2,
              bgcolor: "var(--color-sidebar-primary)",
              color: "var(--color-sidebar-primary-foreground)",
              display: "grid",
              placeItems: "center",
              fontWeight: 800,
              fontSize: 18,
            }}
          >
            C
          </Box>
          <Box>
            <Typography fontWeight={700}>ClientDesk</Typography>
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ color: "var(--color-muted-foreground)" }}
            >
              CRM Inteligente
            </Typography>
          </Box>
        </Stack>
      </Stack>
      <Divider sx={{ borderColor: "var(--color-sidebar-border)" }} />
      <List sx={{ py: 1, flex: 1 }}>
        {navItems.map((item) => {
          const Icon = item.icon;
          const basePath = item.path.split("#")[0];
          const selected = pathname === basePath;
          return (
            <ListItemButton
              key={item.path}
              selected={selected}
              onClick={() => handleNavigate(item.path)}
              sx={{
                mx: 1.5,
                mb: 0.5,
                borderRadius: 2,
                "&.Mui-selected": {
                  bgcolor: "var(--color-sidebar-accent)",
                  color: "var(--color-sidebar-foreground)",
                  "&:hover": {
                    bgcolor: "var(--color-sidebar-accent)",
                  },
                },
              }}
            >
              <ListItemIcon sx={{ color: "inherit", minWidth: 36 }}>
                <Icon size={18} />
              </ListItemIcon>
              <ListItemText
                primary={item.label}
                primaryTypographyProps={{ fontWeight: 600 }}
              />
            </ListItemButton>
          );
        })}
      </List>
      <Divider sx={{ borderColor: "var(--color-sidebar-border)" }} />
      <Box sx={{ px: 2.5, py: 2 }}>
        <Stack
          direction="row"
          alignItems="center"
          spacing={1.5}
          sx={{
            p: 1,
            borderRadius: 2,
            bgcolor: "var(--color-sidebar-accent)",
          }}
        >
          <Avatar
            sx={{
              bgcolor: "var(--color-sidebar-primary)",
              color: "var(--color-sidebar-primary-foreground)",
              width: 40,
              height: 40,
              fontWeight: 700,
            }}
          >
            {user?.name?.slice(0, 1).toUpperCase() ?? "U"}
          </Avatar>
          <Box sx={{ minWidth: 0 }}>
            <Typography fontWeight={700} noWrap>
              {user?.name ?? "Usuário"}
            </Typography>
            <Typography
              variant="caption"
              color="text.secondary"
              noWrap
              sx={{ color: "var(--color-muted-foreground)" }}
            >
              {user?.email ?? ""}
            </Typography>
          </Box>
        </Stack>
      </Box>
    </Box>
  );

  return (
    <Box
      sx={{
        display: "flex",
        minHeight: "100vh",
        bgcolor: "background.default",
      }}
    >
      <Drawer
        open={open}
        onClose={() => setOpen(false)}
        variant="temporary"
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: "block", lg: "none" },
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
            borderRight: `1px solid var(--color-sidebar-border)`,
          },
        }}
      >
        {drawerContent}
      </Drawer>
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: "none", lg: "block" },
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
            borderRight: `1px solid var(--color-sidebar-border)`,
          },
        }}
        open
      >
        {drawerContent}
      </Drawer>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          minWidth: 0,
          ml: { lg: `${drawerWidth}px` },
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Box
          component="header"
          sx={{
            position: "sticky",
            top: 0,
            zIndex: theme.zIndex.appBar,
            backdropFilter: "blur(12px)",
            bgcolor: "background.default",
            borderBottom: `1px solid ${theme.palette.divider}`,
          }}
        >
          <Stack
            direction="row"
            alignItems="center"
            spacing={2}
            sx={{ px: 2.5, py: 1.5 }}
          >
            <IconButton
              onClick={() => setOpen(true)}
              sx={{ display: { lg: "none", xs: "inline-flex" } }}
            >
              <MenuIcon size={20} />
            </IconButton>
            <Box sx={{ flex: 1, maxWidth: 520 }}>
              <SearchBar />
            </Box>
            <Stack direction="row" spacing={1} alignItems="center">
              <Tooltip title={mode === "light" ? "Ativar modo escuro" : "Ativar modo claro"}>
                <IconButton onClick={toggleMode}>
                  {mode === "light" ? <Moon size={18} /> : <Sun size={18} />}
                </IconButton>
              </Tooltip>
              <NotificationMenu />
              <IconButton onClick={(event) => setMenuAnchor(event.currentTarget)}>
                <Avatar
                  sx={{
                    width: 36,
                    height: 36,
                    bgcolor: "primary.main",
                    color: "primary.contrastText",
                    fontWeight: 700,
                  }}
                >
                  {user?.name?.slice(0, 1).toUpperCase() ?? "U"}
                </Avatar>
              </IconButton>
              <Menu
                anchorEl={menuAnchor}
                open={Boolean(menuAnchor)}
                onClose={() => setMenuAnchor(null)}
              >
                <MenuItem onClick={() => handleNavigate("/settings")}>
                  <Settings size={16} style={{ marginRight: 8 }} />
                  Configurações
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    logout();
                    router.push("/");
                  }}
                >
                  <LogOut size={16} style={{ marginRight: 8 }} />
                  Sair
                </MenuItem>
              </Menu>
            </Stack>
          </Stack>
        </Box>

        <Box sx={{ px: { xs: 2, md: 3 }, py: { xs: 2, md: 3 }, flex: 1 }}>
          {children}
        </Box>
      </Box>
    </Box>
  );
}

"use client";

import { type ReactNode, useState } from "react";
import {
  Badge,
  Box,
  Divider,
  IconButton,
  List,
  ListItem,
  Menu,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import {
  Bell,
  Trash2,
  UserCheck,
  UserMinus,
  UserPlus,
} from "lucide-react";
import {
  NotificationType,
  useNotifications,
} from "@/contexts/NotificationContext";

const relativeTime = new Intl.RelativeTimeFormat("pt-BR", { numeric: "auto" });

function formatRelativeTime(timestamp: number) {
  const diff = Date.now() - timestamp;
  const minutes = Math.round(diff / 60000);
  if (Math.abs(minutes) < 60) return relativeTime.format(-minutes, "minute");
  const hours = Math.round(minutes / 60);
  if (Math.abs(hours) < 24) return relativeTime.format(-hours, "hour");
  const days = Math.round(hours / 24);
  return relativeTime.format(-days, "day");
}

const notificationMeta: Record<
  NotificationType,
  { label: string; icon: ReactNode; color: string }
> = {
  lead_created: {
    label: "Lead criado",
    icon: <UserPlus size={16} />,
    color: "primary.light",
  },
  lead_removed: {
    label: "Lead removido",
    icon: <UserMinus size={16} />,
    color: "error.light",
  },
  client_created: {
    label: "Cliente criado",
    icon: <UserCheck size={16} />,
    color: "success.light",
  },
  client_removed: {
    label: "Cliente removido",
    icon: <Trash2 size={16} />,
    color: "warning.light",
  },
};

export function NotificationMenu() {
  const { notifications, unreadCount, markAllAsRead } = useNotifications();
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const open = Boolean(anchorEl);

  const handleOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
    if (unreadCount > 0) {
      markAllAsRead();
    }
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <Tooltip title="Notificações">
        <IconButton onClick={handleOpen}>
          <Badge
            color="error"
            badgeContent={unreadCount}
            overlap="circular"
            invisible={unreadCount === 0}
          >
            <Bell size={18} />
          </Badge>
        </IconButton>
      </Tooltip>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        PaperProps={{
          sx: { width: 320, p: 0.5 },
        }}
      >
        <Box sx={{ px: 2, py: 1.5 }}>
          <Typography variant="subtitle1" fontWeight={700}>
            Notificações
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {unreadCount > 0
              ? `${unreadCount} novas notificações`
              : "Atualizado"}
          </Typography>
        </Box>
        <Divider />
        {notifications.length === 0 ? (
          <Box sx={{ p: 2 }}>
            <Typography variant="body2" color="text.secondary">
              Nenhuma notificação recente.
            </Typography>
          </Box>
        ) : (
          <List dense disablePadding>
            {notifications.map((notification) => {
              const meta = notificationMeta[notification.type];
              return (
                <ListItem
                  key={notification.id}
                  disablePadding
                  sx={{ px: 2, py: 1 }}
                >
                  <Stack direction="row" spacing={1.5} alignItems="center">
                    <Box
                      sx={{
                        width: 36,
                        height: 36,
                        borderRadius: 2,
                        bgcolor: meta.color,
                        color: "text.primary",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                      aria-label={meta.label}
                    >
                      {meta.icon}
                    </Box>
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Typography variant="body2" fontWeight={600} noWrap>
                        {notification.title}
                      </Typography>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ display: "block" }}
                      >
                        {meta.label} • {formatRelativeTime(notification.timestamp)}
                      </Typography>
                    </Box>
                  </Stack>
                </ListItem>
              );
            })}
          </List>
        )}
      </Menu>
    </>
  );
}

"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

export type NotificationType =
  | "lead_created"
  | "lead_removed"
  | "client_created"
  | "client_removed";

export interface CRMNotification {
  id: string;
  type: NotificationType;
  title: string;
  timestamp: number;
  relatedId: string;
  read: boolean;
}

type AddNotificationPayload = {
  type: NotificationType;
  title: string;
  relatedId: string;
  timestamp?: number;
};

interface NotificationContextValue {
  notifications: CRMNotification[];
  unreadCount: number;
  addNotification: (payload: AddNotificationPayload) => void;
  markAllAsRead: () => void;
}

const NotificationContext =
  createContext<NotificationContextValue | undefined>(undefined);

const MAX_NOTIFICATIONS = 30;

export function NotificationProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [notifications, setNotifications] = useState<CRMNotification[]>([]);

  const addNotification = useCallback(
    ({ type, title, relatedId, timestamp }: AddNotificationPayload) => {
      const id =
        typeof crypto !== "undefined" && "randomUUID" in crypto
          ? crypto.randomUUID()
          : `${Date.now()}-${Math.random().toString(16).slice(2)}`;
      setNotifications((prev) => [
        {
          id,
          type,
          title,
          timestamp: timestamp ?? Date.now(),
          relatedId,
          read: false,
        },
        ...prev,
      ].slice(0, MAX_NOTIFICATIONS));
    },
    [],
  );

  const markAllAsRead = useCallback(() => {
    setNotifications((prev) =>
      prev.map((notification) =>
        notification.read ? notification : { ...notification, read: true },
      ),
    );
  }, []);

  const unreadCount = useMemo(
    () => notifications.filter((notification) => !notification.read).length,
    [notifications],
  );

  const value = useMemo(
    () => ({
      notifications,
      unreadCount,
      addNotification,
      markAllAsRead,
    }),
    [addNotification, markAllAsRead, notifications, unreadCount],
  );

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error(
      "useNotifications must be used within a NotificationProvider",
    );
  }
  return context;
}

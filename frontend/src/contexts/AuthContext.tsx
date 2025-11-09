"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  LoginPayload,
  RegisterUserPayload,
  UpdateUserPayload,
  User,
} from "@/types/api";
import { userService } from "@/services/userService";

interface AuthContextValue {
  user: User | null;
  authLoading: boolean;
  registerUser: (payload: RegisterUserPayload) => Promise<User>;
  loginUser: (payload: LoginPayload) => Promise<User>;
  logout: () => void;
  refreshUser: () => Promise<User | null>;
  updateUserProfile: (payload: UpdateUserPayload) => Promise<User | null>;
  updateUserContext: (updatedUser: User) => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const STORAGE_KEY = "advanced-crm-user";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    const restoreUser = () => {
      if (typeof window === "undefined") {
        return null;
      }
      const stored = window.localStorage.getItem(STORAGE_KEY);
      return stored ? (JSON.parse(stored) as User) : null;
    };
    setUser(restoreUser());
    setAuthLoading(false);
  }, []);

  const persistUser = useCallback((nextUser: User | null) => {
    setUser(nextUser);
    if (typeof window === "undefined") {
      return;
    }
    if (nextUser) {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextUser));
    } else {
      window.localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  const registerUser = useCallback(
    async (payload: RegisterUserPayload) => {
      const { data } = await userService.register(payload);
      persistUser(data);
      return data;
    },
    [persistUser],
  );

  const loginUser = useCallback(
    async (payload: LoginPayload) => {
      const { data } = await userService.login(payload);
      persistUser(data);
      return data;
    },
    [persistUser],
  );

  const logout = useCallback(() => {
    persistUser(null);
  }, [persistUser]);

  const refreshUser = useCallback(async () => {
    if (!user?.id) {
      return null;
    }
    const { data } = await userService.getById(user.id);
    persistUser(data);
    return data;
  }, [persistUser, user?.id]);

  const updateUserProfile = useCallback(
    async (payload: UpdateUserPayload) => {
      if (!user?.id) {
        return null;
      }
      const { data } = await userService.update(user.id, payload);
      persistUser(data);
      return data;
    },
    [persistUser, user?.id],
  );

  const updateUserContext = useCallback(
    (updatedUser: User) => {
      persistUser(updatedUser);
    },
    [persistUser],
  );

  const value = useMemo(
    () => ({
      user,
      authLoading,
      registerUser,
      loginUser,
      logout,
      refreshUser,
      updateUserProfile,
      updateUserContext,
    }),
    [
      authLoading,
      loginUser,
      logout,
      refreshUser,
      registerUser,
      updateUserProfile,
      updateUserContext,
      user,
    ],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

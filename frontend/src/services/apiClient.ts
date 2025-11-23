import axios from "axios";

const resolveApiUrl = () => {
  const importMeta = typeof import.meta !== "undefined" ? (import.meta as Record<string, any>) : null;
  const viteUrl = importMeta?.env?.VITE_API_URL as string | undefined;
  const nextUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  const fallback = "http://localhost:3333";
  const base = viteUrl ?? nextUrl ?? fallback;
  return base.endsWith("/api") ? base : `${base.replace(/\/$/, "")}/api`;
};

const API_URL = resolveApiUrl();

export const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

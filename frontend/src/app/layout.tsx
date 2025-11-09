import type { Metadata } from "next";
import { LayoutProviders } from "@/components/LayoutProviders";
import "./globals.css";

export const metadata: Metadata = {
  title: "Advanced CRM",
  description: "Frontend CRM para gerenciamento de leads e clientes.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body>
        <LayoutProviders>{children}</LayoutProviders>
      </body>
    </html>
  );
}

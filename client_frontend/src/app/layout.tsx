import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Conversa AI | Chat Assistant",
  description: "Intelligent chat and voice assistance",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}

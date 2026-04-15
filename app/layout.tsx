import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "FieldSpec",
  description: "Market Intelligence Platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="light">
      <body>{children}</body>
    </html>
  );
}

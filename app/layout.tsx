import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "FX Market Atelier",
  description: "FX Market Atelier — cinematic FX intelligence with live ingestion and scrollytelling UI.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

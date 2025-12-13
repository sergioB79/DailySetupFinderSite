import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "FX Movers Dossier | FX Market Atelier",
  description: "Premium FX Movers Dossier — deep-dive FX and metals setups.",
};

export default function ProLayout({ children }: { children: React.ReactNode }) {
  return <div className="page">{children}</div>;
}

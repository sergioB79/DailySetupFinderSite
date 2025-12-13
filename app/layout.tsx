import "./globals.css";
import type { Metadata } from "next";
import Image from "next/image";
import logoComplete from "@/lib/logo_complete.png";
import logoMonogram from "@/lib/logo_monogram.png";

export const metadata: Metadata = {
  title: "FX Market Atelier",
  description: "FX Market Atelier — cinematic FX intelligence with live ingestion and scrollytelling UI.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <header className="topbar">
          <div className="brand">
            <Image src={logoMonogram} alt="FX Market Atelier logo mark" className="brand-mark" priority />
            <div className="brand-text">
              <div className="brand-name">FX Market Atelier</div>
              <div className="brand-tagline">FX Macro Daily Brief · FX Movers Dossier</div>
            </div>
          </div>
          <div className="brand-actions">
            <a className="pill ghost" href="#cta">
              Subscribe
            </a>
            <a className="pill" href="/sample">
              Sample Dossier
            </a>
            <a className="pill ghost" href="/legal">
              Legal
            </a>
          </div>
        </header>
        <main>{children}</main>
        <footer className="footer">
          <div className="footer-logo">
            <Image src={logoComplete} alt="FX Market Atelier logo" className="logo-full" />
          </div>
          <p className="footer-text">
            Disclaimer: Market Atelier provides general market commentary for educational and informational purposes
            only. It is not investment research, financial advice, trading advice, or a recommendation to buy or sell
            any security, currency, commodity, or derivative. You are solely responsible for your investment decisions.
            Past performance is not indicative of future results.
          </p>
          <div className="footer-links">
            <a href="/legal">Full disclaimer</a>
            <a href="#cta">Subscribe</a>
            <a href="/sample">Sample Dossier</a>
          </div>
        </footer>
      </body>
    </html>
  );
}

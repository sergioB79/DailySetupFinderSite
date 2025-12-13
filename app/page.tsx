import Image from "next/image";
import Link from "next/link";
import { getCachedLatestSnapshot } from "@/lib/redis";
import { fetchLatestSnapshot, getSupabaseClient } from "@/lib/supabase";
import type { Snapshot } from "@/lib/parser";
import logoComplete from "@/lib/logo_complete.png";

export const revalidate = 0;

type LatestPayload = {
  snapshot: Snapshot;
  diff: any;
  source: "redis" | "supabase";
};

async function loadLatest(): Promise<LatestPayload | null> {
  try {
    const cached = await getCachedLatestSnapshot();
    if (cached) {
      return { snapshot: cached.snapshot, diff: cached.diff, source: "redis" };
    }
  } catch (err) {
    console.warn("Redis unavailable, falling back to Supabase", err);
  }

  const supabase = getSupabaseClient();
  const latest = await fetchLatestSnapshot(supabase);
  if (!latest) return null;
  return { snapshot: latest.snapshot, diff: latest.record.diff_vs_previous ?? null, source: "supabase" };
}

function extractSignals(snapshot: Snapshot) {
  const text = snapshot.sections.flatMap((s) => s.items).join(" ").toLowerCase();

  const hawkish = ["hawkish", "tightening", "higher for longer"].some((k) => text.includes(k));
  const dovish = ["dovish", "easing", "cut"].some((k) => text.includes(k));
  const riskOff = ["risk-off", "volatility", "fragile", "tail risk"].some((k) => text.includes(k));
  const safeHaven = ["usd", "jpy", "chf"].some((k) => text.includes(k));

  const policy = hawkish ? 70 : dovish ? 40 : 55;
  const risk = riskOff ? 30 : 60;
  const haven = safeHaven ? 35 : 55;

  return { policy, risk, haven };
}

function positionPoint({ policy, risk, haven }: { policy: number; risk: number; haven: number }) {
  // Equilateral triangle vertices (normalized)
  const P = { x: 0, y: -1 };
  const R = { x: Math.sin(Math.PI / 3), y: Math.cos(Math.PI / 3) }; // (0.866, 0.5)
  const H = { x: -Math.sin(Math.PI / 3), y: Math.cos(Math.PI / 3) }; // (-0.866, 0.5)

  const sum = policy + risk + haven || 1;
  const px = (policy * P.x + risk * R.x + haven * H.x) / sum;
  const py = (policy * P.y + risk * R.y + haven * H.y) / sum;

  // Map to SVG viewBox 0..100
  const x = 50 + px * 40;
  const y = 50 + py * 40;
  return { x, y };
}

function MacroCompass({ snapshot }: { snapshot: Snapshot }) {
  const signals = extractSignals(snapshot);
  const point = positionPoint(signals);

  return (
    <div className="card">
      <div className="triad">
        <svg viewBox="0 0 100 100" role="img" aria-label="Macro Compass">
          <defs>
            <linearGradient id="triad-stroke" x1="0%" x2="100%" y1="0%" y2="100%">
              <stop offset="0%" stopColor="var(--accent-3)" stopOpacity="0.7" />
              <stop offset="100%" stopColor="var(--accent-2)" stopOpacity="0.7" />
            </linearGradient>
            <radialGradient id="triad-glow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="var(--accent-3)" stopOpacity="0.9" />
              <stop offset="100%" stopColor="var(--accent-2)" stopOpacity="0.2" />
            </radialGradient>
          </defs>
          <polygon
            points="50,10 93,80 7,80"
            fill="rgba(255,255,255,0.02)"
            stroke="var(--glass-border)"
            strokeWidth="1"
          />
          <polygon
            points="50,22 82,74 18,74"
            fill="rgba(255,255,255,0.02)"
            stroke="var(--glass-border)"
            strokeWidth="0.6"
            strokeDasharray="4 4"
          />
          <circle cx="50" cy="50" r="2" fill="var(--muted)" />
          <circle cx={point.x} cy={point.y} r="4" className="triad-point" />
        </svg>
        <div className="triad-labels">
          <span className="policy">Policy</span>
          <span className="risk">Risk Tone</span>
          <span className="haven">Safe Haven</span>
        </div>
      </div>
      <div className="chip-row" style={{ marginTop: 14 }}>
        <span className="chip">Policy: {signals.policy}</span>
        <span className="chip">Risk: {signals.risk}</span>
        <span className="chip">Haven: {signals.haven}</span>
      </div>
    </div>
  );
}

function SectionPanel({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="card">
      <h3 className="section-title">{title}</h3>
      <ul className="section-list">
        {items.map((item, idx) => (
          <li key={idx}>{item}</li>
        ))}
      </ul>
    </div>
  );
}

export default async function Page() {
  const latest = await loadLatest();

  if (!latest) {
    return (
      <div className="page">
        <div className="card">
          <h2 style={{ margin: 0 }}>No brief available</h2>
          <p style={{ color: "var(--muted)" }}>
            Could not load the latest brief. Please trigger ingestion or check data sources.
          </p>
        </div>
      </div>
    );
  }

  const { snapshot, diff, source } = latest;
  const highlight = snapshot.sections.find((s) => s.id === "snapshot");
  const narrative = snapshot.sections.filter((s) => s.id !== "snapshot");
  const title = "FX Macro Daily Brief";

  return (
    <div className="page">
      <section className="hero">
        <div className="hero-copy">
          <div className="meta">
            <span className="pill">As of {snapshot.asOf}</span>
          </div>
          <h1>
            <Link href="/" className="title-link">
              {title}
            </Link>
          </h1>
          <div style={{ fontSize: 18, color: "var(--muted)", marginTop: 2 }}>{snapshot.asOf}</div>
          {highlight && highlight.items.length > 0 && <p>{highlight.items[0]}</p>}
          {highlight && highlight.items.length > 1 && <p>{highlight.items[1]}</p>}
          <div className="narrative">
            <h3>Today's Narrative</h3>
            <ul className="narrative-list">
              {narrative.slice(0, 3).flatMap((s) =>
                s.items.slice(0, 2).map((item, idx) => (
                  <li key={`${s.id}-${idx}`} className="narrative-item">
                    <strong>{s.title}:</strong> {item}
                  </li>
                )),
              )}
            </ul>
          </div>
        </div>
        <MacroCompass snapshot={snapshot} />
      </section>

      <section>
          <h2 style={{ margin: "0 0 12px" }}>Sections</h2>
          <div className="grid">
            {snapshot.sections.map((section) => (
              <SectionPanel key={section.id} title={section.title} items={section.items} />
            ))}
            <div className="card wide" id="cta">
              <h3
                className="section-title"
                style={{ marginBottom: 8, fontSize: 22, letterSpacing: -0.02, color: "#eaf7ff" }}
              >
                Unlock today’s FX Movers Dossier
              </h3>
              <p style={{ margin: "0 0 14px", color: "var(--muted)", lineHeight: 1.6 }}>
                Deep-dive dossier on the top-moving FX pairs + Gold, Silver, GER40—built for execution.
              </p>
              <ul className="cta-list" style={{ textAlign: "left", maxWidth: 600, margin: "0 auto 12px" }}>
                <li>What moved &amp; why (clean narrative)</li>
                <li>Key levels (support/resistance + volatility bands)</li>
                <li>2-3 scenarios + "what invalidates it"</li>
                <li>Today's catalysts (events, flows, positioning notes)</li>
                <li>10-min read. Delivered daily.</li>
              </ul>
              <div className="cta-buttons" style={{ justifyContent: "center" }}>
                <a className="btn primary" href="#">
                  Get the Dossier (EUR 39/mo)
                </a>
                <a className="btn" href="/sample">
                  See sample
                </a>
              </div>
              <p style={{ margin: "12px auto 0", color: "var(--muted)", fontSize: 12, maxWidth: 600 }}>
                Educational content only. Not investment advice. High risk: you can lose all capital. Cancel anytime.
              </p>
            </div>
          </div>
        </section>
      </div>
    );
  }

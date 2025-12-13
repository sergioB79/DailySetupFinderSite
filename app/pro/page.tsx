import { cachePremiumLatestSnapshot, getCachedPremiumLatestSnapshot } from "@/lib/redis";
import { fetchLatestPremiumSnapshot, getSupabaseClient } from "@/lib/supabase";
import type { Snapshot } from "@/lib/parser";

export const revalidate = 0;

type LatestPayload = {
  snapshot: Snapshot;
  diff: any;
  source: "redis" | "supabase";
};

async function loadPremiumLatest(): Promise<LatestPayload | null> {
  try {
    const cached = await getCachedPremiumLatestSnapshot();
    if (cached) {
      const payload: LatestPayload = { snapshot: cached.snapshot, diff: cached.diff, source: "redis" };
      return payload;
    }
  } catch (err) {
    console.warn("Premium Redis unavailable, falling back to Supabase", err);
  }

  const supabase = getSupabaseClient();
  const latest = await fetchLatestPremiumSnapshot(supabase);
  if (!latest) return null;

  const payload: LatestPayload = {
    snapshot: latest.snapshot,
    diff: latest.record.diff_vs_previous ?? null,
    source: "supabase",
  };
  try {
    await cachePremiumLatestSnapshot({ snapshot: latest.snapshot, diff: latest.record.diff_vs_previous ?? null });
  } catch (err) {
    console.warn("Premium Redis cache failed", err);
  }

  return payload;
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

export default async function ProPage() {
  const latest = await loadPremiumLatest();
  const accessGranted = true; // TODO: wire to Supabase Auth + subscriptions check

  if (!accessGranted) {
    return (
      <div className="card">
        <h2 style={{ marginTop: 0 }}>FX Movers Dossier</h2>
        <p style={{ color: "var(--muted)" }}>Premium access required. Please sign in and subscribe.</p>
        <div className="cta-buttons">
          <a className="btn primary" href="/subscribe">
            Subscribe
          </a>
          <a className="btn" href="/sample">
            See sample
          </a>
        </div>
      </div>
    );
  }

  if (!latest) {
    return (
      <div className="card">
        <h2 style={{ marginTop: 0 }}>No premium brief available</h2>
        <p style={{ color: "var(--muted)" }}>
          Could not load the latest premium brief. Please trigger premium ingestion or check data sources.
        </p>
      </div>
    );
  }

  const { snapshot } = latest;
  const highlight = snapshot.sections.find((s) => s.id === "snapshot");
  const narrative = snapshot.sections.filter((s) => s.id !== "snapshot");

  return (
    <div className="page">
      <div className="card" style={{ marginBottom: 20 }}>
        <div className="meta">
          <span className="pill">Premium</span>
          <span className="pill">As of {snapshot.asOf}</span>
          <span className="pill">Access check pending (preview)</span>
        </div>
        <h1 style={{ margin: "0 0 6px" }}>FX Movers Dossier</h1>
        <div style={{ fontSize: 18, color: "var(--muted)", marginBottom: 12 }}>{snapshot.asOf}</div>
        {highlight && highlight.items.length > 0 && <p style={{ color: "var(--muted)" }}>{highlight.items[0]}</p>}
        <div className="chip-row">
          <span className="chip">FX + metals setups</span>
          <span className="chip">Daily premium lane</span>
        </div>
      </div>

      <section style={{ marginBottom: 26 }}>
        <h3 style={{ margin: "0 0 10px" }}>Key Moves</h3>
        <div className="grid">
          {narrative.slice(0, 3).map((section) => (
            <SectionPanel key={section.id} title={section.title} items={section.items} />
          ))}
        </div>
      </section>

      <section>
        <h3 style={{ margin: "0 0 10px" }}>Full Brief</h3>
        <div className="grid">
          {snapshot.sections.map((section) => (
            <SectionPanel key={section.id} title={section.title} items={section.items} />
          ))}
        </div>
      </section>
    </div>
  );
}

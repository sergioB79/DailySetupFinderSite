import Link from "next/link";

type SetupRow = {
  instrument: string;
  bias: string;
  confidence: number;
  horizon: string;
  thesis: string;
  catalysts: string;
  invalidation: string;
  eventRisk: string;
};

type SetupDetail = {
  instrument: string;
  bias: string;
  confidence: number;
  horizon: string;
  driver: string;
  trigger: string;
  invalidation: string;
  eventRisk: string;
  tips: string;
};

const snapshot =
  "As of December 12, 2025, the global macro environment is characterized by divergent central bank policies, with the Federal Reserve maintaining a hawkish stance amidst persistent inflationary pressures, whereas the ECB and BOJ remain dovish due to weaker economic growth and subdued inflation. Commodity markets are experiencing volatility due to geopolitical tensions affecting supply chains. The risk sentiment is moderately risk-off, driven by uncertainties in global economic growth and geopolitical tensions. This is influencing FX markets, with safe-haven currencies like USD and JPY in focus.";

const tableRows: SetupRow[] = [
  {
    instrument: "USDJPY",
    bias: "Bullish",
    confidence: 9,
    horizon: "Swing",
    thesis: "Rate divergence favored by Fed's hawkish stance vs BOJ's ultra-loose policy",
    catalysts: "Fed rate path, BOJ's dovish guidance",
    invalidation: "BOJ policy change",
    eventRisk: "US Retail Sales, BOJ statement",
  },
  {
    instrument: "EURUSD",
    bias: "Bearish",
    confidence: 8,
    horizon: "Swing",
    thesis: "ECB dovishness contrasts with Fed's hawkish stance",
    catalysts: "ECB rate path, US inflation data",
    invalidation: "ECB hawkish shift",
    eventRisk: "Eurozone CPI, US Retail Sales",
  },
  {
    instrument: "XAUUSD",
    bias: "Bearish",
    confidence: 7,
    horizon: "Intraday",
    thesis: "Strong USD and higher yields suppressing XAUUSD",
    catalysts: "US Treasury yields, Fed's guidance",
    invalidation: "Drop in US yields",
    eventRisk: "US Retail Sales",
  },
  {
    instrument: "AUDUSD",
    bias: "Bearish",
    confidence: 6,
    horizon: "Swing",
    thesis: "RBA neutral vs Fed hawkish; China slowdown",
    catalysts: "RBA minutes, Chinese economic data",
    invalidation: "RBA hawkish shift",
    eventRisk: "Chinese GDP, US Retail Sales",
  },
  {
    instrument: "GBPUSD",
    bias: "Bearish",
    confidence: 6,
    horizon: "Swing",
    thesis: "BOE cautious vs Fed tightening",
    catalysts: "BOE inflation report, US economic data",
    invalidation: "BOE hawkish surprise",
    eventRisk: "UK CPI, US Retail Sales",
  },
  {
    instrument: "GER40",
    bias: "Bearish",
    confidence: 5,
    horizon: "Intraday",
    thesis: "Weak EU growth outlook and risk-off sentiment impacting equities",
    catalysts: "EU growth data, ECB policy",
    invalidation: "Strong EU growth data",
    eventRisk: "Eurozone CPI",
  },
  {
    instrument: "XAGUSD",
    bias: "Bearish",
    confidence: 5,
    horizon: "Intraday",
    thesis: "Strong USD and risk-off sentiment weighing on silver",
    catalysts: "US dollar strength, global demand concerns",
    invalidation: "Reversal in USD strength",
    eventRisk: "US Retail Sales",
  },
  {
    instrument: "EURJPY",
    bias: "Bearish",
    confidence: 4,
    horizon: "Swing",
    thesis: "ECB dovishness vs BOJ; euro weakness prevails",
    catalysts: "ECB policy divergence, Japanese trade data",
    invalidation: "ECB hawkish surprise",
    eventRisk: "Eurozone CPI, BOJ statement",
  },
  {
    instrument: "USDCAD",
    bias: "Bullish",
    confidence: 4,
    horizon: "Intraday",
    thesis: "Fed hawkish vs BoC neutral; oil volatility",
    catalysts: "Fed policy, Canadian economic data",
    invalidation: "BoC hawkish pivot",
    eventRisk: "Canadian CPI, US Retail Sales",
  },
];

const details: SetupDetail[] = [
  {
    instrument: "USDJPY",
    bias: "Bullish",
    confidence: 9,
    horizon: "Swing",
    driver:
      "Fed's persistent hawkish stance contrasts sharply with BOJ's ultra-loose monetary policy.",
    trigger: "Break above 150.00 resistance.",
    invalidation: "BOJ tightening shift or dovish Fed surprise.",
    eventRisk: "US Retail Sales; BOJ statement.",
    tips: "Enter during Tokyo or New York for optimal liquidity.",
  },
  {
    instrument: "EURUSD",
    bias: "Bearish",
    confidence: 8,
    horizon: "Swing",
    driver: "ECB dovish vs Fed aggressive tightening path.",
    trigger: "Break below 1.0500.",
    invalidation: "ECB tone shifts hawkish.",
    eventRisk: "Eurozone CPI; US Retail Sales.",
    tips: "Use European session liquidity for entries.",
  },
  {
    instrument: "XAUUSD",
    bias: "Bearish",
    confidence: 7,
    horizon: "Intraday",
    driver: "Rising US yields and strong USD weigh on gold.",
    trigger: "Move below $1,900.",
    invalidation: "Significant drop in US yields or dovish Fed surprise.",
    eventRisk: "US Retail Sales.",
    tips: "Enter during US hours for best execution.",
  },
  {
    instrument: "AUDUSD",
    bias: "Bearish",
    confidence: 6,
    horizon: "Swing",
    driver: "RBA neutral vs Fed hawkish; China slowdown risk.",
    trigger: "Sustained trade below 0.6500.",
    invalidation: "Hawkish RBA surprise.",
    eventRisk: "Chinese GDP; US Retail Sales.",
    tips: "Asia session provides AUD-specific liquidity.",
  },
  {
    instrument: "GBPUSD",
    bias: "Bearish",
    confidence: 6,
    horizon: "Swing",
    driver: "BOE cautious vs Fed tightening.",
    trigger: "Break below 1.2000.",
    invalidation: "Unexpected BOE hawkishness.",
    eventRisk: "UK CPI; US Retail Sales.",
    tips: "London session is optimal for execution.",
  },
  {
    instrument: "GER40",
    bias: "Bearish",
    confidence: 5,
    horizon: "Intraday",
    driver: "Weak EU growth outlook + risk-off sentiment.",
    trigger: "Break below 14,500.",
    invalidation: "Strong upside surprise in EU growth data.",
    eventRisk: "Eurozone CPI; broader risk shifts.",
    tips: "Use European market open for best liquidity.",
  },
  {
    instrument: "XAGUSD",
    bias: "Bearish",
    confidence: 5,
    horizon: "Intraday",
    driver: "USD strength and risk-off weigh on silver.",
    trigger: "Sustained move below $22.00.",
    invalidation: "Reversal in USD strength or risk tone improvement.",
    eventRisk: "US Retail Sales.",
    tips: "US hours best for execution.",
  },
  {
    instrument: "EURJPY",
    bias: "Bearish",
    confidence: 4,
    horizon: "Swing",
    driver: "ECB dovishness more pronounced than BOJ's; euro weakness.",
    trigger: "Break below 160.00.",
    invalidation: "Hawkish ECB shift.",
    eventRisk: "Eurozone CPI; BOJ statement.",
    tips: "Watch Europe/Asia liquidity windows.",
  },
  {
    instrument: "USDCAD",
    bias: "Bullish",
    confidence: 4,
    horizon: "Intraday",
    driver: "Fed hawkish vs BoC neutral; oil volatility.",
    trigger: "Sustained move above 1.3900.",
    invalidation: "BoC hawkish pivot or strong oil rebound.",
    eventRisk: "Canadian CPI; US Retail Sales.",
    tips: "New York session best for execution.",
  },
];

export default function SamplePage() {
  return (
    <div className="page">
      <div className="hero" style={{ gridTemplateColumns: "1fr" }}>
        <div className="hero-copy">
          <div className="meta">
            <span className="pill">Sample • Dec 12, 2025</span>
            <span className="pill">Premium snapshot</span>
          </div>
          <h1>FX Movers Dossier — Sample Edition</h1>
          <p style={{ color: "var(--muted)", lineHeight: 1.6 }}>{snapshot}</p>
          <div className="chip-row">
            <span className="chip">6 FX pairs + Gold, Silver, GER40</span>
            <span className="chip">Bias + triggers + invalidation</span>
            <span className="chip">Actionable catalysts</span>
          </div>
        </div>
      </div>

      <section style={{ marginTop: 28 }}>
        <h2 style={{ margin: "0 0 12px" }}>Top Setups (Sample)</h2>
        <div className="card" style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", color: "var(--muted)", fontSize: 14 }}>
            <thead style={{ color: "var(--text)" }}>
              <tr>
                {["Instrument", "Bias", "Conf", "Horizon", "Core Thesis", "Catalyst(s)", "Invalidation", "Event Risk"].map(
                  (col) => (
                    <th
                      key={col}
                      style={{
                        textAlign: "left",
                        padding: "10px 8px",
                        borderBottom: "1px solid var(--glass-border)",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {col}
                    </th>
                  ),
                )}
              </tr>
            </thead>
            <tbody>
              {tableRows.map((row) => (
                <tr key={row.instrument}>
                  <td style={{ padding: "8px 8px", color: "var(--text)" }}>{row.instrument}</td>
                  <td style={{ padding: "8px 8px" }}>{row.bias}</td>
                  <td style={{ padding: "8px 8px" }}>{row.confidence}</td>
                  <td style={{ padding: "8px 8px" }}>{row.horizon}</td>
                  <td style={{ padding: "8px 8px", minWidth: 180 }}>{row.thesis}</td>
                  <td style={{ padding: "8px 8px", minWidth: 150 }}>{row.catalysts}</td>
                  <td style={{ padding: "8px 8px", minWidth: 140 }}>{row.invalidation}</td>
                  <td style={{ padding: "8px 8px", minWidth: 140 }}>{row.eventRisk}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section style={{ marginTop: 28 }}>
        <h2 style={{ margin: "0 0 12px" }}>Setup Details</h2>
        <div className="grid">
          {details.map((d) => (
            <div key={d.instrument} className="card">
              <div className="meta" style={{ marginBottom: 6 }}>
                <span className="pill">{d.instrument}</span>
                <span className="pill">{d.bias}</span>
                <span className="pill">Confidence {d.confidence}/10</span>
                <span className="pill">{d.horizon}</span>
              </div>
              <ul className="section-list" style={{ color: "var(--muted)", paddingLeft: 18 }}>
                <li>
                  <strong>Driver:</strong> {d.driver}
                </li>
                <li>
                  <strong>Trigger:</strong> {d.trigger}
                </li>
                <li>
                  <strong>Invalidation:</strong> {d.invalidation}
                </li>
                <li>
                  <strong>Event risk:</strong> {d.eventRisk}
                </li>
                <li>
                  <strong>Execution tips:</strong> {d.tips}
                </li>
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section style={{ marginTop: 32, textAlign: "center" }}>
        <div className="card wide">
          <h3 className="section-title" style={{ fontSize: 22, marginBottom: 8 }}>
            Like what you see?
          </h3>
          <p style={{ margin: "0 0 12px", color: "var(--muted)" }}>Get the full FX Movers Dossier delivered daily.</p>
          <div className="cta-buttons" style={{ justifyContent: "center" }}>
            <Link className="btn primary" href="/">
              Back to today’s brief
            </Link>
            <a className="btn" href="#">
              Subscribe (EUR 39/mo)
            </a>
          </div>
          <p style={{ marginTop: 10, color: "var(--muted)", fontSize: 12 }}>
            Educational content — not investment advice.
          </p>
        </div>
      </section>
    </div>
  );
}





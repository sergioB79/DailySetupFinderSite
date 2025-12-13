export default function SubscribePage() {
  return (
    <div className="page">
      <div className="card">
        <h1 style={{ marginTop: 0 }}>Subscribe to FX Movers Dossier</h1>
        <p style={{ color: "var(--muted)", lineHeight: 1.6 }}>
          Premium FX and metals setups, delivered daily. Login via magic link, then complete checkout to unlock /pro.
        </p>
        <div className="cta-buttons" style={{ marginTop: 16 }}>
          <a className="btn primary" href="#">
            Login (magic link)
          </a>
          <a className="btn" href="#">
            Subscribe (Stripe Checkout)
          </a>
        </div>
        <p style={{ marginTop: 12, color: "var(--muted)", fontSize: 12 }}>
          Educational content only. Not investment advice. High risk: you can lose all capital.
        </p>
      </div>
    </div>
  );
}

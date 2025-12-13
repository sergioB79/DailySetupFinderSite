Technical TODO & Process Diary
==============================

Scope
- Build a cinematic Next.js microsite that auto-ingests the latest Google Drive brief, parses to structured JSON, and renders a premium scrollytelling UI with 3D Macro Compass, diff mode, and pro utilities (archive, share, export).

Decisions / Confirmations
- Drive auth: Google Service Account (server-to-server). Folder shared to service account email (Viewer/Editor as needed).
- Report format: Markdown `.md` with consistent sections (e.g., `daily_macro_briefs_2025-12-12.md`).
- Infra: Supabase Postgres (archive + diffs), Upstash Redis (cache latest).
- Ingestion trigger: Vercel Cron calling `POST /api/webhook/ingest` with `Authorization: Bearer ${INGEST_SECRET}`.
- Env vars: `GOOGLE_SERVICE_ACCOUNT_JSON_B64`, `GDRIVE_FOLDER_ID=1MMODjiYDGXbMDyE5VMwXf3v2yfbvIMLa`, `INGEST_SECRET`, `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN`, `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`.

Implementation priorities (do next)
- [x] A) `POST /api/webhook/ingest`: auth check, list latest file, download, parse MD -> JSON (zod validate), store snapshot in Supabase, compute diff vs previous, cache latest in Redis. (implemented; needs live test + Supabase table confirm)
- [x] B) `GET /api/latest`: Redis-first, Supabase fallback. (implemented; needs live test)
- [x] C) Local dev fixtures: `fixtures/latest.md` sample + parser unit test using fixture; add local ingestion mock. (fixture + test added)

TODO Board
- Data ingestion & parsing
  - [ ] Service account auth wired with `GOOGLE_SERVICE_ACCOUNT_JSON_B64`; folder shared and reachable (shared to `dailysetupfinder@dailysetupfindersite.iam.gserviceaccount.com` as Viewer).
  - [ ] Cron-triggered ingestion endpoint lists files ordered by `modifiedTime desc` and pulls latest.
  - [ ] Download latest Markdown file and parse into normalized JSON (asOf, location, title, sections) using remark/mdast.
  - [ ] Zod schema validation plus tolerant parsing with anomaly logging/alerts.
  - [ ] Cache latest snapshot in Redis; invalidate on new ingest.
  - [ ] Persist snapshots + metadata to Supabase Postgres for archive and diffs.
  - [ ] Compute and store diffs vs previous snapshot for fast diff mode.

- Backend APIs (Next.js Route Handlers)
  - [ ] GET /api/latest pulls from Redis, falls back to Postgres.
  - [ ] GET /api/archive lists past briefs with pagination and shareable permalinks.
  - [ ] GET /api/diff?date= returns diff vs selected prior date.
  - [ ] POST /api/webhook/ingest secured by secret for cron/queue trigger (Bearer).
  - [ ] GET /api/export/pdf (optional) to render and return PDF export of brief.

- Frontend experience (App Router)
  - [x] Global layout with expressive typography, ambient background theme, and responsive grids.
  - [x] SSR load latest brief; handle loading/error and fallback content when data missing.
  - [x] Macro Compass hero (triad plot, CSS-based) using server data signals; add three-axis labeling.
  - [ ] Scroll-driven narrative using Framer Motion; kinetic typography for key bullets and section reveals.
  - [x] Section panels (Snapshot, Key Forces, FX Implications, Risk Radar, What to Watch Next) with glass/blur styling and anchor links.
  - [x] Premium promo tile in grid for FX Movers Dossier CTA.
  - [x] Static sample page for CTA with organized table + detail cards.
  - [ ] Semantic highlight interactions: hover/tap phrases to show why-it-matters, impacted assets, confidence.
  - [ ] Diff mode toggle overlaying subtle change indicators vs prior day.

- Archive/search (later phases)
  - [ ] Archive page with date/location filters and shareable links.
  - [ ] Quick compare vs yesterday shortcut from latest view.
  - [ ] Semantic search/topic map using embeddings when available.

- DevEx & infra
  - [ ] Env management (.env.example) covering Drive creds, Redis, Postgres, ingestion secret (vars listed above).
  - [ ] Sample fixture data `fixtures/latest.md` + local ingestion mock for offline dev.
  - [ ] ESLint/Prettier + TypeScript strict mode; path aliases and module boundaries.
  - [ ] CI pipeline for lint/test/build; preview deploy config.
  - [ ] Monitoring/logging around ingestion failures and parse anomalies.

- Testing
  - [x] Parser unit tests with fixtures for headings/bullets and edge cases (use `fixtures/latest.md`).
  - [ ] Integration test for ingestion route with mocked Drive API.
  - [ ] E2E smoke for latest page rendering, diff toggle, and Compass fallback on mobile DPR.

- Open questions
  - [x] Drive auth approach and secrets (service account JSON in env).
  - [x] Report format (Markdown .md).
  - [x] Providers (Upstash Redis, Supabase Postgres).
  - [x] Data retention policy (keep all for now; no pruning).
  - [ ] Desired PDF export fidelity and styling requirements (deferred/out of MVP).

Progress Diary
- 2025-12-12 18:54:18 UTC - Reviewed siteInfo.txt to extract objectives, stack, and feature expectations. Done: captured scope. Missing: current repo structure/code. Next: draft technical TODO board and tracking file.
- 2025-12-12 18:54:41 UTC - Drafted detailed technical TODO breakdown and created TECH_TODO_BOARD.md for tracking. Done: initial backlog + progress log scaffold. Missing: confirmation of tooling choices and live data access. Next: prioritize ingestion implementation and set up env secrets.
- 2025-12-12 19:01:30 UTC - Captured decisions: service account auth, Markdown reports, Supabase + Upstash, Vercel Cron POST /api/webhook/ingest with Bearer secret; documented required env vars. Done: unblocked ingestion plan. Missing: PDF export fidelity, retention policy. Next: implement webhook ingest (A), latest endpoint (B), fixtures + parser test (C).
- 2025-12-12 19:23:41 UTC - Received service account email (`dailysetupfinder@dailysetupfindersite.iam.gserviceaccount.com`) and folder share; `GOOGLE_SERVICE_ACCOUNT_JSON_B64` set. Done: auth inputs ready. Missing: Upstash Redis and Supabase env values, retention policy, PDF fidelity. Next: build ingest route (A), latest route (B), fixtures + parser test (C); validate Drive listing with new creds once implemented.
- 2025-12-12 19:58:37 UTC - Confirmed `.env.local` now populated (INGEST_SECRET, Upstash Redis, Supabase keys, Drive creds). Done: secrets available for wiring. Missing: ingest/latest route implementations, fixtures, tests, retention policy, PDF fidelity. Next: implement ingest webhook with supplied envs, hook Redis/Supabase clients, add fixture + parser test, then Redis-first latest endpoint.
- 2025-12-12 20:04:21 UTC - Implemented A/B/C: ingest route (Drive fetch + parse + Supabase store + diff + Redis cache), latest route (Redis-first, Supabase fallback), added `fixtures/latest.md` and parser unit test, documented curl commands in README. Done: code scaffolds ready. Missing: live Drive/Supabase/Redis verification, Supabase table/schema confirmation, retention policy note (keep all), PDF export deferred. Next: run ingest locally once deps installed, confirm Supabase table structure (`snapshots` with as_of unique), and add CI/test wiring.
- 2025-12-12 20:10:00 UTC - Added project scaffolding for installability: `package.json` with Next/React/TS/vitest and required deps, `tsconfig.json`, `next-env.d.ts`, `vitest.config.ts`. Done: unblock `npm install`. Missing: actual `npm install` run (previous ENOENT), Supabase table creation, CI wiring. Next: install deps, run ingest curl, verify Supabase/Redis interactions.
- 2025-12-12 20:11:57 UTC - Ran `npm install`; got warning about Next 14.2.15 security advisory (upgrade recommended) and 6 vulnerabilities reported by npm audit. Done: deps installed. Missing: bump Next to patched version per security advisory, evaluate npm audit output, Supabase table creation, ingest run/verification. Next: update Next to patched version (per 2025-12-11 security blog), rerun install/tests; create `snapshots` table and run ingest curl.
- 2025-12-12 20:13:00 UTC - Addressed advisories in package.json: bumped Next to 14.2.35 (patched per security blog), bumped Vitest to 4.0.15, added esbuild override ^0.24.4 to mitigate dev-server vuln. Done: manifest updated. Missing: `npm install` to apply bumps, rerun tests, confirm no breaking changes. Next: reinstall, run ingest curl, run `npm test -- parser`, and validate Supabase/Redis paths.
- 2025-12-12 20:21:19 UTC - Adjusted parser to use first non-empty line/title and extract dates from free text (handles `Snapshot_2025-12-12.txt` style). Re-ran `npm test -- parser`: PASS. Done: parser more robust to non-heading briefs. Missing: ingest/Redis/Supabase live verification, esbuild advisory still pending upstream patch (>0.24.2 not published). Next: run ingest curl, verify Supabase table, monitor esbuild fix once available.
- 2025-12-12 21:10:58 UTC - Repaired corrupted `tsconfig.json` (valid JSON, Next plugin, paths). Done: unblock TypeScript config read. Missing: rerun dev server after fix, ingest/Redis/Supabase verification, esbuild patched release. Next: restart dev, run ingest curl, confirm Supabase table and latest endpoint.
- 2025-12-12 21:20:10 UTC - Hardened Redis client to use Upstash REST `/pipeline` endpoint and swallow cache failures in ingest; parser test still passing. Done: ingest no longer hard-fails on Redis parse error. Missing: re-run ingest with new Redis call; Supabase/Redis live verification; esbuild patched release. Next: retry ingest, confirm Supabase insert and latest endpoint response.
- 2025-12-12 21:21:09 UTC - Added defensive Redis handling on `/api/latest` (fallback to Supabase on cache fail, non-fatal cache writes). Parser test still passing. Done: latest endpoint more robust. Missing: verify latest endpoint after successful ingest; esbuild patched release. Next: hit `/api/latest` post-ingest and confirm payload; monitor esbuild update.
- 2025-12-12 21:30:00 UTC - Built initial UI (`app/layout.tsx`, `app/globals.css`, `app/page.tsx`): premium layout, hero with Macro Compass (CSS-based), SSR fetch of latest snapshot, section panels, and narrative block. Latest endpoint confirmed returning Supabase snapshot. Done: WOW layer started. Missing: true scroll choreography/Framer Motion, richer compass (3D/shaders), semantic highlights, diff overlay, esbuild patched release. Next: add motion, semantic hovers, and diff visuals; monitor esbuild update.
- 2025-12-12 21:32:06 UTC - Replaced compass needle with balanced triad plot (Policy/Risk/Haven barycentric marker) to avoid misleading pointer; parser test still passing. Done: clearer signal visualization. Missing: motion layer, semantic highlights, diff overlay, esbuild patched release. Next: add Framer Motion scroll choreography and richer compass visuals.
- 2025-12-12 21:46:06 UTC - Added premium CTA tile in sections grid (double-height) with pricing, benefits, CTAs, disclaimer; parser test still passing. Done: promo tile. Missing: motion layer, semantic highlights, diff overlay, esbuild patch. Next: add Framer Motion scroll choreography and semantic hover interactions.
- 2025-12-12 21:50:51 UTC - Refined promo tile to span width (not height), centered copy, accent background, CTA text updated; parser test still passing. Done: improved CTA presentation. Missing: motion layer, semantic highlights, diff overlay, esbuild patch. Next: add Framer Motion scroll choreography and semantic hover interactions.
- 2025-12-12 21:58:48 UTC - Added static sample page (`/sample`) using Macro_Strategy_2025-12-12.txt: hero, snapshot copy, setups table, detail cards, and CTA back to main/subscription; parser test still passing. Done: sample experience. Missing: motion layer, semantic highlights, diff overlay, esbuild patch. Next: add Framer Motion scroll choreography and semantic hover interactions.

# Daily Setup Finder Site

## Local testing (ingest + latest)

Install deps first:
```
npm install
```

1) Start dev server: `npm run dev`
2) Trigger ingest (Vercel Cron equivalent):
   ```
   curl -X POST http://localhost:3000/api/webhook/ingest \
     -H "Authorization: Bearer $INGEST_SECRET"
   ```
3) Fetch latest (Redis-first, Supabase fallback):
   ```
   curl http://localhost:3000/api/latest
   ```

## Parser test

Run parser test against the fixture:
```
npm run test -- parser
```

## Notes
- `.env.local` carries the required env vars: Drive folder + service account (base64 JSON), `INGEST_SECRET`, Upstash Redis, Supabase service role.
- Retention: keep all reports (no pruning yet). PDF export deferred (not in MVP).

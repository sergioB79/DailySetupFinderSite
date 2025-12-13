import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const env = process.env;
  return NextResponse.json({
    hasPremiumSecret: Boolean(env.PREMIUM_INGEST_SECRET && env.PREMIUM_INGEST_SECRET.trim().length > 0),
    hasPremiumFolder: Boolean(env.GDRIVE_PREMIUM_FOLDER_ID && env.GDRIVE_PREMIUM_FOLDER_ID.trim().length > 0),
    hasServiceAccount: Boolean(env.GOOGLE_SERVICE_ACCOUNT_JSON_B64 && env.GOOGLE_SERVICE_ACCOUNT_JSON_B64.trim().length > 0),
    nodeEnv: env.NODE_ENV,
  });
}


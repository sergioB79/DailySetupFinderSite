import { NextResponse } from "next/server";
import { getEnv } from "@/lib/env";
import { fetchLatestDriveFile } from "@/lib/drive";
import { parseMarkdownToSnapshot } from "@/lib/parser";
import { diffSnapshots } from "@/lib/diff";
import { cachePremiumLatestSnapshot } from "@/lib/redis";
import { fetchLatestPremiumSnapshot, getSupabaseClient, storePremiumSnapshot } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const env = getEnv();
    const premiumSecret = env.PREMIUM_INGEST_SECRET ?? process.env.PREMIUM_INGEST_SECRET;
    const premiumFolder = env.GDRIVE_PREMIUM_FOLDER_ID ?? process.env.GDRIVE_PREMIUM_FOLDER_ID;

    if (!premiumSecret) {
      return new NextResponse("Premium ingest secret not configured", { status: 500 });
    }
    if (!premiumFolder) {
      return new NextResponse("Premium Drive folder not configured", { status: 500 });
    }

    const authHeader = req.headers.get("authorization");
    if (authHeader !== `Bearer ${premiumSecret}`) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { file, content } = await fetchLatestDriveFile(premiumFolder);
    const snapshot = await parseMarkdownToSnapshot(content, file.name);

    const supabase = getSupabaseClient();
    const prev = await fetchLatestPremiumSnapshot(supabase);
    const diff = diffSnapshots(prev?.snapshot ?? null, snapshot);

    await storePremiumSnapshot(supabase, snapshot, diff);
    try {
      await cachePremiumLatestSnapshot({ snapshot, diff });
    } catch (err) {
      console.warn("Premium Redis cache failed; continuing without cache", err);
    }

    return NextResponse.json({
      ok: true,
      source: { id: file.id, name: file.name, modifiedTime: file.modifiedTime },
      asOf: snapshot.asOf,
      diffStored: Boolean(diff),
    });
  } catch (err) {
    console.error("Premium ingest failed", err);
    return new NextResponse("Premium ingest failed", { status: 500 });
  }
}

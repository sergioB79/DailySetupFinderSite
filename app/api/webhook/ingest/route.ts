import { NextResponse } from "next/server";
import { getEnv } from "@/lib/env";
import { fetchLatestDriveFile } from "@/lib/drive";
import { parseMarkdownToSnapshot } from "@/lib/parser";
import { diffSnapshots } from "@/lib/diff";
import { cacheLatestSnapshot } from "@/lib/redis";
import { fetchLatestSnapshot, fetchPreviousSnapshot, getSupabaseClient, storeSnapshot } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const env = getEnv();
    const authHeader = req.headers.get("authorization");
    if (authHeader !== `Bearer ${env.INGEST_SECRET}`) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { file, content } = await fetchLatestDriveFile();
    const snapshot = await parseMarkdownToSnapshot(content, file.name);

    const supabase = getSupabaseClient();
    const prev = await fetchLatestSnapshot(supabase);
    const diff = diffSnapshots(prev?.snapshot ?? null, snapshot);

    await storeSnapshot(supabase, snapshot, diff);
    try {
      await cacheLatestSnapshot({ snapshot, diff });
    } catch (err) {
      console.warn("Redis cache failed; continuing without cache", err);
    }

    return NextResponse.json({
      ok: true,
      source: { id: file.id, name: file.name, modifiedTime: file.modifiedTime },
      asOf: snapshot.asOf,
      diffStored: Boolean(diff),
    });
  } catch (err) {
    console.error("Ingest failed", err);
    return new NextResponse("Ingest failed", { status: 500 });
  }
}

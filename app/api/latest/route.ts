import { NextResponse } from "next/server";
import { getCachedLatestSnapshot, cacheLatestSnapshot } from "@/lib/redis";
import { getSupabaseClient, fetchLatestSnapshot } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    try {
      const cached = await getCachedLatestSnapshot();
      if (cached) {
        return NextResponse.json({ source: "redis", ...cached });
      }
    } catch (err) {
      console.warn("Redis fetch failed; falling back to Supabase", err);
    }

    const supabase = getSupabaseClient();
    const latest = await fetchLatestSnapshot(supabase);
    if (!latest) {
      return new NextResponse("No snapshot found", { status: 404 });
    }

    const payload = { snapshot: latest.snapshot, diff: latest.record.diff_vs_previous ?? null };
    try {
      await cacheLatestSnapshot(payload);
    } catch (err) {
      console.warn("Redis cache failed; returning Supabase data", err);
    }

    return NextResponse.json({ source: "supabase", ...payload });
  } catch (err) {
    console.error("Fetch latest failed", err);
    return new NextResponse("Failed to load latest snapshot", { status: 500 });
  }
}

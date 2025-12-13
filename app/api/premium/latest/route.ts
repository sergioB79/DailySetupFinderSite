import { NextResponse } from "next/server";
import { cachePremiumLatestSnapshot, getCachedPremiumLatestSnapshot } from "@/lib/redis";
import { fetchLatestPremiumSnapshot, getSupabaseClient } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    try {
      const cached = await getCachedPremiumLatestSnapshot();
      if (cached) {
        return NextResponse.json({ source: "redis", ...cached });
      }
    } catch (err) {
      console.warn("Premium Redis fetch failed; falling back to Supabase", err);
    }

    const supabase = getSupabaseClient();
    const latest = await fetchLatestPremiumSnapshot(supabase);
    if (!latest) {
      return new NextResponse("No premium snapshot found", { status: 404 });
    }

    const payload = { snapshot: latest.snapshot, diff: latest.record.diff_vs_previous ?? null };
    try {
      await cachePremiumLatestSnapshot(payload);
    } catch (err) {
      console.warn("Premium Redis cache failed; returning Supabase data", err);
    }

    return NextResponse.json({ source: "supabase", ...payload });
  } catch (err) {
    console.error("Fetch premium latest failed", err);
    return new NextResponse("Failed to load premium snapshot", { status: 500 });
  }
}

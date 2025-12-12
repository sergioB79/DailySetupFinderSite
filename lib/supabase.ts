import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { getEnv } from "./env";
import { Snapshot } from "./parser";
import { SnapshotDiff } from "./diff";

export type SnapshotRecord = {
  id?: string;
  as_of: string;
  location?: string | null;
  title: string;
  sections: any;
  raw_markdown: string;
  source_file_name: string;
  diff_vs_previous?: any;
  created_at?: string;
};

export function getSupabaseClient(): SupabaseClient {
  const env = getEnv();
  return createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

export async function storeSnapshot(
  client: SupabaseClient,
  snapshot: Snapshot,
  diff: SnapshotDiff | null,
): Promise<SnapshotRecord> {
  const payload: SnapshotRecord = {
    as_of: snapshot.asOf,
    location: snapshot.location ?? null,
    title: snapshot.title,
    sections: snapshot.sections,
    raw_markdown: snapshot.rawMarkdown,
    source_file_name: snapshot.sourceFileName,
    diff_vs_previous: diff ?? null,
  };

  const { data, error } = await client
    .from<SnapshotRecord>("snapshots")
    .upsert(payload, { onConflict: "as_of" })
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
}

export async function fetchLatestSnapshot(
  client: SupabaseClient,
): Promise<{ record: SnapshotRecord; snapshot: Snapshot } | null> {
  const { data, error } = await client
    .from<SnapshotRecord>("snapshots")
    .select("*")
    .order("as_of", { ascending: false })
    .limit(1)
    .single();

  if (error && error.code !== "PGRST116") {
    throw error;
  }

  if (!data) return null;

  const snapshot: Snapshot = {
    asOf: data.as_of,
    location: data.location ?? undefined,
    title: data.title,
    sections: data.sections,
    rawMarkdown: data.raw_markdown,
    sourceFileName: data.source_file_name,
  };

  return { record: data, snapshot };
}

export async function fetchPreviousSnapshot(
  client: SupabaseClient,
): Promise<{ record: SnapshotRecord; snapshot: Snapshot } | null> {
  const { data, error } = await client
    .from<SnapshotRecord>("snapshots")
    .select("*")
    .order("as_of", { ascending: false })
    .range(1, 1)
    .single();

  if (error && error.code !== "PGRST116") {
    throw error;
  }

  if (!data) return null;

  const snapshot: Snapshot = {
    asOf: data.as_of,
    location: data.location ?? undefined,
    title: data.title,
    sections: data.sections,
    rawMarkdown: data.raw_markdown,
    sourceFileName: data.source_file_name,
  };

  return { record: data, snapshot };
}

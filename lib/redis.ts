import { getEnv } from "./env";
import { Snapshot } from "./parser";
import { SnapshotDiff } from "./diff";

type Cached = { snapshot: Snapshot; diff: SnapshotDiff | null };

async function redisCommand<T = any>(command: (string | number | boolean)[]): Promise<T> {
  const env = getEnv();
  if (!env.UPSTASH_REDIS_REST_URL || !env.UPSTASH_REDIS_REST_TOKEN) {
    throw new Error("Redis not configured");
  }
  const res = await fetch(`${env.UPSTASH_REDIS_REST_URL}/pipeline`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.UPSTASH_REDIS_REST_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ command }),
    cache: "no-store",
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Redis command failed: ${res.status} ${body}`);
  }

  const json = (await res.json()) as { result: T };
  return json.result;
}

export async function cacheLatestSnapshot(payload: Cached): Promise<void> {
  await redisCommand(["SET", "latest-snapshot", JSON.stringify(payload)]);
}

export async function getCachedLatestSnapshot(): Promise<Cached | null> {
  const result = await redisCommand<string | null>(["GET", "latest-snapshot"]);
  if (!result) return null;
  try {
    return JSON.parse(result) as Cached;
  } catch (err) {
    console.warn("Failed to parse cached snapshot", err);
    return null;
  }
}

export async function cachePremiumLatestSnapshot(payload: Cached): Promise<void> {
  await redisCommand(["SET", "premium:latest-snapshot", JSON.stringify(payload)]);
}

export async function getCachedPremiumLatestSnapshot(): Promise<Cached | null> {
  const result = await redisCommand<string | null>(["GET", "premium:latest-snapshot"]);
  if (!result) return null;
  try {
    return JSON.parse(result) as Cached;
  } catch (err) {
    console.warn("Failed to parse premium cached snapshot", err);
    return null;
  }
}

import { z } from "zod";

const stripQuotes = (value: unknown) => {
  if (typeof value !== "string") return undefined;
  const trimmed = value.trim().replace(/^['"]+|['"]+$/g, "");
  return trimmed.length ? trimmed : undefined;
};

const optionalUrl = z.preprocess(stripQuotes, z.string().url().optional());
const optionalString = z.preprocess(stripQuotes, z.string().min(1).optional());

const envSchema = z.object({
  GDRIVE_FOLDER_ID: z.string().min(1),
  GDRIVE_PREMIUM_FOLDER_ID: z.string().min(1).optional(),
  GOOGLE_SERVICE_ACCOUNT_JSON_B64: z.string().min(1),
  INGEST_SECRET: z.string().min(1),
  PREMIUM_INGEST_SECRET: z.string().min(1).optional(),
  SUPABASE_URL: z.string().url(),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1),
  UPSTASH_REDIS_REST_URL: optionalUrl,
  UPSTASH_REDIS_REST_TOKEN: optionalString,
});

export type Env = z.infer<typeof envSchema>;

let cachedEnv: Env | null = null;

export function getEnv(): Env {
  if (cachedEnv) return cachedEnv;

  const parsed = envSchema.parse({
    GDRIVE_FOLDER_ID: process.env.GDRIVE_FOLDER_ID,
    GDRIVE_PREMIUM_FOLDER_ID: process.env.GDRIVE_PREMIUM_FOLDER_ID,
    GOOGLE_SERVICE_ACCOUNT_JSON_B64: process.env.GOOGLE_SERVICE_ACCOUNT_JSON_B64,
    INGEST_SECRET: process.env.INGEST_SECRET,
    PREMIUM_INGEST_SECRET: process.env.PREMIUM_INGEST_SECRET,
    SUPABASE_URL: process.env.SUPABASE_URL,
    SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
    UPSTASH_REDIS_REST_URL: process.env.UPSTASH_REDIS_REST_URL,
    UPSTASH_REDIS_REST_TOKEN: process.env.UPSTASH_REDIS_REST_TOKEN,
  });

  cachedEnv = parsed;
  return parsed;
}

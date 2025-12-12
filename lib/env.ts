import { z } from "zod";

const envSchema = z.object({
  GDRIVE_FOLDER_ID: z.string().min(1),
  GOOGLE_SERVICE_ACCOUNT_JSON_B64: z.string().min(1),
  INGEST_SECRET: z.string().min(1),
  SUPABASE_URL: z.string().url(),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1),
  UPSTASH_REDIS_REST_URL: z.string().url(),
  UPSTASH_REDIS_REST_TOKEN: z.string().min(1),
});

export type Env = z.infer<typeof envSchema>;

let cachedEnv: Env | null = null;

export function getEnv(): Env {
  if (cachedEnv) return cachedEnv;

  const parsed = envSchema.parse({
    GDRIVE_FOLDER_ID: process.env.GDRIVE_FOLDER_ID,
    GOOGLE_SERVICE_ACCOUNT_JSON_B64: process.env.GOOGLE_SERVICE_ACCOUNT_JSON_B64,
    INGEST_SECRET: process.env.INGEST_SECRET,
    SUPABASE_URL: process.env.SUPABASE_URL,
    SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
    UPSTASH_REDIS_REST_URL: process.env.UPSTASH_REDIS_REST_URL,
    UPSTASH_REDIS_REST_TOKEN: process.env.UPSTASH_REDIS_REST_TOKEN,
  });

  cachedEnv = parsed;
  return parsed;
}

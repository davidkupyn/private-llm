import { drizzle } from "drizzle-orm/libsql";
import { sqliteTable, text } from "drizzle-orm/sqlite-core";

export const summaries = sqliteTable("summaries", {
  key: text("key").primaryKey(),
  url: text("url"),
  mimeType: text("mimeType"),
  summary: text("summary").notNull(),
  createdAt: text("createdAt").default("CURRENT_TIMESTAMP"),
});

export const db = drizzle({
  connection: {
    url: process.env.DATABASE_URL,
    authToken: process.env.DATABASE_AUTH_TOKEN,
  },
  schema: {
    summaries,
  },
});

export async function upsertSummary(params: {
  key: string;
  url?: string | null;
  mimeType?: string | null;
  summary: string;
}) {
  await db
    .insert(summaries)
    .values({
      key: params.key,
      url: params.url ?? null,
      mimeType: params.mimeType ?? null,
      summary: params.summary,
    })
    .onConflictDoUpdate({
      target: summaries.key,
      set: {
        url: params.url ?? null,
        mimeType: params.mimeType ?? null,
        summary: params.summary,
      },
    });
}

export async function getAllSummaryKeys(): Promise<string[]> {
  const rs = await db.select({ key: summaries.key }).from(summaries);
  return rs.map((r) => r.key);
}

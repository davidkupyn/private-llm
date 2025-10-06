import { utapi } from "@/lib/server/uploadthing";
import { getAllSummaryKeys, upsertSummary } from "@/lib/db";
import { summarizeUploadThingKey } from "@/lib/summarize";

export const maxDuration = 60;

export async function POST(req: Request) {
  // Sync endpoint: fetch all files, detect missing summaries, summarize and store
  const files = await utapi.listFiles();
  const existingKeys = new Set(await getAllSummaryKeys());

  const missing = files.files.filter((f: any) => !existingKeys.has(f.key));
  if (missing.length === 0) {
    return new Response(
      JSON.stringify({ synced: 0, message: "Already up to date" }),
      {
        status: 200,
        headers: { "content-type": "application/json" },
      }
    );
  }

  let synced = 0;
  for (const f of missing) {
    try {
      const { text, url } = await summarizeUploadThingKey({
        key: f.key,
        mimeType: (f as any).type,
      });
      await upsertSummary({
        key: f.key,
        url,
        mimeType: (f as any).type ?? null,
        summary: text,
      });
      synced += 1;
    } catch (err) {
      console.error("Failed to sync key", f.key, err);
    }
  }

  return new Response(JSON.stringify({ synced }), {
    status: 200,
    headers: { "content-type": "application/json" },
  });
}

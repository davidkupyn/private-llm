import { getAllSummaries } from "@/lib/db";

export default async function SummariesPage() {
  const items = await getAllSummaries();
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold tracking-tight">Knowledge Base</h1>
      <div className="grid gap-4">
        {items.length === 0 && (
          <p className="text-sm text-muted-foreground">
            No summaries yet. Upload a file to start.
          </p>
        )}
        {items.map((s) => (
          <article key={s.key} className="rounded-lg border p-4">
            <div className="flex items-center justify-between gap-4">
              <div className="space-y-1">
                <h2 className="text-base font-medium break-all">{s.key}</h2>
                {s.url && (
                  <a
                    href={s.url ?? undefined}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs underline text-muted-foreground"
                  >
                    View source
                  </a>
                )}
              </div>
              {s.mimeType && (
                <span className="text-xs text-muted-foreground">
                  {s.mimeType}
                </span>
              )}
            </div>
            <div className="mt-3 prose prose-sm max-w-none">
              <pre className="whitespace-pre-wrap text-sm leading-6">
                {s.summary}
              </pre>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

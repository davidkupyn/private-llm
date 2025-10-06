"use client";

import { useState, useTransition } from "react";
import { UploadButton } from "@/lib/uploadthing";

type Props = {
  onAnalyze: () => Promise<string>;
};

export default function UploadClient({ onAnalyze }: Props) {
  const [result, setResult] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  return (
    <div className="flex items-center gap-3">
      <UploadButton
        endpoint="imageUploader"
        onClientUploadComplete={async () => {
          startTransition(async () => {
            try {
              const text = await onAnalyze();
              setResult(text);
            } catch (err) {
              console.error(err);
              setResult("Failed to analyze file.");
            }
          });
        }}
        onUploadError={(error: Error) => {
          alert(`ERROR! ${error.message}`);
        }}
      />
      {isPending && (
        <span className="text-xs text-muted-foreground">Syncing…</span>
      )}
      {result && (
        <details className="text-xs">
          <summary className="cursor-pointer text-muted-foreground">
            Details
          </summary>
          <pre className="whitespace-pre-wrap text-xs bg-secondary text-secondary-foreground p-2 rounded mt-1 max-h-48 overflow-auto">
            {result}
          </pre>
        </details>
      )}
    </div>
  );
}

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
    <div className="flex flex-col items-center gap-4">
      <UploadButton
        endpoint="imageUploader"
        onClientUploadComplete={() => {
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
        <p className="text-sm text-gray-500">Analyzing last upload…</p>
      )}
      {result && (
        <pre className="whitespace-pre-wrap text-sm bg-gray-100 p-3 rounded">
          {result}
        </pre>
      )}
    </div>
  );
}


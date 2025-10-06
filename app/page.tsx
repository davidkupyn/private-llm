import UploadClient from "@/app/upload-client";
import { getAllSummaries } from "@/lib/db";

async function analyzeLastUploadedFile() {
  "use server";
  const res = await fetch("http://localhost:3001/api/index", {
    method: "POST",
  });
  if (!res.ok) {
    throw new Error(`Failed to analyze file: ${res.status}`);
  }
  const json = await res.json();
  return JSON.stringify(json, null, 2);
}

export default async function Home() {
  const summaries = await getAllSummaries();
  const formatTLDR = (summary: string) => {
    try {
      const jsonRegex = /```json\n([\s\S]*?)\n```/;
      const match = summary.match(jsonRegex);
      if (!match) {
        return summary;
      }
      const json = JSON.parse(match[1]);
      return json.TLDR;
    } catch (err) {
      console.error("Failed to parse summary:", err);
      return summary;
    }
  };
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <UploadClient onAnalyze={analyzeLastUploadedFile} />
      <h1 className="text-2xl font-bold">Summaries</h1>
      <pre className="whitespace-pre-wrap text-sm bg-gray-100 p-3 rounded">
        {JSON.stringify(summaries, null, 2)}
      </pre>
    </main>
  );
}

"use server";

import { POST as syncSummaries } from "@/app/api/index/route";

export async function analyzeLastUploadedFile(): Promise<string> {
  const response = await syncSummaries(
    new Request("http://internal/api/index", { method: "POST" })
  );
  if (!response.ok) {
    throw new Error(`Failed to analyze file: ${response.status}`);
  }
  const json = await response.json();
  return JSON.stringify(json, null, 2);
}

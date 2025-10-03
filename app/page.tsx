import UploadClient from "@/app/upload-client";

async function analyzeLastUploadedFile() {
  "use server";
  const res = await fetch("http://localhost:3002/api/index", {
    method: "POST",
  });
  if (!res.ok) {
    throw new Error(`Failed to analyze file: ${res.status}`);
  }
  const text = await res.text();
  return text;
}

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <UploadClient onAnalyze={analyzeLastUploadedFile} />
    </main>
  );
}

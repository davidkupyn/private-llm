import { utapi } from "@/lib/server/uploadthing";
import { google } from "@ai-sdk/google";
import { generateText } from "ai";

export const maxDuration = 30;

const FILE_URL = "https://ke1gzj4g07.ufs.sh/f/";

export async function POST(req: Request) {
  const files = await utapi.listFiles();

  // Use the most recently uploaded file
  const lastFile =
    files.files.slice().sort((a: any, b: any) => {
      const aTime = (a as any).uploadedAt ?? (a as any).createdAt ?? 0;
      const bTime = (b as any).uploadedAt ?? (b as any).createdAt ?? 0;
      return bTime - aTime;
    })[0] ?? files.files[files.files.length - 1];

  if (!lastFile) {
    return new Response("No files found", { status: 404 });
  }

  const fileUrl = `${FILE_URL}${lastFile.key}`;
  console.log(fileUrl);
  const fileData = await fetch(fileUrl);
  const fileBuffer = await fileData.arrayBuffer();
  const fileBufferString = Buffer.from(fileBuffer).toString("base64");

  console.log(files);
  const result = await generateText({
    model: google("gemini-2.5-flash"),
    messages: [
      {
        role: "user",
        content: [
          {
            type: "text",
            text: "What is in the file?",
          },
          {
            type: "file",
            data: fileBufferString,
            mediaType: "application/pdf",
          },
        ],
      },
    ],
  });
  console.log(result);
  return new Response(result.text);
}

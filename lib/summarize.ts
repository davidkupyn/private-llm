import { google } from "@ai-sdk/google";
import { generateText } from "ai";

const FILE_URL_PREFIX = "https://ke1gzj4g07.ufs.sh/f/";

export async function summarizeUploadThingKey(params: {
  key: string;
  mimeType?: string | null;
}) {
  const fileUrl = `${FILE_URL_PREFIX}${params.key}`;
  const fileData = await fetch(fileUrl);
  if (!fileData.ok) throw new Error(`Failed to fetch file: ${fileUrl}`);
  const fileBuffer = await fileData.arrayBuffer();
  const fileBufferString = Buffer.from(fileBuffer).toString("base64");

  const mediaType = params.mimeType ?? "application/pdf";

  const result = await generateText({
    model: google("gemini-2.5-flash"),
    messages: [
      {
        role: "user",
        content: [
          {
            type: "text",
            text: "What is in the file? Summarize with bullet points. Also include a TLDR, output in json format.",
          },
          {
            type: "file",
            data: fileBufferString,
            mediaType,
          },
        ],
      },
    ],
  });

  return { text: result.text, url: fileUrl };
}

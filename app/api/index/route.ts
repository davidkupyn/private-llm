import { utapi } from "@/lib/server/uploadthing";
import { google } from "@ai-sdk/google";
import { generateText } from "ai";

export const maxDuration = 30;

const FILE_URL = "https://ke1gzj4g07.ufs.sh/f/";

export async function POST(req: Request) {
  const files = await utapi.listFiles();

  const file = files.files[0];
  const fileUrl = `${FILE_URL}${file.key}`;
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

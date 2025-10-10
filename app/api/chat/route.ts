import { getAllSummaries } from "@/lib/db";
import { google } from "@ai-sdk/google";
import { streamText, UIMessage, convertToModelMessages } from "ai";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  const {
    messages,
    airplaneMode,
  }: { messages: UIMessage[]; airplaneMode: boolean } = await req.json();

  console.log("airplaneMode", airplaneMode);

  const NORMAL_MODE_SYSTEM_PROMPT =
    "You are a helpful assistant that can answer questions and help with tasks. Prioritize information from the given context, it is more important and more accurate. You can use external sources if you need to, here are the summaries of your knowledge:";

  const AIRPLANE_MODE_SYSTEM_PROMPT =
    "You are a helpful assistant that can answer questions and help with tasks. Only use information from the given context. Dont ever use any information from external sources, if you dont know or dont have the context, answer 'idk' and nothing else, here are the summaries of your knowledge:";

  const summaries = await getAllSummaries();

  const result = streamText({
    model: google("gemini-2.5-flash"),
    messages: [
      {
        role: "system",
        content: airplaneMode
          ? AIRPLANE_MODE_SYSTEM_PROMPT
          : NORMAL_MODE_SYSTEM_PROMPT,
      },
      {
        role: "system",
        content: summaries.map((s) => s.summary).join("\n"),
      },
      ...convertToModelMessages(messages),
    ],
  });

  return result.toUIMessageStreamResponse();
}

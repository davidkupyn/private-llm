import { getAllSummaries } from "@/lib/db";
import { google } from "@ai-sdk/google";
import { streamText, UIMessage, convertToModelMessages } from "ai";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json();
  const summaries = await getAllSummaries();
  const result = streamText({
    model: google("gemini-2.5-flash"),
    messages: [
      {
        role: "system",
        content:
          "You are a helpful assistant that can answer questions and help with tasks. Only use information from the given context. Dont ever use any information from external sources, if you dont know or dont have the context, answer 'idk' and nothing else, here are the summaries of your knowledge:",
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

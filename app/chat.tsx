"use client";

import { useChat } from "@ai-sdk/react";
import { useEffect, useRef, useState } from "react";
import { Send } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export default function Chat() {
  const [input, setInput] = useState("");
  const { messages, sendMessage } = useChat();
  const bottomRef = useRef<HTMLDivElement>(null);
  const [isSending, setIsSending] = useState(false);
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);
  return (
    <div className="flex flex-col w-full max-w-2xl mx-auto">
      <div className="flex flex-col gap-4 pb-24">
        {messages.map((message) => (
          <div key={message.id} className="flex">
            <div
              className={
                message.role === "user"
                  ? "ml-auto max-w-[80%] rounded-lg bg-primary text-primary-foreground px-4 py-2 shadow"
                  : "mr-auto max-w-[80%] rounded-lg bg-secondary text-secondary-foreground px-4 py-2 shadow"
              }
            >
              {message.parts.map((part, i) => {
                switch (part.type) {
                  case "text":
                    return (
                      <div
                        key={`${message.id}-${i}`}
                        className="prose prose-sm max-w-none"
                      >
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                          {part.text}
                        </ReactMarkdown>
                      </div>
                    );
                }
              })}
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      <form
        onSubmit={async (e) => {
          e.preventDefault();
          if (!input.trim() || isSending) return;
          setIsSending(true);
          try {
            await sendMessage({ text: input });
            setInput("");
          } finally {
            setIsSending(false);
          }
        }}
        className="fixed inset-x-0 bottom-0 border-t bg-background/80 backdrop-blur"
      >
        <div className="mx-auto max-w-2xl px-4 py-3">
          <div className="flex items-center gap-2">
            <input
              className="flex-1 h-11 rounded-md disabled:opacity-50 border px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              value={input}
              disabled={isSending}
              placeholder="Ask anything from your knowledge..."
              onChange={(e) => setInput(e.currentTarget.value)}
            />
            <button
              type="submit"
              disabled={!input.trim() || isSending}
              className="inline-flex h-11 items-center gap-2 rounded-md bg-primary px-3 text-sm font-medium text-primary-foreground disabled:opacity-50"
            >
              <Send className="h-4 w-4" />
              Send
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

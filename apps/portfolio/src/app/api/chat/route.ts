import Anthropic from "@anthropic-ai/sdk";
import { NextRequest } from "next/server";
import { CHATBOT_CONTEXT } from "@/content/chatbot-context";

const client = new Anthropic();

type Message = {
  role: "user" | "assistant";
  content: string;
};

export async function POST(req: NextRequest) {
  const { message, history = [] } = (await req.json()) as {
    message: string;
    history: Message[];
  };

  const messages: Message[] = [...history, { role: "user", content: message }];

  const stream = await client.messages.stream({
    model: "claude-sonnet-4-6",
    max_tokens: 1024,
    system: CHATBOT_CONTEXT,
    messages,
  });

  const readable = new ReadableStream({
    async start(controller) {
      for await (const chunk of stream) {
        if (
          chunk.type === "content_block_delta" &&
          chunk.delta.type === "text_delta"
        ) {
          controller.enqueue(new TextEncoder().encode(chunk.delta.text));
        }
      }
      controller.close();
    },
  });

  return new Response(readable, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}

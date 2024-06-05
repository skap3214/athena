import { NextRequest, NextResponse } from "next/server";
import { chatStreaming, updateGraphStreaming } from "../../actions/graph";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { question, type } = body;

  try {
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        try {
          for await (const output of chatStreaming(question, type)) {
            const chunk = encoder.encode(JSON.stringify(output) + "\n");
            controller.enqueue(chunk);
          }
          controller.close();
        } catch (error) {
          controller.error(error);
        }
      },
    });

    return new NextResponse(stream, {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new NextResponse(JSON.stringify({ error: error }), {
      status: 400,
    });
  }
}

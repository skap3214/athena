import { NextRequest, NextResponse } from "next/server";
import { updateGraphStreaming } from "../actions/streaming";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { text, url, file } = body;

  try {
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        try {
          for await (const graphData of updateGraphStreaming(text, url, file)) {
            const chunk = encoder.encode(JSON.stringify(graphData) + "\n");
            controller.enqueue(chunk);
          }
          controller.close();
        } catch (error) {
          controller.error(error);
        }
      }
    });

    return new NextResponse(stream, {
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    return new NextResponse(JSON.stringify({ error: error.message }), { status: 400 });
  }
}

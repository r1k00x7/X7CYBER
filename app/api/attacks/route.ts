import { makeEvent } from '@/lib/generator';

// Stream simulated attack events using Server-Sent Events.
// Edge runtime keeps the streaming response un-buffered so events reach the
// client immediately on Vercel (the Node runtime buffers and breaks SSE).
export const dynamic = 'force-dynamic';
export const runtime = 'edge';

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export async function GET(request: Request) {
  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      const send = (data: unknown) => {
        controller.enqueue(
          encoder.encode(`data: ${JSON.stringify(data)}\n\n`)
        );
      };

      // Initial burst so the map populates immediately.
      for (let i = 0; i < 8; i += 1) send(makeEvent());

      const start = Date.now();
      try {
        // Bounded window; EventSource auto-reconnects when it ends.
        while (Date.now() - start < 55000) {
          await sleep(700);
          const batch = 1 + Math.floor(Math.random() * 2);
          for (let i = 0; i < batch; i += 1) send(makeEvent());
        }
      } catch {
        // client disconnected
      } finally {
        try {
          controller.close();
        } catch {
          // already closed
        }
      }
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream; charset=utf-8',
      'Cache-Control': 'no-cache, no-transform',
      Connection: 'keep-alive',
      'X-Accel-Buffering': 'no',
    },
  });
}

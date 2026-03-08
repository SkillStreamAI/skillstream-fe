import { NextResponse } from 'next/server';

// Extend Vercel function timeout — Strands agent makes multiple Bedrock
// calls and can take up to 120s. Default is 10s (hobby) / 60s (pro).
export const maxDuration = 120;

const TRENDS_AGENT_URL = process.env.NEXT_PUBLIC_LAMBDA_TRENDS_AGENT_URL ?? '';

export async function POST(req: Request) {
  if (!TRENDS_AGENT_URL) {
    return NextResponse.json(
      { error: 'NEXT_PUBLIC_LAMBDA_TRENDS_AGENT_URL is not configured', suggestions: [] },
      { status: 500 }
    );
  }

  const body = await req.json();
  const res = await fetch(TRENDS_AGENT_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
    // Allow up to 120s — the Strands agent makes multiple Bedrock calls
    signal: AbortSignal.timeout(125_000),
  });

  const contentType = res.headers.get('Content-Type') ?? '';
  if (!contentType.includes('application/json')) {
    const text = await res.text();
    console.error('Trends Lambda returned non-JSON:', res.status, text.slice(0, 300));
    return NextResponse.json(
      { error: `Lambda error (${res.status}): ${text.slice(0, 200)}`, suggestions: [] },
      { status: 502 }
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const data: any = await res.json();

  // Unwrap Lambda envelope: {statusCode, headers, body: "<json string>"}
  if (data?.body !== undefined) {
    const payload = typeof data.body === 'string' ? JSON.parse(data.body) : data.body;
    return NextResponse.json(payload, { status: res.status });
  }

  return NextResponse.json(data, { status: res.status });
}

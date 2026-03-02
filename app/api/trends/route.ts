import { NextResponse } from 'next/server';

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

  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}

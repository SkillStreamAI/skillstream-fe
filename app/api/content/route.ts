import { NextResponse } from 'next/server';

const LAMBDA_URL = process.env.NEXT_PUBLIC_LAMBDA_CONTENT_URL ?? '';

export async function GET() {
  if (!LAMBDA_URL) {
    return NextResponse.json(
      { error: 'NEXT_PUBLIC_LAMBDA_CONTENT_URL is not configured' },
      { status: 500 }
    );
  }

  const res = await fetch(LAMBDA_URL, { cache: 'no-store' });
  const data = await res.json();

  return NextResponse.json(data, { status: res.status });
}

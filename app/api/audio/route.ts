/**
 * GET /api/audio?url=<encoded-s3-url>
 *
 * Server-side proxy for S3 audio files. Bypasses browser CORS restrictions —
 * the fetch happens from the Next.js server, not the browser. Forwards Range
 * headers so audio seeking works correctly.
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const audioUrl = searchParams.get('url');

  if (!audioUrl) {
    return new Response('Missing url parameter', { status: 400 });
  }

  // Forward Range header from browser so seeking works
  const rangeHeader = request.headers.get('Range');
  const fetchHeaders: HeadersInit = rangeHeader ? { Range: rangeHeader } : {};

  let s3Res: Response;
  try {
    s3Res = await fetch(audioUrl, { headers: fetchHeaders, cache: 'no-store' });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return new Response(`Failed to fetch audio: ${msg}`, { status: 502 });
  }

  if (!s3Res.ok && s3Res.status !== 206) {
    return new Response(`S3 returned ${s3Res.status}`, { status: s3Res.status });
  }

  const headers = new Headers({
    'Content-Type': s3Res.headers.get('Content-Type') ?? 'audio/mpeg',
    'Cache-Control': 'public, max-age=3600',
    'Accept-Ranges': 'bytes',
  });

  // Forward range-related headers so the browser can seek
  const contentRange = s3Res.headers.get('Content-Range');
  const contentLength = s3Res.headers.get('Content-Length');
  if (contentRange) headers.set('Content-Range', contentRange);
  if (contentLength) headers.set('Content-Length', contentLength);

  return new Response(s3Res.body, { status: s3Res.status, headers });
}

import type {
  GenerateRoadmapResponse,
  EpisodesResponse,
  ProgressData,
  TrackProgressResponse,
} from '@/lib/types';

// ── Generic fetch helpers ─────────────────────────────────────

async function lambdaPost<TBody, TResponse>(
  url: string,
  body: TBody
): Promise<TResponse> {
  if (!url) throw new Error('Lambda URL not configured');
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const msg = await res.text();
    throw new Error(`Lambda POST failed (${res.status}): ${msg}`);
  }
  return res.json() as Promise<TResponse>;
}

async function lambdaGet<TResponse>(url: string): Promise<TResponse> {
  if (!url) throw new Error('Lambda URL not configured');
  const res = await fetch(url, { cache: 'no-store' });
  if (!res.ok) {
    const msg = await res.text();
    throw new Error(`Lambda GET failed (${res.status}): ${msg}`);
  }
  return res.json() as Promise<TResponse>;
}

// ── Public API ────────────────────────────────────────────────

/**
 * POST {topic} → {roadmapId, title, nodes[]}
 * Lambda generates a hierarchical syllabus via Amazon Bedrock.
 */
export async function generateRoadmap(
  topic: string
): Promise<GenerateRoadmapResponse> {
  const url = process.env.NEXT_PUBLIC_LAMBDA_GENERATE_ROADMAP_URL ?? '';
  return lambdaPost<{ topic: string }, GenerateRoadmapResponse>(url, { topic });
}

/**
 * GET → {episodes[]}
 * Returns all available podcast episodes from S3/DynamoDB.
 */
export async function getEpisodes(): Promise<EpisodesResponse> {
  const url = process.env.NEXT_PUBLIC_LAMBDA_GET_EPISODES_URL ?? '';
  return lambdaGet<EpisodesResponse>(url);
}

/**
 * GET ?userId=x → {completedEpisodes[], savedRoadmaps[]}
 * Fetches user progress from DynamoDB.
 */
export async function getProgress(userId: string): Promise<ProgressData> {
  const url = process.env.NEXT_PUBLIC_LAMBDA_GET_PROGRESS_URL ?? '';
  return lambdaGet<ProgressData>(
    `${url}?userId=${encodeURIComponent(userId)}`
  );
}

/**
 * POST {episodeId, completed} → {success}
 * Tracks episode completion in DynamoDB.
 */
export async function trackProgress(
  episodeId: string,
  completed: boolean
): Promise<TrackProgressResponse> {
  const url = process.env.NEXT_PUBLIC_LAMBDA_TRACK_PROGRESS_URL ?? '';
  return lambdaPost<{ episodeId: string; completed: boolean }, TrackProgressResponse>(
    url,
    { episodeId, completed }
  );
}

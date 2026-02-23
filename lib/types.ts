export type Level = 'foundational' | 'intermediate' | 'advanced' | 'expert';

export interface RoadmapNode {
  id: string;
  title: string;
  description: string;
  level: Level;
  durationMin: number;
  audioUrl?: string;
}

export interface Roadmap {
  roadmapId: string;
  title: string;
  topic: string;
  nodes: RoadmapNode[];
  createdAt: string;
}

export interface Episode {
  id: string;
  title: string;
  topic: string;
  level: string;
  durationMin: number;
  audioUrl: string;
  createdAt: string;
  // Fields from the Content Lambda
  overview?: string;
  status?: string;
}

// ── Raw shapes returned by the Content Lambda ─────────────────

export interface ContentEpisode {
  id: string;
  title: string;
  overview: string;
  audio_url: string | null;
  status: string;
}

export interface ContentRoadmap {
  id: string;
  topic: string;
  title: string;
  description: string;
  episodes: ContentEpisode[];
}

export interface User {
  id: string;
  email: string;
  name: string;
}

export interface ProgressData {
  completedEpisodes: string[];
  savedRoadmaps: string[];
}

export interface GenerateRoadmapResponse {
  roadmapId: string;
  title: string;
  nodes: RoadmapNode[];
}

export interface EpisodesResponse {
  episodes: Episode[];
}

export interface TrackProgressRequest {
  episodeId: string;
  completed: boolean;
}

export interface TrackProgressResponse {
  success: boolean;
}

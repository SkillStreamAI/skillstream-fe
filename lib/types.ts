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

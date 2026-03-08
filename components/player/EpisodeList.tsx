'use client';
import type { Episode } from '@/lib/types';

interface CourseGroup {
  id: string;
  title: string;
  topic: string;
  episodes: Episode[];
}

interface EpisodeListProps {
  courses: CourseGroup[];
  currentId: string | null;
  onSelect: (episode: Episode) => void;
}

export type { CourseGroup };

export function EpisodeList({ courses, currentId, onSelect }: Readonly<EpisodeListProps>) {
  const totalEpisodes = courses.reduce((sum, c) => sum + c.episodes.length, 0);

  if (totalEpisodes === 0) {
    return (
      <div className="flex h-full items-center justify-center text-sm text-[#52525b]">
        No episodes available yet.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {courses.map((course) => (
        <div key={course.id} className="rounded-xl border border-[#2a2a2a] bg-[#0d0d0d] overflow-hidden">
          {/* Course header */}
          <div className="px-4 py-3 border-b border-[#2a2a2a] bg-[linear-gradient(135deg,#7c3aed0a,#2563eb0a)]">
            <p className="text-xs font-semibold uppercase tracking-widest text-[#7c3aed]">
              {course.topic}
            </p>
            <p className="mt-0.5 text-sm font-medium text-white leading-snug">{course.title}</p>
            <p className="mt-0.5 text-xs text-[#52525b]">{course.episodes.length} episode{course.episodes.length === 1 ? '' : 's'}</p>
          </div>

          {/* Episodes */}
          <div className="flex flex-col gap-0.5 p-2">
            {course.episodes.map((ep, idx) => (
              <button
                key={ep.id}
                onClick={() => onSelect(ep)}
                className={[
                  'w-full rounded-lg px-3 py-2.5 text-left transition-all cursor-pointer flex items-start gap-3',
                  currentId === ep.id
                    ? 'bg-[linear-gradient(135deg,#7c3aed22,#2563eb22)] border border-[#7c3aed]/40 text-white'
                    : 'border border-transparent text-[#a1a1aa] hover:bg-[#1a1a1a] hover:text-white',
                ].join(' ')}
              >
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#1a1a1a] text-[10px] font-bold text-[#52525b]">
                  {idx + 1}
                </span>
                <p className="text-sm font-medium leading-snug line-clamp-2">{ep.title}</p>
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

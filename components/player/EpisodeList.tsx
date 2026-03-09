'use client';
import { useState, useEffect } from 'react';
import type { Episode } from '@/lib/types';

export interface CourseGroup {
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

function ChevronIcon({ open }: Readonly<{ open: boolean }>) {
  return (
    <svg
      width="14" height="14" viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth="2.5"
      strokeLinecap="round" strokeLinejoin="round"
      style={{ transition: 'transform 0.25s ease', transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }}
    >
      <path d="M6 9l6 6 6-6" />
    </svg>
  );
}

function PlayingBars() {
  return (
    <>
      <style>{`
        @keyframes playing-bar {
          from { transform: scaleY(0.3); }
          to   { transform: scaleY(1); }
        }
      `}</style>
      <span className="flex items-end gap-px h-3.5 shrink-0">
        {(['bar-s', 'bar-m', 'bar-l'] as const).map((id, i) => (
          <span
            key={id}
            className="w-0.5 rounded-full bg-[#e8a020]"
            style={{
              height: `${[9, 15, 12][i]}px`,
              animation: `playing-bar 0.8s ease-in-out ${i * 0.15}s infinite alternate`,
            }}
          />
        ))}
      </span>
    </>
  );
}

export function EpisodeList({ courses, currentId, onSelect }: Readonly<EpisodeListProps>) {
  const [openIds, setOpenIds] = useState<Set<string>>(() => {
    const s = new Set<string>();
    if (courses.length > 0) s.add(courses[0].id);
    return s;
  });

  useEffect(() => {
    if (!currentId) return;
    for (const course of courses) {
      if (course.episodes.some((e) => e.id === currentId)) {
        setOpenIds((prev) => new Set([...prev, course.id]));
        break;
      }
    }
  }, [currentId, courses]);

  const toggleCourse = (id: string) => {
    setOpenIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  if (courses.length === 0) {
    return (
      <div className="flex h-full items-center justify-center text-sm text-[#5a5450]">
        No episodes available yet.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {courses.map((course, courseIdx) => {
        const isOpen    = openIds.has(course.id);
        const hasActive = course.episodes.some((e) => e.id === currentId);

        return (
          <div
            key={course.id}
            className={`card-fade-in overflow-hidden transition-shadow duration-300 rounded-2xl ${
              hasActive
                ? 'gradient-border-animated glow-active'
                : 'gradient-border'
            }`}
            style={{ animationDelay: `${courseIdx * 60}ms` }}
          >
            {/* Course header */}
            <button
              onClick={() => toggleCourse(course.id)}
              className="w-full rounded-2xl bg-[#161414] px-4 py-4 text-left transition-colors hover:bg-[#1e1c1c] cursor-pointer"
            >
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <span className="mb-1.5 inline-flex items-center gap-1.5 rounded-full border border-[#e8a020]/25 bg-[#e8a020]/8 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-[#e8a020]">
                    <span className="h-1 w-1 rounded-full bg-[#e8a020]" />
                    {course.topic}
                  </span>
                  <p className="text-sm font-semibold text-[#f5f0eb] leading-snug line-clamp-2">
                    {course.title}
                  </p>
                  <p className="mt-0.5 text-xs text-[#5a5450]">
                    {course.episodes.length} episode{course.episodes.length === 1 ? '' : 's'}
                    {hasActive && <span className="ml-2 text-[#e8a020]">· Now Playing</span>}
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-2 text-[#5a5450]">
                  {hasActive && <PlayingBars />}
                  <ChevronIcon open={isOpen} />
                </div>
              </div>
            </button>

            {/* Episode rows */}
            {isOpen && (
              <div className="bg-[#111010] px-2 pb-2">
                <div className="flex flex-col gap-0.5">
                  {course.episodes.map((ep, idx) => {
                    const active = ep.id === currentId;
                    return (
                      <button
                        key={ep.id}
                        onClick={() => onSelect(ep)}
                        className={`group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-all cursor-pointer ${
                          active
                            ? 'bg-[#e8a020]/8 border border-[#e8a020]/25'
                            : 'border border-transparent hover:bg-[#1e1c1c] hover:border-[#2c2828]'
                        }`}
                      >
                        <span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[10px] font-bold transition-colors ${
                          active
                            ? 'bg-[#e8a020] text-black'
                            : 'bg-[#1e1c1c] text-[#5a5450] group-hover:bg-[#2c2828] group-hover:text-[#9e9792]'
                        }`}>
                          {active ? '♪' : idx + 1}
                        </span>
                        <p className={`flex-1 text-sm leading-snug line-clamp-2 transition-colors ${
                          active ? 'font-medium text-[#f5f0eb]' : 'text-[#9e9792] group-hover:text-[#f5f0eb]'
                        }`}>
                          {ep.title}
                        </p>
                        {!active && (
                          <svg className="h-3.5 w-3.5 shrink-0 text-[#5a5450] opacity-0 group-hover:opacity-100 transition-opacity" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M8 5v14l11-7z" />
                          </svg>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

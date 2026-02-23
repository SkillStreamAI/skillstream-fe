'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [savedCount, setSavedCount] = useState(0);

  // Auth guard — redirect when not logged in
  useEffect(() => {
    if (!loading && !user) {
      router.replace('/login');
    }
  }, [user, loading, router]);

  // Read saved roadmap count from localStorage
  useEffect(() => {
    if (!user) return;
    try {
      const raw = localStorage.getItem('skillstream_roadmaps');
      if (raw) setSavedCount((JSON.parse(raw) as string[]).length);
    } catch {
      // ignore
    }
  }, [user]);

  // Show spinner while auth hydrates or before redirect
  if (loading || !user) {
    return (
      <div className="flex min-h-[calc(100vh-64px)] items-center justify-center">
        <div
          className="h-10 w-10 rounded-full border-4 border-[#2a2a2a] border-t-[#7c3aed]"
          style={{ animation: 'spin 0.8s linear infinite' }}
        />
      </div>
    );
  }

  const stats = [
    { label: 'Saved Roadmaps',    value: savedCount },
    { label: 'Episodes Completed', value: 0 },
    { label: 'Hours Learned',     value: 0 },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Greeting */}
      <div className="mb-10">
        <p className="text-sm text-[#a1a1aa]">Welcome back,</p>
        <h1 className="text-3xl font-bold text-white">
          <span className="gradient-text">{user.name}</span>
        </h1>
        <p className="mt-1 text-sm text-[#52525b]">{user.email}</p>
      </div>

      {/* Stats */}
      <div className="mb-10 grid gap-4 sm:grid-cols-3">
        {stats.map((s) => (
          <Card key={s.label} glowBorder className="text-center py-8">
            <p className="text-4xl font-extrabold gradient-text">{s.value}</p>
            <p className="mt-2 text-sm text-[#a1a1aa]">{s.label}</p>
          </Card>
        ))}
      </div>

      {/* Quick actions */}
      <div className="mb-10 grid gap-4 sm:grid-cols-2">
        <Card glowBorder>
          <h2 className="mb-2 text-lg font-semibold text-white">
            Generate a new roadmap
          </h2>
          <p className="mb-5 text-sm text-[#a1a1aa]">
            Pick a new topic and get a structured learning path in seconds.
          </p>
          <Link href="/generator">
            <Button>Go to Generator</Button>
          </Link>
        </Card>

        <Card glowBorder>
          <h2 className="mb-2 text-lg font-semibold text-white">
            Continue listening
          </h2>
          <p className="mb-5 text-sm text-[#a1a1aa]">
            Pick up where you left off or explore new podcast episodes.
          </p>
          <Link href="/player">
            <Button variant="outline">Open Player</Button>
          </Link>
        </Card>
      </div>

      {/* About this dashboard */}
      <div className="rounded-xl border border-[#2a2a2a] bg-[#111] p-6">
        <h3 className="mb-2 text-sm font-semibold text-white">
          Progress sync coming soon
        </h3>
        <p className="text-sm text-[#52525b]">
          Episode completions and saved roadmaps will sync to DynamoDB via AWS Lambda
          once the backend endpoints are connected. Your data is stored locally for now.
        </p>
      </div>
    </div>
  );
}

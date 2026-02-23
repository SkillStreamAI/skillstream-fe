'use client';
import { useState, type FormEvent } from 'react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

const SUGGESTIONS = [
  'Machine Learning',
  'AWS Lambda',
  'React Performance',
  'DevOps',
  'AI Engineering',
  'Kubernetes',
];

interface TopicInputProps {
  onSubmit: (topic: string) => Promise<void>;
  loading: boolean;
}

export function TopicInput({ onSubmit, loading }: TopicInputProps) {
  const [topic, setTopic] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (topic.trim()) onSubmit(topic.trim());
  };

  return (
    <div className="flex flex-col gap-4">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-3 sm:flex-row sm:items-end"
      >
        <div className="flex-1">
          <Input
            label="What do you want to learn?"
            placeholder="e.g. Machine Learning, AWS Lambda, React Performance…"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            disabled={loading}
          />
        </div>
        <Button
          type="submit"
          size="lg"
          loading={loading}
          disabled={!topic.trim()}
        >
          Generate Roadmap
        </Button>
      </form>

      {/* Quick suggestion chips */}
      <div className="flex flex-wrap gap-2">
        {SUGGESTIONS.map((s) => (
          <button
            key={s}
            type="button"
            disabled={loading}
            onClick={() => setTopic(s)}
            className="rounded-full border border-[#2a2a2a] bg-[#111] px-3 py-1 text-xs text-[#a1a1aa]
              hover:border-[#7c3aed] hover:text-white transition-colors cursor-pointer
              disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {s}
          </button>
        ))}
      </div>
    </div>
  );
}

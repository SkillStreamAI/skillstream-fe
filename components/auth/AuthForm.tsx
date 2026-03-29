'use client';
import { useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useAuth } from '@/lib/auth-context';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

export function AuthForm() {
  const [mode, setMode]         = useState<'signin' | 'signup'>('signin');
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [name, setName]         = useState('');
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);

  const { login, signup } = useAuth();
  const router = useRouter();
  const t = useTranslations('auth');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email || !password) {
      setError(t('errorEmptyFields'));
      return;
    }
    setLoading(true);
    try {
      if (mode === 'signin') {
        await login(email, password);
      } else {
        await signup(email, password, name || undefined);
      }
      router.push('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : t('errorGeneric'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-panel p-8">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-[var(--text-1)]">
          {mode === 'signin' ? t('signInTitle') : t('signUpTitle')}
        </h2>
        <p className="mt-1 text-sm text-[var(--text-2)]">
          {mode === 'signin' ? t('signInSubtitle') : t('signUpSubtitle')}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {mode === 'signup' && (
          <Input
            label={t('nameLabel')}
            type="text"
            placeholder={t('namePlaceholder')}
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={loading}
          />
        )}
        <Input
          label={t('emailLabel')}
          type="email"
          placeholder={t('emailPlaceholder')}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={loading}
        />
        <Input
          label={t('passwordLabel')}
          type="password"
          placeholder={t('passwordPlaceholder')}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={loading}
        />

        {error && (
          <div className="rounded-lg bg-red-950/40 px-3 py-2 text-sm text-red-400">
            {error}
          </div>
        )}

        <Button type="submit" size="lg" loading={loading} className="mt-2 w-full">
          {mode === 'signin' ? t('signInButton') : t('signUpButton')}
        </Button>
      </form>

      <p className="mt-5 text-center text-sm text-[var(--text-2)]">
        {mode === 'signin' ? t('signUpPrompt') : t('signInPrompt')}
        <button
          type="button"
          className="font-medium text-[var(--amber)] hover:brightness-110 transition-colors cursor-pointer"
          onClick={() => {
            setMode(mode === 'signin' ? 'signup' : 'signin');
            setError('');
          }}
        >
          {mode === 'signin' ? t('signUpLink') : t('signInLink')}
        </button>
      </p>
    </div>
  );
}

import { AuthForm } from '@/components/auth/AuthForm';

export const metadata = {
  title: 'Sign In — SkillStream AI',
};

export default function LoginPage() {
  return (
    <div className="flex min-h-[calc(100vh-64px)] items-center justify-center px-4 py-16">
      <div className="w-full max-w-md">
        <AuthForm />
      </div>
    </div>
  );
}

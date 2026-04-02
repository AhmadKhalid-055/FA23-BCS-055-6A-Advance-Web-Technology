'use client';

import Link from 'next/link';
import { Button, Card, Input, Spinner } from '@/components/ui';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/store/auth';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { setAuth } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, name }),
      });

      const data = await res.json();

      if (!data.success) {
        setError(data.error || 'Registration failed');
        return;
      }

      setAuth(data.data.user, data.data.token);
      router.push('/dashboard/client');
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMsg);
      console.error('Registration error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative mx-auto max-w-md px-4 py-24 flex flex-col items-center justify-center min-h-[90vh] animate-fade-in text-foreground">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px] -z-10" />
      
      <div className="text-center mb-10 space-y-2">
        <h1 className="text-4xl font-black tracking-tighter text-foreground">Create Account</h1>
        <p className="text-foreground/60 font-bold italic tracking-tight">Join the elite AdFlow Pro network</p>
      </div>

      <Card className="w-full p-10 bg-white border-border shadow-2xl relative overflow-hidden group">
        <div className="absolute top-0 left-0 w-full h-1.5 bg-primary opacity-80" />
        
        {error && (
          <div className="mb-6 rounded-xl bg-destructive/5 border border-destructive/20 p-4 text-destructive text-sm font-black flex items-center gap-3 animate-in slide-in-from-top-2 duration-300">
            <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
          <Input
            label="Representative Name"
            type="text"
            placeholder="John Doe"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="rounded-xl py-6 font-bold border-border"
          />
          <Input
            label="Corporate Email"
            type="email"
            placeholder="name@business.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="rounded-xl py-6 font-bold border-border"
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="rounded-xl py-6 font-bold border-border"
            />
            <Input
              label="Confirm"
              type="password"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="rounded-xl py-6 font-bold border-border"
            />
          </div>
          
          <Button size="lg" className="w-full rounded-xl py-7 text-lg font-black shadow-xl hover:scale-[1.02] active:scale-95 transition-all shadow-primary/20 mt-4" disabled={loading}>
            {loading ? <Spinner /> : 'Begin Your Journey'}
          </Button>
        </form>

        <p className="mt-8 text-center text-sm text-foreground/60 font-bold">
          Already a partner?{' '}
          <Link href="/auth/login" className="text-primary hover:text-primary/80 transition-colors font-black underline underline-offset-4">
            Log in here
          </Link>
        </p>
      </Card>
      
      <p className="mt-10 text-center text-[10px] text-foreground/30 uppercase tracking-[0.2em] font-black max-w-[250px] leading-relaxed">
        Secure registration powered by AdFlow Enterprise
      </p>
    </div>
  );
}

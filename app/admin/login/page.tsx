'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const supabase = createClient();
    await supabase.auth.signInWithPassword({ email, password });
    window.location.href = '/admin';
  };

  return (
    <main className="mx-auto max-w-md px-6 py-16">
      <h1 className="mb-6 text-3xl font-bold">Admin Login</h1>
      <form className="space-y-4" onSubmit={onSubmit}>
        <Input
          type="email"
          placeholder="admin@example.com"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />
        <Input
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />
        <Button type="submit">Login</Button>
      </form>
    </main>
  );
}

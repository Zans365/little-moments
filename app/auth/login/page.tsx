'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/db/supabase';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
    } else {
      router.push('/memories');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8">
        <h1 className="font-serif text-4xl font-bold text-cocoa mb-2 text-center">
          Welcome Back
        </h1>
        <p className="text-center text-rose mb-8">Sign in to your memories</p>

        <form onSubmit={handleLogin} className="space-y-4">
          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded text-sm">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-semibold text-cocoa mb-2">
              Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-butter rounded focus:outline-none focus:border-rose"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-cocoa mb-2">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-butter rounded focus:outline-none focus:border-rose"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-rose text-white py-2 rounded font-semibold hover:bg-cocoa transition disabled:opacity-50"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p className="text-center text-cocoa mt-6">
          No account?{' '}
          <Link href="/auth/register" className="text-rose hover:text-blush font-semibold">
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
}

'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/db/supabase';
import MemoryCard from '@/components/memory/MemoryCard';
import Navigation from '@/components/ui/Navigation';
import { Memory } from '@/lib/types';

export default function Home() {
  const [memories, setMemories] = useState<Memory[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    checkAuth();
    fetchRecentMemories();
  }, []);

  const checkAuth = async () => {
    const { data } = await supabase.auth.getSession();
    setUser(data.session?.user || null);
  };

  const fetchRecentMemories = async () => {
    const { data, error } = await supabase
      .from('memories')
      .select('*')
      .order('date', { ascending: false })
      .limit(6);

    if (!error && data) {
      setMemories(data as Memory[]);
    }
    setLoading(false);
  };

  return (
    <>
      <Navigation user={user} />
      <main className="min-h-screen bg-cream">
        {/* Hero Section */}
        <section className="pt-20 pb-16 px-4 sm:px-8 text-center">
          <h1 className="font-serif text-5xl sm:text-6xl font-bold text-cocoa mb-4">
            Little moments, kept forever.
          </h1>
          <p className="font-sans text-lg sm:text-xl text-rose mb-8 max-w-2xl mx-auto">
            A little corner of the internet for everything you never want to forget.
          </p>
          <Link
            href={user ? '/memories/add' : '/auth/login'}
            className="inline-block bg-blush hover:bg-rose text-cocoa font-sans font-semibold px-8 py-3 rounded-lg transition-colors"
          >
            Add a Memory
          </Link>
        </section>

        {/* Recent Memories Section */}
        {user && (
          <section className="px-4 sm:px-8 py-12">
            <h2 className="font-serif text-4xl font-bold text-cocoa mb-8">Recent Memories</h2>
            {loading ? (
              <div className="text-center py-12">Loading...</div>
            ) : memories.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {memories.map((memory) => (
                  <MemoryCard key={memory.id} memory={memory} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-rose mb-4">No memories yet. Start creating!</p>
                <Link
                  href="/memories/add"
                  className="text-blush hover:text-rose font-semibold"
                >
                  Create your first memory →
                </Link>
              </div>
            )}
          </section>
        )}

        {/* Guest CTA */}
        {!user && (
          <section className="px-4 sm:px-8 py-12 text-center">
            <div className="bg-butter bg-opacity-30 rounded-lg p-12">
              <p className="text-lg text-cocoa mb-6">Sign in to start preserving your memories.</p>
              <div className="flex gap-4 justify-center flex-wrap">
                <Link
                  href="/auth/login"
                  className="bg-rose text-white px-6 py-2 rounded-lg hover:bg-cocoa transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  href="/auth/register"
                  className="border-2 border-rose text-rose px-6 py-2 rounded-lg hover:bg-rose hover:text-white transition-colors"
                >
                  Register
                </Link>
              </div>
            </div>
          </section>
        )}
      </main>
    </>
  );
}

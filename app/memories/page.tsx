'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/db/supabase';
import Navigation from '@/components/ui/Navigation';
import MemoryCard from '@/components/memory/MemoryCard';
import { Memory } from '@/lib/types';
import { Search } from 'lucide-react';

export default function MemoriesPage() {
  const [memories, setMemories] = useState<Memory[]>([]);
  const [filteredMemories, setFilteredMemories] = useState<Memory[]>([]);
  const [search, setSearch] = useState('');
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    if (user) {
      fetchMemories();
    }
  }, [user]);

  useEffect(() => {
    filterMemories();
  }, [search, memories]);

  const checkAuth = async () => {
    const { data } = await supabase.auth.getSession();
    const userData = data.session?.user;
    if (!userData) {
      router.push('/auth/login');
    } else {
      setUser(userData);
    }
  };

  const fetchMemories = async () => {
    const { data, error } = await supabase
      .from('memories')
      .select('*')
      .eq('user_id', user.id)
      .order('date', { ascending: false });

    if (!error && data) {
      setMemories(data as Memory[]);
    }
    setLoading(false);
  };

  const filterMemories = () => {
    if (!search) {
      setFilteredMemories(memories);
      return;
    }

    const query = search.toLowerCase();
    const filtered = memories.filter(
      (m) =>
        m.title.toLowerCase().includes(query) ||
        m.story.toLowerCase().includes(query) ||
        m.tags.some((tag) => tag.toLowerCase().includes(query))
    );
    setFilteredMemories(filtered);
  };

  return (
    <>
      <Navigation user={user} />
      <main className="min-h-screen bg-cream py-12 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="font-serif text-4xl font-bold text-cocoa mb-8">
            My Memories
          </h1>

          {/* Search Bar */}
          <div className="mb-8 flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 text-rose" size={20} />
              <input
                type="text"
                placeholder="Search memories..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-butter rounded focus:outline-none focus:border-rose"
              />
            </div>
          </div>

          {/* Memories Grid */}
          {loading ? (
            <div className="text-center py-12">Loading...</div>
          ) : filteredMemories.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredMemories.map((memory) => (
                <MemoryCard key={memory.id} memory={memory} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-rose mb-4">
                {search ? 'No memories found.' : 'No memories yet.'}
              </p>
            </div>
          )}
        </div>
      </main>
    </>
  );
}

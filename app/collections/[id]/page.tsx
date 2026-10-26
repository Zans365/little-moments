'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/db/supabase';
import Navigation from '@/components/ui/Navigation';
import MemoryCard from '@/components/memory/MemoryCard';
import { Collection, Memory } from '@/lib/types';
import { ChevronLeft } from 'lucide-react';

export default function CollectionDetailPage() {
  const [collection, setCollection] = useState<Collection | null>(null);
  const [memories, setMemories] = useState<Memory[]>([]);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const params = useParams();
  const collectionId = params.id as string;

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    if (user && collectionId) {
      fetchCollection();
      fetchMemories();
    }
  }, [user, collectionId]);

  const checkAuth = async () => {
    const { data } = await supabase.auth.getSession();
    const userData = data.session?.user;
    if (!userData) {
      router.push('/auth/login');
    } else {
      setUser(userData);
    }
  };

  const fetchCollection = async () => {
    const { data } = await supabase
      .from('collections')
      .select('*')
      .eq('id', collectionId)
      .eq('user_id', user.id)
      .single();

    if (data) {
      setCollection(data as Collection);
    }
    setLoading(false);
  };

  const fetchMemories = async () => {
    const { data } = await supabase
      .from('memories')
      .select('*')
      .eq('collection_id', collectionId)
      .eq('user_id', user.id)
      .order('date', { ascending: false });

    if (data) {
      setMemories(data as Memory[]);
    }
  };

  return (
    <>
      <Navigation user={user} />
      <main className="min-h-screen bg-cream py-12 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto">
          <Link
            href="/collections"
            className="text-rose hover:text-cocoa transition flex items-center gap-2 mb-8"
          >
            <ChevronLeft size={20} /> Back to Collections
          </Link>

          {loading ? (
            <div className="text-center py-12">Loading...</div>
          ) : collection ? (
            <>
              <h1 className="font-serif text-5xl font-bold text-cocoa mb-4">
                {collection.name}
              </h1>
              <p className="text-lg text-rose mb-8">
                {collection.description}
              </p>

              {/* Memories in Collection */}
              {memories.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {memories.map((memory) => (
                    <MemoryCard key={memory.id} memory={memory} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-rose mb-4">No memories in this collection yet.</p>
                  <Link
                    href="/memories/add"
                    className="text-blush hover:text-rose font-semibold"
                  >
                    Add memories →
                  </Link>
                </div>
              )}
            </>
          ) : null}
        </div>
      </main>
    </>
  );
}

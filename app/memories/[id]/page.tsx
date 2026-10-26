'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { supabase } from '@/lib/db/supabase';
import Navigation from '@/components/ui/Navigation';
import { Memory } from '@/lib/types';
import { Heart, Trash2, Edit, ChevronLeft, ChevronRight, X } from 'lucide-react';

export default function MemoryDetailPage() {
  const [memory, setMemory] = useState<Memory | null>(null);
  const [user, setUser] = useState<any>(null);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();
  const params = useParams();
  const memoryId = params.id as string;

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    if (user && memoryId) {
      fetchMemory();
    }
  }, [user, memoryId]);

  const checkAuth = async () => {
    const { data } = await supabase.auth.getSession();
    const userData = data.session?.user;
    if (!userData) {
      router.push('/auth/login');
    } else {
      setUser(userData);
    }
  };

  const fetchMemory = async () => {
    const { data, error: fetchError } = await supabase
      .from('memories')
      .select('*')
      .eq('id', memoryId)
      .eq('user_id', user.id)
      .single();

    if (fetchError) {
      setError('Memory not found');
    } else {
      setMemory(data as Memory);
    }
    setLoading(false);
  };

  const toggleFavorite = async () => {
    if (!memory) return;

    const { error } = await supabase
      .from('memories')
      .update({ is_favorite: !memory.is_favorite })
      .eq('id', memory.id);

    if (!error) {
      setMemory({ ...memory, is_favorite: !memory.is_favorite });
    }
  };

  const deleteMemory = async () => {
    if (!confirm('Delete this memory? This cannot be undone.')) return;

    const { error } = await supabase
      .from('memories')
      .delete()
      .eq('id', memory?.id);

    if (!error) {
      router.push('/memories');
    } else {
      setError('Failed to delete memory');
    }
  };

  const formattedDate = memory
    ? new Date(memory.date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : '';

  const allMedia = [...(memory?.photos || []), ...(memory?.videos || [])];

  return (
    <>
      <Navigation user={user} />
      <main className="min-h-screen bg-cream py-12 px-4 sm:px-8">
        <div className="max-w-4xl mx-auto">
          {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded mb-8">
              {error}
            </div>
          )}

          {loading ? (
            <div className="text-center py-12">Loading...</div>
          ) : memory ? (
            <>
              {/* Header with Actions */}
              <div className="flex justify-between items-start mb-8">
                <Link
                  href="/memories"
                  className="text-rose hover:text-cocoa transition flex items-center gap-2"
                >
                  <ChevronLeft size={20} /> Back
                </Link>
                <div className="flex gap-4">
                  <button
                    onClick={toggleFavorite}
                    className="transition"
                  >
                    <Heart
                      size={24}
                      className={
                        memory.is_favorite
                          ? 'text-rose fill-rose'
                          : 'text-rose'
                      }
                    />
                  </button>
                  <Link
                    href={`/memories/${memory.id}/edit`}
                    className="text-rose hover:text-cocoa transition"
                  >
                    <Edit size={24} />
                  </Link>
                  <button
                    onClick={deleteMemory}
                    className="text-rose hover:text-cocoa transition"
                  >
                    <Trash2 size={24} />
                  </button>
                </div>
              </div>

              {/* Main Content */}
              <div className="bg-white rounded-lg shadow-lg p-8 memory-card">
                <h1 className="font-serif text-5xl font-bold text-cocoa mb-4">
                  {memory.title}
                </h1>

                <p className="text-lg text-rose font-script mb-8">
                  {formattedDate}
                </p>

                {/* Primary Image */}
                {allMedia.length > 0 && (
                  <div
                    className="relative h-96 mb-8 rounded-lg overflow-hidden cursor-pointer group"
                    onClick={() => setLightboxIndex(0)}
                  >
                    <Image
                      src={allMedia[0]}
                      alt={memory.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform"
                    />
                  </div>
                )}

                {/* Story */}
                <div className="prose max-w-none mb-8">
                  <p className="text-lg text-cocoa whitespace-pre-wrap">
                    {memory.story}
                  </p>
                </div>

                {/* Additional Media Gallery */}
                {allMedia.length > 1 && (
                  <div className="mb-8">
                    <h3 className="font-serif text-2xl font-semibold text-cocoa mb-4">
                      More moments
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {allMedia.map((url, idx) => (
                        <div
                          key={idx}
                          className="relative h-48 rounded-lg overflow-hidden cursor-pointer group"
                          onClick={() => setLightboxIndex(idx)}
                        >
                          <Image
                            src={url}
                            alt={`Memory ${idx}`}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Tags */}
                {memory.tags && memory.tags.length > 0 && (
                  <div className="pt-8 border-t border-butter">
                    <h4 className="font-serif text-lg font-semibold text-cocoa mb-3">
                      Tags
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {memory.tags.map((tag) => (
                        <span
                          key={tag}
                          className="bg-butter text-cocoa px-4 py-2 rounded"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : null}
        </div>

        {/* Lightbox */}
        {lightboxIndex !== null && allMedia.length > 0 && (
          <div
            className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center"
            onClick={() => setLightboxIndex(null)}
          >
            <button
              onClick={() => setLightboxIndex(null)}
              className="absolute top-4 right-4 text-white hover:text-gray-300"
            >
              <X size={32} />
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                setLightboxIndex(
                  lightboxIndex === 0
                    ? allMedia.length - 1
                    : lightboxIndex - 1
                );
              }}
              className="absolute left-4 text-white hover:text-gray-300"
            >
              <ChevronLeft size={40} />
            </button>

            <div className="relative w-11/12 h-5/6 max-w-4xl">
              <Image
                src={allMedia[lightboxIndex]}
                alt="Lightbox"
                fill
                className="object-contain"
                onClick={(e) => e.stopPropagation()}
              />
            </div>

            <button
              onClick={(e) => {
                e.stopPropagation();
                setLightboxIndex(
                  lightboxIndex === allMedia.length - 1
                    ? 0
                    : lightboxIndex + 1
                );
              }}
              className="absolute right-4 text-white hover:text-gray-300"
            >
              <ChevronRight size={40} />
            </button>

            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white">
              {lightboxIndex + 1} / {allMedia.length}
            </div>
          </div>
        )}
      </main>
    </>
  );
}

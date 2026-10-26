'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { supabase } from '@/lib/db/supabase';
import Navigation from '@/components/ui/Navigation';
import { Memory, Collection } from '@/lib/types';

export default function EditMemoryPage() {
  const [memory, setMemory] = useState<Memory | null>(null);
  const [title, setTitle] = useState('');
  const [story, setStory] = useState('');
  const [date, setDate] = useState('');
  const [tags, setTags] = useState('');
  const [collectionId, setCollectionId] = useState('');
  const [collections, setCollections] = useState<Collection[]>([]);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
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
      fetchCollections();
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
    const { data } = await supabase
      .from('memories')
      .select('*')
      .eq('id', memoryId)
      .eq('user_id', user.id)
      .single();

    if (data) {
      const mem = data as Memory;
      setMemory(mem);
      setTitle(mem.title);
      setStory(mem.story);
      setDate(mem.date);
      setTags(mem.tags.join(', '));
      setCollectionId(mem.collection_id || '');
    }
    setLoading(false);
  };

  const fetchCollections = async () => {
    const { data } = await supabase
      .from('collections')
      .select('*')
      .eq('user_id', user.id);

    if (data) {
      setCollections(data as Collection[]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSaving(true);

    const tagArray = tags.split(',').map((t) => t.trim()).filter(Boolean);

    const { error: updateError } = await supabase
      .from('memories')
      .update({
        title,
        story,
        date,
        tags: tagArray,
        collection_id: collectionId || null,
      })
      .eq('id', memoryId);

    if (updateError) {
      setError(updateError.message);
    } else {
      router.push(`/memories/${memoryId}`);
    }
    setSaving(false);
  };

  return (
    <>
      <Navigation user={user} />
      <main className="min-h-screen bg-cream py-12 px-4 sm:px-8">
        <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-8">
          <h1 className="font-serif text-4xl font-bold text-cocoa mb-8">
            Edit Memory
          </h1>

          {loading ? (
            <div className="text-center py-12">Loading...</div>
          ) : memory ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="bg-red-50 text-red-600 p-4 rounded">
                  {error}
                </div>
              )}

              <div>
                <label className="block text-sm font-semibold text-cocoa mb-2">
                  Title
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-2 border border-butter rounded focus:outline-none focus:border-rose"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-cocoa mb-2">
                  Date
                </label>
                <input
                  type="date"
                  required
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full px-4 py-2 border border-butter rounded focus:outline-none focus:border-rose"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-cocoa mb-2">
                  Story
                </label>
                <textarea
                  required
                  value={story}
                  onChange={(e) => setStory(e.target.value)}
                  rows={6}
                  className="w-full px-4 py-2 border border-butter rounded focus:outline-none focus:border-rose"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-cocoa mb-2">
                  Tags (comma-separated)
                </label>
                <input
                  type="text"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  className="w-full px-4 py-2 border border-butter rounded focus:outline-none focus:border-rose"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-cocoa mb-2">
                  Collection (Optional)
                </label>
                <select
                  value={collectionId}
                  onChange={(e) => setCollectionId(e.target.value)}
                  className="w-full px-4 py-2 border border-butter rounded focus:outline-none focus:border-rose"
                >
                  <option value="">No collection</option>
                  {collections.map((col) => (
                    <option key={col.id} value={col.id}>
                      {col.name}
                    </option>
                  ))}
                </select>
              </div>

              <button
                type="submit"
                disabled={saving}
                className="w-full bg-blush text-cocoa py-3 rounded font-semibold hover:bg-rose hover:text-white transition disabled:opacity-50"
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </form>
          ) : null}
        </div>
      </main>
    </>
  );
}

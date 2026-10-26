'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/db/supabase';
import Navigation from '@/components/ui/Navigation';
import { Collection } from '@/lib/types';

export default function AddMemory() {
  const [title, setTitle] = useState('');
  const [story, setStory] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [tags, setTags] = useState('');
  const [collectionId, setCollectionId] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    if (user) {
      fetchCollections();
    }
  }, [user]);

  const checkAuth = async () => {
    const { data } = await supabase.auth.getSession();
    const userData = data.session?.user;
    if (!userData) {
      router.push('/auth/login');
    } else {
      setUser(userData);
    }
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
    }
  };

  const uploadFiles = async (memoryId: string) => {
    const uploadedUrls: string[] = [];

    for (const file of files) {
      const filename = `${memoryId}/${Date.now()}-${file.name}`;
      const { error } = await supabase.storage
        .from('memories')
        .upload(filename, file);

      if (!error) {
        const { data } = supabase.storage
          .from('memories')
          .getPublicUrl(filename);
        uploadedUrls.push(data.publicUrl);
      }
    }

    return uploadedUrls;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!title || !story) {
      setError('Title and story are required');
      setLoading(false);
      return;
    }

    const tagArray = tags.split(',').map((t) => t.trim()).filter(Boolean);

    const { data, error: insertError } = await supabase
      .from('memories')
      .insert([
        {
          user_id: user.id,
          title,
          story,
          date,
          tags: tagArray,
          collection_id: collectionId || null,
          is_favorite: false,
          photos: [],
          videos: [],
        },
      ])
      .select();

    if (insertError) {
      setError(insertError.message);
      setLoading(false);
      return;
    }

    const memoryId = data?.[0]?.id;

    if (files.length > 0 && memoryId) {
      const photoUrls = await uploadFiles(memoryId);

      await supabase
        .from('memories')
        .update({ photos: photoUrls })
        .eq('id', memoryId);
    }

    router.push('/memories');
  };

  return (
    <>
      <Navigation user={user} />
      <main className="min-h-screen bg-cream py-12 px-4 sm:px-8">
        <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-8">
          <h1 className="font-serif text-4xl font-bold text-cocoa mb-8">
            Create a Memory
          </h1>

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
                placeholder="Give this memory a name"
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
                placeholder="Write the story behind this memory"
                rows={6}
                className="w-full px-4 py-2 border border-butter rounded focus:outline-none focus:border-rose"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-cocoa mb-2">
                Photos & Videos
              </label>
              <input
                type="file"
                multiple
                accept="image/*,video/*"
                onChange={handleFileChange}
                className="w-full"
              />
              {files.length > 0 && (
                <p className="text-sm text-rose mt-2">
                  {files.length} file(s) selected
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-cocoa mb-2">
                Tags (comma-separated)
              </label>
              <input
                type="text"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="e.g., summer, family, birthday"
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
              disabled={loading}
              className="w-full bg-blush text-cocoa py-3 rounded font-semibold hover:bg-rose hover:text-white transition disabled:opacity-50"
            >
              {loading ? 'Saving...' : 'Save Memory'}
            </button>
          </form>
        </div>
      </main>
    </>
  );
}

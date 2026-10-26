'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { supabase } from '@/lib/db/supabase';
import Navigation from '@/components/ui/Navigation';
import { Collection } from '@/lib/types';
import { Plus, Trash2 } from 'lucide-react';

export default function CollectionsPage() {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ name: '', description: '' });
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
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (data) {
      setCollections(data as Collection[]);
    }
    setLoading(false);
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();

    const { error } = await supabase.from('collections').insert([
      {
        user_id: user.id,
        name: formData.name,
        description: formData.description,
        cover_photo: '/placeholder.svg',
      },
    ]);

    if (!error) {
      setFormData({ name: '', description: '' });
      setShowForm(false);
      fetchCollections();
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this collection?')) return;

    await supabase.from('collections').delete().eq('id', id);
    fetchCollections();
  };

  return (
    <>
      <Navigation user={user} />
      <main className="min-h-screen bg-cream py-12 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="font-serif text-4xl font-bold text-cocoa">
              Collections
            </h1>
            <button
              onClick={() => setShowForm(!showForm)}
              className="bg-blush text-cocoa px-4 py-2 rounded hover:bg-rose hover:text-white transition flex items-center gap-2"
            >
              <Plus size={20} /> New Collection
            </button>
          </div>

          {/* Create Form */}
          {showForm && (
            <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
              <form onSubmit={handleCreate} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-cocoa mb-2">
                    Collection Name
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-butter rounded focus:outline-none focus:border-rose"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-cocoa mb-2">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    rows={3}
                    className="w-full px-4 py-2 border border-butter rounded focus:outline-none focus:border-rose"
                  />
                </div>

                <div className="flex gap-4">
                  <button
                    type="submit"
                    className="bg-blush text-cocoa px-6 py-2 rounded hover:bg-rose hover:text-white transition"
                  >
                    Create Collection
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="border border-rose text-rose px-6 py-2 rounded hover:bg-rose hover:text-white transition"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Collections Grid */}
          {loading ? (
            <div className="text-center py-12">Loading...</div>
          ) : collections.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {collections.map((col) => (
                <Link key={col.id} href={`/collections/${col.id}`}>
                  <div className="memory-card cursor-pointer group">
                    <div className="relative h-48 bg-gray-200 rounded-t-lg overflow-hidden">
                      <Image
                        src={col.cover_photo}
                        alt={col.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform"
                      />
                    </div>

                    <div className="p-4">
                      <h3 className="font-serif text-2xl font-semibold text-cocoa mb-2">
                        {col.name}
                      </h3>
                      <p className="text-sm text-rose line-clamp-2">
                        {col.description}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-rose mb-4">No collections yet.</p>
              <button
                onClick={() => setShowForm(true)}
                className="text-blush hover:text-rose font-semibold"
              >
                Create your first collection →
              </button>
            </div>
          )}
        </div>
      </main>
    </>
  );
}

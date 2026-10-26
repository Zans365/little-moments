'use client';

import Link from 'next/link';
import { useState } from 'react';
import { supabase } from '@/lib/db/supabase';
import { Menu, X } from 'lucide-react';

interface NavigationProps {
  user: any;
}

export default function Navigation({ user }: NavigationProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    window.location.href = '/';
  };

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-4 flex justify-between items-center">
        <Link href="/" className="font-serif text-3xl font-bold text-cocoa">
          Little Moments
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex gap-8 items-center">
          {user ? (
            <>
              <Link href="/memories" className="text-cocoa hover:text-rose transition">
                Memories
              </Link>
              <Link href="/collections" className="text-cocoa hover:text-rose transition">
                Collections
              </Link>
              <Link href="/memories/add" className="bg-blush text-cocoa px-4 py-2 rounded hover:bg-rose transition">
                Add Memory
              </Link>
              <button
                onClick={handleSignOut}
                className="text-cocoa hover:text-rose transition"
              >
                Sign Out
              </button>
            </>
          ) : (
            <>
              <Link href="/auth/login" className="text-cocoa hover:text-rose transition">
                Sign In
              </Link>
              <Link href="/auth/register" className="bg-blush text-cocoa px-4 py-2 rounded hover:bg-rose transition">
                Register
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden border-t bg-cream px-4 py-4 space-y-3">
          {user ? (
            <>
              <Link href="/memories" className="block text-cocoa hover:text-rose">
                Memories
              </Link>
              <Link href="/collections" className="block text-cocoa hover:text-rose">
                Collections
              </Link>
              <Link href="/memories/add" className="block bg-blush text-cocoa px-4 py-2 rounded text-center">
                Add Memory
              </Link>
              <button
                onClick={handleSignOut}
                className="block w-full text-left text-cocoa hover:text-rose"
              >
                Sign Out
              </button>
            </>
          ) : (
            <>
              <Link href="/auth/login" className="block text-cocoa hover:text-rose">
                Sign In
              </Link>
              <Link href="/auth/register" className="block bg-blush text-cocoa px-4 py-2 rounded text-center">
                Register
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}

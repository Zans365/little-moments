'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Memory } from '@/lib/types';
import { Heart } from 'lucide-react';

interface MemoryCardProps {
  memory: Memory;
}

export default function MemoryCard({ memory }: MemoryCardProps) {
  const firstPhoto = memory.photos?.[0] || '/placeholder.svg';
  const formattedDate = new Date(memory.date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  return (
    <Link href={`/memories/${memory.id}`}>
      <div className="memory-card cursor-pointer group">
        <div className="relative h-64 overflow-hidden bg-gray-200">
          <Image
            src={firstPhoto}
            alt={memory.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>

        <div className="p-4">
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-serif text-xl font-semibold text-cocoa flex-1">
              {memory.title}
            </h3>
            {memory.is_favorite && (
              <Heart size={18} className="text-rose fill-rose" />
            )}
          </div>

          <p className="text-sm text-rose font-script mb-3">
            {formattedDate}
          </p>

          <p className="text-sm text-cocoa line-clamp-2 mb-3">
            {memory.story}
          </p>

          {memory.tags && memory.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {memory.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="text-xs bg-butter text-cocoa px-2 py-1 rounded"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Tape decoration */}
        <div className="tape-decoration w-12 h-6 top-4 -left-3 group-hover:rotate-0 transition-transform" />
      </div>
    </Link>
  );
}

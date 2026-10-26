-- Supabase SQL Schema for Little Moments

-- Users table (auto-created by Supabase Auth)
-- Uses Supabase's built-in auth.users table

-- Collections table
CREATE TABLE IF NOT EXISTS collections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  cover_photo VARCHAR(500),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Memories table
CREATE TABLE IF NOT EXISTS memories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  collection_id UUID REFERENCES collections(id) ON DELETE SET NULL,
  title VARCHAR(255) NOT NULL,
  story TEXT NOT NULL,
  date DATE NOT NULL,
  photos TEXT[] DEFAULT '{}',
  videos TEXT[] DEFAULT '{}',
  tags VARCHAR(100)[] DEFAULT '{}',
  is_favorite BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX idx_memories_user_id ON memories(user_id);
CREATE INDEX idx_memories_collection_id ON memories(collection_id);
CREATE INDEX idx_memories_date ON memories(date);
CREATE INDEX idx_collections_user_id ON collections(user_id);

-- Row Level Security
ALTER TABLE collections ENABLE ROW LEVEL SECURITY;
ALTER TABLE memories ENABLE ROW LEVEL SECURITY;

-- RLS Policies for collections
CREATE POLICY collections_user_policy ON collections
  FOR ALL USING (auth.uid() = user_id);

-- RLS Policies for memories
CREATE POLICY memories_user_policy ON memories
  FOR ALL USING (auth.uid() = user_id);

-- Storage bucket for media (create via Supabase console)
-- Bucket name: 'memories'
-- Public: false (private by default)

export interface Memory {
  id: string;
  user_id: string;
  title: string;
  story: string;
  date: string;
  photos: string[];
  videos: string[];
  tags: string[];
  is_favorite: boolean;
  collection_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface Collection {
  id: string;
  user_id: string;
  name: string;
  description: string;
  cover_photo: string;
  created_at: string;
  updated_at: string;
}

export interface User {
  id: string;
  email: string;
  created_at: string;
}

import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/db/supabase';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('user_id');

  if (!userId) {
    return NextResponse.json(
      { error: 'Missing user_id' },
      { status: 400 }
    );
  }

  const { data, error } = await supabase
    .from('memories')
    .select('*')
    .eq('user_id', userId)
    .order('date', { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { user_id, title, story, date, tags, collection_id } = body;

  if (!user_id || !title || !story) {
    return NextResponse.json(
      { error: 'Missing required fields' },
      { status: 400 }
    );
  }

  const { data, error } = await supabase
    .from('memories')
    .insert([
      {
        user_id,
        title,
        story,
        date,
        tags: tags || [],
        collection_id: collection_id || null,
        is_favorite: false,
        photos: [],
        videos: [],
      },
    ])
    .select();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data?.[0], { status: 201 });
}

# Little Moments - Digital Scrapbook

A beautiful, premium digital scrapbook website for preserving memories, photographs, videos, and life's meaningful moments.

## Features

- **Memory Management**: Create, edit, and delete memories with photos, videos, stories, and tags
- **Collections**: Organize memories into themed collections (Albums)
- **Search & Filter**: Find memories by title, story, or tags
- **Favorites**: Mark important memories as favorites
- **Responsive Design**: Beautiful on desktop and mobile
- **Polaroid Styling**: Nostalgic, handcrafted aesthetic with warm colors
- **Lightbox Gallery**: View media in a full-screen, immersive experience
- **Authentication**: Secure sign-in and registration

## Tech Stack

- **Frontend**: Next.js 16 (App Router), React 19, TypeScript
- **Styling**: Tailwind CSS 4 with custom design tokens
- **Backend**: Supabase (PostgreSQL + Auth)
- **Storage**: Supabase Storage for photos and videos
- **UI Components**: Lucide React icons

## Color Palette

- Butter Yellow: `#F7E7A6`
- Warm Cream: `#FFF9F0`
- Blush Pink: `#F3C6D3`
- Dusty Rose: `#D99AAA`
- Pale Peach: `#F7D8C7`
- Cocoa Brown: `#3D302F`

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Supabase account

### Setup

1. Clone the repository
```bash
cd little-moments
npm install
```

2. Set up Supabase
   - Create a new Supabase project
   - Run the SQL schema from `supabase-schema.sql` in Supabase SQL editor
   - Create a storage bucket named `memories` (private)
   - Get your Supabase URL and anon key

3. Configure environment
```bash
cp .env.local.example .env.local
# Edit .env.local with your Supabase credentials
```

4. Run development server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
little-moments/
├── app/
│   ├── api/              # API routes
│   ├── auth/             # Auth pages (login, register)
│   ├── collections/      # Collection pages
│   ├── memories/         # Memory pages
│   ├── globals.css       # Global styles
│   ├── layout.tsx        # Root layout
│   └── page.tsx          # Homepage
├── components/
│   ├── memory/           # Memory components
│   └── ui/               # Shared UI components
├── lib/
│   ├── db/               # Database utilities
│   ├── types/            # TypeScript types
│   └── mockData.ts       # Mock data for demo
├── public/               # Static assets
├── supabase-schema.sql   # Database schema
├── tailwind.config.ts    # Tailwind config
└── tsconfig.json         # TypeScript config
```

## Pages

### Public
- `/` - Homepage
- `/auth/login` - Sign in
- `/auth/register` - Create account

### Authenticated
- `/memories` - All memories grid
- `/memories/add` - Create new memory
- `/memories/[id]` - Memory detail with lightbox
- `/memories/[id]/edit` - Edit memory
- `/collections` - All collections
- `/collections/[id]` - Collection detail

## Database Schema

### Collections Table
- `id` (UUID)
- `user_id` (UUID) - References auth.users
- `name` (VARCHAR)
- `description` (TEXT)
- `cover_photo` (VARCHAR)
- `created_at`, `updated_at` (TIMESTAMP)

### Memories Table
- `id` (UUID)
- `user_id` (UUID) - References auth.users
- `collection_id` (UUID) - Optional reference to collections
- `title` (VARCHAR)
- `story` (TEXT)
- `date` (DATE)
- `photos` (TEXT[]) - Array of photo URLs
- `videos` (TEXT[]) - Array of video URLs
- `tags` (VARCHAR[]) - Array of tags
- `is_favorite` (BOOLEAN)
- `created_at`, `updated_at` (TIMESTAMP)

## API Routes

### Memories
- `GET /api/memories?user_id=UUID` - Get user's memories
- `POST /api/memories` - Create memory

### Collections
- `GET /api/collections?user_id=UUID` - Get user's collections
- `POST /api/collections` - Create collection

## Features to Implement

- [ ] Timeline view (chronological)
- [ ] Calendar view (by date)
- [ ] "On This Day" section
- [ ] Advanced search with date range
- [ ] Memory sharing (private links)
- [ ] Backup/export functionality
- [ ] Dark mode toggle
- [ ] Profile customization

## Security

- Row-level security enabled on all tables
- Users can only access their own memories and collections
- Media stored in private storage bucket
- Authentication required for non-public pages

## Performance

- Image optimization via Next.js Image component
- CSS-in-JS with Tailwind for fast rendering
- Client-side caching with React state
- Database indexes on frequently queried columns

## Design Philosophy

The design combines:
- Physical scrapbook aesthetics (paper textures, tape, Polaroid frames)
- Modern digital minimalism
- Warm, nostalgic color palette
- Editorial typography (Cormorant Garamond + DM Sans)
- Subtle animations (card lifts, smooth transitions)

## Contributing

This is a personal project. Feel free to fork and customize for your own use.

## License

MIT

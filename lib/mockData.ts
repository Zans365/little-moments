// Demo data for testing Little Moments
// To use: import and call generateMockData() in your client code

export const generateMockData = () => {
  const today = new Date();

  const memories = [
    {
      id: '1',
      user_id: 'demo-user',
      title: 'Summer in the Mountains',
      story: 'A perfect afternoon hiking through alpine meadows with friends. The views were breathtaking and we found this hidden lake at sunset. Moments like these remind me why I love nature.',
      date: new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      photos: ['/placeholder.svg'],
      videos: [],
      tags: ['summer', 'nature', 'friends', 'hiking'],
      is_favorite: true,
      collection_id: '1',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: '2',
      user_id: 'demo-user',
      title: 'Birthday Cake and Laughter',
      story: 'Twenty-eight and feeling grateful. Surrounded by the people who mean the most to me. This cake was homemade and absolutely delicious.',
      date: new Date(today.getTime() - 15 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      photos: ['/placeholder.svg'],
      videos: [],
      tags: ['birthday', 'family', 'celebration'],
      is_favorite: true,
      collection_id: '2',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: '3',
      user_id: 'demo-user',
      title: 'First Snow',
      story: 'The world transformed overnight. Woke up to see everything covered in fresh snow. Made hot chocolate and watched the flakes fall while reading by the window.',
      date: new Date(today.getTime() - 60 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      photos: ['/placeholder.svg'],
      videos: [],
      tags: ['winter', 'cozy', 'home'],
      is_favorite: false,
      collection_id: '3',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  ];

  const collections = [
    {
      id: '1',
      user_id: 'demo-user',
      name: 'Adventures',
      description: 'Days spent exploring new places and experiencing the beauty of nature',
      cover_photo: '/placeholder.svg',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: '2',
      user_id: 'demo-user',
      name: 'People I Love',
      description: 'The faces and moments with those who matter most',
      cover_photo: '/placeholder.svg',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: '3',
      user_id: 'demo-user',
      name: 'Cozy Moments',
      description: 'Simple, quiet times that bring peace and joy',
      cover_photo: '/placeholder.svg',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  ];

  return { memories, collections };
};

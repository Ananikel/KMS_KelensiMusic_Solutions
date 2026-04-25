import { Track, Category } from './types';

export const DEFAULT_CATEGORIES: Category[] = [
  { id: 'Vocals', name: 'Vocals', icon: 'Mic' },
  { id: 'Smooth', name: 'Smooth', icon: 'Wind' },
  { id: 'Bazz', name: 'Bazz', icon: 'Activity' },
  { id: 'Low End', name: 'Low End', icon: 'Layers' },
  { id: 'Uploads', name: 'Uploads', icon: 'Upload' },
];

export const INITIAL_TRACKS: Track[] = [
  {
    id: '1',
    title: 'Neon Drift',
    artist: 'CyberUnit 01',
    albumArt: 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?auto=format&fit=crop&q=80&w=3270&ixlib=rb-4.0.3',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    category: 'Bazz',
    duration: 252
  },
  {
    id: '2',
    title: 'Plasma Pulse',
    artist: 'SyncWave',
    albumArt: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=3164&ixlib=rb-4.0.3',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    category: 'Smooth',
    duration: 180
  },
  {
    id: '3',
    title: 'Digital Soul',
    artist: 'Astraea',
    albumArt: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&q=80&w=3270&ixlib=rb-4.0.3',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
    category: 'Vocals',
    duration: 215
  }
];

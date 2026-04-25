import { create } from 'zustand';
import { AppState, Track } from '@/src/types';
import { INITIAL_TRACKS, DEFAULT_CATEGORIES } from '../Constants';

export const useMusicStore = create<AppState>((set, get) => ({
  currentTrack: null,
  tracks: INITIAL_TRACKS,
  categories: DEFAULT_CATEGORIES,
  currentCategory: 'Vocals',
  isPlaying: false,
  volume: 0.8,
  queue: [],
  history: [],
  equalizerBands: [0, 0, 0, 0, 0], // 5 bands
  playbackRate: 1.0,
  language: 'EN',
  currentTime: 0,
  duration: 0,
  error: null,
  favorites: [],
  isShuffle: false,
  isRepeat: false,

  setLanguage: (language: 'EN' | 'FR') => set({ language }),
  setPlaybackRate: (rate: number) => set({ playbackRate: rate }),
  setProgress: (currentTime: number, duration: number) => set({ currentTime, duration }),
  seek: (time: number) => set({ currentTime: time }),
  setTrack: (track: Track) => {
    const { tracks } = get();
    // Find tracks in the same category
    const categoryTracks = tracks.filter(t => t.category === track.category);
    const index = categoryTracks.findIndex(t => t.id === track.id);
    const nextQueue = categoryTracks.slice(index + 1);
    
    set({ 
      currentTrack: track, 
      isPlaying: true, 
      currentTime: 0, 
      duration: 0,
      queue: nextQueue 
    });
  },
  setCategory: (categoryId: string) => set({ currentCategory: categoryId }),
  
  addCategory: (name: string) => set((state) => {
    const id = name.trim();
    if (state.categories.some(c => c.id === id)) return state;
    return {
      categories: [...state.categories, { id, name, icon: 'Music' }]
    };
  }),
  
  addTrack: (track: Track) => set((state) => ({ 
    tracks: [track, ...state.tracks],
    currentTrack: track,
    isPlaying: true 
  })),

  removeTrack: (trackId: string) => set((state) => {
    const updatedTracks = state.tracks.filter(t => t.id !== trackId);
    let newCurrentTrack = state.currentTrack;
    if (state.currentTrack?.id === trackId) {
      newCurrentTrack = updatedTracks.length > 0 ? updatedTracks[0] : null;
    }
    return {
      tracks: updatedTracks,
      currentTrack: newCurrentTrack
    };
  }),
  
  togglePlay: () => set((state) => ({ isPlaying: !state.isPlaying })),
  
  setVolume: (volume: number) => set({ volume }),
  
  setEqualizerBand: (index: number, value: number) => set((state) => {
    const newBands = [...state.equalizerBands];
    newBands[index] = value;
    return { equalizerBands: newBands };
  }),

  nextTrack: () => {
    const { tracks, currentTrack, isShuffle, isRepeat } = get();
    if (tracks.length === 0) return;
    
    let nextIndex = 0;
    if (isShuffle) {
      nextIndex = Math.floor(Math.random() * tracks.length);
    } else if (currentTrack) {
      const currentIndex = tracks.findIndex(t => t.id === currentTrack.id);
      nextIndex = (currentIndex + 1) % tracks.length;
    }
    
    const nextTrack = tracks[nextIndex];
    set({ 
      currentTrack: nextTrack,
      isPlaying: true,
      currentTime: 0,
      duration: 0
    });
  },

  prevTrack: () => {
    const { tracks, currentTrack } = get();
    if (tracks.length === 0) return;
    
    let prevIndex = tracks.length - 1;
    if (currentTrack) {
      const currentIndex = tracks.findIndex(t => t.id === currentTrack.id);
      prevIndex = (currentIndex - 1 + tracks.length) % tracks.length;
    }
    
    const prevTrack = tracks[prevIndex];
    set({ 
      currentTrack: prevTrack,
      isPlaying: true,
      currentTime: 0,
      duration: 0
    });
  },

  addToQueue: (track: Track) => set((state) => ({ queue: [...state.queue, track] })),
  setError: (error: string | null) => set({ error }),
  toggleFavorite: (trackId: string) => set((state) => {
    const isFavorite = state.favorites.includes(trackId);
    return {
      favorites: isFavorite 
        ? state.favorites.filter(id => id !== trackId)
        : [...state.favorites, trackId]
    };
  }),

  toggleShuffle: () => set((state) => ({ isShuffle: !state.isShuffle })),
  toggleRepeat: () => set((state) => ({ isRepeat: !state.isRepeat })),
}));

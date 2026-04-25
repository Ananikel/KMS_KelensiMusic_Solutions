export interface Track {
  id: string;
  title: string;
  artist: string;
  albumArt: string;
  audioUrl: string;
  category: string;
  duration: number;
}

export interface Category {
  id: string;
  name: string;
  icon?: string; // Optional icon name
}

export interface AudioState {
  currentTrack: Track | null;
  isPlaying: boolean;
  volume: number;
  queue: Track[];
  history: Track[];
  equalizerBands: number[];
  playbackRate: number;
  setPlaybackRate: (rate: number) => void;
  currentTime: number;
  duration: number;
  setProgress: (time: number, duration: number) => void;
  seek: (time: number) => void;
  error: string | null;
  setError: (error: string | null) => void;
}

export interface AppState extends AudioState {
  language: 'EN' | 'FR';
  tracks: Track[];
  categories: Category[];
  currentCategory: string; // Changed to string ID
  setLanguage: (lang: 'EN' | 'FR') => void;
  setTrack: (track: Track) => void;
  setCategory: (categoryId: string) => void;
  addCategory: (name: string) => void;
  addTrack: (track: Track) => void;
  removeTrack: (trackId: string) => void;
  togglePlay: () => void;
  setVolume: (volume: number) => void;
  setEqualizerBand: (index: number, value: number) => void;
  nextTrack: () => void;
  prevTrack: () => void;
  addToQueue: (track: Track) => void;
  favorites: string[];
  toggleFavorite: (trackId: string) => void;
  isShuffle: boolean;
  isRepeat: boolean;
  toggleShuffle: () => void;
  toggleRepeat: () => void;
}

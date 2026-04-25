import React, { useState } from 'react';
import { useMusicStore } from '../store/useMusicStore';
import { Track } from '../types';
import { Play, Pause, Music as MusicIcon, Clock, X, MoreHorizontal, Heart, Trash2, Share2 } from 'lucide-react';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';

export const Playlist = () => {
  const { tracks, currentCategory, currentTrack, setTrack, language, categories, favorites, toggleFavorite, isPlaying } = useMusicStore();
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  const activeCategory = categories.find(c => c.id === currentCategory);

  const handleToggleFavorite = (e: React.MouseEvent, id: string) => {
     e.stopPropagation();
     toggleFavorite(id);
  };

  const handleShare = async (e: React.MouseEvent, track: Track) => {
    e.stopPropagation();
    if (navigator.share) {
      try {
        await navigator.share({
          title: track.title,
          text: `Listening to ${track.title} by ${track.artist}`,
          url: window.location.href,
        });
      } catch (err) {}
    }
  };

  const handleDelete = (e: React.MouseEvent, id: string) => {
     e.stopPropagation();
     const newTracks = tracks.filter(t => t.id !== id);
     useMusicStore.setState({ tracks: newTracks });
     setActiveMenuId(null);
  };
  
  let filteredTracks = tracks.filter(t => t.category === currentCategory);
  
  if (currentCategory === 'Favorites') {
    filteredTracks = tracks.filter(t => favorites.includes(t.id));
  } else if (currentCategory === 'Recent') {
    filteredTracks = [...tracks].reverse().slice(0, 10);
  } else if (currentCategory === 'All') {
    filteredTracks = tracks;
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between px-4">
        <h3 className="text-xl font-black tracking-tighter text-white uppercase italic">
          {activeCategory?.name || currentCategory} <span className="text-neon-cyan opacity-50">Signal</span>
        </h3>
        <span className="text-[10px] font-black text-slate-600 uppercase tracking-[0.3em]">
          {filteredTracks.length} {language === 'EN' ? 'Nodes' : 'Nœuds'}
        </span>
      </div>

      <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
        {filteredTracks.length === 0 ? (
          <div className="p-10 border border-dashed border-slate-800 rounded-3xl flex flex-col items-center justify-center gap-4">
            <MusicIcon className="w-8 h-8 text-slate-700" />
            <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest">
              {language === 'EN' ? 'No tracks found in this category' : 'Aucune piste dans cette catégorie'}
            </p>
          </div>
        ) : (
          filteredTracks.map((track, i) => (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              key={track.id}
              onClick={() => setTrack(track)}
              className={cn(
                "group flex items-center gap-4 p-4 rounded-2xl transition-all cursor-pointer",
                currentTrack?.id === track.id 
                  ? "bg-neon-cyan/10 border border-neon-cyan/20" 
                  : "hover:bg-white/5 border border-transparent"
              )}
            >
              <div className="relative w-12 h-12 shrink-0 rounded-xl overflow-hidden neo-inset">
                <img src={track.albumArt} alt={track.title} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity" />
                {currentTrack?.id === track.id && (
                  <div className="absolute inset-0 bg-neon-cyan/40 flex items-center justify-center">
                    <div className="flex gap-1 items-end h-3">
                      <div className="w-1 bg-white animate-[music-bar_0.5s_ease-in-out_infinite]" />
                      <div className="w-1 bg-white animate-[music-bar_0.7s_ease-in-out_infinite]" />
                      <div className="w-1 bg-white animate-[music-bar_0.6s_ease-in-out_infinite]" />
                    </div>
                  </div>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <p className={cn(
                  "font-black text-sm tracking-tight truncate uppercase",
                  currentTrack?.id === track.id ? "text-neon-cyan" : "text-white"
                )}>
                  {track.title}
                </p>
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-tight truncate">
                  {track.artist}
                </p>
              </div>

              <div className="flex items-center gap-6">
                <span className="text-[10px] font-black text-slate-500 font-mono">
                  {Math.floor(track.duration / 60)}:{(track.duration % 60).toString().padStart(2, '0')}
                </span>
                <div className="flex items-center gap-2 relative">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveMenuId(activeMenuId === track.id ? null : track.id);
                    }}
                    className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-white/10 text-slate-500 hover:text-white transition-colors"
                  >
                    <MoreHorizontal className="w-4 h-4" />
                  </button>

                  <AnimatePresence>
                    {activeMenuId === track.id && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.9, x: -10 }}
                        animate={{ opacity: 1, scale: 1, x: 0 }}
                        exit={{ opacity: 0, scale: 0.9, x: -10 }}
                        className="absolute right-full mr-2 top-0 w-44 glass rounded-xl p-2 z-50 neo-outset border border-white/5"
                      >
                        <button 
                          onClick={(e) => handleToggleFavorite(e, track.id)}
                          className={cn("w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/5 text-[9px] font-black uppercase tracking-widest transition-all", 
                            favorites.includes(track.id) ? "text-neon-pink" : "text-slate-400 hover:text-white")}
                        >
                           <Heart className={cn("w-3.5 h-3.5", favorites.includes(track.id) && "fill-current")} />
                           {favorites.includes(track.id) ? (language === 'EN' ? 'Loved' : 'Aimé') : (language === 'EN' ? 'Love' : 'Aimer')}
                        </button>
                        <button 
                          onClick={(e) => handleShare(e, track)}
                          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/5 text-[9px] font-black uppercase tracking-widest text-slate-400 hover:text-white transition-all"
                        >
                           <Share2 className="w-3.5 h-3.5" />
                           {language === 'EN' ? 'Share' : 'Partager'}
                        </button>
                        <div className="h-[1px] bg-white/5 my-1" />
                        <button 
                          onClick={(e) => handleDelete(e, track.id)}
                          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-red-500/10 text-[9px] font-black uppercase tracking-widest text-red-500/60 hover:text-red-500 transition-all"
                        >
                           <Trash2 className="w-3.5 h-3.5" />
                           {language === 'EN' ? 'Delete' : 'Supprimer'}
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <button className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center transition-all",
                    currentTrack?.id === track.id && isPlaying ? "bg-neon-cyan shadow-[0_0_10px_rgba(34,211,238,0.5)] text-slate-950" : "bg-white text-slate-950"
                  )}>
                    {currentTrack?.id === track.id && isPlaying ? <Pause className="w-3.5 h-3.5 fill-current" /> : <Play className="w-3.5 h-3.5 fill-current ml-0.5" />}
                  </button>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
};

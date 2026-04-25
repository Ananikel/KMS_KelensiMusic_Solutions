import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/src/lib/utils';
import { Visualizer } from './Visualizer';
import { useMusicStore } from '@/src/store/useMusicStore';
import { Disc, Share2, Heart, MoreHorizontal, Download, Trash2, Info } from 'lucide-react';

export const TopPanel = () => {
  const { currentTrack, isPlaying, language, favorites, toggleFavorite, tracks } = useMusicStore();
  const [showMenu, setShowMenu] = useState(false);
  const isFavorite = currentTrack ? favorites.includes(currentTrack.id) : false;

  const handleShare = async () => {
    if (currentTrack && navigator.share) {
      try {
        await navigator.share({
          title: currentTrack.title,
          text: `Check out ${currentTrack.title} by ${currentTrack.artist} on KMS Music Solutions`,
          url: window.location.href,
        });
      } catch (err) {}
    }
  };

  const handleDelete = () => {
     if (currentTrack) {
        const newTracks = tracks.filter(t => t.id !== currentTrack.id);
        useMusicStore.setState({ tracks: newTracks, currentTrack: newTracks[0] || null });
        setShowMenu(false);
     }
  };

  return (
    <div className="flex flex-col gap-4 lg:gap-6 p-6 lg:p-10 xl:p-12 glass rounded-[24px] lg:rounded-[40px] neo-outset border-0 relative min-h-[320px] lg:min-h-[440px] justify-center overflow-hidden">
      {/* Background Radial Glow */}
      <div className="absolute top-[-20%] right-[-10%] w-full h-full bg-radial from-neon-purple/20 to-transparent opacity-60 pointer-events-none" />
      
      <div className="flex justify-between items-start absolute top-4 lg:top-8 left-4 lg:left-8 right-4 lg:right-8 z-20">
        <div className="flex gap-2 lg:gap-4">
           <button 
             onClick={() => currentTrack && toggleFavorite(currentTrack.id)}
             className={cn(
               "w-8 h-8 lg:w-10 lg:h-10 flex items-center justify-center neo-button border-0 transition-all",
               isFavorite ? "text-neon-pink shadow-[0_0_15px_rgba(236,72,153,0.4)]" : "text-slate-500 hover:text-white"
             )}
           >
             <Heart className={cn("w-4 lg:w-5 h-4 lg:h-5", isFavorite && "fill-current")} />
           </button>
           <button 
             onClick={handleShare}
             className="w-8 h-8 lg:w-10 lg:h-10 flex items-center justify-center neo-button border-0 text-slate-500 hover:text-white transition-all"
           >
             <Share2 className="w-4 lg:w-5 h-4 lg:h-5" />
           </button>
        </div>

        <div className="relative">
          <button 
            onClick={() => setShowMenu(!showMenu)}
            className="w-8 h-8 lg:w-10 lg:h-10 flex items-center justify-center neo-button border-0 text-slate-500 hover:text-white transition-all"
          >
             <MoreHorizontal className="w-4 lg:w-5 h-4 lg:h-5" />
          </button>

          <AnimatePresence>
            {showMenu && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 10 }}
                className="absolute top-12 right-0 w-48 glass rounded-2xl p-2 z-50 neo-outset border border-white/5"
              >
                <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-white transition-all">
                   <Download className="w-4 h-4 text-neon-cyan" />
                   {language === 'EN' ? 'Download' : 'Télécharger'}
                </button>
                <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-white transition-all">
                   <Info className="w-4 h-4 text-neon-purple" />
                   {language === 'EN' ? 'Track Info' : 'Infos Piste'}
                </button>
                <div className="h-[1px] bg-white/5 my-1" />
                <button 
                  onClick={handleDelete}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-red-500/10 text-[10px] font-black uppercase tracking-widest text-red-500/60 hover:text-red-500 transition-all"
                >
                   <Trash2 className="w-4 h-4" />
                   {language === 'EN' ? 'Delete' : 'Supprimer'}
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 lg:gap-16 items-center z-10 relative">
        {/* Track Title & Artist - Massive Style */}
        <div className="flex-1 space-y-4 lg:space-y-6 text-center lg:text-left w-full">
          <div className="space-y-2 lg:space-y-4">
            <p className="text-[10px] lg:text-xs font-black uppercase tracking-[0.4em] text-neon-cyan animate-pulse">
              {language === 'EN' ? 'Now Playing' : 'En Lecture'}
            </p>
            <motion.h1 
              key={currentTrack?.title}
              initial={{ x: -40, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black leading-[0.9] tracking-tighter text-white"
            >
              {currentTrack?.title.toUpperCase() || "SYNTHETIC DREAMS"}
            </motion.h1>
            <motion.p 
              key={currentTrack?.artist}
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="text-lg lg:text-2xl font-bold text-slate-400"
            >
              {currentTrack?.artist || "Nova Aurora"} • {currentTrack?.category || "Ambient Grid"}
            </motion.p>
          </div>

          <div className="flex gap-2 lg:gap-4 pt-2 lg:pt-4 justify-center lg:justify-start">
             <span className="px-3 lg:px-4 py-1 lg:py-1.5 rounded-full bg-white/5 border border-white/5 text-[8px] lg:text-[10px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap">
                44.1 kHz • PCM
             </span>
             <span className="px-3 lg:px-4 py-1 lg:py-1.5 rounded-full bg-neon-purple/10 border border-neon-purple/20 text-[8px] lg:text-[10px] font-black text-neon-purple uppercase tracking-widest whitespace-nowrap">
                {language === 'EN' ? 'Lossless Audio' : 'Audio Sans Perte'}
             </span>
          </div>
        </div>

        {/* Improved Circle Visual Element */}
        <div className="relative group shrink-0 hidden md:block">
          <motion.div 
            animate={{ rotate: isPlaying ? 360 : 0 }}
            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
            className="w-48 lg:w-72 h-48 lg:h-72 rounded-full p-1 lg:p-2 bg-gradient-to-tr from-neon-cyan via-slate-800 to-neon-purple neo-outset relative z-10"
          >
            <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center overflow-hidden border-[8px] lg:border-[12px] border-slate-950">
              {currentTrack?.albumArt ? (
                <img src={currentTrack.albumArt} alt={currentTrack.title} className="w-full h-full object-cover opacity-60 mix-blend-luminosity" />
              ) : (
                <Disc className="w-16 lg:w-24 h-16 lg:h-24 text-slate-800" />
              )}
              {/* Record Center Hole */}
              <div className="absolute inset-x-0 inset-y-0 m-auto w-6 lg:w-10 h-6 lg:h-10 rounded-full bg-slate-900 border-[4px] lg:border-[6px] border-slate-950 shadow-inner flex items-center justify-center">
                 <div className="w-1 lg:w-1.5 h-1 lg:h-1.5 rounded-full bg-neon-cyan" />
              </div>
            </div>
          </motion.div>
          
          <div className="absolute inset-[-5px] lg:inset-[-10px] rounded-full border border-white/5 animate-pulse" />
          <div className="absolute inset-[-10px] lg:inset-[-20px] rounded-full border border-white/5 opacity-50" />
        </div>
      </div>

      {/* Visualizer at the bottom of the panel */}
      <div className="absolute bottom-0 left-0 right-0 h-16 lg:h-24 opacity-40">
         <Visualizer isPlaying={isPlaying} />
      </div>
    </div>
  );
};

import React from 'react';
import { motion } from 'motion/react';
import { Play, Pause, SkipBack, SkipForward, Repeat, Shuffle, Volume2, Power } from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { useMusicStore } from '@/src/store/useMusicStore';

export const ControlDeck = () => {
  const { isPlaying, togglePlay, volume, setVolume, equalizerBands, setEqualizerBand, playbackRate, setPlaybackRate, language, currentTime, duration } = useMusicStore();

  const formatTime = (time: number) => {
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="flex flex-col lg:grid lg:grid-cols-[1.2fr_1fr_0.8fr] gap-4 lg:gap-6 p-4 lg:p-6 xl:p-8 glass rounded-[24px] lg:rounded-[32px] neo-outset border-0 relative overflow-hidden shrink-0 mt-auto">
      <div className="scanline" />
      
      {/* Sonic Controls Section (Equalizer + Volume) */}
      <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 border-b lg:border-b-0 lg:border-r border-white/5 pb-4 lg:pb-0 pr-0 lg:pr-6">
        {/* Equalizer */}
        <div className="flex flex-col gap-2 flex-1">
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 px-2 opacity-50">
            {language === 'EN' ? 'Sonic Equalization' : 'Égalisation Sonore'}
          </p>
          <div className="flex justify-between h-20 lg:h-28 px-2 items-center gap-2">
            {equalizerBands.map((val, i) => (
              <div key={i} className="flex flex-col items-center gap-1 group h-full justify-end">
                <div 
                  className="relative w-1.5 lg:w-2.5 h-16 lg:h-24 bg-slate-950 rounded-full neo-inset shadow-[inset_1px_1px_4px_#000] cursor-ns-resize group/slider"
                  onPointerDown={(e) => {
                     const target = e.currentTarget;
                     try { target.setPointerCapture(e.pointerId); } catch (err) {}
                     const rect = target.getBoundingClientRect();
                     const updateValue = (clientY: number) => {
                        const y = Math.max(0, Math.min(rect.height, clientY - rect.top));
                        const percent = 1 - (y / rect.height);
                        const newVal = (percent - 0.5) * 20;
                        setEqualizerBand(i, newVal);
                     };
                     updateValue(e.clientY);
                     
                     const move = (moveEvent: PointerEvent) => updateValue(moveEvent.clientY);
                     const up = (upEvent: PointerEvent) => {
                        try { target.releasePointerCapture(upEvent.pointerId); } catch (err) {}
                        window.removeEventListener('pointermove', move);
                        window.removeEventListener('pointerup', up);
                     };
                     window.addEventListener('pointermove', move);
                     window.addEventListener('pointerup', up);
                  }}
                >
                   <motion.div 
                     animate={{ height: `${50 + (val * 5)}%` }}
                     className="absolute bottom-0 inset-x-0 rounded-full bg-gradient-to-t from-neon-purple to-neon-pink opacity-30 shadow-[0_0_10px_#d946ef]"
                   />
                   <motion.div 
                     animate={{ bottom: `calc(${50 + (val * 5)}% - 6px)` }}
                     className="absolute w-6 lg:w-8 h-3 lg:h-4 -left-2.5 lg:-left-2 bg-slate-800 rounded-lg border border-white/10 shadow-2xl z-20 flex flex-col items-center justify-center gap-0.5 pointer-events-none group-active/slider:scale-110 transition-transform"
                   >
                      <div className="w-3 lg:w-4 h-[1px] bg-white/20" />
                      <div className="w-3 lg:w-4 h-[1px] bg-neon-purple/70 shadow-[0_0_8px_#d946ef]" />
                   </motion.div>
                </div>
                <span className="text-[8px] lg:text-[10px] font-black text-slate-600 font-mono tracking-tighter uppercase group-hover:text-neon-cyan leading-none">
                   {['60', '150', '400', '1K', '2.5'][i]}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Volume - Integrated with EQ level */}
        <div className="flex items-center lg:flex-col gap-6 lg:gap-3 lg:border-l lg:border-white/5 lg:pl-6">
          <div className="flex flex-col items-center gap-2">
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 opacity-50 px-2 text-center leading-none">
              {language === 'EN' ? 'Master' : 'Maitre'}
            </p>
            <div className="relative w-16 lg:w-24 h-16 lg:h-24 rounded-full flex items-center justify-center neo-outset bg-slate-800">
              <svg className="absolute inset-0 w-full h-full -rotate-90">
                <circle 
                  cx={cn(window.innerWidth < 1024 ? "32" : "48")} 
                  cy={cn(window.innerWidth < 1024 ? "32" : "48")} 
                  r={cn(window.innerWidth < 1024 ? "28" : "42")} 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="4" 
                  className="text-slate-950/40" 
                />
                <motion.circle 
                  cx={cn(window.innerWidth < 1024 ? "32" : "48")} 
                  cy={cn(window.innerWidth < 1024 ? "32" : "48")} 
                  r={cn(window.innerWidth < 1024 ? "28" : "42")} 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="4" 
                  strokeDasharray={cn(window.innerWidth < 1024 ? "175.9" : "263.8")}
                  animate={{ strokeDashoffset: (window.innerWidth < 1024 ? 175.9 : 263.8) * (1 - volume) }}
                  className="text-neon-cyan shadow-[0_0_15px_#22d3ee]/50" 
                  strokeLinecap="round"
                />
              </svg>
              
              <div className="absolute inset-2 lg:inset-3 rounded-full bg-slate-800 neo-outset flex items-center justify-center z-10 group overflow-hidden">
                 <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
                 <div className="flex flex-col items-center relative z-10">
                    <span className="text-neon-cyan text-[10px] lg:text-sm font-black tracking-tighter leading-none">{Math.round(volume * 100)}%</span>
                 </div>
                 
                 <input 
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={volume}
                    onChange={(e) => setVolume(parseFloat(e.target.value))}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                  />
              </div>
            </div>
          </div>

          {/* Playback Rate Compact */}
          <div className="flex flex-col items-center gap-2">
             <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 opacity-50 leading-none">SPEED</p>
             <div className="flex gap-1 bg-slate-950 p-1 rounded-lg neo-inset">
               {[1.0, 1.5, 2.0].map((rate) => (
                 <button
                   key={rate}
                   onClick={() => setPlaybackRate(rate)}
                   className={cn(
                     "px-2 py-1 rounded text-[9px] font-black transition-all",
                     playbackRate === rate ? "bg-neon-purple text-white" : "text-slate-600"
                   )}
                 >
                   {rate}x
                 </button>
               ))}
             </div>
          </div>
        </div>
      </div>

      {/* Main Playback Section */}
      <div className="flex flex-col items-center justify-center gap-4 lg:gap-6 border-b lg:border-b-0 lg:border-r border-white/5 pb-4 lg:pb-0 pr-0 lg:pr-6">
        <div className="flex items-center gap-4 lg:gap-8">
          <div className="neo-circle group hover:neo-inset scale-75 lg:scale-90" onClick={() => useMusicStore.getState().prevTrack()}>
            <SkipBack className="w-4 lg:w-5 h-4 lg:h-5 text-slate-400 group-hover:text-white fill-current" />
          </div>
          
          <button 
            onClick={togglePlay}
            className={cn(
              "w-14 h-14 lg:w-20 lg:h-20 rounded-full flex items-center justify-center transition-all duration-500 relative ring-2 ring-offset-2 lg:ring-offset-4 ring-offset-slate-950",
              isPlaying ? "bg-neon-cyan neo-inset text-slate-950 ring-neon-cyan/20" : "bg-slate-800 neo-outset text-white hover:text-neon-cyan ring-transparent"
            )}
          >
            {isPlaying ? (
              <Pause className="w-6 lg:w-8 h-6 lg:h-8 fill-current" />
            ) : (
              <Play className="w-6 lg:w-8 h-6 lg:h-8 fill-current ml-1" />
            )}
            {isPlaying && <div className="absolute inset-0 rounded-full animate-ping bg-neon-cyan/10 pointer-events-none" />}
          </button>

          <div className="neo-circle group hover:neo-inset scale-75 lg:scale-90" onClick={() => useMusicStore.getState().nextTrack()}>
            <SkipForward className="w-4 lg:w-5 h-4 lg:h-5 text-slate-400 group-hover:text-white fill-current" />
          </div>
        </div>

        <div className="w-full space-y-2 lg:space-y-4 px-2 lg:px-4">
          <div className="relative h-2 lg:h-3 w-full bg-slate-950 rounded-full neo-inset overflow-hidden flex items-center">
            <motion.div 
               animate={{ width: `${progress}%` }}
               className="h-full bg-gradient-to-r from-neon-purple to-neon-cyan rounded-full"
               transition={{ duration: 0.1 }}
            />
            <input 
              type="range"
              min="0"
              max={duration || 100}
              step="0.1"
              value={currentTime}
              onChange={(e) => useMusicStore.getState().seek(parseFloat(e.target.value))}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-30"
            />
          </div>
          <div className="flex justify-between text-[10px] font-black font-mono text-slate-600 uppercase tracking-tighter">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>
      </div>

      {/* Auxiliary Controls */}
      <div className="flex lg:flex-col items-center justify-around lg:justify-center gap-4 lg:gap-6 pt-2 lg:pt-0">
         <div className="flex gap-4">
            <button 
              onClick={() => useMusicStore.getState().toggleShuffle()}
              className={cn("transition-all group", useMusicStore.getState().isShuffle ? "text-neon-pink glow-pink" : "text-slate-500 hover:text-white")}
            >
               <Shuffle className="w-4 h-4" />
            </button>
            <button 
              onClick={() => useMusicStore.getState().toggleRepeat()}
              className={cn("transition-all group", useMusicStore.getState().isRepeat ? "text-neon-cyan glow-cyan" : "text-slate-500 hover:text-white")}
            >
               <Repeat className="w-4 h-4" />
            </button>
         </div>

         <div className="hidden lg:flex flex-col items-center gap-2">
            <div className="flex gap-2">
               {[1, 2, 3].map(i => (
                  <div key={i} className={cn("w-1.5 h-1.5 rounded-full", i === 1 ? "bg-neon-cyan animate-pulse shadow-[0_0_5px_#22d3ee]" : "bg-slate-800")} />
               ))}
            </div>
            <p className="text-[8px] text-slate-700 font-bold uppercase tracking-widest whitespace-nowrap">GRID NODE 2.4.0</p>
         </div>

         <button 
           onClick={() => { window.location.reload(); }}
           className="w-10 h-10 lg:w-12 lg:h-12 rounded-xl flex items-center justify-center neo-button text-red-500/50 hover:text-red-500 transition-all border-0"
         >
            <Power className="w-5 h-5" />
         </button>
      </div>
    </div>
  );
};

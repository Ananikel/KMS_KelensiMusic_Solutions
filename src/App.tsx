/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { TopPanel } from './components/TopPanel';
import { ControlDeck } from './components/ControlDeck';
import { AdminPortal } from './components/AdminPortal';
import { Playlist } from './components/Playlist';
import { AudioEngine } from './components/AudioEngine';
import { Notification } from './components/Notification';
import { useMusicStore } from './store/useMusicStore';
import { Globe, Shield } from 'lucide-react';
import { cn } from './lib/utils';
import { INITIAL_TRACKS } from './Constants';

export default function App() {
  const { tracks, currentTrack, setTrack, language, setLanguage } = useMusicStore();
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Persistence handler
  useEffect(() => {
    const savedTracks = localStorage.getItem('kms_tracks');
    const savedCategories = localStorage.getItem('kms_categories');
    
    if (savedTracks) {
      try {
        const parsed = JSON.parse(savedTracks);
        if (Array.isArray(parsed) && parsed.length > 0) {
           useMusicStore.setState({ tracks: parsed });
        }
      } catch (e) { console.error("Failed to load tracks", e); }
    }

    if (savedCategories) {
      try {
        const parsed = JSON.parse(savedCategories);
        if (Array.isArray(parsed) && parsed.length > 0) {
           useMusicStore.setState({ categories: parsed });
        }
      } catch (e) { console.error("Failed to load categories", e); }
    }
  }, []);

  useEffect(() => {
    const { tracks, categories } = useMusicStore.getState();
    localStorage.setItem('kms_tracks', JSON.stringify(tracks));
    localStorage.setItem('kms_categories', JSON.stringify(categories));
  }, [tracks, useMusicStore.getState().categories]);

  useEffect(() => {
    if (!currentTrack && tracks.length > 0) {
      setTrack(tracks[0]);
    }
  }, [currentTrack, setTrack, tracks]);

  return (
    <div className="flex flex-col lg:flex-row h-screen bg-slate-950 text-slate-200 font-sans selection:bg-neon-cyan/30 overflow-hidden uppercase font-black">
      {/* Background Decor */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full bg-neon-purple/5 blur-[140px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[60%] h-[60%] rounded-full bg-neon-cyan/5 blur-[140px]" />
      </div>

      {/* Mobile Header */}
      <div className="lg:hidden flex items-center justify-between p-4 glass z-50 shrink-0">
        <div className="flex flex-col gap-1">
          <span className="text-xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-neon-purple via-neon-cyan to-neon-pink leading-none">KMS</span>
          <span className="text-[8px] font-bold tracking-widest text-white/50 leading-none">KELENSI SOLUTIONS</span>
        </div>
        <button 
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="w-10 h-10 rounded-xl glass neo-outset flex items-center justify-center text-neon-cyan"
        >
          <div className="w-5 flex flex-col gap-1">
            <div className={cn("h-0.5 w-full bg-current transition-all", isSidebarOpen && "rotate-45 translate-y-1.5")} />
            <div className={cn("h-0.5 w-full bg-current transition-all", isSidebarOpen && "opacity-0")} />
            <div className={cn("h-0.5 w-full bg-current transition-all", isSidebarOpen && "-rotate-45 -translate-y-1.5")} />
          </div>
        </button>
      </div>

      <div className={cn(
        "fixed inset-0 z-40 transition-transform duration-500 lg:static lg:block",
        isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      )}>
        <Sidebar onClose={() => setIsSidebarOpen(false)} />
      </div>

      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <AudioEngine />
      <Notification />

      <main className="flex-1 flex flex-col p-2 lg:p-6 xl:p-8 gap-4 lg:gap-6 overflow-hidden relative bg-[radial-gradient(circle_at_70%_30%,rgba(217,70,239,0.05)_0%,transparent_70%)]">
        {/* Language & Admin Toggles */}
        <div className="flex justify-end items-center gap-2 lg:gap-4 z-30 shrink-0">
          <div className="flex bg-white/5 p-1 rounded-xl glass neo-inset">
            <button 
              onClick={() => setLanguage('EN')}
              className={cn(
                "px-3 lg:px-5 py-1.5 lg:py-2 rounded-lg text-[9px] lg:text-[10px] font-black tracking-[0.2em] transition-all uppercase",
                language === 'EN' ? "bg-neon-cyan text-slate-950 shadow-[0_0_10px_#22d3ee]" : "text-slate-600 hover:text-white"
              )}
            >
              EN
            </button>
            <button 
              onClick={() => setLanguage('FR')}
              className={cn(
                "px-3 lg:px-5 py-1.5 lg:py-2 rounded-lg text-[9px] lg:text-[10px] font-black tracking-[0.2em] transition-all uppercase",
                language === 'FR' ? "bg-neon-cyan text-slate-950 shadow-[0_0_10px_#22d3ee]" : "text-slate-600 hover:text-white"
              )}
            >
              FR
            </button>
          </div>
          <button 
            onClick={() => setIsAdminOpen(true)}
            className="flex items-center gap-2 px-4 py-2 lg:px-6 lg:py-3 rounded-xl lg:rounded-2xl glass neo-outset text-[9px] lg:text-[10px] font-black uppercase tracking-[0.2em] lg:tracking-[0.3em] transition-all hover:bg-neon-pink/10 hover:text-neon-pink group"
          >
            <Shield className="w-3.5 h-3.5 lg:w-4 lg:h-4 text-slate-500 group-hover:text-neon-pink" />
            {language === 'EN' ? 'KMS Admin' : 'Gestion KMS'}
          </button>
        </div>

        <TopPanel />
        
        <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar pr-1 flex flex-col gap-4 lg:gap-8">
          <Playlist />
        </div>

        <ControlDeck />

        {/* Status Bar */}
        <footer className="mt-auto flex justify-between items-center px-4 py-2 text-[10px] uppercase tracking-[0.4em] font-black text-slate-800">
           <div className="flex items-center gap-8">
              <span className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.6)]" /> 
                {language === 'EN' ? 'KMS NODE: ONLINE' : 'NŒUD KMS: EN LIGNE'}
              </span>
              <span className="opacity-30">KMS-PROTO v2.4.0</span>
           </div>
           <div className="flex items-center gap-12">
              <span className="flex items-center gap-2 opacity-60 hover:opacity-100 transition-opacity cursor-help">
                <Globe className="w-3 h-3 text-neon-cyan" /> {language === 'EN' ? 'Global Proxy' : 'Proxy Global'}
              </span>
              <span className="text-neon-purple font-black glow-purple">{language === 'EN' ? 'SECURE' : 'SÉCURISÉ'}</span>
           </div>
        </footer>
      </main>

      {isAdminOpen && <AdminPortal onClose={() => setIsAdminOpen(false)} />}
    </div>
  );
}


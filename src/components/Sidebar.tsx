import React from 'react';
import { cn } from '@/src/lib/utils';
import { Music, Mic2, Wind, Activity, Layers, X, Upload } from 'lucide-react';
import { useMusicStore } from '@/src/store/useMusicStore';

const ICON_MAP: Record<string, any> = {
  Mic: Mic2,
  Wind: Wind,
  Activity: Activity,
  Layers: Layers,
  Music: Music,
  Upload: Upload
};

export const Sidebar = ({ onClose }: { onClose?: () => void }) => {
  const { language, currentCategory, setCategory, categories } = useMusicStore();

  return (
    <aside className="w-[280px] flex flex-col gap-10 p-8 glass h-screen shrink-0 relative overflow-hidden">
      <div className="flex items-center justify-between lg:block">
        <div className="flex flex-col gap-1 mb-2">
          <div className="flex items-end gap-3 relative ml-2">
            {/* Logo Icon */}
            <div className="relative flex flex-col items-center">
              <div className="w-[2px] h-6 bg-gradient-to-b from-neon-purple to-neon-cyan" />
              <div className="w-3.5 h-3.5 rounded-full bg-white shadow-[0_0_15px_#9333ea]" />
            </div>
            <span className="text-3xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-neon-purple via-neon-cyan to-neon-pink">KMS</span>
          </div>
          <div className="text-[14px] font-black tracking-tight text-white/80 uppercase ml-2 leading-none mt-1">
            Kelensi <span className="text-neon-cyan">Music</span> <span className="text-neon-pink">Solutions</span>
          </div>
        </div>
        <button onClick={onClose} className="lg:hidden w-10 h-10 rounded-xl glass flex items-center justify-center text-slate-500">
           <X className="w-5 h-5" />
        </button>
      </div>

      <nav className="flex flex-col gap-6">
        <div className="space-y-4">
          <p className="text-[10px] uppercase tracking-[0.2em] text-slate-500 font-bold px-2">
            {language === 'EN' ? 'Categories' : 'Catégories'}
          </p>
          <div className="flex flex-col gap-2 max-h-[250px] overflow-y-auto pr-2 custom-scrollbar">
            {categories.map((cat) => {
              const isActive = currentCategory === cat.id;
              const Icon = ICON_MAP[cat.icon || 'Music'] || Music;

              return (
                <button
                   key={cat.id}
                   onClick={() => setCategory(cat.id)}
                  className={cn(
                    "pill-btn group w-full py-3 px-5 rounded-full font-bold text-sm flex items-center gap-3 transition-all duration-300",
                    isActive ? "pill-active" : "pill-inactive"
                  )}
                >
                  <Icon className={cn("w-4 h-4", isActive ? "text-white" : "text-slate-500")} />
                  {cat.name}
                </button>
              );
            })}
          </div>
        </div>

        <div className="space-y-4">
          <p className="text-[10px] uppercase tracking-[0.2em] text-slate-500 font-bold px-2">
            {language === 'EN' ? 'Library' : 'Bibliothèque'}
          </p>
          <div className="flex flex-col gap-2">
            {[
              { EN: 'All Nodes', FR: 'Tous les Nœuds', id: 'All' },
              { EN: 'Favorites', FR: 'Favoris', id: 'Favorites' },
              { EN: 'Recent', FR: 'Récent', id: 'Recent' },
              { EN: 'Uploads', FR: 'Téléchargements', id: 'Uploads' }
            ].map((item) => {
              const isActive = currentCategory === item.id;
              return (
                <button
                  key={item.EN}
                  onClick={() => setCategory(item.id)}
                  className={cn(
                    "pill-btn w-full py-3 px-5 rounded-full font-bold text-sm flex items-center gap-3 text-left transition-all duration-300",
                    isActive ? "pill-active" : "pill-inactive"
                  )}
                >
                  <div className={cn("w-1 h-1 rounded-full", isActive ? "bg-white" : "bg-slate-600")} />
                  {item[language]}
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      <div className="mt-auto px-2">
        <div className="p-5 neo-outset rounded-3xl bg-slate-800/40 border border-white/5 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-neon-purple/20 flex items-center justify-center">
              <Mic2 className="w-5 h-5 text-neon-purple" />
            </div>
            <div>
              <p className="text-xs font-bold text-white uppercase tracking-tight">KMS Studio Pro</p>
              <p className="text-[10px] text-slate-500">{language === 'EN' ? 'Unleash the grid' : 'Libérez le réseau'}</p>
            </div>
          </div>
          <button className="w-full py-2.5 bg-gradient-to-r from-neon-purple to-neon-pink text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:brightness-110 transition-all glow-purple">
            {language === 'EN' ? 'UPGRADE' : 'AMÉLIORER'}
          </button>
        </div>
      </div>
    </aside>
  );
};

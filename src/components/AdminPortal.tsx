import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, X, CheckCircle2, Music as MusicIcon, Tag, User, Layers, Plus } from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { motion } from 'motion/react';
import { useMusicStore } from '@/src/store/useMusicStore';

export const AdminPortal = ({ onClose }: { onClose: () => void }) => {
  const { language, categories, addCategory } = useMusicStore();
  const [title, setTitle] = useState('');
  const [artist, setArtist] = useState('');
  const [audioUrl, setAudioUrl] = useState('');
  const [category, setCategory] = useState('Uploads');
  const [newCategoryName, setNewCategoryName] = useState('');
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleDeploy = useCallback(() => {
    if (!audioUrl) return;

    setIsUploading(true);
    setUploadStatus('idle');

    setTimeout(() => {
      setIsUploading(false);
      setUploadStatus('success');
      
      const newTrack = {
        id: Math.random().toString(36).substr(2, 9),
        title: title || 'Remote Stream',
        artist: artist || (language === 'EN' ? 'Global Node' : 'Nœud Global'),
        audioUrl: audioUrl,
        albumArt: 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?q=80&w=1000&auto=format&fit=crop',
        category: category,
        duration: 0,
      };
      
      useMusicStore.getState().addTrack(newTrack);
      
      setTimeout(() => {
        setUploadStatus('idle');
        onClose();
      }, 1500);
    }, 1500);
  }, [title, artist, category, language, onClose, audioUrl]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;
    
    setIsUploading(true);
    setUploadStatus('idle');
    
    const newTracks: any[] = [];
    
    acceptedFiles.forEach((file, index) => {
      const url = URL.createObjectURL(file);
      const newTrack = {
        id: Math.random().toString(36).substr(2, 9) + index,
        title: acceptedFiles.length === 1 && title ? title : file.name.split('.')[0],
        artist: acceptedFiles.length === 1 && artist ? artist : (language === 'EN' ? 'Local Stream' : 'Flux Local'),
        audioUrl: url,
        albumArt: 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?q=80&w=1000&auto=format&fit=crop',
        category: category,
        duration: 0,
      };
      newTracks.push(newTrack);
    });

    setTimeout(() => {
      setIsUploading(false);
      setUploadStatus('success');
      
      newTracks.forEach(track => {
        useMusicStore.getState().addTrack(track);
      });
      
      setTimeout(() => {
        setUploadStatus('idle');
        onClose();
      }, 1500);
    }, 1500);
  }, [title, artist, category, language, onClose]);

  const handleAddCategory = () => {
    if (newCategoryName.trim()) {
      addCategory(newCategoryName);
      setCategory(newCategoryName.trim());
      setNewCategoryName('');
      setShowAddCategory(false);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'audio/*': ['.mp3', '.wav', '.flac'] },
    multiple: true
  } as any);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-xl bg-black/40">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="w-full max-w-2xl glass neo-outset rounded-[40px] overflow-hidden bg-slate-900 border-0 relative"
      >
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 w-12 h-12 flex items-center justify-center neo-button border-0 text-slate-500 hover:text-white z-50"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-10 space-y-8">
           <div className="space-y-2">
              <h2 className="text-4xl font-black tracking-tighter text-white uppercase italic">
                KMS <span className="text-neon-cyan">Kelensi</span> <span className="text-neon-pink">Solutions</span>
              </h2>
              <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.3em]">
                {language === 'EN' ? 'Node Deployment Interface' : 'Interface de Déploiement de Nœud'}
              </p>
           </div>

           <div className="grid grid-cols-2 gap-8">
              <div className="space-y-6">
                 <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 flex items-center gap-2">
                       <Tag className="w-3 h-3" /> {language === 'EN' ? 'Track Name' : 'Nom de la Piste'}
                    </label>
                    <input 
                       type="text" 
                       value={title}
                       onChange={(e) => setTitle(e.target.value)}
                       placeholder={language === 'EN' ? "Designation..." : "Désignation..."}
                       className="w-full px-5 py-4 rounded-2xl bg-slate-950 neo-inset border-0 text-white placeholder:text-slate-800 transition-all outline-none font-bold text-sm"
                    />
                 </div>
                 <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 flex items-center gap-2">
                       <User className="w-3 h-3" /> {language === 'EN' ? 'Creator' : 'Créateur'}
                    </label>
                    <input 
                       type="text" 
                       value={artist}
                       onChange={(e) => setArtist(e.target.value)}
                       placeholder={language === 'EN' ? "ID Creator..." : "ID Créateur..."}
                       className="w-full px-5 py-4 rounded-2xl bg-slate-950 neo-inset border-0 text-white placeholder:text-slate-800 transition-all outline-none font-bold text-sm"
                    />
                 </div>
                 <div className="space-y-3 p-4 rounded-2xl bg-neon-cyan/5 border border-neon-cyan/20">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-neon-cyan flex items-center gap-2">
                       <Upload className="w-3 h-3" /> {language === 'EN' ? 'PASTE DIRECT AUDIO URL HERE' : 'COLLEZ L\'URL AUDIO DIRECTE ICI'}
                    </label>
                    <input 
                       type="text" 
                       value={audioUrl}
                       onChange={(e) => setAudioUrl(e.target.value)}
                       placeholder="https://example.com/audio.mp3"
                       className="w-full px-5 py-4 rounded-2xl bg-slate-950 neo-inset border-0 text-white placeholder:text-slate-800 transition-all outline-none font-bold text-sm focus:ring-2 focus:ring-neon-cyan"
                    />
                    <div className="flex justify-between items-center">
                      <p className="text-[9px] text-slate-500 font-bold uppercase tracking-tight">Required for external streaming</p>
                      <p className="text-[8px] text-slate-600 font-bold uppercase">Pro tip: Use /audio/file.mp3 for public folder</p>
                    </div>
                 </div>
                 <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 flex items-center gap-2">
                         <Layers className="w-3 h-3" /> {language === 'EN' ? 'Classification' : 'Classification'}
                      </label>
                      <button 
                        onClick={() => setShowAddCategory(!showAddCategory)}
                        className="text-[10px] text-neon-cyan hover:glow-cyan font-black uppercase tracking-widest"
                      >
                        {showAddCategory ? (language === 'EN' ? 'CANCEL' : 'ANNULER') : (language === 'EN' ? '+ NEW' : '+ NOUVEAU')}
                      </button>
                    </div>

                    {showAddCategory ? (
                      <div className="flex gap-2">
                        <input 
                          type="text"
                          autoFocus
                          value={newCategoryName}
                          onChange={(e) => setNewCategoryName(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && handleAddCategory()}
                          className="flex-1 px-4 py-3 rounded-xl bg-slate-950 neo-inset border-0 text-white text-[10px] placeholder:text-slate-800 outline-none font-bold"
                          placeholder="Category Name..."
                        />
                        <button 
                          onClick={handleAddCategory}
                          className="px-4 py-3 bg-neon-cyan text-slate-950 rounded-xl font-black text-[10px] uppercase"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 gap-2 max-h-[140px] overflow-y-auto pr-2 custom-scrollbar">
                        {categories.map(cat => (
                           <button 
                              key={cat.id}
                              onClick={() => setCategory(cat.id)}
                              className={cn(
                                 "px-3 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all text-center",
                                 category === cat.id ? "bg-neon-cyan text-slate-950 shadow-[0_0_15px_#22d3ee]" : "bg-slate-950 text-slate-600 hover:text-white"
                              )}
                           >
                              {cat.name}
                           </button>
                        ))}
                      </div>
                    )}
                 </div>
              </div>

              <div className="flex flex-col">
                 <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-3 flex items-center gap-2">
                    <MusicIcon className="w-3 h-3" /> {language === 'EN' ? 'Audio Source' : 'Source Audio'}
                 </label>
                 <div 
                    {...getRootProps()} 
                    className={cn(
                       "flex-1 rounded-[40px] border-4 border-dashed transition-all flex flex-col items-center justify-center gap-5 cursor-pointer p-8",
                       isDragActive ? "border-neon-cyan bg-neon-cyan/5" : "border-slate-800 hover:border-slate-700",
                       uploadStatus === 'success' && "border-green-500 bg-green-500/5"
                    )}
                 >
                    <input {...getInputProps()} />
                    {isUploading ? (
                       <motion.div 
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          className="w-14 h-14 rounded-full border-4 border-neon-cyan border-t-transparent"
                       />
                    ) : uploadStatus === 'success' ? (
                       <CheckCircle2 className="w-14 h-14 text-green-500" />
                    ) : (
                       <Upload className="w-14 h-14 text-slate-700" />
                    )}
                    <div className="text-center">
                       <p className="text-sm font-black text-white uppercase tracking-widest">
                          {isUploading ? (language === 'EN' ? "Syncing..." : "Sync...") : uploadStatus === 'success' ? (language === 'EN' ? "Ready" : "Prêt") : (language === 'EN' ? "Inject Data" : "Injecter")}
                       </p>
                       <p className="text-[10px] text-slate-600 mt-2 font-bold uppercase tracking-tight">MP3, WAV, FLAC</p>
                    </div>
                 </div>
              </div>
           </div>

           <div className="flex gap-4">
              <button 
                onClick={onClose}
                className="flex-1 py-4 bg-slate-800 text-slate-400 font-black rounded-2xl hover:text-white uppercase tracking-widest text-[10px]"
              >
                {language === 'EN' ? 'Abort' : 'Abandonner'}
              </button>
              <button 
                onClick={handleDeploy}
                disabled={!audioUrl && !isUploading}
                className="flex-[2] py-5 bg-gradient-to-r from-neon-purple to-neon-pink text-white font-black rounded-2xl hover:brightness-110 active:scale-[0.98] transition-all glow-purple uppercase tracking-[0.3em] text-[12px] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                 {language === 'EN' ? 'Push to Grid' : 'Pousser au Réseau'}
              </button>
           </div>
        </div>
      </motion.div>
    </div>
  );
};

import React, { useEffect } from 'react';
import { useMusicStore } from '../store/useMusicStore';
import { AlertCircle, X, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const Notification = () => {
  const { error, setError } = useMusicStore();

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError(null);
      }, 8000);
      return () => clearTimeout(timer);
    }
  }, [error, setError]);

  return (
    <AnimatePresence>
      {error && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="fixed bottom-6 right-6 z-[100] flex items-center gap-4 p-4 rounded-2xl glass neo-outset border-red-500/30 min-w-[320px] max-w-[400px]"
        >
          <div className="w-10 h-10 rounded-xl bg-red-500/20 flex items-center justify-center shrink-0">
             <AlertCircle className="w-6 h-6 text-red-500" />
          </div>
          <div className="flex-1">
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">System Alert</p>
            <p className="text-sm font-bold text-white line-clamp-2">{error}</p>
          </div>
          <button 
            onClick={() => setError(null)}
            className="w-8 h-8 rounded-lg hover:bg-white/5 flex items-center justify-center text-slate-500 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

import { useEffect, useRef } from 'react';
import { Howl, Howler } from 'howler';
import { useMusicStore } from '@/src/store/useMusicStore';

export const AudioEngine = () => {
  const { currentTrack, isPlaying, volume, playbackRate, equalizerBands, currentTime, setError, language } = useMusicStore();
  const playerRef = useRef<Howl | null>(null);
  const filtersRef = useRef<BiquadFilterNode[]>([]);
  const audioContextRef = useRef<AudioContext | null>(null);

  // Initialize Audio Context and Filters for Equalizer
  useEffect(() => {
    const setupEQ = () => {
      // Don't setup if no context or already setup
      if (!Howler.ctx) {
        console.log("KMS Audio Engine: Waiting for context...");
        return;
      }
      
      const ctx = Howler.ctx;
      if (audioContextRef.current === ctx) return;
      audioContextRef.current = ctx;

      console.log("KMS Audio Engine: Setting up EQ for context state:", ctx.state);

      // Create 5 peaking filters for the bands
      const frequencies = [60, 150, 400, 1000, 2500];
      const filters = frequencies.map(freq => {
        const filter = ctx.createBiquadFilter();
        filter.type = 'peaking';
        filter.frequency.value = freq;
        filter.Q.value = 1.0;
        filter.gain.value = 0;
        return filter;
      });

      filtersRef.current = filters;

      try {
        // We must ensure masterGain exists. Howler initializes nodes when first sound is created
        if (Howler.masterGain) {
          Howler.masterGain.disconnect();
          Howler.masterGain.connect(filters[0]);
          
          for (let i = 0; i < filters.length - 1; i++) {
            filters[i].connect(filters[i+1]);
          }
          
          filters[filters.length - 1].connect(ctx.destination);
          console.log("KMS Audio Engine: EQ Routing established successfully");
        } else {
          // If masterGain isn't ready, we'll try again when sound plays
          console.log("KMS Audio Engine: masterGain not ready, deferring routing");
          audioContextRef.current = null; // Allow retry
        }
      } catch (e) {
        console.error('KMS Audio Engine: EQ Routing failed', e);
      }
    };

    // Attempt setup immediately
    setupEQ();

    const handleInteraction = () => {
      if (Howler.ctx && Howler.ctx.state === 'suspended') {
        Howler.ctx.resume().then(() => {
          console.log("KMS Audio Engine: Context manual resume success");
          setupEQ();
        });
      } else {
        setupEQ();
      }
    };

    window.addEventListener('click', handleInteraction);
    window.addEventListener('keydown', handleInteraction);

    return () => {
      window.removeEventListener('click', handleInteraction);
      window.removeEventListener('keydown', handleInteraction);
    };
  }, []);

  // Sync Equalizer Gains
  useEffect(() => {
    if (filtersRef.current.length > 0 && Howler.ctx) {
      equalizerBands.forEach((val, i) => {
        if (filtersRef.current[i]) {
          // Map -10/10 to -24/24 dB for more dramatic effect
          filtersRef.current[i].gain.setTargetAtTime(val * 2.4, Howler.ctx.currentTime, 0.1);
        }
      });
    }
  }, [equalizerBands]);

  // Handle Track Changes
  useEffect(() => {
    if (!currentTrack) return;

    if (playerRef.current) {
      playerRef.current.stop();
      playerRef.current.unload();
    }

    const player = new Howl({
      src: [currentTrack.audioUrl],
      html5: false, // Use Web Audio for equalizer/analysis
      format: ['mp3', 'wav', 'ogg'],
      volume: volume,
      rate: playbackRate,
      xhr: {
        withCredentials: false
      },
      onplay: () => {
        // Ensure global controls
        Howler.mute(false);
        Howler.volume(1.0); // Global volume always 1, use individual sound volume
        if (Howler.ctx && Howler.ctx.state === 'suspended') {
          Howler.ctx.resume();
        }
      },
      onloaderror: (id, err) => {
        console.error('KMS Audio Engine: Load Error', id, err);
        const msg = language === 'EN' 
          ? `Failed to load audio: ${err}. Please check the URL or your connection.` 
          : `Échec du chargement de l'audio : ${err}. Veuillez vérifier l'URL ou votre connexion.`;
        setError(msg);
      },
      onplayerror: (id, err) => {
        console.error('KMS Audio Engine: Play Error', id, err);
        const msg = language === 'EN'
          ? `Playback error: ${err}. Click to retry.`
          : `Erreur de lecture : ${err}. Cliquez pour réessayer.`;
        setError(msg);
        Howler.ctx?.resume().then(() => player.play());
      },
      onload: () => {
        useMusicStore.getState().setProgress(0, player.duration());
      },
      onend: () => {
        useMusicStore.getState().nextTrack();
      }
    });

    playerRef.current = player;

    if (isPlaying) {
      player.play();
    }

    const interval = setInterval(() => {
      if (player && player.playing()) {
        useMusicStore.getState().setProgress(player.seek() as number, player.duration());
      }
    }, 500);

    return () => {
      player.unload();
      clearInterval(interval);
    };
  }, [currentTrack]);

  // Sync Play/Pause
  useEffect(() => {
    if (!playerRef.current) return;
    if (isPlaying) {
      if (!playerRef.current.playing()) {
        // Ensure context is resumed before playing
        if (Howler.ctx && Howler.ctx.state === 'suspended') {
          Howler.ctx.resume().then(() => {
            playerRef.current?.play();
          });
        } else {
          playerRef.current.play();
        }
      }
    } else {
      playerRef.current.pause();
    }
  }, [isPlaying]);

  // Sync Volume
  useEffect(() => {
    if (playerRef.current) {
      playerRef.current.volume(volume);
    }
  }, [volume]);

  // Sync Playback Rate
  useEffect(() => {
    if (playerRef.current) {
      playerRef.current.rate(playbackRate);
    }
  }, [playbackRate]);

  // Sync Seek (Manual)
  useEffect(() => {
    if (playerRef.current && Math.abs((playerRef.current.seek() as number) - currentTime) > 2) {
      playerRef.current.seek(currentTime);
    }
  }, [currentTime]);

  return null;
};

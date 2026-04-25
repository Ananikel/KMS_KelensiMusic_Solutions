import React, { useEffect, useRef } from 'react';
import { motion } from 'motion/react';

interface VisualizerProps {
  isPlaying: boolean;
}

export const Visualizer: React.FC<VisualizerProps> = ({ isPlaying }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    const bars = 40;
    const barWidth = 4;
    const barGap = 4;
    const data = new Array(bars).fill(0).map(() => Math.random() * 50);

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      gradient.addColorStop(0, '#bc13fe'); // Neon Purple
      gradient.addColorStop(1, '#00f2ff'); // Neon Cyan

      for (let i = 0; i < bars; i++) {
        const x = i * (barWidth + barGap);
        const targetHeight = isPlaying ? Math.random() * 80 + 10 : 5;
        data[i] += (targetHeight - data[i]) * 0.1;
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        // Draw rounded bars
        const height = data[i];
        const y = (canvas.height - height) / 2;
        
        // Draw centered bars
        ctx.roundRect(x, y, barWidth, height, 2);
        ctx.fill();
        
        // Add subtle glow
        if (isPlaying) {
          ctx.shadowBlur = 10;
          ctx.shadowColor = i % 2 === 0 ? '#bc13fe' : '#00f2ff';
        } else {
          ctx.shadowBlur = 0;
        }
      }

      animationId = requestAnimationFrame(render);
    };

    render();

    return () => cancelAnimationFrame(animationId);
  }, [isPlaying]);

  return (
    <div className="w-full h-32 flex items-center justify-center p-4">
      <canvas 
        ref={canvasRef} 
        width={320} 
        height={100} 
        className="w-full h-full opacity-80"
      />
    </div>
  );
};

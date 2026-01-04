import React, { useState, useEffect, useRef } from 'react';
import { useIndoorPacer } from '../hooks/useIndoorPacer';
import { GlassCard, PrimaryButton } from '../components/UIComponents';
import { Play, Pause, Zap, Trophy, Target, Camera, AlertTriangle } from 'lucide-react';

// Virtual Life Orb
interface LifeOrb {
  id: number;
  distanceTrigger: number; // At what meter distance does this appear?
  xOffset: number; // -50 to 50 (Left/Right)
  collected: boolean;
  type: 'COMMON' | 'RARE' | 'LEGENDARY';
}

const Mallathon: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [lifePoints, setLifePoints] = useState(0);
  const [hasCameraPermission, setHasCameraPermission] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  
  // The logic hook
  const { steps, distance, cadence, paceStatus, manualStep } = useIndoorPacer();

  // Game State
  const [orbs, setOrbs] = useState<LifeOrb[]>([]);

  // Initialize Orbs
  useEffect(() => {
    const newOrbs: LifeOrb[] = [];
    for (let i = 1; i <= 50; i++) {
      newOrbs.push({
        id: i,
        distanceTrigger: i * 10, // An orb every 10 meters
        xOffset: Math.random() * 80 - 40, // Random X pos
        collected: false,
        type: Math.random() > 0.9 ? 'LEGENDARY' : Math.random() > 0.7 ? 'RARE' : 'COMMON'
      });
    }
    setOrbs(newOrbs);
  }, []);

  // Collision Detection Loop
  useEffect(() => {
    if (!isPlaying) return;

    setOrbs(currentOrbs => {
      return currentOrbs.map(orb => {
        // Render window: Orb is visible if within 20m ahead
        const distanceToOrb = orb.distanceTrigger - distance;
        
        // Collection: if we pass it (distance > trigger) and haven't collected
        if (!orb.collected && distanceToOrb <= 0 && distanceToOrb > -2) {
            // Trigger Haptic (if mobile)
            if (navigator.vibrate) navigator.vibrate(50);
            
            // Score
            const points = orb.type === 'LEGENDARY' ? 50 : orb.type === 'RARE' ? 20 : 10;
            setLifePoints(p => p + points);
            return { ...orb, collected: true };
        }
        return orb;
      });
    });
  }, [distance, isPlaying]);

  // Camera Setup
  const startCamera = async () => {
    setCameraError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setHasCameraPermission(true);
      }
    } catch (err) {
      console.error("Camera failed", err);
      setCameraError("Camera access denied. Entering Simulation Mode.");
      setHasCameraPermission(false);
    }
    setIsPlaying(true);
  };

  const getOrbColor = (type: string) => {
    switch(type) {
      case 'LEGENDARY': return 'bg-hayat-gold shadow-[0_0_30px_#C2B280]';
      case 'RARE': return 'bg-purple-500 shadow-[0_0_20px_#a855f7]';
      default: return 'bg-hayat-teal shadow-[0_0_15px_#008080]';
    }
  };

  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col">
      {/* --- AR LAYER --- */}
      <div className="absolute inset-0 overflow-hidden">
        {hasCameraPermission ? (
          <video 
            ref={videoRef} 
            autoPlay 
            playsInline 
            className="w-full h-full object-cover opacity-80"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-b from-slate-900 to-slate-800 flex items-center justify-center">
            {/* Grid for virtual feel */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,255,0.1)_1px,transparent_1px)] bg-[size:40px_40px] [perspective:500px] rotate-x-60 transform origin-bottom opacity-20"></div>
          </div>
        )}

        {/* ORB RENDERING */}
        {isPlaying && orbs.map(orb => {
           const distanceToOrb = orb.distanceTrigger - distance;
           
           // Only render visible orbs (0 to 30m away)
           if (distanceToOrb < 0 || distanceToOrb > 30 || orb.collected) return null;

           // Perspective Math
           const scale = 1 - (distanceToOrb / 30); // 1 at 0m, 0 at 30m
           const translateY = distanceToOrb * 15; // Move down as it gets closer (floor effect)
           
           return (
             <div 
                key={orb.id}
                className={`absolute left-1/2 bottom-1/2 w-16 h-16 rounded-full transition-transform duration-300 ease-linear ${getOrbColor(orb.type)}`}
                style={{
                  transform: `translate(-50%, 50%) translate(${orb.xOffset}px, ${translateY}px) scale(${Math.max(0.1, scale)})`,
                  opacity: scale
                }}
             >
                <div className="absolute inset-0 bg-white/30 animate-pulse rounded-full"></div>
             </div>
           );
        })}
      </div>

      {/* --- HUD OVERLAY --- */}
      <div className="relative z-10 flex flex-col h-full pointer-events-none p-4 pb-24">
        
        {/* Top HUD */}
        <div className="flex justify-between items-start pt-safe">
           <GlassCard className="pointer-events-auto !p-3 !bg-black/40 !border-white/10 !backdrop-blur-xl">
              <div className="flex flex-col">
                 <span className="text-[10px] text-slate-300 uppercase tracking-widest">Squad Rank</span>
                 <span className="text-xl font-bold text-white flex items-center">
                    <Trophy size={16} className="text-hayat-gold mr-2" /> #4
                 </span>
              </div>
           </GlassCard>

           <GlassCard className="pointer-events-auto !p-3 !bg-black/40 !border-white/10 !backdrop-blur-xl">
              <div className="flex flex-col items-end">
                 <span className="text-[10px] text-slate-300 uppercase tracking-widest">Life Points</span>
                 <div className="flex items-center space-x-2">
                    <span className="text-2xl font-black text-hayat-gold drop-shadow-lg">{lifePoints}</span>
                    <Zap size={20} className="text-hayat-gold fill-hayat-gold" />
                 </div>
              </div>
           </GlassCard>
        </div>

        {/* Center Prompt */}
        {!isPlaying && (
           <div className="flex-1 flex flex-col items-center justify-center pointer-events-auto">
              <div className="text-center mb-8">
                 <h1 className="text-4xl font-bold text-white mb-2 tracking-tight">Mallathon</h1>
                 <p className="text-slate-300 max-w-xs mx-auto">Walk through Dubai Mall to collect Life Orbs. GPS free.</p>
              </div>
              <PrimaryButton onClick={startCamera} icon={Play} className="w-48 bg-hayat-gold text-hayat-night hover:bg-white">
                 Start Run
              </PrimaryButton>
           </div>
        )}

        {/* Bottom Pacing HUD */}
        {isPlaying && (
           <div className="mt-auto pointer-events-auto flex flex-col space-y-4">
              
              {/* Error Toast */}
              {cameraError && (
                <div className="mx-auto bg-orange-500/90 text-white px-4 py-2 rounded-full text-xs font-medium flex items-center shadow-lg animate-fade-in backdrop-blur-sm">
                  <AlertTriangle size={14} className="mr-2" />
                  {cameraError}
                </div>
              )}

              <div className="flex items-end justify-between">
                {/* Stats */}
                <div className="space-y-2">
                  <div className="bg-black/50 backdrop-blur-md rounded-lg p-3 border border-white/10">
                      <span className="text-xs text-slate-400 block">Distance</span>
                      <span className="text-lg font-mono font-bold text-white">{distance.toFixed(1)}m</span>
                  </div>
                  <div className="bg-black/50 backdrop-blur-md rounded-lg p-3 border border-white/10">
                      <span className="text-xs text-slate-400 block">Steps</span>
                      <span className="text-lg font-mono font-bold text-white">{steps}</span>
                  </div>
                </div>

                {/* Pacing Meter */}
                <div className="flex flex-col items-center mx-4 flex-1">
                  <div className={`text-sm font-bold mb-2 px-3 py-1 rounded-full ${
                      paceStatus === 'good' ? 'bg-green-500/20 text-green-400 border border-green-500/50' :
                      paceStatus === 'slow' ? 'bg-red-500/20 text-red-400 border border-red-500/50' :
                      paceStatus === 'fast' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/50' :
                      'bg-slate-500/20 text-slate-400'
                  }`}>
                      {paceStatus === 'idle' ? 'Start Walking' : 
                      paceStatus === 'good' ? 'Perfect Pace' :
                      paceStatus === 'slow' ? 'Speed Up' : 'Too Fast'}
                  </div>
                  
                  {/* Visual Gauge */}
                  <div className="w-full h-3 bg-slate-700 rounded-full overflow-hidden relative border border-white/10">
                      {/* Zones */}
                      <div className="absolute left-0 w-[30%] h-full bg-red-500/50"></div>
                      <div className="absolute left-[30%] w-[40%] h-full bg-green-500/50"></div>
                      <div className="absolute right-0 w-[30%] h-full bg-blue-500/50"></div>
                      
                      {/* Indicator */}
                      <div 
                          className="absolute top-0 bottom-0 w-1 bg-white shadow-[0_0_10px_white] transition-all duration-500 ease-out"
                          style={{ left: `${Math.min(Math.max((cadence / 160) * 100, 0), 100)}%` }}
                      ></div>
                  </div>
                  <span className="text-xs text-slate-400 mt-1">{cadence} SPM</span>
                </div>

                {/* Manual Step Trigger (For Desktop Testing) */}
                <button 
                    onClick={manualStep}
                    className="bg-white/10 hover:bg-white/20 active:scale-95 p-4 rounded-full border border-white/20 backdrop-blur-md transition-all"
                >
                    <Target size={24} className="text-white" />
                </button>
              </div>
           </div>
        )}
      </div>
    </div>
  );
};

export default Mallathon;
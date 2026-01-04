import React, { useState, useEffect, useRef } from 'react';
import { Fingerprint } from 'lucide-react';

interface OnboardingProps {
  onComplete: () => void;
}

const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
  const [isHolding, setIsHolding] = useState(false);
  const [progress, setProgress] = useState(0);
  const requestRef = useRef<number | null>(null);
  
  // Animation loop for smooth progress
  const animate = () => {
    setProgress((prev) => {
      if (prev >= 100) {
        return 100;
      }
      return prev + 1.5; // Speed of fill
    });
    requestRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    if (isHolding) {
      requestRef.current = requestAnimationFrame(animate);
    } else {
      setProgress(0);
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    }

    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [isHolding]);

  useEffect(() => {
    if (progress >= 100) {
      setTimeout(onComplete, 500); // Small delay before transition
    }
  }, [progress, onComplete]);

  return (
    <div className="h-screen w-full max-w-md mx-auto bg-hayat-night text-white flex flex-col items-center justify-between p-10 relative overflow-hidden">
      {/* Background Ambient Effect */}
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent to-black/80 z-0 pointer-events-none"></div>
      <div className="absolute -top-20 -right-20 w-64 h-64 bg-hayat-teal/20 rounded-full blur-[100px]"></div>

      <div className="z-10 mt-10 text-center animate-fade-in">
        <h1 className="text-3xl font-bold tracking-tighter mb-4 text-transparent bg-clip-text bg-gradient-to-r from-hayat-gold to-white">
          The Pledge
        </h1>
        <p className="text-slate-400 font-light text-lg leading-relaxed">
          "I pledge to prioritize my healthspan, nurture my community, and move naturally every day."
        </p>
      </div>

      {/* Fingerprint Scanner Interaction */}
      <div className="z-10 relative mb-20">
        <div 
          className="relative w-24 h-24 flex items-center justify-center cursor-pointer touch-none select-none"
          onMouseDown={() => setIsHolding(true)}
          onMouseUp={() => setIsHolding(false)}
          onMouseLeave={() => setIsHolding(false)}
          onTouchStart={() => setIsHolding(true)}
          onTouchEnd={() => setIsHolding(false)}
        >
          {/* Progress Ring */}
          <svg className="absolute w-32 h-32 -rotate-90 pointer-events-none">
             <circle 
               cx="64" cy="64" r="58" 
               stroke="#334155" strokeWidth="4" fill="transparent" 
             />
             <circle 
               cx="64" cy="64" r="58" 
               stroke="#008080" strokeWidth="4" fill="transparent"
               strokeDasharray="364"
               strokeDashoffset={364 - (364 * progress) / 100}
               strokeLinecap="round"
               className="transition-all duration-75 ease-linear"
             />
          </svg>

          {/* Fingerprint Icon */}
          <div className={`transition-all duration-500 ${progress >= 100 ? 'text-hayat-gold scale-110' : isHolding ? 'text-hayat-teal scale-100' : 'text-slate-500 scale-95 opacity-50'}`}>
            <Fingerprint size={64} strokeWidth={1} />
          </div>
          
          {/* Pulse Effect when holding */}
          {isHolding && progress < 100 && (
             <div className="absolute inset-0 bg-hayat-teal/20 rounded-full animate-ping pointer-events-none"></div>
          )}
        </div>
        <p className="text-xs text-center text-slate-500 mt-4 uppercase tracking-widest font-medium">
          {progress >= 100 ? "Identity Verified" : "Hold to Sign"}
        </p>
      </div>
    </div>
  );
};

export default Onboarding;
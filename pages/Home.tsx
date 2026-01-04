import React, { useState } from 'react';
import { UserStats, AppView } from '../types';
import BiometricRing from '../components/BiometricRing';
import { GlassCard, PrimaryButton } from '../components/UIComponents';
import { Zap, Bell, MapPin, ArrowRight, UserPlus } from 'lucide-react';

interface HomeProps {
  stats: UserStats;
  onNavigate?: (view: AppView) => void;
}

const Home: React.FC<HomeProps> = ({ stats, onNavigate }) => {
  const [nudged, setNudged] = useState(false);

  const handleNudge = () => {
    setNudged(true);
    setTimeout(() => setNudged(false), 3000);
  };

  return (
    <div className="space-y-6 pb-24 animate-fade-in">
      {/* Header */}
      <header className="flex justify-between items-center pt-2">
        <div>
          <h1 className="text-2xl font-bold text-hayat-night tracking-tight">Good Morning, Omar.</h1>
          <p className="text-hayat-slate text-sm">Let's improve your longevity today.</p>
        </div>
        <div className="relative">
          <div className="h-10 w-10 rounded-full bg-hayat-night text-white flex items-center justify-center font-bold shadow-md">
            O
          </div>
          <div className="absolute top-0 right-0 w-3 h-3 bg-hayat-orange rounded-full border-2 border-white"></div>
        </div>
      </header>

      {/* Main Card: Mental Wealth Score */}
      <GlassCard className="relative overflow-hidden border-hayat-teal/10 flex flex-col items-center py-8">
        <div className="absolute top-0 right-0 w-32 h-32 bg-hayat-gold/10 rounded-full -mr-10 -mt-10 blur-3xl"></div>
        
        <h2 className="text-sm font-semibold text-hayat-slate uppercase tracking-wider mb-6">Mental Wealth Score</h2>
        <BiometricRing score={stats.vitalityScore} label="" />
        
        <p className="text-center text-hayat-slate text-sm max-w-[200px] mt-4">
          Your mindfulness and social connections are peaking today.
        </p>
      </GlassCard>

      {/* Sub-section: Your Moai Squad */}
      <div className="space-y-3">
        <div className="flex justify-between items-end px-1">
          <h3 className="font-bold text-hayat-night text-lg">Your Moai Squad</h3>
          <span className="text-xs font-medium text-hayat-teal bg-hayat-teal/10 px-2 py-1 rounded-md">
            2/5 Active Today
          </span>
        </div>
        
        <GlassCard className="flex items-center justify-between p-4">
          <div className="flex -space-x-3">
             <img src="https://picsum.photos/seed/10/50" className="w-10 h-10 rounded-full border-2 border-white grayscale" alt="Squad" />
             <img src="https://picsum.photos/seed/12/50" className="w-10 h-10 rounded-full border-2 border-white ring-2 ring-hayat-green" alt="Squad" />
             <img src="https://picsum.photos/seed/13/50" className="w-10 h-10 rounded-full border-2 border-white grayscale" alt="Squad" />
             <img src="https://picsum.photos/seed/14/50" className="w-10 h-10 rounded-full border-2 border-white ring-2 ring-hayat-green" alt="Squad" />
          </div>

          <button 
            onClick={handleNudge}
            disabled={nudged}
            className={`flex items-center space-x-2 text-xs font-bold px-4 py-2 rounded-full transition-all ${
              nudged 
                ? 'bg-hayat-green text-white' 
                : 'bg-hayat-night text-white hover:bg-slate-800'
            }`}
          >
            {nudged ? (
              <span>Nudged!</span>
            ) : (
              <>
                <Bell size={14} />
                <span>Nudge Squad</span>
              </>
            )}
          </button>
        </GlassCard>
      </div>

      {/* Bottom Section: Today's Mallathon */}
      <div className="pt-2">
        <h3 className="font-bold text-hayat-night text-lg mb-3 px-1">Today's Mallathon</h3>
        <GlassCard noPadding className="group relative h-48 cursor-pointer" onClick={() => onNavigate?.(AppView.MALLATHON)}>
          <img 
            src="https://images.unsplash.com/photo-1582037928769-181f2644ecb7?q=80&w=800&auto=format&fit=crop" 
            alt="Dubai Mall" 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            onError={(e) => {
              // Fallback if image fails
              e.currentTarget.style.display = 'none';
              e.currentTarget.parentElement?.classList.add('bg-gradient-to-br', 'from-slate-800', 'to-hayat-night');
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-5">
             <div className="flex justify-between items-end">
                <div>
                  <h4 className="text-white font-bold text-xl">Dubai Mall Circuit</h4>
                  <div className="flex items-center text-slate-300 text-xs mt-1">
                     <MapPin size={12} className="mr-1" /> Grand Atrium Start
                  </div>
                </div>
                <div className="w-10 h-10 bg-hayat-gold text-hayat-night rounded-full flex items-center justify-center">
                   <ArrowRight size={20} />
                </div>
             </div>
          </div>
        </GlassCard>
      </div>
    </div>
  );
};

export default Home;
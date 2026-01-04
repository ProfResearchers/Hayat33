import React, { useState } from 'react';
import Navigation from './components/Navigation';
import Home from './pages/Home';
import Explore from './pages/Explore';
import Community from './pages/Community';
import HayatCoach from './pages/HayatCoach';
import Mallathon from './pages/Mallathon';
import NutriGuard from './pages/NutriGuard';
import Onboarding from './pages/Onboarding';
import PrivacySettings from './pages/PrivacySettings';
import { GlassCard } from './components/UIComponents';
import { AppView, UserStats } from './types';
import { ChevronRight, Shield } from 'lucide-react';

const App: React.FC = () => {
  const [onboardingComplete, setOnboardingComplete] = useState(false);
  const [currentView, setCurrentView] = useState<AppView>(AppView.HOME);

  // Mock initial data
  const [userStats] = useState<UserStats>({
    steps: 6432,
    stepsGoal: 10000,
    vitalityScore: 82, // Updated for Mental Wealth Score context
    moaiRank: 'Connector'
  });

  const handlePledgeComplete = () => {
    setOnboardingComplete(true);
  };

  const handleDeleteAccount = () => {
    // In a real app, this would call the API endpoint connected to the SQL function
    alert("Account wipe initiated. Redirecting to onboarding...");
    setOnboardingComplete(false);
    setCurrentView(AppView.HOME);
  };

  const renderView = () => {
    switch (currentView) {
      case AppView.HOME:
        return <Home stats={userStats} onNavigate={setCurrentView} />;
      case AppView.EXPLORE:
        return <Explore />;
      case AppView.MALLATHON:
        return <Mallathon />;
      case AppView.NUTRIGUARD:
        return <NutriGuard />;
      case AppView.COMMUNITY:
        return <Community />;
      case AppView.COACH:
        return <HayatCoach />;
      case AppView.PRIVACY:
        return <PrivacySettings onBack={() => setCurrentView(AppView.PROFILE)} onDeleteAccount={handleDeleteAccount} />;
      case AppView.PROFILE:
        return (
          <div className="flex flex-col items-center justify-center h-[70vh] text-center p-6 animate-fade-in">
             <div className="w-28 h-28 p-1 rounded-full border-2 border-hayat-gold border-dashed mb-4">
                <div className="w-full h-full bg-slate-200 rounded-full overflow-hidden">
                   <img src="https://picsum.photos/200" alt="Profile" className="w-full h-full object-cover" />
                </div>
             </div>
            <h2 className="text-2xl font-bold text-hayat-night">Omar Al-Futtaim</h2>
            <p className="text-hayat-slate mb-8">Downtown Dubai</p>
            
            <GlassCard className="w-full text-left">
              <h3 className="font-semibold mb-4 text-hayat-night">Settings</h3>
              <div className="space-y-2 text-sm text-hayat-slate">
                <div className="flex justify-between items-center p-3 border-b border-slate-100">
                  <span>Notifications</span>
                  <span className="text-hayat-teal font-medium">On</span>
                </div>
                
                {/* Privacy Link */}
                <button 
                  onClick={() => setCurrentView(AppView.PRIVACY)}
                  className="w-full flex justify-between items-center p-3 border-b border-slate-100 hover:bg-slate-50 transition-colors rounded-lg group"
                >
                  <div className="flex items-center text-hayat-night font-medium">
                    <Shield size={16} className="mr-2 text-hayat-teal" />
                    Data Privacy & Residency
                  </div>
                  <ChevronRight size={16} className="text-slate-400 group-hover:text-hayat-teal" />
                </button>

                 <div className="flex justify-between items-center p-3">
                  <span>Language</span>
                  <span className="text-hayat-teal font-medium">English / العربية</span>
                </div>
              </div>
            </GlassCard>
          </div>
        );
      default:
        return <Home stats={userStats} onNavigate={setCurrentView} />;
    }
  };

  if (!onboardingComplete) {
    return <Onboarding onComplete={handlePledgeComplete} />;
  }

  return (
    <div className="min-h-screen bg-hayat-pearl font-sans text-hayat-night selection:bg-hayat-gold/30">
      <div className="max-w-md mx-auto min-h-screen bg-hayat-pearl/50 shadow-2xl shadow-hayat-night/5 overflow-hidden relative">
         <main className="p-5 min-h-[calc(100vh-80px)]">
           {renderView()}
         </main>
         {/* Hide nav in AR mode or Privacy mode for focus */}
         {currentView !== AppView.MALLATHON && currentView !== AppView.PRIVACY && (
           <Navigation currentView={currentView} onNavigate={setCurrentView} />
         )}
      </div>
    </div>
  );
};

export default App;
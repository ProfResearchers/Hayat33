import React from 'react';
import { Home, Map, Users, Bot, Zap, ScanBarcode } from 'lucide-react';
import { AppView } from '../types';

interface NavigationProps {
  currentView: AppView;
  onNavigate: (view: AppView) => void;
}

const Navigation: React.FC<NavigationProps> = ({ currentView, onNavigate }) => {
  const navItems = [
    { view: AppView.HOME, icon: Home, label: 'Home' },
    { view: AppView.EXPLORE, icon: Map, label: 'Explore' },
    { view: AppView.MALLATHON, icon: Zap, label: 'Run' },
    { view: AppView.NUTRIGUARD, icon: ScanBarcode, label: 'Scan' },
    { view: AppView.COMMUNITY, icon: Users, label: 'Moai' },
    { view: AppView.COACH, icon: Bot, label: 'Hayat' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white/85 backdrop-blur-xl border-t border-white/50 pb-safe pt-2 px-4 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] z-50">
      <div className="flex justify-between items-center max-w-md mx-auto h-16">
        {navItems.map((item) => {
          const isActive = currentView === item.view;
          return (
            <button
              key={item.view}
              onClick={() => onNavigate(item.view)}
              className={`flex flex-col items-center justify-center w-14 transition-all duration-300 ${
                isActive ? 'text-hayat-teal -translate-y-1' : 'text-hayat-slate/70'
              }`}
            >
              <item.icon
                size={isActive ? 24 : 22}
                strokeWidth={isActive ? 2.5 : 2}
                className={`mb-1 transition-transform ${isActive ? 'scale-110' : ''}`}
              />
              <span className="text-[10px] font-medium tracking-wide">
                {item.label}
              </span>
              {isActive && (
                <span className="absolute -bottom-1 w-1 h-1 bg-hayat-teal rounded-full" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default Navigation;
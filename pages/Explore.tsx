import React, { useState, useEffect } from 'react';
import { IndoorRoute } from '../types';
import { suggestIndoorRoutes } from '../services/geminiService';
import { GlassCard, SectionHeader, PrimaryButton } from '../components/UIComponents';
import { MapPin, Clock, Users, Navigation as NavIcon, RefreshCw } from 'lucide-react';

const Explore: React.FC = () => {
  const [routes, setRoutes] = useState<IndoorRoute[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  const fetchRoutes = async () => {
    setLoading(true);
    // Mock user context
    const suggested = await suggestIndoorRoutes("Downtown Dubai", "afternoon");
    
    // Defensive check
    const safeSuggested = Array.isArray(suggested) ? suggested : [];

    // Transform raw data
    const enhancedRoutes = safeSuggested.map((r: any, idx: number) => ({
      ...r,
      name: r.name || "Unknown Route",
      location: r.location || "Dubai",
      distance: r.distance || "-- km",
      duration: r.duration || "-- min",
      crowdLevel: r.crowdLevel || "Moderate",
      features: Array.isArray(r.features) ? r.features : [],
      id: `route-${idx}`,
      imageUrl: `https://picsum.photos/seed/${idx + 12}/400/200`
    }));
    
    setRoutes(enhancedRoutes);
    setLoading(false);
    setRefreshing(false);
  };

  useEffect(() => {
    fetchRoutes();
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchRoutes();
  };

  return (
    <div className="space-y-4 pb-24">
      <SectionHeader 
        title="Climate Adaptive" 
        subtitle="Indoor routes for longevity."
        action={
          <button 
            onClick={handleRefresh}
            className={`p-2 rounded-full bg-white shadow-sm border border-slate-100 text-hayat-teal ${refreshing ? 'animate-spin' : ''}`}
          >
            <RefreshCw size={20} />
          </button>
        }
      />

      {/* Filter Chips */}
      <div className="flex space-x-2 overflow-x-auto no-scrollbar pb-2">
        {['Nearby', 'Least Crowded', 'Scenic', 'Air Conditioned'].map(filter => (
          <button key={filter} className="px-4 py-1.5 bg-white rounded-full text-xs font-medium text-hayat-slate border border-slate-200 whitespace-nowrap hover:border-hayat-teal hover:text-hayat-teal transition-colors">
            {filter}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="w-8 h-8 border-4 border-hayat-teal border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm text-hayat-slate mt-4">Consulting the city grid...</p>
        </div>
      ) : (
        <div className="space-y-4">
          {routes.map((route) => (
            <GlassCard key={route.id} noPadding className="group">
              <div className="relative h-36 bg-slate-200">
                <img src={route.imageUrl} alt={route.name} className="w-full h-full object-cover" />
                <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-2 py-1 rounded-md text-xs font-bold text-hayat-night flex items-center shadow-sm">
                  <MapPin size={12} className="mr-1" />
                  {route.location}
                </div>
                <div className="absolute bottom-3 right-3 bg-hayat-teal text-white px-3 py-1 rounded-full text-xs font-medium shadow-sm">
                  {route.distance}
                </div>
              </div>
              <div className="p-5">
                <div className="flex justify-between items-start">
                  <h3 className="font-bold text-hayat-night text-lg">{route.name}</h3>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full border font-medium ${
                    route.crowdLevel === 'Low' ? 'bg-green-50 text-green-700 border-green-200' :
                    route.crowdLevel === 'High' ? 'bg-orange-50 text-orange-700 border-orange-200' :
                    'bg-yellow-50 text-yellow-700 border-yellow-200'
                  }`}>
                    {route.crowdLevel} Traffic
                  </span>
                </div>
                
                <div className="flex items-center text-hayat-slate text-xs mt-3 space-x-4">
                  <div className="flex items-center">
                    <Clock size={14} className="mr-1" />
                    {route.duration}
                  </div>
                  <div className="flex items-center">
                    <Users size={14} className="mr-1" />
                    Popular
                  </div>
                </div>

                <div className="mt-3 flex flex-wrap gap-1">
                  {route.features && route.features.map((feature, i) => (
                    <span key={i} className="text-[10px] text-hayat-slate bg-slate-50 px-2 py-1 rounded-md">
                      {feature}
                    </span>
                  ))}
                </div>

                <PrimaryButton className="w-full mt-5 rounded-xl" icon={NavIcon}>
                  Start Route
                </PrimaryButton>
              </div>
            </GlassCard>
          ))}
          
          {routes.length === 0 && (
            <div className="text-center py-10 text-hayat-slate text-sm">
              No routes found nearby.
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Explore;
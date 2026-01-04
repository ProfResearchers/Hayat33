import React, { useState, useRef } from 'react';
import { analyzeFoodImage } from '../services/geminiService';
import { NutriScanResult } from '../types';
import { GlassCard, PrimaryButton, SectionHeader } from '../components/UIComponents';
import { Camera, Upload, AlertCircle, CheckCircle, Leaf, Loader2, ArrowRight } from 'lucide-react';

const NutriGuard: React.FC = () => {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<NutriScanResult | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
        setResult(null); // Reset previous result
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyze = async () => {
    if (!imagePreview) return;

    setAnalyzing(true);
    // Remove data:image/jpeg;base64, prefix
    const base64Data = imagePreview.split(',')[1];
    
    const data = await analyzeFoodImage(base64Data);
    setResult(data);
    setAnalyzing(false);
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-6 pb-24">
      <SectionHeader 
        title="Nutri-Guard" 
        subtitle="AI biological aging scanner." 
        action={<Leaf className="text-hayat-green" />}
      />

      {/* Upload Area */}
      {!result && (
        <GlassCard className="flex flex-col items-center justify-center min-h-[300px] border-dashed border-2 border-hayat-teal/30">
          {imagePreview ? (
            <div className="relative w-full h-64 rounded-xl overflow-hidden mb-4">
              <img src={imagePreview} alt="Food Preview" className="w-full h-full object-cover" />
              <button 
                onClick={() => setImagePreview(null)}
                className="absolute top-2 right-2 bg-black/50 text-white p-1 rounded-full"
              >
                <AlertCircle size={16} />
              </button>
            </div>
          ) : (
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-hayat-teal/10 rounded-full flex items-center justify-center mx-auto mb-4 text-hayat-teal">
                <Camera size={32} />
              </div>
              <p className="text-hayat-slate mb-4 text-sm">Snap a photo of your meal to analyze its aging impact.</p>
            </div>
          )}

          <input 
            type="file" 
            ref={fileInputRef} 
            accept="image/*" 
            capture="environment"
            className="hidden" 
            onChange={handleFileChange}
          />

          {!imagePreview ? (
            <PrimaryButton onClick={triggerFileInput} icon={Camera}>
              Take Photo
            </PrimaryButton>
          ) : (
            <PrimaryButton 
              onClick={handleAnalyze} 
              disabled={analyzing} 
              className={analyzing ? "bg-hayat-slate" : ""}
            >
              {analyzing ? (
                <span className="flex items-center"><Loader2 className="animate-spin mr-2" /> Analyzing...</span>
              ) : (
                "Analyze Impact"
              )}
            </PrimaryButton>
          )}
        </GlassCard>
      )}

      {/* Results View */}
      {result && (
        <div className="space-y-4 animate-fade-in">
          {/* Score Card */}
          <GlassCard className="relative overflow-hidden">
            <div className={`absolute top-0 left-0 w-2 h-full ${
              result.agingScore > 7 ? 'bg-hayat-orange' : 
              result.agingScore > 4 ? 'bg-hayat-gold' : 'bg-hayat-green'
            }`}></div>
            
            <div className="flex justify-between items-start pl-4">
              <div>
                <h3 className="text-2xl font-bold text-hayat-night">{result.foodName}</h3>
                <div className="flex items-center mt-1 space-x-2">
                   <span className="text-xs text-hayat-slate uppercase tracking-wider">Aging Score</span>
                   <span className={`text-lg font-bold ${
                      result.agingScore > 7 ? 'text-hayat-orange' : 
                      result.agingScore > 4 ? 'text-hayat-gold' : 'text-hayat-green'
                   }`}>{result.agingScore}/10</span>
                </div>
              </div>
              
              <div className={`px-3 py-1 rounded-full text-xs font-bold border ${
                 result.glycemicLoad === 'High' ? 'bg-red-50 text-red-600 border-red-100' :
                 result.glycemicLoad === 'Medium' ? 'bg-orange-50 text-orange-600 border-orange-100' :
                 'bg-green-50 text-green-600 border-green-100'
              }`}>
                GL: {result.glycemicLoad}
              </div>
            </div>

            <p className="mt-4 text-sm text-hayat-night leading-relaxed pl-4">
              {result.analysis}
            </p>

            {result.preservatives.length > 0 && (
              <div className="mt-4 pl-4">
                <span className="text-xs text-hayat-slate block mb-1">Detected Additives:</span>
                <div className="flex flex-wrap gap-1">
                  {result.preservatives.map((p, i) => (
                    <span key={i} className="text-[10px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded-md">
                      {p}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </GlassCard>

          {/* Suggestion Card */}
          <GlassCard className="bg-gradient-to-br from-hayat-teal to-cyan-800 text-white border-none shadow-lg shadow-hayat-teal/20">
             <div className="flex items-start space-x-3">
                <Leaf className="shrink-0 text-hayat-gold mt-1" />
                <div>
                   <h4 className="font-bold text-lg text-white">Try this Local Switch</h4>
                   <p className="text-white/90 font-medium text-lg mt-1">{result.suggestion.name}</p>
                   <p className="text-xs text-white/70 mt-1">{result.suggestion.reason}</p>
                   
                   <div className="mt-4 inline-flex items-center bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-lg text-xs border border-white/10">
                      <CheckCircle size={12} className="mr-2 text-hayat-green" />
                      Available at: {result.suggestion.location}
                   </div>
                </div>
             </div>
          </GlassCard>

          <button 
            onClick={() => { setResult(null); setImagePreview(null); }}
            className="w-full py-4 text-hayat-slate text-sm font-medium hover:text-hayat-teal transition-colors flex items-center justify-center"
          >
            Scan Another Meal <ArrowRight size={16} className="ml-1" />
          </button>
        </div>
      )}
    </div>
  );
};

export default NutriGuard;
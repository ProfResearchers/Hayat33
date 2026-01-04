import React, { useState } from 'react';
import { GlassCard, PrimaryButton, SectionHeader } from '../components/UIComponents';
import { Shield, Server, Activity, Trash2, ChevronLeft, Lock, CheckCircle, EyeOff } from 'lucide-react';
import { AppView } from '../types';

interface PrivacySettingsProps {
  onBack: () => void;
  onDeleteAccount: () => void;
}

const PrivacySettings: React.FC<PrivacySettingsProps> = ({ onBack, onDeleteAccount }) => {
  const [biometricSync, setBiometricSync] = useState(true);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  return (
    <div className="space-y-6 pb-24 animate-fade-in relative">
      <div className="flex items-center mb-4">
        <button onClick={onBack} className="mr-3 p-2 rounded-full hover:bg-slate-100 transition-colors">
          <ChevronLeft size={24} className="text-hayat-night" />
        </button>
        <h1 className="text-2xl font-bold text-hayat-night tracking-tight">Data Sovereignty</h1>
      </div>

      {/* 1. Data Residency Compliance */}
      <GlassCard className="border-l-4 border-l-hayat-green relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-10">
           <Server size={100} />
        </div>
        <div className="flex items-center space-x-3 mb-2">
           <div className="p-2 bg-hayat-green/10 rounded-full text-hayat-green">
             <Shield size={20} />
           </div>
           <h3 className="font-bold text-hayat-night">UAE Data Residency</h3>
        </div>
        <p className="text-sm text-hayat-slate leading-relaxed mb-3">
          Your Personal Identifiable Information (PII) is encrypted and physically stored within the United Arab Emirates, in compliance with Federal Decree-Law No. 45 of 2021.
        </p>
        <div className="flex items-center text-xs font-mono text-hayat-teal bg-hayat-teal/5 px-3 py-2 rounded-lg border border-hayat-teal/20 w-fit">
           <CheckCircle size={12} className="mr-2" />
           REGION: me-central-1 (Dubai)
        </div>
      </GlassCard>

      {/* 2. Biometric Handling */}
      <GlassCard>
        <SectionHeader title="Biometric Privacy" subtitle="Edge computing protocols." />
        
        <div className="flex items-center justify-between mb-4">
           <div className="flex items-start space-x-3 max-w-[80%]">
              <Activity className="text-hayat-slate mt-1 shrink-0" size={20} />
              <div>
                <h4 className="font-semibold text-hayat-night text-sm">Vitality Score Only</h4>
                <p className="text-xs text-hayat-slate mt-1">
                   We do NOT store raw heart rate or GPS data. Only your daily aggregated score is synced to our servers.
                </p>
              </div>
           </div>
           <div 
             onClick={() => setBiometricSync(!biometricSync)}
             className={`w-12 h-6 rounded-full p-1 cursor-pointer transition-colors duration-300 ${biometricSync ? 'bg-hayat-teal' : 'bg-slate-300'}`}
           >
             <div className={`w-4 h-4 bg-white rounded-full shadow-sm transition-transform duration-300 ${biometricSync ? 'translate-x-6' : 'translate-x-0'}`} />
           </div>
        </div>
      </GlassCard>

      {/* 3. Privacy Policy Snippet */}
      <div className="bg-white/50 p-5 rounded-2xl border border-white/50 text-xs text-hayat-slate leading-relaxed">
        <h4 className="font-bold text-hayat-night mb-2 flex items-center">
           <Lock size={12} className="mr-1" /> Privacy Policy Statement
        </h4>
        <p>
          "Hayat 33 is committed to protecting your digital rights. We utilize end-to-end encryption (TLS 1.3) for all data in transit. 
          We perform nightly PII stripping on analytics tables, ensuring your behavioral data cannot be traced back to your identity 
          without your explicit consent key."
        </p>
      </div>

      {/* 4. Right to be Forgotten */}
      <div className="pt-8 border-t border-slate-200">
        {!showDeleteConfirm ? (
          <button 
            onClick={() => setShowDeleteConfirm(true)}
            className="w-full flex items-center justify-center space-x-2 text-red-500 font-medium p-4 hover:bg-red-50 rounded-xl transition-colors"
          >
            <Trash2 size={18} />
            <span>Delete My Account & Wipe Data</span>
          </button>
        ) : (
          <GlassCard className="!bg-red-50 !border-red-100 animate-fade-in">
             <div className="text-center mb-4">
               <AlertIcon />
               <h3 className="text-red-600 font-bold mb-1">Permanent Action</h3>
               <p className="text-xs text-red-500/80">
                 This triggers an immediate cascading delete of all your PII, Moai memberships, and activity history. This cannot be undone.
               </p>
             </div>
             <div className="flex space-x-3">
               <button 
                 onClick={() => setShowDeleteConfirm(false)}
                 className="flex-1 py-3 bg-white text-slate-600 font-medium rounded-xl shadow-sm"
               >
                 Cancel
               </button>
               <button 
                 onClick={onDeleteAccount}
                 className="flex-1 py-3 bg-red-500 text-white font-bold rounded-xl shadow-lg shadow-red-500/20"
               >
                 Confirm Wipe
               </button>
             </div>
          </GlassCard>
        )}
      </div>
    </div>
  );
};

const AlertIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-500 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
  </svg>
);

export default PrivacySettings;
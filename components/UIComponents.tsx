import React from 'react';

// Primary Button: Pill-shaped, Future Teal, suggests movement
export interface PrimaryButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  icon?: React.ElementType;
  className?: string;
  disabled?: boolean;
}

export const PrimaryButton: React.FC<PrimaryButtonProps> = ({ 
  children, 
  onClick, 
  icon: Icon, 
  className = '',
  disabled = false
}) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`bg-hayat-teal text-white font-medium px-6 py-3.5 rounded-full shadow-lg shadow-hayat-teal/20 
      active:scale-95 transition-all duration-200 flex items-center justify-center 
      disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
  >
    {Icon && <Icon size={20} className="mr-2" />}
    {children}
  </button>
);

// Glass Card: 16px radius, backdrop blur, "Mirage" effect
export interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  noPadding?: boolean;
  onClick?: () => void;
}

export const GlassCard: React.FC<GlassCardProps> = ({ 
  children, 
  className = '',
  noPadding = false,
  onClick
}) => (
  <div 
    onClick={onClick}
    className={`bg-white/80 backdrop-blur-md border border-white/50 shadow-sm rounded-2xl overflow-hidden ${noPadding ? '' : 'p-5'} ${className}`}
  >
    {children}
  </div>
);

// Section Header: Typography Hierarchy
export interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  className?: string;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({ 
  title, 
  subtitle, 
  action,
  className = ''
}) => (
  <div className={`flex justify-between items-end mb-4 ${className}`}>
    <div>
      <h2 className="text-2xl font-semibold text-hayat-night tracking-tight">{title}</h2>
      {subtitle && <p className="text-hayat-slate text-sm mt-1">{subtitle}</p>}
    </div>
    {action}
  </div>
);
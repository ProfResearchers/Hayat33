import React from 'react';

interface BiometricRingProps {
  score: number;
  label: string;
}

const BiometricRing: React.FC<BiometricRingProps> = ({ score, label }) => {
  // SVG config
  const radius = 50;
  const stroke = 8;
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (score / 100) * circumference;
  
  // Color Logic based on new palette
  // >70 Green (Success), >40 Gold (Secondary), else Orange (Alert)
  const strokeColor = score > 70 ? '#10B981' : score > 40 ? '#C2B280' : '#F97316';

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="relative w-32 h-32 flex items-center justify-center">
        <svg
          height={radius * 2}
          width={radius * 2}
          className="rotate-[-90deg] transition-all duration-1000 ease-out"
        >
          <circle
            stroke="#E2E8F0" 
            strokeWidth={stroke}
            fill="transparent"
            r={normalizedRadius}
            cx={radius}
            cy={radius}
          />
          <circle
            stroke={strokeColor}
            strokeWidth={stroke}
            strokeDasharray={circumference + ' ' + circumference}
            style={{ strokeDashoffset }}
            strokeLinecap="round"
            fill="transparent"
            r={normalizedRadius}
            cx={radius}
            cy={radius}
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-hayat-night">
          <span className="text-3xl font-bold">{score}</span>
          <span className="text-xs uppercase tracking-wider text-hayat-slate">Score</span>
        </div>
      </div>
      <p className="mt-2 text-sm font-medium text-hayat-night">{label}</p>
    </div>
  );
};

export default BiometricRing;
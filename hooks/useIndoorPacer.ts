import { useState, useEffect, useCallback, useRef } from 'react';

interface PacerState {
  isSupported: boolean;
  steps: number;
  cadence: number; // Steps per minute
  distance: number; // Meters
  paceStatus: 'slow' | 'good' | 'fast' | 'idle';
}

export const useIndoorPacer = (strideLength: number = 0.76) => {
  const [state, setState] = useState<PacerState>({
    isSupported: typeof window !== 'undefined' && !!window.DeviceMotionEvent,
    steps: 0,
    cadence: 0,
    distance: 0,
    paceStatus: 'idle',
  });

  const lastStepTime = useRef<number>(0);
  const stepBuffer = useRef<number[]>([]); // Store timestamps of last 5 steps for cadence
  const lastAccel = useRef<{ x: number; y: number; z: number }>({ x: 0, y: 0, z: 0 });

  // Pedometer Algorithm (Simplified for Web Audio/Motion API)
  const handleMotion = useCallback((event: DeviceMotionEvent) => {
    const { accelerationIncludingGravity } = event;
    if (!accelerationIncludingGravity) return;

    const { x = 0, y = 0, z = 0 } = accelerationIncludingGravity;
    
    // Calculate magnitude vector
    const magnitude = Math.sqrt((x || 0)**2 + (y || 0)**2 + (z || 0)**2);
    
    // Threshold for a step (taking gravity ~9.8m/s into account)
    // A step usually creates a peak > 12-13 m/s^2
    const STEP_THRESHOLD = 11.5; 
    const now = Date.now();

    // Debounce steps (at least 300ms between steps)
    if (magnitude > STEP_THRESHOLD && (now - lastStepTime.current > 350)) {
      registerStep(now);
      lastStepTime.current = now;
    }

    lastAccel.current = { x: x || 0, y: y || 0, z: z || 0 };
  }, [strideLength]);

  const registerStep = (now: number) => {
    // Update Cadence
    stepBuffer.current = [...stepBuffer.current, now].slice(-5); // Keep last 5
    
    let currentCadence = 0;
    if (stepBuffer.current.length > 1) {
      const duration = (stepBuffer.current[stepBuffer.current.length - 1] - stepBuffer.current[0]) / 1000;
      const stepsInDuration = stepBuffer.current.length - 1;
      currentCadence = Math.round((stepsInDuration / duration) * 60);
    }

    // Determine Status
    let status: PacerState['paceStatus'] = 'good';
    if (currentCadence < 60) status = 'slow';
    else if (currentCadence > 130) status = 'fast';

    setState(prev => ({
      ...prev,
      steps: prev.steps + 1,
      distance: prev.distance + strideLength,
      cadence: currentCadence,
      paceStatus: status
    }));
  };

  // Manual trigger for testing on Desktop
  const manualStep = () => {
    const now = Date.now();
    registerStep(now);
  };

  useEffect(() => {
    if (typeof window !== 'undefined' && window.DeviceMotionEvent) {
      // Note: iOS 13+ requires permission request, handling that in UI
      window.addEventListener('devicemotion', handleMotion);
    }
    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('devicemotion', handleMotion);
      }
    };
  }, [handleMotion]);

  // Decay cadence if no steps detected
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      if (now - lastStepTime.current > 2000) {
        setState(prev => ({ ...prev, cadence: 0, paceStatus: 'idle' }));
        stepBuffer.current = [];
      }
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return { ...state, manualStep };
};
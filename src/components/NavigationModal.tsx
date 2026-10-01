import React, { useState, useEffect } from 'react';
import { Carpark } from '../types/index.ts';

interface NavigationModalProps {
  carpark: Carpark;
  onClose: () => void;
}

export const NavigationModal: React.FC<NavigationModalProps> = ({ carpark, onClose }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isMuted, setIsMuted] = useState(false);

  const steps = [
    {
      instruction: `Head south-west on Paterson Hill towards Orchard Road`,
      subText: 'Continue for 180m',
      icon: 'straight',
      distance: '180m'
    },
    {
      instruction: `Turn left onto Orchard Boulevard (Bus lane active: 7:30am - 8pm)`,
      subText: 'Keep to the 2nd right lane',
      icon: 'turn_left',
      distance: '220m'
    },
    {
      instruction: carpark.mapEntranceNote || `Turn right into ${carpark.name} Gantry`,
      subText: `Approach ${carpark.entranceLane} • Watch clearance: ${carpark.heightClearance}m`,
      icon: 'turn_right',
      distance: '50m'
    },
    {
      instruction: `Arrived at ${carpark.name}`,
      subText: `EPS camera detected • Barrier opening • Proceed to B2/B3`,
      icon: 'where_to_vote',
      distance: '0m'
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentStep((prev) => (prev < steps.length - 1 ? prev + 1 : prev));
    }, 4000);
    return () => clearInterval(timer);
  }, [steps.length]);

  const step = steps[currentStep];

  const openExternal = (type: 'google' | 'waze' | 'apple') => {
    const lat = carpark.lat;
    const lng = carpark.lng;
    let url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
    if (type === 'waze') {
      url = `https://waze.com/ul?ll=${lat},${lng}&navigate=yes`;
    } else if (type === 'apple') {
      url = `https://maps.apple.com/?daddr=${lat},${lng}`;
    }
    window.open(url, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-lg mx-auto bg-surface-container-lowest rounded-t-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Navigation Top Bar */}
        <div className="bg-primary text-on-primary p-space-md flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-secondary animate-pulse"></span>
            <span className="font-headline-sm text-[15px] font-semibold text-on-primary">
              Turn-by-Turn GPS Guidance
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsMuted(!isMuted)}
              aria-label={isMuted ? 'Unmute voice' : 'Mute voice'}
              className="p-1.5 rounded-full bg-surface-container-highest/20 hover:bg-surface-container-highest/30 transition-colors cursor-pointer text-on-primary"
            >
              <span className="material-symbols-outlined text-[18px]">
                {isMuted ? 'volume_off' : 'volume_up'}
              </span>
            </button>
            <button
              onClick={onClose}
              aria-label="Exit navigation"
              className="p-1.5 rounded-full bg-surface-container-highest/20 hover:bg-surface-container-highest/30 transition-colors cursor-pointer text-on-primary"
            >
              <span className="material-symbols-outlined text-[18px]">close</span>
            </button>
          </div>
        </div>

        {/* Current Maneuver Instruction Banner */}
        <div className="bg-secondary p-space-md text-on-secondary flex items-start gap- space-sm">
          <div className="w-12 h-12 rounded-xl bg-on-secondary/15 flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-[32px] text-on-secondary">
              {step.icon}
            </span>
          </div>
          <div className="min-w-0 flex-1 ml-3">
            <div className="font-label-meta text-label-meta uppercase tracking-wider text-secondary-container font-semibold">
              {step.distance !== '0m' ? `In ${step.distance}` : 'Destination Ahead'}
            </div>
            <div className="font-headline-md text-[17px] text-on-secondary leading-snug font-bold">
              {step.instruction}
            </div>
            <div className="font-body-sm text-[12px] text-on-secondary/80 mt-0.5">
              {step.subText}
            </div>
          </div>
        </div>

        {/* Driving Status Grid */}
        <div className="p-space-md grid grid-cols-3 gap-2 bg-surface-container-low border-b border-surface-container-high/40">
          <div className="p-2 bg-surface-container-lowest rounded-lg text-center">
            <span className="font-label-meta text-[11px] text-on-surface-variant block">ETA</span>
            <span className="font-label-numeric-md text-on-surface font-bold">
              {Math.max(1, carpark.driveTimeMinutes - Math.floor(currentStep * 0.8))} min
            </span>
          </div>
          <div className="p-2 bg-surface-container-lowest rounded-lg text-center">
            <span className="font-label-meta text-[11px] text-on-surface-variant block">Distance</span>
            <span className="font-label-numeric-md text-on-surface font-bold">
              {Math.max(0, carpark.distanceMeters - currentStep * 120)}m
            </span>
          </div>
          <div className="p-2 bg-surface-container-lowest rounded-lg text-center">
            <span className="font-label-meta text-[11px] text-on-surface-variant block">Clearance</span>
            <span className="font-label-numeric-md text-error font-bold">
              {carpark.heightClearance}m
            </span>
          </div>
        </div>

        {/* Step List */}
        <div className="p-space-md space-y-2 overflow-y-auto max-h-48">
          <div className="font-label-meta text-on-surface-variant text-[11px] uppercase tracking-wider">
            Route Schedule
          </div>
          {steps.map((st, i) => (
            <div
              key={i}
              className={`flex items-center gap-2.5 p-2 rounded-lg text-body-sm text-[13px] ${
                i === currentStep
                  ? 'bg-secondary-container/30 text-on-secondary-container font-semibold'
                  : i < currentStep
                  ? 'text-outline line-through'
                  : 'text-on-surface'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">{st.icon}</span>
              <span className="truncate flex-1">{st.instruction}</span>
              <span className="text-[11px] text-outline">{st.distance}</span>
            </div>
          ))}
        </div>

        {/* Dispatch to External Native Apps */}
        <div className="p-space-md bg-surface-container-lowest border-t border-surface-container-high/40 flex flex-col gap-2">
          <div className="font-label-meta text-center text-on-surface-variant text-[11px]">
            Or open in native GPS app:
          </div>
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => openExternal('google')}
              className="py-2 px-1 bg-surface-container hover:bg-surface-container-high rounded-lg text-body-sm text-[12px] font-medium text-on-surface flex items-center justify-center gap-1 cursor-pointer transition-colors"
            >
              <span className="material-symbols-outlined text-[16px] text-secondary">map</span>
              <span>Google Maps</span>
            </button>
            <button
              onClick={() => openExternal('waze')}
              className="py-2 px-1 bg-surface-container hover:bg-surface-container-high rounded-lg text-body-sm text-[12px] font-medium text-on-surface flex items-center justify-center gap-1 cursor-pointer transition-colors"
            >
              <span className="material-symbols-outlined text-[16px] text-secondary">navigation</span>
              <span>Waze</span>
            </button>
            <button
              onClick={() => openExternal('apple')}
              className="py-2 px-1 bg-surface-container hover:bg-surface-container-high rounded-lg text-body-sm text-[12px] font-medium text-on-surface flex items-center justify-center gap-1 cursor-pointer transition-colors"
            >
              <span className="material-symbols-outlined text-[16px] text-secondary">explore</span>
              <span>Apple Maps</span>
            </button>
          </div>
          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-xl bg-surface-container-highest text-on-surface font-headline-sm text-body-md hover:bg-surface-container transition-colors cursor-pointer mt-1"
          >
            End Navigation
          </button>
        </div>
      </div>
    </div>
  );
};

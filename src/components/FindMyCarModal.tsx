import React, { useState } from 'react';
import { ActiveSession } from '../types/index.ts';

interface FindMyCarModalProps {
  session: ActiveSession;
  onClose: () => void;
}

export const FindMyCarModal: React.FC<FindMyCarModalProps> = ({ session, onClose }) => {
  const [hazardsTriggered, setHazardsTriggered] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const triggerHazards = () => {
    setHazardsTriggered(true);
    setStatusMessage('OBU 2.0 command sent: Hazard lights flashing for 10s!');
    setTimeout(() => {
      setHazardsTriggered(false);
      setStatusMessage(null);
    }, 4000);
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-lg mx-auto bg-surface-container-lowest rounded-t-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-space-md border-b border-surface-container-high/40 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-secondary/10 flex items-center justify-center text-secondary">
              <span className="material-symbols-outlined text-[20px]">near_me</span>
            </div>
            <div>
              <h3 className="font-headline-sm text-headline-sm text-on-surface">Find My Parked Vehicle</h3>
              <p className="font-body-sm text-body-sm text-on-surface-variant">
                {session.carparkName} • {session.level}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-on-surface hover:bg-surface-container-high transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {/* Content */}
        <div className="p-space-md space-y-space-md overflow-y-auto">
          {/* Target Location Card */}
          <div className="bg-secondary-container/20 border border-secondary-container/50 rounded-xl p-3.5 flex items-center justify-between">
            <div>
              <span className="font-label-badge text-label-badge uppercase text-secondary font-bold">
                Assigned Parking Bay
              </span>
              <div className="font-headline-lg text-headline-lg text-on-surface mt-0.5">
                {session.bayNumber}
              </div>
              <span className="font-body-sm text-body-sm text-on-surface-variant">
                Near Lift Lobby C & Escalator 2
              </span>
            </div>
            <div className="w-14 h-14 rounded-2xl bg-secondary text-on-secondary flex flex-col items-center justify-center shadow-md">
              <span className="material-symbols-outlined text-[24px]">directions_car</span>
              <span className="font-label-badge text-[10px] mt-0.5 font-bold">B1</span>
            </div>
          </div>

          {/* Indoor SVG Map of Bugis Junction Basement 1 */}
          <div className="relative w-full h-48 bg-surface-container-low rounded-xl overflow-hidden border border-surface-container-high/40 p-3">
            <svg className="w-full h-full" viewBox="0 0 320 160">
              {/* Pillar Grid */}
              <rect x="20" y="20" width="80" height="40" rx="4" fill="#e0e3e5" />
              <text x="60" y="44" fill="#76777d" fontSize="9" fontWeight="600" textAnchor="middle">
                BAY C01 - C08
              </text>

              <rect x="120" y="20" width="80" height="40" rx="4" fill="#e0e3e5" />
              <text x="160" y="44" fill="#76777d" fontSize="9" fontWeight="600" textAnchor="middle">
                BAY C09 - C13
              </text>

              {/* Parked Bay Highlight */}
              <rect
                x="220"
                y="20"
                width="80"
                height="40"
                rx="4"
                fill="#6cf8bb"
                stroke="#006c49"
                strokeWidth="2"
              />
              <text x="260" y="40" fill="#002113" fontSize="11" fontWeight="700" textAnchor="middle">
                BAY C14
              </text>
              <text x="260" y="52" fill="#005236" fontSize="8" fontWeight="600" textAnchor="middle">
                YOUR CAR
              </text>

              {/* Walking Aisle */}
              <path
                d="M 40,130 L 40,90 L 260,90 L 260,65"
                fill="none"
                stroke="#006c49"
                strokeWidth="3"
                strokeDasharray="4 4"
              />

              {/* Lift Lobby */}
              <rect x="20" y="115" width="60" height="30" rx="4" fill="#131b2e" />
              <text x="50" y="133" fill="#ffffff" fontSize="8" fontWeight="700" textAnchor="middle">
                LIFT C
              </text>

              {/* Pulsing Target Marker */}
              <circle cx="260" cy="70" r="5" fill="#006c49" />
            </svg>
            <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-surface-container-lowest/90 font-label-meta text-[10px] text-on-surface-variant border border-surface-container-high/30">
              Level B1 Plan
            </div>
          </div>

          {/* Walking Directions Steps */}
          <div className="space-y-2">
            <span className="font-label-meta text-[11px] text-on-surface-variant uppercase tracking-wider block">
              Walking Route From Retail Mall:
            </span>
            <div className="flex items-start gap-2.5 text-body-sm text-[13px] text-on-surface">
              <span className="w-5 h-5 rounded-full bg-surface-container-highest flex items-center justify-center font-bold text-[11px] shrink-0">
                1
              </span>
              <span>Take Lift Lobby C or central escalator down to Basement 1</span>
            </div>
            <div className="flex items-start gap-2.5 text-body-sm text-[13px] text-on-surface">
              <span className="w-5 h-5 rounded-full bg-surface-container-highest flex items-center justify-center font-bold text-[11px] shrink-0">
                2
              </span>
              <span>Exit glass doors and walk straight through the pedestrian zebra cross</span>
            </div>
            <div className="flex items-start gap-2.5 text-body-sm text-[13px] text-secondary font-semibold">
              <span className="w-5 h-5 rounded-full bg-secondary text-on-secondary flex items-center justify-center font-bold text-[11px] shrink-0">
                3
              </span>
              <span>Bay C14 is on the right hand side opposite Pillar C15</span>
            </div>
          </div>

          {statusMessage && (
            <div className="p-2.5 rounded-lg bg-primary text-on-primary text-body-sm text-[12px] text-center font-medium animate-pulse">
              {statusMessage}
            </div>
          )}

          {/* Remote Trigger Button */}
          <div className="pt-1">
            <button
              onClick={triggerHazards}
              className={`w-full h-11 rounded-xl flex items-center justify-center gap-2 font-headline-sm text-body-md transition-all cursor-pointer ${
                hazardsTriggered
                  ? 'bg-amber-500 text-on-primary animate-pulse'
                  : 'bg-surface-container hover:bg-surface-container-high text-on-surface'
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">emergency</span>
              <span>{hazardsTriggered ? 'Flashing Hazard Lights...' : 'Flash Vehicle Hazards & Horn'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

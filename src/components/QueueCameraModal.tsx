import React, { useState, useEffect } from 'react';
import { Carpark } from '../types/index.ts';

interface QueueCameraModalProps {
  carpark: Carpark;
  onClose: () => void;
  onSwitchAlternative?: () => void;
}

export const QueueCameraModal: React.FC<QueueCameraModalProps> = ({
  carpark,
  onClose,
  onSwitchAlternative
}) => {
  const [timestamp, setTimestamp] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimestamp(
        `${now.toLocaleDateString()} ${now.toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit'
        })}`
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-lg mx-auto bg-surface-container-lowest rounded-t-3xl shadow-2xl overflow-hidden flex flex-col p-space-lg max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between pb-space-sm border-b border-surface-container-high/40">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-secondary text-[22px]">videocam</span>
            <div>
              <h3 className="font-headline-sm text-headline-sm text-on-surface">
                Live Gantry Queue Cam
              </h3>
              <p className="font-body-sm text-body-sm text-on-surface-variant">
                {carpark.name} • Electronic Gantry
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

        {/* Live Camera View Box */}
        <div className="mt-space-md rounded-xl overflow-hidden relative bg-black aspect-video flex items-center justify-center shadow-inner">
          <img
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuAByfmmOAfRT-FKgswbVhR1LvX7YTL4w23Iyb1hoefdyRsPaV6pszGPLBoSsD16WF5lyTCYibJEn2wU_nUv1PVkzww0riuno-mEDfux5f0K0IKqhNQIo9YoaO_W9NwqXNnL4wc9L7KhegVrzyattRYP5gKdQZr07EcuPBGV4jp3Ddef6q6ipYRbr56Jw2T6c84R4Tf_7vDfboEZ5NtYR_n5izw_PGBGCwhd2-0v2LX0eDQ_dSPvyTupbw"
            alt="Live queue camera"
            className="w-full h-full object-cover opacity-85"
          />

          {/* Camera HUD Overlays */}
          <div className="absolute top-2 left-2 flex items-center gap-1.5 px-2 py-0.5 rounded bg-black/60 backdrop-blur text-on-primary font-label-badge text-[10px]">
            <span className="w-2 h-2 rounded-full bg-error animate-ping"></span>
            <span>LIVE FEED • CAM-02</span>
          </div>

          <div className="absolute top-2 right-2 px-2 py-0.5 rounded bg-black/60 backdrop-blur text-on-primary font-mono text-[10px]">
            {timestamp}
          </div>

          <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between px-2.5 py-1.5 rounded-lg bg-black/70 backdrop-blur text-on-primary">
            <span className="font-label-meta text-[11px] flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px] text-amber-400">warning</span>
              Queue length: ~4 vehicles waiting
            </span>
            <span className="font-label-badge text-amber-400 font-bold">~15 MIN WAIT</span>
          </div>
        </div>

        {/* Alternative Recommendation Prompt */}
        {carpark.alternative && (
          <div className="mt-space-md p-space-sm bg-secondary-container/20 border border-secondary-container/40 rounded-xl flex items-center justify-between">
            <div>
              <span className="font-label-badge text-label-badge text-secondary uppercase font-bold">
                Faster Alternative
              </span>
              <div className="font-headline-sm text-[13px] text-on-surface">
                {carpark.alternative.name}
              </div>
              <span className="font-body-sm text-[11px] text-on-surface-variant">
                {carpark.alternative.lotsAvailable} Lots Free • {carpark.alternative.distance}
              </span>
            </div>
            <button
              onClick={() => {
                onClose();
                if (onSwitchAlternative) onSwitchAlternative();
              }}
              className="px-3 py-1.5 rounded-lg bg-secondary text-on-secondary font-headline-sm text-body-sm flex items-center gap-1 cursor-pointer active:scale-95 transition-transform"
            >
              <span>Switch</span>
              <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
            </button>
          </div>
        )}

        {/* Dismiss Button */}
        <div className="mt-space-md">
          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-xl bg-surface-container text-on-surface font-headline-sm text-body-md hover:bg-surface-container-high transition-colors cursor-pointer"
          >
            Close Camera Feed
          </button>
        </div>
      </div>
    </div>
  );
};

import React from 'react';
import { USER_AVATAR_URL } from '../data/mockData.ts';
import { UserVehicle } from '../types/index.ts';

interface UserProfileModalProps {
  vehicle: UserVehicle;
  onClose: () => void;
  onOpenTopUp: () => void;
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({
  vehicle,
  onClose,
  onOpenTopUp
}) => {
  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-lg mx-auto bg-surface-container-lowest rounded-t-3xl shadow-2xl overflow-hidden flex flex-col p-space-lg max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between pb-space-sm border-b border-surface-container-high/40">
          <div className="flex items-center gap-3">
            <img
              src={USER_AVATAR_URL}
              alt="Benjamin"
              className="w-12 h-12 rounded-full object-cover ring-2 ring-secondary"
            />
            <div>
              <h3 className="font-headline-sm text-headline-sm text-on-surface">Benjamin Tan</h3>
              <p className="font-body-sm text-body-sm text-on-surface-variant">
                LTA Registered Driver • Singapore
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

        {/* Profile Content */}
        <div className="py-space-md space-y-space-md overflow-y-auto">
          {/* Linked Vehicle Info */}
          <div className="bg-surface-container-low rounded-xl p-space-md border border-surface-container-high/30">
            <div className="flex items-center justify-between mb-2">
              <span className="font-label-meta text-[11px] text-on-surface-variant uppercase tracking-wider">
                Primary Registered Vehicle
              </span>
              <span className="px-2 py-0.5 rounded-full bg-secondary-container/50 text-on-secondary-container font-label-badge text-label-badge font-bold">
                ACTIVE
              </span>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-headline-sm text-[15px] text-on-surface">{vehicle.model}</h4>
                <p className="font-mono text-body-sm text-[13px] text-primary font-bold">
                  {vehicle.plate}
                </p>
              </div>
              <div className="text-right">
                <span className="font-label-badge text-[11px] bg-primary text-on-primary px-2 py-0.5 rounded">
                  OBU 2.0
                </span>
                <span className="block font-label-meta text-[10px] text-outline mt-0.5">
                  IU #182749102
                </span>
              </div>
            </div>
          </div>

          {/* Connected Motoring Card */}
          <div className="bg-surface-container-low rounded-xl p-space-md border border-surface-container-high/30">
            <div className="flex items-center justify-between mb-2">
              <span className="font-label-meta text-[11px] text-on-surface-variant uppercase tracking-wider">
                Autopay & Motoring Card
              </span>
              <span className="font-label-meta text-[11px] text-secondary font-semibold">
                Auto-Synced
              </span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-lg bg-primary-container text-primary-fixed flex items-center justify-center">
                  <span className="material-symbols-outlined text-[22px]">credit_card</span>
                </div>
                <div>
                  <div className="font-label-numeric-md text-on-surface">
                    ${vehicle.netsBalance.toFixed(2)} SGD
                  </div>
                  <span className="font-body-sm text-[12px] text-on-surface-variant">
                    NETS Motoring Card (ends ...8421)
                  </span>
                </div>
              </div>
              <button
                onClick={() => {
                  onClose();
                  onOpenTopUp();
                }}
                className="h-8 px-3 rounded-lg bg-secondary text-on-secondary font-label-meta text-[11px] flex items-center gap-1 cursor-pointer active:scale-95 transition-transform"
              >
                <span>Top Up</span>
              </button>
            </div>
          </div>

          {/* App Preferences */}
          <div className="space-y-2">
            <span className="font-label-meta text-[11px] text-on-surface-variant uppercase tracking-wider block">
              Driver Preferences
            </span>
            <div className="p-3 bg-surface-container-low rounded-xl flex items-center justify-between text-body-sm text-[13px]">
              <span>Parking Grace Period Warning</span>
              <span className="text-secondary font-semibold">3 mins before expiry</span>
            </div>
            <div className="p-3 bg-surface-container-low rounded-xl flex items-center justify-between text-body-sm text-[13px]">
              <span>ERP Operating Hours Push Alerts</span>
              <span className="text-secondary font-semibold">Enabled</span>
            </div>
            <div className="p-3 bg-surface-container-low rounded-xl flex items-center justify-between text-body-sm text-[13px]">
              <span>Preferred Navigation App</span>
              <span className="text-on-surface font-medium">In-app Turn-by-turn</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-space-sm border-t border-surface-container-high/40">
          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-xl bg-surface-container text-on-surface font-headline-sm text-body-md hover:bg-surface-container-high transition-colors cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

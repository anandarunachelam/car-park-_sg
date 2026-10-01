import React from 'react';
import { APP_LOGO_URL, USER_AVATAR_URL } from '../data/mockData.ts';

interface HeaderProps {
  currentTab: 'map' | 'list' | 'saved' | 'erp';
  isDetailsView: boolean;
  onBackFromDetails?: () => void;
  onOpenSearch?: () => void;
  onOpenProfile?: () => void;
  onShare?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  isDetailsView,
  onBackFromDetails,
  onOpenSearch,
  onOpenProfile,
  onShare
}) => {
  return (
    <header className="fixed top-0 w-full z-50 pt-safe bg-surface-container-lowest/90 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
      <div className="h-20 px-margin flex flex-col justify-center">
        {/* Status Bar */}
        <div className="flex items-center justify-between text-on-surface mb-1.5">
          <span className="font-label-meta text-label-meta tracking-tight">9:41</span>
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[15px]">signal_cellular_alt</span>
            <span className="font-label-badge text-label-badge tracking-wider font-bold">5G</span>
            <span className="material-symbols-outlined text-[15px]">battery_charging_full</span>
          </div>
        </div>

        {/* Header Content */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-space-sm min-w-0">
            {isDetailsView ? (
              <button
                aria-label="Go Back"
                onClick={onBackFromDetails}
                className="w-11 h-11 -ml-1 flex items-center justify-center rounded-full hover:bg-surface-container transition-colors shrink-0 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[22px] text-on-surface">arrow_back</span>
              </button>
            ) : null}

            <img
              alt="ParkFinder SG App Logo"
              className="h-8 w-auto object-contain shrink-0"
              src={APP_LOGO_URL}
            />

            <div className="flex flex-col min-w-0">
              {isDetailsView ? (
                <>
                  <span className="font-headline-sm text-headline-sm text-on-surface truncate">
                    Carpark Details
                  </span>
                  <span className="font-label-meta text-label-meta text-on-surface-variant truncate">
                    ParkFinder SG • Live Details
                  </span>
                </>
              ) : currentTab === 'map' ? (
                <>
                  <div className="flex items-center gap-space-xs">
                    <span className="font-headline-sm text-headline-sm text-on-surface truncate">
                      ParkFinder SG
                    </span>
                    <div className="flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-secondary-container/40 text-on-secondary-container shrink-0">
                      <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse"></span>
                      <span className="font-label-badge text-label-badge">GPS</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-on-surface-variant truncate">
                    <span className="material-symbols-outlined text-[13px] text-secondary">near_me</span>
                    <span className="font-label-meta text-label-meta truncate">
                      Orchard / Central • Map & Nearby
                    </span>
                  </div>
                </>
              ) : currentTab === 'list' ? (
                <>
                  <div className="flex items-center gap-space-xs">
                    <span className="font-headline-sm text-headline-sm text-on-surface truncate">
                      ParkFinder SG
                    </span>
                    <div className="flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-secondary-container/40 text-on-secondary-container shrink-0">
                      <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse"></span>
                      <span className="font-label-badge text-label-badge">GPS</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-on-surface-variant truncate">
                    <span className="material-symbols-outlined text-[13px] text-secondary">near_me</span>
                    <span className="font-label-meta text-label-meta truncate">
                      Orchard / Central • List View
                    </span>
                  </div>
                </>
              ) : currentTab === 'erp' ? (
                <>
                  <div className="flex items-center gap-space-xs">
                    <span className="font-headline-sm text-headline-sm text-on-surface truncate">
                      ParkFinder SG
                    </span>
                    <div className="flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-secondary-container/40 text-on-secondary-container shrink-0">
                      <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse"></span>
                      <span className="font-label-badge text-label-badge">GPS</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-on-surface-variant truncate">
                    <span className="material-symbols-outlined text-[13px] text-secondary">near_me</span>
                    <span className="font-label-meta text-label-meta truncate">
                      Orchard / Central • Erp & Alerts
                    </span>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-center gap-space-xs">
                    <span className="font-headline-sm text-headline-sm text-on-surface truncate">
                      ParkFinder SG
                    </span>
                    <div className="flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-secondary-container/40 text-on-secondary-container shrink-0">
                      <span className="material-symbols-outlined text-[12px] text-secondary">bookmark</span>
                      <span className="font-label-badge text-label-badge">SAVED</span>
                    </div>
                  </div>
                  <span className="font-label-meta text-label-meta text-on-surface-variant truncate">
                    Orchard / Central • Bookmarked Lots
                  </span>
                </>
              )}
            </div>
          </div>

          {/* Right Action Icons */}
          <div className="flex items-center gap-space-sm shrink-0">
            {isDetailsView ? (
              <button
                aria-label="Share Carpark"
                onClick={onShare}
                className="w-11 h-11 flex items-center justify-center rounded-full hover:bg-surface-container transition-colors cursor-pointer text-on-surface-variant"
              >
                <span className="material-symbols-outlined text-[20px]">share</span>
              </button>
            ) : (
              <button
                aria-label="Search"
                onClick={onOpenSearch}
                className="w-11 h-11 flex items-center justify-center rounded-full hover:bg-surface-container transition-colors cursor-pointer text-on-surface-variant"
              >
                <span className="material-symbols-outlined text-[20px]">search</span>
              </button>
            )}

            <button
              onClick={onOpenProfile}
              aria-label="User Profile"
              className="relative flex items-center justify-center cursor-pointer active:scale-95 transition-transform"
            >
              <img
                alt="Profile"
                className="w-8 h-8 rounded-full object-cover ring-2 ring-surface-container"
                src={USER_AVATAR_URL}
              />
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-secondary ring-2 ring-surface-container-lowest"></span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

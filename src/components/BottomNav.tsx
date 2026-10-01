import React from 'react';

interface BottomNavProps {
  currentTab: 'map' | 'list' | 'saved' | 'erp';
  onSelectTab: (tab: 'map' | 'list' | 'saved' | 'erp') => void;
  savedCount?: number;
  hasActiveSession?: boolean;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  currentTab,
  onSelectTab,
  savedCount = 0,
  hasActiveSession = true
}) => {
  return (
    <nav className="fixed bottom-0 w-full z-40 pb-safe bg-surface-container-lowest/90 backdrop-blur-xl shadow-[0_-1px_12px_rgba(0,0,0,0.06)] border-t border-surface-container/60">
      <div className="h-16 px-space-sm flex items-center justify-around max-w-lg mx-auto">
        {/* Map Tab */}
        <button
          onClick={() => onSelectTab('map')}
          className={`flex flex-col items-center justify-center gap-0.5 w-16 h-12 transition-colors cursor-pointer ${
            currentTab === 'map' ? 'text-primary font-semibold' : 'text-on-surface-variant hover:text-on-surface'
          }`}
          aria-current={currentTab === 'map' ? 'page' : undefined}
        >
          <span className="material-symbols-outlined text-[22px]">explore</span>
          <span className="font-label-meta text-[11px] leading-tight text-center">Map</span>
        </button>

        {/* List View Tab */}
        <button
          onClick={() => onSelectTab('list')}
          className={`flex flex-col items-center justify-center gap-0.5 w-16 h-12 transition-colors cursor-pointer ${
            currentTab === 'list' ? 'text-primary font-semibold' : 'text-on-surface-variant hover:text-on-surface'
          }`}
          aria-current={currentTab === 'list' ? 'page' : undefined}
        >
          <span className="material-symbols-outlined text-[22px]">format_list_bulleted</span>
          <span className="font-label-meta text-[11px] leading-tight text-center">List View</span>
        </button>

        {/* Saved Tab */}
        <button
          onClick={() => onSelectTab('saved')}
          className={`relative flex flex-col items-center justify-center gap-0.5 w-16 h-12 transition-colors cursor-pointer ${
            currentTab === 'saved' ? 'text-primary font-semibold' : 'text-on-surface-variant hover:text-on-surface'
          }`}
          aria-current={currentTab === 'saved' ? 'page' : undefined}
        >
          <span className="material-symbols-outlined text-[22px]">bookmark</span>
          <span className="font-label-meta text-[11px] leading-tight text-center">Saved</span>
          {savedCount > 0 && (
            <span className="absolute top-1 right-3 w-4 h-4 rounded-full bg-secondary text-on-secondary font-label-badge text-[9px] flex items-center justify-center">
              {savedCount}
            </span>
          )}
        </button>

        {/* ERP & Alerts Tab */}
        <button
          onClick={() => onSelectTab('erp')}
          className={`relative flex flex-col items-center justify-center gap-0.5 w-16 h-12 transition-colors cursor-pointer ${
            currentTab === 'erp' ? 'text-primary font-semibold' : 'text-on-surface-variant hover:text-on-surface'
          }`}
          aria-current={currentTab === 'erp' ? 'page' : undefined}
        >
          <span className="material-symbols-outlined text-[22px]">notifications</span>
          <span className="font-label-meta text-[11px] leading-tight text-center">ERP & Alerts</span>
          {hasActiveSession && (
            <span className="absolute top-1.5 right-3 w-2 h-2 rounded-full bg-secondary animate-pulse"></span>
          )}
        </button>
      </div>
    </nav>
  );
};

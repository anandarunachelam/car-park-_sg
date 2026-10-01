import React, { useState, useEffect } from 'react';
import { Carpark } from '../types/index.ts';

interface ListViewProps {
  carparks: Carpark[];
  onSelectCarpark: (carpark: Carpark) => void;
  onOpenDetails: (carpark: Carpark) => void;
  onStartNavigation: (carpark: Carpark) => void;
  onShareCarpark: (carpark: Carpark) => void;
  onToggleFavorite: (id: string) => void;
  favorites: string[];
  onOpenFilter: () => void;
  onOpenQueueCamera?: (carpark: Carpark) => void;
}

export const ListView: React.FC<ListViewProps> = ({
  carparks,
  onSelectCarpark,
  onOpenDetails,
  onStartNavigation,
  onShareCarpark,
  onToggleFavorite,
  favorites,
  onOpenFilter,
  onOpenQueueCamera
}) => {
  const [activeSort, setActiveSort] = useState<'lots' | 'eta' | 'cheapest' | 'ev'>('lots');
  const [refreshSecondsAgo, setRefreshSecondsAgo] = useState(12);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Live timer simulation for refresh stamp
  useEffect(() => {
    const interval = setInterval(() => {
      setRefreshSecondsAgo((prev) => (prev >= 45 ? 1 : prev + 1));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleManualRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setRefreshSecondsAgo(0);
      setIsRefreshing(false);
    }, 600);
  };

  // Sort carparks
  const sortedCarparks = [...carparks].sort((a, b) => {
    if (activeSort === 'lots') {
      return b.availableLots - a.availableLots;
    }
    if (activeSort === 'eta') {
      return a.driveTimeMinutes - b.driveTimeMinutes;
    }
    if (activeSort === 'cheapest') {
      const getRate = (c: Carpark) => c.publishedTariffs[0]?.ratePerHour || 3.0;
      return getRate(a) - getRate(b);
    }
    if (activeSort === 'ev') {
      return b.evAvailable - a.evAvailable;
    }
    return 0;
  });

  // Calculate live cluster totals
  const totalVacantLots = carparks.reduce((sum, c) => sum + c.availableLots, 0);

  return (
    <div className="flex flex-col w-full px-margin pb-24 gap-space-md">
      {/* Search & Active Context Bar */}
      <div className="flex flex-col gap-space-sm pt-space-sm">
        <div className="flex items-center gap-space-sm bg-surface-container-lowest shadow-sm rounded-xl p-space-sm border border-surface-container-high/40">
          <span className="material-symbols-outlined text-[20px] text-outline ml-1">search</span>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1">
              <span className="font-headline-sm text-[15px] leading-tight text-on-surface truncate">
                Orchard Rd & Central
              </span>
              <span className="font-label-badge text-label-badge uppercase px-1.5 py-0.5 rounded-full bg-secondary-container text-on-secondary-container shrink-0">
                1.5 km
              </span>
            </div>
            <button
              onClick={handleManualRefresh}
              className="font-body-sm text-[12px] text-on-surface-variant truncate block text-left hover:text-secondary cursor-pointer"
            >
              {isRefreshing
                ? 'Syncing with LTA DataMall...'
                : `Live availability refreshed ${refreshSecondsAgo}s ago`}
            </button>
          </div>
          <button
            onClick={onOpenFilter}
            className="relative flex items-center justify-center w-10 h-10 rounded-lg bg-surface-container text-on-surface hover:bg-surface-container-high transition-colors cursor-pointer shrink-0"
            id="filterSheetTrigger"
            aria-label="Filter"
          >
            <span className="material-symbols-outlined text-[20px]">tune</span>
            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-primary text-on-primary font-label-badge text-[9px] flex items-center justify-center">
              3
            </span>
          </button>
        </div>

        {/* Quick Sort Scroller */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5">
          <div className="flex items-center gap-1 text-on-surface-variant shrink-0 pr-1">
            <span className="material-symbols-outlined text-[16px]">swap_vert</span>
            <span className="font-label-meta text-label-meta">Sort:</span>
          </div>

          <button
            onClick={() => setActiveSort('lots')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full font-label-meta text-label-meta whitespace-nowrap shadow-sm cursor-pointer transition-colors ${
              activeSort === 'lots'
                ? 'bg-primary text-on-primary active'
                : 'bg-surface-container-lowest text-on-surface-variant hover:text-on-surface'
            }`}
          >
            <span>Most lots</span>
            {activeSort === 'lots' && (
              <span className="material-symbols-outlined text-[14px]">check</span>
            )}
          </button>

          <button
            onClick={() => setActiveSort('eta')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full font-label-meta text-label-meta whitespace-nowrap shadow-sm cursor-pointer transition-colors ${
              activeSort === 'eta'
                ? 'bg-primary text-on-primary active'
                : 'bg-surface-container-lowest text-on-surface-variant hover:text-on-surface'
            }`}
          >
            <span>Nearest (ETA)</span>
            {activeSort === 'eta' && (
              <span className="material-symbols-outlined text-[14px]">check</span>
            )}
          </button>

          <button
            onClick={() => setActiveSort('cheapest')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full font-label-meta text-label-meta whitespace-nowrap shadow-sm cursor-pointer transition-colors ${
              activeSort === 'cheapest'
                ? 'bg-primary text-on-primary active'
                : 'bg-surface-container-lowest text-on-surface-variant hover:text-on-surface'
            }`}
          >
            <span>Cheapest rate</span>
            {activeSort === 'cheapest' && (
              <span className="material-symbols-outlined text-[14px]">check</span>
            )}
          </button>

          <button
            onClick={() => setActiveSort('ev')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full font-label-meta text-label-meta whitespace-nowrap shadow-sm cursor-pointer transition-colors ${
              activeSort === 'ev'
                ? 'bg-primary text-on-primary active'
                : 'bg-surface-container-lowest text-on-surface-variant hover:text-on-surface'
            }`}
          >
            <span>EV Chargers</span>
            {activeSort === 'ev' && (
              <span className="material-symbols-outlined text-[14px]">check</span>
            )}
          </button>
        </div>
      </div>

      {/* Live Stats KPI Strip */}
      <div className="bg-primary-container text-on-primary rounded-xl p-space-md shadow-md flex items-center justify-between border border-primary-fixed/20">
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-secondary-fixed animate-ping"></span>
            <span className="font-label-badge text-label-badge uppercase tracking-wider text-secondary-fixed">
              Live Cluster
            </span>
          </div>
          <div className="flex items-baseline gap-1 mt-0.5">
            <span className="font-label-numeric-lg text-label-numeric-lg text-on-primary">
              {totalVacantLots > 0 ? totalVacantLots.toLocaleString() : '1,420'}
            </span>
            <span className="font-body-sm text-[12px] text-primary-fixed-dim">vacant lots</span>
          </div>
        </div>
        <div className="h-8 w-px bg-on-primary-fixed-variant/40"></div>
        <div className="flex flex-col text-right">
          <span className="font-label-meta text-[11px] text-primary-fixed-dim">24 Active Carparks</span>
          <span className="font-label-numeric-md text-label-numeric-md text-secondary-fixed mt-0.5">
            Avg $2.10/hr
          </span>
        </div>
      </div>

      {/* Carpark Cards List */}
      <div className="flex flex-col gap-space-md">
        {sortedCarparks.map((carpark) => {
          const isFav = favorites.includes(carpark.id);
          const circumference = 2 * Math.PI * 18; // ~113.097
          const percent = carpark.totalLots > 0 ? (carpark.availableLots / carpark.totalLots) : 0;
          const strokeDashoffset = circumference * (1 - percent);

          // Card rendering
          return (
            <div
              key={carpark.id}
              className={`bg-surface-container-lowest rounded-xl shadow-md p-space-md flex flex-col gap-space-sm relative overflow-hidden border border-surface-container-high/40 transition-all ${
                carpark.isFull ? 'opacity-95' : ''
              }`}
            >
              {/* Card Header */}
              <div
                className="flex items-start justify-between gap-space-sm cursor-pointer"
                onClick={() => onOpenDetails(carpark)}
              >
                <div className="flex flex-col min-w-0">
                  <div className="flex items-center gap-1.5 flex-wrap mb-1">
                    {/* Primary Badge */}
                    <span
                      className={`font-label-badge text-label-badge uppercase px-2 py-0.5 rounded-full ${
                        carpark.type === 'HDB CENTRAL'
                          ? 'bg-primary-fixed text-on-primary-fixed'
                          : carpark.type === 'MALL / RETAIL'
                          ? 'bg-tertiary-fixed text-on-tertiary-fixed'
                          : carpark.type === 'URA KERBSIDE'
                          ? 'bg-tertiary-fixed text-on-tertiary-fixed'
                          : carpark.type === 'HDB AUTOMATED'
                          ? 'bg-error-container text-on-error-container'
                          : 'bg-primary text-on-primary'
                      }`}
                    >
                      {carpark.type}
                    </span>

                    {/* Subtype Badge */}
                    {carpark.subType && (
                      <span className="font-label-badge text-label-badge px-2 py-0.5 rounded-full bg-surface-container text-on-surface-variant">
                        {carpark.subType}
                      </span>
                    )}

                    {/* EV Badge */}
                    {carpark.evTotal > 0 && (
                      <span className="font-label-badge text-label-badge px-2 py-0.5 rounded-full bg-secondary-container text-on-secondary-container flex items-center gap-0.5">
                        <span className="material-symbols-outlined text-[12px]">bolt</span>
                        EV Supercharger
                      </span>
                    )}

                    {/* CCTV */}
                    {carpark.cctv && carpark.type.includes('HDB') && (
                      <span className="flex items-center gap-0.5 font-label-badge text-label-badge px-1.5 py-0.5 rounded-full bg-surface-container text-on-surface-variant">
                        <span className="material-symbols-outlined text-[12px] text-secondary">
                          videocam
                        </span>{' '}
                        CCTV
                      </span>
                    )}

                    {/* App badge for URA */}
                    {carpark.tags.includes('PARKING.SG APP') && (
                      <span className="font-label-badge text-label-badge px-2 py-0.5 rounded-full bg-secondary-container/60 text-on-secondary-container">
                        Parking.sg App
                      </span>
                    )}
                  </div>

                  <h2 className="font-headline-sm text-headline-sm text-on-surface truncate">
                    {carpark.name}
                  </h2>

                  <div className="flex items-center gap-2 mt-0.5 text-on-surface-variant font-body-sm text-body-sm">
                    {carpark.isFull ? (
                      <>
                        <span>{carpark.distanceMeters >= 1000 ? `${(carpark.distanceMeters/1000).toFixed(1)} km away` : `${carpark.distanceMeters}m away`}</span>
                        <span>•</span>
                        <span>Electronic Gantry (EPS)</span>
                      </>
                    ) : (
                      <>
                        <span className="flex items-center gap-0.5 text-secondary font-semibold">
                          <span className="material-symbols-outlined text-[14px]">near_me</span>{' '}
                          {carpark.distanceMeters >= 1000 ? `${(carpark.distanceMeters/1000).toFixed(1)} km` : `${carpark.distanceMeters}m`}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-0.5">
                          <span className="material-symbols-outlined text-[14px]">schedule</span>{' '}
                          {carpark.driveTimeMinutes} mins drive
                        </span>
                      </>
                    )}
                  </div>
                </div>

                {/* Right Availability Gauge Ring */}
                {carpark.isFull ? (
                  <div className="px-2.5 py-1.5 rounded-lg bg-error-container text-on-error-container flex flex-col items-center justify-center shrink-0">
                    <span className="font-label-badge text-label-badge uppercase tracking-wider font-bold">
                      FULL
                    </span>
                    <span className="font-label-numeric-md text-label-numeric-md leading-none text-error mt-0.5">
                      0 Lots
                    </span>
                  </div>
                ) : (
                  <div className="relative w-14 h-14 shrink-0 flex items-center justify-center">
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 44 44">
                      <circle
                        className="text-surface-container-high"
                        cx="22"
                        cy="22"
                        fill="none"
                        r="18"
                        stroke="currentColor"
                        strokeWidth="4.5"
                      ></circle>
                      <circle
                        className={
                          carpark.availableLots < 10
                            ? 'text-tertiary-fixed-dim'
                            : 'text-secondary'
                        }
                        cx="22"
                        cy="22"
                        fill="none"
                        r="18"
                        stroke="currentColor"
                        strokeDasharray="113.097"
                        strokeDashoffset={strokeDashoffset}
                        strokeLinecap="round"
                        strokeWidth="4.5"
                      ></circle>
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                      <span
                        className={`font-label-numeric-md text-label-numeric-md leading-none ${
                          carpark.availableLots < 10
                            ? 'text-on-tertiary-container'
                            : 'text-secondary'
                        }`}
                      >
                        {carpark.availableLots}
                      </span>
                      <span
                        className={`font-label-badge text-[9px] uppercase leading-tight ${
                          carpark.availableLots < 10
                            ? 'text-on-tertiary-container font-bold'
                            : 'text-on-surface-variant'
                        }`}
                      >
                        {carpark.availableLots < 10 ? 'left' : 'lots'}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Pricing & Perks Box */}
              {!carpark.isFull && (
                <div className="bg-surface-container-low rounded-lg p-2.5 flex flex-col gap-1">
                  <div className="flex items-center justify-between text-on-surface font-body-md text-[13px]">
                    <span className="font-medium">{carpark.standardRateText}</span>
                    <span
                      className={`font-body-sm text-[12px] ${
                        carpark.id === 'ion'
                          ? 'text-secondary font-semibold'
                          : 'text-on-surface-variant'
                      }`}
                    >
                      {carpark.subRateText}
                    </span>
                  </div>

                  {carpark.warningNotice && (
                    <div className="flex items-center gap-1.5 text-on-tertiary-container font-label-meta text-[11px] bg-tertiary-fixed/30 rounded px-2 py-1 mt-0.5">
                      <span className="material-symbols-outlined text-[14px]">warning</span>
                      <span>{carpark.warningNotice}</span>
                    </div>
                  )}

                  {(carpark.nightRateText || carpark.spendPerkText || carpark.gracePeriodMinutes > 0) &&
                    !carpark.warningNotice && (
                      <div className="flex items-center justify-between font-label-meta text-[11px] text-on-surface-variant">
                        <span>{carpark.nightRateText || carpark.spendPerkText || 'Standard Day Rate'}</span>
                        <span className="text-secondary font-semibold">
                          {carpark.gracePeriodMinutes > 0
                            ? `${carpark.gracePeriodMinutes}-min Grace Period`
                            : 'No grace period'}
                        </span>
                      </div>
                    )}

                  <div className="flex items-center gap-2 mt-1 pt-1 bg-surface-container-lowest/60 rounded px-1.5 py-0.5 text-on-surface-variant font-label-meta text-[11px]">
                    <span className="material-symbols-outlined text-[13px]">height</span>
                    <span>Max Clearance: {carpark.heightClearance}m</span>
                    <span className="mx-1">•</span>
                    <span className="text-on-secondary-container font-medium truncate">
                      {carpark.id === 'waterloo'
                        ? 'Free Parking on Sunday'
                        : carpark.id === 'ion'
                        ? 'Direct lift to Mall Atrium B2'
                        : 'Sheltered bays & CCTV'}
                    </span>
                  </div>
                </div>
              )}

              {/* Full Carpark with Smart Re-Route Notice */}
              {carpark.isFull && carpark.alternative && (
                <div className="bg-surface-container-high/80 rounded-lg p-3 flex flex-col gap-1.5">
                  <div className="flex items-center gap-1.5 text-on-surface">
                    <span className="material-symbols-outlined text-[16px] text-secondary">
                      alt_route
                    </span>
                    <span className="font-headline-sm text-[13px]">
                      Recommended Alternative Nearby
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-on-surface-variant font-body-sm text-[12px] bg-surface-container-lowest rounded px-2.5 py-2">
                    <div className="flex flex-col">
                      <span className="font-medium text-on-surface">
                        {carpark.alternative.name}
                      </span>
                      <span className="text-secondary font-semibold">
                        {carpark.alternative.lotsAvailable} Lots Available •{' '}
                        {carpark.alternative.distance}
                      </span>
                    </div>
                    <button
                      onClick={() => {
                        const alt = carparks.find((c) => c.id === carpark.alternative?.id);
                        if (alt) onOpenDetails(alt);
                        else {
                          const ion = carparks.find((c) => c.id === 'ion');
                          if (ion) onOpenDetails(ion);
                        }
                      }}
                      className="px-3 py-1 rounded bg-secondary text-on-secondary font-label-meta text-label-meta flex items-center gap-1 cursor-pointer active:scale-95 transition-transform"
                    >
                      <span>Switch</span>
                      <span className="material-symbols-outlined text-[13px]">arrow_forward</span>
                    </button>
                  </div>

                  <div className="flex items-center justify-between text-on-surface-variant font-body-sm text-[12px] px-1 pt-1">
                    <span>Typical queue clearance: ~{carpark.queueClearanceMinutes || 15} mins</span>
                    <button
                      onClick={() => onOpenQueueCamera && onOpenQueueCamera(carpark)}
                      className="text-secondary font-label-meta text-label-meta hover:underline cursor-pointer"
                    >
                      View queue camera
                    </button>
                  </div>
                </div>
              )}

              {/* Action Buttons Row */}
              <div className="flex items-center gap-space-sm pt-0.5">
                <button
                  onClick={() => onStartNavigation(carpark)}
                  className="flex-1 h-11 bg-primary text-on-primary rounded-lg font-headline-sm text-body-md flex items-center justify-center gap-1.5 shadow-sm active:scale-[0.98] transition-transform cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px]">turn_sharp_right</span>
                  <span>Navigate ({carpark.driveTimeMinutes} min)</span>
                </button>

                <button
                  aria-label="Share Carpark"
                  onClick={() => onShareCarpark(carpark)}
                  className="w-11 h-11 bg-surface-container rounded-lg flex items-center justify-center text-on-surface hover:bg-surface-container-high transition-colors cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[19px]">ios_share</span>
                </button>

                <button
                  aria-label="Bookmark"
                  onClick={() => onToggleFavorite(carpark.id)}
                  className="w-11 h-11 bg-surface-container rounded-lg flex items-center justify-center text-on-surface hover:bg-surface-container-high transition-colors cursor-pointer"
                >
                  <span
                    className={`material-symbols-outlined text-[19px] ${
                      isFav ? 'text-secondary material-symbols-fill' : ''
                    }`}
                  >
                    {isFav ? 'bookmark' : 'bookmark_border'}
                  </span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Ambient Pull-to-Refresh & Live API Connected Stamp */}
      <div className="flex items-center justify-center gap-2 py-space-sm text-on-surface-variant">
        <span className="material-symbols-outlined text-[16px] text-secondary animate-spin">
          sync
        </span>
        <span className="font-body-sm text-[12px]">LTA DataMall & URA Live API connected</span>
      </div>
    </div>
  );
};

import React, { useState } from 'react';

interface FilterModalProps {
  onApplyFilters: (filters: FilterOptions) => void;
  onClose: () => void;
  initialFilters?: FilterOptions;
}

export interface FilterOptions {
  type: string;
  hasEv: boolean;
  maxRate: number;
  minClearance: number;
  graceOnly: boolean;
}

export const FilterModal: React.FC<FilterModalProps> = ({
  onApplyFilters,
  onClose,
  initialFilters = {
    type: 'all',
    hasEv: false,
    maxRate: 5.0,
    minClearance: 1.8,
    graceOnly: false
  }
}) => {
  const [filters, setFilters] = useState<FilterOptions>(initialFilters);

  const handleApply = () => {
    onApplyFilters(filters);
    onClose();
  };

  const handleReset = () => {
    setFilters({
      type: 'all',
      hasEv: false,
      maxRate: 5.0,
      minClearance: 1.8,
      graceOnly: false
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-lg mx-auto bg-surface-container-lowest rounded-t-3xl shadow-2xl overflow-hidden flex flex-col p-space-lg max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between pb-space-sm border-b border-surface-container-high/40">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[22px]">tune</span>
            <h3 className="font-headline-sm text-headline-sm text-on-surface">Filter Carparks</h3>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-on-surface hover:bg-surface-container-high transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {/* Filters Body */}
        <div className="py-space-md space-y-space-md overflow-y-auto">
          {/* Carpark Type */}
          <div>
            <label className="font-label-meta text-[11px] text-on-surface-variant uppercase tracking-wider block mb-2">
              Carpark Ownership / Type
            </label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: 'all', label: 'All Carparks' },
                { id: 'hdb', label: 'HDB MSCP' },
                { id: 'mall', label: 'Shopping Malls' },
                { id: 'ura', label: 'URA Kerbside' }
              ].map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => setFilters({ ...filters, type: opt.id })}
                  className={`py-2 px-3 rounded-lg text-body-sm text-[13px] font-medium text-left cursor-pointer transition-colors ${
                    filters.type === opt.id
                      ? 'bg-primary text-on-primary font-semibold'
                      : 'bg-surface-container text-on-surface hover:bg-surface-container-high'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Max Hourly Rate */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="font-label-meta text-[11px] text-on-surface-variant uppercase tracking-wider">
                Max Hourly Tariff
              </label>
              <span className="font-label-numeric-md text-secondary font-bold">
                ${filters.maxRate.toFixed(2)}/hr
              </span>
            </div>
            <input
              type="range"
              min="1.0"
              max="6.0"
              step="0.5"
              value={filters.maxRate}
              onChange={(e) => setFilters({ ...filters, maxRate: parseFloat(e.target.value) })}
              className="w-full accent-secondary"
            />
            <div className="flex justify-between text-[11px] text-outline font-label-meta">
              <span>$1.00</span>
              <span>$3.50</span>
              <span>$6.00+</span>
            </div>
          </div>

          {/* Minimum Clearance Height */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="font-label-meta text-[11px] text-on-surface-variant uppercase tracking-wider">
                Vehicle Height Clearance
              </label>
              <span className="font-label-numeric-md text-error font-bold">
                ≥ {filters.minClearance}m
              </span>
            </div>
            <input
              type="range"
              min="1.8"
              max="2.4"
              step="0.05"
              value={filters.minClearance}
              onChange={(e) => setFilters({ ...filters, minClearance: parseFloat(e.target.value) })}
              className="w-full accent-error"
            />
            <div className="flex justify-between text-[11px] text-outline font-label-meta">
              <span>1.80m (Sedan)</span>
              <span>2.00m (SUV)</span>
              <span>2.40m (Van)</span>
            </div>
          </div>

          {/* Toggles */}
          <div className="space-y-3 pt-2 border-t border-surface-container-high/30">
            {/* EV Chargers */}
            <div className="flex items-center justify-between">
              <div>
                <span className="font-headline-sm text-[13px] text-on-surface block">
                  EV Charging Bays Required
                </span>
                <span className="font-body-sm text-[11px] text-on-surface-variant">
                  Show only locations with DC Fast or AC Chargers
                </span>
              </div>
              <input
                type="checkbox"
                checked={filters.hasEv}
                onChange={(e) => setFilters({ ...filters, hasEv: e.target.checked })}
                className="w-5 h-5 accent-secondary cursor-pointer"
              />
            </div>

            {/* Grace Period */}
            <div className="flex items-center justify-between">
              <div>
                <span className="font-headline-sm text-[13px] text-on-surface block">
                  Grace Period &gt; 10 Mins
                </span>
                <span className="font-body-sm text-[11px] text-on-surface-variant">
                  Free quick pick-up / drop-off allowance
                </span>
              </div>
              <input
                type="checkbox"
                checked={filters.graceOnly}
                onChange={(e) => setFilters({ ...filters, graceOnly: e.target.checked })}
                className="w-5 h-5 accent-secondary cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-space-sm border-t border-surface-container-high/40 flex gap-space-sm">
          <button
            onClick={handleReset}
            className="py-3 px-4 rounded-xl bg-surface-container text-on-surface font-headline-sm text-body-md hover:bg-surface-container-high cursor-pointer"
          >
            Reset
          </button>
          <button
            onClick={handleApply}
            className="flex-1 py-3 rounded-xl bg-primary text-on-primary font-headline-sm text-body-md hover:bg-surface-container-highest cursor-pointer shadow-md text-center"
          >
            Apply Filters
          </button>
        </div>
      </div>
    </div>
  );
};

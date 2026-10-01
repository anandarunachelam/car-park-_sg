import React, { useState, useEffect } from 'react';
import { ActiveSession, ErpGantry, UserVehicle } from '../types/index.ts';

interface ErpAndAlertsViewProps {
  session: ActiveSession;
  vehicle: UserVehicle;
  gantries: ErpGantry[];
  onFindMyCar: () => void;
  onOpenTopUp: () => void;
}

export const ErpAndAlertsView: React.FC<ErpAndAlertsViewProps> = ({
  session,
  vehicle,
  gantries,
  onFindMyCar,
  onOpenTopUp
}) => {
  // Live Parking Timer ticking every second
  const [elapsedSeconds, setElapsedSeconds] = useState(38 * 60 + 17);
  const [scarcityAlarm, setScarcityAlarm] = useState(session.scarcityAlarm);
  const [activeSegmentTab, setActiveSegmentTab] = useState<'cte' | 'cbd' | 'kpe'>('cte');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Guardrail switches state
  const [guardrails, setGuardrails] = useState({
    lowCapacity: true,
    surgeAlert: true,
    heavyRainPriority: true
  });

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2500);
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Format HH:MM:SS
  const formatTime = (totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    const pad = (n: number) => String(n).padStart(2, '0');
    return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
  };

  // Next tier countdown
  const nextTierRemainingSeconds = 60 * 60 - (elapsedSeconds % 3600);
  const nextTierMinutes = Math.floor(nextTierRemainingSeconds / 60);
  const nextTierSeconds = nextTierRemainingSeconds % 60;

  // Filter gantries by segment
  const filteredGantries = gantries.filter((g) => g.segment === activeSegmentTab);

  const toggleAlarm = () => {
    const nextState = !scarcityAlarm;
    setScarcityAlarm(nextState);
    showToast(nextState ? 'Smart lot scarcity alarm armed' : 'Lot alarm silenced');
  };

  const toggleGuardrail = (key: keyof typeof guardrails) => {
    setGuardrails((prev) => {
      const updated = { ...prev, [key]: !prev[key] };
      showToast(updated[key] ? 'Guardrail setting enabled' : 'Guardrail setting disabled');
      return updated;
    });
  };

  return (
    <div className="flex flex-col w-full px-margin space-y-space-md pb-24 pt-space-sm">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full bg-primary text-on-primary text-body-sm font-medium shadow-xl z-50 animate-bounce">
          {toastMessage}
        </div>
      )}

      {/* Active Session: Smart Parking Assist Banner */}
      <div className="relative overflow-hidden rounded-xl bg-surface-container-lowest shadow-md p-space-md border border-surface-container-high/40">
        <div className="flex items-center justify-between gap-space-xs mb-space-sm">
          <div className="flex items-center gap-space-xs min-w-0">
            <span className="flex h-2.5 w-2.5 rounded-full bg-secondary animate-ping"></span>
            <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-secondary-container text-on-secondary-container font-label-badge text-label-badge uppercase tracking-wider">
              Active Session
            </span>
          </div>
          <span className="inline-flex items-center gap-1 font-label-meta text-label-meta text-on-surface-variant">
            <span className="material-symbols-outlined text-[16px] text-secondary">local_parking</span>
            {session.bayNumber} • {session.level}
          </span>
        </div>

        <div className="flex flex-col mb-space-md">
          <h2 className="font-headline-md text-headline-md text-on-surface truncate">
            {session.carparkName}
          </h2>
          <p className="font-body-sm text-body-sm text-on-surface-variant">{session.address}</p>
        </div>

        {/* Live Timer & Fee Meter */}
        <div className="rounded-lg bg-surface-container-low p-space-md mb-space-md border border-surface-container-high/20">
          <div className="flex items-end justify-between">
            <div>
              <span className="font-label-meta text-label-meta text-on-surface-variant block mb-1">
                Elapsed Duration
              </span>
              <span className="font-label-numeric-lg text-label-numeric-lg text-primary tracking-tight font-mono">
                {formatTime(elapsedSeconds)}
              </span>
            </div>
            <div className="text-right">
              <span className="font-label-meta text-label-meta text-on-surface-variant block mb-1">
                Accrued Parking Fee
              </span>
              <span className="font-label-numeric-lg text-label-numeric-lg text-secondary">
                $3.20 <span className="font-body-sm text-body-sm text-on-surface-variant">SGD</span>
              </span>
            </div>
          </div>

          {/* Grace Period Visual Strip */}
          <div className="mt-space-sm pt-space-xs">
            <div className="flex justify-between items-center mb-1">
              <span className="font-label-badge text-label-badge text-on-surface-variant">
                10-MIN GRACE OVER
              </span>
              <span className="font-label-badge text-label-badge text-error font-bold font-mono">
                NEXT TIER IN {nextTierMinutes}m {String(nextTierSeconds).padStart(2, '0')}s
              </span>
            </div>
            <div className="w-full h-1.5 rounded-full bg-surface-container-highest overflow-hidden">
              <div
                className="h-full bg-primary rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, Math.round(((elapsedSeconds % 3600) / 3600) * 100))}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-space-sm">
          <button
            onClick={onFindMyCar}
            className="h-12 px-space-sm flex items-center justify-center gap-1.5 rounded-lg bg-primary text-on-primary font-headline-sm text-[13px] shadow-sm active:scale-95 transition-transform cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">near_me</span>
            <span>Find My Car</span>
          </button>

          <button
            onClick={toggleAlarm}
            className={`h-12 px-space-sm flex items-center justify-center gap-1.5 rounded-lg font-headline-sm text-[13px] active:scale-95 transition-colors cursor-pointer ${
              scarcityAlarm
                ? 'bg-surface-container text-on-surface'
                : 'bg-surface-container-low text-on-surface-variant'
            }`}
          >
            <span
              className={`material-symbols-outlined text-[18px] ${
                scarcityAlarm ? 'text-tertiary-fixed-dim' : 'text-outline'
              }`}
            >
              {scarcityAlarm ? 'notifications_active' : 'notifications_off'}
            </span>
            <span>{scarcityAlarm ? 'Scarcity Alarm: ON' : 'Scarcity Alarm: OFF'}</span>
          </button>
        </div>
      </div>

      {/* Vehicle Profile & Smart Motoring Balance Card */}
      <div className="rounded-xl bg-surface-container-lowest shadow-sm p-space-md border border-surface-container-high/40">
        <div className="flex items-center justify-between mb-space-sm">
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-8 h-8 rounded-full bg-surface-container-high flex items-center justify-center text-primary">
              <span className="material-symbols-outlined text-[18px]">directions_car</span>
            </div>
            <div className="min-w-0">
              <div className="font-headline-sm text-[14px] text-on-surface truncate">
                {vehicle.model}
              </div>
              <div className="font-label-meta text-label-meta text-on-surface-variant">
                {vehicle.plate} • {vehicle.obuVersion}
              </div>
            </div>
          </div>
          <span className="px-2 py-0.5 rounded-full bg-secondary-container/40 text-on-secondary-container font-label-badge text-label-badge">
            IU LINKED
          </span>
        </div>

        <div className="rounded-lg bg-surface-container-low p-space-sm flex items-center justify-between border border-surface-container-high/20">
          <div className="flex items-center gap-space-sm">
            <div className="w-9 h-9 rounded-lg bg-primary-container text-primary-fixed flex items-center justify-center">
              <span className="material-symbols-outlined text-[20px]">credit_card</span>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-label-numeric-md text-label-numeric-md text-on-surface">
                  ${vehicle.netsBalance.toFixed(2)}
                </span>
                <span className="font-label-meta text-[11px] text-secondary font-semibold">
                  Auto-Synced
                </span>
              </div>
              <span className="font-label-meta text-[11px] text-on-surface-variant block">
                NETS Motoring Card • ~7 days buffer
              </span>
            </div>
          </div>
          <button
            onClick={onOpenTopUp}
            className="h-9 px-3 rounded-lg bg-surface-container text-on-surface font-headline-sm text-[12px] flex items-center gap-1 active:bg-surface-container-high transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px] text-secondary">add_circle</span>
            <span>Top Up</span>
          </button>
        </div>
      </div>

      {/* Singapore LTA Live ERP Operating Rates */}
      <div className="rounded-xl bg-surface-container-lowest shadow-sm p-space-md border border-surface-container-high/40">
        <div className="flex items-center justify-between mb-space-sm">
          <div className="flex items-center gap-space-xs">
            <span className="material-symbols-outlined text-[20px] text-primary">toll</span>
            <h3 className="font-headline-sm text-headline-sm text-on-surface">
              LTA ERP Operating Rates
            </h3>
          </div>
          <div className="flex items-center gap-1 text-on-surface-variant font-label-meta text-label-meta">
            <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse"></span>
            <span>Live Sync</span>
          </div>
        </div>

        {/* Expressways / Segments Horizontal Selector */}
        <div className="flex gap-space-xs overflow-x-auto pb-space-xs no-scrollbar mb-space-sm">
          <button
            onClick={() => setActiveSegmentTab('cte')}
            className={`px-3 py-1.5 rounded-full font-label-badge text-label-badge shrink-0 transition-colors cursor-pointer ${
              activeSegmentTab === 'cte'
                ? 'bg-primary text-on-primary'
                : 'bg-surface-container text-on-surface-variant hover:text-on-surface'
            }`}
          >
            CTE & PIE EXPRESSWAYS
          </button>

          <button
            onClick={() => setActiveSegmentTab('cbd')}
            className={`px-3 py-1.5 rounded-full font-label-badge text-label-badge shrink-0 transition-colors cursor-pointer ${
              activeSegmentTab === 'cbd'
                ? 'bg-primary text-on-primary'
                : 'bg-surface-container text-on-surface-variant hover:text-on-surface'
            }`}
          >
            CBD & ORCHARD CORDON
          </button>

          <button
            onClick={() => setActiveSegmentTab('kpe')}
            className={`px-3 py-1.5 rounded-full font-label-badge text-label-badge shrink-0 transition-colors cursor-pointer ${
              activeSegmentTab === 'kpe'
                ? 'bg-primary text-on-primary'
                : 'bg-surface-container text-on-surface-variant hover:text-on-surface'
            }`}
          >
            KPE & ECP CORRIDORS
          </button>
        </div>

        {/* Gantry Rate Cards List */}
        <div className="space-y-space-xs">
          {filteredGantries.map((gantry) => {
            const isRush = gantry.status === 'RUSH HOUR';
            const isOffPeak = gantry.status === 'OFF-PEAK';

            return (
              <div
                key={gantry.id}
                className="p-space-sm rounded-lg bg-surface-container-low flex items-start justify-between gap-space-sm border border-surface-container-high/20"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5 mb-1">
                    <span
                      className={`px-1.5 py-0.5 rounded font-label-badge text-[10px] uppercase font-bold ${
                        isRush
                          ? 'bg-error-container text-on-error-container'
                          : isOffPeak
                          ? 'bg-secondary-container text-on-secondary-container'
                          : 'bg-surface-container-highest text-on-surface-variant'
                      }`}
                    >
                      {gantry.status}
                    </span>
                    <span className="font-label-meta text-[11px] text-on-surface-variant">
                      Gantry {gantry.gantryNumber}
                    </span>
                  </div>
                  <div className="font-headline-sm text-[14px] text-on-surface truncate">
                    {gantry.name}
                  </div>
                  <div
                    className={`font-body-sm text-[12px] mt-0.5 ${
                      isOffPeak ? 'text-secondary font-medium' : 'text-on-surface-variant'
                    }`}
                  >
                    {gantry.activeTimeNote}
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span
                    className={`font-label-numeric-lg text-label-numeric-lg ${
                      isRush ? 'text-error' : isOffPeak ? 'text-secondary' : 'text-primary'
                    }`}
                  >
                    ${gantry.rate.toFixed(2)}
                  </span>
                  <span
                    className={`block font-label-meta text-[10px] uppercase font-bold ${
                      isOffPeak ? 'text-secondary' : 'text-on-surface-variant'
                    }`}
                  >
                    {gantry.chargeLabel}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Smart Parking Lot Alerts & Guardrails */}
      <div className="rounded-xl bg-surface-container-lowest shadow-sm p-space-md border border-surface-container-high/40">
        <div className="flex items-center gap-space-xs mb-space-sm">
          <span className="material-symbols-outlined text-[20px] text-secondary">tune</span>
          <h3 className="font-headline-sm text-headline-sm text-on-surface">
            Proactive Driver Guardrails
          </h3>
        </div>

        <div className="space-y-space-md">
          {/* Toggle 1: Scarcity Limit */}
          <div className="flex items-center justify-between gap-space-md">
            <div className="min-w-0">
              <div className="font-headline-sm text-[14px] text-on-surface">
                Low Lot Capacity Warning
              </div>
              <div className="font-body-sm text-[12px] text-on-surface-variant">
                Alert immediately when destination falls below 10 lots
              </div>
            </div>
            <button
              onClick={() => toggleGuardrail('lowCapacity')}
              aria-pressed={guardrails.lowCapacity}
              aria-label="Toggle Low Lot Capacity Warning"
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full transition-colors focus:outline-none ${
                guardrails.lowCapacity ? 'bg-primary' : 'bg-surface-container-highest'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-on-primary transition duration-200 mt-1 ml-0.5 ${
                  guardrails.lowCapacity ? 'translate-x-6' : 'translate-x-1'
                }`}
              ></span>
            </button>
          </div>

          {/* Toggle 2: Surge & Full Lot Warning */}
          <div className="flex items-center justify-between gap-space-md">
            <div className="min-w-0">
              <div className="font-headline-sm text-[14px] text-on-surface">
                Nearby Surge & Gridlock Alert
              </div>
              <div className="font-body-sm text-[12px] text-on-surface-variant">
                Flag carparks undergoing high holiday/event demand
              </div>
            </div>
            <button
              onClick={() => toggleGuardrail('surgeAlert')}
              aria-pressed={guardrails.surgeAlert}
              aria-label="Toggle Nearby Surge & Gridlock Alert"
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full transition-colors focus:outline-none ${
                guardrails.surgeAlert ? 'bg-primary' : 'bg-surface-container-highest'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-on-primary transition duration-200 mt-1 ml-0.5 ${
                  guardrails.surgeAlert ? 'translate-x-6' : 'translate-x-1'
                }`}
              ></span>
            </button>
          </div>

          {/* Toggle 3: Monsoon / Rain Sheltered MSCP */}
          <div className="flex items-center justify-between gap-space-md">
            <div className="min-w-0">
              <div className="font-headline-sm text-[14px] text-on-surface">
                Heavy Rain Covered MSCP Priority
              </div>
              <div className="font-body-sm text-[12px] text-on-surface-variant">
                Prioritize multi-storey sheltered lots during Singapore downpours
              </div>
            </div>
            <button
              onClick={() => toggleGuardrail('heavyRainPriority')}
              aria-pressed={guardrails.heavyRainPriority}
              aria-label="Toggle Heavy Rain Covered MSCP Priority"
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full transition-colors focus:outline-none ${
                guardrails.heavyRainPriority ? 'bg-primary' : 'bg-surface-container-highest'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-on-primary transition duration-200 mt-1 ml-0.5 ${
                  guardrails.heavyRainPriority ? 'translate-x-6' : 'translate-x-1'
                }`}
              ></span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

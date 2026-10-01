import React, { useState, useId } from 'react';
import { Carpark } from '../types/index.ts';

interface CarparkDetailsProps {
  carpark: Carpark;
  onBack: () => void;
  onStartNavigation: (carpark: Carpark) => void;
  onToggleFavorite: (id: string) => void;
  isFavorite: boolean;
  onPreviewPhoto?: (url: string, title: string) => void;
}

export const CarparkDetails: React.FC<CarparkDetailsProps> = ({
  carpark,
  onBack,
  onStartNavigation,
  onToggleFavorite,
  isFavorite,
  onPreviewPhoto
}) => {
  // Calculator state
  const [entryTime, setEntryTime] = useState('14:30');
  const [exitTime, setExitTime] = useState('17:45');
  const [isEditingEntry, setIsEditingEntry] = useState(false);
  const [isEditingExit, setIsEditingExit] = useState(false);
  const [syncSecondsAgo, setSyncSecondsAgo] = useState(18);

  const entryTimeId = useId();
  const exitTimeId = useId();

  // Calculate duration between entry and exit
  const parseTime = (timeStr: string) => {
    const [h, m] = timeStr.split(':').map(Number);
    return (h || 0) * 60 + (m || 0);
  };

  const entryMinutes = parseTime(entryTime);
  let exitMinutes = parseTime(exitTime);
  if (exitMinutes < entryMinutes) {
    exitMinutes += 24 * 60; // Next day
  }

  const durationMinutes = Math.max(0, exitMinutes - entryMinutes);
  const durationHours = Math.floor(durationMinutes / 60);
  const durationRemainderMinutes = durationMinutes % 60;

  // Dynamic fee calculation based on Singapore transitional rates
  const calculateFee = () => {
    if (durationMinutes <= carpark.gracePeriodMinutes) {
      return { total: 0.0, isGrace: true, isTransitional: false, dayFee: 0, eveningFee: 0 };
    }

    // Default Takashimaya / Orchard mall rate model
    // 08:00 - 17:00: Day rate ($3.27 1st hr, $1.09 / sub 30 min)
    // 17:00 - 24:00: Evening flat rate ($4.36)
    const entryTotalMin = entryMinutes % (24 * 60);
    const exitTotalMin = exitMinutes;

    const fivePmMin = 17 * 60; // 1020 mins

    if (entryTotalMin < fivePmMin && exitTotalMin > fivePmMin) {
      // Transitional
      const dayPortionMin = fivePmMin - entryTotalMin;
      let dayFee = 3.27;
      if (dayPortionMin > 60) {
        const extraHalfHours = Math.ceil((dayPortionMin - 60) / 30);
        dayFee += extraHalfHours * 1.09;
      }
      const eveningFee = 4.36;
      return {
        total: Number((dayFee + eveningFee).toFixed(2)),
        isGrace: false,
        isTransitional: true,
        dayFee: Number(dayFee.toFixed(2)),
        eveningFee
      };
    } else if (entryTotalMin >= fivePmMin) {
      return {
        total: 4.36,
        isGrace: false,
        isTransitional: false,
        dayFee: 0,
        eveningFee: 4.36
      };
    } else {
      let fee = 3.27;
      if (durationMinutes > 60) {
        const extra = Math.ceil((durationMinutes - 60) / 30);
        fee += extra * 1.09;
      }
      return {
        total: Number(fee.toFixed(2)),
        isGrace: false,
        isTransitional: false,
        dayFee: Number(fee.toFixed(2)),
        eveningFee: 0
      };
    }
  };

  const calculated = calculateFee();

  return (
    <div className="flex flex-col w-full pb-28">
      {/* Status Context Ribbon */}
      <div className="px-margin pt-space-sm pb-space-xs flex items-center justify-between">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1.5 py-1 text-on-surface-variant hover:text-on-surface transition-colors cursor-pointer"
        >
          <span className="material-symbols-outlined text-[18px]">arrow_back_ios</span>
          <span className="font-label-meta text-label-meta">Back to Nearby</span>
        </button>

        <div className="flex items-center gap-1.5 bg-secondary-container/30 px-2 py-0.5 rounded-full border border-secondary-container/50">
          <span className="w-2 h-2 rounded-full bg-secondary animate-pulse"></span>
          <span className="font-label-badge text-label-badge text-on-secondary-container">
            OPEN 24H • EPS READY
          </span>
        </div>
      </div>

      {/* Carpark Location & Overview Card */}
      <div className="px-margin mt-space-sm">
        <div className="bg-surface-container-lowest rounded-xl p-space-lg shadow-sm border border-surface-container-high/40">
          <div className="flex items-start justify-between gap-space-sm">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-1.5 mb-1.5">
                {carpark.tags.map((tag, idx) => (
                  <span
                    key={tag}
                    className={`font-label-badge text-label-badge px-2 py-0.5 rounded ${
                      idx === 0
                        ? 'bg-primary text-on-primary'
                        : 'bg-surface-container text-on-surface-variant'
                    }`}
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <h1 className="font-headline-lg text-headline-lg text-on-surface tracking-tight">
                {carpark.name}
              </h1>
              <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5 flex items-center gap-1">
                <span className="material-symbols-outlined text-[16px] text-outline">location_on</span>
                {carpark.address}
              </p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-surface-container flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-primary text-[28px]">local_parking</span>
            </div>
          </div>

          {/* Quick Map Snip */}
          <div
            className="w-full h-28 rounded-lg mt-space-md bg-cover bg-center overflow-hidden relative shadow-inner"
            style={{ backgroundImage: `url('${carpark.mapSnipUrl}')` }}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex items-end justify-between p-2.5">
              <span className="font-label-badge text-label-badge text-on-primary bg-primary/80 px-2 py-0.5 rounded backdrop-blur-md">
                {carpark.mapEntranceNote}
              </span>
              <span className="font-label-meta text-label-meta text-on-primary flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px]">turn_right</span>{' '}
                {carpark.entranceLane}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Real-Time Availability Visual Widget */}
      <div className="px-margin mt-space-md">
        <div className="bg-surface-container-lowest rounded-xl p-space-lg shadow-sm relative overflow-hidden border border-surface-container-high/40">
          {/* Ambient Live Glow */}
          <div className="absolute -top-12 -right-12 w-32 h-32 bg-secondary-fixed/30 rounded-full blur-2xl pointer-events-none"></div>

          <div className="flex items-center justify-between mb-space-sm">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-secondary"></span>
              <span className="font-label-meta text-label-meta text-on-surface uppercase tracking-wider font-bold">
                Live Lot Availability
              </span>
            </div>
            <span className="font-label-meta text-label-meta text-on-surface-variant bg-surface-container px-2 py-0.5 rounded-full">
              B2 & B3 Decks
            </span>
          </div>

          {/* Big Number & Status */}
          <div className="flex items-baseline justify-between mt-space-xs">
            <div className="flex items-baseline gap-space-xs">
              <span className="font-display-lg text-display-lg text-secondary tracking-tight">
                {carpark.availableLots}
              </span>
              <span className="font-headline-sm text-headline-sm text-on-surface-variant">
                Lots Free
              </span>
            </div>
            <div className="text-right">
              <span className="font-label-numeric-md text-label-numeric-md text-on-surface">
                {carpark.occupancyPercent}% Full
              </span>
              <p className="font-label-meta text-label-meta text-on-surface-variant">
                {carpark.trafficStatus}
              </p>
            </div>
          </div>

          {/* Occupancy Gradient Progress Bar */}
          <div className="w-full h-3 bg-surface-container rounded-full mt-3 overflow-hidden p-0.5">
            <div
              className="h-full rounded-full bg-gradient-to-r from-secondary via-secondary-container to-amber-500 transition-all duration-700 ease-out"
              style={{ width: `${carpark.occupancyPercent}%` }}
            ></div>
          </div>

          {/* Vehicle Type Categorized Lots */}
          <div className="grid grid-cols-3 gap-space-xs mt-space-md pt-space-sm">
            {/* CARS */}
            <div className="bg-surface-container-low rounded-lg p-2.5 flex flex-col justify-between">
              <div className="flex items-center justify-between text-on-surface-variant">
                <span className="material-symbols-outlined text-[18px]">directions_car</span>
                <span className="font-label-badge text-label-badge">CARS</span>
              </div>
              <div className="mt-2">
                <span className="font-label-numeric-lg text-label-numeric-lg text-on-surface">
                  {carpark.carAvailable}
                </span>
                <span className="font-label-meta text-label-meta text-on-surface-variant block">
                  available
                </span>
              </div>
            </div>

            {/* BIKES */}
            <div className="bg-surface-container-low rounded-lg p-2.5 flex flex-col justify-between">
              <div className="flex items-center justify-between text-on-surface-variant">
                <span className="material-symbols-outlined text-[18px]">two_wheeler</span>
                <span className="font-label-badge text-label-badge">BIKES</span>
              </div>
              <div className="mt-2">
                <span className="font-label-numeric-lg text-label-numeric-lg text-on-surface">
                  {carpark.bikeAvailable}
                </span>
                <span className="font-label-meta text-label-meta text-on-surface-variant block">
                  available
                </span>
              </div>
            </div>

            {/* EV DC */}
            <div className="bg-surface-container-low rounded-lg p-2.5 flex flex-col justify-between">
              <div className="flex items-center justify-between text-on-tertiary-container">
                <span className="material-symbols-outlined text-[18px]">electric_car</span>
                <span className="font-label-badge text-label-badge">EV DC</span>
              </div>
              <div className="mt-2">
                <span className="font-label-numeric-lg text-label-numeric-lg text-on-tertiary-container">
                  {carpark.evAvailable}
                  <span className="font-body-sm text-body-sm text-on-surface-variant">
                    /{carpark.evTotal || 4}
                  </span>
                </span>
                <span className="font-label-meta text-label-meta text-on-surface-variant block">
                  {carpark.evPower || '50kW plug'}
                </span>
              </div>
            </div>
          </div>

          {/* Sync Stamp */}
          <div className="flex items-center justify-center gap-1.5 mt-space-sm pt-space-xs text-on-surface-variant">
            <span className="material-symbols-outlined text-[14px] text-secondary">sync</span>
            <span className="font-label-meta text-label-meta">
              Live data synced {syncSecondsAgo} seconds ago via LTA DataMall
            </span>
          </div>
        </div>
      </div>

      {/* Interactive Parking Fee Calculator Tool */}
      <div className="px-margin mt-space-md">
        <div className="bg-surface-container-lowest rounded-xl p-space-lg shadow-sm border border-surface-container-high/40">
          <div className="flex items-center justify-between mb-space-sm">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-[22px]">calculate</span>
              <h2 className="font-headline-sm text-headline-sm text-on-surface">
                Parking Fee Calculator
              </h2>
            </div>
            <span className="font-label-badge text-label-badge bg-tertiary-fixed text-on-tertiary-fixed px-2 py-0.5 rounded">
              AUTO TARIFF
            </span>
          </div>

          {/* Time Pickers UI */}
          <div className="space-y-space-xs mt-space-sm">
            {/* Entry */}
            <div className="bg-surface-container-low rounded-lg p-3 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-surface-container-highest flex items-center justify-center text-on-surface">
                  <span className="material-symbols-outlined text-[18px]">login</span>
                </div>
                <div>
                  <span className="font-label-meta text-label-meta text-on-surface-variant block">
                    Estimated Entry
                  </span>
                  {isEditingEntry ? (
                    <input
                      id={entryTimeId}
                      type="time"
                      value={entryTime}
                      aria-label="Estimated Entry Time"
                      onChange={(e) => setEntryTime(e.target.value)}
                      onBlur={() => setIsEditingEntry(false)}
                      autoFocus
                      className="font-headline-sm text-headline-sm text-on-surface bg-surface-container px-1 py-0.5 rounded outline-none"
                    />
                  ) : (
                    <span className="font-headline-sm text-headline-sm text-on-surface">
                      Today, {entryTime}
                    </span>
                  )}
                </div>
              </div>
              <button
                onClick={() => setIsEditingEntry(!isEditingEntry)}
                className="bg-surface-container hover:bg-surface-container-high px-2.5 py-1.5 rounded-lg text-on-surface font-label-meta text-label-meta flex items-center gap-1 cursor-pointer transition-colors"
              >
                <span>{isEditingEntry ? 'Save' : 'Edit'}</span>
                <span className="material-symbols-outlined text-[14px]">
                  {isEditingEntry ? 'check' : 'edit'}
                </span>
              </button>
            </div>

            {/* Exit */}
            <div className="bg-surface-container-low rounded-lg p-3 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-surface-container-highest flex items-center justify-center text-on-surface">
                  <span className="material-symbols-outlined text-[18px]">logout</span>
                </div>
                <div>
                  <span className="font-label-meta text-label-meta text-on-surface-variant block">
                    Planned Exit
                  </span>
                  {isEditingExit ? (
                    <input
                      id={exitTimeId}
                      type="time"
                      value={exitTime}
                      aria-label="Planned Exit Time"
                      onChange={(e) => setExitTime(e.target.value)}
                      onBlur={() => setIsEditingExit(false)}
                      autoFocus
                      className="font-headline-sm text-headline-sm text-on-surface bg-surface-container px-1 py-0.5 rounded outline-none"
                    />
                  ) : (
                    <span className="font-headline-sm text-headline-sm text-on-surface">
                      Today, {exitTime}
                    </span>
                  )}
                </div>
              </div>
              <button
                onClick={() => setIsEditingExit(!isEditingExit)}
                className="bg-surface-container hover:bg-surface-container-high px-2.5 py-1.5 rounded-lg text-on-surface font-label-meta text-label-meta flex items-center gap-1 cursor-pointer transition-colors"
              >
                <span>{isEditingExit ? 'Save' : 'Edit'}</span>
                <span className="material-symbols-outlined text-[14px]">
                  {isEditingExit ? 'check' : 'edit'}
                </span>
              </button>
            </div>
          </div>

          {/* Quick presets */}
          <div className="flex items-center gap-2 mt-2 overflow-x-auto no-scrollbar py-1">
            <span className="font-label-meta text-label-meta text-on-surface-variant shrink-0">
              Quick duration:
            </span>
            {[
              { label: '1 hr', h: 1, m: 0 },
              { label: '2 hrs', h: 2, m: 0 },
              { label: '3h 15m', h: 3, m: 15 },
              { label: '4 hrs', h: 4, m: 0 }
            ].map((preset) => (
              <button
                key={preset.label}
                onClick={() => {
                  const [eh, em] = entryTime.split(':').map(Number);
                  const totalMin = eh * 60 + em + preset.h * 60 + preset.m;
                  const newH = Math.floor((totalMin % (24 * 60)) / 60);
                  const newM = totalMin % 60;
                  setExitTime(
                    `${String(newH).padStart(2, '0')}:${String(newM).padStart(2, '0')}`
                  );
                }}
                className="px-2.5 py-1 rounded bg-surface-container hover:bg-surface-container-high text-on-surface font-label-meta text-[11px] shrink-0 cursor-pointer"
              >
                {preset.label}
              </button>
            ))}
          </div>

          {/* Duration Banner */}
          <div className="mt-space-xs flex items-center justify-between px-3 py-2 bg-surface-container/60 rounded-lg">
            <span className="font-label-meta text-label-meta text-on-surface-variant flex items-center gap-1">
              <span className="material-symbols-outlined text-[16px]">schedule</span> Total Stay
              Duration
            </span>
            <span className="font-label-numeric-md text-label-numeric-md text-on-surface">
              {durationHours} hrs {durationRemainderMinutes} mins
            </span>
          </div>

          {/* Calculated Estimate Callout */}
          <div className="mt-space-md p-space-md bg-surface-container-highest/60 rounded-xl flex items-center justify-between border border-surface-container-high/40">
            <div>
              <span className="font-label-meta text-label-meta text-on-surface-variant block uppercase tracking-wider">
                Estimated Charges
              </span>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span className="font-display-lg text-display-lg text-on-surface tracking-tight">
                  ${calculated.total.toFixed(2)}
                </span>
                <span className="font-label-numeric-md text-label-numeric-md text-on-surface-variant">
                  SGD
                </span>
              </div>
              <p className="font-label-meta text-label-meta text-secondary font-medium flex items-center gap-1 mt-1">
                <span className="material-symbols-outlined text-[14px]">verified</span>
                {calculated.isGrace
                  ? 'Within 10-min free grace period'
                  : calculated.isTransitional
                  ? 'Day + Evening transitional rate applied'
                  : 'Standard rate applied'}
              </p>
            </div>
            <div className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-on-surface shadow-xs">
              <span className="material-symbols-outlined text-[20px]">receipt_long</span>
            </div>
          </div>

          {/* Rate Breakdown Accordion */}
          <div className="mt-space-md space-y-2">
            <details
              className="group bg-surface-container-low rounded-lg overflow-hidden transition-all duration-200 border border-surface-container-high/30"
              open
            >
              <summary className="p-3 flex items-center justify-between cursor-pointer list-none select-none">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[18px] text-outline">
                    payments
                  </span>
                  <span className="font-headline-sm text-headline-sm text-on-surface">
                    Published Tariff Rates
                  </span>
                </div>
                <span className="material-symbols-outlined text-[20px] text-on-surface-variant group-open:rotate-180 transition-transform">
                  expand_more
                </span>
              </summary>
              <div className="px-3 pb-3 pt-1 space-y-2.5">
                {/* Rate Item 1 */}
                <div className="flex items-start justify-between text-body-sm text-on-surface">
                  <div>
                    <span className="font-medium block">Mon - Fri (08:00 - 17:00)</span>
                    <span className="text-on-surface-variant font-label-meta text-label-meta">
                      $3.27 1st hr • $1.09 / sub 30m
                    </span>
                  </div>
                  <span className="font-label-numeric-md text-label-numeric-md text-on-surface">
                    $6.54
                  </span>
                </div>

                {/* Rate Item 2 */}
                <div className="flex items-start justify-between text-body-sm text-on-surface">
                  <div>
                    <span className="font-medium block">Mon - Fri Evening (17:00 - 24:00)</span>
                    <span className="text-on-surface-variant font-label-meta text-label-meta">
                      Per entry flat charge
                    </span>
                  </div>
                  <span className="font-label-numeric-md text-label-numeric-md text-on-surface">
                    $4.36
                  </span>
                </div>

                {/* Rate Item 3 */}
                <div className="flex items-start justify-between text-body-sm text-on-surface-variant">
                  <div>
                    <span className="font-medium block">Sat, Sun & Public Holidays</span>
                    <span className="font-label-meta text-label-meta">
                      $4.36 1st 2 hrs • $1.64 / sub 30m
                    </span>
                  </div>
                  <span className="font-label-meta text-label-meta italic">Standard Weekend</span>
                </div>

                {/* Grace Period */}
                <div className="flex items-center gap-2 bg-surface-container p-2 rounded text-secondary font-label-meta text-label-meta">
                  <span className="material-symbols-outlined text-[16px]">timer</span>
                  <span>
                    <strong>10-min Grace Period:</strong> No charge if vehicle exits within 10
                    minutes.
                  </span>
                </div>
              </div>
            </details>
          </div>
        </div>
      </div>

      {/* Facilities, Height Limit & Amenities Bento Grid */}
      <div className="px-margin mt-space-md">
        <div className="bg-surface-container-lowest rounded-xl p-space-lg shadow-sm border border-surface-container-high/40">
          <h2 className="font-headline-sm text-headline-sm text-on-surface mb-space-sm flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[20px]">tune</span> Carpark
            Specs & Access
          </h2>

          <div className="grid grid-cols-1 gap-space-sm">
            {/* Height Clearance Alert */}
            <div className="bg-surface-container-low rounded-lg p-3 flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-surface-container-highest flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-error text-[22px]">height</span>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-headline-sm text-headline-sm text-on-surface">
                    {carpark.heightClearance}m Clearance
                  </span>
                  <span className="bg-error-container text-on-error-container font-label-badge text-label-badge px-1.5 py-0.5 rounded">
                    LIMIT
                  </span>
                </div>
                <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">
                  {carpark.gantryNotice}
                </p>
              </div>
            </div>

            {/* Payment Modes */}
            <div className="bg-surface-container-low rounded-lg p-3 flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-surface-container-highest flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-primary text-[22px]">
                  contactless
                </span>
              </div>
              <div className="min-w-0">
                <span className="font-headline-sm text-headline-sm text-on-surface block">
                  Gantry Payment Methods
                </span>
                <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">
                  {carpark.gantryMethods.join(', ')} at exit barrier.
                </p>
              </div>
            </div>

            {/* Special Amenities List */}
            <div className="bg-surface-container-low rounded-lg p-3 flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-surface-container-highest flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-secondary text-[22px]">hub</span>
              </div>
              <div className="w-full">
                <span className="font-headline-sm text-headline-sm text-on-surface block mb-1">
                  Key Facilities On-Site
                </span>
                <ul className="space-y-1.5 text-body-sm text-on-surface-variant">
                  {carpark.facilities.map((fac, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-secondary text-[16px]">
                        {fac.icon}
                      </span>
                      <span>
                        <strong>{fac.title}:</strong> {fac.desc}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Surrounding Photos & Visual Anchors */}
      <div className="px-margin mt-space-md">
        <div className="bg-surface-container-lowest rounded-xl p-space-lg shadow-sm border border-surface-container-high/40">
          <span className="font-headline-sm text-headline-sm text-on-surface block mb-space-xs">
            Gantry & Pillar Gallery
          </span>
          <p className="font-body-sm text-body-sm text-on-surface-variant mb-space-sm">
            Visual guides for ease of locating your parked bay upon return.
          </p>

          <div className="grid grid-cols-2 gap-space-sm">
            {carpark.photos.map((photo, idx) => (
              <div
                key={idx}
                onClick={() => onPreviewPhoto && onPreviewPhoto(photo.url, photo.title)}
                className="relative rounded-lg overflow-hidden h-28 bg-surface-container cursor-pointer group"
              >
                <img
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  data-alt={photo.alt}
                  src={photo.url}
                  alt={photo.title}
                />
                <span className="absolute bottom-1.5 left-1.5 bg-black/60 backdrop-blur-sm text-on-primary font-label-badge text-label-badge px-1.5 py-0.5 rounded">
                  {photo.title}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Floating Action Bar Safe Buffer */}
      <div className="h-10"></div>

      {/* Primary Floating Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-surface-container-lowest/95 backdrop-blur-lg shadow-[0_-4px_20px_rgba(0,0,0,0.06)] px-margin py-3 pb-safe border-t border-surface-container-high/40">
        <div className="flex items-center gap-space-sm max-w-lg mx-auto">
          {/* Save / Favorite Button */}
          <button
            aria-label="Save to Favorites"
            onClick={() => onToggleFavorite(carpark.id)}
            className={`w-12 h-12 rounded-xl bg-surface-container hover:bg-surface-container-high transition-colors flex items-center justify-center shrink-0 cursor-pointer ${
              isFavorite ? 'text-error' : 'text-on-surface'
            }`}
          >
            <span
              className={`material-symbols-outlined text-[24px] ${
                isFavorite ? 'material-symbols-fill' : ''
              }`}
            >
              {isFavorite ? 'favorite' : 'favorite_border'}
            </span>
          </button>

          {/* Large Primary Navigation Button */}
          <button
            onClick={() => onStartNavigation(carpark)}
            className="flex-1 h-12 bg-secondary text-on-secondary hover:bg-secondary-fixed-dim rounded-xl font-headline-sm text-headline-sm flex items-center justify-center gap-2 shadow-md active:scale-[0.98] transition-transform cursor-pointer"
          >
            <span className="material-symbols-outlined text-[22px]">navigation</span>
            <span>Start Navigation (Turn-by-turn)</span>
          </button>
        </div>
      </div>
    </div>
  );
};

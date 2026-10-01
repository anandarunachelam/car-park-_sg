import React, { useState } from 'react';
import { Carpark } from '../types/index.ts';

interface MapViewProps {
  carparks: Carpark[];
  selectedCarpark: Carpark;
  onSelectCarpark: (carpark: Carpark) => void;
  onOpenDetails: (carpark: Carpark) => void;
  onStartNavigation: (carpark: Carpark) => void;
  onOpenExternalMaps: (carpark: Carpark) => void;
  onToggleFavorite: (id: string) => void;
  favorites: string[];
  onOpenFilter: () => void;
}

export const MapView: React.FC<MapViewProps> = ({
  carparks,
  selectedCarpark,
  onSelectCarpark,
  onOpenDetails,
  onStartNavigation,
  onOpenExternalMaps,
  onToggleFavorite,
  favorites,
  onOpenFilter
}) => {
  const [searchQuery, setSearchQuery] = useState('Orchard Rd, Singapore');
  const [selectedDestination, setSelectedDestination] = useState('Orchard Road');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [trafficActive, setTrafficActive] = useState(true);
  const [isListening, setIsListening] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2200);
  };

  const handleVoiceSearch = () => {
    setIsListening(true);
    showToast('Listening... Speak destination');
    setTimeout(() => {
      setIsListening(false);
      setSearchQuery('Takashimaya Orchard');
      showToast('Found "Takashimaya / Ngee Ann City"');
      const taka = carparks.find((c) => c.id === 'taka');
      if (taka) onSelectCarpark(taka);
    }, 1800);
  };

  const handleRecenter = () => {
    showToast('Centered to GPS • Paterson Hill');
  };

  const isSelectedFav = favorites.includes(selectedCarpark.id);

  // Filter carparks based on category
  const filteredCarparks = carparks.filter((c) => {
    if (selectedCategory === 'All') return true;
    if (selectedCategory === 'HDB Only') return c.type.includes('HDB');
    if (selectedCategory === 'URA / Street') return c.type.includes('URA');
    if (selectedCategory === 'Shopping Malls') return c.type.includes('MALL') || c.type.includes('COMMERCIAL');
    if (selectedCategory === 'EV Charging') return c.evTotal > 0;
    if (selectedCategory === 'Grace > 15m') return c.gracePeriodMinutes >= 15;
    return true;
  });

  return (
    <div className="flex flex-col w-full relative pb-20">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full bg-primary text-on-primary text-body-sm font-medium shadow-xl z-50 transition-all animate-bounce">
          {toastMessage}
        </div>
      )}

      {/* Top Quick Control Island (Over Map) */}
      <div className="px-margin pt-space-sm pb-space-sm space-y-space-sm z-30">
        {/* Floating Glass Search Header */}
        <div className="flex items-center gap-space-sm bg-surface-container-lowest/95 backdrop-blur-xl px-space-md py-2.5 rounded-xl shadow-md border border-surface-container-high/40">
          <span className="material-symbols-outlined text-outline text-[22px] shrink-0">search</span>
          <input
            className="w-full bg-transparent font-body-md text-body-md text-on-surface placeholder:text-outline focus:outline-none"
            placeholder="Search destination or carpark..."
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="text-outline hover:text-on-surface text-[18px] p-0.5"
            >
              <span className="material-symbols-outlined text-[18px]">close</span>
            </button>
          )}
          <button
            aria-label="Voice Search"
            onClick={handleVoiceSearch}
            className={`w-8 h-8 rounded-full flex items-center justify-center transition-transform shrink-0 cursor-pointer ${
              isListening
                ? 'bg-secondary text-on-secondary animate-pulse scale-105'
                : 'bg-surface-container text-on-surface-variant hover:text-on-surface active:scale-95'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">
              {isListening ? 'graphic_eq' : 'mic'}
            </span>
          </button>
          <button
            aria-label="Filter Options"
            onClick={onOpenFilter}
            className="w-8 h-8 rounded-full flex items-center justify-center bg-surface-container text-on-surface-variant hover:text-on-surface active:scale-95 transition-transform shrink-0 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">tune</span>
          </button>
        </div>

        {/* Quick Destination Chips */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5 -mx-margin px-margin">
          {['Orchard Road', 'Bugis Junction', 'Raffles Place', 'Marina Bay'].map((dest) => (
            <button
              key={dest}
              onClick={() => {
                setSelectedDestination(dest);
                setSearchQuery(`${dest}, Singapore`);
                if (dest === 'Bugis Junction') {
                  const b = carparks.find((c) => c.id === 'bugis');
                  if (b) onSelectCarpark(b);
                } else if (dest === 'Orchard Road') {
                  const o = carparks.find((c) => c.id === 'ion');
                  if (o) onSelectCarpark(o);
                }
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-body-sm font-body-sm shrink-0 shadow-sm active:scale-95 transition-all cursor-pointer ${
                selectedDestination === dest
                  ? 'bg-primary text-on-primary'
                  : 'bg-surface-container-lowest/90 backdrop-blur text-on-surface-variant hover:text-on-surface'
              }`}
            >
              <span className="material-symbols-outlined text-[14px]">
                {dest === 'Orchard Road'
                  ? 'near_me'
                  : dest === 'Bugis Junction'
                  ? 'history'
                  : dest === 'Raffles Place'
                  ? 'business'
                  : 'attractions'}
              </span>
              <span>{dest}</span>
            </button>
          ))}
        </div>

        {/* Filter Categories Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar -mx-margin px-margin pb-1">
          {['All', 'HDB Only', 'URA / Street', 'Shopping Malls', 'EV Charging', 'Grace > 15m'].map(
            (category) => {
              const label = category === 'All' ? 'All (148)' : category;
              const isActive = selectedCategory === category;
              return (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-2.5 py-1 rounded-full font-label-badge text-label-badge uppercase tracking-wider shrink-0 transition-colors cursor-pointer ${
                    isActive
                      ? 'bg-primary text-on-primary shadow-sm'
                      : 'bg-surface-container-lowest text-on-surface-variant hover:bg-surface-container shadow-xs'
                  }`}
                >
                  {label}
                </button>
              );
            }
          )}
        </div>
      </div>

      {/* Interactive Map Canvas Container */}
      <div className="relative w-full h-[520px] overflow-hidden select-none bg-surface-container-low border-y border-surface-container-high/40">
        {/* Stylized Singapore Vector Street Grid */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none"
          preserveAspectRatio="xMidYMid slice"
          viewBox="0 0 400 520"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <pattern height="40" id="city-blocks" patternUnits="userSpaceOnUse" width="40">
              <rect fill="#eef2f5" height="38" rx="3" width="38"></rect>
            </pattern>
            <linearGradient id="routeGradient" x1="0%" x2="50%" y1="100%" y2="20%">
              <stop offset="0%" stopColor="#006c49" stopOpacity="0.9"></stop>
              <stop offset="100%" stopColor="#6cf8bb" stopOpacity="1"></stop>
            </linearGradient>
          </defs>

          {/* Background Blocks Pattern */}
          <rect fill="url(#city-blocks)" height="100%" width="100%"></rect>

          {/* Urban Park / Green Buffers (Fort Canning & Istana Grounds) */}
          <path d="M 280,-20 L 420,-20 L 420,130 L 310,110 Z" fill="#d9f2e6" opacity="0.7"></path>
          <path d="M -10,320 L 90,320 L 70,440 L -10,410 Z" fill="#d9f2e6" opacity="0.6"></path>

          {/* Secondary Road Grid */}
          <path d="M -20,110 L 420,90" stroke="#ffffff" strokeLinecap="round" strokeWidth="14"></path>
          <path d="M -20,220 L 420,200" stroke="#ffffff" strokeLinecap="round" strokeWidth="12"></path>
          <path d="M -20,380 L 420,360" stroke="#ffffff" strokeLinecap="round" strokeWidth="12"></path>
          <path d="M 90,-20 L 110,540" stroke="#ffffff" strokeLinecap="round" strokeWidth="14"></path>
          <path d="M 230,-20 L 250,540" stroke="#ffffff" strokeLinecap="round" strokeWidth="14"></path>
          <path d="M 330,-20 L 350,540" stroke="#ffffff" strokeLinecap="round" strokeWidth="10"></path>

          {/* Major Arterials (Orchard Rd & Somerset Rd) */}
          <path
            d="M -20,250 C 100,245 220,210 420,180"
            fill="none"
            stroke="#dde1e5"
            strokeWidth="16"
          ></path>
          <path
            d="M -20,250 C 100,245 220,210 420,180"
            fill="none"
            stroke="#ffffff"
            strokeWidth="12"
          ></path>

          {/* Somerset Road Corridor */}
          <path
            d="M 120,350 C 200,340 310,290 420,270"
            fill="none"
            stroke="#dde1e5"
            strokeWidth="12"
          ></path>
          <path
            d="M 120,350 C 200,340 310,290 420,270"
            fill="none"
            stroke="#ffffff"
            strokeWidth="8"
          ></path>

          {/* Grange Road / Paterson Hill link */}
          <path
            d="M 50,470 C 80,380 90,280 100,100"
            fill="none"
            stroke="#dde1e5"
            strokeWidth="12"
          ></path>
          <path
            d="M 50,470 C 80,380 90,280 100,100"
            fill="none"
            stroke="#ffffff"
            strokeWidth="8"
          ></path>

          {/* Traffic Heatmap Dynamic Layer */}
          <path
            d="M 90,270 C 150,250 200,230 250,215"
            fill="none"
            opacity={trafficActive ? 0.85 : 0.15}
            stroke="#f59e0b"
            strokeLinecap="round"
            strokeWidth="4"
          ></path>
          <path
            d="M 250,215 C 310,200 370,185 410,180"
            fill="none"
            opacity={trafficActive ? 0.85 : 0.15}
            stroke="#10b981"
            strokeLinecap="round"
            strokeWidth="4"
          ></path>

          {/* Active Turn Navigation Route towards selected carpark */}
          <path
            d={
              selectedCarpark.id === 'taka'
                ? 'M 75,445 C 85,380 120,300 180,260 C 210,240 240,220 260,195'
                : selectedCarpark.id === 'somerset'
                ? 'M 75,445 C 100,390 180,360 250,330 C 280,320 300,310 310,300'
                : selectedCarpark.id === 'angullia'
                ? 'M 75,445 C 80,360 90,280 110,230 C 120,210 125,200 130,190'
                : selectedCarpark.id === 'waterloo'
                ? 'M 75,445 C 120,380 200,260 270,180 C 300,150 320,135 330,120'
                : 'M 75,445 C 82,380 90,300 115,260 C 125,245 155,238 210,225'
            }
            fill="none"
            stroke="url(#routeGradient)"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="6"
          ></path>
          <path
            d={
              selectedCarpark.id === 'taka'
                ? 'M 75,445 C 85,380 120,300 180,260 C 210,240 240,220 260,195'
                : selectedCarpark.id === 'somerset'
                ? 'M 75,445 C 100,390 180,360 250,330 C 280,320 300,310 310,300'
                : selectedCarpark.id === 'angullia'
                ? 'M 75,445 C 80,360 90,280 110,230 C 120,210 125,200 130,190'
                : selectedCarpark.id === 'waterloo'
                ? 'M 75,445 C 120,380 200,260 270,180 C 300,150 320,135 330,120'
                : 'M 75,445 C 82,380 90,300 115,260 C 125,245 155,238 210,225'
            }
            fill="none"
            stroke="#ffffff"
            strokeDasharray="6 6"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
          ></path>

          {/* Street Label Typography SVG Overlays */}
          <text
            fill="#76777d"
            fontSize="9"
            fontWeight="600"
            letterSpacing="0.5"
            transform="rotate(-5, 60, 275)"
            x="60"
            y="275"
          >
            ORCHARD RD
          </text>
          <text
            fill="#76777d"
            fontSize="9"
            fontWeight="600"
            letterSpacing="0.5"
            transform="rotate(-12, 260, 325)"
            x="260"
            y="325"
          >
            SOMERSET RD
          </text>
          <text
            fill="#76777d"
            fontSize="8"
            fontWeight="600"
            letterSpacing="0.5"
            transform="rotate(-75, 45, 380)"
            x="45"
            y="380"
          >
            PATERSON HILL
          </text>
          <text fill="#76777d" fontSize="8" fontWeight="600" letterSpacing="0.5" x="210" y="80">
            CAVENAGH RD
          </text>
        </svg>

        {/* GPS Driver Location Pulse (Paterson Hill) */}
        <div className="absolute left-[75px] top-[445px] -translate-x-1/2 -translate-y-1/2 pointer-events-none z-20">
          <div className="w-10 h-10 rounded-full bg-secondary-fixed/50 animate-ping absolute -inset-1"></div>
          <div className="w-8 h-8 rounded-full bg-secondary/20 flex items-center justify-center relative">
            <div className="w-4 h-4 rounded-full bg-secondary shadow-lg flex items-center justify-center">
              <div className="w-1.5 h-1.5 rounded-full bg-on-secondary"></div>
            </div>
          </div>
          <div className="absolute top-5 left-1/2 -translate-x-1/2 px-1.5 py-0.5 rounded bg-primary text-on-primary font-label-badge text-[9px] uppercase tracking-wider whitespace-nowrap shadow-sm">
            You (Paterson)
          </div>
        </div>

        {/* Interactive Carpark Pin 1: ION Orchard (Mall) */}
        <div
          className="absolute left-[210px] top-[220px] -translate-x-1/2 -translate-y-full cursor-pointer z-30 group"
          onClick={() => {
            const ion = carparks.find((c) => c.id === 'ion');
            if (ion) onSelectCarpark(ion);
          }}
        >
          <div className="relative flex flex-col items-center">
            {selectedCarpark.id === 'ion' && (
              <span className="absolute -top-1 w-full h-8 rounded-full bg-secondary/30 animate-pulse"></span>
            )}
            <div
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-full shadow-xl transition-transform group-hover:scale-105 ${
                selectedCarpark.id === 'ion'
                  ? 'bg-primary text-on-primary ring-2 ring-secondary-container'
                  : 'bg-surface-container-lowest text-on-surface'
              }`}
            >
              <span className="w-2.5 h-2.5 rounded-full bg-secondary shadow-sm"></span>
              <div className="flex flex-col text-left leading-none">
                <span className="font-label-numeric-md text-[13px]">142 lots</span>
                <span
                  className={`font-label-badge text-[9px] ${
                    selectedCarpark.id === 'ion' ? 'text-primary-fixed-dim' : 'text-on-surface-variant'
                  }`}
                >
                  $3.27/h
                </span>
              </div>
              {selectedCarpark.id === 'ion' && (
                <span className="material-symbols-outlined text-[15px] text-secondary-fixed">
                  navigation
                </span>
              )}
            </div>
            <div
              className={`w-2 h-2 rotate-45 -mt-1 shadow-sm ${
                selectedCarpark.id === 'ion' ? 'bg-primary' : 'bg-surface-container-lowest'
              }`}
            ></div>
            <span className="mt-0.5 px-1 py-0.2 rounded bg-surface-container-lowest/90 backdrop-blur font-label-badge text-[9px] font-bold text-on-surface shadow-xs">
              ION Orchard
            </span>
          </div>
        </div>

        {/* Interactive Carpark Pin 2: 313@Somerset (Amber, Warning) */}
        <div
          className="absolute left-[310px] top-[300px] -translate-x-1/2 -translate-y-full cursor-pointer z-20 group"
          onClick={() => {
            const sm = carparks.find((c) => c.id === 'somerset');
            if (sm) onSelectCarpark(sm);
          }}
        >
          <div className="relative flex flex-col items-center">
            {selectedCarpark.id === 'somerset' && (
              <span className="absolute -top-1 w-full h-8 rounded-full bg-tertiary-fixed-dim/30 animate-pulse"></span>
            )}
            <div
              className={`flex items-center gap-1.5 px-2 py-1 rounded-full shadow-md transition-transform group-hover:scale-105 ${
                selectedCarpark.id === 'somerset'
                  ? 'bg-primary text-on-primary ring-2 ring-tertiary-fixed'
                  : 'bg-surface-container-lowest text-on-surface'
              }`}
            >
              <span className="w-2.5 h-2.5 rounded-full bg-on-tertiary-container shadow-sm animate-pulse"></span>
              <div className="flex flex-col text-left leading-none">
                <span
                  className={`font-label-numeric-md text-[12px] font-bold ${
                    selectedCarpark.id === 'somerset' ? 'text-tertiary-fixed' : 'text-on-tertiary-container'
                  }`}
                >
                  18 lots
                </span>
                <span
                  className={`font-label-badge text-[9px] ${
                    selectedCarpark.id === 'somerset' ? 'text-primary-fixed-dim' : 'text-on-surface-variant'
                  }`}
                >
                  $3.50/h
                </span>
              </div>
            </div>
            <div
              className={`w-2 h-2 rotate-45 -mt-1 shadow-sm ${
                selectedCarpark.id === 'somerset' ? 'bg-primary' : 'bg-surface-container-lowest'
              }`}
            ></div>
            <span className="mt-0.5 px-1 py-0.2 rounded bg-surface-container-lowest/90 font-label-badge text-[8px] text-on-surface-variant shadow-xs">
              313 Somerset
            </span>
          </div>
        </div>

        {/* Interactive Carpark Pin 3: Takashimaya / Ngee Ann City (Green) */}
        <div
          className="absolute left-[260px] top-[190px] -translate-x-1/2 -translate-y-full cursor-pointer z-20 group"
          onClick={() => {
            const taka = carparks.find((c) => c.id === 'taka');
            if (taka) onSelectCarpark(taka);
          }}
        >
          <div className="relative flex flex-col items-center">
            {selectedCarpark.id === 'taka' && (
              <span className="absolute -top-1 w-full h-8 rounded-full bg-secondary/30 animate-pulse"></span>
            )}
            <div
              className={`flex items-center gap-1 px-2 py-1 rounded-full shadow-md transition-transform group-hover:scale-105 ${
                selectedCarpark.id === 'taka'
                  ? 'bg-primary text-on-primary ring-2 ring-secondary-container'
                  : 'bg-surface-container-lowest text-on-surface'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-secondary"></span>
              <span className="font-label-numeric-md text-[11px] font-bold">64 lots</span>
            </div>
            <div
              className={`w-1.5 h-1.5 rotate-45 -mt-0.5 shadow-sm ${
                selectedCarpark.id === 'taka' ? 'bg-primary' : 'bg-surface-container-lowest'
              }`}
            ></div>
            <span className="mt-0.5 px-1 py-0.2 rounded bg-surface-container-lowest/90 font-label-badge text-[8px] text-on-surface-variant">
              Takashimaya
            </span>
          </div>
        </div>

        {/* Interactive Carpark Pin 4: URA Angullia Park (Red / FULL) */}
        <div
          className="absolute left-[130px] top-[190px] -translate-x-1/2 -translate-y-full cursor-pointer z-20 group"
          onClick={() => {
            const ang = carparks.find((c) => c.id === 'angullia');
            if (ang) onSelectCarpark(ang);
          }}
        >
          <div className="relative flex flex-col items-center">
            <div
              className={`flex items-center gap-1 px-2 py-1 rounded-full shadow-md opacity-90 transition-transform group-hover:scale-105 ${
                selectedCarpark.id === 'angullia'
                  ? 'bg-primary text-error-container ring-2 ring-error'
                  : 'bg-surface-container-lowest text-on-surface'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-error"></span>
              <span className="font-label-numeric-md text-[11px] font-bold text-error">4 LEFT</span>
            </div>
            <div
              className={`w-1.5 h-1.5 rotate-45 -mt-0.5 shadow-sm ${
                selectedCarpark.id === 'angullia' ? 'bg-primary' : 'bg-surface-container-lowest'
              }`}
            ></div>
            <span className="mt-0.5 px-1 py-0.2 rounded bg-surface-container-lowest/90 font-label-badge text-[8px] text-error font-medium">
              URA Angullia
            </span>
          </div>
        </div>

        {/* Interactive Carpark Pin 5: HDB Waterloo St (HDB Value Option) */}
        <div
          className="absolute left-[330px] top-[120px] -translate-x-1/2 -translate-y-full cursor-pointer z-20 group"
          onClick={() => {
            const w = carparks.find((c) => c.id === 'waterloo');
            if (w) onSelectCarpark(w);
          }}
        >
          <div className="relative flex flex-col items-center">
            <div
              className={`flex items-center gap-1 px-2 py-1 rounded-full shadow-md transition-transform group-hover:scale-105 ${
                selectedCarpark.id === 'waterloo'
                  ? 'bg-primary text-on-primary ring-2 ring-primary-fixed'
                  : 'bg-surface-container-lowest text-on-surface'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-secondary"></span>
              <div className="flex flex-col text-left leading-none">
                <span className="font-label-numeric-md text-[11px] font-bold text-secondary">
                  87 lots
                </span>
                <span
                  className={`font-label-badge text-[8px] ${
                    selectedCarpark.id === 'waterloo' ? 'text-primary-fixed-dim' : 'text-on-surface-variant'
                  }`}
                >
                  $1.20/h
                </span>
              </div>
            </div>
            <div
              className={`w-1.5 h-1.5 rotate-45 -mt-0.5 shadow-sm ${
                selectedCarpark.id === 'waterloo' ? 'bg-primary' : 'bg-surface-container-lowest'
              }`}
            ></div>
            <span className="mt-0.5 px-1 py-0.2 rounded bg-error-container text-on-error-container font-label-badge text-[8px] font-bold">
              HDB Waterloo
            </span>
          </div>
        </div>

        {/* Floating Map Utility Action FABs */}
        <div className="absolute right-margin top-3 space-y-2 z-20 flex flex-col items-end">
          {/* Compass / Heading Button */}
          <button
            onClick={() => showToast('Oriented to Magnetic North')}
            className="w-11 h-11 rounded-full bg-surface-container-lowest/95 backdrop-blur-md shadow-md text-on-surface flex items-center justify-center active:scale-90 transition-transform cursor-pointer border border-surface-container-high/40"
            title="North Align"
          >
            <span className="material-symbols-outlined text-[20px] text-error">explore</span>
          </button>

          {/* Traffic Heatmap Toggle */}
          <button
            onClick={() => {
              setTrafficActive(!trafficActive);
              showToast(trafficActive ? 'Traffic overlay disabled' : 'Live traffic overlay enabled');
            }}
            className={`w-11 h-11 rounded-full bg-surface-container-lowest/95 backdrop-blur-md shadow-md flex items-center justify-center active:scale-90 transition-transform cursor-pointer border border-surface-container-high/40 ${
              trafficActive ? 'text-secondary' : 'text-outline'
            }`}
            title="Toggle Live Traffic"
          >
            <span className="material-symbols-outlined text-[20px]">traffic</span>
          </button>

          {/* Recenter GPS Location */}
          <button
            onClick={handleRecenter}
            className="w-11 h-11 rounded-full bg-primary text-on-primary shadow-lg flex items-center justify-center active:scale-90 transition-transform cursor-pointer"
            title="Recenter to GPS"
          >
            <span className="material-symbols-outlined text-[20px]">my_location</span>
          </button>
        </div>

        {/* Map Info Indicator (Civic Real-Time Stamp) */}
        <div className="absolute left-margin bottom-3 z-10 flex items-center gap-1.5 px-2 py-1 rounded-lg bg-surface-container-lowest/80 backdrop-blur text-outline font-label-badge text-[10px]">
          <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
          <span>LTA DATAMALL • LIVE SYNC 14s AGO</span>
        </div>
      </div>

      {/* Bottom Sheet Preview Card: Selected Carpark */}
      <div className="px-margin -mt-4 relative z-30 pb-safe">
        <div className="w-full bg-surface-container-lowest rounded-2xl shadow-xl overflow-hidden p-space-lg space-y-space-md border border-surface-container-high/30">
          {/* Sheet Pull Handle */}
          <div className="w-10 h-1 rounded-full bg-surface-variant mx-auto mb-1"></div>

          {/* Top Row: Carpark Name & Agency Hierarchy */}
          <div className="flex items-start justify-between gap-space-sm">
            <div className="space-y-1 min-w-0">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="px-2 py-0.5 rounded bg-primary-container text-on-primary-container font-label-badge text-label-badge uppercase font-bold tracking-wider">
                  {selectedCarpark.type}
                </span>
                {selectedCarpark.tags.includes('EPS AUTOPAY') ||
                selectedCarpark.tags.includes('EPS READY') ? (
                  <span className="px-2 py-0.5 rounded bg-surface-container text-on-surface-variant font-label-badge text-label-badge uppercase font-medium">
                    EPS Barrierless
                  </span>
                ) : null}
                {selectedCarpark.evTotal > 0 && (
                  <span className="flex items-center gap-0.5 px-2 py-0.5 rounded bg-secondary-container/40 text-on-secondary-container font-label-badge text-label-badge uppercase font-semibold">
                    <span className="material-symbols-outlined text-[12px]">bolt</span>
                    {selectedCarpark.evTotal} EV Plugs
                  </span>
                )}
              </div>
              <h2 className="font-headline-md text-headline-md text-on-surface truncate">
                {selectedCarpark.name}
              </h2>
              <div className="flex items-center gap-2 text-on-surface-variant font-body-sm text-body-sm">
                <span className="flex items-center gap-0.5">
                  <span className="material-symbols-outlined text-[14px] text-secondary">
                    pin_drop
                  </span>
                  <span>
                    {selectedCarpark.address.split(',')[0]} • {selectedCarpark.distanceMeters}m away
                  </span>
                </span>
                <span>•</span>
                <span className="flex items-center gap-0.5 text-secondary font-medium">
                  <span className="material-symbols-outlined text-[14px]">timer</span>
                  <span>{selectedCarpark.driveTimeMinutes} min drive</span>
                </span>
              </div>
            </div>

            {/* Favorite Button */}
            <button
              aria-label="Save Carpark"
              onClick={() => onToggleFavorite(selectedCarpark.id)}
              className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant hover:text-on-tertiary-container active:scale-90 transition-transform shrink-0 cursor-pointer"
            >
              <span
                className={`material-symbols-outlined text-[20px] ${
                  isSelectedFav ? 'text-error material-symbols-fill' : ''
                }`}
              >
                {isSelectedFav ? 'favorite' : 'bookmark_border'}
              </span>
            </button>
          </div>

          {/* Lot Meter Status Block */}
          <div className="bg-surface-container-low p-space-md rounded-xl space-y-2">
            <div className="flex items-baseline justify-between">
              <div className="flex items-baseline gap-1.5">
                <span
                  className={`font-label-numeric-lg text-label-numeric-lg ${
                    selectedCarpark.availableLots === 0
                      ? 'text-error'
                      : selectedCarpark.availableLots < 10
                      ? 'text-on-tertiary-container'
                      : 'text-secondary'
                  }`}
                >
                  {selectedCarpark.availableLots}
                </span>
                <span className="font-label-numeric-md text-body-md text-on-surface-variant">
                  / {selectedCarpark.totalLots} Available
                </span>
              </div>
              <span
                className={`px-2 py-0.5 rounded-full font-label-badge text-label-badge font-bold uppercase tracking-wider ${
                  selectedCarpark.availableLots === 0
                    ? 'bg-error-container text-on-error-container'
                    : selectedCarpark.availableLots < 15
                    ? 'bg-tertiary-fixed text-on-tertiary-fixed'
                    : 'bg-secondary-container text-on-secondary-container'
                }`}
              >
                {selectedCarpark.availableLots === 0
                  ? 'FULL LOT'
                  : selectedCarpark.availableLots < 15
                  ? 'FEW LOTS'
                  : 'Ample Lots'}
              </span>
            </div>

            {/* Visual Capacity Progress Bar */}
            <div className="w-full h-2 rounded-full bg-surface-container-highest overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-700 ease-out ${
                  selectedCarpark.availableLots === 0
                    ? 'bg-error'
                    : selectedCarpark.availableLots < 15
                    ? 'bg-amber-500'
                    : 'bg-secondary'
                }`}
                style={{ width: `${selectedCarpark.occupancyPercent}%` }}
              ></div>
            </div>

            <div className="flex justify-between font-label-meta text-[11px] text-outline">
              <span>Plenty available for Cars ({selectedCarpark.carAvailable})</span>
              <span>Motorcycles: {selectedCarpark.bikeAvailable} Available</span>
            </div>
          </div>

          {/* Rate Breakdown & Grace Highlights */}
          <div className="grid grid-cols-2 gap-space-sm pt-1">
            <div className="p-2.5 rounded-lg bg-surface-container">
              <div className="font-label-meta text-label-meta text-on-surface-variant">
                Mon-Fri (8am - 5pm)
              </div>
              <div className="font-label-numeric-md text-label-numeric-md text-on-surface mt-0.5">
                {selectedCarpark.standardRateText}
              </div>
              <div className="font-label-meta text-[11px] text-outline mt-0.5">
                {selectedCarpark.subRateText}
              </div>
            </div>
            <div className="p-2.5 rounded-lg bg-surface-container">
              <div className="font-label-meta text-label-meta text-on-surface-variant">
                Grace & Clearance
              </div>
              <div className="flex items-center gap-1 font-label-numeric-md text-label-numeric-md text-secondary mt-0.5">
                <span className="material-symbols-outlined text-[16px]">check_circle</span>
                <span>{selectedCarpark.gracePeriodMinutes} Mins Grace</span>
              </div>
              <div className="font-label-meta text-[11px] text-outline mt-0.5">
                Max Height: {selectedCarpark.heightClearance}m
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-space-sm pt-1">
            {/* Navigation Trigger CTA */}
            <button
              onClick={() => onStartNavigation(selectedCarpark)}
              className="flex-1 h-12 rounded-xl bg-secondary text-on-secondary flex items-center justify-center gap-2 font-headline-sm text-headline-sm hover:opacity-95 active:scale-[0.98] transition-all shadow-md cursor-pointer"
            >
              <span className="material-symbols-outlined text-[20px]">directions</span>
              <span>Start Navigation</span>
            </button>

            {/* Secondary Maps Dispatch / Share */}
            <button
              onClick={() => onOpenExternalMaps(selectedCarpark)}
              className="h-12 w-12 rounded-xl bg-surface-container text-on-surface flex items-center justify-center hover:bg-surface-container-high active:scale-95 transition-all shrink-0 cursor-pointer"
              title="Open in External Navigation App"
            >
              <span className="material-symbols-outlined text-[20px]">open_in_new</span>
            </button>
          </div>

          {/* Full Rates & Entrance Photos Link */}
          <div className="flex items-center justify-between pt-1">
            <button
              onClick={() => onOpenDetails(selectedCarpark)}
              className="inline-flex items-center gap-1 font-body-sm text-body-sm text-secondary hover:underline font-semibold cursor-pointer text-left"
            >
              <span>View entry points, carpark photos & weekend rates</span>
              <span className="material-symbols-outlined text-[16px]">chevron_right</span>
            </button>
            <span className="font-label-meta text-[11px] text-outline">Code: {selectedCarpark.code}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

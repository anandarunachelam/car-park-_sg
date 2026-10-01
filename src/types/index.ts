export interface TariffItem {
  timeRange: string;
  rateDescription: string;
  amountLabel: string;
  ratePerHour: number;
}

export interface Carpark {
  id: string;
  name: string;
  area: string;
  address: string;
  code: string;
  type: 'COMMERCIAL' | 'MALL / RETAIL' | 'HDB CENTRAL' | 'URA KERBSIDE' | 'HDB AUTOMATED';
  typeBadgeClass?: string;
  subType?: string;
  tags: string[];
  lat: number;
  lng: number;
  totalLots: number;
  availableLots: number;
  occupancyPercent: number;
  trafficStatus: 'Low Traffic' | 'Moderate Traffic' | 'High Traffic' | 'Full';
  carAvailable: number;
  bikeAvailable: number;
  evAvailable: number;
  evTotal: number;
  evPower: string;
  heightClearance: number; // in meters
  gantryNotice: string;
  gantryMethods: string[];
  distanceMeters: number;
  driveTimeMinutes: number;
  gracePeriodMinutes: number;
  standardRateText: string;
  subRateText: string;
  nightRateText?: string;
  weekendRateText?: string;
  spendPerkText?: string;
  publishedTariffs: TariffItem[];
  facilities: {
    icon: string;
    title: string;
    desc: string;
  }[];
  mapEntranceNote: string;
  entranceLane: string;
  mapSnipUrl: string;
  photos: {
    title: string;
    url: string;
    alt: string;
  }[];
  warningNotice?: string;
  isFull?: boolean;
  alternative?: {
    name: string;
    lotsAvailable: number;
    distance: string;
    id: string;
  };
  queueClearanceMinutes?: number;
  cctv?: boolean;
  sheltered?: boolean;
}

export interface ErpGantry {
  id: string;
  gantryNumber: number;
  name: string;
  segment: 'cte' | 'cbd' | 'kpe';
  status: 'RUSH HOUR' | 'OFF-PEAK' | 'MODERATE';
  rate: number;
  chargeLabel: string;
  activeTimeNote: string;
}

export interface UserVehicle {
  model: string;
  plate: string;
  obuVersion: string;
  netsBalance: number;
  iuLinked: boolean;
}

export interface ActiveSession {
  carparkId: string;
  carparkName: string;
  address: string;
  bayNumber: string;
  level: string;
  startedAt: Date;
  baseFee: number;
  hourlyFee: number;
  scarcityAlarm: boolean;
}

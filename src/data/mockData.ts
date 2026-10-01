import { Carpark, ErpGantry, UserVehicle, ActiveSession } from '../types/index.ts';

export const APP_LOGO_URL =
  'https://lh3.googleusercontent.com/aida/AEtjO1UeOnEt0Fgdqo2d31Gh01Gl_jNPGueqRcR0blUMKW5vxj8YcVFKXdiJyST8CdVDoTDolc1hWwMqWQ67hDA9vvGQcgCVFpEZLULlBXdualfiQIlJPs63rbbbxeA9HothHtGpcnMog7yJzr7QEAMV0cl_q_WcYGHdiWENJPqSkLwV_LtsBsF84XsP3SWIb6VBY8Guce_anfUQ1Gttqf2SotomuQXDE0vrogjGfn1Go9yRNRKIdcZH8QV5lxQO';

export const USER_AVATAR_URL =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuAqZyluibR-pQdhjlkIdez6z2wkyUEvkNPoujCBOD0nwpY9ndWgFROs8t4QEuMG2Rr70e9yo_1wOsgjf98QHlOUrK9XhnosHEtiFvJAWuyShGKenTS8DV02tdQH4QjktzGswXWDglYLY1zMXTLKA_6qN5vfxScYAtIPaPANAqdPhxdmS0tMWdIICED_z2RoAa6vkqrja6La1KnFzKedY7H3hlwKrWsSAJN0uyPreRwoysTW1p_VuaY8bg';

export const MAP_SNIP_URL =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuDgzr5fCaY66Ql3fqLLLpust7w7TUZM2mPZNVCxzPdlIPrBngyVXQCRJnf9WFKVRIiG359tehfHtz_FWZFYDQqa3ZUIBdvcLWmqUTzzfBO5MQIgfiJb0VPP4WCSFUcbqSPIXlFB5A5ayQuyhjxmgvZxE7tcmp__H1O00YNA3mK0017gfoJ6Ha1wBRVtGGx41YO56fDJ_MBd6YE9S7t9PFVr0aFzi6O-nmiFDvze1e-j9oZGwSl9JM5ECQ';

export const PHOTO_BASEMENT_ENTRY =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuAByfmmOAfRT-FKgswbVhR1LvX7YTL4w23Iyb1hoefdyRsPaV6pszGPLBoSsD16WF5lyTCYibJEn2wU_nUv1PVkzww0riuno-mEDfux5f0K0IKqhNQIo9YoaO_W9NwqXNnL4wc9L7KhegVrzyattRYP5gKdQZr07EcuPBGV4jp3Ddef6q6ipYRbr56Jw2T6c84R4Tf_7vDfboEZ5NtYR_n5izw_PGBGCwhd2-0v2LX0eDQ_dSPvyTupbw';

export const PHOTO_EV_BAYS =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuDUF7T39N-nGggeCEldT7arwXVLL8nWnJIMSG3sfXXbqnzqIzUh58BghgGc39CyfZOimDOkFKfSij1iYXAb5KlkT7hpDGDLDFDGN41nN79-XI0bRa2magKAa8wC6AQ1QtCsI_z8hQh9Lh6GmP_ZAYUfVPgq3VZWXoKfhmJC29NrhpvOL29o6u4gcgnbgLuA5N97z4-IBoLMyCI6eWYBgJK2JELYpTUkD3yJYniwI0WZqKc-HA2XfTj9oA';

export const INITIAL_CARPARKS: Carpark[] = [
  {
    id: 'taka',
    name: 'Takashimaya / Ngee Ann City',
    area: 'Orchard Rd',
    address: '391A Orchard Road, Singapore 238873',
    code: 'NAC-CP02',
    type: 'COMMERCIAL',
    tags: ['COMMERCIAL', 'ORCHARD RD', 'EPS AUTOPAY'],
    lat: 1.3023,
    lng: 103.8347,
    totalLots: 308,
    availableLots: 86,
    occupancyPercent: 72,
    trafficStatus: 'Moderate Traffic',
    carAvailable: 74,
    bikeAvailable: 12,
    evAvailable: 2,
    evTotal: 4,
    evPower: '50kW plug',
    heightClearance: 1.95,
    gantryNotice: 'Standard passenger sedans, coupes & SUVs only. No high-roof commercial vans or tall roof racks.',
    gantryMethods: ['EZ-Link Motoring', 'NETS Motoring Card', 'CashCard', 'Contactless Credit Card (Visa/Mastercard)'],
    distanceMeters: 450,
    driveTimeMinutes: 3,
    gracePeriodMinutes: 10,
    standardRateText: '$3.27 1st hr',
    subRateText: '$1.09 / sub 30m',
    publishedTariffs: [
      {
        timeRange: 'Mon - Fri (08:00 - 17:00)',
        rateDescription: '$3.27 1st hr • $1.09 / sub 30m',
        amountLabel: '$6.54',
        ratePerHour: 3.27
      },
      {
        timeRange: 'Mon - Fri Evening (17:00 - 24:00)',
        rateDescription: 'Per entry flat charge',
        amountLabel: '$4.36',
        ratePerHour: 4.36
      },
      {
        timeRange: 'Sat, Sun & Public Holidays',
        rateDescription: '$4.36 1st 2 hrs • $1.64 / sub 30m',
        amountLabel: 'Standard Weekend',
        ratePerHour: 4.36
      }
    ],
    facilities: [
      {
        icon: 'ev_charger',
        title: 'SP Mobility',
        desc: '2x 50kW DC Fast Chargers at Basement 2 (Pillar 14B)'
      },
      {
        icon: 'accessible',
        title: 'Priority Lots',
        desc: '4 designated accessible lots adjacent to Lobby B Lift'
      },
      {
        icon: 'subway',
        title: 'Sheltered MRT',
        desc: 'Direct underground link to Orchard MRT (NS22/TE14)'
      }
    ],
    mapEntranceNote: 'Gantry Entrance via Orchard Turn',
    entranceLane: 'Lane A & B',
    mapSnipUrl: MAP_SNIP_URL,
    photos: [
      {
        title: 'Basement 2 Entry',
        url: PHOTO_BASEMENT_ENTRY,
        alt: 'Well-lit subterranean modern parking garage inside Ngee Ann City Orchard with clean painted floor markings, vehicle barrier gantry, overhead clearance signs, and crisp directional signage.'
      },
      {
        title: 'EV Charging Bays',
        url: PHOTO_EV_BAYS,
        alt: 'Modern electric vehicle DC fast charging station bay inside a sleek Singapore commercial parking mall basement with bright LED overhead bay indicators and clean pillar signs.'
      }
    ],
    sheltered: true,
    cctv: true
  },
  {
    id: 'ion',
    name: 'ION Orchard Parking B2/B3',
    area: 'Orchard Rd',
    address: '2 Orchard Turn, Singapore 238801',
    code: 'ION-CP01',
    type: 'MALL / RETAIL',
    subType: 'Basement B2/B3',
    tags: ['MALL / RETAIL', 'EV SUPERCHARGER', 'BASEMENT B2/B3'],
    lat: 1.3040,
    lng: 103.8318,
    totalLots: 450,
    availableLots: 142,
    occupancyPercent: 68,
    trafficStatus: 'Low Traffic',
    carAvailable: 104,
    bikeAvailable: 38,
    evAvailable: 4,
    evTotal: 8,
    evPower: '120kW Supercharger',
    heightClearance: 2.0,
    gantryNotice: 'Barrierless EPS camera scanning. Compatible with On-board OBU 2.0 and In-vehicle Units.',
    gantryMethods: ['EPS Barrierless', 'NETS Motoring Card', 'Credit Card Autopay', 'EZ-Link'],
    distanceMeters: 320,
    driveTimeMinutes: 2,
    gracePeriodMinutes: 10,
    standardRateText: '$3.27 first hr',
    subRateText: '$1.09 / sub 30m',
    spendPerkText: 'Free 1st hr with $150 Receipt',
    publishedTariffs: [
      {
        timeRange: 'Mon - Fri (08:00 - 16:59)',
        rateDescription: '$3.27 1st hr • $1.09 / sub 30m',
        amountLabel: '$3.27 / hr',
        ratePerHour: 3.27
      },
      {
        timeRange: 'Mon - Fri Evening (17:00 - 23:59)',
        rateDescription: '$4.90 per entry flat charge',
        amountLabel: '$4.90',
        ratePerHour: 4.90
      },
      {
        timeRange: 'Weekends & Public Holidays',
        rateDescription: '$4.36 1st 2 hrs • $1.64 / sub 30m',
        amountLabel: '$4.36',
        ratePerHour: 4.36
      }
    ],
    facilities: [
      {
        icon: 'bolt',
        title: 'EV Supercharger',
        desc: '4x Tesla / CCS2 ultra-fast charging bays at B3 Pillar C2'
      },
      {
        icon: 'shopping_bag',
        title: 'Direct Mall Lift',
        desc: 'Direct lift access to Mall Atrium B2 & Food Opera'
      },
      {
        icon: 'local_car_wash',
        title: 'Valet & Car Grooming',
        desc: 'Professional grooming at B2 Entrance lobby'
      }
    ],
    mapEntranceNote: 'Enter via Orchard Boulevard gantry ramp',
    entranceLane: 'Lane 1 & 2 (Dual Barrierless)',
    mapSnipUrl: MAP_SNIP_URL,
    photos: [
      {
        title: 'Basement 2 Entry',
        url: PHOTO_BASEMENT_ENTRY,
        alt: 'ION Orchard subterranean entrance'
      },
      {
        title: 'EV Charging Bays',
        url: PHOTO_EV_BAYS,
        alt: 'EV Charging bays at ION Orchard'
      }
    ],
    sheltered: true,
    cctv: true
  },
  {
    id: 'waterloo',
    name: 'Blk 261 Waterloo St (HLM)',
    area: 'Central / Bras Basah',
    address: '261 Waterloo Street, Singapore 180261',
    code: 'HLM-CP12',
    type: 'HDB CENTRAL',
    subType: 'MSCP Sheltered',
    tags: ['HDB CENTRAL', 'MSCP SHELTERED', 'CCTV'],
    lat: 1.2995,
    lng: 103.8525,
    totalLots: 146,
    availableLots: 114,
    occupancyPercent: 22,
    trafficStatus: 'Low Traffic',
    carAvailable: 98,
    bikeAvailable: 16,
    evAvailable: 0,
    evTotal: 0,
    evPower: 'None',
    heightClearance: 2.15,
    gantryNotice: 'HDB Central standard automated electronic parking gantry.',
    gantryMethods: ['HDB Season Parking', 'EZ-Link Motoring', 'NETS Motoring Card', 'CashCard'],
    distanceMeters: 850,
    driveTimeMinutes: 4,
    gracePeriodMinutes: 10,
    standardRateText: '$1.20 / 30m',
    subRateText: '7:00 AM – 5:00 PM',
    nightRateText: 'Night Cap: $5.00 Max (10:30 PM - 7:00 AM)',
    spendPerkText: 'Free Parking on Sunday (7:30 AM - 10:30 PM)',
    publishedTariffs: [
      {
        timeRange: 'Daily (07:00 - 17:00)',
        rateDescription: '$1.20 per 30 minutes ($2.40/hr)',
        amountLabel: '$1.20 / 30m',
        ratePerHour: 2.40
      },
      {
        timeRange: 'Daily (17:00 - 22:30)',
        rateDescription: '$0.60 per 30 minutes ($1.20/hr)',
        amountLabel: '$0.60 / 30m',
        ratePerHour: 1.20
      },
      {
        timeRange: 'Night Parking (22:30 - 07:00)',
        rateDescription: '$0.60 per 30m, capped at $5.00 per session',
        amountLabel: 'Max $5.00',
        ratePerHour: 1.20
      }
    ],
    facilities: [
      {
        icon: 'security',
        title: '24/7 Security CCTV',
        desc: 'Comprehensive coverage across all MSCP deck floors'
      },
      {
        icon: 'local_atm',
        title: 'AXS & NETS Kiosk',
        desc: 'Ground floor payment kiosk next to lift lobby'
      }
    ],
    mapEntranceNote: 'Gantry entrance via Waterloo Street',
    entranceLane: 'Single EPS Lane',
    mapSnipUrl: MAP_SNIP_URL,
    photos: [
      {
        title: 'MSCP Ground Entry',
        url: PHOTO_BASEMENT_ENTRY,
        alt: 'Waterloo HDB MSCP Entrance'
      }
    ],
    sheltered: true,
    cctv: true
  },
  {
    id: 'angullia',
    name: 'URA Angullia Park Carpark',
    area: 'Orchard Rd',
    address: 'Angullia Park, Singapore 239974',
    code: 'URA-ANG01',
    type: 'URA KERBSIDE',
    subType: 'Surface Open Air',
    tags: ['URA KERBSIDE', 'SURFACE OPEN AIR', 'PARKING.SG APP'],
    lat: 1.3038,
    lng: 103.8302,
    totalLots: 42,
    availableLots: 4,
    occupancyPercent: 91,
    trafficStatus: 'High Traffic',
    carAvailable: 4,
    bikeAvailable: 0,
    evAvailable: 0,
    evTotal: 0,
    evPower: 'None',
    heightClearance: 3.5,
    gantryNotice: 'Open air kerbside coupon/app parking. No gantry barrier.',
    gantryMethods: ['Parking.sg App', 'URA e-Payment Portal'],
    distanceMeters: 450,
    driveTimeMinutes: 3,
    gracePeriodMinutes: 0,
    standardRateText: '$1.20 / 30 mins',
    subRateText: 'Per-minute URA charging',
    warningNotice: 'Filling quickly: 9 lots filled in the last 10 minutes',
    publishedTariffs: [
      {
        timeRange: 'Mon - Sat (08:30 - 17:00)',
        rateDescription: '$1.20 per half hour, charged by the minute',
        amountLabel: '$1.20 / 30m',
        ratePerHour: 2.40
      },
      {
        timeRange: 'Mon - Sat (17:00 - 22:30)',
        rateDescription: '$0.60 per half hour',
        amountLabel: '$0.60 / 30m',
        ratePerHour: 1.20
      },
      {
        timeRange: 'Sun & Public Holidays',
        rateDescription: 'Free parking from 07:00 - 22:30',
        amountLabel: 'Free',
        ratePerHour: 0
      }
    ],
    facilities: [
      {
        icon: 'phone_android',
        title: 'App Seamless Auto-refund',
        desc: 'Unused parking session minutes refunded instantly to card'
      },
      {
        icon: 'wb_sunny',
        title: 'Direct Street Access',
        desc: 'Directly steps from Wheelock Place and Liat Towers'
      }
    ],
    mapEntranceNote: 'Kerbside entrance from Angullia Park lane',
    entranceLane: 'Kerbside Bays 1 - 42',
    mapSnipUrl: MAP_SNIP_URL,
    photos: [
      {
        title: 'Kerbside Bays',
        url: PHOTO_BASEMENT_ENTRY,
        alt: 'Angullia park open air parking'
      }
    ],
    sheltered: false,
    cctv: false
  },
  {
    id: 'tpm',
    name: 'Blk 1 Tanjong Pagar Plaza (TPM)',
    area: 'Tanjong Pagar / CBD',
    address: '1 Tanjong Pagar Plaza, Singapore 082001',
    code: 'TPM-CP01',
    type: 'HDB AUTOMATED',
    subType: 'Heavy Vehicle Segregated',
    tags: ['HDB AUTOMATED', 'HEAVY VEHICLE SEGREGATED'],
    lat: 1.2768,
    lng: 103.8432,
    totalLots: 120,
    availableLots: 0,
    occupancyPercent: 100,
    trafficStatus: 'Full',
    carAvailable: 0,
    bikeAvailable: 2,
    evAvailable: 0,
    evTotal: 0,
    evPower: 'None',
    heightClearance: 2.15,
    gantryNotice: 'Electronic Gantry (EPS) - Lot count is currently 0.',
    gantryMethods: ['EPS Gantry', 'NETS Motoring Card', 'CashCard'],
    distanceMeters: 1100,
    driveTimeMinutes: 6,
    gracePeriodMinutes: 10,
    standardRateText: '$1.20 / 30m',
    subRateText: 'Typical queue clearance: ~15 mins',
    isFull: true,
    alternative: {
      id: 'tpc-b3',
      name: 'Tanjong Pagar Centre B3',
      lotsAvailable: 88,
      distance: '210m away'
    },
    queueClearanceMinutes: 15,
    publishedTariffs: [
      {
        timeRange: 'Daily (07:00 - 17:00)',
        rateDescription: '$1.20 per 30 minutes',
        amountLabel: '$1.20 / 30m',
        ratePerHour: 2.40
      },
      {
        timeRange: 'Daily (17:00 - 22:30)',
        rateDescription: '$0.60 per 30 minutes',
        amountLabel: '$0.60 / 30m',
        ratePerHour: 1.20
      }
    ],
    facilities: [
      {
        icon: 'alt_route',
        title: 'Smart Re-route Recommendation',
        desc: 'Switch to Tanjong Pagar Centre B3 with 88 lots available'
      }
    ],
    mapEntranceNote: 'Gantry via Tanjong Pagar Road',
    entranceLane: 'Main EPS Gantry',
    mapSnipUrl: MAP_SNIP_URL,
    photos: [
      {
        title: 'Queue Gantry Camera',
        url: PHOTO_BASEMENT_ENTRY,
        alt: 'Tanjong Pagar Plaza Gantry'
      }
    ],
    sheltered: true,
    cctv: true
  },
  {
    id: 'somerset',
    name: '313@Somerset Carpark',
    area: 'Orchard Rd',
    address: '313 Orchard Road, Singapore 238895',
    code: '313-CP01',
    type: 'MALL / RETAIL',
    subType: 'Basement B3/B4',
    tags: ['MALL / RETAIL', 'ORCHARD RD', 'SUBTERRANEAN'],
    lat: 1.3009,
    lng: 103.8384,
    totalLots: 198,
    availableLots: 18,
    occupancyPercent: 91,
    trafficStatus: 'High Traffic',
    carAvailable: 15,
    bikeAvailable: 3,
    evAvailable: 1,
    evTotal: 2,
    evPower: '22kW AC plug',
    heightClearance: 1.90,
    gantryNotice: 'Standard passenger vehicles only. Height clearance strictly enforced.',
    gantryMethods: ['NETS FlashPay', 'NETS Motoring Card', 'EZ-Link'],
    distanceMeters: 620,
    driveTimeMinutes: 3,
    gracePeriodMinutes: 10,
    standardRateText: '$3.50 / hr',
    subRateText: '$1.20 / sub 30m',
    publishedTariffs: [
      {
        timeRange: 'Mon - Fri (08:00 - 18:00)',
        rateDescription: '$3.50 1st hr • $1.20 per sub 30 mins',
        amountLabel: '$3.50 / hr',
        ratePerHour: 3.50
      },
      {
        timeRange: 'Mon - Fri Evening (18:00 - 08:00)',
        rateDescription: '$4.50 per entry flat charge',
        amountLabel: '$4.50 flat',
        ratePerHour: 4.50
      },
      {
        timeRange: 'Sat, Sun & Public Holidays',
        rateDescription: '$4.80 1st 2 hrs • $1.50 / sub 30 mins',
        amountLabel: '$4.80 1st 2h',
        ratePerHour: 4.80
      }
    ],
    facilities: [
      {
        icon: 'subway',
        title: 'Direct Somerset MRT',
        desc: 'Direct underground connection to Somerset MRT (NS23)'
      },
      {
        icon: 'ev_charger',
        title: 'AC Destination Charger',
        desc: '2x Type-2 chargers on Basement 3'
      }
    ],
    mapEntranceNote: 'Entrance via Somerset Road slip lane',
    entranceLane: 'Lane 1',
    mapSnipUrl: MAP_SNIP_URL,
    photos: [
      {
        title: 'Somerset Entrance',
        url: PHOTO_BASEMENT_ENTRY,
        alt: '313 Somerset Entry'
      }
    ],
    sheltered: true,
    cctv: true
  },
  {
    id: 'bugis',
    name: 'Bugis Junction Carpark',
    area: 'Central Zone',
    address: '200 Victoria Street, Singapore 188021',
    code: 'BJ-CP03',
    type: 'MALL / RETAIL',
    subType: 'Basement B1 & B2',
    tags: ['MALL / RETAIL', 'BUGIS', 'EPS READY'],
    lat: 1.3000,
    lng: 103.8554,
    totalLots: 380,
    availableLots: 94,
    occupancyPercent: 75,
    trafficStatus: 'Moderate Traffic',
    carAvailable: 82,
    bikeAvailable: 12,
    evAvailable: 3,
    evTotal: 6,
    evPower: '50kW DC plug',
    heightClearance: 1.95,
    gantryNotice: 'EPS barrier gantry with integrated OBU 2.0 electronic detection.',
    gantryMethods: ['EZ-Link', 'NETS Motoring Card', 'Credit Card PayWave'],
    distanceMeters: 1400,
    driveTimeMinutes: 7,
    gracePeriodMinutes: 10,
    standardRateText: '$3.20 1st hr',
    subRateText: '$1.00 / sub 30m',
    publishedTariffs: [
      {
        timeRange: 'Mon - Fri (08:00 - 17:00)',
        rateDescription: '$3.20 1st hr • $1.00 / sub 30m',
        amountLabel: '$3.20 1st hr',
        ratePerHour: 3.20
      },
      {
        timeRange: 'Mon - Fri Evening (17:00 - 23:59)',
        rateDescription: '$3.80 per entry flat charge',
        amountLabel: '$3.80 flat',
        ratePerHour: 3.80
      }
    ],
    facilities: [
      {
        icon: 'storefront',
        title: 'BHG & Supermarket Access',
        desc: 'Direct escalator to Cold Storage and Bugis MRT'
      }
    ],
    mapEntranceNote: 'Entrance via Victoria Street and Middle Road',
    entranceLane: 'Lane A & B',
    mapSnipUrl: MAP_SNIP_URL,
    photos: [
      {
        title: 'Basement Parking',
        url: PHOTO_BASEMENT_ENTRY,
        alt: 'Bugis Junction Parking Bay'
      }
    ],
    sheltered: true,
    cctv: true
  }
];

export const INITIAL_ERP_GANTRIES: ErpGantry[] = [
  {
    id: 'gantry-18',
    gantryNumber: 18,
    name: 'CTE Southbound after Braddell',
    segment: 'cte',
    status: 'RUSH HOUR',
    rate: 3.0,
    chargeLabel: 'Peak Charge',
    activeTimeNote: 'Active till 10:00am • Drops to $1.00'
  },
  {
    id: 'gantry-32',
    gantryNumber: 32,
    name: 'Orchard Road Cordon (Dhoby Ghaut)',
    segment: 'cbd',
    status: 'OFF-PEAK',
    rate: 0.0,
    chargeLabel: 'No Charge',
    activeTimeNote: 'Free entry until 12:00pm noon'
  },
  {
    id: 'gantry-25',
    gantryNumber: 25,
    name: 'Nicoll Highway into CBD Core',
    segment: 'cbd',
    status: 'MODERATE',
    rate: 1.5,
    chargeLabel: 'Current',
    activeTimeNote: 'Peak Window (08:30am - 09:30am)'
  },
  {
    id: 'gantry-41',
    gantryNumber: 41,
    name: 'PIE Kallang Bahru Westbound',
    segment: 'cte',
    status: 'MODERATE',
    rate: 1.0,
    chargeLabel: 'Standard',
    activeTimeNote: 'Active till 10:30am'
  },
  {
    id: 'gantry-56',
    gantryNumber: 56,
    name: 'ECP westbound into Shenton Way',
    segment: 'kpe',
    status: 'RUSH HOUR',
    rate: 2.5,
    chargeLabel: 'Peak Charge',
    activeTimeNote: 'Active till 10:00am • High Traffic'
  },
  {
    id: 'gantry-62',
    gantryNumber: 62,
    name: 'KPE Southbound towards MCE',
    segment: 'kpe',
    status: 'OFF-PEAK',
    rate: 0.0,
    chargeLabel: 'No Charge',
    activeTimeNote: 'Free flow until 17:30pm'
  }
];

export const INITIAL_USER_VEHICLE: UserVehicle = {
  model: 'Toyota Corolla Cross Hybrid',
  plate: 'SLB 8421 K',
  obuVersion: 'On-board OBU 2.0',
  netsBalance: 28.4,
  iuLinked: true
};

export const INITIAL_ACTIVE_SESSION: ActiveSession = {
  carparkId: 'bugis',
  carparkName: 'Bugis Junction Carpark',
  address: '200 Victoria Street • Central Zone',
  bayNumber: 'Bay C14',
  level: 'Level B1',
  startedAt: new Date(Date.now() - (38 * 60 + 17) * 1000), // 38 mins 17 secs ago
  baseFee: 3.2,
  hourlyFee: 1.0,
  scarcityAlarm: true
};

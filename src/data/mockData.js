// IDRMS — Data Layer — Barangay Kauswagan, CDO

export const weatherData = {
  condition: 'Heavy Rain', temperature: 27, humidity: 91, windSpeed: 45, rainfall24h: 78.4, riskLevel: 'High',

};

export const zoneRiskLevels = [
  { zone: 'Zone 1', riskLevel: 'Medium', mainHazard: 'Fire',      incidents:  0},
  { zone: 'Zone 2', riskLevel: 'Low',    mainHazard: 'Flood',     incidents: 0 },
  { zone: 'Zone 3', riskLevel: 'High',   mainHazard: 'Flood',     incidents: 0 },
  { zone: 'Zone 4', riskLevel: 'Low',    mainHazard: 'Earthquake',incidents: 0 },
  { zone: 'Zone 5', riskLevel: 'High',   mainHazard: 'Landslide', incidents: 0},
  { zone: 'Zone 6', riskLevel: 'Medium', mainHazard: 'Storm',     incidents: 0 },
];

export const incidentByType = [
  { type: 'Flood', count: 18 }, { type: 'Fire', count: 12 }, { type: 'Landslide', count: 9 },
  { type: 'Storm', count: 5 },  { type: 'Earthquake', count: 3 },
];

export const incidentHistory = [
  { month: 'Aug', count: 3 }, { month: 'Sep', count: 5 }, { month: 'Oct', count: 4 },
  { month: 'Nov', count: 7 }, { month: 'Dec', count: 6 }, { month: 'Jan', count: 8 }, { month: 'Feb', count: 6 },
];

export const INITIAL_INCIDENTS = [];

export const INITIAL_ALERTS = [];

export const INITIAL_EVAC = [];

export const INITIAL_RESIDENTS = [];

export const INITIAL_RESOURCES = [];

export const INITIAL_USERS = [];

export const INITIAL_ACTIVITY = [];

export const ZONES               = ['Zone 1','Zone 2','Zone 3','Zone 4','Zone 5','Zone 6'];
export const INCIDENT_TYPES      = ['Flood','Fire','Landslide','Storm','Earthquake'];
export const RESOURCE_CATEGORIES = ['Equipment','Medical','Food Supply','Vehicle','Safety Gear'];
export const VULNERABILITY_TAGS  = ['Senior Citizen','PWD','Pregnant','Infant','Bedridden'];
export const EVAC_FACILITIES     = ['Water','Restroom','Medical','Power','Food','Sleeping Area'];
export const KAUSWAGAN_CENTER    = [8.496339, 124.6397073];

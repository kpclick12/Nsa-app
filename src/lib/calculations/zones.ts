import { HRZone } from '@/types';

// Zone definitions for the Norwegian method (5-zone model)
const ZONE_DEFINITIONS = [
  {
    zone: 1,
    name: 'Recovery',
    description: 'Very easy, conversational pace. Active recovery.',
    color: '#22c55e', // green
    minPercent: 50,
    maxPercent: 60,
  },
  {
    zone: 2,
    name: 'Easy / Aerobic',
    description: 'Easy running, can hold a conversation. Base building.',
    color: '#3b82f6', // blue
    minPercent: 60,
    maxPercent: 70,
  },
  {
    zone: 3,
    name: 'Tempo',
    description: 'Moderate effort, comfortably hard. Marathon pace.',
    color: '#eab308', // yellow
    minPercent: 70,
    maxPercent: 80,
  },
  {
    zone: 4,
    name: 'Threshold',
    description: 'Hard effort at lactate threshold. Key Norwegian method zone.',
    color: '#f97316', // orange
    minPercent: 80,
    maxPercent: 90,
  },
  {
    zone: 5,
    name: 'VO2max',
    description: 'Very hard, near maximum effort. Short intervals.',
    color: '#ef4444', // red
    minPercent: 90,
    maxPercent: 100,
  },
];

/**
 * Calculate HR zones from max heart rate
 */
export function calculateZonesFromMaxHR(maxHR: number): HRZone[] {
  return ZONE_DEFINITIONS.map((def) => ({
    zone: def.zone,
    name: def.name,
    description: def.description,
    color: def.color,
    minHR: Math.round((def.minPercent / 100) * maxHR),
    maxHR: Math.round((def.maxPercent / 100) * maxHR),
  }));
}

/**
 * Calculate HR zones from lactate threshold heart rate
 * Threshold HR is typically at ~88-92% of max HR
 * We use this to estimate max HR, then calculate zones
 */
export function calculateZonesFromLTHR(lactateThresholdHR: number): HRZone[] {
  // LTHR is approximately 90% of max HR
  const estimatedMaxHR = Math.round(lactateThresholdHR / 0.9);
  return calculateZonesFromMaxHR(estimatedMaxHR);
}

/**
 * Estimate max HR from age using the Tanaka formula
 * MaxHR = 208 - (0.7 × age)
 * More accurate than the old 220 - age formula
 */
export function estimateMaxHRFromAge(age: number): number {
  return Math.round(208 - 0.7 * age);
}

/**
 * Get the zone for a given heart rate
 */
export function getZoneForHR(hr: number, zones: HRZone[]): HRZone | null {
  for (const zone of zones) {
    if (hr >= zone.minHR && hr <= zone.maxHR) {
      return zone;
    }
  }
  // If above all zones, return zone 5
  if (hr > zones[zones.length - 1].maxHR) {
    return zones[zones.length - 1];
  }
  // If below all zones, return zone 1
  if (hr < zones[0].minHR) {
    return zones[0];
  }
  return null;
}

/**
 * Get threshold HR range (Zone 4) from zones
 */
export function getThresholdHRRange(zones: HRZone[]): { min: number; max: number } {
  const zone4 = zones.find((z) => z.zone === 4);
  if (!zone4) {
    return { min: 0, max: 0 };
  }
  return { min: zone4.minHR, max: zone4.maxHR };
}

/**
 * Format heart rate range as string
 */
export function formatHRRange(min: number, max: number): string {
  return `${min} - ${max} bpm`;
}

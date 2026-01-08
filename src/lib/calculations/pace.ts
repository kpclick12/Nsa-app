import { RaceDistance, PaceZone, RaceResult } from '@/types';

// Race distances in km
const RACE_DISTANCES: Record<RaceDistance, number> = {
  '5k': 5,
  '10k': 10,
  'half': 21.0975,
};

/**
 * Calculate VDOT (Jack Daniels' running formula) from race result
 * VDOT is an estimate of VO2max based on race performance
 */
export function calculateVDOT(raceResult: RaceResult): number {
  const distance = RACE_DISTANCES[raceResult.distance];
  const timeMinutes = raceResult.timeInSeconds / 60;

  // Percent of VO2max based on race duration
  const percentVO2max = 0.8 + 0.1894393 * Math.exp(-0.012778 * timeMinutes) +
    0.2989558 * Math.exp(-0.1932605 * timeMinutes);

  // Velocity in meters per minute
  const velocity = (distance * 1000) / timeMinutes;

  // VO2 cost of running at this velocity
  const vo2 = -4.6 + 0.182258 * velocity + 0.000104 * velocity * velocity;

  // VDOT = VO2 / percent of VO2max used
  return vo2 / percentVO2max;
}

/**
 * Calculate training paces from VDOT
 * Returns pace in seconds per km for different training types
 */
export function calculatePaceZonesFromVDOT(vdot: number): PaceZone[] {
  // Training intensity percentages of VDOT
  const paces = [
    {
      type: 'Easy',
      description: 'Conversational pace for base building (Zone 1-2)',
      intensityMin: 0.59,
      intensityMax: 0.74,
    },
    {
      type: 'Long Run',
      description: 'Slightly slower than easy, sustainable for 90+ min',
      intensityMin: 0.55,
      intensityMax: 0.65,
    },
    {
      type: 'Marathon',
      description: 'Goal marathon pace (Zone 3)',
      intensityMin: 0.75,
      intensityMax: 0.84,
    },
    {
      type: 'Threshold',
      description: 'Lactate threshold pace for Norwegian method (Zone 4)',
      intensityMin: 0.83,
      intensityMax: 0.88,
    },
    {
      type: 'Interval',
      description: 'VO2max intervals, hard efforts (Zone 5)',
      intensityMin: 0.95,
      intensityMax: 1.0,
    },
  ];

  return paces.map((p) => {
    // Calculate velocity at given intensity
    const velocityMin = vdotToVelocity(vdot * p.intensityMin);
    const velocityMax = vdotToVelocity(vdot * p.intensityMax);

    // Convert to seconds per km (slower pace = higher number)
    return {
      type: p.type,
      description: p.description,
      minPace: Math.round((1000 / velocityMax) * 60), // faster pace (min)
      maxPace: Math.round((1000 / velocityMin) * 60), // slower pace (max)
    };
  });
}

/**
 * Convert VDOT to velocity (meters per minute)
 */
function vdotToVelocity(vdot: number): number {
  // Inverse of the VO2 cost formula, simplified approximation
  // vo2 = -4.6 + 0.182258 * v + 0.000104 * v^2
  // Solving for v given vo2 (which equals vdot at 100% intensity)
  const a = 0.000104;
  const b = 0.182258;
  const c = -4.6 - vdot;

  // Quadratic formula
  const discriminant = b * b - 4 * a * c;
  if (discriminant < 0) return 200; // fallback

  return (-b + Math.sqrt(discriminant)) / (2 * a);
}

/**
 * Calculate pace zones from race result
 */
export function calculatePaceZonesFromRace(raceResult: RaceResult): PaceZone[] {
  const vdot = calculateVDOT(raceResult);
  return calculatePaceZonesFromVDOT(vdot);
}

/**
 * Get threshold pace from pace zones
 */
export function getThresholdPace(paceZones: PaceZone[]): PaceZone | null {
  return paceZones.find((p) => p.type === 'Threshold') || null;
}

/**
 * Format pace as mm:ss per km
 */
export function formatPace(secondsPerKm: number): string {
  const minutes = Math.floor(secondsPerKm / 60);
  const seconds = Math.round(secondsPerKm % 60);
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

/**
 * Format pace range as string
 */
export function formatPaceRange(minPace: number, maxPace: number): string {
  return `${formatPace(minPace)} - ${formatPace(maxPace)} /km`;
}

/**
 * Parse time string (mm:ss or hh:mm:ss) to seconds
 */
export function parseTimeToSeconds(timeStr: string): number {
  const parts = timeStr.split(':').map(Number);
  if (parts.length === 2) {
    // mm:ss
    return parts[0] * 60 + parts[1];
  } else if (parts.length === 3) {
    // hh:mm:ss
    return parts[0] * 3600 + parts[1] * 60 + parts[2];
  }
  return 0;
}

/**
 * Format seconds to time string (hh:mm:ss or mm:ss)
 */
export function formatTime(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.round(seconds % 60);

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
  return `${minutes}:${secs.toString().padStart(2, '0')}`;
}

/**
 * Calculate average pace from distance and duration
 */
export function calculatePace(distanceKm: number, durationMinutes: number): number {
  if (distanceKm <= 0) return 0;
  return (durationMinutes * 60) / distanceKm; // seconds per km
}

/**
 * Get distance label
 */
export function getDistanceLabel(distance: RaceDistance): string {
  const labels: Record<RaceDistance, string> = {
    '5k': '5K',
    '10k': '10K',
    'half': 'Half Marathon',
  };
  return labels[distance];
}

import { ThresholdWorkout, PlannedWorkout, WorkoutType } from '@/types';
import { generateId } from '../storage';

// Predefined threshold workouts used in the Norwegian method
export const THRESHOLD_WORKOUTS: ThresholdWorkout[] = [
  {
    id: 'threshold-4x8',
    name: '4x8 min Threshold',
    intervals: 4,
    duration: 8,
    rest: 2,
    description: '4 intervals of 8 minutes at threshold pace with 2 min easy jog recovery. Total: 32 min at threshold.',
  },
  {
    id: 'threshold-5x6',
    name: '5x6 min Threshold',
    intervals: 5,
    duration: 6,
    rest: 2,
    description: '5 intervals of 6 minutes at threshold pace with 2 min easy jog recovery. Total: 30 min at threshold.',
  },
  {
    id: 'threshold-3x10',
    name: '3x10 min Threshold',
    intervals: 3,
    duration: 10,
    rest: 3,
    description: '3 intervals of 10 minutes at threshold pace with 3 min easy jog recovery. Total: 30 min at threshold.',
  },
  {
    id: 'threshold-6x5',
    name: '6x5 min Threshold',
    intervals: 6,
    duration: 5,
    rest: 1.5,
    description: '6 intervals of 5 minutes at threshold pace with 90 sec easy jog recovery. Total: 30 min at threshold.',
  },
  {
    id: 'threshold-2x15',
    name: '2x15 min Threshold',
    intervals: 2,
    duration: 15,
    rest: 5,
    description: '2 intervals of 15 minutes at threshold pace with 5 min easy jog recovery. Total: 30 min at threshold.',
  },
];

/**
 * Get a threshold workout by ID
 */
export function getThresholdWorkout(id: string): ThresholdWorkout | undefined {
  return THRESHOLD_WORKOUTS.find((w) => w.id === id);
}

/**
 * Calculate total workout time for a threshold session (including warmup/cooldown)
 */
export function calculateThresholdWorkoutDuration(workout: ThresholdWorkout): number {
  const warmupCooldown = 20; // 10 min warmup + 10 min cooldown
  const workTime = workout.intervals * workout.duration;
  const restTime = (workout.intervals - 1) * workout.rest;
  return warmupCooldown + workTime + restTime;
}

/**
 * Create a planned workout from a workout type
 */
export function createPlannedWorkout(
  day: number,
  type: WorkoutType,
  name: string,
  description: string,
  options?: {
    targetDuration?: number;
    targetDistance?: number;
    intervals?: string;
    targetZone?: number;
  }
): PlannedWorkout {
  return {
    id: generateId(),
    day,
    type,
    name,
    description,
    targetDuration: options?.targetDuration,
    targetDistance: options?.targetDistance,
    intervals: options?.intervals,
    targetZone: options?.targetZone,
    completed: false,
  };
}

/**
 * Create a threshold workout as a planned workout
 */
export function createThresholdPlannedWorkout(
  day: number,
  thresholdWorkout: ThresholdWorkout
): PlannedWorkout {
  return createPlannedWorkout(day, 'threshold', thresholdWorkout.name, thresholdWorkout.description, {
    targetDuration: calculateThresholdWorkoutDuration(thresholdWorkout),
    intervals: `${thresholdWorkout.intervals}x${thresholdWorkout.duration}min`,
    targetZone: 4,
  });
}

/**
 * Workout type labels and colors
 */
export const WORKOUT_TYPE_INFO: Record<
  WorkoutType,
  { label: string; color: string; bgColor: string }
> = {
  easy: {
    label: 'Easy Run',
    color: '#3b82f6',
    bgColor: 'bg-blue-500/20',
  },
  threshold: {
    label: 'Threshold',
    color: '#f97316',
    bgColor: 'bg-orange-500/20',
  },
  long: {
    label: 'Long Run',
    color: '#22c55e',
    bgColor: 'bg-green-500/20',
  },
  recovery: {
    label: 'Recovery',
    color: '#a855f7',
    bgColor: 'bg-purple-500/20',
  },
  rest: {
    label: 'Rest Day',
    color: '#6b7280',
    bgColor: 'bg-gray-500/20',
  },
  tempo: {
    label: 'Tempo Run',
    color: '#eab308',
    bgColor: 'bg-yellow-500/20',
  },
  intervals: {
    label: 'Intervals',
    color: '#ef4444',
    bgColor: 'bg-red-500/20',
  },
};

/**
 * Day names
 */
export const DAY_NAMES = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
];

/**
 * Get day name from day number
 */
export function getDayName(day: number): string {
  return DAY_NAMES[day] || '';
}

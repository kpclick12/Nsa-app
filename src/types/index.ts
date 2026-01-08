// User profile and zones
export interface UserProfile {
  maxHR?: number;
  lactateThresholdHR?: number;
  recentRace?: RaceResult;
  zones: HRZone[];
  paceZones: PaceZone[];
}

export interface RaceResult {
  distance: RaceDistance;
  timeInSeconds: number;
}

export type RaceDistance = '5k' | '10k' | 'half' | 'marathon';

export interface HRZone {
  zone: number;
  name: string;
  description: string;
  minHR: number;
  maxHR: number;
  color: string;
}

export interface PaceZone {
  type: string;
  description: string;
  minPace: number; // seconds per km
  maxPace: number; // seconds per km
}

// Training plans
export interface TrainingPlan {
  id: string;
  name: string;
  template: PlanTemplate;
  startDate: string;
  weeks: TrainingWeek[];
  createdAt: string;
  updatedAt: string;
}

export type PlanTemplate = '5k' | '10k' | 'half' | 'marathon' | 'general';

export interface TrainingWeek {
  weekNumber: number;
  focus: string;
  workouts: PlannedWorkout[];
}

export interface PlannedWorkout {
  id: string;
  day: number; // 0 = Monday, 6 = Sunday
  type: WorkoutType;
  name: string;
  description: string;
  targetDuration?: number; // minutes
  targetDistance?: number; // km
  intervals?: string; // e.g., "4x8min"
  targetZone?: number;
  completed: boolean;
  completedWorkoutId?: string;
}

export type WorkoutType = 'easy' | 'threshold' | 'long' | 'recovery' | 'rest' | 'tempo' | 'intervals';

// Workout tracking
export interface CompletedWorkout {
  id: string;
  plannedWorkoutId?: string;
  date: string;
  type: WorkoutType;
  name: string;
  distance: number; // km
  duration: number; // minutes
  avgHR?: number;
  avgPace: number; // seconds per km
  rpe: number; // 1-10
  notes?: string;
  zones?: ZoneTime[];
}

export interface ZoneTime {
  zone: number;
  minutes: number;
}

// Predefined threshold workouts
export interface ThresholdWorkout {
  id: string;
  name: string;
  intervals: number;
  duration: number; // minutes per interval
  rest: number; // minutes rest between intervals
  description: string;
}

// Statistics
export interface WeeklyStats {
  weekStart: string;
  totalDistance: number;
  totalDuration: number;
  workoutCount: number;
  avgRPE: number;
}

export interface MonthlyStats {
  month: string;
  totalDistance: number;
  totalDuration: number;
  workoutCount: number;
  avgRPE: number;
}

// Local storage keys
export const STORAGE_KEYS = {
  USER_PROFILE: 'nsa-user-profile',
  TRAINING_PLAN: 'nsa-training-plan',
  COMPLETED_WORKOUTS: 'nsa-completed-workouts',
} as const;

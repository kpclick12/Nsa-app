import {
  UserProfile,
  TrainingPlan,
  CompletedWorkout,
  STORAGE_KEYS,
} from '@/types';

// Check if we're in the browser
const isBrowser = typeof window !== 'undefined';

// User Profile
export function saveUserProfile(profile: UserProfile): void {
  if (!isBrowser) return;
  localStorage.setItem(STORAGE_KEYS.USER_PROFILE, JSON.stringify(profile));
}

export function loadUserProfile(): UserProfile | null {
  if (!isBrowser) return null;
  const data = localStorage.getItem(STORAGE_KEYS.USER_PROFILE);
  if (!data) return null;
  try {
    return JSON.parse(data) as UserProfile;
  } catch {
    return null;
  }
}

export function clearUserProfile(): void {
  if (!isBrowser) return;
  localStorage.removeItem(STORAGE_KEYS.USER_PROFILE);
}

// Training Plan
export function saveTrainingPlan(plan: TrainingPlan): void {
  if (!isBrowser) return;
  localStorage.setItem(STORAGE_KEYS.TRAINING_PLAN, JSON.stringify(plan));
}

export function loadTrainingPlan(): TrainingPlan | null {
  if (!isBrowser) return null;
  const data = localStorage.getItem(STORAGE_KEYS.TRAINING_PLAN);
  if (!data) return null;
  try {
    return JSON.parse(data) as TrainingPlan;
  } catch {
    return null;
  }
}

export function clearTrainingPlan(): void {
  if (!isBrowser) return;
  localStorage.removeItem(STORAGE_KEYS.TRAINING_PLAN);
}

// Completed Workouts
export function saveCompletedWorkouts(workouts: CompletedWorkout[]): void {
  if (!isBrowser) return;
  localStorage.setItem(STORAGE_KEYS.COMPLETED_WORKOUTS, JSON.stringify(workouts));
}

export function loadCompletedWorkouts(): CompletedWorkout[] {
  if (!isBrowser) return [];
  const data = localStorage.getItem(STORAGE_KEYS.COMPLETED_WORKOUTS);
  if (!data) return [];
  try {
    return JSON.parse(data) as CompletedWorkout[];
  } catch {
    return [];
  }
}

export function addCompletedWorkout(workout: CompletedWorkout): void {
  const workouts = loadCompletedWorkouts();
  workouts.push(workout);
  saveCompletedWorkouts(workouts);
}

export function updateCompletedWorkout(workout: CompletedWorkout): void {
  const workouts = loadCompletedWorkouts();
  const index = workouts.findIndex((w) => w.id === workout.id);
  if (index !== -1) {
    workouts[index] = workout;
    saveCompletedWorkouts(workouts);
  }
}

export function deleteCompletedWorkout(id: string): void {
  const workouts = loadCompletedWorkouts();
  const filtered = workouts.filter((w) => w.id !== id);
  saveCompletedWorkouts(filtered);
}

export function clearCompletedWorkouts(): void {
  if (!isBrowser) return;
  localStorage.removeItem(STORAGE_KEYS.COMPLETED_WORKOUTS);
}

// Clear all data
export function clearAllData(): void {
  clearUserProfile();
  clearTrainingPlan();
  clearCompletedWorkouts();
}

// Generate unique ID
export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

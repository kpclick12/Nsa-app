import { TrainingPlan, TrainingWeek, PlanTemplate } from '@/types';
import { generateId } from '../storage';
import {
  THRESHOLD_WORKOUTS,
  createPlannedWorkout,
  createThresholdPlannedWorkout,
} from './workouts';

interface PlanTemplateInfo {
  id: PlanTemplate;
  name: string;
  description: string;
  weeklyVolume: string;
  thresholdSessions: number;
}

export const PLAN_TEMPLATES: PlanTemplateInfo[] = [
  {
    id: '5k',
    name: '5K Focus',
    description: 'Build speed and VO2max for 5K racing while maintaining aerobic base.',
    weeklyVolume: '40-60 km/week',
    thresholdSessions: 2,
  },
  {
    id: '10k',
    name: '10K Focus',
    description: 'Develop threshold capacity and aerobic endurance for 10K performance.',
    weeklyVolume: '50-70 km/week',
    thresholdSessions: 2,
  },
  {
    id: 'half',
    name: 'Half Marathon Focus',
    description: 'Build endurance and threshold capacity for half marathon racing.',
    weeklyVolume: '60-80 km/week',
    thresholdSessions: 2,
  },
  {
    id: 'general',
    name: 'General Fitness',
    description: 'Build a strong aerobic base with the Norwegian method. Great for base building.',
    weeklyVolume: '40-60 km/week',
    thresholdSessions: 1,
  },
];

/**
 * Get template info by ID
 */
export function getTemplateInfo(template: PlanTemplate): PlanTemplateInfo | undefined {
  return PLAN_TEMPLATES.find((t) => t.id === template);
}

/**
 * Generate an 8-week training plan based on template
 */
export function generateTrainingPlan(
  template: PlanTemplate,
  startDate: string
): TrainingPlan {
  const info = getTemplateInfo(template);
  const weeks = generateWeeks(template);

  return {
    id: generateId(),
    name: info?.name || 'Training Plan',
    template,
    startDate,
    weeks,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

/**
 * Generate 8 weeks of training
 */
function generateWeeks(template: PlanTemplate): TrainingWeek[] {
  const weeks: TrainingWeek[] = [];

  for (let i = 1; i <= 8; i++) {
    weeks.push(generateWeek(i, template));
  }

  return weeks;
}

/**
 * Generate a single training week
 */
function generateWeek(weekNumber: number, template: PlanTemplate): TrainingWeek {
  // Week focus changes through the 8-week block
  const focusMap: Record<number, string> = {
    1: 'Introduction / Base',
    2: 'Building',
    3: 'Building',
    4: 'Peak Load',
    5: 'Recovery',
    6: 'Building',
    7: 'Peak Load',
    8: 'Taper / Race',
  };

  // Recovery week has less volume
  const isRecoveryWeek = weekNumber === 5;
  const isTaperWeek = weekNumber === 8;

  // Get threshold workouts based on week (vary them)
  const thresholdWorkoutIndex1 = (weekNumber - 1) % THRESHOLD_WORKOUTS.length;
  const thresholdWorkoutIndex2 = (weekNumber) % THRESHOLD_WORKOUTS.length;

  let workouts;

  if (template === 'general') {
    workouts = generateGeneralWeek(weekNumber, isRecoveryWeek, isTaperWeek, thresholdWorkoutIndex1);
  } else if (template === '5k') {
    workouts = generate5KWeek(weekNumber, isRecoveryWeek, isTaperWeek, thresholdWorkoutIndex1, thresholdWorkoutIndex2);
  } else if (template === '10k') {
    workouts = generate10KWeek(weekNumber, isRecoveryWeek, isTaperWeek, thresholdWorkoutIndex1, thresholdWorkoutIndex2);
  } else {
    workouts = generateHalfWeek(weekNumber, isRecoveryWeek, isTaperWeek, thresholdWorkoutIndex1, thresholdWorkoutIndex2);
  }

  return {
    weekNumber,
    focus: focusMap[weekNumber],
    workouts,
  };
}

/**
 * Generate General Fitness week (1 threshold session)
 */
function generateGeneralWeek(
  weekNumber: number,
  isRecovery: boolean,
  isTaper: boolean,
  thresholdIdx: number
) {
  const baseEasyDuration = isRecovery ? 40 : isTaper ? 35 : 45 + weekNumber * 2;
  const baseLongDuration = isRecovery ? 60 : isTaper ? 50 : 70 + weekNumber * 5;

  return [
    createPlannedWorkout(0, 'easy', 'Easy Run', 'Easy aerobic run in Zone 2', {
      targetDuration: baseEasyDuration,
      targetZone: 2,
    }),
    createThresholdPlannedWorkout(1, THRESHOLD_WORKOUTS[thresholdIdx]),
    createPlannedWorkout(2, 'recovery', 'Recovery Run', 'Very easy recovery jog in Zone 1', {
      targetDuration: 30,
      targetZone: 1,
    }),
    createPlannedWorkout(3, 'easy', 'Easy Run', 'Easy aerobic run in Zone 2', {
      targetDuration: baseEasyDuration,
      targetZone: 2,
    }),
    createPlannedWorkout(4, 'rest', 'Rest Day', 'Complete rest or light stretching'),
    createPlannedWorkout(5, 'long', 'Long Run', 'Long easy run for aerobic development', {
      targetDuration: baseLongDuration,
      targetZone: 2,
    }),
    createPlannedWorkout(6, 'rest', 'Rest Day', 'Complete rest or light stretching'),
  ];
}

/**
 * Generate 5K Focus week (2 threshold sessions + intervals)
 */
function generate5KWeek(
  weekNumber: number,
  isRecovery: boolean,
  isTaper: boolean,
  thresholdIdx1: number,
  thresholdIdx2: number
) {
  const baseEasyDuration = isRecovery ? 35 : isTaper ? 30 : 40 + weekNumber;
  const baseLongDuration = isRecovery ? 50 : isTaper ? 40 : 60 + weekNumber * 3;

  return [
    createPlannedWorkout(0, 'easy', 'Easy Run', 'Easy aerobic run in Zone 2', {
      targetDuration: baseEasyDuration,
      targetZone: 2,
    }),
    createThresholdPlannedWorkout(1, THRESHOLD_WORKOUTS[thresholdIdx1]),
    createPlannedWorkout(2, 'recovery', 'Recovery Run', 'Very easy recovery jog in Zone 1', {
      targetDuration: 25,
      targetZone: 1,
    }),
    isRecovery || isTaper
      ? createPlannedWorkout(3, 'easy', 'Easy Run', 'Easy aerobic run', {
          targetDuration: baseEasyDuration,
          targetZone: 2,
        })
      : createThresholdPlannedWorkout(3, THRESHOLD_WORKOUTS[thresholdIdx2]),
    createPlannedWorkout(4, 'rest', 'Rest Day', 'Complete rest or light stretching'),
    createPlannedWorkout(5, 'long', 'Long Run', 'Long easy run for aerobic development', {
      targetDuration: baseLongDuration,
      targetZone: 2,
    }),
    createPlannedWorkout(6, 'rest', 'Rest Day', 'Complete rest or light stretching'),
  ];
}

/**
 * Generate 10K Focus week (2 threshold sessions)
 */
function generate10KWeek(
  weekNumber: number,
  isRecovery: boolean,
  isTaper: boolean,
  thresholdIdx1: number,
  thresholdIdx2: number
) {
  const baseEasyDuration = isRecovery ? 40 : isTaper ? 35 : 45 + weekNumber;
  const baseLongDuration = isRecovery ? 60 : isTaper ? 50 : 75 + weekNumber * 3;

  return [
    createPlannedWorkout(0, 'easy', 'Easy Run', 'Easy aerobic run in Zone 2', {
      targetDuration: baseEasyDuration,
      targetZone: 2,
    }),
    createThresholdPlannedWorkout(1, THRESHOLD_WORKOUTS[thresholdIdx1]),
    createPlannedWorkout(2, 'recovery', 'Recovery Run', 'Very easy recovery jog in Zone 1', {
      targetDuration: 30,
      targetZone: 1,
    }),
    createPlannedWorkout(3, 'easy', 'Easy Run', 'Easy aerobic run in Zone 2', {
      targetDuration: baseEasyDuration,
      targetZone: 2,
    }),
    isRecovery || isTaper
      ? createPlannedWorkout(4, 'rest', 'Rest Day', 'Complete rest or light stretching')
      : createThresholdPlannedWorkout(4, THRESHOLD_WORKOUTS[thresholdIdx2]),
    createPlannedWorkout(5, 'long', 'Long Run', 'Long easy run for aerobic development', {
      targetDuration: baseLongDuration,
      targetZone: 2,
    }),
    createPlannedWorkout(6, 'rest', 'Rest Day', 'Complete rest or light stretching'),
  ];
}

/**
 * Generate Half Marathon Focus week (2 threshold sessions, longer long runs)
 */
function generateHalfWeek(
  weekNumber: number,
  isRecovery: boolean,
  isTaper: boolean,
  thresholdIdx1: number,
  thresholdIdx2: number
) {
  const baseEasyDuration = isRecovery ? 45 : isTaper ? 40 : 50 + weekNumber;
  const baseLongDuration = isRecovery ? 70 : isTaper ? 60 : 90 + weekNumber * 5;

  return [
    createPlannedWorkout(0, 'easy', 'Easy Run', 'Easy aerobic run in Zone 2', {
      targetDuration: baseEasyDuration,
      targetZone: 2,
    }),
    createThresholdPlannedWorkout(1, THRESHOLD_WORKOUTS[thresholdIdx1]),
    createPlannedWorkout(2, 'easy', 'Easy Run', 'Easy aerobic run in Zone 2', {
      targetDuration: baseEasyDuration - 10,
      targetZone: 2,
    }),
    createPlannedWorkout(3, 'recovery', 'Recovery Run', 'Very easy recovery jog in Zone 1', {
      targetDuration: 30,
      targetZone: 1,
    }),
    isRecovery || isTaper
      ? createPlannedWorkout(4, 'easy', 'Easy Run', 'Easy aerobic run', {
          targetDuration: baseEasyDuration,
          targetZone: 2,
        })
      : createThresholdPlannedWorkout(4, THRESHOLD_WORKOUTS[thresholdIdx2]),
    createPlannedWorkout(5, 'long', 'Long Run', 'Long easy run for aerobic development', {
      targetDuration: baseLongDuration,
      targetZone: 2,
    }),
    createPlannedWorkout(6, 'rest', 'Rest Day', 'Complete rest or light stretching'),
  ];
}

/**
 * Update a workout in a plan
 */
export function updateWorkoutInPlan(
  plan: TrainingPlan,
  weekNumber: number,
  workoutId: string,
  updates: Partial<TrainingPlan['weeks'][0]['workouts'][0]>
): TrainingPlan {
  return {
    ...plan,
    updatedAt: new Date().toISOString(),
    weeks: plan.weeks.map((week) => {
      if (week.weekNumber !== weekNumber) return week;
      return {
        ...week,
        workouts: week.workouts.map((workout) => {
          if (workout.id !== workoutId) return workout;
          return { ...workout, ...updates };
        }),
      };
    }),
  };
}

/**
 * Mark a workout as completed
 */
export function markWorkoutCompleted(
  plan: TrainingPlan,
  weekNumber: number,
  workoutId: string,
  completedWorkoutId: string
): TrainingPlan {
  return updateWorkoutInPlan(plan, weekNumber, workoutId, {
    completed: true,
    completedWorkoutId,
  });
}

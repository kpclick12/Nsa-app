'use client';

import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Select from '@/components/ui/Select';
import Input from '@/components/ui/Input';
import { PLAN_TEMPLATES, generateTrainingPlan, updateWorkoutInPlan } from '@/lib/plans/templates';
import { WORKOUT_TYPE_INFO, DAY_NAMES } from '@/lib/plans/workouts';
import { saveTrainingPlan, loadTrainingPlan, loadUserProfile } from '@/lib/storage';
import { TrainingPlan, PlanTemplate, PlannedWorkout } from '@/types';

export default function PlanPage() {
  const [plan, setPlan] = useState<TrainingPlan | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<PlanTemplate>('general');
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedWeek, setSelectedWeek] = useState(1);
  const [editingWorkout, setEditingWorkout] = useState<PlannedWorkout | null>(null);
  const [hasProfile, setHasProfile] = useState(false);

  useEffect(() => {
    const savedPlan = loadTrainingPlan();
    if (savedPlan) {
      setPlan(savedPlan);
    }
    const profile = loadUserProfile();
    setHasProfile(profile !== null && profile.zones.length > 0);
  }, []);

  const handleGeneratePlan = () => {
    const newPlan = generateTrainingPlan(selectedTemplate, startDate);
    setPlan(newPlan);
    saveTrainingPlan(newPlan);
  };

  const handleDeletePlan = () => {
    if (confirm('Are you sure you want to delete your training plan?')) {
      setPlan(null);
      localStorage.removeItem('nsa-training-plan');
    }
  };

  const handleUpdateWorkout = (weekNumber: number, workout: PlannedWorkout) => {
    if (!plan) return;
    const updatedPlan = updateWorkoutInPlan(plan, weekNumber, workout.id, workout);
    setPlan(updatedPlan);
    saveTrainingPlan(updatedPlan);
    setEditingWorkout(null);
  };

  const templateOptions = PLAN_TEMPLATES.map((t) => ({
    value: t.id,
    label: t.name,
  }));

  const weekOptions = plan
    ? plan.weeks.map((w) => ({
        value: w.weekNumber.toString(),
        label: `Week ${w.weekNumber} - ${w.focus}`,
      }))
    : [];

  const currentWeek = plan?.weeks.find((w) => w.weekNumber === selectedWeek);

  if (!hasProfile) {
    return (
      <div className="max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Training Plan</h1>
          <p className="text-gray-400">Generate and manage your 8-week training plan</p>
        </div>

        <Card variant="bordered">
          <CardContent>
            <div className="text-center py-12">
              <h2 className="text-xl font-semibold text-white mb-2">Set Up Your Zones First</h2>
              <p className="text-gray-400 mb-6">
                Before creating a training plan, you need to calculate your training zones.
              </p>
              <a href="/calculator">
                <Button>Go to Calculator</Button>
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Training Plan</h1>
        <p className="text-gray-400">Generate and manage your 8-week training plan</p>
      </div>

      {!plan ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Plan Generator */}
          <Card variant="bordered">
            <CardHeader>
              <CardTitle>Create New Plan</CardTitle>
              <CardDescription>Choose a template and start date</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Select
                  label="Plan Template"
                  options={templateOptions}
                  value={selectedTemplate}
                  onChange={(e) => setSelectedTemplate(e.target.value as PlanTemplate)}
                />

                <Input
                  label="Start Date"
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />

                <Button onClick={handleGeneratePlan} className="w-full">
                  Generate Plan
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Template Info */}
          <Card variant="bordered">
            <CardHeader>
              <CardTitle>Plan Templates</CardTitle>
              <CardDescription>Choose the right plan for your goals</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {PLAN_TEMPLATES.map((template) => (
                  <div
                    key={template.id}
                    className={`p-4 rounded-lg cursor-pointer transition-colors ${
                      selectedTemplate === template.id
                        ? 'bg-cyan-600/20 border border-cyan-500'
                        : 'bg-gray-800 hover:bg-gray-750'
                    }`}
                    onClick={() => setSelectedTemplate(template.id)}
                  >
                    <h4 className="font-medium text-white">{template.name}</h4>
                    <p className="text-sm text-gray-400 mt-1">{template.description}</p>
                    <div className="flex gap-4 mt-2 text-xs text-gray-500">
                      <span>Volume: {template.weeklyVolume}</span>
                      <span>{template.thresholdSessions} threshold sessions/week</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      ) : (
        <>
          {/* Plan Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardContent>
                <p className="text-sm text-gray-400">Plan</p>
                <p className="text-xl font-bold text-white">{plan.name}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent>
                <p className="text-sm text-gray-400">Start Date</p>
                <p className="text-xl font-bold text-white">
                  {new Date(plan.startDate).toLocaleDateString()}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent>
                <p className="text-sm text-gray-400">Duration</p>
                <p className="text-xl font-bold text-white">8 Weeks</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent>
                <p className="text-sm text-gray-400">Progress</p>
                <p className="text-xl font-bold text-white">
                  {plan.weeks.reduce(
                    (acc, w) => acc + w.workouts.filter((wo) => wo.completed).length,
                    0
                  )}
                  /{plan.weeks.reduce((acc, w) => acc + w.workouts.length, 0)} workouts
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Week Selector */}
          <Card variant="bordered" className="mb-6">
            <CardContent>
              <div className="flex items-center justify-between">
                <Select
                  options={weekOptions}
                  value={selectedWeek.toString()}
                  onChange={(e) => setSelectedWeek(parseInt(e.target.value))}
                  className="w-64"
                />
                <Button variant="danger" size="sm" onClick={handleDeletePlan}>
                  Delete Plan
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Week View */}
          {currentWeek && (
            <Card variant="bordered">
              <CardHeader>
                <CardTitle>Week {currentWeek.weekNumber}: {currentWeek.focus}</CardTitle>
                <CardDescription>Click on a workout to edit it</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-7 gap-2">
                  {DAY_NAMES.map((day, index) => {
                    const workout = currentWeek.workouts.find((w) => w.day === index);
                    const typeInfo = workout ? WORKOUT_TYPE_INFO[workout.type] : null;

                    return (
                      <div key={day} className="min-h-[120px]">
                        <p className="text-xs text-gray-500 mb-2 text-center">{day}</p>
                        {workout ? (
                          <div
                            className={`p-2 rounded-lg cursor-pointer transition-colors ${
                              workout.completed ? 'opacity-60' : ''
                            } ${typeInfo?.bgColor || 'bg-gray-800'}`}
                            onClick={() => setEditingWorkout(workout)}
                          >
                            <div className="flex items-center gap-1 mb-1">
                              <div
                                className="w-2 h-2 rounded-full"
                                style={{ backgroundColor: typeInfo?.color }}
                              />
                              <span className="text-xs font-medium text-white truncate">
                                {typeInfo?.label}
                              </span>
                            </div>
                            <p className="text-xs text-gray-300 line-clamp-2">{workout.name}</p>
                            {workout.targetDuration && (
                              <p className="text-xs text-gray-500 mt-1">
                                {workout.targetDuration} min
                              </p>
                            )}
                            {workout.completed && (
                              <span className="text-xs text-green-400">Completed</span>
                            )}
                          </div>
                        ) : (
                          <div className="p-2 rounded-lg bg-gray-800/50 text-center">
                            <span className="text-xs text-gray-600">Rest</span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Edit Workout Modal */}
          {editingWorkout && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
              <Card className="w-full max-w-md">
                <CardHeader>
                  <CardTitle>Edit Workout</CardTitle>
                  <CardDescription>{editingWorkout.name}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">
                        Description
                      </label>
                      <textarea
                        className="w-full px-3 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white"
                        rows={3}
                        value={editingWorkout.description}
                        onChange={(e) =>
                          setEditingWorkout({ ...editingWorkout, description: e.target.value })
                        }
                      />
                    </div>

                    <Input
                      label="Target Duration (min)"
                      type="number"
                      value={editingWorkout.targetDuration?.toString() || ''}
                      onChange={(e) =>
                        setEditingWorkout({
                          ...editingWorkout,
                          targetDuration: parseInt(e.target.value) || undefined,
                        })
                      }
                    />

                    <Input
                      label="Target Distance (km)"
                      type="number"
                      step="0.1"
                      value={editingWorkout.targetDistance?.toString() || ''}
                      onChange={(e) =>
                        setEditingWorkout({
                          ...editingWorkout,
                          targetDistance: parseFloat(e.target.value) || undefined,
                        })
                      }
                    />

                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        className="flex-1"
                        onClick={() => setEditingWorkout(null)}
                      >
                        Cancel
                      </Button>
                      <Button
                        className="flex-1"
                        onClick={() => handleUpdateWorkout(selectedWeek, editingWorkout)}
                      >
                        Save Changes
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </>
      )}
    </div>
  );
}

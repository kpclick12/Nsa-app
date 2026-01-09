'use client';

import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import {
  loadCompletedWorkouts,
  addCompletedWorkout,
  deleteCompletedWorkout,
  generateId,
} from '@/lib/storage';
import { WORKOUT_TYPE_INFO } from '@/lib/plans/workouts';
import { formatPace, calculatePace } from '@/lib/calculations/pace';
import { CompletedWorkout, WorkoutType } from '@/types';

export default function TrackingPage() {
  const [workouts, setWorkouts] = useState<CompletedWorkout[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form state
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [type, setType] = useState<WorkoutType>('easy');
  const [name, setName] = useState('');
  const [distance, setDistance] = useState('');
  const [duration, setDuration] = useState('');
  const [avgHR, setAvgHR] = useState('');
  const [rpe, setRpe] = useState('5');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    setWorkouts(loadCompletedWorkouts());
  }, []);

  const resetForm = () => {
    setDate(new Date().toISOString().split('T')[0]);
    setType('easy');
    setName('');
    setDistance('');
    setDuration('');
    setAvgHR('');
    setRpe('5');
    setNotes('');
    setEditingId(null);
  };

  const handleSubmit = () => {
    const dist = parseFloat(distance);
    const dur = parseFloat(duration);
    const pace = calculatePace(dist, dur);

    const workout: CompletedWorkout = {
      id: editingId || generateId(),
      date,
      type,
      name: name || WORKOUT_TYPE_INFO[type].label,
      distance: dist,
      duration: dur,
      avgHR: avgHR ? parseInt(avgHR) : undefined,
      avgPace: pace,
      rpe: parseInt(rpe),
      notes: notes || undefined,
    };

    if (editingId) {
      // Update existing
      const updated = workouts.map((w) => (w.id === editingId ? workout : w));
      setWorkouts(updated);
      localStorage.setItem('nsa-completed-workouts', JSON.stringify(updated));
    } else {
      // Add new
      addCompletedWorkout(workout);
      setWorkouts([...workouts, workout]);
    }

    resetForm();
    setShowForm(false);
  };

  const handleEdit = (workout: CompletedWorkout) => {
    setEditingId(workout.id);
    setDate(workout.date);
    setType(workout.type);
    setName(workout.name);
    setDistance(workout.distance.toString());
    setDuration(workout.duration.toString());
    setAvgHR(workout.avgHR?.toString() || '');
    setRpe(workout.rpe.toString());
    setNotes(workout.notes || '');
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this workout?')) {
      deleteCompletedWorkout(id);
      setWorkouts(workouts.filter((w) => w.id !== id));
    }
  };

  const typeOptions = Object.entries(WORKOUT_TYPE_INFO).map(([value, info]) => ({
    value,
    label: info.label,
  }));

  const rpeOptions = Array.from({ length: 10 }, (_, i) => ({
    value: (i + 1).toString(),
    label: `${i + 1} - ${getRPELabel(i + 1)}`,
  }));

  // Sort workouts by date (newest first)
  const sortedWorkouts = [...workouts].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  // Calculate stats
  const totalDistance = workouts.reduce((sum, w) => sum + w.distance, 0);
  const totalDuration = workouts.reduce((sum, w) => sum + w.duration, 0);
  const avgRPE =
    workouts.length > 0
      ? workouts.reduce((sum, w) => sum + w.rpe, 0) / workouts.length
      : 0;

  return (
    <div className="max-w-6xl">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Workout Tracking</h1>
          <p className="text-gray-400">Log and manage your training sessions</p>
        </div>
        <Button onClick={() => setShowForm(true)}>Log Workout</Button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent>
            <p className="text-sm text-gray-400">Total Distance</p>
            <p className="text-2xl font-bold text-gray-900">{totalDistance.toFixed(1)} km</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <p className="text-sm text-gray-400">Total Duration</p>
            <p className="text-2xl font-bold text-gray-900">{Math.round(totalDuration)} min</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <p className="text-sm text-gray-400">Total Workouts</p>
            <p className="text-2xl font-bold text-gray-900">{workouts.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <p className="text-sm text-gray-400">Avg RPE</p>
            <p className="text-2xl font-bold text-gray-900">{avgRPE.toFixed(1)}</p>
          </CardContent>
        </Card>
      </div>

      {/* Workout Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <CardTitle>{editingId ? 'Edit Workout' : 'Log New Workout'}</CardTitle>
              <CardDescription>Enter your workout details</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="Date"
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                  />
                  <Select
                    label="Workout Type"
                    options={typeOptions}
                    value={type}
                    onChange={(e) => setType(e.target.value as WorkoutType)}
                  />
                </div>

                <Input
                  label="Workout Name (optional)"
                  placeholder={WORKOUT_TYPE_INFO[type].label}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />

                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="Distance (km)"
                    type="number"
                    step="0.1"
                    placeholder="e.g., 10.5"
                    value={distance}
                    onChange={(e) => setDistance(e.target.value)}
                  />
                  <Input
                    label="Duration (minutes)"
                    type="number"
                    placeholder="e.g., 55"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="Average Heart Rate (optional)"
                    type="number"
                    placeholder="e.g., 145"
                    value={avgHR}
                    onChange={(e) => setAvgHR(e.target.value)}
                  />
                  <Select
                    label="RPE (Perceived Effort)"
                    options={rpeOptions}
                    value={rpe}
                    onChange={(e) => setRpe(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Notes (optional)
                  </label>
                  <textarea
                    className="w-full px-3 py-2 rounded-lg bg-gray-100 border border-gray-300 text-gray-900 placeholder-gray-400"
                    rows={3}
                    placeholder="How did the workout feel?"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                  />
                </div>

                {distance && duration && (
                  <div className="p-3 rounded-lg bg-gray-100">
                    <p className="text-sm text-gray-400">Calculated Pace</p>
                    <p className="text-lg font-bold text-cyan-400">
                      {formatPace(calculatePace(parseFloat(distance), parseFloat(duration)))} /km
                    </p>
                  </div>
                )}

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => {
                      resetForm();
                      setShowForm(false);
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    className="flex-1"
                    onClick={handleSubmit}
                    disabled={!distance || !duration}
                  >
                    {editingId ? 'Update' : 'Save'} Workout
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Workout List */}
      <Card variant="bordered">
        <CardHeader>
          <CardTitle>Workout History</CardTitle>
          <CardDescription>Your logged training sessions</CardDescription>
        </CardHeader>
        <CardContent>
          {sortedWorkouts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-400 mb-4">No workouts logged yet</p>
              <Button onClick={() => setShowForm(true)}>Log Your First Workout</Button>
            </div>
          ) : (
            <div className="space-y-3">
              {sortedWorkouts.map((workout) => {
                const typeInfo = WORKOUT_TYPE_INFO[workout.type];
                return (
                  <div
                    key={workout.id}
                    className={`p-4 rounded-lg ${typeInfo.bgColor} border border-gray-200`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <div
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: typeInfo.color }}
                          />
                          <span className="font-medium text-gray-900">{workout.name}</span>
                          <span className="text-sm text-gray-500">
                            {new Date(workout.date).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="flex gap-4 text-sm">
                          <span className="text-gray-700">
                            {workout.distance.toFixed(1)} km
                          </span>
                          <span className="text-gray-700">{workout.duration} min</span>
                          <span className="text-cyan-400">
                            {formatPace(workout.avgPace)} /km
                          </span>
                          {workout.avgHR && (
                            <span className="text-gray-700">{workout.avgHR} bpm</span>
                          )}
                          <span className="text-gray-400">RPE: {workout.rpe}</span>
                        </div>
                        {workout.notes && (
                          <p className="text-sm text-gray-500 mt-2">{workout.notes}</p>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(workout)}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(workout.id)}
                        >
                          Delete
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function getRPELabel(rpe: number): string {
  const labels: Record<number, string> = {
    1: 'Very Light',
    2: 'Light',
    3: 'Light',
    4: 'Moderate',
    5: 'Moderate',
    6: 'Somewhat Hard',
    7: 'Hard',
    8: 'Very Hard',
    9: 'Very Hard',
    10: 'Maximum',
  };
  return labels[rpe] || '';
}

'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { loadUserProfile, loadTrainingPlan, loadCompletedWorkouts } from '@/lib/storage';
import { UserProfile, TrainingPlan, CompletedWorkout } from '@/types';
import { formatPace } from '@/lib/calculations/pace';

export default function Dashboard() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [plan, setPlan] = useState<TrainingPlan | null>(null);
  const [workouts, setWorkouts] = useState<CompletedWorkout[]>([]);

  useEffect(() => {
    setProfile(loadUserProfile());
    setPlan(loadTrainingPlan());
    setWorkouts(loadCompletedWorkouts());
  }, []);

  const hasProfile = profile && profile.zones.length > 0;
  const hasPlan = plan !== null;
  const recentWorkouts = workouts.slice(-5).reverse();

  // Calculate weekly stats
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
  const weeklyWorkouts = workouts.filter(
    (w) => new Date(w.date) >= oneWeekAgo
  );
  const weeklyDistance = weeklyWorkouts.reduce((sum, w) => sum + w.distance, 0);
  const weeklyDuration = weeklyWorkouts.reduce((sum, w) => sum + w.duration, 0);

  return (
    <div className="max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Dashboard</h1>
        <p className="text-gray-400">
          Welcome to NSA - Your Norwegian Single Method training companion
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent>
            <p className="text-sm text-gray-400 mb-1">This Week</p>
            <p className="text-2xl font-bold text-white">{weeklyDistance.toFixed(1)} km</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <p className="text-sm text-gray-400 mb-1">Duration</p>
            <p className="text-2xl font-bold text-white">{Math.round(weeklyDuration)} min</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <p className="text-sm text-gray-400 mb-1">Workouts</p>
            <p className="text-2xl font-bold text-white">{weeklyWorkouts.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <p className="text-sm text-gray-400 mb-1">Total Workouts</p>
            <p className="text-2xl font-bold text-white">{workouts.length}</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Getting Started / Profile Status */}
        <Card variant="bordered">
          <CardHeader>
            <CardTitle>Getting Started</CardTitle>
            <CardDescription>Set up your training zones and plan</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-lg bg-gray-800">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      hasProfile ? 'bg-green-500/20 text-green-400' : 'bg-gray-700 text-gray-400'
                    }`}
                  >
                    {hasProfile ? '✓' : '1'}
                  </div>
                  <div>
                    <p className="text-white font-medium">Calculate Training Zones</p>
                    <p className="text-sm text-gray-400">Set up your heart rate and pace zones</p>
                  </div>
                </div>
                <Link href="/calculator">
                  <Button variant={hasProfile ? 'outline' : 'primary'} size="sm">
                    {hasProfile ? 'Update' : 'Start'}
                  </Button>
                </Link>
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg bg-gray-800">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      hasPlan ? 'bg-green-500/20 text-green-400' : 'bg-gray-700 text-gray-400'
                    }`}
                  >
                    {hasPlan ? '✓' : '2'}
                  </div>
                  <div>
                    <p className="text-white font-medium">Create Training Plan</p>
                    <p className="text-sm text-gray-400">Generate your 8-week plan</p>
                  </div>
                </div>
                <Link href="/plan">
                  <Button variant={hasPlan ? 'outline' : hasProfile ? 'primary' : 'secondary'} size="sm" disabled={!hasProfile}>
                    {hasPlan ? 'View' : 'Create'}
                  </Button>
                </Link>
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg bg-gray-800">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center bg-gray-700 text-gray-400">
                    3
                  </div>
                  <div>
                    <p className="text-white font-medium">Track Your Workouts</p>
                    <p className="text-sm text-gray-400">Log your training sessions</p>
                  </div>
                </div>
                <Link href="/tracking">
                  <Button variant="secondary" size="sm">
                    Log
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Workouts */}
        <Card variant="bordered">
          <CardHeader>
            <CardTitle>Recent Workouts</CardTitle>
            <CardDescription>Your latest training sessions</CardDescription>
          </CardHeader>
          <CardContent>
            {recentWorkouts.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-400 mb-4">No workouts logged yet</p>
                <Link href="/tracking">
                  <Button>Log Your First Workout</Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {recentWorkouts.map((workout) => (
                  <div
                    key={workout.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-gray-800"
                  >
                    <div>
                      <p className="text-white font-medium">{workout.name}</p>
                      <p className="text-sm text-gray-400">
                        {new Date(workout.date).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-white">{workout.distance.toFixed(1)} km</p>
                      <p className="text-sm text-gray-400">{formatPace(workout.avgPace)} /km</p>
                    </div>
                  </div>
                ))}
                <Link href="/tracking" className="block">
                  <Button variant="outline" className="w-full">
                    View All Workouts
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Training Zones Summary */}
        {hasProfile && (
          <Card variant="bordered">
            <CardHeader>
              <CardTitle>Your Training Zones</CardTitle>
              <CardDescription>Heart rate zones for training</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {profile.zones.map((zone) => (
                  <div
                    key={zone.zone}
                    className="flex items-center justify-between p-2 rounded"
                    style={{ backgroundColor: `${zone.color}20` }}
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: zone.color }}
                      />
                      <span className="text-white">
                        Z{zone.zone}: {zone.name}
                      </span>
                    </div>
                    <span className="text-gray-300">
                      {zone.minHR} - {zone.maxHR} bpm
                    </span>
                  </div>
                ))}
              </div>
              <Link href="/calculator" className="block mt-4">
                <Button variant="outline" className="w-full">
                  Update Zones
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}

        {/* Learn Card */}
        <Card variant="bordered">
          <CardHeader>
            <CardTitle>Learn the Method</CardTitle>
            <CardDescription>Understanding the Norwegian single approach</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-gray-400 mb-4">
              The Norwegian method emphasizes high-volume, low-intensity training combined with
              structured threshold sessions. Learn how to apply it effectively.
            </p>
            <Link href="/learn">
              <Button variant="outline" className="w-full">
                Read More
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

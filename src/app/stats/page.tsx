'use client';

import { useState, useEffect } from 'react';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { loadCompletedWorkouts, loadTrainingPlan, loadUserProfile } from '@/lib/storage';
import { WORKOUT_TYPE_INFO } from '@/lib/plans/workouts';
import { CompletedWorkout, TrainingPlan, UserProfile } from '@/types';

export default function StatsPage() {
  const [workouts, setWorkouts] = useState<CompletedWorkout[]>([]);
  const [plan, setPlan] = useState<TrainingPlan | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    setWorkouts(loadCompletedWorkouts());
    setPlan(loadTrainingPlan());
    setProfile(loadUserProfile());
  }, []);

  // Calculate weekly volume data
  const weeklyData = getWeeklyData(workouts);

  // Calculate workout type distribution
  const typeDistribution = getTypeDistribution(workouts);

  // Calculate zone distribution (based on avg HR)
  const zoneDistribution = profile?.zones
    ? getZoneDistribution(workouts, profile.zones)
    : [];

  // Progress data (pace over time)
  const progressData = getProgressData(workouts);

  // Calendar data
  const calendarData = getCalendarData(workouts, plan);

  return (
    <div className="max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Statistics</h1>
        <p className="text-gray-400">Visualize your training progress and patterns</p>
      </div>

      {workouts.length === 0 ? (
        <Card variant="bordered">
          <CardContent>
            <div className="text-center py-12">
              <p className="text-gray-400 mb-4">
                No workout data yet. Start logging workouts to see your statistics.
              </p>
              <a href="/tracking">
                <button className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg">
                  Log Workout
                </button>
              </a>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Weekly Volume Chart */}
          <Card variant="bordered">
            <CardHeader>
              <CardTitle>Weekly Volume</CardTitle>
              <CardDescription>Distance and duration by week</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={weeklyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="week" stroke="#9ca3af" fontSize={12} />
                  <YAxis stroke="#9ca3af" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1f2937',
                      border: '1px solid #374151',
                      borderRadius: '8px',
                    }}
                    labelStyle={{ color: '#fff' }}
                  />
                  <Legend />
                  <Bar dataKey="distance" name="Distance (km)" fill="#06b6d4" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Workout Type Distribution */}
          <Card variant="bordered">
            <CardHeader>
              <CardTitle>Workout Types</CardTitle>
              <CardDescription>Distribution of workout types</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={typeDistribution}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`}
                    labelLine={false}
                  >
                    {typeDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1f2937',
                      border: '1px solid #374151',
                      borderRadius: '8px',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Progress Chart */}
          <Card variant="bordered">
            <CardHeader>
              <CardTitle>Pace Progress</CardTitle>
              <CardDescription>Average pace over time (lower is faster)</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={progressData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="date" stroke="#9ca3af" fontSize={12} />
                  <YAxis
                    stroke="#9ca3af"
                    fontSize={12}
                    tickFormatter={(value) => formatPaceForChart(value)}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1f2937',
                      border: '1px solid #374151',
                      borderRadius: '8px',
                    }}
                    labelStyle={{ color: '#fff' }}
                    formatter={(value) => [formatPaceForChart(value as number), 'Pace']}
                  />
                  <Line
                    type="monotone"
                    dataKey="pace"
                    stroke="#06b6d4"
                    strokeWidth={2}
                    dot={{ fill: '#06b6d4', r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Zone Distribution */}
          {zoneDistribution.length > 0 && (
            <Card variant="bordered">
              <CardHeader>
                <CardTitle>Heart Rate Zone Distribution</CardTitle>
                <CardDescription>Time spent in each zone</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={zoneDistribution} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis type="number" stroke="#9ca3af" fontSize={12} />
                    <YAxis dataKey="name" type="category" stroke="#9ca3af" fontSize={12} width={80} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#1f2937',
                        border: '1px solid #374151',
                        borderRadius: '8px',
                      }}
                    />
                    <Bar dataKey="workouts" name="Workouts">
                      {zoneDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          )}

          {/* Calendar View */}
          <Card variant="bordered" className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Training Calendar</CardTitle>
              <CardDescription>Planned vs completed workouts</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-7 gap-2">
                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
                  <div key={day} className="text-center text-xs text-gray-500 pb-2">
                    {day}
                  </div>
                ))}
                {calendarData.map((day, index) => (
                  <div
                    key={index}
                    className={`aspect-square rounded-lg flex flex-col items-center justify-center text-xs ${
                      day.isCurrentMonth ? 'bg-gray-800' : 'bg-gray-900'
                    } ${day.hasPlanned && !day.hasCompleted ? 'border border-orange-500/50' : ''} ${
                      day.hasCompleted ? 'border border-green-500/50' : ''
                    }`}
                  >
                    <span className={day.isCurrentMonth ? 'text-gray-300' : 'text-gray-600'}>
                      {day.day}
                    </span>
                    {day.hasCompleted && (
                      <div className="w-2 h-2 rounded-full bg-green-500 mt-1" />
                    )}
                    {day.hasPlanned && !day.hasCompleted && (
                      <div className="w-2 h-2 rounded-full bg-orange-500 mt-1" />
                    )}
                  </div>
                ))}
              </div>
              <div className="flex gap-4 mt-4 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                  <span className="text-gray-400">Completed</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-orange-500" />
                  <span className="text-gray-400">Planned</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Monthly Summary */}
          <Card variant="bordered" className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Monthly Summary</CardTitle>
              <CardDescription>Your training totals by month</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-left text-sm text-gray-400 border-b border-gray-800">
                      <th className="pb-2">Month</th>
                      <th className="pb-2">Workouts</th>
                      <th className="pb-2">Distance</th>
                      <th className="pb-2">Duration</th>
                      <th className="pb-2">Avg RPE</th>
                    </tr>
                  </thead>
                  <tbody>
                    {getMonthlyStats(workouts).map((month) => (
                      <tr key={month.month} className="border-b border-gray-800">
                        <td className="py-3 text-white">{month.month}</td>
                        <td className="py-3 text-gray-300">{month.workouts}</td>
                        <td className="py-3 text-gray-300">{month.distance.toFixed(1)} km</td>
                        <td className="py-3 text-gray-300">{Math.round(month.duration)} min</td>
                        <td className="py-3 text-gray-300">{month.avgRPE.toFixed(1)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

// Helper functions

function getWeeklyData(workouts: CompletedWorkout[]) {
  const weeks: Record<string, { distance: number; duration: number }> = {};

  workouts.forEach((w) => {
    const date = new Date(w.date);
    const weekStart = getWeekStart(date);
    const key = weekStart.toISOString().split('T')[0];

    if (!weeks[key]) {
      weeks[key] = { distance: 0, duration: 0 };
    }
    weeks[key].distance += w.distance;
    weeks[key].duration += w.duration;
  });

  return Object.entries(weeks)
    .sort(([a], [b]) => a.localeCompare(b))
    .slice(-8)
    .map(([date, data]) => ({
      week: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      ...data,
    }));
}

function getWeekStart(date: Date) {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  return new Date(d.setDate(diff));
}

function getTypeDistribution(workouts: CompletedWorkout[]) {
  const counts: Record<string, number> = {};

  workouts.forEach((w) => {
    counts[w.type] = (counts[w.type] || 0) + 1;
  });

  return Object.entries(counts).map(([type, value]) => ({
    name: WORKOUT_TYPE_INFO[type as keyof typeof WORKOUT_TYPE_INFO]?.label || type,
    value,
    color: WORKOUT_TYPE_INFO[type as keyof typeof WORKOUT_TYPE_INFO]?.color || '#6b7280',
  }));
}

function getZoneDistribution(workouts: CompletedWorkout[], zones: { zone: number; name: string; minHR: number; maxHR: number; color: string }[]) {
  const zoneCounts: Record<number, number> = {};

  workouts.forEach((w) => {
    if (w.avgHR) {
      const zone = zones.find((z) => w.avgHR! >= z.minHR && w.avgHR! <= z.maxHR);
      if (zone) {
        zoneCounts[zone.zone] = (zoneCounts[zone.zone] || 0) + 1;
      }
    }
  });

  return zones.map((z) => ({
    name: `Z${z.zone}`,
    workouts: zoneCounts[z.zone] || 0,
    color: z.color,
  }));
}

function getProgressData(workouts: CompletedWorkout[]) {
  return [...workouts]
    .filter((w) => w.type === 'easy' || w.type === 'long')
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(-20)
    .map((w) => ({
      date: new Date(w.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      pace: w.avgPace,
    }));
}

function getCalendarData(workouts: CompletedWorkout[], plan: TrainingPlan | null) {
  const today = new Date();
  const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
  const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);

  // Get the Monday before the first day of the month
  const startDate = new Date(firstDay);
  const dayOfWeek = startDate.getDay();
  startDate.setDate(startDate.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1));

  const days = [];
  const current = new Date(startDate);

  for (let i = 0; i < 42; i++) {
    const dateStr = current.toISOString().split('T')[0];
    const hasCompleted = workouts.some((w) => w.date === dateStr);
    const hasPlanned = false; // Could check against plan

    days.push({
      day: current.getDate(),
      isCurrentMonth: current.getMonth() === today.getMonth(),
      hasCompleted,
      hasPlanned,
    });

    current.setDate(current.getDate() + 1);
  }

  return days;
}

function getMonthlyStats(workouts: CompletedWorkout[]) {
  const months: Record<string, { workouts: number; distance: number; duration: number; totalRPE: number }> = {};

  workouts.forEach((w) => {
    const date = new Date(w.date);
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;

    if (!months[key]) {
      months[key] = { workouts: 0, distance: 0, duration: 0, totalRPE: 0 };
    }
    months[key].workouts += 1;
    months[key].distance += w.distance;
    months[key].duration += w.duration;
    months[key].totalRPE += w.rpe;
  });

  return Object.entries(months)
    .sort(([a], [b]) => b.localeCompare(a))
    .slice(0, 6)
    .map(([month, data]) => ({
      month: new Date(month + '-01').toLocaleDateString('en-US', { year: 'numeric', month: 'short' }),
      workouts: data.workouts,
      distance: data.distance,
      duration: data.duration,
      avgRPE: data.workouts > 0 ? data.totalRPE / data.workouts : 0,
    }));
}

function formatPaceForChart(secondsPerKm: number) {
  const minutes = Math.floor(secondsPerKm / 60);
  const seconds = Math.round(secondsPerKm % 60);
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

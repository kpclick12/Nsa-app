'use client';

import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import { calculateZonesFromMaxHR, calculateZonesFromLTHR } from '@/lib/calculations/zones';
import {
  calculatePaceZonesFromRace,
  parseTimeToSeconds,
  formatPaceRange,
  getDistanceLabel,
} from '@/lib/calculations/pace';
import { saveUserProfile, loadUserProfile } from '@/lib/storage';
import { HRZone, PaceZone, RaceDistance, UserProfile } from '@/types';

type CalculationMethod = 'maxHR' | 'lthr' | 'race';

export default function CalculatorPage() {
  const [method, setMethod] = useState<CalculationMethod>('maxHR');
  const [maxHR, setMaxHR] = useState('');
  const [lthr, setLthr] = useState('');
  const [raceDistance, setRaceDistance] = useState<RaceDistance>('5k');
  const [raceTime, setRaceTime] = useState('');
  const [zones, setZones] = useState<HRZone[]>([]);
  const [paceZones, setPaceZones] = useState<PaceZone[]>([]);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const profile = loadUserProfile();
    if (profile) {
      setZones(profile.zones);
      setPaceZones(profile.paceZones);
      if (profile.maxHR) {
        setMaxHR(profile.maxHR.toString());
        setMethod('maxHR');
      } else if (profile.lactateThresholdHR) {
        setLthr(profile.lactateThresholdHR.toString());
        setMethod('lthr');
      } else if (profile.recentRace) {
        setRaceDistance(profile.recentRace.distance);
        const mins = Math.floor(profile.recentRace.timeInSeconds / 60);
        const secs = profile.recentRace.timeInSeconds % 60;
        setRaceTime(`${mins}:${secs.toString().padStart(2, '0')}`);
        setMethod('race');
      }
    }
  }, []);

  const calculate = () => {
    let newZones: HRZone[] = [];
    let newPaceZones: PaceZone[] = [];
    let profile: UserProfile;

    if (method === 'maxHR' && maxHR) {
      const hr = parseInt(maxHR);
      newZones = calculateZonesFromMaxHR(hr);
      profile = {
        maxHR: hr,
        zones: newZones,
        paceZones: [],
      };
    } else if (method === 'lthr' && lthr) {
      const hr = parseInt(lthr);
      newZones = calculateZonesFromLTHR(hr);
      profile = {
        lactateThresholdHR: hr,
        zones: newZones,
        paceZones: [],
      };
    } else if (method === 'race' && raceTime) {
      const timeInSeconds = parseTimeToSeconds(raceTime);
      const raceResult = { distance: raceDistance, timeInSeconds };
      newPaceZones = calculatePaceZonesFromRace(raceResult);
      // Estimate max HR for zone calculation (rough estimate)
      const estimatedMaxHR = 185; // Use a default, user can refine with HR data
      newZones = calculateZonesFromMaxHR(estimatedMaxHR);
      profile = {
        recentRace: raceResult,
        zones: newZones,
        paceZones: newPaceZones,
      };
    } else {
      return;
    }

    setZones(newZones);
    setPaceZones(newPaceZones);
    saveUserProfile(profile);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const methodOptions = [
    { value: 'maxHR', label: 'Max Heart Rate' },
    { value: 'lthr', label: 'Lactate Threshold HR' },
    { value: 'race', label: 'Recent Race Time' },
  ];

  const distanceOptions = [
    { value: '5k', label: '5K' },
    { value: '10k', label: '10K' },
    { value: 'half', label: 'Half Marathon' },
  ];

  return (
    <div className="max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Training Zone Calculator</h1>
        <p className="text-gray-400">
          Calculate your personal heart rate and pace zones for training
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Form */}
        <Card variant="bordered">
          <CardHeader>
            <CardTitle>Calculate Your Zones</CardTitle>
            <CardDescription>Enter your data to calculate training zones</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Select
                label="Calculation Method"
                options={methodOptions}
                value={method}
                onChange={(e) => setMethod(e.target.value as CalculationMethod)}
              />

              {method === 'maxHR' && (
                <Input
                  label="Max Heart Rate (bpm)"
                  type="number"
                  placeholder="e.g., 185"
                  value={maxHR}
                  onChange={(e) => setMaxHR(e.target.value)}
                  helperText="Your maximum heart rate from a test or estimate"
                />
              )}

              {method === 'lthr' && (
                <Input
                  label="Lactate Threshold Heart Rate (bpm)"
                  type="number"
                  placeholder="e.g., 165"
                  value={lthr}
                  onChange={(e) => setLthr(e.target.value)}
                  helperText="Your heart rate at lactate threshold (~1 hour race pace)"
                />
              )}

              {method === 'race' && (
                <>
                  <Select
                    label="Race Distance"
                    options={distanceOptions}
                    value={raceDistance}
                    onChange={(e) => setRaceDistance(e.target.value as RaceDistance)}
                  />
                  <Input
                    label="Race Time"
                    placeholder="e.g., 25:30 or 1:45:00"
                    value={raceTime}
                    onChange={(e) => setRaceTime(e.target.value)}
                    helperText="Format: mm:ss for shorter races, h:mm:ss for longer"
                  />
                </>
              )}

              <Button onClick={calculate} className="w-full">
                Calculate Zones
              </Button>

              {saved && (
                <p className="text-green-400 text-sm text-center">
                  Zones saved successfully!
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Results */}
        <div className="space-y-6">
          {/* HR Zones */}
          {zones.length > 0 && (
            <Card variant="bordered">
              <CardHeader>
                <CardTitle>Heart Rate Zones</CardTitle>
                <CardDescription>Your training zones based on heart rate</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {zones.map((zone) => (
                    <div
                      key={zone.zone}
                      className="p-3 rounded-lg"
                      style={{ backgroundColor: `${zone.color}20` }}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <div
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: zone.color }}
                          />
                          <span className="font-medium text-white">
                            Zone {zone.zone}: {zone.name}
                          </span>
                        </div>
                        <span className="text-white font-mono">
                          {zone.minHR} - {zone.maxHR} bpm
                        </span>
                      </div>
                      <p className="text-sm text-gray-400 ml-5">{zone.description}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Pace Zones */}
          {paceZones.length > 0 && (
            <Card variant="bordered">
              <CardHeader>
                <CardTitle>Pace Zones</CardTitle>
                <CardDescription>
                  Based on your {getDistanceLabel(raceDistance)} time of {raceTime}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {paceZones.map((pace, index) => (
                    <div key={index} className="p-3 rounded-lg bg-gray-800">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium text-white">{pace.type}</span>
                        <span className="text-cyan-400 font-mono">
                          {formatPaceRange(pace.minPace, pace.maxPace)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-400">{pace.description}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {zones.length === 0 && (
            <Card variant="bordered">
              <CardContent>
                <div className="text-center py-8">
                  <p className="text-gray-400">
                    Enter your data and click &quot;Calculate Zones&quot; to see your training zones
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Info Section */}
      <Card variant="bordered" className="mt-6">
        <CardHeader>
          <CardTitle>About Training Zones</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <h4 className="font-medium text-white mb-2">Max Heart Rate</h4>
              <p className="text-gray-400">
                The highest your heart rate can go. Best measured through a max effort test.
                Can be estimated with formulas like 220 - age, but individual variation is high.
              </p>
            </div>
            <div>
              <h4 className="font-medium text-white mb-2">Lactate Threshold HR</h4>
              <p className="text-gray-400">
                Your heart rate at the point where lactate starts accumulating faster than it
                can be cleared. Typically around 85-90% of max HR. Key zone for Norwegian method.
              </p>
            </div>
            <div>
              <h4 className="font-medium text-white mb-2">Race Time Method</h4>
              <p className="text-gray-400">
                Uses your recent race performance to calculate training paces using VDOT
                methodology. More accurate for pace-based training.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

'use client';

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';

type Section = 'overview' | 'science' | 'structure' | 'mistakes' | 'tips';

export default function LearnPage() {
  const [activeSection, setActiveSection] = useState<Section>('overview');

  const sections: { id: Section; title: string }[] = [
    { id: 'overview', title: 'What is the Norwegian Method?' },
    { id: 'science', title: 'The Science Behind It' },
    { id: 'structure', title: 'How to Structure Training' },
    { id: 'mistakes', title: 'Common Mistakes' },
    { id: 'tips', title: 'Tips by Experience Level' },
  ];

  return (
    <div className="max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Learn the Norwegian Method</h1>
        <p className="text-gray-400">
          Understanding the training philosophy that has produced world-class endurance athletes
        </p>
      </div>

      {/* Navigation */}
      <div className="flex flex-wrap gap-2 mb-8">
        {sections.map((section) => (
          <button
            key={section.id}
            onClick={() => setActiveSection(section.id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeSection === section.id
                ? 'bg-cyan-600 text-gray-900'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {section.title}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="space-y-6">
        {activeSection === 'overview' && <OverviewSection />}
        {activeSection === 'science' && <ScienceSection />}
        {activeSection === 'structure' && <StructureSection />}
        {activeSection === 'mistakes' && <MistakesSection />}
        {activeSection === 'tips' && <TipsSection />}
      </div>
    </div>
  );
}

function OverviewSection() {
  return (
    <>
      <Card variant="bordered">
        <CardHeader>
          <CardTitle>What is the Norwegian Method?</CardTitle>
        </CardHeader>
        <CardContent className="prose prose max-w-none">
          <p className="text-gray-600 mb-4">
            The Norwegian Method, also known as the &quot;Double Threshold&quot; method, is a training
            approach that has gained popularity after the success of Norwegian distance runners
            like Jakob Ingebrigtsen. It emphasizes high training volume at low intensity,
            combined with specific threshold workouts.
          </p>

          <h4 className="text-gray-900 font-semibold mb-2">Key Principles</h4>
          <ul className="list-disc list-inside text-gray-600 space-y-2 mb-4">
            <li>
              <strong className="text-gray-900">High Volume, Low Intensity:</strong> The majority of
              training (80-90%) is done at easy, aerobic paces
            </li>
            <li>
              <strong className="text-gray-900">Threshold Focus:</strong> Quality sessions target
              the lactate threshold, not VO2max intervals
            </li>
            <li>
              <strong className="text-gray-900">Double Threshold Days:</strong> Some athletes perform
              two threshold sessions on the same day
            </li>
            <li>
              <strong className="text-gray-900">Lactate Monitoring:</strong> Training intensity is
              often guided by blood lactate measurements
            </li>
            <li>
              <strong className="text-gray-900">Consistency:</strong> Year-round training with
              gradual progression
            </li>
          </ul>

          <div className="p-4 rounded-lg bg-cyan-500/10 border border-cyan-500/30">
            <p className="text-cyan-300 text-sm">
              <strong>Note:</strong> While called the &quot;Norwegian&quot; method, these principles align
              with polarized training approaches used by many successful endurance athletes
              worldwide.
            </p>
          </div>
        </CardContent>
      </Card>

      <Card variant="bordered">
        <CardHeader>
          <CardTitle>The Training Pyramid</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="p-4 rounded-lg bg-red-500/20 border-l-4 border-red-500">
              <p className="font-medium text-gray-900">Zone 5: VO2max (5%)</p>
              <p className="text-sm text-gray-400">Hard intervals, race-specific work</p>
            </div>
            <div className="p-4 rounded-lg bg-orange-500/20 border-l-4 border-orange-500">
              <p className="font-medium text-gray-900">Zone 4: Threshold (10-15%)</p>
              <p className="text-sm text-gray-400">The key Norwegian method zone - lactate threshold work</p>
            </div>
            <div className="p-4 rounded-lg bg-yellow-500/20 border-l-4 border-yellow-500">
              <p className="font-medium text-gray-900">Zone 3: Tempo (Minimal)</p>
              <p className="text-sm text-gray-400">Often avoided - &quot;no man&apos;s land&quot;</p>
            </div>
            <div className="p-4 rounded-lg bg-blue-500/20 border-l-4 border-blue-500">
              <p className="font-medium text-gray-900">Zone 2: Easy Aerobic (75-80%)</p>
              <p className="text-sm text-gray-400">The foundation - builds aerobic capacity</p>
            </div>
            <div className="p-4 rounded-lg bg-green-500/20 border-l-4 border-green-500">
              <p className="font-medium text-gray-900">Zone 1: Recovery (5%)</p>
              <p className="text-sm text-gray-400">Active recovery between hard sessions</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
}

function ScienceSection() {
  return (
    <>
      <Card variant="bordered">
        <CardHeader>
          <CardTitle>The Science of Threshold Training</CardTitle>
        </CardHeader>
        <CardContent className="text-gray-600 space-y-4">
          <p>
            The lactate threshold represents the exercise intensity at which lactate begins to
            accumulate in the blood faster than it can be cleared. Training at this intensity
            improves your body&apos;s ability to:
          </p>

          <ul className="list-disc list-inside space-y-2">
            <li>Clear lactate more efficiently</li>
            <li>Produce less lactate at given intensities</li>
            <li>Maintain higher paces before fatigue sets in</li>
            <li>Improve fat oxidation and spare glycogen</li>
          </ul>

          <h4 className="text-gray-900 font-semibold mt-6 mb-2">Why Threshold Over VO2max?</h4>
          <p>
            While VO2max intervals are effective, they create significant fatigue and require
            longer recovery. Threshold sessions:
          </p>
          <ul className="list-disc list-inside space-y-2">
            <li>Allow higher weekly training volume</li>
            <li>Create less neuromuscular fatigue</li>
            <li>Can be performed more frequently</li>
            <li>Directly improve race-pace performance</li>
          </ul>
        </CardContent>
      </Card>

      <Card variant="bordered">
        <CardHeader>
          <CardTitle>Polarized vs Pyramidal Training</CardTitle>
        </CardHeader>
        <CardContent className="text-gray-600 space-y-4">
          <p>
            The Norwegian method falls under &quot;polarized training&quot; - where training is
            distributed between low and high intensities, with minimal time in the middle
            zone.
          </p>

          <div className="grid grid-cols-2 gap-4 mt-4">
            <div className="p-4 rounded-lg bg-gray-100">
              <h5 className="text-gray-900 font-medium mb-2">Polarized (Norwegian)</h5>
              <ul className="text-sm space-y-1">
                <li>80% easy</li>
                <li>15% threshold/hard</li>
                <li>5% race pace</li>
              </ul>
            </div>
            <div className="p-4 rounded-lg bg-gray-100">
              <h5 className="text-gray-900 font-medium mb-2">Traditional Pyramidal</h5>
              <ul className="text-sm space-y-1">
                <li>70% easy</li>
                <li>20% moderate</li>
                <li>10% hard</li>
              </ul>
            </div>
          </div>

          <p className="text-sm text-gray-400 mt-4">
            Research suggests polarized training may be more effective for well-trained
            athletes, though both approaches can work depending on the individual.
          </p>
        </CardContent>
      </Card>
    </>
  );
}

function StructureSection() {
  return (
    <>
      <Card variant="bordered">
        <CardHeader>
          <CardTitle>Structuring Your Training Week</CardTitle>
        </CardHeader>
        <CardContent className="text-gray-600 space-y-4">
          <p>
            A typical Norwegian-style training week includes 1-2 threshold sessions, with the
            remaining days dedicated to easy aerobic running and recovery.
          </p>

          <h4 className="text-gray-900 font-semibold mt-4 mb-2">Sample Week Structure</h4>
          <div className="space-y-2">
            <div className="flex justify-between p-3 rounded bg-gray-100">
              <span className="text-gray-900">Monday</span>
              <span className="text-blue-400">Easy Run (45-60 min)</span>
            </div>
            <div className="flex justify-between p-3 rounded bg-orange-500/20">
              <span className="text-gray-900">Tuesday</span>
              <span className="text-orange-400">Threshold Session (4x8 min)</span>
            </div>
            <div className="flex justify-between p-3 rounded bg-gray-100">
              <span className="text-gray-900">Wednesday</span>
              <span className="text-purple-400">Recovery Run (30 min)</span>
            </div>
            <div className="flex justify-between p-3 rounded bg-gray-100">
              <span className="text-gray-900">Thursday</span>
              <span className="text-blue-400">Easy Run (45-60 min)</span>
            </div>
            <div className="flex justify-between p-3 rounded bg-orange-500/20">
              <span className="text-gray-900">Friday</span>
              <span className="text-orange-400">Threshold Session (5x6 min)</span>
            </div>
            <div className="flex justify-between p-3 rounded bg-green-500/20">
              <span className="text-gray-900">Saturday</span>
              <span className="text-green-400">Long Run (90+ min)</span>
            </div>
            <div className="flex justify-between p-3 rounded bg-gray-100">
              <span className="text-gray-900">Sunday</span>
              <span className="text-gray-400">Rest or Easy Recovery</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card variant="bordered">
        <CardHeader>
          <CardTitle>Threshold Workout Formats</CardTitle>
        </CardHeader>
        <CardContent className="text-gray-600">
          <p className="mb-4">
            Common threshold workout structures used in Norwegian-style training:
          </p>

          <div className="space-y-4">
            <div className="p-4 rounded-lg bg-gray-100">
              <h5 className="text-gray-900 font-medium">4 x 8 minutes</h5>
              <p className="text-sm text-gray-400">
                Classic format. 2-3 min easy jog recovery. Total: 32 min at threshold.
              </p>
            </div>
            <div className="p-4 rounded-lg bg-gray-100">
              <h5 className="text-gray-900 font-medium">5 x 6 minutes</h5>
              <p className="text-sm text-gray-400">
                Slightly shorter intervals, good for building into longer sessions.
                2 min recovery. Total: 30 min at threshold.
              </p>
            </div>
            <div className="p-4 rounded-lg bg-gray-100">
              <h5 className="text-gray-900 font-medium">3 x 10 minutes</h5>
              <p className="text-sm text-gray-400">
                Longer intervals for experienced runners. 3-4 min recovery.
                Total: 30 min at threshold.
              </p>
            </div>
            <div className="p-4 rounded-lg bg-gray-100">
              <h5 className="text-gray-900 font-medium">2 x 15 minutes</h5>
              <p className="text-sm text-gray-400">
                Extended threshold blocks. 5 min recovery. Great for half marathon
                and marathon training.
              </p>
            </div>
          </div>

          <div className="mt-4 p-4 rounded-lg bg-cyan-500/10 border border-cyan-500/30">
            <p className="text-cyan-300 text-sm">
              <strong>Key:</strong> Threshold pace should feel &quot;comfortably hard&quot; - you can
              speak in short sentences but not hold a conversation. Heart rate around
              85-88% of max.
            </p>
          </div>
        </CardContent>
      </Card>
    </>
  );
}

function MistakesSection() {
  return (
    <Card variant="bordered">
      <CardHeader>
        <CardTitle>Common Mistakes to Avoid</CardTitle>
        <CardDescription>Learn from others&apos; errors</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/30">
          <h4 className="text-red-400 font-medium mb-2">1. Running Easy Days Too Fast</h4>
          <p className="text-gray-600 text-sm">
            The most common mistake. Easy runs should feel genuinely easy - you should be
            able to hold a full conversation. If your easy pace feels moderate, slow down.
            The aerobic benefits come from time on feet, not from running faster.
          </p>
        </div>

        <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/30">
          <h4 className="text-red-400 font-medium mb-2">2. Starting Threshold Too Fast</h4>
          <p className="text-gray-600 text-sm">
            Threshold sessions should have even or negative splits. Starting too fast leads
            to fading in later intervals and accumulating more fatigue without additional
            benefit. Start conservatively and build into the session.
          </p>
        </div>

        <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/30">
          <h4 className="text-red-400 font-medium mb-2">3. Too Much Volume Too Soon</h4>
          <p className="text-gray-600 text-sm">
            Norwegian elites have built their aerobic base over many years. Jumping straight
            to high volume risks injury and burnout. Increase weekly mileage by no more than
            10% per week, and include down weeks.
          </p>
        </div>

        <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/30">
          <h4 className="text-red-400 font-medium mb-2">4. Neglecting Recovery</h4>
          <p className="text-gray-600 text-sm">
            High volume training requires serious attention to recovery: sleep, nutrition,
            and easy days. Don&apos;t add extra intensity or skip rest days. Recovery is where
            adaptation happens.
          </p>
        </div>

        <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/30">
          <h4 className="text-red-400 font-medium mb-2">5. Copying Elite Programs Exactly</h4>
          <p className="text-gray-600 text-sm">
            Elite runners have years of base training and can handle workloads that would
            break most recreational runners. Adapt the principles to your fitness level,
            available time, and recovery capacity.
          </p>
        </div>

        <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/30">
          <h4 className="text-red-400 font-medium mb-2">6. Ignoring Life Stress</h4>
          <p className="text-gray-600 text-sm">
            Work stress, poor sleep, and life demands all affect your recovery capacity.
            On high-stress weeks, reduce training load. The Norwegian athletes treat training
            as their job - most of us need to balance it with other responsibilities.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

function TipsSection() {
  return (
    <>
      <Card variant="bordered">
        <CardHeader>
          <CardTitle>For Beginners</CardTitle>
          <CardDescription>New to structured training</CardDescription>
        </CardHeader>
        <CardContent className="text-gray-600 space-y-4">
          <ul className="space-y-3">
            <li className="flex gap-3">
              <span className="text-cyan-400">1.</span>
              <span>
                <strong className="text-gray-900">Build Base First:</strong> Spend 2-3 months
                building easy aerobic running before adding threshold work. Aim for
                consistent, easy running 4-5 days per week.
              </span>
            </li>
            <li className="flex gap-3">
              <span className="text-cyan-400">2.</span>
              <span>
                <strong className="text-gray-900">Start with One Threshold Session:</strong> Once
                you have a base, add one threshold session per week. Start with shorter
                intervals (5x5 min or 4x6 min).
              </span>
            </li>
            <li className="flex gap-3">
              <span className="text-cyan-400">3.</span>
              <span>
                <strong className="text-gray-900">Use Heart Rate:</strong> If you don&apos;t know your
                threshold pace, use heart rate (85-88% of max) to guide intensity.
              </span>
            </li>
            <li className="flex gap-3">
              <span className="text-cyan-400">4.</span>
              <span>
                <strong className="text-gray-900">Prioritize Consistency:</strong> It&apos;s better to
                run 30 minutes easy 5 days a week than to do two long hard runs and burn out.
              </span>
            </li>
          </ul>
        </CardContent>
      </Card>

      <Card variant="bordered">
        <CardHeader>
          <CardTitle>For Intermediate Runners</CardTitle>
          <CardDescription>1-3 years of structured training</CardDescription>
        </CardHeader>
        <CardContent className="text-gray-600 space-y-4">
          <ul className="space-y-3">
            <li className="flex gap-3">
              <span className="text-cyan-400">1.</span>
              <span>
                <strong className="text-gray-900">Add a Second Threshold Day:</strong> Once
                comfortable with one threshold session, consider adding a second. Keep them
                separated by at least 2-3 days.
              </span>
            </li>
            <li className="flex gap-3">
              <span className="text-cyan-400">2.</span>
              <span>
                <strong className="text-gray-900">Progress Interval Duration:</strong> Gradually
                increase from shorter intervals (5-6 min) to longer ones (8-10 min) as
                fitness improves.
              </span>
            </li>
            <li className="flex gap-3">
              <span className="text-cyan-400">3.</span>
              <span>
                <strong className="text-gray-900">Consider a Long Run:</strong> Add a weekly long
                run of 90+ minutes at easy pace to build aerobic endurance.
              </span>
            </li>
            <li className="flex gap-3">
              <span className="text-cyan-400">4.</span>
              <span>
                <strong className="text-gray-900">Track Your Data:</strong> Monitor pace, heart
                rate, and RPE to see how threshold pace improves over time.
              </span>
            </li>
          </ul>
        </CardContent>
      </Card>

      <Card variant="bordered">
        <CardHeader>
          <CardTitle>For Experienced Runners</CardTitle>
          <CardDescription>3+ years of training, competitive goals</CardDescription>
        </CardHeader>
        <CardContent className="text-gray-600 space-y-4">
          <ul className="space-y-3">
            <li className="flex gap-3">
              <span className="text-cyan-400">1.</span>
              <span>
                <strong className="text-gray-900">Experiment with Double Days:</strong> Some
                experienced runners benefit from running twice a day - an easy morning run
                and the main session in the afternoon.
              </span>
            </li>
            <li className="flex gap-3">
              <span className="text-cyan-400">2.</span>
              <span>
                <strong className="text-gray-900">Extended Threshold Blocks:</strong> Try longer
                intervals like 3x12 min or 2x20 min for race-specific preparation.
              </span>
            </li>
            <li className="flex gap-3">
              <span className="text-cyan-400">3.</span>
              <span>
                <strong className="text-gray-900">Consider Lactate Testing:</strong> Blood lactate
                testing can help dial in your exact threshold and track improvements.
              </span>
            </li>
            <li className="flex gap-3">
              <span className="text-cyan-400">4.</span>
              <span>
                <strong className="text-gray-900">Periodization:</strong> Plan your training in
                blocks - base building, threshold focus, race-specific, and taper phases.
              </span>
            </li>
            <li className="flex gap-3">
              <span className="text-cyan-400">5.</span>
              <span>
                <strong className="text-gray-900">Recovery Investment:</strong> At higher volumes,
                invest in recovery: sleep optimization, nutrition timing, massage, and
                planned easy weeks.
              </span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </>
  );
}

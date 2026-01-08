# NSA-APP

## Description

A desktop web app for planning and tracking training using the Norwegian single method - a popular running training approach focused on high-volume, low-intensity training with structured threshold sessions.

**Target Audience:** All levels of runners (beginners to experienced)

---

## Core Features

### 1. Training Zone Calculator

Users can calculate their personal training zones and recommended starting paces based on:

- Recent race time (5K, 10K, half marathon)
- Max heart rate
- Lactate threshold (from a lab or field test)

The app will output:
- Heart rate zones (Zone 1-5)
- Pace zones for different workout types
- Recommended starting paces for threshold sessions

### 2. Training Plan Generator

- Generates a suggested **8-week training plan** based on user's fitness level and goals
- Users can **modify** the suggested plan (adjust workouts, swap days, change intensity)
- Plan follows the Norwegian single method principles (high volume easy running + threshold work)

**Plan Templates:**
- 5K focus
- 10K focus
- Half marathon focus
- General fitness / base building

**Predefined Threshold Workouts:**
- 4x8 min at threshold
- 5x6 min at threshold
- 3x10 min at threshold
- 6x5 min at threshold
- 2x15 min at threshold

### 3. Workout Tracking

Users can log the following data per workout:

- Distance
- Duration
- Average heart rate
- Pace
- Perceived effort (RPE 1-10)
- Notes/comments

### 4. Visualizations

- **Calendar view:** Planned workouts vs completed workouts
- **Progress charts:** Performance trends over time
- **Heart rate zone distribution:** Time spent in each zone
- **Volume summaries:** Weekly and monthly training load

### 5. Educational Content

A separate section explaining:

- What is the Norwegian single method?
- The science behind it
- How to structure training blocks
- Common mistakes to avoid
- Tips for different experience levels

---

## Technical Specification

### Tech Stack (Recommended)

- **Framework:** Next.js (React)
- **Styling:** Tailwind CSS
- **Charts:** Recharts
- **Data Storage:** Local storage (browser) for MVP

### Platform

- Desktop-focused (responsive but optimized for larger screens)
- Online only (no offline support for MVP)

### Units

- Metric only (kilometers, km/h, etc.)

---

## Future Considerations (Not in MVP)

- User accounts and cloud sync
- Integration with Strava/Garmin
- Offline support
- Mobile-optimized version
- Export training data (CSV, PDF)

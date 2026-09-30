# Implementation Plan: Enrolled Target Learning Roadmaps & Progress Tracking

## Overview
Enable users to select and enroll in a specific target job title's learning roadmap as their active **Learning Path** (e.g., Data Scientist, Cloud Architect, Full Stack Developer). As users mark milestones complete, their progress is permanently saved to their profile vault in `localStorage`. Progress and a quick "Continue Roadmap" shortcut are prominently displayed both in the **Account Profile Modal** and via a **Quick-Resume Banner on the Homepage**.

---

## 1. User Experience & Flows

### A. Enrolling in a Roadmap as an Active Learning Path
- In **Learning Roadmaps (`RoadmapSection`)**:
  - Add a primary action button at the top of each roadmap: **"Set as My Active Learning Path"** (or an active **"Current Learning Path"** badge with checkmark if already enrolled).
  - Users can switch their active path at any time to explore and commit to a new career direction.

### B. Milestone Checkpoint Completion
- Milestones feature an interactive checkbox / status badge (**Completed** vs **Mark as Complete**).
- Toggling a milestone updates the user profile's `completedRoadmapMilestones` in browser `localStorage`.
- Visual progress bar dynamically recalculates (`X of Y milestones completed · Z%`).

### C. Homepage Quick-Resume Banner
- When a user has an active learning path enrolled, a sleek, motivating card appears above the main tools grid:
  - Role title (e.g., *Data Scientist Roadmap*)
  - Progress bar with percentage and milestones count
  - Next upcoming milestone title (e.g., *Next up: Step 2 — Programming (Python, Pandas, SQL)*)
  - **"Continue Learning Path"** button that directly opens the roadmap to the exact role and scroll position.

### D. Account Profile & Vault Display
- In **Account & Career Vault (`AccountModal`)**:
  - Add a dedicated **"Active Learning Path & Roadmap Progress"** card.
  - Displays enrolled role, visual gradient progress bar, milestone indicators, date enrolled, and a **"Resume Roadmap"** action.
  - Option to switch to another role or clear the active enrollment.

---

## 2. Technical Architecture & File Changes

### Data Model Updates (`src/components/AccountModal.tsx` & `src/App.tsx`)
Update `UserProfile` interface:
```typescript
export interface UserProfile {
  id: string;
  name: string;
  email: string;
  title: string;
  experienceYears: number;
  resumeFileName?: string;
  resumeText?: string;
  savedSkills: Array<{ name: string; level: 'Beginner' | 'Intermediate' | 'Advanced' }>;
  enrolledRoadmapRole?: string;       // e.g. "Data Scientist"
  enrolledRoadmapDate?: string;       // e.g. "2026-09-30"
  completedRoadmapMilestones: string[]; // e.g. ["Data Scientist-0", "Data Scientist-1"]
  quizScores: Array<{ quizId: string; title: string; score: number; total: number; date: string }>;
}
```

### Component Updates

1. **`src/components/RoadmapSection.tsx`**:
   - Add `enrolledRole?: string` and `onEnrollRole?: (role: string) => void` props.
   - Render the **"Enroll as Active Learning Path"** header toggle.
   - Ensure milestones support completion toggling and persist under `${role}-${index}` milestone keys.
   - Show overall roadmap completion percentage banner.

2. **`src/components/AccountModal.tsx`**:
   - Render an **Active Learning Path & Roadmap Tracker** card.
   - Calculate total milestones from `JOB_DIRECTORY_DATA` for the enrolled role.
   - Show progress bar, next milestone prompt, and **"Resume Roadmap"** button.

3. **`src/App.tsx`**:
   - Add Homepage **Quick-Resume Roadmap Banner** shown when `currentProfile.enrolledRoadmapRole` is active.
   - Wire `handleEnrollRoadmap(role)` to update `currentProfile.enrolledRoadmapRole` and persist to `localStorage`.
   - Wire `handleToggleMilestone(milestoneKey)` to toggle milestone completion.
   - Pass enrollment handlers to `RoadmapSection` and `AccountModal`.

---

## 3. Verification & Testing Plan
- Test enrolling in a roadmap from `RoadmapSection` (e.g. Data Scientist).
- Verify the active badge changes to "Current Learning Path".
- Check off Step 1 and Step 2 milestones; confirm progress updates to 66%.
- Return to Homepage; verify the "Continue Your Learning Path" banner is displayed with 66% progress and "Step 3" as next up.
- Open Account Profile modal; verify the Active Learning Path card reflects 66% completion and allows 1-click resumption.
- Test profile switching: verify each profile retains its own independent enrolled roadmap and milestone completion state.
- Run `compile_applet` and `lint_applet` to ensure zero compilation or type errors.

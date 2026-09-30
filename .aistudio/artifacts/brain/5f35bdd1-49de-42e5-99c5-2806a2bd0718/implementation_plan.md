# Implementation Plan: Job-Fit-Scorer Enhancements & New Features

Comprehensive architectural roadmap to implement the 7 requested capabilities into Job-Fit-Scorer: Resume upload cancel control, top-bar Home navigation, unified Model Comparison and Skill Gap analysis, skill proficiency levels (Beginner vs. Expert), visual learning roadmaps, interactive skill MCQ practice quizzes, and an interactive CV builder with live preview and PDF export.

---

## 1. Executive Summary & Scope

The objective of this upgrade is to transform **Job-Fit-Scorer** from an initial matching tool into a complete career acceleration suite:
1. **Upload Resume Cancel Control**: Give users a one-click cancel/clear button when uploading or viewing a parsed resume to quickly reset without reloading.
2. **Top-Bar Home Navigation**: A persistent, accessible Home button in the header alongside brand identity, allowing seamless navigation back to the primary match dashboard from any sub-view.
3. **Unified Model Comparison & Skill Gap**: Combine lexical TF-IDF score breakdown, semantic transformer similarity, and role skill gaps (matching vs. missing chips) into a single unified role evaluation card.
4. **Skill Proficiency Levels (Beginner / Intermediate / Expert)**: Tag all skill requirements with clear expected proficiency tiers so users understand the depth expected by employers.
5. **Interactive Learning Roadmap**: Visual milestone-based learning paths (Foundations $\rightarrow$ Frameworks $\rightarrow$ Applied Projects $\rightarrow$ Interview/Certification) with weekly estimations, key topics, and curated links for target roles and missing skills.
6. **Skill MCQ Practice Quizzes**: 5-question interactive multiple-choice quizzes with instant feedback, scoring, and in-depth explanations for major technical skills (Python, SQL, Machine Learning, Cloud/DevOps, Data Visualization, etc.).
7. **Build CV / Resume Generator**: Interactive resume builder with live side-by-side preview, personal details, education, experience, skill levels, and one-click PDF export using browser print styles and print-ready markup.

---

## 2. Domain-Specific Design & Typographic System

Following the `frontend-design` constitution and SaaS dashboard principles:

### A. Layout & Navigation Hierarchy
* **Header / Top Bar**: 
  * Left: Brand logo with 🎯 icon, app title, and a distinct **Home** button (`Home` icon + text, active state indicator).
  * Center: Main view tabs (`Scorer & Match`, `Career Directory`, `Skill Quizzes`, `Learning Roadmap`, `Build CV`).
  * Right: Dark/Light mode toggle, quick stats, and GitHub link.
* **Anti-Slop Discipline**:
  * No gratuitous pill capsules for static text metadata. Metadata items like skill levels and categories use clean typographic styling, subtle badges, and monospace numeric tables.
  * Tabular figures (`tabular-nums`) for match percentages, quiz scores, and salary numbers.
  * Single-elevation cards with clean 1px borders (`border-neutral-200 dark:border-neutral-800`), avoiding nested card sandwiches.

### B. Color & Semantic Design Tokens
* **Base Theme**: Clean light background (`bg-slate-50 dark:bg-slate-950`) with high-contrast text (`text-slate-900 dark:text-slate-100`).
* **Proficiency Levels**:
  * `Beginner`: Soft emerald accent (`text-emerald-700 bg-emerald-50 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800/40`).
  * `Intermediate`: Blue accent (`text-blue-700 bg-blue-50 dark:bg-blue-950/40 dark:text-blue-300 border border-blue-200/60 dark:border-blue-800/40`).
  * `Expert`: Violet/Purple accent (`text-purple-700 bg-purple-50 dark:bg-purple-950/40 dark:text-purple-300 border border-purple-200/60 dark:border-purple-800/40`).
* **Model Comparison Colors**:
  * Semantic Model: Emerald / Teal score bars.
  * TF-IDF Baseline: Indigo / Slate score bars.

---

## 3. Core Functional Architectures & Data Models

### A. Skill Taxonomy with Proficiency Levels
Enhance the existing taxonomy in `src/jobsData.ts` to include skill difficulty tiers:
```typescript
export type SkillLevel = 'Beginner' | 'Intermediate' | 'Expert';

export interface RequiredSkillDetail {
  name: string;
  level: SkillLevel;
  category: 'Core' | 'Framework' | 'Data' | 'Cloud' | 'Tooling';
  importance: 'Essential' | 'Preferred';
}
```

### B. Unified Comparison & Skill Gap Component
Create a cohesive card layout replacing separated tabs:
* **Header**: Role Title, Experience Level, Average Salary, Overall Match Ring.
* **Dual-Model Breakdown**:
  * Semantic Context Match % (all-MiniLM-L6-v2) with progress bar.
  * Lexical Baseline Match % (TF-IDF) with progress bar.
* **Skills Evaluation**:
  * Matching Skills: Displayed with green checkmark icons and student's proficiency level.
  * Missing Skills (Gaps): Displayed with target required level (`Expert`, `Intermediate`, `Beginner`) and a quick button: **"Add to Roadmap"** or **"Take Quiz"**.

### C. Learning Roadmap Architecture
* Step-by-step phases for each role in `src/roadmapData.ts`:
  1. **Phase 1: Fundamentals & Prerequisites** (Weeks 1–4)
  2. **Phase 2: Core Engineering & Frameworks** (Weeks 5–8)
  3. **Phase 3: Applied Projects & Domain Mastery** (Weeks 9–12)
  4. **Phase 4: Interview & Production Readiness** (Weeks 13–16)
* Each phase includes milestone checklists, key concepts, recommended documentation/tutorials, and estimated completion hours.

### D. Skill MCQ Quiz Engine
Data structure in `src/quizData.ts`:
```typescript
export interface QuizQuestion {
  id: string;
  skill: string;
  roleTarget?: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Expert';
}
```
* **Interactive Features**: 5 questions per session, instant correct/incorrect feedback with thorough explanation cards, review mode, and ability to retry.

### E. Build CV / Resume Builder Architecture
* **Builder State**:
  * Personal Info (Full Name, Email, Phone, Location, GitHub/LinkedIn, Portfolio).
  * Professional Summary / Objective.
  * Work & Internship Experience (Company, Role, Dates, Bullet points).
  * Education (Degree, University, Graduation Year, GPA).
  * Skills (Auto-populated from parsed resume or manually picked, tagged by level).
  * Featured Projects (Title, Description, Tech Stack, Link).
* **Live Side-by-Side Preview**: Standard clean ATS-friendly typography.
* **Print/PDF Export**: Dedicated `@media print` CSS and window print trigger for high-fidelity vector PDF generation.

---

## 4. Work Breakdown Structure (Phased Tasks)

### Phase 1: Navigation, Home Button & Resume Upload Cancel
- Add `Home` button to top navigation bar with clear active state and reset action.
- Update `ResumeUploader` component with an explicit **"Cancel / Clear Resume"** button that resets file state, clears extracted text, and restores manual selection view.

### Phase 2: Unified Model Comparison & Skill Gap Card with Levels
- Enrich job descriptions with structured skill details and required levels (`Beginner`, `Intermediate`, `Expert`).
- Consolidate model score breakdown and skill gap breakdown into a unified, high-density card component in `src/components/UnifiedRoleCard.tsx`.
- Include side-by-side semantic vs. lexical bars and interactive gap chips.

### Phase 3: Visual Learning Roadmap Module
- Implement `src/components/RoadmapView.tsx` with interactive role picker, milestone timeline, duration estimates, and resource links.
- Connect "Add to Roadmap" buttons from skill gap analysis to filter or highlight relevant learning milestones.

### Phase 4: Skill MCQ Practice Quiz Module
- Create `src/components/SkillQuizView.tsx` with role/skill selector, 5-question test flow, option selection, immediate rationale display, and score summary card.
- Link "Take Quiz" buttons directly from missing skills in the gap analysis.

### Phase 5: Interactive Build CV / Resume Generator
- Create `src/components/CvBuilderView.tsx` featuring a 2-column layout:
  - Left: Structured input form (Personal details, Summary, Experience, Education, Projects, Skills with levels).
  - Right: Real-time ATS-compatible live resume preview.
- Add "Export PDF" button utilizing print-specific stylesheet rules for perfect page breaks and PDF downloads.

### Phase 6: Testing & Verification
- Compile and test with `compile_applet` and `lint_applet`.
- Verify seamless tab switching, responsive mobile layouts, and dark mode consistency across all new views.

---

## 5. Verification & Acceptance Criteria

1. **Upload Resume Cancel**: Selecting a file displays a red/gray "Cancel / Clear File" button that instantly wipes the file input and extracted resume state.
2. **Top Bar Home Button**: Clicking "Home" from any tab immediately returns to the primary Match & Scorer dashboard.
3. **Unified View**: Role results display both model scores (TF-IDF vs Semantic) and skill gaps (matching vs missing) on a single unified card without switching tabs.
4. **Skill Levels**: Skills visibly show expected proficiency levels (e.g. `Python [Expert]`, `Docker [Intermediate]`).
5. **Roadmap**: Selecting any role renders a 4-phase chronological roadmap with milestones, timeframes, and learning resources.
6. **MCQ Quiz**: Taking a 5-question quiz allows picking answers, shows instant green/red status, provides clear explanations, and displays a final score.
7. **Build CV**: Editing fields updates the live preview immediately; clicking "Export to PDF" triggers a clean print dialog without navigation clutter.

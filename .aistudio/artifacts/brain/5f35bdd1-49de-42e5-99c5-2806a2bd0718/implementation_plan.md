# Comprehensive Platform Upgrade & Polish Plan

A major architectural and user experience overhaul across 14 functional areas, introducing categorized navigation, instant local accounts with saved resumes, expanded 10-question technical quizzes, direct Word and PDF downloads, and refined dark/light themes.

---

## User Review & Critical Decisions

> [!IMPORTANT]
> The following decisions were confirmed by the user in Phase 1:
> - **Account & Resume Storage**: Instant local account with profile management and browser-persisted resumes, saved roadmaps, and quiz history (no mandatory external sign-in wall).
> - **Navigation Header**: Replace the crowded 12-button header row with a single sleek **Career Tools** dropdown menu organized by category (Assessment, Preparation, Documents, Tracking).
> - **Skill Proficiency**: Interactive clickable chips directly on each selected skill for **Beginner**, **Intermediate**, and **Advanced** levels.
> - **Tool Pruning**: Completely remove the legacy "Resume Rewriter" feature across all navigation, cards, and state routers.

---

## 1. Overview & Core Concept

This release transforms the Job-Fit Scorer into an integrated, production-grade career platform. Users can maintain an ongoing profile, test their skills across 10 in-depth quizzes with personalized roadmap recommendations, prepare for interviews across all job categories, calculate market compensation in both INR (Lakhs) and USD, and build and export ATS-friendly resumes and cover letters in 1-click Word (`.docx`) and PDF (`.pdf`) formats.

---

## 2. User Experience & Visual Design

### Visual Identity & Theme Polish (Rule 14 & Rule 2)
- **Light Theme**: Pure clean neutral canvas (`bg-neutral-50`), crisp 1px borders (`border-neutral-200/80`), deep slate typography (`text-neutral-900`), and selective indigo/blue accents (`#2563EB`). No muddy gray shadows or excessive pill capsules.
- **Dark Theme**: Deep slate/charcoal backdrop (`bg-neutral-950`), elevated surfaces (`bg-neutral-900`), subtle borders (`border-neutral-800`), high-legibility optical compensation (`text-neutral-100`), and emerald/amber/blue functional state highlights.
- **Header Top-Bar Contract**:
  - **Zone 1 (Brand)**: Single wordmark: **JobFit Studio** with subtle status dot.
  - **Zone 2 (Navigation)**: Streamlined nav links (`Job Matches`, `Roadmaps`, `Quizzes`, `Account`) plus the new **Career Tools** categorized dropdown.
  - **Zone 3 (Actions)**: Quick profile avatar / switch button, Theme toggle (Light/Dark), and primary action.

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│  JobFit Studio      Job Matches   Roadmaps   Quizzes   [Career Tools ▾]    [Alex J. 👤] ☼ │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

### The New Career Tools Dropdown
Grouped into 4 intuitive categories with icon, title, and plain-English tag:
1. **Match & Assess**: Job Matcher, Work Culture Fit, Profile Auditor (GitHub & LinkedIn)
2. **Interview & Practice**: Interview Prep (All Roles), Skill Quizzes (10 Questions)
3. **Application Documents**: Resume Builder (Word & PDF), Cover Letter Writer (Word & PDF)
4. **Pipeline & Hiring**: Application Tracker, Candidate Ranker

---

## 3. Detailed Specifications for All 14 Enhancements

### 1. Context-Aware Back Navigation
- Track `navigationSource` (e.g. `'job-results'`, `'home'`, `'tools'`) in top-level state.
- When a user enters Resume Builder from a specific job match card (`onBuildCV(role, skills)`), clicking Cancel / Exit returns directly to `'results'` with active filter and scroll position preserved, rather than dumping to the home dropzone.

### 2. Dark & Light Theme Refinement
- Audit all 12 component views for unified theme tokens (`neutral-50` to `neutral-950`).
- Ensure WCAG AA contrast compliance across all text and border dividers.
- Remove redundant saturated pill badges in favor of quiet typography and subtle hairline separators.

### 3. Manual Skill Picker with Proficiency Levels
- Interactive search and category filters (Frontend, Backend, Data, Cloud, Tools).
- When a skill is selected, display three clickable proficiency chips directly on the skill tag:
  - `[● Beg]` `[● Int]` `[● Adv]`
- Selection dynamically adjusts weighted matching: Advanced gives full proficiency weight, Intermediate matches 80%, Beginner matches 50%, reflecting realistic job readiness.

### 4. Expanded 10-Question Quizzes & Roadmap Recommendations
- Expand every quiz to **10 questions** per session.
- Expand topics from 5 to **10 comprehensive subjects**:
  1. Python Programming & Data Structures
  2. SQL, Databases & Query Optimization
  3. Frontend Engineering (React, TypeScript & Modern DOM)
  4. Cloud Architecture & DevOps (AWS, GCP, CI/CD)
  5. Data Science & Exploratory Analysis
  6. Machine Learning & Predictive Modeling
  7. System Design & Distributed Architecture
  8. Cybersecurity & Secure Coding Best Practices
  9. Docker, Containers & Kubernetes
  10. Modern JavaScript & Web APIs
- **Adaptive Roadmap Bridge**: After quiz completion, analyze incorrect topics and display a direct card: *"Strengthen Your Weak Areas"* linking straight to the relevant Roadmap milestone with recommended free tutorials.

### 5. Remove Resume Rewriter
- Remove all references, routes, components, and cards for "Google X-Y-Z Bullet Point Rewriter" from `App.tsx` and subcomponents.

### 6. Profile Auditor: Interactive GitHub Repository Inspector
- Fix the GitHub auditor to support entering a GitHub username or repository.
- Provide a simulated live audit analyzing:
  - Repository structure & README documentation quality
  - Git commit cadence and branch hygiene
  - Test coverage & CI/CD workflow files
  - Licensing and dependency freshness
- Actionable score with recruiter-facing checklist.

### 7. Interview Prep for All Roles
- Expand target role selector from 2 roles to **all 10 roles** available in the job directory:
  - Data Scientist, Software Engineer, Frontend Engineer, Backend Engineer, Full-Stack Developer, DevOps / SRE, Cloud Architect, Data Engineer, Machine Learning Engineer, Cybersecurity Analyst.
- Add deep question banks for each role spanning Technical Concept, System Architecture, Coding Challenge, and Behavioral STAR questions.

### 8. 1-Click Direct Download for Word & PDF (Resume Builder)
- Fix Word export (`docx`) so it triggers direct file download with zero print dialog interference.
- Fix PDF export (`jspdf` + `html2canvas`) with clean 1-click direct download, keeping the separate printer icon strictly for users who want browser-native printing.

### 9. Work Culture Fit Overhaul
- Rewrite culture questions into intuitive, scenario-based dilemmas:
  - Team collaboration style (Async vs. Pairing vs. Independent)
  - Pace and release frequency (Continuous shipping vs. High-rigor stable cycles)
  - Structure and governance (Autonomy & agility vs. Clear hierarchies & SOPs)
  - Risk tolerance (Failing fast vs. Zero-defect tolerance)
- Clear archetype radar breakdown: **Startup Agility**, **Big Tech Scale**, **Agency Variety**, **Enterprise Stability**, **Open-Source Distributed**.

### 10. Instant Local Account & Resume Vault
- Header profile badge with switcher (`Default Profile`, `Create New Profile`).
- Automatically persist to `localStorage`:
  - Active profile details (Name, Target Title, Contact info)
  - Parsed or manually selected skills with levels
  - Uploaded resume text and parsed document cache
  - Quiz history and scores
  - Learning roadmap completed milestones
  - Application tracker entries
- "Change Resume / Upload New" button allowing users to swap files or profiles without losing their work.

### 11. Salary Calculator: Regional Expansion & Currency Switcher
- Expand locations:
  - **India**: Bangalore, Hyderabad, Pune, Mumbai, Delhi-NCR, Chennai
  - **Global**: United States (SF/NYC), United States (Tier 2/Remote), United Kingdom (London), Germany (Berlin), Canada (Toronto), Singapore, Global Remote
- **Live Currency Converter**:
  - Toggle between **INR (₹ Lakhs & Crores)**, **USD ($)**, **EUR (€)**, and **GBP (£)**.
  - Automatic calculation with current benchmark rates (e.g. ₹1 Lakh = ₹100,000; real-time rate conversion).

### 12. Cover Letter Writer: Multi-Format Export
- Generate company-specific and role-tailored cover letters.
- Add 1-click **Download Word (.docx)** and **Download PDF (.pdf)**, plus **Copy to Clipboard**.

### 13. Application Tracker & Candidate Ranker Polish
- **Application Tracker**: Status columns (Wishlist, Applied, Interviewing, Offer, Rejected), interview dates, notes, and salary offer comparison.
- **Candidate Ranker**: Clean table sorting, side-by-side gap analysis, and batch export.

### 14. Header Restructure
- Remove the cluttered 12-button horizontal bar completely.
- Introduce the new unified **Career Tools** dropdown menu.

---

## 4. Technical Architecture & Component Hierarchy

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                                   App.tsx                                   │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │                            Global Header                              │  │
│  │   Brand  ·  Job Matches  ·  Roadmaps  ·  Quizzes  ·  [Career Tools ▾] │  │
│  │   [Account / Profile Vault 👤]  ·  [Theme ☼]                          │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
│                                      │                                      │
│                ┌─────────────────────┴──────────────────────┐               │
│                ▼                                            ▼               │
│      ┌──────────────────┐                         ┌──────────────────┐      │
│      │   Active Views   │                         │  Profile Store   │      │
│      │  (Job Matches /  │                         │  (localStorage)  │      │
│      │  Quizzes / Tools)│                         │  - Resumes       │      │
│      └──────────────────┘                         │  - Quiz scores   │      │
│                │                                  │  - Saved jobs    │      │
│                ▼                                  │  - Roadmaps      │      │
│      ┌─────────────────────────────────────────┐  └──────────────────┘      │
│      │ Direct Exporters (docx / jspdf)         │                            │
│      │ - Resume Builder (.docx & .pdf)         │                            │
│      │ - Cover Letter Writer (.docx & .pdf)    │                            │
│      └─────────────────────────────────────────┘                            │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 5. Verification Plan

1. **Compilation & Linting**: Run `compile_applet` and `lint_applet` to ensure zero TypeScript errors or missing imports.
2. **Back Navigation**: Verify opening Resume Builder from a job match and exiting returns to the results view.
3. **Word & PDF Downloads**: Verify clicking Word in Resume Builder and Cover Letter downloads clean `.docx` without triggering browser print.
4. **Quizzes & Recommendations**: Take a 10-question quiz, verify completion screen displays weaknesses and direct roadmap jump.
5. **Proficiency Levels**: Select a skill in manual picker, toggle Beginner/Intermediate/Advanced, verify score recalculation.
6. **Currency Converter**: Change location to Bangalore, toggle ₹ INR and $ USD, verify accurate conversions.
7. **Local Account Vault**: Save details, refresh page, verify profile and resume remain loaded.

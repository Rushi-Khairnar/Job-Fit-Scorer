# Resume Diagnostics & ATS Suite (10 Advanced Career Tools)

A specialized intelligence suite designed to simulate real-world Applicant Tracking Systems (ATS), eliminate resume red flags, automatically tailor applications to specific job descriptions, import external LinkedIn data, and conduct interactive mock interviews tailored to candidate skill gaps.

## User Review & Critical Decisions

> [!IMPORTANT]
> The following architectural decisions were confirmed during interactive clarification:

- **Confirmed Decision 1 (Organization)**: Dedicated top-level navigation tab: **"Resume Diagnostics & ATS Suite"** (`appState: 'ats-diagnostics'`), housing an integrated hub for all 10 tools with quick sub-navigation tabs and deep links from the Resume Builder and Job Matches.
- **Confirmed Decision 2 (Mock Interview Simulator)**: Interactive step-by-step chat experience with live evaluation after each answer (instant score, points covered vs. missed, and suggested model answer) before moving to the next question.
- **Confirmed Decision 3 (Job Scraper & LinkedIn Import)**: Native in-app URL parser with fallback paste analyzer, complemented by a downloadable **Companion Chrome Extension Bundle (Manifest V3)** that users can install in Developer Mode to scrape job listings directly from LinkedIn and Indeed.

---

## 1. Overview & Core Concept

- **What It Does**: Provides an end-to-end diagnostic and tailoring engine that evaluates resumes the way enterprise ATS systems (Workday, Greenhouse, Lever, Taleo) do, catches hidden biases or missing metrics, tailors resumes to pasted job descriptions, and runs live mock interviews.
- **Target Audience / Persona**: Active job seekers, tech career switchers, and applicants receiving auto-rejections who want transparency into ATS parsing and targeted preparation.
- **Key Value**: Transforms resume building from subjective guessing into an empirical, data-driven optimization process with concrete scores, one-click fixes, and simulated hiring workflows.

---

## 2. User Experience & Visual Design

### Key User Flows

1. **ATS Parse-ability Simulator**:
   - User uploads a PDF/Word file or uses their active profile resume.
   - The simulator runs an extraction pass and displays a split screen:
     - **ATS Plaintext Simulation**: Exactly what the parser extracts into applicant fields (contact data, education, experience, skill tokens).
     - **Parse-ability Scorecard**: Visual breakdown of Section Detection (100%), Contact Extraction (Email, Phone, LinkedIn), Table & Column Risk, and Header/Footer Warning.
2. **Skill Segmentation (Hard vs. Soft)**:
   - Categorizes extracted competencies into **Technical / Hard Skills** (languages, frameworks, cloud, databases) and **Interpersonal / Soft Skills** (cross-functional communication, stakeholder alignment, conflict resolution).
   - Shows a comparative ratio gauge and highlights missing high-value soft skills typical for the user's target seniority.
3. **Action Verb Power Scorer & Impact Quantifier**:
   - Flags weak, passive verbs (*"assisted with", "responsible for", "helped"*) and provides 1-click swaps with strong power verbs (*"Spearheaded", "Architected", "Engineered", "Orchestrated"*).
   - The **Impact Quantifier** detects bullet points missing metrics and opens a guided prompt asking for measurable outcomes, then converts them using the Google XYZ formula: *Accomplished [X] as measured by [Y] by doing [Z]*.
4. **Bias & Red Flag Detector**:
   - Identifies multi-month employment gaps, graduation dates older than 15 years, personal demographic disclosures, and outdated buzzwords (*"synergy", "hard worker", "team player"*), offering professional alternatives.
5. **One-Click Resume Tailoring**:
   - User inputs a target job description (via paste or browser scraper).
   - The engine generates a tailored version of the resume with matched keywords naturally embedded into experience bullets.
   - Side-by-side diff view with 1-click **"Apply Tailored Changes"** or **"Export to Word / PDF"**.
6. **LinkedIn URL Import & Companion Extension**:
   - Direct input for LinkedIn profile URL or public export text, automatically mapping experience, education, and skills into the active profile.
   - Downloadable Chrome Extension bundle (Manifest V3) with instructions to scrape job descriptions from LinkedIn/Indeed into the app with a single click.
7. **Mock AI Interview Simulator**:
   - Generates a 5-question interview tailored specifically to the user's resume gaps and target job.
   - Real-time step-by-step chat: The AI interviewer asks a question, the user types an answer, and receives an instant assessment:
     - Relevancy & Technical Accuracy (1–10)
     - Key Concepts Covered vs. Missed
     - Model Exemplar Answer
     - Next question prompt

### Visual Identity & Theme
- **Color Tokens**: Rich Indigo and Royal Blue primary (`#1d4ed8` / `#4338ca`), Emerald Green success badges (`#059669`), Amber warning alerts (`#d97706`), Crimson flag indicators (`#dc2626`).
- **Typography & Layout**: Clean, unboxed metadata separated by middots (`·`), high-contrast score rings, monospace ATS preview console, and responsive side-by-side comparison tables.

---

## 3. Key Product Decisions & Trade-Offs

- **Decision 1: Native In-App Engine vs. Third-Party API Dependence**:
  - *Chosen Approach*: Self-contained, client-side NLP heuristics for parsing, regex extraction, readability scoring, and semantic keyword matching.
  - *Why*: Instant response time, zero latency, 100% privacy (user resumes never leave the browser), and zero external API failure risks.
- **Decision 2: Companion Chrome Extension Integration**:
  - *Chosen Approach*: Provide a clean, downloadable Manifest V3 Chrome Extension package inside the applet with instructions for `chrome://extensions` Developer Mode, while also supporting direct URL scraping and clipboard pasting.
  - *Why*: Web security policies (CORS) block direct client-side cross-origin scraping of authenticated LinkedIn pages. Offering a downloadable browser extension package solves the root problem while the in-app parser ensures zero barrier to entry.
- **Decision 3: Interactive Chat Interviewer**:
  - *Chosen Approach*: Sequential turn-based chat with instant feedback per question.
  - *Why*: Far more realistic than static questionnaires. Applicants learn from immediate feedback before tackling subsequent questions.

---

## 4. Technical Architecture & Data Strategy

### Architecture & Component Diagram

```
┌────────────────────────────────────────────────────────────────────────┐
│                              App.tsx                                   │
│  - Mode Navigation ('ats-diagnostics' in Header Bar)                   │
│  - Shared UserProfile & Resume State                                   │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                      AtsDiagnosticsSuite.tsx                           │
│  ┌───────────────────────┬──────────────────────┬────────────────────┐ │
│  │ 1. ATS Parser Sim     │ 2. Skill Segmenter   │ 3. Verb Scorer     │ │
│  ├───────────────────────┼──────────────────────┼────────────────────┤ │
│  │ 4. Red Flag Detector  │ 5. 1-Click Tailor    │ 6. Impact Metric   │ │
│  ├───────────────────────┼──────────────────────┼────────────────────┤ │
│  │ 7. Browser Scraper    │ 8. LinkedIn Import   │ 9. Tone Auditor    │ │
│  ├───────────────────────┴──────────────────────┴────────────────────┤ │
│  │ 10. Mock AI Interview Simulator (Turn-based Interactive Chat)     │ │
│  └───────────────────────────────────────────────────────────────────┘ │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                        ExtensionBundle Generator                       │
│  - manifest.json, content.js, popup.html, background.js                │
│  - 1-Click Download ZIP for Chrome Extension Developer Mode            │
└────────────────────────────────────────────────────────────────────────┘
```

### New Components & Data Structures

1. **`src/components/AtsDiagnosticsSuite.tsx`**:
   - Master suite component containing tabs for:
     - **ATS Parser & Parse-ability Score** (Header, contacts, tables, plaintext stream)
     - **Skill Segmentation & Verb Scorer** (Hard vs Soft radar, action verb power upgrades, tone auditor)
     - **Bias & Red Flag Audit** (Gaps, dated elements, clichés)
     - **1-Click Tailoring & Impact Quantifier** (JD matcher, diff viewer, XYZ formula prompt)
     - **External Data Tools** (LinkedIn URL parser + Chrome Extension scraper bundle)
     - **Mock Interview Simulator** (Turn-based conversational interview with real-time scoring)
2. **`src/atsEngine.ts`**:
   - Specialized parsing rules:
     - Contact extraction regex (emails, phone numbers, GitHub/LinkedIn URLs)
     - Action verb dictionary (400+ categorized verbs: weak vs. power tiers)
     - Soft vs. Hard skill taxonomies
     - Readability metrics (Flesch-Kincaid index)
     - Cliché and red flag detection patterns
3. **`src/chromeExtensionFiles.ts`**:
   - Ready-to-use Manifest V3 extension code for scraping job details directly from LinkedIn and Indeed.

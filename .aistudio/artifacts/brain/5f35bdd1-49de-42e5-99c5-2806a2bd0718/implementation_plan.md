# Implementation Plan: Wisdom AI Career Copilot & Platform Navigator

Wisdom is an executive AI career assistant and platform guide embedded within JobFit Studio. It assists candidates with personalized career advice, resume optimization tips, interview prep guidance, and intelligent 1-click navigation to relevant platform tools based on their live profile, resume, and target role.

---

## 1. User Choices & Clarifications
- **Presentation & Placement**: Floating expandable bubble in the bottom-right corner on desktop, with a fluid full-width bottom sheet drawer on Android/mobile.
- **Role & Specialization**: Executive career advisor that answers user queries with actionable advice and renders 1-click tool navigation buttons (`ats-diagnostics`, `interview-prep`, `build-cv`, `salary-estimator`, `job-directory`, `quizzes`, `account-vault`, etc.).
- **Context Awareness**: Full candidate context injection—Wisdom inspects active candidate name, current occupation, primary target role, years of experience, uploaded resume text, saved skills, and enrolled roadmap milestones to deliver deeply personalized recommendations.

---

## 2. Proposed Architecture & System Design

### A. Backend Route: `/api/wisdom-chat` (`server.ts`)
- Utilizes the official `@google/genai` TypeScript SDK with model `gemini-3.8-flash`.
- Accepts:
  - `messages`: Conversation history `[{ role: 'user' | 'assistant', content: string }]`.
  - `candidateContext`: Active profile details (`name`, `occupation`, `targetRole`, `email`, `experienceYears`, `savedSkills`, `enrolledRoadmap`, `resumeTextSnippet`, `hasVideoCv`).
- System prompt instructions:
  - Identity: Wisdom, the AI Career Copilot for JobFit Studio.
  - Structured response capability: Returns both conversational markdown guidance and an array of recommended platform action shortcuts (`actions: [{ label: string, toolId: string, description: string }]`).
  - Fallback resilience: Graceful offline / demo fallback mode if API key is not present or offline.

### B. Frontend Component: `WisdomChatbot.tsx` (`src/components/WisdomChatbot.tsx`)
- **Floating Launcher Button**:
  - Positioned at bottom-right (`bottom-6 right-6`), above mobile navigation bar with high-contrast executive styling (`bg-blue-600 text-white shadow-xl hover:bg-blue-700`).
  - Pulsing micro-indicator when unread or idle, with clean spark / bot icon.
  - Keyboard shortcut (`⌘K` or `Ctrl+K`) to toggle open/close.
- **Desktop Chat Window**:
  - Elegant single-elevation card ($380\text{px}$–$420\text{px}$ width, $560\text{px}$ height) with frosted backdrop blur, hairline borders, and dark mode support.
  - Header: Wordmark "Wisdom", active candidate badge ("Context: [Candidate Name] · [Target Role]"), minimize, clear, and close buttons.
  - Message Stream: Formatted bubble stream with markdown rendering, typography hierarchy, monospace code blocks, and inline action buttons.
  - Action Shortcut Chips: Interactive 1-click cards below responses allowing immediate navigation to any of the 12+ career tools.
  - Starter Prompts: Quick-click suggestions when chat starts (e.g., *"What should I do next?"*, *"Audit my resume for red flags"*, *"Help me practice STAR interviews"*, *"Compare my skills to market salaries"*).
  - Input Box: Auto-resizing textarea with Send button and voice/enter hotkey support.
- **Android / Mobile Touch Bottom Sheet**:
  - Full mobile responsiveness adhering to the mobile thumb zone and touch guidelines ($\ge 44\text{px}$ touch targets, smooth spring transition, grab handle, full dismiss gesture).

### C. Platform Navigation Integration (`src/App.tsx`)
- Connect Wisdom's action buttons to `setAppState(...)` and `setIsAccountModalOpen(true)`:
  - Jump directly to ATS Diagnostics Suite (`ats-diagnostics`)
  - Jump directly to Role Roadmaps (`job-directory`)
  - Jump to Interactive STAR Interview Prep (`interview-prep`)
  - Jump to Resume Builder (`build-cv`)
  - Jump to Salary Calculator (`salary-estimator`)
  - Jump to Application Tracker (`application-tracker`)
  - Open Career Vault & Video CV (`account-vault`)
- Automatically close or dock the chat window upon navigation if on mobile, or keep open with notification.

---

## 3. UI/UX Specifications & Design Discipline

- **Anti-AI Slop & Zero-Pill Rules**:
  - No candy pill enclosures; quiet metadata markers with `·` separators.
  - Single-elevation card surfaces (`bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800`).
  - 60-30-10 color balance: neutral slate canvas, clean structural containers, high-intent blue accent for send and action highlights.
  - Monospace tabular numbers (`tabular-nums`) for any statistics or scores quoted.
  - Responsive safe zone: Positioned $80\text{px}$ above mobile viewport bottom to avoid overlap with Android bottom navigation.

---

## 4. Verification Plan

1. **Static Analysis & Linting**:
   - Run `lint_applet` (`tsc --noEmit`) to verify zero TypeScript errors.
2. **Build Verification**:
   - Run `compile_applet` to verify Vite client and Express server build success.
3. **Runtime Server Verification**:
   - Restart dev server and verify `/api/wisdom-chat` endpoint responds to chat queries.
4. **Interactive Feature Testing**:
   - Test floating bubble toggle on desktop and Android mobile viewports.
   - Verify active candidate context (Rao or Alex Johnson) is correctly read and reflected in advice.
   - Click each 1-click action button (e.g. "Run ATS Diagnostics", "View Video CV Vault", "Practice STAR Interviews") and verify immediate navigation to the correct platform tool.
   - Test offline / demo prompt fallback handling.

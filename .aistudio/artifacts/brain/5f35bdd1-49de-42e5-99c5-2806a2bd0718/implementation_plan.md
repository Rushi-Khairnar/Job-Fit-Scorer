# Android Chrome Viewport Scroll Fix & Native Back Button Navigation Architecture

Restore seamless vertical scrolling across all JobFit tools and implement native Android gesture/back-button handling with deep-linked URL hash routing and exit confirmation prompts.

## User Review & Critical Decisions

> [!IMPORTANT]
> The following user preferences were confirmed during clarification and are established as the foundational specification for this update:

- **Confirmed Decision 1 (Home Screen Exit Protection)**: When the user presses the Android hardware/gesture back button while already on the main JobFit home screen, the application will display a quick, native-feeling confirmation modal ("Leave JobFit Studio?") instead of abruptly closing the browser tab or exiting without warning.
- **Confirmed Decision 2 (URL Hash Deep-Linking)**: All feature and tool transitions (e.g., ATS Diagnostics Suite, Learning Roadmaps, Practice Quizzes, Resume Builder, Salary Estimator) will synchronize with the browser address bar using URL hashes (`#ats-diagnostics`, `#roadmaps`, `#quizzes`, `#resume-builder`, etc.), allowing direct bookmarking, link sharing, and full browser back/forward history traversal.
- **Confirmed Resolution for Scroll Lock**: The document-level scrolling lock (where content becomes frozen on one page in mobile Chrome) is resolved by removing competing `overflow-x: hidden` / `overscroll-none` constraints across `html` and `body`, adopting modern `overflow-x: clip` on the root viewport, and ensuring top scroll resets on view changes.

---

## 1. Overview & Core Concept

- **What It Does**: 
  1. Unlocks the viewport document flow so all 12 Career Intelligence tools (including ATS Diagnostics Suite, Candidate Ranker, and Application Tracker) scroll smoothly from top to bottom on mobile devices without getting stuck or constrained.
  2. Integrates HTML5 History (`pushState`, `replaceState`, and `popstate`) synchronized with URL hashes, enabling Android Chrome users to freely use Android system back gestures, the hardware back button, and Chrome's back button.
  3. Establishes a hierarchical back-navigation pipeline: active modals and bottom sheets close first; feature sub-views return to the main home dashboard; and back navigation from the home dashboard triggers a clean exit confirmation dialog.
- **Target Audience / Persona**: Mobile job seekers and developers accessing JobFit Studio on Android devices (Chrome, Samsung Internet, Edge) navigating between extensive resume audits, interactive quizzes, and roadmap milestones.
- **Key Value**: Eliminates accidental browser tab closures, removes layout scroll freezing, and delivers a native mobile app navigation experience within the browser.

---

## 2. User Experience & Visual Design

### Key User Flows

```
[ User Flow: Android Back Button & Navigation Hierarchy ]

                   ┌──────────────────────────────────────────┐
                   │  User navigates inside JobFit Studio     │
                   └────────────────────┬─────────────────────┘
                                        │
                         [ Presses Android Back Button ]
                                        │
                                        ▼
                   ┌──────────────────────────────────────────┐
                   │  Is any Modal or Drawer currently open?  │
                   │  (Account, Live Intel, Mobile Tools)     │
                   └───────┬──────────────────────────┬───────┘
                      YES  │                          │ NO
                           ▼                          ▼
            ┌────────────────────────────┐   ┌───────────────────────────┐
            │ Dismiss active overlay     │   │ Is user on Home Dashboard │
            │ (Consumes back event)      │   │ (`#home` / `appState:home`)│
            └────────────────────────────┘   └──────┬─────────────┬──────┘
                                                NO  │             │ YES
                                                    ▼             ▼
                                     ┌──────────────────┐  ┌────────────────────┐
                                     │ Transition back  │  │ Display Quick Exit │
                                     │ to Home screen   │  │ Confirmation Modal │
                                     │ (`#home`)        │  │ ("Leave JobFit?")  │
                                     └──────────────────┘  └────────┬───────────┘
                                                                    │
                                                     ┌──────────────┴──────────────┐
                                                     ▼                             ▼
                                           [ "Stay on Page" ]             [ "Exit Website" ]
                                           Dismisses dialog               Allows browser
                                           & keeps state                  to exit / back
```

### Visual Identity & Theme

- **Aesthetic Direction**: High-utility modern SaaS tailored for mobile ergonomics with high-contrast surfaces, responsive touch geometry, and zero pill-badge clutter.
- **Color Palette & Atmospheric Values**:
  - Light Mode: Neutral slate canvas (`bg-neutral-50`), crisp white card containers (`bg-white`), dark slate typography (`text-neutral-900`), and blue interactive accents (`bg-blue-600`).
  - Dark Mode: Deep obsidian canvas (`bg-neutral-950`), elevated charcoal containers (`bg-neutral-900`), light zinc typography (`text-neutral-100`), and indigo/blue accents (`text-blue-400`).
- **Confirmation Modal Design**:
  - Clean bottom-sheet on mobile devices (`max-w-md mx-auto rounded-t-3xl sm:rounded-2xl p-6 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-2xl`).
  - Prominent icon badge with warning/door glyph, crisp heading, supportive description explaining that resume data is safely saved in local storage, and high-contrast thumb-friendly action buttons (min height 48px).

---

## 3. Key Product Decisions & Trade-Offs

### Decision 1: Mobile Scroll Lock Elimination
- **Root Cause**: `index.html` contained `<body class="overscroll-none antialiased">`, while `src/index.css` set `overflow-x: hidden` and `overscroll-behavior-y: contain` on both `html` and `body`. In Chromium on mobile, setting `overflow-x: hidden` simultaneously on both root tags forces the browser to treat `<body>` as a disconnected secondary scroll container rather than the viewport window. When touch gestures encounter internal elements with touch manipulation or fixed positioning, document scrolling freezes.
- **Chosen Approach**: 
  - Remove `overscroll-none` from `index.html`.
  - In `src/index.css`, switch `html, body` from `overflow-x: hidden` to modern `overflow-x: clip` or apply horizontal overflow guards exclusively to internal view wrappers.
  - Remove intrusive `overscroll-behavior-y: contain` from the global `body` tag so Android Chrome's pull-to-refresh and dynamic address bar collapse/expand work naturally.
  - Add an automated `window.scrollTo({ top: 0, left: 0, behavior: 'instant' })` whenever `appState` changes so users navigating into deep tools start right at the top.
- **Trade-Off**: Allowing normal document overscroll restores native fluid scrolling and dynamic address bar behavior at the cost of slight rubber-banding, which is the expected native feel on Android Chrome.

### Decision 2: HTML5 History Stack & URL Hash Synchronization
- **Chosen Approach**: 
  - Synchronize every tool transition with `window.history.pushState` and a corresponding URL hash (e.g., `#home`, `#ats-diagnostics`, `#roadmaps`, `#quizzes`, `#resume-builder`, `#salary-estimator`, `#market-explorer`, `#cover-letter`, `#interview-prep`, `#culture-fit`, `#bulk-ranker`, `#application-tracker`, `#profile-auditor`).
  - Listen to `window.addEventListener('popstate', ...)` and `window.addEventListener('hashchange', ...)`.
  - When the user presses the Android back button, the browser pops the history entry, triggering the popstate handler. If the previous state is empty or at root, it falls back to `#home`.
  - If the user loads or refreshes a URL directly with a hash (e.g. `https://jobfit.app/#ats-diagnostics`), the app parses the hash on initial mount and immediately opens that tool.
- **Trade-Off**: Requires keeping React state and browser hash in bidirectional sync, but provides deep bookmarking and complete Android back-button compatibility.

### Decision 3: Home Exit Protection (Exit Confirmation Prompt)
- **Chosen Approach**: 
  - When on the home screen (`#home`), a baseline history state is maintained (`{ isHomeTrap: true }`).
  - When the user gestures back on Android while on the home screen, the popstate event fires. The application catches the event, pushes the home state back immediately to prevent the tab from terminating, and reveals a quick, polished exit confirmation dialog.
  - If the user clicks "Exit Website", the trap is disarmed and `window.history.back()` is triggered, allowing normal exit.
  - If the user clicks "Stay on Page", the modal simply dismisses.

---

## 4. Technical Architecture & Data Strategy

### System Component & Navigation Flow Diagram

```
┌────────────────────────────────────────────────────────────────────────┐
│                          JobFit Studio App Root                        │
│                                                                        │
│   ┌────────────────────────────────────────────────────────────────┐   │
│   │                    History & Navigation Hub                    │   │
│   │  • Hash Watcher (reads location.hash on mount & updates)       │   │
│   │  • Popstate Handler (intercepts hardware/gesture Back clicks)  │   │
│   │  • Exit Trap Manager (guards accidental tab exit on Home)      │   │
│   └───────────────┬────────────────────────────────┬───────────────┘   │
│                   │                                │                   │
│                   ▼                                ▼                   │
│   ┌───────────────────────────────┐  ┌─────────────────────────────┐   │
│   │        Active Tool View       │  │     Overlays & Modals       │   │
│   │  • #home (Upload / Overview)  │  │  • Account Modal            │   │
│   │  • #ats-diagnostics           │  │  • Live Intel Modal         │   │
│   │  • #roadmaps                  │  │  • Resume Viewer Modal      │   │
│   │  • #quizzes                   │  │  • Mobile Tools Drawer      │   │
│   │  • #resume-builder            │  │  • Exit Confirmation Modal  │   │
│   │  • #salary-estimator          │  └──────────────┬──────────────┘   │
│   │  • #interview-prep            │                 │                  │
│   │  • #culture-fit / etc.        │                 │                  │
│   └───────────────┬───────────────┘                 │                  │
│                   │                                 │                  │
│                   └────────────────┬────────────────┘                  │
│                                    ▼                                   │
│   ┌────────────────────────────────────────────────────────────────┐   │
│   │                     Viewport & Scroll Core                     │   │
│   │  • html & body: overflow-x: clip (eliminates scroll freeze)    │   │
│   │  • Natural document-level window scroll flow                   │   │
│   │  • Scroll reset on route transition (`window.scrollTo(0, 0)`)  │   │
│   │  • Safe area inset padding for Android system navigation bar   │   │
│   └────────────────────────────────────────────────────────────────┘   │
└────────────────────────────────────────────────────────────────────────┘
```

### Interactive Component & State Mapping

| User Action / Trigger | State Transformation | DOM & Browser Effect |
| :--- | :--- | :--- |
| **User selects ATS Diagnostics** | `setAppState('ats-diagnostics')` | Updates address bar to `#ats-diagnostics`, pushes history entry, scrolls window to top. |
| **User selects Learning Roadmaps** | `setAppState('job-directory')` | Updates address bar to `#roadmaps`, pushes history entry, scrolls window to top. |
| **Android Back pressed while in tool** | Popstate fires; detects sub-feature | Changes `appState` to `'upload'`, updates hash to `#home`, returns to dashboard. |
| **Android Back pressed while modal open** | Popstate fires; detects open modal | Closes active modal (`isOpen = false`), consumes back gesture without leaving page. |
| **Android Back pressed while on Home** | Popstate fires; detects home state | Restores home trap, displays "Leave JobFit Studio?" bottom sheet / modal. |
| **User confirms "Stay on Page"** | Closes exit prompt modal | User remains on JobFit Home with full state and profiles intact. |
| **User confirms "Exit Website"** | Disarms trap, triggers `history.back()` | Native browser back/tab close proceeds normally. |
| **User vertical swipe / scroll down** | Standard window touch scroll | Content scrolls freely without hitting a frozen barrier on any device. |

---

## 5. Implementation Steps (Planned for Execution)

1. **CSS & HTML Viewport Unlocking**:
   - Update `index.html` to remove restrictive `overscroll-none` on body.
   - Refactor `src/index.css` root rules to use `overflow-x: clip` rather than `overflow-x: hidden` on both `html` and `body`, and remove `overscroll-behavior-y: contain` so document scrolling is completely unblocked.
2. **Hash & History Routing Integration**:
   - Create URL hash mapping dictionary for all `ActiveToolTab` values.
   - Implement hash synchronization on tool click (`handleNavigateToTool` / `setAppState`).
   - Parse initial hash on page load to support direct link opening and refresh.
3. **Android Back-Button (Popstate) & Overlay Interceptor**:
   - Implement popstate listener in `App.tsx` handling the three-tier hierarchy (modals -> feature views -> home screen).
   - Scroll reset (`window.scrollTo({ top: 0, behavior: 'instant' })`) on state changes.
4. **Exit Confirmation UI Modal**:
   - Build a clean, accessible Exit Confirmation Dialog with "Stay on Page" and "Exit Website" buttons.
5. **Validation & Verification**:
   - Run `compile_applet` and verify zero TypeScript or lint errors.

export interface QuestionItem {
  id: string;
  category: 'Technical' | 'Behavioral' | 'System Design';
  question: string;
  targetSkill: string;
  interviewerIntent: string;
  talkingPoints: string[];
  starFramework?: {
    situation: string;
    task: string;
    action: string;
    result: string;
  };
  gotchas: string;
}

export const INTERVIEW_QUESTIONS_DATA: Record<string, QuestionItem[]> = {
  'Data Scientist': [
    {
      id: 'ds1',
      category: 'Technical',
      targetSkill: 'Machine Learning & MLOps',
      question: 'How do you detect and mitigate data drift and concept drift in a production predictive model?',
      interviewerIntent: 'Testing if you have actual real-world MLOps and production maintenance experience beyond training in Jupyter notebooks.',
      talkingPoints: [
        'Distinguish data drift (distribution P(X) shifts) vs concept drift (relationship P(Y|X) shifts).',
        'Statistical metrics: Kolmogorov-Smirnov test for continuous features, PSI (Population Stability Index), or Wasserstein distance.',
        'Mitigation: Scheduled retraining cadences, shadow model testing, sliding time window models, and automated alert thresholds.'
      ],
      gotchas: 'Do not just suggest "retrain immediately" without monitoring baseline variance or verifying sample size.'
    },
    {
      id: 'ds2',
      category: 'System Design',
      targetSkill: 'Recommendation Systems',
      question: 'Design an end-to-end embedding retrieval and re-ranking system for an e-commerce catalog with 10M products.',
      interviewerIntent: 'Evaluating two-stage recommendation architecture: vector similarity search (FAISS/Milvus) followed by heavy cross-encoder ranker.',
      talkingPoints: [
        'Candidate generation: Approximate Nearest Neighbors (HNSW index) retrieves top 500 items in <20ms.',
        'Feature store (Redis/Feast) populates real-time user context (last 5 clicked items).',
        'Fine-grained ranking: GBDT or Transformer cross-encoder scores top 500 down to top 20 display items.'
      ],
      gotchas: 'Failing to mention latency budget (under 100ms total p99 SLA) or cold-start problem for new items.'
    },
    {
      id: 'ds3',
      category: 'Behavioral',
      targetSkill: 'Stakeholder Communication',
      question: 'Tell me about a time when business executives doubted your model conclusions. How did you handle it?',
      interviewerIntent: 'Testing communication, empathy, and ability to translate statistical concepts into bottom-line business value.',
      talkingPoints: [
        'Focus on explainability: SHAP values and feature attribution.',
        'Framing: Speak in terms of ROI, risk reduction, and incremental uplift rather than ROC-AUC or loss functions.'
      ],
      starFramework: {
        situation: 'At my previous company, sales leadership rejected an automated lead prioritization model because it deprioritized historically favored enterprise leads.',
        task: 'I needed to validate model fairness, address sales director concerns, and create buy-in without compromising predictive accuracy.',
        action: 'I conducted a SHAP explainability workshop with the sales team, showcasing specific negative signal variables. I then proposed a 30-day A/B test with a 10% holdout group.',
        result: 'The model group drove a 23% higher qualification conversion rate, securing full executive endorsement and company-wide adoption.'
      },
      gotchas: 'Blaming business stakeholders for not understanding math or refusing to compromise.'
    },
    {
      id: 'ds4',
      category: 'Technical',
      targetSkill: 'Statistics & Hypothesis Testing',
      question: 'How do you determine statistical sample size and test duration for an A/B test with low baseline conversion rates?',
      interviewerIntent: 'Evaluating foundational statistical rigor, Type I (alpha) and Type II (beta) errors, statistical power, and Minimum Detectable Effect (MDE).',
      talkingPoints: [
        'Calculate required sample size using baseline conversion, MDE, alpha (typically 0.05), and beta (power at 0.80).',
        'Account for weekly seasonality: run for at least 1-2 full business cycles (14 days minimum).',
        'Guard against p-hacking: avoid early stopping without sequential testing adjustments (e.g., Pocock or O\'Brien-Fleming boundaries).'
      ],
      gotchas: 'Checking p-values every day and stopping the experiment as soon as p < 0.05 (peeking problem).'
    },
    {
      id: 'ds5',
      category: 'Technical',
      targetSkill: 'Feature Engineering & Imbalanced Data',
      question: 'How do you handle extreme class imbalance (e.g., 99.8% negative vs 0.2% positive) in fraud detection?',
      interviewerIntent: 'Checking if candidate knows beyond naive accuracy, understanding cost-sensitive learning, resampling, and precision-recall trade-offs.',
      talkingPoints: [
        'Evaluation metrics: PR-AUC (Precision-Recall curve) and F-beta, never standard ROC-AUC or overall accuracy.',
        'Resampling techniques: SMOTE, ADASYN for minority oversampling, or cluster-based undersampling of majority class.',
        'Algorithmic adjustments: focal loss, class weights (scale_pos_weight in XGBoost), and threshold tuning based on fraud financial risk.'
      ],
      gotchas: 'Evaluating the model with accuracy (predicting all negative gives 99.8% accuracy but catches zero fraud).'
    },
    {
      id: 'ds6',
      category: 'System Design',
      targetSkill: 'Real-Time Streaming Inference',
      question: 'How would you architect a real-time credit scoring pipeline with sub-50ms latency guarantees?',
      interviewerIntent: 'Assessing understanding of low-latency model inference, caching, distributed message queues, and fallback mechanisms.',
      talkingPoints: [
        'Pre-compute batch aggregations (e.g. 90-day transaction averages) in an offline store (Snowflake/BigQuery).',
        'Use an in-memory feature store (Redis, Feast) for sub-5ms low latency feature lookups.',
        'Deploy serialized model binaries (ONNX runtime or TensorRT) on containerized pods with CPU/GPU pin allocations and circuit breakers.'
      ],
      gotchas: 'Running complex joins or raw database table scans inside the real-time request path.'
    },
    {
      id: 'ds7',
      category: 'Technical',
      targetSkill: 'Natural Language Processing & LLMs',
      question: 'Compare Retrieval-Augmented Generation (RAG) vs fine-tuning an LLM for domain-specific question answering.',
      interviewerIntent: 'Testing modern generative AI architecture knowledge, cost considerations, and dynamic data freshness trade-offs.',
      talkingPoints: [
        'RAG provides factual grounding, reduces hallucinations, supports instant knowledge updates, and preserves document access permissions.',
        'Fine-tuning adapts tone, style, specialized syntax, or low-latency classification, but does not reliably inject new factual knowledge.',
        'Hybrid approach: RAG for knowledge retrieval + fine-tuned compact model for structured formatting and domain reasoning.'
      ],
      gotchas: 'Recommending expensive model fine-tuning when company documentation changes daily.'
    },
    {
      id: 'ds8',
      category: 'Behavioral',
      targetSkill: 'Prioritization & Scope Management',
      question: 'How do you decide between building a quick heuristic baseline vs a complex deep learning model?',
      interviewerIntent: 'Evaluating pragmatic business sense, incremental delivery, and ROI awareness.',
      talkingPoints: [
        'Always start with a simple heuristic or logistic regression baseline to establish benchmark performance within 48 hours.',
        'Measure marginal gains: only escalate complexity if the incremental lift justifies training, serving latency, and maintenance costs.',
        'Deliver business value early while iterating on advanced models in parallel.'
      ],
      starFramework: {
        situation: 'Product requested a customer churn model with a tight 3-week deadline before quarterly planning.',
        task: 'Deliver actionable churn predictions without missing the business window.',
        action: 'I built a simple decision tree baseline in 3 days that achieved 78% precision, deployed it to marketing, and then used remaining time to engineer gradient-boosted models.',
        result: 'Marketing launched retention campaigns 2 weeks earlier, saving $80,000 in immediate renewals.'
      },
      gotchas: 'Spending months training deep neural networks without ever benchmarking against a simple logistic regression.'
    },
    {
      id: 'ds9',
      category: 'System Design',
      targetSkill: 'ML Experimentation Platform',
      question: 'Design a centralized ML experimentation tracking and model registry architecture for a team of 25 data scientists.',
      interviewerIntent: 'Testing reproducibility, lineage tracking, artifact storage, and model governance.',
      talkingPoints: [
        'Experiment tracking: MLflow / Weights & Biases logging parameters, metrics, git commit SHAs, and dataset hashes.',
        'Model registry: versioned staging environments (Development -> Staging -> Production) with automated validation gates.',
        'Reproducibility: DVC (Data Version Control) tracking training data versions on S3/GCS buckets.'
      ],
      gotchas: 'Relying on manual spreadsheets or naming model files like "model_final_v2_really_final.pkl".'
    },
    {
      id: 'ds10',
      category: 'Behavioral',
      targetSkill: 'Handling Project Failure',
      question: 'Tell me about an ML project that failed to deliver the expected results. What went wrong and what did you learn?',
      interviewerIntent: 'Assessing humility, post-mortem rigor, risk management, and ability to learn from negative outcomes.',
      talkingPoints: [
        'Analyze root cause objectively: was it data quality, label leakage, shifting business goals, or adoption friction?',
        'Demonstrate how lessons learned improved subsequent engineering processes.'
      ],
      starFramework: {
        situation: 'We developed an automated customer sentiment classifier that achieved 91% validation accuracy in offline tests but caused high user friction in production.',
        task: 'Identify the gap between lab metrics and real-world user satisfaction.',
        action: 'I audited production false positives and discovered subtle sarcasm and slang that our training corpus lacked. I instituted a shadow evaluation period for all future models.',
        result: 'We rolled back the model, added human-in-the-loop escalation, and prevented customer service churn.'
      },
      gotchas: 'Claiming you have never had a project fail, or blaming customers for not liking the model.'
    }
  ],
  'Software Engineer': [
    {
      id: 'se1',
      category: 'Technical',
      targetSkill: 'React & TypeScript',
      question: 'How does React 18 Concurrent Rendering work, and when should you reach for useDeferredValue or useTransition?',
      interviewerIntent: 'Testing deep knowledge of the React reconciliation fiber architecture and non-blocking state updates.',
      talkingPoints: [
        'Fiber tree interruption: React yields execution back to the browser event loop during heavy renders.',
        'useTransition wraps urgent user input (typing) vs non-urgent state transitions (filtering large tables).',
        'useDeferredValue is used when you consume a prop from upstream and want to postpone re-rendering expensive children.'
      ],
      gotchas: 'Confusing useDeferredValue with simple lodash debounce; debounce delays trigger, deferred value renders immediately when CPU is idle.'
    },
    {
      id: 'se2',
      category: 'System Design',
      targetSkill: 'Distributed Systems',
      question: 'Design an idempotency mechanism for payment processing APIs handling duplicate incoming requests.',
      interviewerIntent: 'Assessing resilience, database transactions, distributed locks, and retry handling.',
      talkingPoints: [
        'Client-provided Idempotency-Key header stored in Redis with TTL.',
        'State machine in SQL: PENDING -> PROCESSING -> COMPLETED with optimistic concurrency locking.',
        'Return cached transaction response if identical idempotency key is received after completion.'
      ],
      gotchas: 'Not addressing what happens when a duplicate request arrives WHILE the first request is still processing (race condition).'
    },
    {
      id: 'se3',
      category: 'Behavioral',
      targetSkill: 'Production Incident Handling',
      question: 'Describe a production outage or critical regression you introduced. What were your immediate actions?',
      interviewerIntent: 'Testing psychological safety, blameless post-mortem culture, and rapid incident triage.',
      talkingPoints: [
        'Prioritize mitigation (revert commit or roll back canary) before root cause investigation.',
        'Transparent incident communication channel and post-mortem action items.'
      ],
      starFramework: {
        situation: 'A schema migration I shipped caused slow lock contention on the primary Postgres users table during peak hours.',
        task: 'Quickly restore database latency and recover 503 service drops.',
        action: 'I immediately alerted the incident commander, executed a zero-downtime rollback script within 4 minutes, and notified customer support with impacted user IDs.',
        result: 'Total downtime was limited to 6 minutes; I instituted an automated query-plan lint check in CI that prevented unindexed table locks.'
      },
      gotchas: 'Pretending you have never caused a bug, or shifting blame to QA or devops.'
    },
    {
      id: 'se4',
      category: 'Technical',
      targetSkill: 'Memory Management & Garbage Collection',
      question: 'How do memory leaks occur in Node.js / JavaScript applications, and how do you diagnose them using heap dumps?',
      interviewerIntent: 'Testing runtime internals, V8 garbage collector (Scavenge vs Mark-Sweep), closure retention, and profiling tools.',
      talkingPoints: [
        'Common causes: global variables, uncleaned event listeners, uncleared setInterval timers, and closures retaining large scopes.',
        'Profiling: taking 3 heap snapshots in Chrome DevTools or Clinic.js and filtering by objects allocated between snapshots.',
        'Analyze retainer trees to identify the root object preventing garbage collection.'
      ],
      gotchas: 'Thinking garbage-collected languages cannot have memory leaks.'
    },
    {
      id: 'se5',
      category: 'Technical',
      targetSkill: 'Database Concurrency & ACID',
      question: 'Explain the four SQL isolation levels (Read Uncommitted, Read Committed, Repeatable Read, Serializable) and the phenomena they prevent.',
      interviewerIntent: 'Assessing database transactional depth, dirty reads, non-repeatable reads, phantom reads, and MVCC implementation.',
      talkingPoints: [
        'Read Uncommitted allows dirty reads. Read Committed prevents dirty reads using read locks or MVCC snapshots.',
        'Repeatable Read ensures consistent row data across a transaction; Postgres uses snapshot isolation.',
        'Serializable prevents write skew and phantom anomalies through SSI (Serializable Snapshot Isolation) or strict predicate locking.'
      ],
      gotchas: 'Assuming all databases default to Serializable isolation.'
    },
    {
      id: 'se6',
      category: 'System Design',
      targetSkill: 'Rate Limiting & API Gateway',
      question: 'Design a distributed rate limiter supporting 100,000 requests per second across 20 microservices.',
      interviewerIntent: 'Evaluating algorithms (Token Bucket, Leaky Bucket, Sliding Window Counter), Redis Lua scripts, and local memory tiering.',
      talkingPoints: [
        'Sliding Window Counter algorithm balances accuracy and memory footprint.',
        'Atomic execution in Redis using Lua scripts to prevent race conditions across distributed gateway nodes.',
        'Local in-memory caching (e.g. Guava/LRU) with batching to avoid hitting Redis on every single request.'
      ],
      gotchas: 'Using naive Fixed Window counter, which allows twice the limit at window boundaries.'
    },
    {
      id: 'se7',
      category: 'System Design',
      targetSkill: 'Message Queues & Async Processing',
      question: 'How do you guarantee strictly ordered, exactly-once message delivery in an asynchronous event-driven system?',
      interviewerIntent: 'Testing understanding of Kafka partitions, deduplication keys, outbox patterns, and consumer idempotency.',
      talkingPoints: [
        'Partitioning: messages with the same partition key (e.g. order_id) are guaranteed FIFO order within that partition.',
        'Transactional Outbox Pattern: atomically write domain events into the database table within the same SQL transaction as entity changes.',
        'Consumer side idempotency: track processed message IDs in a distributed store.'
      ],
      gotchas: 'Claiming pure distributed systems can achieve physical exactly-once delivery without consumer idempotency.'
    },
    {
      id: 'se8',
      category: 'Behavioral',
      targetSkill: 'Code Review & Mentorship',
      question: 'How do you handle a disagreement during a code review when an engineer pushes back on your feedback?',
      interviewerIntent: 'Assessing interpersonal maturity, objective standards, and focus on code quality over ego.',
      talkingPoints: [
        'Distinguish objective requirements (correctness, security, performance) from stylistic preferences (nits).',
        'Reference team style guides, ADRs (Architecture Decision Records), or run benchmarks rather than personal opinions.',
        'Hop on a quick 5-minute video call to align rather than writing 20 antagonistic comments.'
      ],
      starFramework: {
        situation: 'A senior engineer submitted a PR bypassing our API error handler to save development time before a demo.',
        task: 'Ensure system resilience and unhandled exception safety without causing conflict.',
        action: 'I set up a quick 1-on-1 call, walked through edge cases where unhandled exceptions would crash node worker threads, and suggested an alternative 10-line wrapper.',
        result: 'The engineer appreciated the catch, adopted the wrapper, and we codified the error pattern in our team documentation.'
      },
      gotchas: 'Approving bad code just to avoid conflict, or engaging in endless passive-aggressive PR comment wars.'
    },
    {
      id: 'se9',
      category: 'Technical',
      targetSkill: 'Security & Web Vulnerabilities',
      question: 'How do you protect a modern Single Page Application against XSS (Cross-Site Scripting) and CSRF attacks?',
      interviewerIntent: 'Checking security fundamentals: HttpOnly cookies, SameSite flags, CSP headers, and input sanitization.',
      talkingPoints: [
        'XSS mitigation: sanitize input (DOMPurify), avoid dangerouslySetInnerHTML, and implement strict Content-Security-Policy (CSP) headers.',
        'CSRF mitigation: use SameSite=Lax/Strict HttpOnly cookies, or anti-CSRF token verification headers for state-mutating requests.',
        'Token storage: avoid storing sensitive refresh tokens in localStorage where XSS scripts can read them.'
      ],
      gotchas: 'Storing raw JWT authentication tokens in unencrypted localStorage.'
    },
    {
      id: 'se10',
      category: 'Behavioral',
      targetSkill: 'Navigating Ambiguity',
      question: 'Tell me about a time when you received a vague specification and had to deliver a complex feature.',
      interviewerIntent: 'Testing self-starter drive, customer interviews, prototyping, and iterative requirement clarification.',
      talkingPoints: [
        'Proactively clarify requirements: interview users, sketch interface flows, and draft technical design docs (RFCs).',
        'Break problem into testable milestones and solicit early feedback.'
      ],
      starFramework: {
        situation: 'Product requested "better activity search" for our enterprise dashboard without specific query syntax or filters defined.',
        task: 'Define scope, architect the search indexing engine, and deliver within one release cycle.',
        action: 'I analyzed user search logs to identify top queries, drafted an RFC proposing faceted search with date ranges, and built an interactive prototype for stakeholder review.',
        result: 'Feature was approved in 3 days and increased user search completion rate by 42% after launch.'
      },
      gotchas: 'Complaining that the PM didn\'t write everything down and doing nothing until told.'
    }
  ],
  'Frontend Developer': [
    {
      id: 'fe1',
      category: 'Technical',
      targetSkill: 'Browser Performance & Web Vitals',
      question: 'How do you optimize Core Web Vitals (LCP, INP, CLS) on a high-traffic e-commerce application?',
      interviewerIntent: 'Checking if you understand real-world browser rendering pipelines, script execution bottlenecks, and image optimization.',
      talkingPoints: [
        'LCP: Preload hero image with fetchpriority="high", inline critical CSS, and use edge CDNs.',
        'INP: Break long tasks (>50ms) using requestIdleCallback or isInputPending(), and move heavy state transforms off main thread.',
        'CLS: Reserve explicit aspect-ratio and width/height attributes on media, and avoid dynamically injecting banners above the fold.'
      ],
      gotchas: 'Suggesting client-side lazy loading for the primary hero banner (which delays LCP).'
    },
    {
      id: 'fe2',
      category: 'System Design',
      targetSkill: 'Design Systems & Component Architecture',
      question: 'Architect a composable Design System component library supporting multi-brand theming and strict accessibility (WCAG AA).',
      interviewerIntent: 'Evaluating component composition, CSS variables, tokens architecture, and headless primitives.',
      talkingPoints: [
        'Tokens: Primitive tokens (hex) -> Semantic tokens (surface, text-primary) -> Component tokens.',
        'Headless primitives (Radix UI / React Aria) manage keyboard focus traps and ARIA attributes.',
        'Automated CI testing with axe-core and visual regression testing via Playwright.'
      ],
      gotchas: 'Hardcoding color hex codes directly inside individual components.'
    },
    {
      id: 'fe3',
      category: 'Behavioral',
      targetSkill: 'Cross-functional Alignment',
      question: 'How do you negotiate with UI/UX designers when an animation or layout design causes severe performance bottlenecks?',
      interviewerIntent: 'Assessing collaboration, diplomacy, and technical compromise skills.',
      talkingPoints: [
        'Frame discussions around shared metrics (e.g. mobile conversion rate dropped 12% on low-end phones).',
        'Offer constructive alternatives: CSS transform/opacity compositor animations instead of height layout recalculations.'
      ],
      starFramework: {
        situation: 'Design proposed a complex blur backdrop and 3D tilt effect on product cards that lagged to 24fps on budget mobile devices.',
        task: 'Deliver the designer’s modern glass aesthetic without dropping frames or battery drain.',
        action: 'I benchmarked GPU paint times in Chrome DevTools and demonstrated a visually equivalent SVG gradient mesh with pre-rendered shadows.',
        result: 'Achieved consistent 60fps across all devices, and the designer praised the responsiveness.'
      },
      gotchas: 'Flatly saying "engineering says no" without presenting alternatives.'
    },
    {
      id: 'fe4',
      category: 'Technical',
      targetSkill: 'State Management & Caching',
      question: 'How do you choose between local component state, URL state, React Context, and server cache (TanStack Query)?',
      interviewerIntent: 'Evaluating pragmatic state separation: preventing re-render waterfalls and keeping URL shareable.',
      talkingPoints: [
        'URL state (searchParams): filters, pagination, tabs (ensures shareable links and back-button support).',
        'Server state (TanStack Query/SWR): caching, deduping, background refetching, and optimistic updates.',
        'Context: low-frequency global app settings (theme, user auth, locale). Avoid high-frequency state in Context.'
      ],
      gotchas: 'Storing server data in Redux/Context and writing manual fetch/loading/error boilerplate.'
    },
    {
      id: 'fe5',
      category: 'Technical',
      targetSkill: 'JavaScript Event Loop & Microtasks',
      question: 'What is the exact execution order of synchronous code, process.nextTick, Promise microtasks, and setTimeout macrotasks?',
      interviewerIntent: 'Testing deep knowledge of the JavaScript single-threaded event loop and task queues.',
      talkingPoints: [
        'Call stack executes synchronous code to completion.',
        'Microtask queue (Promise.then, MutationObserver) runs immediately after current call stack empties and before next macrotask.',
        'Macrotask queue (setTimeout, setInterval, I/O) executes one task per loop iteration.'
      ],
      gotchas: 'Thinking setTimeout(fn, 0) runs before a resolved Promise.then().'
    },
    {
      id: 'fe6',
      category: 'System Design',
      targetSkill: 'Micro-Frontends & Module Federation',
      question: 'When should an organization adopt Micro-Frontends (Module Federation), and what are the primary engineering trade-offs?',
      interviewerIntent: 'Assessing organizational scale vs operational complexity, bundle duplication, and shared dependency management.',
      talkingPoints: [
        'Adopt when 5+ autonomous squads need independent release cycles without blocking one another on monorepo deployments.',
        'Webpack / Vite Module Federation enables runtime sharing of host shell and remotes.',
        'Trade-offs: shared dependency version mismatch, CSS collisions, duplicate runtime payloads, and complex integration testing.'
      ],
      gotchas: 'Recommending micro-frontends for small 3-person teams with simple apps.'
    },
    {
      id: 'fe7',
      category: 'Technical',
      targetSkill: 'Web Accessibility (a11y)',
      question: 'How do you ensure a custom accessible combobox/autocomplete dropdown complies with WAI-ARIA 1.2 patterns?',
      interviewerIntent: 'Testing practical a11y: keyboard navigation (Arrow keys, Esc, Home/End), aria-expanded, aria-activedescendant, and screen reader announcements.',
      talkingPoints: [
        'Input attributes: role="combobox", aria-autocomplete="list", aria-expanded, and aria-controls linking to listbox.',
        'Virtual focus: use aria-activedescendant pointing to active option ID to preserve focus inside the input.',
        'Live regions (aria-live="polite") to announce matching result count changes to screen readers.'
      ],
      gotchas: 'Using mouse-only onClick handlers on non-interactive div elements without keyboard handlers or tabindex.'
    },
    {
      id: 'fe8',
      category: 'Behavioral',
      targetSkill: 'Modernizing Legacy Codebases',
      question: 'How do you approach migrating a legacy jQuery or Class-component application to modern React & TypeScript without freezing feature releases?',
      interviewerIntent: 'Evaluating incremental migration strategies (Strangler Fig pattern), regression testing, and developer productivity.',
      talkingPoints: [
        'Strangler Fig pattern: embed modern React components into legacy pages one module at a time.',
        'Establish automated end-to-end regression tests (Playwright) covering critical user flows before refactoring.',
        'Share state via browser CustomEvents or window bus during intermediate transition periods.'
      ],
      starFramework: {
        situation: 'A core checkout flow was written in 6-year-old jQuery that caused frequent payment drop-offs and was impossible to test.',
        task: 'Migrate to TypeScript React components without halting regular marketing releases.',
        action: 'I set up Vite with module federation to mount React sub-trees into the legacy shell, migrating the payment method selector first.',
        result: 'Completed full migration in 6 sprints with zero customer downtime, reducing checkout bug tickets by 65%.'
      },
      gotchas: 'Demanding a 6-month complete freeze to rewrite the entire application from scratch.'
    },
    {
      id: 'fe9',
      category: 'Technical',
      targetSkill: 'Modern CSS & Layout Engines',
      question: 'Explain CSS Container Queries vs Media Queries, and when you would use CSS Subgrid.',
      interviewerIntent: 'Checking up-to-date modern CSS knowledge, responsive component-driven design, and layout optimization.',
      talkingPoints: [
        'Media queries respond to viewport dimensions; Container queries (@container) respond to the parent container\'s size.',
        'Container queries enable truly self-contained components that adapt whether placed in a narrow sidebar or wide hero section.',
        'CSS Subgrid allows nested child grid items to inherit row/column tracks from their grandparent grid, aligning card headers and footers across rows.'
      ],
      gotchas: 'Using fixed viewport media queries for reusable UI library components.'
    },
    {
      id: 'fe10',
      category: 'Behavioral',
      targetSkill: 'User-Centric Engineering',
      question: 'Tell me about a time you advocated for user experience improvements that required technical compromises.',
      interviewerIntent: 'Assessing empathy for real-world users on slow networks or accessibility devices.',
      talkingPoints: [
        'Focus on real user metrics: bounce rates on slow 3G connections, conversion drop-offs.',
        'Showcase how technical optimizations directly solved user frustration.'
      ],
      starFramework: {
        situation: 'Users in emerging markets complained that our web app crashed on 2GB RAM Android phones during document upload.',
        task: 'Cut client-side memory footprint by 50% without dropping key preview features.',
        action: 'I replaced an uncompressed canvas image preview with an efficient WebAssembly image resizer and Web Worker background upload.',
        result: 'Crash rate dropped from 8.2% to 0.1%, boosting mobile document submission by 34%.'
      },
      gotchas: 'Testing only on high-end M3 MacBook Pros with Gigabit fiber connections.'
    }
  ],
  'Backend Developer': [
    {
      id: 'be1',
      category: 'Technical',
      targetSkill: 'Concurrency & Locking',
      question: 'Explain the difference between Optimistic and Pessimistic concurrency control in database transactions. When would you use each?',
      interviewerIntent: 'Assessing database locking fundamentals, throughput trade-offs, and transaction isolation.',
      talkingPoints: [
        'Optimistic: Record version number or timestamp. Validates on commit. Ideal for low-contention read-heavy systems.',
        'Pessimistic: SELECT FOR UPDATE locks row physically until transaction ends. Ideal for high-contention financial ledger mutations.'
      ],
      gotchas: 'Using pessimistic locking in long-running API calls, which causes cascading database thread exhaustion.'
    },
    {
      id: 'be2',
      category: 'System Design',
      targetSkill: 'Event-Driven Architecture',
      question: 'Design a distributed notifications service capable of sending 100M push alerts, emails, and SMS per day with priority queues.',
      interviewerIntent: 'Testing queue partitioning, rate limiting against 3P providers, retries with exponential backoff, and dead-letter queues.',
      talkingPoints: [
        'Ingestion API -> Kafka topic partitioned by User ID -> Worker consumer groups.',
        'Multi-tiered priority queues: Priority 1 (OTP/Auth), Priority 2 (Transactional), Priority 3 (Marketing batch).',
        'Redis Token Bucket rate limiter per external vendor API to avoid HTTP 429 penalties.'
      ],
      gotchas: 'Ignoring third-party SMS/Email provider rate limits and failing to include Dead-Letter Queues (DLQ).'
    },
    {
      id: 'be3',
      category: 'Behavioral',
      targetSkill: 'Technical Debt Prioritization',
      question: 'How do you convince product managers to allocate engineering sprint capacity to refactor technical debt?',
      interviewerIntent: 'Assessing business alignment, quantitative reasoning, and stakeholder empathy.',
      talkingPoints: [
        'Quantify debt in product terms: increased deployment failure rate, slower feature velocity, or cloud infrastructure spend.',
        'Propose incremental boy-scout refactoring (20% continuous allocation) rather than a multi-month rewrite.'
      ],
      starFramework: {
        situation: 'Legacy monolith code had tangled database dependencies that doubled pull request review cycle time and caused 3 weekly release rollbacks.',
        task: 'Secure 2 full sprints to modularize database models into bounded contexts.',
        action: 'I charted release cycle duration against developer sentiment and calculated that technical regressions were costing $40k monthly in lost engineering hours.',
        result: 'Product leadership approved a dedicated stability sprint; post-refactor CI build times dropped 45% and releases stabilized.'
      },
      gotchas: 'Demanding a complete rewrite from scratch without business justification.'
    },
    {
      id: 'be4',
      category: 'Technical',
      targetSkill: 'Database Indexing & Query Optimization',
      question: 'How do B-Tree and Hash indexes differ, and why does column ordering matter in a composite multi-column B-Tree index?',
      interviewerIntent: 'Testing database internals, execution plans, index selectivity, and the Leftmost Prefix Rule.',
      talkingPoints: [
        'B-Tree indexes support equality and range queries (<, >, BETWEEN, ORDER BY); Hash indexes only support O(1) exact equality.',
        'Leftmost Prefix Rule: an index on (A, B, C) can satisfy queries on (A) or (A, B), but cannot satisfy a query on (B, C) alone.',
        'Order columns by equality filters first, followed by range filters and sort columns.'
      ],
      gotchas: 'Creating single-column indexes on every column hoping the optimizer merges them efficiently.'
    },
    {
      id: 'be5',
      category: 'System Design',
      targetSkill: 'Distributed Caching & Invalidation',
      question: 'How do you mitigate Cache Stampede (Thundering Herd) and Cache Penetration in high-traffic read-heavy systems?',
      interviewerIntent: 'Evaluating caching strategies: Cache-Aside vs Write-Through, probabilistic early expiration (XFetch), and Bloom filters.',
      talkingPoints: [
        'Cache Stampede: use distributed mutex locks (Redis Redlock) so only one worker queries the database on cache miss, or probabilistic early expiration.',
        'Cache Penetration (queries for non-existent keys): cache NULL values with short TTL, or use Bloom Filters at the gateway.',
        'Cache Avalanche: add random jitter to TTL expirations so keys do not expire simultaneously.'
      ],
      gotchas: 'Setting the exact same fixed TTL on millions of keys.'
    },
    {
      id: 'be6',
      category: 'Technical',
      targetSkill: 'gRPC vs REST vs GraphQL',
      question: 'When should a backend engineering team choose gRPC over REST or GraphQL for internal inter-service communication?',
      interviewerIntent: 'Evaluating protocol efficiency: Protobuf binary serialization, HTTP/2 multiplexing, bidirectional streaming, and contract strictness.',
      talkingPoints: [
        'gRPC uses Protocol Buffers: strongly-typed, up to 7x faster serialization and 10x smaller payload than JSON over HTTP/1.1.',
        'HTTP/2 multiplexing allows hundreds of concurrent RPC calls over a single TCP connection.',
        'Use REST or GraphQL for client-facing public web/mobile APIs where browser compatibility and flexible querying are paramount.'
      ],
      gotchas: 'Trying to use raw gRPC directly in browser clients without Envoy gRPC-Web proxy.'
    },
    {
      id: 'be7',
      category: 'System Design',
      targetSkill: 'Saga Pattern & Distributed Transactions',
      question: 'How do you maintain data consistency across multiple microservices without using slow two-phase commit (2PC) locks?',
      interviewerIntent: 'Testing distributed sagas (Choreography vs Orchestration), compensating transactions, and eventual consistency.',
      talkingPoints: [
        'Saga Pattern decomposes a distributed transaction into a series of local database transactions.',
        'Compensating transactions: if step 3 fails (e.g. payment declined), compensating actions roll back step 2 (reserve inventory) and step 1 (create order).',
        'Orchestration (centralized workflow coordinator) is easier to monitor than decentralized event choreography.'
      ],
      gotchas: 'Assuming you can use traditional ACID transactions across independent microservice databases.'
    },
    {
      id: 'be8',
      category: 'Behavioral',
      targetSkill: 'Graceful Degradation Under Load',
      question: 'Tell me about an instance when your backend was hit by an unexpected 10x traffic spike. How did your systems behave?',
      interviewerIntent: 'Assessing resilience patterns: circuit breakers, load shedding, backpressure, and graceful feature degradation.',
      talkingPoints: [
        'Implement circuit breakers (Netflix Hystrix / Resilience4j) to prevent cascading failures.',
        'Load shedding: drop non-essential traffic (recommendations, analytics) to preserve core transactional APIs.',
        'Dynamic autoscaling with sensible cooldown buffers.'
      ],
      starFramework: {
        situation: 'A national media mention caused our signup API to receive 12x normal traffic, overwhelming our primary database connection pool.',
        task: 'Prevent complete site outage and maintain user registration flow.',
        action: 'I enabled our load shedder to return cached recommendations, throttled background image processing queues, and increased read-replica pools.',
        result: 'Core registration succeeded for 98.5% of users without dropping database transactions.'
      },
      gotchas: 'Allowing one slow downstream dependency to exhaust thread pools and take down the entire API gateway.'
    },
    {
      id: 'be9',
      category: 'Technical',
      targetSkill: 'Authentication & Session Security',
      question: 'How do JWT token revocation and session invalidation work in a distributed, stateless backend architecture?',
      interviewerIntent: 'Evaluating the stateless vs stateful trade-off: short-lived access tokens, refresh token rotation, and Redis blacklists.',
      talkingPoints: [
        'Keep access tokens short-lived (5-15 minutes) so stolen tokens expire quickly.',
        'Use refresh token rotation: each refresh token is single-use; reusing an old token triggers automatic family revocation.',
        'For immediate ban/revocation: maintain a low-latency Redis Bloom filter or token revocation list checked during sensitive operations.'
      ],
      gotchas: 'Setting JWT access token expiration to 30 days without any revocation mechanism.'
    },
    {
      id: 'be10',
      category: 'Behavioral',
      targetSkill: 'Cross-Team API Contracts',
      question: 'How do you design and evolve public APIs without breaking existing mobile and third-party partner integrations?',
      interviewerIntent: 'Assessing API versioning strategies, deprecation policies, contract testing, and backwards compatibility.',
      talkingPoints: [
        'Semantic versioning and explicit deprecation windows with Sunset HTTP headers.',
        'Add, never remove or rename existing fields in payloads (additive schema evolution).',
        'Use consumer-driven contract tests (Pact) in CI pipelines.'
      ],
      starFramework: {
        situation: 'We needed to restructure our user address schema while 40+ enterprise partners consumed our legacy API v1.',
        task: 'Upgrade the data structure without breaking a single partner integration.',
        action: 'I designed v2 with backward-compatible adapters in the API gateway that dynamically transformed v2 responses into v1 schemas for legacy clients.',
        result: 'Successfully migrated 100% of internal clients and gave partners a seamless 12-month upgrade runway.'
      },
      gotchas: 'Renaming response fields and breaking mobile apps in production.'
    }
  ],
  'Data Analyst': [
    {
      id: 'da1',
      category: 'Technical',
      targetSkill: 'SQL Window Functions',
      question: 'Write or explain a query to calculate Month-over-Month (MoM) revenue growth percentage using SQL window functions.',
      interviewerIntent: 'Testing LAG() function, window partition/order, NULL handling, and mathematical conversion.',
      talkingPoints: [
        'Use LAG(monthly_revenue, 1) OVER (ORDER BY month) to retrieve prior month sales.',
        'Formula: (monthly_revenue - prior_month) * 100.0 / NULLIF(prior_month, 0).',
        'Wrap in a Common Table Expression (CTE) for clean query readability.'
      ],
      gotchas: 'Dividing by zero when the previous month has 0 revenue (use NULLIF).'
    },
    {
      id: 'da2',
      category: 'System Design',
      targetSkill: 'Data Modeling (Star Schema)',
      question: 'Design a Star Schema data mart for an e-commerce platform tracking order transactions, returns, and inventory.',
      interviewerIntent: 'Assessing dimensional modeling: Fact tables (additive metrics) vs Dimension tables (surrogate keys, SCDs).',
      talkingPoints: [
        'Fact_Orders: order_id, date_key, customer_key, product_key, quantity, gross_amount, discount_amount.',
        'Dim_Customer & Dim_Product: Type 2 Slowly Changing Dimensions (SCD) tracking history with valid_from/valid_to dates.'
      ],
      gotchas: 'Putting descriptive string attributes directly inside the high-volume fact table.'
    },
    {
      id: 'da3',
      category: 'Behavioral',
      targetSkill: 'Data Storytelling & Diplomacy',
      question: 'Describe a situation where your data analysis contradicted the CEO or founder’s intuition. How did you present your findings?',
      interviewerIntent: 'Testing courage, factual diplomacy, and visualization clarity.',
      talkingPoints: [
        'Lead with gratitude for their hypothesis, then present the numbers as an opportunity to protect capital.',
        'Use clear, uncluttered visualizations (waterfall charts or cohort retention heatmaps).'
      ],
      starFramework: {
        situation: 'Leadership believed a recent marketing campaign was driving record customer growth based on raw sign-up numbers.',
        task: 'Present cohort retention data showing that 85% of newly acquired users churned within 48 hours.',
        action: 'I built a 30-day cohort retention curve contrasting organic vs paid cohorts, demonstrating that the campaign was acquiring low-intent bot traffic.',
        result: 'The company reallocated $120,000 of ad budget to organic acquisition channels, saving marketing spend.'
      },
      gotchas: 'Being arrogant or treating leadership as foolish for having an intuitive hypothesis.'
    },
    {
      id: 'da4',
      category: 'Technical',
      targetSkill: 'Cohort Analysis & Retention',
      question: 'How do you calculate 30-day rolling customer retention cohorts in SQL and interpret the resulting triangle chart?',
      interviewerIntent: 'Evaluating customer analytics, date truncations, first-touch attribution, and cohort decay curves.',
      talkingPoints: [
        'Determine customer acquisition cohort using MIN(order_date) grouped by user_id.',
        'Join subsequent transactions with DATEDIFF(order_date, cohort_date) to bucket activity by month 0, 1, 2, etc.',
        'Interpret retention curve flattening: a curve that levels off horizontally indicates product-market fit.'
      ],
      gotchas: 'Conflating churn rate with acquisition drop-off.'
    },
    {
      id: 'da5',
      category: 'Technical',
      targetSkill: 'Statistical Significance & Simpson\'s Paradox',
      question: 'Explain Simpson\'s Paradox with a practical business analytics example and how you detect it.',
      interviewerIntent: 'Testing critical thinking, confounding variables, and segmentation depth beyond aggregate averages.',
      talkingPoints: [
        'Simpson\'s Paradox occurs when a trend appears in different groups of data but disappears or reverses when aggregated.',
        'Example: Conversion rate for treatment looks lower overall because treatment received 80% mobile traffic (which converts lower) while control received 80% desktop.',
        'Detection: always segment key metric analyses by primary dimensions (device, geography, user tier).'
      ],
      gotchas: 'Making business decisions based solely on aggregate top-line metrics without demographic segmentation.'
    },
    {
      id: 'da6',
      category: 'System Design',
      targetSkill: 'BI Dashboard Architecture',
      question: 'How do you architect an executive KPI dashboard in Tableau/PowerBI to maintain sub-3s query load times over 50M rows?',
      interviewerIntent: 'Evaluating data aggregation, incremental extract refreshes, summary tables, and dashboard ergonomics.',
      talkingPoints: [
        'Pre-aggregate metrics in dbt/SQL summary tables rather than querying raw transactional facts live in the BI tool.',
        'Use incremental extract refreshes instead of full daily data warehouse scans.',
        'Limit dashboard card density: avoid placing 25 complex visualizations with high-cardinality filters on a single page.'
      ],
      gotchas: 'Running live queries with 15 complex distinct counts on 50M rows every time an executive clicks a filter.'
    },
    {
      id: 'da7',
      category: 'Technical',
      targetSkill: 'dbt & Analytics Engineering',
      question: 'What is the role of dbt (data build tool) in modern data stacks, and how do ephemeral vs table vs incremental materializations differ?',
      interviewerIntent: 'Assessing analytics engineering practices: version-controlled transformations, automated testing, and modular data marts.',
      talkingPoints: [
        'dbt manages the \'T\' in ELT: writing modular SELECT statements with Jinja templates, dependency DAGs, and automated tests.',
        'View: queries underlying tables on demand. Table: full rebuild each run. Incremental: processes only new/modified rows via unique_key.',
        'Automated schema tests (unique, not_null, accepted_values) safeguard downstream reporting.'
      ],
      gotchas: 'Writing manual one-off SQL scripts directly in warehouse consoles without version control.'
    },
    {
      id: 'da8',
      category: 'Behavioral',
      targetSkill: 'Ad-hoc Request Triage',
      question: 'How do you prioritize competing urgent ad-hoc data requests from marketing, sales, and product leaders?',
      interviewerIntent: 'Assessing backlog management, business impact alignment, and self-serve empowerment.',
      talkingPoints: [
        'Evaluate request based on decision impact: "What specific decision or dollar allocation changes based on this answer?"',
        'Empower stakeholders with self-serve BI reporting for routine queries.',
        'Establish transparent ticketing SLAs and communicate timelines collaboratively.'
      ],
      starFramework: {
        situation: 'During end-of-quarter, I received 14 simultaneous urgent data requests from 4 department vice presidents.',
        task: 'Deliver critical insights without burning out or missing company-level deadlines.',
        action: 'I convened a 15-minute sync with stakeholders, ranked requests by revenue impact, and created a self-serve query template for 8 routine operational questions.',
        result: 'Delivered the top 6 high-impact analyses ahead of schedule while enabling teams to self-serve 50+ subsequent reports.'
      },
      gotchas: 'Dropping strategic roadmap work to fulfill whoever shouts the loudest in Slack.'
    },
    {
      id: 'da9',
      category: 'Technical',
      targetSkill: 'Funnel & Drop-off Analysis',
      question: 'How do you conduct an end-to-end checkout funnel drop-off analysis to pinpoint user abandonment causes?',
      interviewerIntent: 'Testing event instrumentation, step-by-step conversion tracking, and qualitative correlation.',
      talkingPoints: [
        'Define clear event states: View Cart -> Enter Shipping -> Select Payment -> Click Place Order.',
        'Calculate step conversion and overall drop-off velocity across key segments (browser, mobile OS, guest vs logged-in).',
        'Cross-reference high drop-off steps with session recordings (FullStory/Hotjar) and error log spikes.'
      ],
      gotchas: 'Assuming user drop-off is always UX confusion without verifying backend payment gateway errors.'
    },
    {
      id: 'da10',
      category: 'Behavioral',
      targetSkill: 'Influencing Product Strategy',
      question: 'Give an example of an exploratory analysis where you discovered an unexpected trend that shaped company product strategy.',
      interviewerIntent: 'Assessing proactive curiosity, initiative, and commercial value creation.',
      talkingPoints: [
        'Go beyond assigned tasks to inspect underlying user behavior patterns.',
        'Package discovery into an actionable business proposal.'
      ],
      starFramework: {
        situation: 'While auditing subscription cancellations, I noticed 38% of churned users were active in our export tool right before leaving.',
        task: 'Investigate the root cause behind why power users were canceling.',
        action: 'I ran a correlation study and discovered users were exporting data because our reporting lacked team sharing. I drafted a business case for a multi-user workspace tier.',
        result: 'Product launched the team workspace feature, resulting in a 28% reduction in power-user churn and $180k in new expansion revenue.'
      },
      gotchas: 'Only doing what is listed in Jira tickets without exploring data curiosities.'
    }
  ],
  'Cloud Architect': [
    {
      id: 'ca1',
      category: 'Technical',
      targetSkill: 'Multi-Region High Availability',
      question: 'How do you architect a multi-region Active-Active database setup with minimal cross-region latency?',
      interviewerIntent: 'Evaluating understanding of physical speed-of-light networking limits, consensus protocols (Spanner/CockroachDB), and replication lag.',
      talkingPoints: [
        'Understand trade-off: synchronous replication introduces 80ms+ round-trip latency across continents.',
        'Use multi-master or globally distributed serializable databases (Google Cloud Spanner, AWS Aurora Global Database).',
        'Partition data by geographical region (Geo-partitioning) so users read/write to their local region.'
      ],
      gotchas: 'Claiming you can have zero-latency instantaneous synchronous consistency across opposite sides of the globe.'
    },
    {
      id: 'ca2',
      category: 'System Design',
      targetSkill: 'Disaster Recovery (DR)',
      question: 'Design a Disaster Recovery strategy for a tier-1 financial system with an RTO of < 15 minutes and RPO of < 1 minute.',
      interviewerIntent: 'Testing recovery time objective (RTO), recovery point objective (RPO), automated DNS failover, and data replication.',
      talkingPoints: [
        'Continuous streaming WAL (Write-Ahead Log) replication to a warm standby secondary cloud region.',
        'Route53 / Cloudflare automated health check failover to route global traffic within 60 seconds.',
        'Automated IaC Terraform blueprints ensuring instant replica spinning.'
      ],
      gotchas: 'Confusing RTO (how long to restore service) with RPO (how much data loss is acceptable).'
    },
    {
      id: 'ca3',
      category: 'Behavioral',
      targetSkill: 'Cloud Cost Optimization (FinOps)',
      question: 'Tell me about an initiative where you dramatically optimized cloud infrastructure spend without compromising reliability.',
      interviewerIntent: 'Assessing FinOps acumen, reservation planning, and architectural efficiency.',
      talkingPoints: [
        'Audit idle compute, right-size over-provisioned instances based on p99 CPU/memory metrics.',
        'Leverage Savings Plans, Spot instances for fault-tolerant workers, and lifecycle rules for cold S3 tiering.'
      ],
      starFramework: {
        situation: 'Monthly AWS infrastructure bills ballooned by 65% following rapid user scaling.',
        task: 'Reduce cloud spend by at least 25% within 60 days while maintaining 99.99% service SLA.',
        action: 'I audited cloud resource utilization, migrated non-critical background Celery workers to Spot instance fleets, and converted steady-state databases to 3-year Compute Savings Plans.',
        result: 'Slashed monthly cloud bill by $42,000 (34% net reduction) with zero service disruptions.'
      },
      gotchas: 'Simply deleting servers without checking dependency graphs or monitoring peak traffic buffers.'
    },
    {
      id: 'ca4',
      category: 'Technical',
      targetSkill: 'Cloud Networking & Hybrid Transit',
      question: 'Explain how AWS Transit Gateway or GCP Cloud Interconnect manages peering between 50 VPCs and on-premises datacenters.',
      interviewerIntent: 'Evaluating cloud network topology: hub-and-spoke vs mesh peering, BGP routing, CIDR overlapping, and encryption in transit.',
      talkingPoints: [
        'Hub-and-spoke architecture: Transit Gateway acts as central cloud router, reducing N*(N-1)/2 mesh peering connections down to N attachments.',
        'Dedicated Direct Connect / Partner Interconnect with IPsec VPN failover for on-premises connectivity.',
        'Route tables per spoke VPC to enforce network segmentation between Production, Staging, and Shared Services.'
      ],
      gotchas: 'Building direct VPC peering meshes across dozens of VPCs that quickly hit routing table limits.'
    },
    {
      id: 'ca5',
      category: 'System Design',
      targetSkill: 'Zero Trust Security Architecture',
      question: 'How do you design a secure multi-account AWS Organizations / GCP Projects structure adhering to the Principle of Least Privilege?',
      interviewerIntent: 'Testing cloud governance: Service Control Policies (SCPs), dedicated Security/Log Archive accounts, and federated IAM.',
      talkingPoints: [
        'Dedicated core accounts: Security, Log Archive, Network Hub, Shared Services, and workload accounts (Prod, Non-Prod).',
        'Enforce guardrails via SCPs (e.g. deny unapproved cloud regions, prevent disabling CloudTrail, mandate encryption at rest).',
        'Federated identity with short-lived STS credentials via AWS IAM Identity Center or Okta.'
      ],
      gotchas: 'Running all production workloads, staging apps, and developer experiments in a single shared cloud account.'
    },
    {
      id: 'ca6',
      category: 'Technical',
      targetSkill: 'Serverless vs Containerized Workloads',
      question: 'When should an architect choose AWS Lambda / Cloud Run serverless architectures over Kubernetes (EKS / GKE)?',
      interviewerIntent: 'Assessing total cost of ownership (TCO), operational complexity, cold starts, stateful vs stateless workloads, and developer velocity.',
      talkingPoints: [
        'Choose Serverless for event-driven, spiky, or low-to-medium volume workloads where zero management overhead and scale-to-zero dominate.',
        'Choose Kubernetes when consistent high-throughput compute, GPU acceleration, custom networking, or multi-cloud portability are required.',
        'TCO calculation: serverless is cheaper for low/intermittent utilization; sustained 24/7 compute is often more cost-effective on dedicated nodes.'
      ],
      gotchas: 'Choosing Kubernetes for a simple CRUD app with a 2-person team because "it\'s trendy".'
    },
    {
      id: 'ca7',
      category: 'System Design',
      targetSkill: 'Data Lakehouse & Streaming Analytics',
      question: 'Architect an enterprise cloud data lakehouse processing 5 TB of incoming IoT telematics data daily with real-time analytics.',
      interviewerIntent: 'Testing streaming ingestion (Kinesis/Kafka), open table formats (Apache Iceberg/Delta Lake), and query engines (Athena/BigQuery).',
      talkingPoints: [
        'Ingestion: Kinesis Data Firehose buffers incoming telemetry directly into S3 raw Bronze tier.',
        'Storage: Open table formats (Apache Iceberg) provide ACID transactions, schema evolution, and partition pruning on object storage.',
        'Processing: Apache Spark / AWS Glue transforms raw data into Silver (cleaned) and Gold (aggregated business marts) tiers for Athena queries.'
      ],
      gotchas: 'Storing millions of tiny 1KB JSON files in S3 without compaction, causing extreme query scan penalties.'
    },
    {
      id: 'ca8',
      category: 'Behavioral',
      targetSkill: 'Vendor Lock-in Evaluation',
      question: 'How do you advise enterprise leadership on the trade-offs of using proprietary cloud services vs open-source multi-cloud solutions?',
      interviewerIntent: 'Assessing strategic balance: development velocity using managed services vs long-term vendor exit costs.',
      talkingPoints: [
        'Recognize the cost of portability: building an abstraction layer across clouds often doubles development time and yields lowest-common-denominator features.',
        'Embrace managed services where business velocity gains outweigh migration risk (e.g. managed databases, serverless compute).',
        'Standardize on portable interfaces: Docker containers, OpenAPI specs, SQL, and Terraform for infrastructure declarations.'
      ],
      starFramework: {
        situation: 'Leadership demanded we build a custom queuing system on bare VMs to avoid AWS SQS vendor lock-in.',
        task: 'Assess real operational costs and recommend the optimal architectural direction.',
        action: 'I prepared an ROI analysis showing that operating self-managed Kafka would require 2 dedicated SREs ($350k/yr), whereas managed SQS cost $400/month with 99.99% SLA.',
        result: 'Executive team approved managed SQS, accelerating our core product launch by 4 months.'
      },
      gotchas: 'Spending hundreds of thousands of dollars building custom layers just in case the company switches clouds in 10 years.'
    },
    {
      id: 'ca9',
      category: 'Technical',
      targetSkill: 'Immutable Infrastructure & GitOps',
      question: 'How do you structure Terraform and GitOps (ArgoCD/Flux) pipelines to prevent configuration drift across 200 cloud environments?',
      interviewerIntent: 'Assessing Infrastructure as Code (IaC) governance, state file locking, remote backends, and automated drift detection.',
      talkingPoints: [
        'Modular Terraform modules with strict semantic version tagging in private registries.',
        'Remote state in S3 with DynamoDB state locking to prevent concurrent apply conflicts.',
        'Automated daily drift detection scheduled in CI/CD to alert when resources are modified out-of-band via cloud consoles.'
      ],
      gotchas: 'Allowing developers to manually tweak cloud resources in production via the AWS/GCP web console.'
    },
    {
      id: 'ca10',
      category: 'Behavioral',
      targetSkill: 'Navigating Architectural Deadlocks',
      question: 'Tell me about an architectural decision where two senior engineering leads fundamentally disagreed. How did you break the deadlock?',
      interviewerIntent: 'Evaluating leadership, consensus building, objective decision matrices, and bias for action.',
      talkingPoints: [
        'Create a weighted decision matrix evaluating latency, cost, operational complexity, and team expertise.',
        'Run time-boxed proof-of-concept (POC) spikes to test hypotheses with empirical benchmark numbers.',
        'Champion the principle of "Disagree and Commit" once a decision is finalized.'
      ],
      starFramework: {
        situation: 'Two principal architects argued for 3 weeks over adopting GraphQL vs gRPC for internal backend communication.',
        task: 'Unblock the engineering organization and establish a clear architectural standard.',
        action: 'I defined a 4-day spike where both teams built a prototype service under production load conditions and benchmarked serialization latency and developer DX.',
        result: 'The data clearly demonstrated gRPC was 5x faster for our high-frequency internal RPCs while GraphQL excelled on the mobile gateway, leading to unanimous consensus.'
      },
      gotchas: 'Letting architectural debates stall engineering teams for months without testing empirical data.'
    }
  ],
  'DevOps Engineer': [
    {
      id: 'do1',
      category: 'Technical',
      targetSkill: 'Kubernetes Pod Networking',
      question: 'How does CNI (Container Network Interface) routing work inside a Kubernetes cluster? What happens during a Pod-to-Pod network call across nodes?',
      interviewerIntent: 'Testing networking depth: overlay networks (VXLAN/Geneve), iptables/eBPF routing, and kube-proxy.',
      talkingPoints: [
        'Every Pod gets its own unique cluster-routable IP address.',
        'CNI plugins (Cilium, Calico, Flannel) encapsulate packets across node interfaces using VXLAN tunnels or direct BGP routing.',
        'Modern CNI plugins leverage eBPF in the Linux kernel to bypass slow iptables rules.'
      ],
      gotchas: 'Assuming traffic goes through Docker bridge interfaces on modern Kubernetes nodes.'
    },
    {
      id: 'do2',
      category: 'System Design',
      targetSkill: 'Zero-Downtime Deployment',
      question: 'Design an automated CI/CD release pipeline incorporating canary deployments, automated rollbacks on error spikes, and security scans.',
      interviewerIntent: 'Testing automated testing gates, SAST/DAST vulnerability scanning, Argo Rollouts, and metric thresholds.',
      talkingPoints: [
        'Git commit -> GitHub Actions -> Trivy container vulnerability scan -> Helm package -> ArgoCD.',
        'Argo Rollouts routes 10% traffic to canary; Prometheus queries monitor HTTP 5xx error rate and p99 latency.',
        'If error rate exceeds 0.5%, pipeline automatically halts and rolls back in < 15 seconds.'
      ],
      gotchas: 'Not including health probe metrics before increasing canary traffic steps.'
    },
    {
      id: 'do3',
      category: 'Behavioral',
      targetSkill: 'On-Call Incident Escalation',
      question: 'How do you handle being woken up at 3 AM for a sev-1 production outage with incomplete alert documentation?',
      interviewerIntent: 'Assessing composure under pressure, runbook maintenance, and proactive post-incident communication.',
      talkingPoints: [
        'Follow structured triage: verify blast radius, communicate status to on-call channel, and roll back recent releases first.',
        'Post-incident: update runbooks immediately so the next engineer has an automated resolution script.'
      ],
      starFramework: {
        situation: 'PagerDuty alerted for widespread 502 Bad Gateway errors on our primary API gateway at 3:15 AM.',
        task: 'Restore API availability immediately and prevent customer data corruption.',
        action: 'I inspected node memory pressure, found an unindexed database query flooding connection pools, capped max worker pool connections, and spun up 4 additional read-replicas.',
        result: 'Restored service in 9 minutes; subsequent post-mortem introduced connection pool circuit breakers and automated alert runbooks.'
      },
      gotchas: 'Panicking, debugging live in production without taking a snapshot or communicating status.'
    },
    {
      id: 'do4',
      category: 'Technical',
      targetSkill: 'Observability & Distributed Tracing',
      question: 'How do you implement OpenTelemetry distributed tracing across microservices to pinpoint latency bottlenecks?',
      interviewerIntent: 'Evaluating traces, spans, context propagation (W3C TraceContext headers), and sampling strategies.',
      talkingPoints: [
        'Context propagation injects traceparent HTTP headers so downstream services correlate child spans to the parent trace ID.',
        'Head-based vs tail-based sampling: tail-based sampling retains 100% of error traces and high-latency anomalies while discarding mundane 200 OKs.',
        'Instrument database queries and external RPC calls to visualize exact time breakdown in Jaeger / Grafana Tempo.'
      ],
      gotchas: 'Attempting to collect 100% unsampled traces at 50k req/sec, which overwhelms tracing storage.'
    },
    {
      id: 'do5',
      category: 'Technical',
      targetSkill: 'Linux Internals & Kernel Troubleshooting',
      question: 'An application pod is stuck in CrashLoopBackOff with exit code 137. How do you diagnose and resolve it?',
      interviewerIntent: 'Testing Linux memory management, OOM (Out Of Memory) killer, cgroups limits, and kernel diagnostics.',
      talkingPoints: [
        'Exit code 137 = 128 + 9 (SIGKILL), indicating the Linux kernel OOM Killer terminated the process.',
        'Run `kubectl describe pod` to inspect `Last State: Terminated, Reason: OOMKilled`.',
        'Inspect cgroup memory limits, profile application heap growth, or increase `resources.limits.memory`.'
      ],
      gotchas: 'Assuming exit code 137 is an application syntax error.'
    },
    {
      id: 'do6',
      category: 'System Design',
      targetSkill: 'Secrets Management & Ephemeral Credentials',
      question: 'How do you design a secure secrets management system that eliminates hardcoded API keys and credentials across CI/CD and production pods?',
      interviewerIntent: 'Assessing HashiCorp Vault, AWS Secrets Manager, Kubernetes External Secrets Operator, and short-lived tokens.',
      talkingPoints: [
        'Centralized Vault with Kubernetes service account authentication (OIDC).',
        'External Secrets Operator syncs secrets directly into native Kubernetes Secrets in memory.',
        'Use dynamic ephemeral credentials (e.g. database credentials with 1-hour TTL that auto-rotate) rather than static passwords.'
      ],
      gotchas: 'Committing .env files or raw base64 secrets directly into Git repositories.'
    },
    {
      id: 'do7',
      category: 'Technical',
      targetSkill: 'Docker Image Optimization & Security',
      question: 'How do you optimize a Docker container image from 1.4 GB down to under 80 MB while improving security posture?',
      interviewerIntent: 'Evaluating multi-stage builds, minimal base images (Alpine/Distroless), non-root users, and layer caching.',
      talkingPoints: [
        'Multi-stage build: compile binaries in builder stage and copy only runtime artifacts into final minimal image.',
        'Use Google Distroless or Alpine Linux to strip package managers, shells, and unnecessary C libraries.',
        'Enforce `USER nonroot` to prevent privilege escalation vulnerabilities.'
      ],
      gotchas: 'Running container processes as the default root user in production.'
    },
    {
      id: 'do8',
      category: 'Behavioral',
      targetSkill: 'DevOps Transformation & Cultural Buy-in',
      question: 'How do you transition a traditional development team from "throwing code over the wall" to true DevOps ownership?',
      interviewerIntent: 'Evaluating empathy, enablement over gatekeeping, self-service developer platforms, and blameless cultures.',
      talkingPoints: [
        'Build self-service internal developer platforms (IDP) rather than acting as a human ticket-processing queue.',
        'Pair on-call rotations: developers rotate on-call for the services they write.',
        'Institute blameless post-mortems focused on systemic safety improvements rather than individual blame.'
      ],
      starFramework: {
        situation: 'Developers waited up to 5 days for the operations team to manually provision cloud staging environments.',
        task: 'Empower developers to provision environments on-demand while maintaining security guardrails.',
        action: 'I developed automated PR preview environments using Helm and ArgoCD that spin up on branch creation and terminate on PR merge.',
        result: 'Deployment cycle time plummeted from 5 days to 8 minutes, and developer satisfaction scores reached an all-time high.'
      },
      gotchas: 'Acting like a gatekeeper who refuses to give developers access to logs or deployment tools.'
    },
    {
      id: 'do9',
      category: 'System Design',
      targetSkill: 'Infrastructure as Code at Scale',
      question: 'How do you manage Terraform state files, lock contention, and drift across 50 engineering squads?',
      interviewerIntent: 'Testing modular architecture, remote backend locking, Terragrunt, and automated plan reviews (Atlantis/Spacelift).',
      talkingPoints: [
        'Break monolithic state files into isolated micro-states by environment and service domain.',
        'Use Atlantis or GitHub Actions with OIDC for automated PR plan and apply with peer review approvals.',
        'Run automated scheduled plan checks to identify manual configuration drift immediately.'
      ],
      gotchas: 'Keeping all cloud infrastructure in a single 10,000-line main.tf state file.'
    },
    {
      id: 'do10',
      category: 'Behavioral',
      targetSkill: 'Managing Alert Fatigue',
      question: 'Our engineering team receives 200 PagerDuty alerts per week and ignores most of them. How do you fix alert fatigue?',
      interviewerIntent: 'Assessing SLO-based alerting, actionable alerts, noise reduction, and signal-to-noise ratio.',
      talkingPoints: [
        'Alert on symptoms (user-facing SLOs: error rate, latency), not causes (high CPU on a single worker).',
        'Golden rule: if an alert does not require immediate human intervention, delete it or downgrade to a weekly digest report.',
        'Require every firing alert to link to an automated runbook with exact remediation steps.'
      ],
      starFramework: {
        situation: 'Engineers suffered from severe alert fatigue with 300+ weekly pages, resulting in a missed real outage alert.',
        task: 'Eliminate alert noise and restore confidence in on-call paging.',
        action: 'I audited all alerts, transitioned 75% of threshold checks to SLO burn-rate alerts, and silenced flapping warnings with automated self-healing scripts.',
        result: 'Cut weekly pages from 300 to 14 actionable alerts, and team on-call burnout was eliminated.'
      },
      gotchas: 'Setting low CPU threshold alerts that fire every time a batch job starts.'
    }
  ],
  'Machine Learning Engineer': [
    {
      id: 'mle1',
      category: 'Technical',
      targetSkill: 'Model Quantization & Inference',
      question: 'How do Quantization (INT8/FP4) and KV Caching reduce latency and VRAM footprint during Large Language Model (LLM) inference?',
      interviewerIntent: 'Testing state-of-the-art inference optimization, GPU memory bandwidth limits, and computational precision trade-offs.',
      talkingPoints: [
        'Quantization maps 16-bit floating point weights to 8-bit or 4-bit integers, reducing memory bandwidth pressure and fitting larger models onto fewer GPUs.',
        'KV Caching stores previously computed Key and Value attention tensors so past tokens are not recomputed at each generative token step.'
      ],
      gotchas: 'Confusing model quantization (shrinking weights) with pruning (removing zeroed weights).'
    },
    {
      id: 'mle2',
      category: 'System Design',
      targetSkill: 'Real-Time Feature Store',
      question: 'Architect a real-time feature store providing sub-10ms feature retrieval for a fraud detection model scoring 50,000 transactions/sec.',
      interviewerIntent: 'Evaluating online vs offline store synchronization (Redis vs BigQuery/Snowflake), point-in-time correctness, and streaming ingestion.',
      talkingPoints: [
        'Dual-store architecture: Redis cluster (online low-latency store) + Snowflake/S3 (offline historical store for training).',
        'Streaming pipeline: Apache Flink consumes Kafka events, calculates sliding window features (e.g. transactions in last 10 min), and updates Redis.',
        'Point-in-time joins prevent data leakage during training set generation.'
      ],
      gotchas: 'Querying raw relational databases or running heavy aggregations during the real-time scoring request path.'
    },
    {
      id: 'mle3',
      category: 'Behavioral',
      targetSkill: 'Model Governance & Safety',
      question: 'Have you ever had to stop a high-performing model from being deployed due to ethical bias or data fairness issues?',
      interviewerIntent: 'Evaluating ethical integrity, bias audits, and willingness to stand up for safety over short-term metrics.',
      talkingPoints: [
        'Explain fairness metrics: Demographic Parity vs Equalized Odds.',
        'Collaborate with compliance and product teams to re-balance training distributions.'
      ],
      starFramework: {
        situation: 'A credit limit approval model showed a 94% accuracy score but exhibited a 19% disparate impact disparity across age demographics.',
        task: 'Halt deployment and re-engineer feature representations to ensure fair lending compliance.',
        action: 'I flagged the disparity to executive leadership, removed proxy variables correlated with age, and introduced fairness constraints into the objective loss function.',
        result: 'Reduced disparate impact to within regulatory thresholds with only a negligible 0.6% drop in overall predictive accuracy.'
      },
      gotchas: 'Ignoring bias metrics as long as overall accuracy or profit numbers look good.'
    },
    {
      id: 'mle4',
      category: 'Technical',
      targetSkill: 'Distributed Training & Parallelism',
      question: 'Explain the difference between Data Parallelism (DDP), Pipeline Parallelism, and Tensor Parallelism (Megatron-LM) when training multi-billion parameter models.',
      interviewerIntent: 'Testing deep knowledge of distributed GPU training, NCCL communication, and GPU memory saturation.',
      talkingPoints: [
        'Data Parallelism (DDP/FSDP): replicates model weights across GPUs and shuffles batches, synchronizing gradients via AllReduce.',
        'Tensor Parallelism: splits individual matrix multiplications (e.g. linear layers) across multiple GPUs within the same node (NVLink).',
        'Pipeline Parallelism: splits layers sequentially across different GPU nodes to overcome VRAM capacity limitations.'
      ],
      gotchas: 'Attempting to run Tensor Parallelism across slow inter-node Ethernet connections instead of high-bandwidth NVLink.'
    },
    {
      id: 'mle5',
      category: 'Technical',
      targetSkill: 'Transformer Attention Mechanisms',
      question: 'Explain the computational complexity of standard Multi-Head Attention vs FlashAttention and Grouped-Query Attention (GQA).',
      interviewerIntent: 'Evaluating attention memory bottlenecks, IO-awareness in CUDA kernels, and memory efficiency.',
      talkingPoints: [
        'Standard Self-Attention has O(N^2) memory and compute complexity with sequence length N, bound by GPU HBM read/write IO.',
        'FlashAttention tiles computation in fast on-chip SRAM, avoiding materializing the full N x N attention matrix in slow GPU memory.',
        'Grouped-Query Attention (GQA) shares key/value heads across multiple query heads, slashing KV cache size while retaining quality.'
      ],
      gotchas: 'Thinking FlashAttention changes the mathematical attention output (it is an exact, not approximate, mathematical equivalence).'
    },
    {
      id: 'mle6',
      category: 'System Design',
      targetSkill: 'Vector Search & ANN Scaling',
      question: 'Design a scalable vector search infrastructure serving 100M 1536-dimensional embeddings with p99 latency < 20ms.',
      interviewerIntent: 'Testing vector index algorithms (HNSW, IVF-PQ), memory sizing, and sharding strategies.',
      talkingPoints: [
        'Memory calculation: 100M vectors * 1536 floats * 4 bytes ≈ 614 GB raw RAM required for uncompressed vectors.',
        'Use Product Quantization (IVF-PQ) to compress vector representations by up to 90%, fitting into memory with negligible recall loss.',
        'Distribute index across shards with read-replicas behind a consistent hashing query router (Milvus, Qdrant, Pinecone).'
      ],
      gotchas: 'Forgetting to calculate raw RAM requirements and crashing single-node vector databases.'
    },
    {
      id: 'mle7',
      category: 'Technical',
      targetSkill: 'Fine-Tuning Techniques (LoRA / QLoRA)',
      question: 'How does Low-Rank Adaptation (LoRA) work mathematically, and why does it drastically reduce fine-tuning memory?',
      interviewerIntent: 'Assessing parameter-efficient fine-tuning (PEFT), rank decomposition, and frozen pre-trained weights.',
      talkingPoints: [
        'LoRA freezes pre-trained weight matrix W0 and decomposes the weight update delta into two low-rank matrices: delta_W = B * A, where rank r << d.',
        'Reduces trainable parameters by 99% (e.g. from 7B to 20M parameters), eliminating optimizer state memory for the frozen base model.',
        'QLoRA quantizes the base model to 4-bit NormalFloat (NF4) while computing gradients through LoRA adapters in 16-bit precision.'
      ],
      gotchas: 'Thinking LoRA degrades inference speed (adapters can be merged directly into base weights with zero inference penalty).'
    },
    {
      id: 'mle8',
      category: 'Behavioral',
      targetSkill: 'Bridging Research to Production',
      question: 'How do you handle research scientists who build cutting-edge PyTorch models that cannot satisfy production latency budgets?',
      interviewerIntent: 'Evaluating empathy, technical translation, benchmarking, and collaborative optimization.',
      talkingPoints: [
        'Involve MLEs early in model design rather than waiting for finished weights.',
        'Demonstrate empirical profiling data: show exact latency bottlenecks in CUDA kernel traces.',
        'Apply optimizations collaboratively: ONNX export, TensorRT compilation, distillation, and pruning.'
      ],
      starFramework: {
        situation: 'Research delivered a 3-second multimodal model for customer checkout that exceeded our 200ms latency SLA.',
        task: 'Reduce latency by 90% without compromising core recognition accuracy.',
        action: 'I converted the model graph to TensorRT, quantized weights to FP8, and distilled the vision backbone into a student network.',
        result: 'Dropped inference time to 140ms with a negligible 0.4% loss in accuracy, meeting the SLA.'
      },
      gotchas: 'Throwing hands up and saying "research gave us garbage, we can\'t ship this".'
    },
    {
      id: 'mle9',
      category: 'System Design',
      targetSkill: 'Continuous Model Retraining & Evaluation',
      question: 'Design an automated model retraining pipeline with automated champion/challenger shadow deployments.',
      interviewerIntent: 'Testing end-to-end MLOps: Airflow/Kubeflow pipelines, data validation (Great Expectations), and canary traffic routing.',
      talkingPoints: [
        'Trigger retraining on data drift alert or schedule via Kubeflow Pipelines.',
        'Automated offline validation gates: model must beat production champion on golden holdout set across accuracy, latency, and fairness.',
        'Shadow deployment: route 100% of live traffic to shadow model asynchronously to monitor predictions without serving to users.'
      ],
      gotchas: 'Automatically deploying retrained models straight to 100% live traffic without validation gates.'
    },
    {
      id: 'mle10',
      category: 'Behavioral',
      targetSkill: 'Cost-Conscious GPU Utilization',
      question: 'Tell me about how you optimized GPU compute cluster spend during heavy model training and inference.',
      interviewerIntent: 'Evaluating GPU cost consciousness, spot instance orchestration, and batching efficiency.',
      talkingPoints: [
        'Dynamic batching (Triton Inference Server) groups concurrent requests to saturate GPU compute cores.',
        'Orchestrate spot instance training with automated checkpointing and fault recovery.',
        'Scale inference replicas to zero during off-peak hours.'
      ],
      starFramework: {
        situation: 'Monthly cloud GPU spend jumped to $68,000 due to dedicated idle A100 instances reserved for inference.',
        task: 'Cut cluster costs by at least 40% while preserving sub-second SLAs.',
        action: 'I deployed Triton Inference Server with dynamic batching and migrated inference to L4 GPUs, setting up auto-scaling rules based on request queue depth.',
        result: 'Reduced monthly GPU spend by 48% ($32,000/month saved) while maintaining 99.9% uptime.'
      },
      gotchas: 'Leaving idle 8x A100 GPU clusters running 24/7 over weekends with zero training jobs.'
    }
  ],
  'Cyber Security Analyst': [
    {
      id: 'cs1',
      category: 'Technical',
      targetSkill: 'Zero-Day Vulnerability Triage',
      question: 'Walk me through your methodology when a critical Remote Code Execution (RCE) vulnerability (like Log4j) is disclosed in your stack.',
      interviewerIntent: 'Testing emergency threat containment, software bill of materials (SBOM), patching cadences, and WAF mitigation.',
      talkingPoints: [
        'Identify attack surface: query SBOM and dependency scanners (Snyk, Dependency-Check) for impacted artifacts.',
        'Immediate perimeter shielding: deploy custom WAF regex rules to block exploit strings before code can be patched.',
        'Rapid build and release: rebuild images with patched dependencies and trigger blue/green rolling rollout.'
      ],
      gotchas: 'Waiting days for full code regression tests while leaving perimeter WAF rules unconfigured.'
    },
    {
      id: 'cs2',
      category: 'System Design',
      targetSkill: 'Enterprise IAM & Zero Trust',
      question: 'Design an enterprise Zero Trust Identity and Access Management (IAM) architecture for 5,000 hybrid employees accessing cloud infrastructure.',
      interviewerIntent: 'Evaluating Single Sign-On (SAML/OIDC), Context-Aware Access, hardware security keys (FIDO2/WebAuthn), and ephemeral credentials.',
      talkingPoints: [
        'Identity Provider (Okta/Entra ID) with mandated FIDO2 WebAuthn hardware tokens.',
        'Context-aware conditional access: device health posture check, geolocation anomaly detection, and ephemeral short-lived certificates via HashiCorp Vault.',
        'Eliminate long-lived static API keys and passwords in favor of role-based IAM assumptions.'
      ],
      gotchas: 'Relying on SMS-based 2FA, which is vulnerable to SIM swapping and SS7 interception.'
    },
    {
      id: 'cs3',
      category: 'Behavioral',
      targetSkill: 'Security Culture vs Developer Friction',
      question: 'How do you foster a proactive security culture without developers viewing the security team as a roadblock to shipping code?',
      interviewerIntent: 'Assessing empathy for developer velocity, automated shift-left security, and developer evangelism.',
      talkingPoints: [
        'Shift security left: integrate non-blocking automated linters and PR comments directly into IDEs and GitHub workflows.',
        'Champion developer security advocates within each engineering squad.'
      ],
      starFramework: {
        situation: 'Developers frequently bypassed security reviews because manual approval gates delayed sprint deployments by over 4 days.',
        task: 'Eliminate review friction while enhancing codebase vulnerability detection.',
        action: 'I replaced the manual ticket queue with automated PR security scans that auto-approved 90% of low-risk pull requests and provided 1-click remediation code snippets.',
        result: 'Deployment cycle time dropped by 3 days while vulnerabilities caught prior to production increased by 40%.'
      },
      gotchas: 'Acting like a security gatekeeper who mandates impossible manual bureaucratic hurdles.'
    },
    {
      id: 'cs4',
      category: 'Technical',
      targetSkill: 'SIEM & Threat Hunting',
      question: 'How do you formulate a threat hunting query in Splunk / Elastic to detect adversary lateral movement via Pass-the-Hash or Kerberoasting?',
      interviewerIntent: 'Testing Active Directory security, Windows Event IDs (4624, 4768, 4769), and MITRE ATT&CK framework mapping.',
      talkingPoints: [
        'Kerberoasting: search for Event ID 4769 (TGS request) with encryption type 0x17 (RC4-HMAC) for service accounts with high privileges.',
        'Pass-the-Hash: search for Event ID 4624 Type 3 network logons with NTLM authentication rather than Kerberos across internal workstations.',
        'Correlate with anomalous endpoint process creations (e.g. mimikatz or powershell executing encoded commands).'
      ],
      gotchas: 'Only searching for known malware file hashes instead of behavioral TTPs (Tactics, Techniques, and Procedures).'
    },
    {
      id: 'cs5',
      category: 'System Design',
      targetSkill: 'Incident Response & Containment',
      question: 'Design an automated Incident Response playbook for containing an active ransomware breach on an AWS EC2 instance.',
      interviewerIntent: 'Evaluating containment speed, forensic evidence preservation, isolation mechanisms, and communication security.',
      talkingPoints: [
        'Automated isolation: modify EC2 security groups to isolate the infected instance, blocking all ingress/egress while allowing only a forensic bastion IP.',
        'Preserve evidence: take an immediate EBS volume snapshot and memory dump before terminating the instance.',
        'Out-of-band communication: switch security and executive teams to an isolated communication channel (Signal / separate Slack instance).'
      ],
      gotchas: 'Immediately powering off or rebooting the machine, which destroys critical volatile RAM evidence.'
    },
    {
      id: 'cs6',
      category: 'Technical',
      targetSkill: 'Web Application Pentesting (OWASP Top 10)',
      question: 'Explain how Server-Side Request Forgery (SSRF) vulnerabilities work, and how an attacker can leverage them to steal AWS IAM metadata credentials.',
      interviewerIntent: 'Testing cloud security, IMDSv1 vs IMDSv2, input validation, and egress network filtering.',
      talkingPoints: [
        'SSRF occurs when a backend server fetches a remote resource based on untrusted user input without proper validation.',
        'In AWS, attackers target the Instance Metadata Service at `http://169.254.169.254/latest/meta-data/iam/security-credentials/` to steal temporary STS keys.',
        'Mitigation: enforce IMDSv2 (requires session token PUT request that SSRF cannot easily spoof) and egress firewall blocking link-local IPs.'
      ],
      gotchas: 'Assuming internal loopback/metadata IPs are unreachable from web servers.'
    },
    {
      id: 'cs7',
      category: 'Technical',
      targetSkill: 'Cryptography & TLS Security',
      question: 'What is Perfect Forward Secrecy (PFS) in TLS handshakes, and why is it critical for enterprise communications?',
      interviewerIntent: 'Evaluating cryptographic fundamentals, Diffie-Hellman ephemeral key exchange (DHE/ECDHE), and retroactive eavesdropping protection.',
      talkingPoints: [
        'PFS ensures that even if a server\'s long-term private key is compromised in the future, past recorded encrypted sessions cannot be decrypted.',
        'Achieved using Ephemeral Diffie-Hellman key exchanges (ECDHE) where session keys are generated dynamically and discarded immediately.',
        'Contrast with legacy RSA key exchange where encrypting with the server\'s static public key allows retroactive decryption if the private key leaks.'
      ],
      gotchas: 'Thinking HTTPS certificates alone provide PFS without verifying cipher suites.'
    },
    {
      id: 'cs8',
      category: 'Behavioral',
      targetSkill: 'Executive Breach Communication',
      question: 'You discovered that customer personal data was exposed in an unauthenticated S3 bucket for 3 weeks. How do you communicate this to the C-suite and Legal?',
      interviewerIntent: 'Assessing crisis management, factual accuracy, legal privilege awareness, and regulatory compliance (GDPR/CCPA/SEC).',
      talkingPoints: [
        'Stick strictly to verified facts: timeline, scope of exposed data, whether evidence exists of external access in CloudTrail logs.',
        'Do not speculate or make statements admitting legal liability in unofficial chat channels.',
        'Present immediate remediation taken and a concrete containment roadmap for regulatory disclosure.'
      ],
      starFramework: {
        situation: 'A misconfigured analytics export script left an S3 bucket containing 14,000 customer email addresses publicly readable.',
        task: 'Secure the bucket, determine external exposure, and report to Executive and Legal leadership within 2 hours.',
        action: 'I immediately restricted bucket permissions, analyzed CloudTrail access logs to verify that only 1 external IP had accessed the file, and briefed General Counsel with the facts.',
        result: 'Legal executed regulatory notifications smoothly with zero regulatory fines, and we instituted automated AWS Config rules that auto-remediate public S3 buckets.'
      },
      gotchas: 'Attempting to hide or delete logs to cover up the incident.'
    },
    {
      id: 'cs9',
      category: 'System Design',
      targetSkill: 'Software Supply Chain Security',
      question: 'How do you secure an enterprise software supply chain against malicious packages (like dependency confusion and typo-squatting)?',
      interviewerIntent: 'Testing modern software supply chain defenses: private artifact registries, scoped packages, SLSA frameworks, and code signing.',
      talkingPoints: [
        'Enforce internal scoped package registries (e.g. Artifactory / GitHub Packages) with private namespace reservations to prevent dependency confusion.',
        'Lockfiles (package-lock.json, poetry.lock) with strict cryptographic SHA-512 integrity hashes.',
        'Automated dependency scanning in CI (Socket.dev, Snyk) that flags new packages with suspicious install scripts.'
      ],
      gotchas: 'Allowing developers to install arbitrary external open-source packages directly from public NPM without verification.'
    },
    {
      id: 'cs10',
      category: 'Behavioral',
      targetSkill: 'Security vs Business Deadlines',
      question: 'Product leadership wants to launch a new feature before the end of the quarter, but it failed its static application security testing (SAST). How do you resolve this?',
      interviewerIntent: 'Assessing risk assessment, temporary compensating controls, and executive alignment.',
      talkingPoints: [
        'Differentiate critical exploitable vulnerabilities from false positives and low-risk informational warnings.',
        'If a high-risk flaw exists, offer temporary compensating controls (e.g. WAF virtual patch, feature-flagging the vulnerable endpoint).',
        'If risk remains unacceptable, communicate the specific business impact (financial liability, brand damage) clearly to decision makers.'
      ],
      starFramework: {
        situation: 'A critical payment integration had a potential SQL injection vulnerability in an internal admin endpoint 48 hours before launch.',
        task: 'Protect the database without causing the entire release to be postponed.',
        action: 'I worked alongside the backend engineer to replace the raw query with parameterized ORM bindings in 3 hours, and added a specific integration test.',
        result: 'The vulnerability was resolved within the afternoon, security approval was granted, and the product launched on time.'
      },
      gotchas: 'Blindly rubber-stamping critical vulnerabilities just to hit a marketing deadline.'
    }
  ],
  'Product Manager': [
    {
      id: 'pm1',
      category: 'Technical',
      targetSkill: 'A/B Experimentation & Metrics',
      question: 'How do you design a rigorous experimentation roadmap when key metrics like user retention take months to measure?',
      interviewerIntent: 'Evaluating understanding of leading vs lagging indicators, surrogate metrics, and statistical power.',
      talkingPoints: [
        'Identify validated leading indicator surrogate metrics (e.g. 3 core actions completed in first 7 days) that correlate strongly with 90-day retention.',
        'Ensure sample size is powered adequately using MDE (Minimum Detectable Effect) calculations.',
        'Guardrail metrics: verify feature increases conversion without hurting app crash rates or customer support ticket volume.'
      ],
      gotchas: 'Measuring vanity metrics like page views without tying to retention or revenue.'
    },
    {
      id: 'pm2',
      category: 'System Design',
      targetSkill: 'Feature Scoping & Trade-offs',
      question: 'How do you define the Minimum Viable Product (MVP) for an AI-powered enterprise search tool facing aggressive competitors?',
      interviewerIntent: 'Testing ruthless prioritization (RICE framework), user feedback loops, and scope creep management.',
      talkingPoints: [
        'Focus on the core job-to-be-done: searching internal Google Drive and Slack documents with high accuracy.',
        'Cut non-essential nice-to-haves (like custom styling or 50 integrations) for v1 launch.',
        'Build instrumentation to measure retrieval relevance feedback (thumbs up/down) from day one.'
      ],
      gotchas: 'Trying to ship every competitor feature in v1, delaying release by 9 months.'
    },
    {
      id: 'pm3',
      category: 'Behavioral',
      targetSkill: 'Cross-functional Disagreement',
      question: 'Tell me about a time when engineering insisted a feature was impossible, but customers desperately needed it. How did you resolve it?',
      interviewerIntent: 'Assessing curiosity, collaborative problem deconstruction, and technical respect.',
      talkingPoints: [
        'Do not dispute the engineering difficulty; understand the specific technical constraint (latency, database schema, scale).',
        'Break down the user need to find a 80/20 alternative that solves 90% of the customer pain with 10% of the engineering complexity.'
      ],
      starFramework: {
        situation: 'Enterprise customers demanded real-time audit logging for every document edit, but backend engineers noted that streaming every keystroke would crash our database.',
        task: 'Deliver the compliance audit trail without causing severe backend latency.',
        action: 'I dug into the compliance requirements and found that auditors only required document version snapshots every 15 minutes, not sub-second keystrokes.',
        result: 'Engineers implemented snapshot diffs in 3 days, closing a $240k enterprise deal while preserving system stability.'
      },
      gotchas: 'Assuming engineers are lazy, or demanding they work overtime to build bad architecture.'
    },
    {
      id: 'pm4',
      category: 'Technical',
      targetSkill: 'Unit Economics & Pricing Strategy',
      question: 'How would you evaluate transitioning an enterprise SaaS product from per-seat subscription pricing to consumption/usage-based pricing?',
      interviewerIntent: 'Assessing commercial acumen, churn dynamics, revenue predictability, and customer alignment.',
      talkingPoints: [
        'Analyze value metric alignment: ensure the consumption unit (e.g. API calls, credits, compute hours) scales directly with customer ROI.',
        'Evaluate revenue predictability: consumption pricing can fluctuate; hybrid models (base platform fee + overage usage) provide revenue stability.',
        'Consider sales incentives: enterprise procurement teams prefer predictable annual contracts over variable monthly invoices.'
      ],
      gotchas: 'Choosing a consumption metric that punishes customers for adopting your best features.'
    },
    {
      id: 'pm5',
      category: 'System Design',
      targetSkill: 'Product Analytics & Instrumentation',
      question: 'How do you design a comprehensive product event taxonomy for a mobile fintech banking app?',
      interviewerIntent: 'Testing event naming conventions (Object-Action framework), funnel analytics, privacy regulations (PCI-DSS), and data governance.',
      talkingPoints: [
        'Standardize Object-Action naming format: `account_created`, `transfer_initiated`, `transfer_completed`.',
        'Attach consistent global contextual properties (user_id, platform, app_version, session_id).',
        'Strictly sanitize PII and banking data: never log credit card numbers, passwords, or SSNs in client analytics payloads.'
      ],
      gotchas: 'Letting different squads invent their own event names, resulting in data chaos in Mixpanel/Amplitude.'
    },
    {
      id: 'pm6',
      category: 'Technical',
      targetSkill: 'Product Prioritization Frameworks',
      question: 'Compare the RICE (Reach, Impact, Confidence, Effort) vs Kano vs Opportunity Scoring prioritization models. When does each shine?',
      interviewerIntent: 'Evaluating structured decision making, quantitative ranking, and preventing stakeholder pet-project bias.',
      talkingPoints: [
        'RICE is ideal for operational feature roadmaps, balancing reach and impact against engineering sprint effort.',
        'Kano model categorizes features into Must-haves, Performance delighters, and Indifferent features, ideal for market differentiation.',
        'Opportunity Scoring ranks importance vs current satisfaction to identify severely underserved customer opportunities.'
      ],
      gotchas: 'Relying blindly on mathematical formulas without sanity-checking strategic alignment.'
    },
    {
      id: 'pm7',
      category: 'System Design',
      targetSkill: 'Onboarding & Time to Value (TTV)',
      question: 'How do you systematically reduce Time-to-Value (TTV) for self-serve B2B SaaS users to drive self-serve conversion?',
      interviewerIntent: 'Testing user psychology, activation milestone definition, progressive disclosure, and friction reduction.',
      talkingPoints: [
        'Identify the "Aha!" moment (e.g. Slack\'s 2,000 sent messages or Dropbox\'s first file uploaded on 2 devices).',
        'Remove upfront friction: postpone credit card entry and mandatory multi-step team invites until after initial value is demonstrated.',
        'Use interactive template libraries and contextual empty states rather than empty blank canvases.'
      ],
      gotchas: 'Forcing users through an unskippable 12-step guided tour popup on first login.'
    },
    {
      id: 'pm8',
      category: 'Behavioral',
      targetSkill: 'Killing a Product or Feature',
      question: 'Tell me about a feature or product that you personally championed that you eventually decided to deprecate. What led to that decision?',
      interviewerIntent: 'Evaluating intellectual honesty, willingness to admit mistakes, sunk cost fallacy resistance, and customer empathy.',
      talkingPoints: [
        'Recognize the sunk cost fallacy: past engineering hours spent do not justify continued maintenance costs.',
        'Communicate transparently with impacted users, providing migration tools and a respectful deprecation window.'
      ],
      starFramework: {
        situation: 'I launched an automated social sharing widget that only reached 2% user adoption over 6 months while accounting for 15% of customer support tickets.',
        task: 'Decide whether to double down or deprecate the feature.',
        action: 'I conducted user interviews, realized users preferred exporting graphics directly to native apps, and made the decision to sunset the feature.',
        result: 'Reallocated 2 engineers to our core canvas editor, which increased quarterly retention by 8%.'
      },
      gotchas: 'Keeping a dead feature on life support forever because your ego was tied to it.'
    },
    {
      id: 'pm9',
      category: 'Technical',
      targetSkill: 'Go-to-Market (GTM) Strategy',
      question: 'How do you coordinate a Product-Led Growth (PLG) self-serve funnel with an Enterprise Sales-Led outbound motion without channel conflict?',
      interviewerIntent: 'Assessing Product Qualified Leads (PQLs), sales triggers, tier packaging, and multi-channel alignment.',
      talkingPoints: [
        'Define clear PQL triggers: when a self-serve workspace reaches 10 active users or hits security feature barriers (SSO/audit logs), alert sales.',
        'Packaging differentiation: self-serve plan focuses on individual developer utility; enterprise plan packages governance, compliance, and custom SLAs.',
        'Compensate enterprise sales reps on expansion within existing product-led accounts.'
      ],
      gotchas: 'Letting sales reps aggressively cold-call free self-serve users who just signed up 5 minutes ago.'
    },
    {
      id: 'pm10',
      category: 'Behavioral',
      targetSkill: 'Managing Executive HiPPO Influence',
      question: 'How do you handle a situation where an executive sponsor or founder insists on launching their personal pet feature over validated user needs?',
      interviewerIntent: 'Assessing leadership presence, empirical persuasion, diplomatics, and commitment to business outcomes.',
      talkingPoints: [
        'Never dismiss an executive\'s intuition out of hand; understand the strategic motivation behind their request.',
        'Frame trade-offs quantitatively: "We can build this feature, but here is what we would have to pull from the roadmap and the revenue at risk."',
        'Propose a low-cost experiment or customer discovery spike to validate the hypothesis.'
      ],
      starFramework: {
        situation: 'The VP of Sales insisted we build a complex 3D virtual showroom for our enterprise B2B catalog software.',
        task: 'Validate whether real enterprise buyers needed 3D showrooms before committing 4 months of engineering.',
        action: 'I set up a fake-door landing page test with a 3D showroom teaser and conducted 10 customer interviews with enterprise buyers.',
        result: 'Only 3% of visitors clicked the teaser and buyers indicated rapid PDF export was their #1 need; the VP graciously agreed to pivot to PDF capabilities.'
      },
      gotchas: 'Passively complying and building useless features that damage the product.'
    }
  ],
  'Full Stack Developer': [
    {
      id: 'fs1',
      category: 'Technical',
      targetSkill: 'End-to-End Performance',
      question: 'How do you diagnose and fix a full-stack performance issue where an API request takes 4.2 seconds to return to the browser?',
      interviewerIntent: 'Testing end-to-end tracing: network waterfall, backend profiling, database query plans, and serialization overhead.',
      talkingPoints: [
        'Inspect Network tab: TTFB (Time to First Byte) vs content download time.',
        'Backend APM profiling: identify whether delay is CPU time, 3P HTTP calls, or slow N+1 database queries.',
        'Database: examine EXPLAIN ANALYZE for sequential table scans and missing composite indexes.'
      ],
      gotchas: 'Immediately blaming the frontend React code before measuring TTFB.'
    },
    {
      id: 'fs2',
      category: 'System Design',
      targetSkill: 'Real-Time Collaboration',
      question: 'Design a real-time collaborative document editor (like Google Docs or Figma) supporting simultaneous multi-user typing.',
      interviewerIntent: 'Testing conflict resolution algorithms: Operational Transformation (OT) vs CRDTs (Conflict-free Replicated Data Types), WebSockets, and presence indicators.',
      talkingPoints: [
        'State sync: CRDTs (Yjs/Automerge) enable peer-to-peer or server-assisted conflict-free merging without central locking.',
        'Transport: WebSockets with heartbeat keepalive and message compression.',
        'Ephemeral presence: user cursor coordinates broadcast over lightweight Redis Pub/Sub channels.'
      ],
      gotchas: 'Suggesting naive database locks that freeze the document for other users.'
    },
    {
      id: 'fs3',
      category: 'Behavioral',
      targetSkill: 'End-to-End Feature Ownership',
      question: 'Describe a project where you had to single-handedly design the UI, write the frontend, build the API, and deploy the infrastructure.',
      interviewerIntent: 'Evaluating full-lifecycle versatility, pragmatic trade-offs, and self-direction.',
      talkingPoints: [
        'Highlight cohesive architecture: TypeScript shared types across frontend and backend.',
        'Pragmatic tooling: Serverless or managed containers to minimize DevOps overhead.'
      ],
      starFramework: {
        situation: 'Our startup needed an internal customer support dashboard to resolve payment disputes in under 2 minutes.',
        task: 'Deliver a complete production tool in 2 weeks as the sole developer.',
        action: 'I designed the UI in Figma, implemented the React dashboard with Tailwind, built a Node.js/PostgreSQL backend with Stripe webhook verification, and deployed to AWS via Docker.',
        result: 'Shipped in 11 days, reducing customer dispute resolution time by 70%.'
      },
      gotchas: 'Complaining about having to touch either frontend or backend code.'
    },
    {
      id: 'fs4',
      category: 'Technical',
      targetSkill: 'Full-Stack Type Safety',
      question: 'How do you establish end-to-end type safety between a TypeScript frontend and backend without manual schema duplication?',
      interviewerIntent: 'Evaluating tRPC, GraphQL Code Generator, Zod schemas, and monorepo shared packages.',
      talkingPoints: [
        'Monorepo shared types package (`@workspace/types`) with shared Zod validation schemas.',
        'tRPC provides seamless RPC type inference from backend router procedures directly to frontend React hooks.',
        'OpenAPI / Swagger code generation for polyglot backends with automated client SDK generation.'
      ],
      gotchas: 'Manually copy-pasting TypeScript interface definitions between frontend and backend repos.'
    },
    {
      id: 'fs5',
      category: 'Technical',
      targetSkill: 'Server-Side Rendering (SSR) & Hydration',
      question: 'Explain what React SSR Hydration Mismatch errors mean, why they happen, and how to prevent them.',
      interviewerIntent: 'Testing Next.js / Remix SSR internals, browser vs server environment discrepancies, and DOM diffing.',
      talkingPoints: [
        'Hydration mismatch occurs when server-rendered HTML differs from the first client-rendered virtual DOM tree.',
        'Common causes: accessing `window` or `localStorage` during initial render, or non-deterministic values (Date.now(), Math.random()).',
        'Prevention: use `useEffect` for client-only state, or custom `useIsMounted` hooks to delay rendering client-specific widgets.'
      ],
      gotchas: 'Suppressing hydration warnings with `suppressHydrationWarning` without fixing the root cause.'
    },
    {
      id: 'fs6',
      category: 'System Design',
      targetSkill: 'File Upload & Processing Pipeline',
      question: 'Design an end-to-end media upload pipeline for videos up to 2 GB with client progress bars, chunking, and background transcoding.',
      interviewerIntent: 'Evaluating presigned URLs, S3 multipart uploads, async worker queues, and CDN delivery.',
      talkingPoints: [
        'Direct-to-storage upload: browser requests presigned S3 URL from backend and uploads directly to S3 via HTTP multipart upload.',
        'Never stream multi-gigabyte files through the API gateway or application servers.',
        'S3 bucket triggers an SQS event that worker pods consume to transcode video with FFmpeg, uploading HLS streams to CloudFront CDN.'
      ],
      gotchas: 'Buffering entire 2 GB files in memory on Node.js application servers.'
    },
    {
      id: 'fs7',
      category: 'Technical',
      targetSkill: 'Relational vs NoSQL Schema Trade-offs',
      question: 'When is it appropriate to use MongoDB / Document databases instead of PostgreSQL in a modern web application?',
      interviewerIntent: 'Assessing database trade-offs: ACID compliance, polymorphic document structures, relational joins, and modern Postgres JSONB.',
      talkingPoints: [
        'Postgres with JSONB satisfies 90% of unstructured document needs while retaining relational integrity, foreign keys, and ACID transactions.',
        'Document databases excel when data naturally forms self-contained hierarchical documents read/written together without relational joins.',
        'Avoid NoSQL when multi-record atomic transactions across collections and complex reporting joins are required.'
      ],
      gotchas: 'Choosing NoSQL simply because "we didn\'t want to design a schema upfront".'
    },
    {
      id: 'fs8',
      category: 'Behavioral',
      targetSkill: 'Debugging Production Spikes',
      question: 'Describe a situation where a frontend change caused a catastrophic backend database outage. How did you diagnose it?',
      interviewerIntent: 'Assessing full-stack holistic thinking, client-server contract awareness, and rapid incident triage.',
      talkingPoints: [
        'Examples: an un-debounced search input sending requests on every keystroke, or an infinite loop inside a React useEffect calling APIs.',
        'Backend protection: implement API rate limiting and connection pool caps.',
        'Frontend mitigation: add client-side debounce and memoization.'
      ],
      starFramework: {
        situation: 'A frontend engineer merged a change that placed an analytics fetch call inside a component render loop without dependency arrays.',
        task: 'Diagnose why backend database CPU pegged at 100% and recover the service.',
        action: 'I inspected API gateway logs, identified 12,000 requests/sec hitting a single user profile endpoint, deployed an emergency rate limit rule, and rolled back the frontend release.',
        result: 'Recovered the database in 5 minutes and instituted an automated ESLint rule preventing un-memoized fetches.'
      },
      gotchas: 'Pointing fingers at the frontend or backend team rather than collaborating to fix the systemic issue.'
    },
    {
      id: 'fs9',
      category: 'System Design',
      targetSkill: 'Multi-Tenant SaaS Architecture',
      question: 'Design a multi-tenant SaaS application ensuring complete data isolation between enterprise customers.',
      interviewerIntent: 'Evaluating tenancy models: Shared Database with Tenant ID column vs Separate Schemas vs Dedicated Databases.',
      talkingPoints: [
        'Shared database with Row-Level Security (Postgres RLS): cost-effective, enforces `tenant_id = current_tenant()` at the database engine level.',
        'Schema-per-tenant: intermediate isolation, simplifies tenant-specific backups and data deletion.',
        'Database-per-tenant: required for strict healthcare (HIPAA) or financial regulatory compliance, but incurs higher infrastructure cost.'
      ],
      gotchas: 'Relying exclusively on application-level WHERE clauses without database-enforced row security.'
    },
    {
      id: 'fs10',
      category: 'Behavioral',
      targetSkill: 'Pragmatic Engineering & Shipping Fast',
      question: 'Tell me about a time you had to choose between writing "clean, pristine code" and meeting an urgent business launch date.',
      interviewerIntent: 'Evaluating pragmatic business sense, technical debt awareness, and disciplined follow-up.',
      talkingPoints: [
        'Acknowledge that shipping on time to validate a business hypothesis is often more valuable than premature abstraction.',
        'Document technical debt explicitly in tickets with a designated repayment timeline immediately post-launch.'
      ],
      starFramework: {
        situation: 'We had a 72-hour window to integrate with a major enterprise partner for a national product announcement.',
        task: 'Deliver the integration on time without introducing irreversible architecture flaws.',
        action: 'I built a focused, synchronous integration script rather than a distributed message queue, with thorough integration tests and explicit telemetry.',
        result: 'We successfully launched on time, generating $320k in first-week revenue; the following sprint, I refactored the pipeline into our standard asynchronous worker queues.'
      },
      gotchas: 'Refusing to ship code because it isn\'t "theoretically perfect", causing the company to miss a major commercial opportunity.'
    }
  ]
};

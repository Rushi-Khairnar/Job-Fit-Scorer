import React, { useState } from 'react';
import { 
  BrainCircuit, 
  HelpCircle, 
  ChevronDown, 
  ChevronUp, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  Layers, 
  BookOpen,
  MessageSquare,
  Award,
  Search,
  Check
} from 'lucide-react';
import { JOB_DIRECTORY_DATA } from '../jobsData';

interface QuestionItem {
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

const SAMPLE_QUESTIONS: Record<string, QuestionItem[]> = {
  'Data Scientist': [
    {
      id: 'ds1',
      category: 'Technical',
      targetSkill: 'Machine Learning',
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
      targetSkill: 'Deep Learning',
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
    }
  ],
  'Frontend Developer': [
    {
      id: 'fe1',
      category: 'Technical',
      targetSkill: 'Browser Performance',
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
      targetSkill: 'Design Systems',
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
      targetSkill: 'Data Storytelling',
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
      targetSkill: 'Cloud Cost Optimization',
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
    }
  ]
};

export const InterviewGenerator: React.FC<{
  targetRole?: string;
  missingSkills?: string[];
}> = ({ targetRole = 'Data Scientist', missingSkills = [] }) => {
  const availableRoles = Object.keys(SAMPLE_QUESTIONS);

  const [selectedRole, setSelectedRole] = useState(() => {
    if (SAMPLE_QUESTIONS[targetRole]) return targetRole;
    return availableRoles[0];
  });

  const [activeCategory, setActiveCategory] = useState<'All' | 'Technical' | 'Behavioral' | 'System Design'>('All');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [userNotes, setUserNotes] = useState<Record<string, string>>({});

  const questions = SAMPLE_QUESTIONS[selectedRole] || SAMPLE_QUESTIONS['Software Engineer'];

  const filteredQuestions = questions.filter(q => {
    const matchCat = activeCategory === 'All' || q.category === activeCategory;
    const matchSearch = searchQuery.trim() === '' || 
      q.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.targetSkill.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="bg-white dark:bg-neutral-800 rounded-3xl p-6 sm:p-8 border border-neutral-200 dark:border-neutral-700 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 text-xs font-semibold mb-2.5 border border-blue-200 dark:border-blue-800">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Interview Coaching <span className="opacity-70 font-normal">[Covers All 10 Roles · STAR Method]</span></span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 dark:text-white">
              Interview Prep Coach
            </h2>
            <p className="text-neutral-500 dark:text-neutral-400 text-sm mt-1 max-w-2xl">
              Realistic questions tailored to all tech roles. Master technical concepts, behavioral STAR stories, and system architecture.
            </p>
          </div>

          {/* Role Picker Dropdown */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
            <label className="text-xs font-bold text-neutral-500 uppercase tracking-wider shrink-0">
              Target Role:
            </label>
            <select
              value={selectedRole}
              onChange={(e) => {
                setSelectedRole(e.target.value);
                setExpandedId(null);
              }}
              className="px-3.5 py-2 rounded-xl bg-neutral-100 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 text-xs font-bold text-neutral-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
            >
              {availableRoles.map(r => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Search & Category Filter Bar */}
        <div className="mt-6 pt-6 border-t border-neutral-100 dark:border-neutral-700 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center space-x-1.5 overflow-x-auto w-full sm:w-auto">
            {(['All', 'Technical', 'System Design', 'Behavioral'] as const).map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  activeCategory === cat
                    ? 'bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 shadow-xs'
                    : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-700'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search questions or skills..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 text-xs text-neutral-900 dark:text-white"
            />
          </div>
        </div>
      </div>

      {/* Questions List */}
      <div className="space-y-4">
        {filteredQuestions.length > 0 ? (
          filteredQuestions.map((q) => {
            const isExpanded = expandedId === q.id;
            return (
              <div
                key={q.id}
                className="bg-white dark:bg-neutral-800 rounded-3xl border border-neutral-200 dark:border-neutral-700 shadow-xs overflow-hidden transition-all"
              >
                <div
                  onClick={() => setExpandedId(isExpanded ? null : q.id)}
                  className="p-6 cursor-pointer hover:bg-neutral-50/70 dark:hover:bg-neutral-700/30 transition-colors flex items-start justify-between gap-4"
                >
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center space-x-2 flex-wrap gap-y-1">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                        q.category === 'Technical'
                          ? 'bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800'
                          : q.category === 'System Design'
                            ? 'bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800'
                            : 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                      }`}>
                        {q.category}
                      </span>
                      <span className="text-xs text-neutral-400">·</span>
                      <span className="text-xs font-semibold text-neutral-600 dark:text-neutral-300">
                        {q.targetSkill}
                      </span>
                    </div>
                    <h3 className="text-base sm:text-lg font-bold text-neutral-900 dark:text-white leading-snug">
                      {q.question}
                    </h3>
                  </div>

                  <button className="p-2 rounded-xl text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors mt-1">
                    {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                  </button>
                </div>

                {isExpanded && (
                  <div className="p-6 sm:p-8 border-t border-neutral-100 dark:border-neutral-700/80 bg-neutral-50/60 dark:bg-neutral-900/80 space-y-6">
                    {/* Interviewer Intent */}
                    <div className="p-4 rounded-2xl bg-blue-50/60 dark:bg-blue-950/30 border border-blue-200/80 dark:border-blue-800/60">
                      <div className="flex items-center space-x-2 text-xs font-bold text-blue-700 dark:text-blue-300 mb-1">
                        <BrainCircuit className="w-4 h-4" />
                        <span>What the Interviewer is Really Listening For:</span>
                      </div>
                      <p className="text-xs leading-relaxed text-neutral-700 dark:text-neutral-300">
                        {q.interviewerIntent}
                      </p>
                    </div>

                    {/* Key Talking Points */}
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mb-2">
                        Key Points to Hit in Your Answer
                      </h4>
                      <ul className="space-y-1.5 text-xs text-neutral-700 dark:text-neutral-300">
                        {q.talkingPoints.map((pt, idx) => (
                          <li key={idx} className="flex items-start space-x-2">
                            <span className="text-blue-600 font-bold shrink-0">✓</span>
                            <span>{pt}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* STAR Framework (If behavioral) */}
                    {q.starFramework && (
                      <div className="p-5 rounded-2xl bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 space-y-3 shadow-xs">
                        <div className="flex items-center space-x-2 text-xs font-bold text-emerald-700 dark:text-emerald-300">
                          <Award className="w-4 h-4" />
                          <span>Structured Model Answer (STAR Method)</span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                          <div className="p-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
                            <strong className="text-neutral-900 dark:text-white block mb-0.5">Situation:</strong>
                            <span className="text-neutral-600 dark:text-neutral-300">{q.starFramework.situation}</span>
                          </div>
                          <div className="p-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
                            <strong className="text-neutral-900 dark:text-white block mb-0.5">Task:</strong>
                            <span className="text-neutral-600 dark:text-neutral-300">{q.starFramework.task}</span>
                          </div>
                          <div className="p-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
                            <strong className="text-neutral-900 dark:text-white block mb-0.5">Action:</strong>
                            <span className="text-neutral-600 dark:text-neutral-300">{q.starFramework.action}</span>
                          </div>
                          <div className="p-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
                            <strong className="text-neutral-900 dark:text-white block mb-0.5">Result:</strong>
                            <span className="text-neutral-600 dark:text-neutral-300">{q.starFramework.result}</span>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Common Traps / Gotchas */}
                    <div className="p-4 rounded-2xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-800/60">
                      <div className="flex items-center space-x-2 text-xs font-bold text-amber-700 dark:text-amber-300 mb-1">
                        <AlertCircle className="w-4 h-4" />
                        <span>Common Trap to Avoid:</span>
                      </div>
                      <p className="text-xs text-neutral-700 dark:text-neutral-300 leading-relaxed">
                        {q.gotchas}
                      </p>
                    </div>

                    {/* Scratchpad Notes */}
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-neutral-500 dark:text-neutral-400">Your Practice Answer / Notes:</label>
                      <textarea
                        rows={2}
                        placeholder="Jot down bullet points from your own background for this question..."
                        value={userNotes[q.id] || ''}
                        onChange={(e) => setUserNotes({ ...userNotes, [q.id]: e.target.value })}
                        className="w-full p-2.5 rounded-xl bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-xs text-neutral-800 dark:text-neutral-200 outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <div className="p-12 text-center bg-white dark:bg-neutral-800 rounded-3xl border border-neutral-200 dark:border-neutral-700">
            <HelpCircle className="w-8 h-8 text-neutral-400 mx-auto mb-2" />
            <h4 className="text-sm font-bold text-neutral-900 dark:text-white">No questions matched your filter</h4>
            <p className="text-xs text-neutral-500 mt-1">Try selecting "All" or clearing your search term.</p>
          </div>
        )}
      </div>
    </div>
  );
};

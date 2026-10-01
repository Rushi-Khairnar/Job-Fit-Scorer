import { JOB_DIRECTORY_DATA } from './jobsData';

export interface EnrichedMilestone {
  key: string; // e.g. "Data Scientist-0-0"
  phaseIndex: number;
  milestoneIndex: number;
  phaseTitle: string;
  phaseDuration: string;
  title: string;
  description: string;
  keySkills: string[];
}

export interface RoadmapProgressSummary {
  roleTitle: string;
  totalCount: number;
  completedCount: number;
  percent: number;
  completedKeys: string[];
  nextMilestone: EnrichedMilestone | null;
  isFullyCompleted: boolean;
}

export function getEnrichedRoadmapForRole(roleTitle: string): {
  role: typeof JOB_DIRECTORY_DATA[0];
  stages: Array<{
    stage: string;
    duration: string;
    milestones: EnrichedMilestone[];
  }>;
  allMilestones: EnrichedMilestone[];
} {
  const currentRole = JOB_DIRECTORY_DATA.find(
    r => r.title.toLowerCase() === roleTitle.toLowerCase()
  ) || JOB_DIRECTORY_DATA.find(
    r => r.title.toLowerCase().includes(roleTitle.toLowerCase())
  ) || JOB_DIRECTORY_DATA[0];

  const stages = [
    {
      stage: 'Phase 1: Foundations & Core Concepts',
      duration: 'Weeks 1 – 4',
      milestones: [
        {
          key: `${currentRole.title}-0-0`,
          phaseIndex: 0,
          milestoneIndex: 0,
          phaseTitle: 'Phase 1: Foundations & Core Concepts',
          phaseDuration: 'Weeks 1 – 4',
          title: currentRole.roadmap[0]?.title || 'Fundamental Principles',
          description: currentRole.roadmap[0]?.desc || 'Core programming logic, basic data structures, and algorithmic foundations.',
          keySkills: currentRole.skills.slice(0, 2)
        },
        {
          key: `${currentRole.title}-0-1`,
          phaseIndex: 0,
          milestoneIndex: 1,
          phaseTitle: 'Phase 1: Foundations & Core Concepts',
          phaseDuration: 'Weeks 1 – 4',
          title: 'Version Control & Clean Code Habits',
          description: 'Git branching, commit hygiene, semantic versioning, and command line productivity.',
          keySkills: ['Git', 'Command Line']
        }
      ]
    },
    {
      stage: 'Phase 2: Frameworks, Tooling & Databases',
      duration: 'Weeks 5 – 8',
      milestones: [
        {
          key: `${currentRole.title}-1-0`,
          phaseIndex: 1,
          milestoneIndex: 0,
          phaseTitle: 'Phase 2: Frameworks, Tooling & Databases',
          phaseDuration: 'Weeks 5 – 8',
          title: currentRole.roadmap[1]?.title || 'Industry Frameworks',
          description: currentRole.roadmap[1]?.desc || 'Working with professional libraries, API integration, and database schemas.',
          keySkills: currentRole.skills.slice(1, 4)
        },
        {
          key: `${currentRole.title}-1-1`,
          phaseIndex: 1,
          milestoneIndex: 1,
          phaseTitle: 'Phase 2: Frameworks, Tooling & Databases',
          phaseDuration: 'Weeks 5 – 8',
          title: 'Database & State Management',
          description: 'Relational or NoSQL storage, indexing, data normalization, and asynchronous handling.',
          keySkills: ['SQL', 'Data Modeling']
        }
      ]
    },
    {
      stage: 'Phase 3: Real-World Architecture & Deployment',
      duration: 'Weeks 9 – 12',
      milestones: [
        {
          key: `${currentRole.title}-2-0`,
          phaseIndex: 2,
          milestoneIndex: 0,
          phaseTitle: 'Phase 3: Real-World Architecture & Deployment',
          phaseDuration: 'Weeks 9 – 12',
          title: currentRole.roadmap[2]?.title || 'System Architecture',
          description: currentRole.roadmap[2]?.desc || 'Containerization, automated unit tests, and production cloud setup.',
          keySkills: currentRole.skills.slice(2, 5)
        },
        {
          key: `${currentRole.title}-2-1`,
          phaseIndex: 2,
          milestoneIndex: 1,
          phaseTitle: 'Phase 3: Real-World Architecture & Deployment',
          phaseDuration: 'Weeks 9 – 12',
          title: 'Cloud & CI/CD Pipelines',
          description: 'Automated GitHub Actions workflows, container build, and deployment monitoring.',
          keySkills: ['Docker', 'CI/CD']
        }
      ]
    },
    {
      stage: 'Phase 4: Capstone Portfolio & Interview Prep',
      duration: 'Weeks 13 – 16',
      milestones: [
        {
          key: `${currentRole.title}-3-0`,
          phaseIndex: 3,
          milestoneIndex: 0,
          phaseTitle: 'Phase 4: Capstone Portfolio & Interview Prep',
          phaseDuration: 'Weeks 13 – 16',
          title: 'End-to-End Production Capstone',
          description: `Build and deploy a complete production-grade application showcasing ${currentRole.title} best practices.`,
          keySkills: currentRole.skills.slice(0, 4)
        },
        {
          key: `${currentRole.title}-3-1`,
          phaseIndex: 3,
          milestoneIndex: 1,
          phaseTitle: 'Phase 4: Capstone Portfolio & Interview Prep',
          phaseDuration: 'Weeks 13 – 16',
          title: 'Technical Interview & System Design',
          description: 'Mock interviews, scenario analysis, portfolio documentation, and live resume optimization.',
          keySkills: ['System Design', 'Communication']
        }
      ]
    }
  ];

  const allMilestones = stages.flatMap(s => s.milestones);

  return { role: currentRole, stages, allMilestones };
}

export function getRoleRoadmapProgress(
  roleTitle: string,
  userCompletedMilestones: string[] = []
): RoadmapProgressSummary {
  const { role, allMilestones } = getEnrichedRoadmapForRole(roleTitle);
  const completedKeys = userCompletedMilestones.filter(k =>
    k.toLowerCase().startsWith(role.title.toLowerCase())
  );

  const totalCount = allMilestones.length;
  const completedCount = completedKeys.length;
  const percent = totalCount > 0 ? Math.min(100, Math.round((completedCount / totalCount) * 100)) : 0;

  // Find first uncompleted milestone in chronological order
  const nextMilestone = allMilestones.find(m => !userCompletedMilestones.includes(m.key)) || null;
  const isFullyCompleted = completedCount >= totalCount && totalCount > 0;

  return {
    roleTitle: role.title,
    totalCount,
    completedCount,
    percent,
    completedKeys,
    nextMilestone,
    isFullyCompleted
  };
}

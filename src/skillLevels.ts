export type SkillLevel = 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';

export interface SkillDetail {
  name: string;
  level: SkillLevel;
  category: 'Languages' | 'Frameworks' | 'Databases' | 'Cloud & DevOps' | 'AI & ML' | 'Tools & Methods';
  description: string;
}

const EXPERT_SKILLS = new Set([
  'kubernetes', 'deep learning', 'pytorch', 'tensorflow', 'terraform', 
  'cloud architecture', 'distributed systems', 'system design', 'microservices',
  'nlp', 'computer vision', 'cybersecurity'
]);

const ADVANCED_SKILLS = new Set([
  'machine learning', 'aws', 'azure', 'gcp', 'docker', 'ci/cd', 'linux',
  'spark', 'hadoop', 'django', 'fastapi', 'spring boot', 'graphql',
  'redis', 'nosql', 'c++', 'data architecture'
]);

const INTERMEDIATE_SKILLS = new Set([
  'python', 'javascript', 'typescript', 'react', 'node.js', 'sql',
  'pandas', 'scikit-learn', 'data analysis', 'statistics', 'tableau',
  'power bi', 'mongodb', 'postgresql', 'mysql', 'agile', 'scrum',
  'tailwind css', 'vue.js', 'express'
]);

export function getSkillLevel(skillName: string): SkillLevel {
  const normalized = skillName.toLowerCase().trim();
  if (EXPERT_SKILLS.has(normalized)) return 'Expert';
  if (ADVANCED_SKILLS.has(normalized)) return 'Advanced';
  if (INTERMEDIATE_SKILLS.has(normalized)) return 'Intermediate';
  return 'Beginner';
}

export function getSkillLevelBadgeClasses(level: SkillLevel): { bg: string; text: string; border: string; dot: string } {
  switch (level) {
    case 'Expert':
      return {
        bg: 'bg-rose-50 dark:bg-rose-950/40',
        text: 'text-rose-700 dark:text-rose-300',
        border: 'border-rose-200 dark:border-rose-800',
        dot: 'bg-rose-500'
      };
    case 'Advanced':
      return {
        bg: 'bg-amber-50 dark:bg-amber-950/40',
        text: 'text-amber-700 dark:text-amber-300',
        border: 'border-amber-200 dark:border-amber-800',
        dot: 'bg-amber-500'
      };
    case 'Intermediate':
      return {
        bg: 'bg-indigo-50 dark:bg-indigo-950/40',
        text: 'text-indigo-700 dark:text-indigo-300',
        border: 'border-indigo-200 dark:border-indigo-800',
        dot: 'bg-indigo-500'
      };
    case 'Beginner':
    default:
      return {
        bg: 'bg-emerald-50 dark:bg-emerald-950/40',
        text: 'text-emerald-700 dark:text-emerald-300',
        border: 'border-emerald-200 dark:border-emerald-800',
        dot: 'bg-emerald-500'
      };
  }
}

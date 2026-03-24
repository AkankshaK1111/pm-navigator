import type { TaskScoringType } from '@/src/types';

export interface DailyTask {
  id: string;
  type: TaskScoringType;
  dimension: string;
  prompt: string;
  /** Use {company} as placeholder — replaced with user's target company */
  promptTemplate: string;
}

const TASKS: DailyTask[] = [
  // Product Teardown tasks → Product Sense
  { id: 'pt-1', type: 'product-teardown', dimension: 'Product Sense', prompt: '', promptTemplate: 'Pick a feature in {company}. Who is it for? What problem does it solve? What would you change — and why?' },
  { id: 'pt-2', type: 'product-teardown', dimension: 'Product Sense', prompt: '', promptTemplate: 'Choose a feature in any app you use daily. What user need does it serve? How would you measure its success? What\'s one improvement you\'d make?' },
  { id: 'pt-3', type: 'product-teardown', dimension: 'Product Sense', prompt: '', promptTemplate: 'Pick a recently launched feature by any Indian tech company. Who benefits? What problem existed before? How would you know it\'s working?' },

  // Metric Diagnosis tasks → Analytical Depth
  { id: 'md-1', type: 'metric-diagnosis', dimension: 'Analytical Depth', prompt: '', promptTemplate: 'Daily active users at {company} dropped 12% week-over-week. Walk through your diagnosis: what would you investigate first, what data would you look at, and how would you prioritise hypotheses?' },
  { id: 'md-2', type: 'metric-diagnosis', dimension: 'Analytical Depth', prompt: '', promptTemplate: 'Conversion rate from cart to purchase dropped 8% this month. Decompose the possible causes, describe how you\'d validate each hypothesis, and rank them by likelihood.' },
  { id: 'md-3', type: 'metric-diagnosis', dimension: 'Analytical Depth', prompt: '', promptTemplate: 'User retention at day 7 improved by 5% but day 30 retention stayed flat. What does this tell you? What would you investigate?' },

  // Business Case tasks → Business Framing
  { id: 'bc-1', type: 'business-case', dimension: 'Business Framing', prompt: '', promptTemplate: 'Should {company} enter a new adjacent market? Make a go or no-go recommendation with market sizing, competitive positioning, and revenue reasoning.' },
  { id: 'bc-2', type: 'business-case', dimension: 'Business Framing', prompt: '', promptTemplate: 'A competitor just launched a feature that directly competes with {company}\'s core offering. What\'s your strategic response? Consider market dynamics, timing, and resource allocation.' },
  { id: 'bc-3', type: 'business-case', dimension: 'Business Framing', prompt: '', promptTemplate: '{company} is considering a freemium vs paid-only pricing model for a new product. Make a recommendation with unit economics reasoning.' },

  // AI Feature Design tasks → AI Fluency
  { id: 'ai-1', type: 'ai-feature-design', dimension: 'AI Fluency', prompt: '', promptTemplate: 'Design an AI-native capability for {company}. Not a wrapper around ChatGPT — a genuinely AI-powered feature. What data powers it? What are the failure modes?' },
  { id: 'ai-2', type: 'ai-feature-design', dimension: 'AI Fluency', prompt: '', promptTemplate: 'How would you use AI to improve the onboarding experience for new users at {company}? Be specific about what model/approach you\'d use and why.' },
  { id: 'ai-3', type: 'ai-feature-design', dimension: 'AI Fluency', prompt: '', promptTemplate: 'Design an AI feature that helps {company}\'s internal team be more productive. Consider data requirements, accuracy thresholds, and human-in-the-loop decisions.' },

  // Technical Tradeoff tasks → Technical Credibility
  { id: 'tt-1', type: 'technical-tradeoff', dimension: 'Technical Credibility', prompt: '', promptTemplate: '{company} needs to add real-time notifications. Build in-house vs use a third-party service (e.g. Firebase, OneSignal). What are the tradeoffs? Make a recommendation.' },
  { id: 'tt-2', type: 'technical-tradeoff', dimension: 'Technical Credibility', prompt: '', promptTemplate: 'Your team wants to migrate from a monolith to microservices. The PM (you) needs to weigh in. What are the tradeoffs for users, for engineering velocity, and for reliability?' },

  // Stakeholder Conflict tasks → Behavioural
  { id: 'sc-1', type: 'stakeholder-conflict', dimension: 'Behavioural', prompt: '', promptTemplate: 'Your engineering lead at {company} disagrees with your feature prioritisation. They want to pay down tech debt; you want to ship a user-facing feature. How do you respond?' },
  { id: 'sc-2', type: 'stakeholder-conflict', dimension: 'Behavioural', prompt: '', promptTemplate: 'The design team wants to redesign the entire checkout flow. Engineering says it\'ll take 3 months. Sales says we\'re losing deals NOW. You\'re the PM. What do you do?' },
];

/**
 * Get the next uncompleted task targeting the user's weakest dimensions.
 */
export function getNextTask(
  completedTaskIds: string[],
  weakestDimensions: string[],
  targetCompany: string
): DailyTask | null {
  const completed = new Set(completedTaskIds);
  const company = targetCompany || 'your target company';

  // Find first uncompleted task matching weakest dimensions
  for (const dim of weakestDimensions) {
    const task = TASKS.find(t =>
      t.dimension === dim && !completed.has(t.id)
    );
    if (task) {
      return {
        ...task,
        prompt: task.promptTemplate.replace(/\{company\}/g, company),
      };
    }
  }

  // Fallback: any uncompleted task
  const any = TASKS.find(t => !completed.has(t.id));
  if (any) {
    return {
      ...any,
      prompt: any.promptTemplate.replace(/\{company\}/g, company),
    };
  }

  return null;
}

export function getAllTasks(targetCompany: string): DailyTask[] {
  const company = targetCompany || 'your target company';
  return TASKS.map(t => ({
    ...t,
    prompt: t.promptTemplate.replace(/\{company\}/g, company),
  }));
}

export function getTaskById(id: string, targetCompany: string): DailyTask | undefined {
  const company = targetCompany || 'your target company';
  const task = TASKS.find(t => t.id === id);
  if (!task) return undefined;
  return { ...task, prompt: task.promptTemplate.replace(/\{company\}/g, company) };
}

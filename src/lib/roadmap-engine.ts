import { UserProfile, AssessmentResult, RoadmapWeek } from '@/src/types';
import { ROADMAP_TEMPLATES } from '@/src/data/roadmap-templates';

export function generateRoadmap(
  profile: UserProfile,
  assessment: AssessmentResult
): RoadmapWeek[] {
  // Get base template for background
  const baseTemplate = ROADMAP_TEMPLATES[profile.background] || ROADMAP_TEMPLATES.other;

  if (!baseTemplate || baseTemplate.length === 0) {
    return ROADMAP_TEMPLATES.other || [];
  }

  let roadmap = structuredClone(baseTemplate);

  // Adjust based on gap analysis — move critical gaps earlier
  roadmap = prioritizeByCriticalGaps(roadmap, assessment);

  // Add AI fluency modules if lacking
  if (!profile.hasAIExperience) {
    roadmap = injectAIModules(roadmap);
  }

  // Increase mock interview intensity for FAANG targets
  if (profile.targetCompanyTier === 'faang') {
    roadmap = intensifyForFAANG(roadmap);
  }

  // Adjust if they've already done some prep
  if (profile.prepMonths >= 3) {
    roadmap = adjustForExistingPrep(roadmap, profile);
  }

  return roadmap;
}

function prioritizeByCriticalGaps(
  roadmap: RoadmapWeek[],
  assessment: AssessmentResult
): RoadmapWeek[] {
  const criticalGaps = assessment.gapAnalysis
    .filter(g => g.priority === 'critical')
    .map(g => g.skill.toLowerCase());

  if (criticalGaps.length === 0) return roadmap;

  // Find weeks that address critical gaps and move them earlier
  const earlyWeeks: RoadmapWeek[] = [];
  const laterWeeks: RoadmapWeek[] = [];

  roadmap.forEach(week => {
    const addressesCritical = week.tasks.some(task =>
      criticalGaps.some(gap =>
        task.title.toLowerCase().includes(gap) ||
        task.description.toLowerCase().includes(gap)
      )
    );

    if (addressesCritical && week.weekNumber > 4) {
      earlyWeeks.push(week);
    } else {
      laterWeeks.push(week);
    }
  });

  // Reorder: put critical gap weeks in positions 3-4
  if (earlyWeeks.length > 0) {
    const result = [...laterWeeks.slice(0, 2), ...earlyWeeks.slice(0, 2), ...laterWeeks.slice(2)];
    return result.map((week, idx) => ({ ...week, weekNumber: idx + 1 }));
  }

  return roadmap;
}

function injectAIModules(roadmap: RoadmapWeek[]): RoadmapWeek[] {
  // Add an AI task to weeks 3-4 if not already present
  return roadmap.map(week => {
    if (week.weekNumber === 3 || week.weekNumber === 4) {
      const hasAITask = week.tasks.some(t =>
        t.title.toLowerCase().includes('ai') || t.description.toLowerCase().includes('ai')
      );

      if (!hasAITask) {
        week.tasks.push({
          id: `ai_inject_${week.weekNumber}`,
          title: week.weekNumber === 3
            ? 'Learn AI/ML fundamentals for PMs'
            : 'Analyze an AI-powered product',
          description: week.weekNumber === 3
            ? 'Complete a free AI literacy module: understand LLMs, prompt engineering, and model evaluation basics. Focus on what PMs need to know, not engineering depth.'
            : 'Write a 1-page analysis of an AI product: what model powers it, how accuracy is measured, what the tradeoffs are (cost vs quality vs latency).',
          type: 'learn',
          resource: 'https://www.youtube.com/results?search_query=AI+for+product+managers+2026',
          deliverable: week.weekNumber === 3
            ? 'Notes on 5 key AI concepts every PM should know'
            : '1-page AI product analysis document',
        });
      }
    }
    return week;
  });
}

function intensifyForFAANG(roadmap: RoadmapWeek[]): RoadmapWeek[] {
  return roadmap.map(week => {
    // Add extra mock interview tasks in weeks 7+
    if (week.weekNumber >= 7) {
      week.tasks.push({
        id: `faang_mock_${week.weekNumber}`,
        title: 'FAANG-specific mock interview',
        description: `Practice a ${week.weekNumber <= 9 ? 'product sense' : 'execution'} interview question from FAANG interview archives. Time yourself to 35 minutes. Record and self-evaluate.`,
        type: 'practice',
        resource: null,
        deliverable: 'Recorded mock interview with self-evaluation notes',
      });
      week.estimatedHours += 2;
    }

    // Add system design prep in later weeks
    if (week.weekNumber >= 9) {
      const hasSystemDesign = week.tasks.some(t => t.title.toLowerCase().includes('system design'));
      if (!hasSystemDesign) {
        week.tasks.push({
          id: `faang_sysdesign_${week.weekNumber}`,
          title: 'Product system design practice',
          description: 'Practice designing a product system (e.g., "Design Instagram Stories" or "Design a ride-sharing matching system"). Focus on product architecture, not engineering implementation.',
          type: 'practice',
          resource: null,
          deliverable: 'System design whiteboard document with tradeoff analysis',
        });
        week.estimatedHours += 2;
      }
    }

    return week;
  });
}

function adjustForExistingPrep(roadmap: RoadmapWeek[], profile: UserProfile): RoadmapWeek[] {
  // If they've done significant prep, mark early foundational tasks as optional
  return roadmap.map(week => {
    if (week.weekNumber <= 2 && profile.prepMonths >= 6) {
      week.tasks = week.tasks.map(task => ({
        ...task,
        description: `[OPTIONAL — you may have covered this] ${task.description}`,
      }));
    }

    // If they've done mocks, reduce the mock interview tasks
    if (profile.mockInterviewsDone >= 15 && week.weekNumber <= 8) {
      week.tasks = week.tasks.map(task => {
        if (task.type === 'practice' && task.title.toLowerCase().includes('mock')) {
          return {
            ...task,
            description: `[ADJUSTED] Since you've done ${profile.mockInterviewsDone} mocks already, focus on your weakest question type instead of general practice.`,
          };
        }
        return task;
      });
    }

    return week;
  });
}

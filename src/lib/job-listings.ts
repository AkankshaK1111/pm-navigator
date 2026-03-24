import type { AIReadinessScores, MarketJobListing, JobListingWithFit } from '@/src/types';
import { getJobListings } from '@/src/data/market-data';

const DIM_KEY_MAP: Record<string, string> = {
  'Product Sense': 'productSense',
  'Analytical Depth': 'analyticalDepth',
  'Business Framing': 'businessFraming',
  'Technical Credibility': 'technicalCredibility',
  'AI Fluency': 'aiFluency',
  'Behavioural': 'behavioural',
};

const NAME_MAP: Record<string, string> = {
  productSense: 'Product Sense',
  analyticalDepth: 'Analytical',
  businessFraming: 'Business',
  technicalCredibility: 'Technical',
  aiFluency: 'AI Fluency',
  behavioural: 'Behavioural',
};

/**
 * Calculate math-based fit percentage for all job listings.
 * Pure math — no AI call needed.
 * Port of compass-PM/api/job-listings.js.
 */
export function calculateJobListingFit(
  readinessScores: AIReadinessScores | null
): JobListingWithFit[] {
  const listings = getJobListings();

  // Build user scores map from AI readiness dimensions
  const userScores: Record<string, number> = {};
  if (readinessScores?.dimensions) {
    readinessScores.dimensions.forEach(d => {
      const key = DIM_KEY_MAP[d.name] || d.name;
      userScores[key] = d.score;
    });
  }

  // Fallback if no readiness data
  const defaultScores: Record<string, number> = {
    productSense: 50,
    analyticalDepth: 50,
    businessFraming: 50,
    technicalCredibility: 50,
    aiFluency: 50,
    behavioural: 50,
  };

  const scores = Object.keys(userScores).length > 0 ? userScores : defaultScores;

  const jobsWithFit: JobListingWithFit[] = listings.map(job => {
    const reqs = job.requirements || {};
    const reqKeys = Object.keys(reqs) as (keyof typeof reqs)[];

    if (reqKeys.length === 0) {
      return { ...job, fitPercent: 50, dimComparisons: [] };
    }

    let totalRatio = 0;
    const dimComparisons: JobListingWithFit['dimComparisons'] = [];

    reqKeys.forEach(key => {
      const required = reqs[key] || 50;
      const userScore = scores[key] || 50;
      const ratio = Math.min(userScore / required, 1.0);
      totalRatio += ratio;

      dimComparisons.push({
        dim: NAME_MAP[key] || key,
        user: userScore,
        required,
        met: userScore >= required,
      });
    });

    const fitPercent = Math.round((totalRatio / reqKeys.length) * 100);
    return { ...job, fitPercent, dimComparisons };
  });

  // Sort by fit descending
  jobsWithFit.sort((a, b) => b.fitPercent - a.fitPercent);
  return jobsWithFit;
}

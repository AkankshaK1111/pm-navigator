import type {
  MarketData,
  MarketDataCompany,
  MarketJobListing,
  MarketTrend,
  TransitionProfile,
  Background,
} from '@/src/types';

import rawData from './pm-market-data.json';

const marketData = rawData as MarketData;

// ── Company Helpers ─────────────────────────────────────────

export function getAllCompanies(): MarketDataCompany[] {
  return marketData.companies;
}

export function getCompanyByName(name: string): MarketDataCompany | undefined {
  return marketData.companies.find(
    c => c.name.toLowerCase() === name.toLowerCase()
  );
}

export function getCompaniesForBackground(bg: Background): MarketDataCompany[] {
  const transitions = getTransitionIntelligence(bg);
  if (!transitions) return marketData.companies;

  const bestFit = new Set(transitions.bestFitCompanies.map(n => n.toLowerCase()));
  return [
    ...marketData.companies.filter(c => bestFit.has(c.name.toLowerCase())),
    ...marketData.companies.filter(c => !bestFit.has(c.name.toLowerCase())),
  ];
}

export function getSwitcherFriendlyCompanies(): MarketDataCompany[] {
  return marketData.companies.filter(c => c.switcherFriendly);
}

// ── Transition Intelligence ─────────────────────────────────

const BG_MAP: Record<string, string> = {
  engineer: 'software engineer',
  analyst: 'data analyst',
  consultant: 'consultant',
  designer: 'designer',
  mba: 'mba',
  other: 'operations',
};

export function getTransitionIntelligence(bg: Background | string): TransitionProfile | undefined {
  const searchTerm = BG_MAP[bg.toLowerCase()] || bg.toLowerCase();
  return marketData.transitionIntelligence.successRateByBackground.find(
    t => t.background.toLowerCase().includes(searchTerm) || searchTerm.includes(t.background.toLowerCase())
  );
}

export function getSwitcherFriendlyRanking() {
  return marketData.transitionIntelligence.switcherFriendlyRanking;
}

// ── Job Listings ────────────────────────────────────────────

export function getJobListings(): MarketJobListing[] {
  return marketData.jobListings;
}

export function getJobListingsForCompany(companyName: string): MarketJobListing[] {
  return marketData.jobListings.filter(
    j => j.company.toLowerCase() === companyName.toLowerCase()
  );
}

// ── Market Trends ───────────────────────────────────────────

export function getMarketTrends(): MarketTrend[] {
  return marketData.marketTrends;
}

// ── Interview Formats ───────────────────────────────────────

export function getInterviewFormat(region: 'india' | 'northAmerica') {
  return marketData.interviewFormats[region];
}

// ── Compensation ────────────────────────────────────────────

export function getCompensationData(region: 'india') {
  return marketData.compensation[region];
}

// ── Full Dataset (for AI prompts) ───────────────────────────

export function getMarketData(): MarketData {
  return marketData;
}

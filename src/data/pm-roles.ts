import type { PMRole } from '@/src/types';

export const PM_ROLES: PMRole[] = [
  {
    id: 'consumer_pm',
    name: 'Consumer PM',
    description:
      'Owns user-facing products used by millions. Lives in A/B tests, user research, and conversion funnels. Success means deeply understanding human behavior and translating messy qualitative insights into product decisions that move metrics. You ship features real people touch every day.',
    requiredStrengths: [
      'UX empathy and user research',
      'A/B testing and experimentation design',
      'Data-driven prioritization',
      'Cross-functional storytelling',
      'Rapid prototyping and iteration',
    ],
    typicalBackground: ['analyst', 'designer', 'mba'],
    salaryRange: '$120K-$180K',
    demandLevel: 'high',
    aiRelevance:
      'AI is reshaping consumer products fast — personalization engines, AI-generated content feeds, and conversational interfaces are now table stakes. Consumer PMs who can evaluate LLM-powered features and design for non-deterministic outputs have a significant edge in 2026.',
    entryDifficulty: 'medium',
  },
  {
    id: 'growth_pm',
    name: 'Growth PM',
    description:
      'Laser-focused on acquisition, activation, retention, and monetization. You own the funnel, run high-velocity experiments, and kill ideas that don\'t move numbers. Growth PMs think in loops and leverage points — not features. The best ones combine analytical rigor with creative intuition about what makes users stick.',
    requiredStrengths: [
      'Funnel analysis and optimization',
      'Experiment design and statistical reasoning',
      'SQL and product analytics fluency',
      'Behavioral psychology fundamentals',
      'Lifecycle and retention modeling',
      'Revenue and monetization strategy',
    ],
    typicalBackground: ['analyst', 'engineer'],
    salaryRange: '$130K-$190K',
    demandLevel: 'high',
    aiRelevance:
      'AI-powered growth is the new frontier: predictive churn models, LLM-generated onboarding flows, and AI agents that handle re-engagement automatically. Growth PMs who can design experiments around AI features — and understand when AI adds noise vs. signal — are in heavy demand in 2026.',
    entryDifficulty: 'medium',
  },
  {
    id: 'technical_pm',
    name: 'Technical PM',
    description:
      'Manages APIs, infrastructure, platforms, and developer-facing systems. You sit at the intersection of engineering and product, translating complex system constraints into clear product decisions. Credibility with engineers is your currency — you need to speak their language and earn trust through technical depth, not authority.',
    requiredStrengths: [
      'System design and architecture reasoning',
      'API design and developer experience intuition',
      'Engineering credibility and trade-off communication',
      'Technical specification writing',
      'Performance and scalability thinking',
    ],
    typicalBackground: ['engineer'],
    salaryRange: '$140K-$200K',
    demandLevel: 'high',
    aiRelevance:
      'Technical PMs are critical for AI infrastructure decisions: choosing between model providers, designing AI pipelines, managing latency-cost-quality trade-offs, and building reliable systems around non-deterministic outputs. In 2026, every technical PM needs a working understanding of LLM architectures and deployment patterns.',
    entryDifficulty: 'high',
  },
  {
    id: 'ai_ml_pm',
    name: 'AI/ML PM',
    description:
      'The hottest PM role of 2026. You own products where AI is the core value — not a feature bolt-on. This means navigating LLM trade-offs (cost vs. latency vs. quality), designing evaluation frameworks for non-deterministic outputs, and making product decisions when the technology itself is shifting weekly. Requires comfort with ambiguity at a level most PM roles never demand.',
    requiredStrengths: [
      'LLM trade-off evaluation (cost, latency, quality)',
      'Prompt engineering and model evaluation',
      'AI product design for non-deterministic systems',
      'Data pipeline and training data reasoning',
      'Responsible AI and safety thinking',
      'Rapid adaptation to shifting model capabilities',
    ],
    typicalBackground: ['engineer', 'analyst'],
    salaryRange: '$150K-$220K',
    demandLevel: 'high',
    aiRelevance:
      'This is ground zero. AI/ML PMs define how AI gets productized. In 2026 the market is white-hot: every company is building AI features, but very few PMs can actually evaluate model outputs, design guardrails, or make build-vs-buy decisions on foundation models. If you can bridge the gap between research and product, you name your price.',
    entryDifficulty: 'very_high',
  },
  {
    id: 'b2b_enterprise_pm',
    name: 'B2B/Enterprise PM',
    description:
      'Builds products for businesses, not consumers. Your world is stakeholder management, multi-persona workflows, sales alignment, and roadmap communication to customers who pay six-figure contracts. Success means balancing what one whale customer screams for against what the broader market actually needs — and saying no diplomatically.',
    requiredStrengths: [
      'Stakeholder management and executive communication',
      'Sales and customer success alignment',
      'Roadmap prioritization and communication',
      'Multi-persona workflow design',
      'Contract and pricing model reasoning',
    ],
    typicalBackground: ['consultant', 'mba'],
    salaryRange: '$130K-$190K',
    demandLevel: 'medium',
    aiRelevance:
      'Enterprise buyers in 2026 demand AI features but require explainability, compliance, and audit trails. B2B PMs who can translate AI capabilities into enterprise-grade solutions — with SOC 2 compliance, data residency controls, and clear ROI stories — have a strong differentiator over pure consumer-focused PMs.',
    entryDifficulty: 'medium',
  },
  {
    id: 'platform_pm',
    name: 'Platform PM',
    description:
      'Owns the developer experience layer — SDKs, APIs, internal platforms, or external ecosystems. You think about your users as builders: other engineers and product teams who depend on your platform to ship their own products. The job is enabling others to move fast without breaking things, which means obsessing over documentation, reliability, and backwards compatibility.',
    requiredStrengths: [
      'Developer experience and SDK design',
      'API versioning and backwards compatibility',
      'Ecosystem and marketplace thinking',
      'Internal platform adoption strategy',
      'Technical documentation standards',
      'Reliability and SLA reasoning',
    ],
    typicalBackground: ['engineer'],
    salaryRange: '$140K-$200K',
    demandLevel: 'medium',
    aiRelevance:
      'Platform PMs are building the AI infrastructure layer in 2026: model-serving platforms, AI middleware, agent orchestration frameworks, and plugin ecosystems. If you can design platforms that make it easy for other teams to ship AI features safely and consistently, you are solving one of the hardest problems in the industry right now.',
    entryDifficulty: 'high',
  },
];

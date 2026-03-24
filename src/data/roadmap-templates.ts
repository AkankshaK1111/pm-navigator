import type { Background, RoadmapWeek } from '@/src/types';

function week(
  weekNumber: number,
  theme: string,
  tasks: { title: string; description: string; type: 'learn' | 'do' | 'build' | 'network' | 'practice'; resource?: string; deliverable?: string }[],
  milestone: string,
  estimatedHours: number,
  bgPrefix: string = 'engineer'
): RoadmapWeek {
  return {
    weekNumber,
    theme,
    tasks: tasks.map((t, i) => ({
      id: `${bgPrefix}_${weekNumber}_${i}`,
      title: t.title,
      description: t.description,
      type: t.type,
      resource: t.resource || null,
      deliverable: t.deliverable || null,
    })),
    milestone,
    estimatedHours,
  };
}

// ── Engineer → PM ─────────────────────────────────────────────
const engineerRoadmap: RoadmapWeek[] = [
  week(1, 'Product Thinking Fundamentals', [
    { title: 'Read "Inspired" chapters 1-10', description: 'Study Marty Cagan\'s core product management principles. Take notes on product discovery vs delivery.', type: 'learn', deliverable: '2-page summary of key takeaways' },
    { title: 'Product teardown: Spotify Discovery', description: 'Analyze Spotify\'s Discover Weekly — what problem does it solve, how does it work, business model impact.', type: 'do', deliverable: '1-page product teardown document' },
    { title: 'Analyze business models of 3 SaaS products', description: 'Pick 3 products you use daily. Map their revenue model, pricing strategy, and key metrics.', type: 'do', deliverable: 'Business model canvas for each product' },
    { title: 'Connect with 1 PM on LinkedIn', description: 'Find a PM at a company you admire. Send a thoughtful connection request mentioning something specific about their work.', type: 'network', deliverable: '1 sent connection request' },
  ], 'First product teardown completed', 12),
  week(2, 'Product Thinking Applied', [
    { title: 'Write a product teardown of a B2B tool', description: 'Choose Figma, Notion, or Slack. Focus on business model, competitive moat, and growth strategy.', type: 'do', deliverable: '1-page B2B product teardown' },
    { title: 'Study product metrics frameworks', description: 'Learn AARRR (Pirate Metrics), North Star Metric, and how to define success metrics.', type: 'learn', resource: 'https://www.youtube.com/results?search_query=pirate+metrics+product+management', deliverable: 'Notes on 3 metrics frameworks' },
    { title: 'Identify 3 problems worth solving', description: 'From your daily life or work, identify 3 real problems. For each, write: who has this problem, how bad is it, what exists today.', type: 'do', deliverable: 'Problem statement document' },
  ], 'Can articulate product thinking', 10),
  week(3, 'User Research Methods', [
    { title: 'Learn user interview techniques', description: 'Study "The Mom Test" principles — how to ask questions that give useful data, not polite lies.', type: 'learn', resource: 'https://www.youtube.com/results?search_query=the+mom+test+summary', deliverable: 'Interview question template' },
    { title: 'Conduct 3 user interviews', description: 'Pick one of your identified problems. Find 3 people who have it. Interview them for 20 min each.', type: 'do', deliverable: '3 interview transcripts/notes' },
    { title: 'Synthesize findings', description: 'Analyze your 3 interviews. Identify patterns, surprising insights, and validated/invalidated assumptions.', type: 'do', deliverable: '1-page insight synthesis document' },
    { title: 'Send 2 networking messages', description: 'Reach out to 2 PMs or PM aspirants. Share an insight from your research to start a genuine conversation.', type: 'network', deliverable: '2 outreach messages sent' },
  ], 'Completed first user interviews', 12),
  week(4, 'User Research to Insights', [
    { title: 'Create user personas', description: 'Based on your interviews, create 2 user personas. Include goals, frustrations, and current workarounds.', type: 'do', deliverable: '2 user persona documents' },
    { title: 'Map user journey', description: 'For your strongest persona, map the end-to-end journey of dealing with the problem. Identify pain points.', type: 'do', deliverable: 'User journey map' },
    { title: 'Practice presenting insights', description: 'Present your research findings in a 5-minute presentation to a friend or record yourself.', type: 'practice', deliverable: 'Recorded presentation' },
  ], 'User research skills established', 10),
  week(5, 'Business Case & Product Brief', [
    { title: 'Study PRD templates', description: 'Read 3 example PRDs from established PMs. Understand structure: problem, solution, success metrics, risks.', type: 'learn', resource: 'https://www.youtube.com/results?search_query=product+requirements+document+template', deliverable: 'Notes on PRD best practices' },
    { title: 'Write a mini-PRD', description: 'For your researched problem, write a 2-page PRD: problem statement, proposed solution, target users, success metrics, risks.', type: 'build', deliverable: 'Completed mini-PRD' },
    { title: 'Get feedback from 2 PMs', description: 'Share your PRD with 2 PMs or product-minded friends. Ask for honest critique.', type: 'network', deliverable: 'Feedback notes and revised PRD' },
  ], 'First PRD written and reviewed', 12),
  week(6, 'Product Strategy Deep Dive', [
    { title: 'Write a product strategy memo', description: 'Choose a real product and write a 1-page strategy memo: vision, current position, 3 strategic bets, metrics.', type: 'do', deliverable: '1-page strategy memo' },
    { title: 'Competitive analysis exercise', description: 'Map the competitive landscape for your chosen product. Identify positioning, strengths, and vulnerabilities.', type: 'do', deliverable: 'Competitive analysis document' },
    { title: 'Study prioritization frameworks', description: 'Learn RICE, ICE, and MoSCoW. Apply one to prioritize 5 features for your PRD product.', type: 'learn', deliverable: 'Prioritized feature list with scores' },
  ], 'Strategy and prioritization skills', 10),
  week(7, 'Stakeholder Communication', [
    { title: 'Practice product decision presentation', description: 'Prepare and deliver a 10-minute presentation explaining a product tradeoff with data and recommendation.', type: 'practice', deliverable: 'Recorded presentation with slides' },
    { title: 'Write a roadmap communication', description: 'Create a quarterly roadmap for your PRD product. Adapt messaging for engineering, design, and leadership.', type: 'do', deliverable: 'Roadmap document with stakeholder framing' },
    { title: 'Send 3 networking outreach messages', description: 'Target PMs at companies you\'re interested in. Share your product teardown or strategy memo.', type: 'network', deliverable: '3 outreach messages sent' },
  ], 'Stakeholder communication practiced', 10),
  week(8, 'Cross-functional Leadership', [
    { title: 'Study PM-Engineering collaboration', description: 'Learn how top PMs work with engineers: sprint planning, technical tradeoffs, building credibility.', type: 'learn', deliverable: 'Notes on PM-Eng collaboration patterns' },
    { title: 'Practice a trade-off discussion', description: 'Simulate a conversation where you need to convince an engineer to change scope. Record yourself.', type: 'practice', deliverable: 'Self-evaluation notes' },
    { title: 'Follow up with 2 network contacts', description: 'Check in with contacts from earlier weeks. Share progress, ask for advice.', type: 'network', deliverable: '2 follow-up messages sent' },
  ], 'Cross-functional skills developed', 10),
  week(9, 'Mock Interview Intensive', [
    { title: 'Complete 3 product sense mock interviews', description: 'Practice "Design X for Y" and "Improve X" questions. Time yourself to 35 minutes. Record and review.', type: 'practice', deliverable: '3 completed mock interviews with self-reviews' },
    { title: 'Complete 2 execution mock interviews', description: 'Practice "Metric dropped by X%" and "How would you launch Y" questions.', type: 'practice', deliverable: '2 completed mock interviews' },
    { title: 'Build portfolio piece #1', description: 'Package your best product teardown, PRD, or strategy memo into a polished portfolio piece.', type: 'build', deliverable: 'Polished portfolio document' },
  ], 'First 5 mock interviews completed', 15),
  week(10, 'Portfolio & Personal Narrative', [
    { title: 'Complete 3 more mock interviews', description: 'Focus on your weakest question type. Practice behavioral questions using STAR framework.', type: 'practice', deliverable: '3 mock interviews with improvement notes' },
    { title: 'Build portfolio piece #2', description: 'Create a case study from your user research project: problem → research → insights → solution.', type: 'build', deliverable: 'Case study portfolio piece' },
    { title: 'Update LinkedIn with PM narrative', description: 'Rewrite your LinkedIn headline, summary, and experience to highlight PM-relevant work.', type: 'do', deliverable: 'Updated LinkedIn profile' },
  ], 'Portfolio started, narrative refined', 14),
  week(11, 'Networking Sprint', [
    { title: 'Send 10 targeted outreach messages', description: 'Identify PMs at your top 10 target companies. Send personalized messages referencing their work.', type: 'network', deliverable: '10 outreach messages sent' },
    { title: 'Identify 15 target roles', description: 'Research and list 15 PM roles that match your profile. For each: company, role title, why it fits.', type: 'do', deliverable: 'Target roles spreadsheet' },
    { title: 'Schedule 2 informational chats', description: 'Convert outreach into real conversations. Prepare 5 questions for each chat.', type: 'network', deliverable: '2 scheduled or completed chats' },
  ], 'Active job search pipeline', 12),
  week(12, 'Application Strategy & Launch', [
    { title: 'Prepare company-specific answers for top 5', description: 'For your top 5 target companies: research product, prepare "why this company" answer, identify recent product decisions.', type: 'practice', deliverable: 'Company prep documents for top 5' },
    { title: 'Apply to 5 roles with tailored materials', description: 'Submit applications with customized resumes and cover letters. Leverage referrals where available.', type: 'do', deliverable: '5 applications submitted' },
    { title: 'Complete 2 final mock interviews', description: 'Simulate full interview loops: product sense + execution + behavioral. Time-boxed and recorded.', type: 'practice', deliverable: '2 full mock interview recordings' },
    { title: 'Follow up with all network contacts', description: 'Send update messages to everyone you\'ve connected with. Share that you\'re actively applying.', type: 'network', deliverable: 'Follow-up messages sent' },
  ], 'Active applications submitted', 14),
];

// ── Consultant → PM ───────────────────────────────────────────
const consultantRoadmap: RoadmapWeek[] = [
  week(1, 'Technical Fundamentals', [
    { title: 'Complete API basics course', description: 'Learn what APIs are, REST vs GraphQL, HTTP methods. Speak the language, don\'t need to code.', type: 'learn', resource: 'https://www.youtube.com/results?search_query=APIs+for+product+managers', deliverable: 'Notes on API fundamentals' },
    { title: 'Learn SQL fundamentals', description: 'Complete a free SQL course. Focus on SELECT, JOIN, GROUP BY, aggregate functions.', type: 'learn', deliverable: 'Completed 10 SQL exercises' },
    { title: 'Build a simple Zapier automation', description: 'Create a 3-step workflow connecting real tools. Proves systems thinking.', type: 'build', deliverable: 'Working automation screenshot' },
    { title: 'Connect with 1 technical PM', description: 'Ask what "technical enough" means in practice.', type: 'network', deliverable: '1 connection request' },
  ], 'API and SQL basics completed', 12, 'consultant'),
  week(2, 'Technical Depth', [
    { title: 'Study system design basics', description: 'Learn client-server architecture, databases, caching at PM level.', type: 'learn', deliverable: 'System design notes' },
    { title: 'Read a technical architecture document', description: 'Find an open-source project\'s architecture doc. Understand technical decisions and product implications.', type: 'do', deliverable: 'Annotated architecture summary' },
    { title: 'Practice explaining tech concepts simply', description: 'Explain 3 technical concepts in 2 minutes each to a non-technical friend.', type: 'practice', deliverable: 'Communication self-assessment' },
  ], 'Can discuss tech with engineers', 10, 'consultant'),
  week(3, 'Data Analysis Project', [
    { title: 'SQL analysis on public data', description: 'Use a Kaggle dataset. Answer 5 product-relevant questions using SQL.', type: 'do', resource: 'https://www.kaggle.com/datasets', deliverable: 'SQL queries and analysis' },
    { title: 'Learn product analytics concepts', description: 'Study funnel analysis, cohort analysis, retention metrics.', type: 'learn', deliverable: 'Analytics framework notes' },
    { title: 'Send 2 networking messages', description: 'Reach out to Growth PMs about how they use data daily.', type: 'network', deliverable: '2 messages sent' },
  ], 'Data skills demonstrated', 12, 'consultant'),
  week(4, 'Data to Decisions', [
    { title: 'Build a simple dashboard', description: 'Using Google Sheets or free tools, create a dashboard that tells a product story.', type: 'build', deliverable: 'Dashboard link' },
    { title: 'Design an A/B test plan', description: 'Complete test plan: hypothesis, variants, metrics, sample size, duration.', type: 'do', deliverable: 'A/B test plan' },
    { title: 'Analyze public product metrics', description: 'Use earnings calls or SimilarWeb to analyze a product\'s performance.', type: 'do', deliverable: 'Product metrics analysis' },
  ], 'Data-driven decision making', 10, 'consultant'),
  week(5, 'Build a Prototype', [
    { title: 'Build prototype using Bubble or Retool', description: 'Turn a problem-solution idea into a functional prototype. Focus on core user flow.', type: 'build', resource: 'https://bubble.io', deliverable: 'Working prototype URL' },
    { title: 'Document product decisions', description: 'Write down every product decision: what you included, cut, and why.', type: 'do', deliverable: 'Product decision log' },
    { title: 'Get user feedback', description: 'Show prototype to 3 potential users. Note confusion points.', type: 'do', deliverable: 'User feedback notes' },
  ], 'Shipped a prototype', 12, 'consultant'),
  week(6, 'Product Intuition', [
    { title: 'Write 3 product teardowns', description: 'Analyze one you love, one you hate, one in your target industry.', type: 'do', deliverable: '3 teardown documents' },
    { title: 'Study product sense interview frameworks', description: 'Practice clarify → structure → solve → measure approach.', type: 'learn', deliverable: 'Framework notes' },
    { title: 'Network with ex-consultant PMs', description: 'Ask about biggest surprises in transition.', type: 'network', deliverable: '2 conversations' },
  ], 'Product intuition developing', 10, 'consultant'),
  week(7, 'Product Metrics Deep Dive', [
    { title: 'Study advanced metrics', description: 'North Star Metrics, counter-metrics, avoiding vanity metrics.', type: 'learn', deliverable: 'Metrics notes' },
    { title: 'Design an experimentation plan', description: '3-experiment plan: hypothesis, metric, expected impact.', type: 'do', deliverable: 'Experimentation plan' },
    { title: 'Practice metrics interview questions', description: '3 "metric dropped" questions with structured diagnostic.', type: 'practice', deliverable: 'Practice answers' },
  ], 'Metrics fluency', 10, 'consultant'),
  week(8, 'Stakeholder Storytelling', [
    { title: 'Adapt consulting skills for product', description: 'Practice a product roadmap presentation using your consulting storytelling.', type: 'practice', deliverable: 'Roadmap presentation' },
    { title: 'Write a product narrative', description: 'Create a compelling "why this product matters" story.', type: 'do', deliverable: 'Product narrative' },
    { title: 'Network with hiring managers', description: 'Ask what they look for in consulting-to-PM candidates.', type: 'network', deliverable: '2 conversations' },
  ], 'Communication adapted for PM', 10, 'consultant'),
  week(9, 'Mock Interview Intensive', [
    { title: 'Complete 5 mock PM interviews', description: 'Mix of product sense, execution, and behavioral. Focus on concrete examples.', type: 'practice', deliverable: '5 mock interviews' },
    { title: 'Build portfolio piece #1', description: 'Package prototype + decision log into a case study.', type: 'build', deliverable: 'Portfolio case study' },
    { title: 'Update LinkedIn', description: 'Reframe consulting experience using PM language.', type: 'do', deliverable: 'Updated LinkedIn' },
  ], '5 mocks completed', 15, 'consultant'),
  week(10, 'Portfolio Polish', [
    { title: 'Complete 3 more mocks', description: 'Focus on weak areas. Be specific, not abstract.', type: 'practice', deliverable: '3 mock interviews' },
    { title: 'Build portfolio piece #2', description: 'Data analysis project as case study.', type: 'build', deliverable: 'Data case study' },
    { title: 'Follow up with network', description: 'Share progress with contacts.', type: 'network', deliverable: 'Follow-ups sent' },
  ], 'Portfolio and mocks on track', 14, 'consultant'),
  week(11, 'Networking Sprint', [
    { title: 'Send 10 targeted messages', description: 'Leverage consulting network plus new PM connections.', type: 'network', deliverable: '10 messages sent' },
    { title: 'Identify 15 target roles', description: 'Roles emphasizing stakeholder management and strategy.', type: 'do', deliverable: 'Target roles spreadsheet' },
    { title: 'Schedule 3 informational chats', description: 'Convert connections into role-specific conversations.', type: 'network', deliverable: '3 chats scheduled' },
  ], 'Pipeline active', 12, 'consultant'),
  week(12, 'Application Launch', [
    { title: 'Company-specific prep for top 5', description: 'Research product, strategy, and PM expectations for each target.', type: 'practice', deliverable: 'Prep docs for top 5' },
    { title: 'Submit 5 applications', description: 'Prioritize roles with referrals.', type: 'do', deliverable: '5 applications' },
    { title: 'Final mock interview loops', description: 'Simulate end-to-end interviews.', type: 'practice', deliverable: '2 mock loops' },
    { title: 'Final network follow-ups', description: 'Ask for referrals where appropriate.', type: 'network', deliverable: 'Follow-ups complete' },
  ], 'Applications submitted', 14, 'consultant'),
];

// ── Analyst → PM (abbreviated — same structure) ───────────────
const analystRoadmap: RoadmapWeek[] = [
  week(1, 'Product Strategy Fundamentals', [
    { title: 'Study product strategy frameworks', description: 'Learn product vision, strategy, roadmapping. Read "Good Strategy Bad Strategy" summary.', type: 'learn', deliverable: 'Strategy framework notes' },
    { title: 'Write a strategy memo', description: 'Pick a product you use daily. Write 1-page strategy memo with position, bets, metrics.', type: 'do', deliverable: '1-page strategy memo' },
    { title: 'Analyze competitor landscape', description: 'Map competitive landscape. Identify positioning gaps.', type: 'do', deliverable: 'Competitive analysis' },
    { title: 'Connect with 1 PM', description: 'Ask how strategy differs from analysis in practice.', type: 'network', deliverable: '1 connection' },
  ], 'Strategic thinking foundation', 12, 'analyst'),
  week(2, 'From Analysis to Vision', [
    { title: 'Write a product vision document', description: 'Problem space, target users, 3-year vision, first-year goals.', type: 'do', deliverable: 'Vision document' },
    { title: 'Study product discovery methods', description: 'Opportunity solution trees, assumption testing, rapid prototyping.', type: 'learn', deliverable: 'Discovery notes' },
    { title: 'Identify 3 product opportunities with data', description: 'Use your analytical skills to back each opportunity with data.', type: 'do', deliverable: 'Opportunity analysis' },
  ], 'Vision skills developing', 10, 'analyst'),
  week(3, 'Communication & Storytelling', [
    { title: 'Practice product pitches', description: '3-minute pitch for your product idea. Record and review.', type: 'practice', deliverable: 'Recorded pitch' },
    { title: 'Create a product narrative', description: 'Write a compelling story about why your product matters. Use data AND emotion.', type: 'do', deliverable: 'Product narrative' },
    { title: 'Send 2 networking messages', description: 'Ask PMs for feedback on your communication style.', type: 'network', deliverable: '2 messages' },
  ], 'Communication improving', 10, 'analyst'),
  week(4, 'Persuasive Communication', [
    { title: 'Practice stakeholder presentations', description: 'Present a product decision to a skeptical audience. Handle objections.', type: 'practice', deliverable: 'Presentation recording' },
    { title: 'Write a 1-page product brief', description: 'Problem, solution, metrics, timeline — crisp and compelling.', type: 'do', deliverable: 'Product brief' },
    { title: 'Get feedback from 2 people', description: 'Was it clear? Compelling? What questions remained?', type: 'network', deliverable: 'Feedback notes' },
  ], 'Can pitch and persuade', 10, 'analyst'),
  week(5, 'Product Vision & Roadmapping', [
    { title: 'Draft a 6-month product roadmap', description: 'Include themes, milestones, dependencies. Use now/next/later framework.', type: 'do', deliverable: '6-month roadmap' },
    { title: 'Study roadmap communication', description: 'Learn to present roadmaps to engineering, design, leadership.', type: 'learn', deliverable: 'Roadmap notes' },
    { title: 'Get PM feedback', description: 'Share roadmap with a PM for realism check.', type: 'network', deliverable: 'Reviewed roadmap' },
  ], 'Roadmapping skills', 12, 'analyst'),
  week(6, 'User Research & Design Thinking', [
    { title: 'Learn UX research methods', description: 'User interviews, usability testing, card sorting.', type: 'learn', deliverable: 'Research methods notes' },
    { title: 'Conduct 3 user interviews', description: 'Open-ended questions about a real problem.', type: 'do', deliverable: '3 interview summaries' },
    { title: 'Prototype a solution', description: 'Sketch or wireframe based on research. Use Figma or paper.', type: 'build', deliverable: 'Wireframes' },
  ], 'User research acquired', 12, 'analyst'),
  week(7, 'Execution & Technical Fluency', [
    { title: 'Study API and system design basics', description: 'Enough for credible conversations with engineers.', type: 'learn', deliverable: 'Technical notes' },
    { title: 'Practice execution questions', description: 'Launch plans, prioritization, metric diagnosis questions.', type: 'practice', deliverable: 'Practice answers' },
    { title: 'Send 3 networking messages', description: 'Connect with Growth PMs or Data PMs.', type: 'network', deliverable: '3 messages' },
  ], 'Execution skills developing', 10, 'analyst'),
  week(8, 'Applied Product Work', [
    { title: 'Run a mini design sprint', description: '3 days: understand → sketch → decide → prototype → test.', type: 'do', deliverable: 'Sprint documentation' },
    { title: 'Practice technical PM questions', description: '"How would you design the system for X?"', type: 'practice', deliverable: 'Technical answers' },
    { title: 'Follow up with contacts', description: 'Share progress, ask for introductions.', type: 'network', deliverable: 'Follow-ups sent' },
  ], 'Hands-on product work', 10, 'analyst'),
  week(9, 'Mock Interview Intensive', [
    { title: 'Complete 5 mock interviews', description: 'Product sense + analytical + behavioral. Structure data insights as product narratives.', type: 'practice', deliverable: '5 mock interviews' },
    { title: 'Build portfolio piece #1', description: 'Strategy memo + roadmap as polished case study.', type: 'build', deliverable: 'Portfolio case study' },
    { title: 'Update LinkedIn', description: 'Reframe analyst experience in PM terms. Highlight decision-making impact.', type: 'do', deliverable: 'Updated LinkedIn' },
  ], 'Interview practice started', 15, 'analyst'),
  week(10, 'Portfolio & Narrative', [
    { title: 'Complete 3 more mocks', description: 'Focus on weak areas. Practice transition story.', type: 'practice', deliverable: '3 mock interviews' },
    { title: 'Build portfolio piece #2', description: 'Data-driven product analysis showcasing analytical edge.', type: 'build', deliverable: 'Analytical portfolio piece' },
    { title: 'Refine PM transition narrative', description: '"Why PM" and "why now" in under 2 minutes.', type: 'practice', deliverable: 'Narrative script' },
  ], 'Portfolio compelling', 14, 'analyst'),
  week(11, 'Networking Sprint', [
    { title: 'Send 10 targeted messages', description: 'Target companies where data-driven PMs thrive.', type: 'network', deliverable: '10 messages' },
    { title: 'Identify 15 target roles', description: 'Growth PM, Analytics PM, Consumer PM roles.', type: 'do', deliverable: 'Target list' },
    { title: 'Schedule 2 chats', description: 'Convert connections to conversations.', type: 'network', deliverable: '2 chats' },
  ], 'Active pipeline', 12, 'analyst'),
  week(12, 'Application Launch', [
    { title: 'Company-specific prep for top 5', description: 'Product knowledge, data culture, PM expectations.', type: 'practice', deliverable: 'Company prep docs' },
    { title: 'Submit 5 applications', description: 'Tailored materials highlighting data-to-product skills.', type: 'do', deliverable: '5 applications' },
    { title: 'Final mock loop', description: 'Full interview day simulation.', type: 'practice', deliverable: 'Mock loop completed' },
    { title: 'Network follow-ups', description: 'Final outreach to all contacts.', type: 'network', deliverable: 'Follow-ups sent' },
  ], 'Applications live', 14, 'analyst'),
];

// ── MBA → PM ──────────────────────────────────────────────────
const mbaRoadmap: RoadmapWeek[] = [
  week(1, 'Technical Literacy', [
    { title: 'Learn API basics', description: 'REST APIs, endpoints, JSON. Focus on product implications.', type: 'learn', deliverable: 'API notes' },
    { title: 'System design fundamentals', description: 'Client-server, databases, microservices at PM level.', type: 'learn', deliverable: 'System design notes' },
    { title: 'Build a Zapier automation', description: 'Connect 3+ tools. Proves systems thinking.', type: 'build', deliverable: 'Working automation' },
    { title: 'Connect with ex-MBA PM', description: 'Ask about the technical credibility gap.', type: 'network', deliverable: '1 connection' },
  ], 'Technical basics', 12, 'mba'),
  week(2, 'SQL & Technical Depth', [
    { title: 'Complete SQL basics', description: 'SELECT, JOIN, GROUP BY on free platform.', type: 'learn', deliverable: '10 exercises' },
    { title: 'Study mobile/web architecture', description: 'Frontend/backend, APIs, data storage.', type: 'learn', deliverable: 'Architecture notes' },
    { title: 'Explain tech to stakeholders', description: '3 technical concepts in business terms.', type: 'practice', deliverable: 'Communication practice' },
  ], 'Can speak technical language', 10, 'mba'),
  week(3, 'Hands-on Building', [
    { title: 'Ship a micro-product in 7 days', description: 'Build something small but real: survey tool, landing page, simple app.', type: 'build', deliverable: 'Live product URL' },
    { title: 'Document product decisions', description: 'Every choice you made and why. This IS product management.', type: 'do', deliverable: 'Decision log' },
    { title: 'Get 5 users to test it', description: 'Watch them use it. Note confusion points.', type: 'do', deliverable: 'Testing notes' },
    { title: 'Send 2 networking messages', description: 'Share your micro-product with PM contacts.', type: 'network', deliverable: '2 messages' },
  ], 'Shipped something real', 14, 'mba'),
  week(4, 'Iterate and Learn', [
    { title: 'Iterate based on feedback', description: 'Make 3 improvements. Document why each matters.', type: 'build', deliverable: 'Updated product' },
    { title: 'Write a retrospective', description: 'What worked, what didn\'t, what you\'d change.', type: 'do', deliverable: 'Retro document' },
    { title: 'Study product lifecycle', description: 'Product-market fit, growth levers, when to pivot.', type: 'learn', deliverable: 'Lifecycle notes' },
  ], 'Iteration demonstrated', 10, 'mba'),
  week(5, 'Product Analytics', [
    { title: 'SQL + analytics project', description: 'Analyze public dataset from product perspective.', type: 'do', deliverable: 'Data analysis' },
    { title: 'Learn metrics frameworks', description: 'AARRR, North Star, success metrics.', type: 'learn', deliverable: 'Metrics notes' },
    { title: 'Design metrics for your product', description: 'Define success metrics for what you built.', type: 'do', deliverable: 'Metrics plan' },
  ], 'Data-driven thinking', 12, 'mba'),
  week(6, 'Metrics to Decisions', [
    { title: 'Create analytics dashboard', description: 'Dashboard telling your product\'s data story.', type: 'build', deliverable: 'Dashboard' },
    { title: 'Design an A/B test', description: 'Complete test plan with hypothesis and metrics.', type: 'do', deliverable: 'A/B test plan' },
    { title: 'Network with data PMs', description: 'Ask about balancing data with intuition.', type: 'network', deliverable: '2 conversations' },
  ], 'Analytics applied', 10, 'mba'),
  week(7, 'Rapid Execution Sprint', [
    { title: 'Run a 3-day design sprint', description: 'Map → sketch → decide → prototype → test.', type: 'do', deliverable: 'Sprint documentation' },
    { title: 'Practice execution speed', description: 'MBA teaches deliberation — PM requires faster decisions.', type: 'practice', deliverable: 'Speed self-assessment' },
    { title: 'Send 3 networking messages', description: 'Connect with startup PMs who value execution speed.', type: 'network', deliverable: '3 messages' },
  ], 'Execution speed improved', 12, 'mba'),
  week(8, 'Product Communication', [
    { title: 'Write a PRD', description: 'Package sprint work into formal PRD.', type: 'do', deliverable: 'PRD document' },
    { title: 'Practice roadmap presentation', description: 'Create and present quarterly roadmap.', type: 'practice', deliverable: 'Roadmap presentation' },
    { title: 'Get PRD feedback from PMs', description: 'Share for honest critique.', type: 'network', deliverable: 'Feedback notes' },
  ], 'Communication polished', 10, 'mba'),
  week(9, 'Mock Interview Intensive', [
    { title: 'Complete 5 mock interviews', description: 'All types. Focus on being concrete — avoid MBA abstractions.', type: 'practice', deliverable: '5 mocks' },
    { title: 'Build portfolio piece #1', description: 'Micro-product journey as case study.', type: 'build', deliverable: 'Case study' },
    { title: 'Update LinkedIn', description: 'Lead with building, not degree.', type: 'do', deliverable: 'Updated LinkedIn' },
  ], 'Interview practice started', 15, 'mba'),
  week(10, 'Portfolio & Story', [
    { title: 'Complete 3 more mocks', description: 'Focus on execution — MBA candidates\' weak spot. Be concrete.', type: 'practice', deliverable: '3 mocks' },
    { title: 'Build portfolio piece #2', description: 'Strategy + data case study.', type: 'build', deliverable: 'Strategy piece' },
    { title: 'Refine MBA-to-PM narrative', description: 'What MBA gave you + what you built = PM ready.', type: 'practice', deliverable: 'Narrative script' },
  ], 'Strong portfolio', 14, 'mba'),
  week(11, 'Networking Sprint', [
    { title: 'Send 10 targeted messages', description: 'Leverage MBA alumni network plus new PM connections.', type: 'network', deliverable: '10 messages' },
    { title: 'Identify 15 target roles', description: 'B2B PM, Strategy PM, Consumer PM at larger companies.', type: 'do', deliverable: 'Target list' },
    { title: 'Schedule 3 chats', description: 'Prioritize hiring managers.', type: 'network', deliverable: '3 chats' },
  ], 'Active pipeline', 12, 'mba'),
  week(12, 'Application Launch', [
    { title: 'Company-specific prep', description: 'Product knowledge and "why here" narrative for each target.', type: 'practice', deliverable: 'Prep docs' },
    { title: 'Submit 5 applications', description: 'Materials that prove you can build, not just plan.', type: 'do', deliverable: '5 applications' },
    { title: 'Final mock loops', description: 'Full interview simulations.', type: 'practice', deliverable: '2 mock loops' },
    { title: 'Final network sweep', description: 'Update all contacts.', type: 'network', deliverable: 'Follow-ups' },
  ], 'Applications submitted', 14, 'mba'),
];

// ── Designer → PM ─────────────────────────────────────────────
const designerRoadmap: RoadmapWeek[] = [
  week(1, 'Data & Analytics Fundamentals', [
    { title: 'Learn SQL basics', description: 'Data is your biggest gap. Start with SELECT, JOIN, GROUP BY.', type: 'learn', deliverable: '10 SQL exercises' },
    { title: 'Set up analytics for a project', description: 'Add GA or Mixpanel to a personal project. Understand events, funnels, retention.', type: 'build', deliverable: 'Analytics setup' },
    { title: 'Study product metrics', description: 'AARRR, activation rates, retention curves.', type: 'learn', deliverable: 'Metrics notes' },
    { title: 'Connect with 1 designer-turned-PM', description: 'Ask about the transition experience.', type: 'network', deliverable: '1 connection' },
  ], 'Data fundamentals started', 12, 'designer'),
  week(2, 'Data-Driven Design', [
    { title: 'Make 3 data-driven decisions', description: 'Using analytics, identify 3 insights and make decisions based on data.', type: 'do', deliverable: 'Decision log' },
    { title: 'Study A/B testing', description: 'Set up tests, interpret results, balance data with intuition.', type: 'learn', deliverable: 'A/B testing notes' },
    { title: 'Analyze a product\'s public metrics', description: 'Short analysis of publicly available performance data.', type: 'do', deliverable: 'Metrics analysis' },
  ], 'Can use data for decisions', 10, 'designer'),
  week(3, 'Business Acumen', [
    { title: 'Analyze 5 business models', description: 'Pick 5 products. Map revenue model, unit economics, growth strategy.', type: 'do', deliverable: '5 business analyses' },
    { title: 'Write a strategy memo', description: '1-page: market position and strategic bets.', type: 'do', deliverable: 'Strategy memo' },
    { title: 'Revenue modeling exercise', description: 'Pricing × users × conversion for a product idea.', type: 'do', deliverable: 'Revenue model' },
    { title: 'Network with business-minded PMs', description: 'Ask about business side of product decisions.', type: 'network', deliverable: '2 messages' },
  ], 'Business thinking foundation', 12, 'designer'),
  week(4, 'Business Strategy Applied', [
    { title: 'Study pricing strategies', description: 'Freemium, tiered, usage-based. How design influences pricing.', type: 'learn', deliverable: 'Pricing notes' },
    { title: 'Write market opportunity analysis', description: 'Size a market, analyze competition, propose entry strategy.', type: 'do', deliverable: 'Market analysis' },
    { title: 'Practice business presentations', description: 'Focus on numbers and strategy, not just visuals.', type: 'practice', deliverable: 'Presentation recording' },
  ], 'Business case skills', 10, 'designer'),
  week(5, 'Technical Foundations', [
    { title: 'Learn API basics', description: 'How your designs connect to backends. REST, endpoints, data flow.', type: 'learn', deliverable: 'API notes' },
    { title: 'System design at PM level', description: 'Databases, caching, CDNs — enough for informed decisions.', type: 'learn', deliverable: 'System design notes' },
    { title: 'Build a simple integration', description: 'Connect tools via API/Zapier. Understand data flow.', type: 'build', deliverable: 'Working integration' },
  ], 'Technical vocabulary', 12, 'designer'),
  week(6, 'Tech + Design Intersection', [
    { title: 'Analyze a design system as product', description: 'Material, Radix — focus on product decisions: consistency vs flexibility.', type: 'do', deliverable: 'Design system analysis' },
    { title: 'Practice technical PM questions', description: '"How would you design the system for X?" at product level.', type: 'practice', deliverable: 'Technical practice' },
    { title: 'Network with technical PMs', description: 'Ask about technical fluency expectations.', type: 'network', deliverable: '2 conversations' },
  ], 'Tech-design bridge', 10, 'designer'),
  week(7, 'PM Frameworks', [
    { title: 'Write a PRD for a past design', description: 'The PRD that should have existed for a feature you designed.', type: 'do', deliverable: 'PRD document' },
    { title: 'Study roadmapping', description: 'Build and communicate product roadmaps.', type: 'learn', deliverable: 'Roadmap' },
    { title: 'Practice stakeholder scenarios', description: 'VP wants X, data says Y. Navigate the conflict.', type: 'practice', deliverable: 'Scenario notes' },
  ], 'PM methods understood', 10, 'designer'),
  week(8, 'Design Leadership → PM', [
    { title: 'User research with PM lens', description: '3 interviews focusing on business impact, not just usability.', type: 'do', deliverable: '3 summaries' },
    { title: 'Prioritize with data', description: 'RICE scoring for 5 features. Balance intuition with metrics.', type: 'do', deliverable: 'Prioritization scorecard' },
    { title: 'Follow up with network', description: 'Share PRD and roadmap for feedback.', type: 'network', deliverable: 'Feedback collected' },
  ], 'PM-ready leadership', 10, 'designer'),
  week(9, 'Mock Interview Intensive', [
    { title: 'Complete 5 mock interviews', description: 'Product sense (strength) + execution (growth area). Be specific about metrics.', type: 'practice', deliverable: '5 mocks' },
    { title: 'Build portfolio piece #1', description: 'Design → business impact story as PM case study.', type: 'build', deliverable: 'Case study' },
    { title: 'Update LinkedIn', description: 'Reframe design in product terms: impact, decisions, metrics.', type: 'do', deliverable: 'Updated LinkedIn' },
  ], 'Interview practice', 15, 'designer'),
  week(10, 'Portfolio & Narrative', [
    { title: 'Complete 3 more mocks', description: 'Focus on analytical and behavioral questions.', type: 'practice', deliverable: '3 mocks' },
    { title: 'Build portfolio piece #2', description: 'Business + data case study showing beyond-pixels thinking.', type: 'build', deliverable: 'Business portfolio piece' },
    { title: 'Craft designer-to-PM narrative', description: 'UX empathy is rare in PM. Position it as superpower.', type: 'practice', deliverable: 'Narrative script' },
  ], 'Portfolio polished', 14, 'designer'),
  week(11, 'Networking Sprint', [
    { title: 'Send 10 targeted messages', description: 'Target design-led companies: Figma, Airbnb, Stripe cultures.', type: 'network', deliverable: '10 messages' },
    { title: 'Identify 15 target roles', description: 'Consumer PM and B2B PM where UX empathy wins.', type: 'do', deliverable: 'Target list' },
    { title: 'Schedule 2 chats', description: 'PM leaders who value design thinking.', type: 'network', deliverable: '2 chats' },
  ], 'Pipeline active', 12, 'designer'),
  week(12, 'Application Launch', [
    { title: 'Company-specific prep', description: 'Design culture and product strategy for each target.', type: 'practice', deliverable: 'Prep docs' },
    { title: 'Submit 5 applications', description: 'Highlight design + product + data combination.', type: 'do', deliverable: '5 applications' },
    { title: 'Final mock loops', description: 'Design case + product sense + execution.', type: 'practice', deliverable: '2 mock loops' },
    { title: 'Final network sweep', description: 'Let contacts know you\'re searching.', type: 'network', deliverable: 'Follow-ups' },
  ], 'Applications live', 14, 'designer'),
];

// Use engineer template as base for "other" background
const otherRoadmap: RoadmapWeek[] = engineerRoadmap.map(w => ({
  ...w,
  tasks: w.tasks.map(t => ({
    ...t,
    id: t.id.replace('engineer_', 'other_'),
  })),
}));

export const ROADMAP_TEMPLATES: Record<Background, RoadmapWeek[]> = {
  engineer: engineerRoadmap,
  consultant: consultantRoadmap,
  analyst: analystRoadmap,
  mba: mbaRoadmap,
  designer: designerRoadmap,
  other: otherRoadmap,
};

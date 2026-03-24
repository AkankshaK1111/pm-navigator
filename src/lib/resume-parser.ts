import Groq from 'groq-sdk';
import type { ResumeData } from '@/src/types';

const apiKey = process.env.GROQ_API_KEY;

/**
 * Parse resume text extracted from PDF and return structured PM-relevant data.
 */
export async function parseResumeText(text: string): Promise<ResumeData> {
  if (!apiKey) throw new Error('AI API key not configured');
  if (!text || text.trim().length < 50) throw new Error('Resume text too short to parse');

  const client = new Groq({ apiKey, dangerouslyAllowBrowser: true });

  const prompt = `You are a PM hiring expert. Analyse this resume and extract structured information.

Rules for pmHighlights:
- strength = something that signals PM readiness (cross-functional work, impact metrics, ownership, shipping things)
- warning = something that may need reframing in a PM interview (service company vs product company, no metrics, etc.)
- action = something missing that they should build (proof of work, product writing, user research, etc.)
- Be specific to THIS resume, not generic

Resume:
${text.slice(0, 4000)}

Return JSON with this exact structure:
{
  "name": "Full name",
  "email": "email or empty string",
  "phone": "phone or empty string",
  "currentRole": "Most recent job title at Company",
  "totalExperience": "Total years as string e.g. '6 years'",
  "experience": ["Job Title at Company (start–end)", ...up to 5],
  "awards": ["award1", ...up to 3],
  "pmHighlights": [
    {"text": "specific observation", "type": "strength|warning|action", "label": "↑/⚠/→ brief label"},
    ...exactly 4
  ],
  "skills": ["skill1", ...up to 8]
}`;

  const response = await client.chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.1,
    max_tokens: 1000,
    response_format: { type: 'json_object' },
  });

  const data = JSON.parse(response.choices[0]?.message?.content || '{}');
  return data as ResumeData;
}

/**
 * Extract text from a PDF file using PDF.js.
 * Returns text from the first 3 pages.
 */
export async function extractPdfText(file: File): Promise<string> {
  const pdfjsLib = await import('pdfjs-dist');
  pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;

  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  const maxPages = Math.min(pdf.numPages, 3);

  const textParts: string[] = [];
  for (let i = 1; i <= maxPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    const pageText = content.items
      .map((item: any) => item.str)
      .join(' ');
    textParts.push(pageText);
  }

  return textParts.join('\n\n');
}

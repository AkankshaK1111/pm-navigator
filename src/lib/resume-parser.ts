import { GoogleGenAI, Type } from '@google/genai';
import type { ResumeData } from '@/src/types';

const apiKey = process.env.GEMINI_API_KEY;

/**
 * Parse resume text extracted from PDF and return structured PM-relevant data.
 * Port of compass-PM/api/parse-resume.js → @google/genai SDK.
 */
export async function parseResumeText(text: string): Promise<ResumeData> {
  if (!apiKey) throw new Error('Gemini API key not configured');
  if (!text || text.trim().length < 50) throw new Error('Resume text too short to parse');

  const ai = new GoogleGenAI({ apiKey });

  const prompt = `You are a PM hiring expert. Analyse this resume and extract structured information.

Rules for pmHighlights:
- strength = something that signals PM readiness (cross-functional work, impact metrics, ownership, shipping things)
- warning = something that may need reframing in a PM interview (service company vs product company, no metrics, etc.)
- action = something missing that they should build (proof of work, product writing, user research, etc.)
- Be specific to THIS resume, not generic

Resume:
${text.slice(0, 4000)}`;

  const response = await ai.models.generateContent({
    model: 'gemini-2.0-flash',
    contents: prompt,
    config: {
      responseMimeType: 'application/json',
      temperature: 0.1,
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING, description: 'Full name' },
          email: { type: Type.STRING, description: 'Email or empty string if not found', nullable: true },
          phone: { type: Type.STRING, description: 'Phone or empty string if not found', nullable: true },
          currentRole: { type: Type.STRING, description: 'Most recent job title at Company (e.g. Senior Engineer at Infosys)' },
          totalExperience: { type: Type.STRING, description: 'Total years of work experience as a string (e.g. "6 years")' },
          experience: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: 'Up to 5 most recent roles as "Job Title at Company (start–end)"',
          },
          awards: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: 'Up to 3 awards or recognitions',
          },
          pmHighlights: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                text: { type: Type.STRING, description: 'One specific observation about a PM-relevant signal' },
                type: { type: Type.STRING, description: 'One of: strength, warning, action' },
                label: { type: Type.STRING, description: 'Brief label with prefix: ↑ for strength, ⚠ for warning, → for action' },
              },
              required: ['text', 'type', 'label'],
            },
            description: 'Exactly 4 PM-relevant highlights from the resume',
          },
          skills: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: 'Up to 8 most relevant skills',
          },
        },
        required: ['name', 'currentRole', 'totalExperience', 'experience', 'pmHighlights', 'skills'],
      },
    },
  });

  const data = JSON.parse(response.text || '{}');
  return data as ResumeData;
}

/**
 * Extract text from a PDF file using PDF.js.
 * Returns text from the first 3 pages.
 */
export async function extractPdfText(file: File): Promise<string> {
  // Dynamically import pdfjs-dist
  const pdfjsLib = await import('pdfjs-dist');

  // Set worker source
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

import { useToast } from "@/hooks/use-toast";
import { useState, useCallback } from "react";

export type DocumentType = 'pdf' | 'docx' | 'txt';

export interface ExtractedSection {
  title: string;
  content: string;
  startIndex: number;
  endIndex: number;
}

export interface PipelineResult {
  rawText: string;
  cleanText: string;
  sections: ExtractedSection[];
  metadata: {
    fileName: string;
    fileSize: number;
    wordCount: number;
    hasEmojis: boolean;
  };
}

// Heuristics for section detection
const SECTION_KEYWORDS: Record<string, string[]> = {
  EXPERIENCE: ['pengalaman', 'experience', 'riwayat kerja', 'work history', 'professional background'],
  EDUCATION: ['pendidikan', 'education', 'latar belakang pendidikan', 'akademik', 'academic'],
  SKILLS: ['keahlian', 'skills', 'kompetensi', 'competencies', 'technical skills', 'hard skills', 'soft skills'],
  SUMMARY: ['ringkasan', 'summary', 'tentang saya', 'about me', 'profile', 'profil'],
  PROJECTS: ['proyek', 'projects', 'portfolio', 'portofolio'],
  CERTIFICATIONS: ['sertifikasi', 'certifications', 'lisensi', 'licenses'],
};

const EMOJI_REGEX = /[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F1E0}-\u{1F1FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{FE00}-\u{FE0F}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA6F}\u{1FA70}-\u{1FAFF}\u{200D}\u{20E3}\u{E0020}-\u{E007F}]/gu;

/**
 * Stage 1: Parsing
 */
async function parsePDF(file: File): Promise<string> {
  const pdfjsLib = await import('pdfjs-dist');
  // @ts-ignore
  pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;
  
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  const pages: string[] = [];
  
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    pages.push(content.items.map((item: any) => item.str).join(' '));
  }
  
  return pages.join('\n\n');
}

async function parseDOCX(file: File): Promise<string> {
  const mammoth = await import('mammoth');
  const arrayBuffer = await file.arrayBuffer();
  const result = await mammoth.extractRawText({ arrayBuffer });
  return result.value;
}

/**
 * Stage 2: Sanitization
 */
function sanitizeText(text: string): string {
  // Remove emojis
  let clean = text.replace(EMOJI_REGEX, '');
  // Normalize whitespace
  clean = clean.replace(/\s{2,}/g, ' ');
  // Remove control characters
  clean = clean.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F-\x9F]/g, '');
  return clean.trim();
}

/**
 * Stage 3: Section Identification
 */
function identifySections(text: string): ExtractedSection[] {
  const lines = text.split('\n');
  const sections: ExtractedSection[] = [];
  let currentSection: Partial<ExtractedSection> | null = null;

  lines.forEach((line, index) => {
    const trimmedLine = line.trim().toLowerCase();
    if (trimmedLine.length === 0) return;

    let foundType: string | null = null;
    for (const [type, keywords] of Object.entries(SECTION_KEYWORDS)) {
      if (keywords.some(kw => trimmedLine === kw || trimmedLine.startsWith(kw + ':') || (trimmedLine.length < 30 && trimmedLine.includes(kw)))) {
        foundType = type;
        break;
      }
    }

    if (foundType) {
      if (currentSection) {
        currentSection.endIndex = index - 1;
        sections.push(currentSection as ExtractedSection);
      }
      currentSection = {
        title: foundType,
        content: '',
        startIndex: index
      };
    } else if (currentSection) {
      currentSection.content += line + '\n';
    }
  });

  if (currentSection) {
    currentSection.endIndex = lines.length - 1;
    sections.push(currentSection as ExtractedSection);
  }

  return sections;
}

/**
 * The Main Pipeline Hook
 */
export function useDocumentPipeline() {
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const processDocument = useCallback(async (file: File): Promise<PipelineResult | null> => {
    setIsProcessing(true);
    try {
      const ext = file.name.split('.').pop()?.toLowerCase() as DocumentType;
      
      // Stage 1: Extraction
      let rawText = '';
      if (ext === 'pdf') {
        rawText = await parsePDF(file);
      } else if (ext === 'docx') {
        rawText = await parseDOCX(file);
      } else if (ext === 'txt') {
        rawText = await file.text();
      } else {
        throw new Error('Unsupported file format');
      }

      if (rawText.trim().length < 50) {
        throw new Error('Document content too short or unreadable');
      }

      // Stage 2: Sanitization
      const cleanText = sanitizeText(rawText);
      const hasEmojis = EMOJI_REGEX.test(rawText);

      // Stage 3: Section Identification
      const sections = identifySections(rawText);

      const result: PipelineResult = {
        rawText,
        cleanText,
        sections,
        metadata: {
          fileName: file.name,
          fileSize: file.size,
          wordCount: cleanText.split(/\s+/).length,
          hasEmojis
        }
      };

      toast({
        title: "Processing Complete",
        description: `Extracted ${result.metadata.wordCount} words and ${sections.length} sections.`,
      });

      return result;

    } catch (error: any) {
      console.error('Pipeline Error:', error);
      toast({
        title: "Processing Failed",
        description: error.message || "Failed to process document",
        variant: "destructive"
      });
      return null;
    } finally {
      setIsProcessing(false);
    }
  }, [toast]);

  return {
    processDocument,
    isProcessing
  };
}

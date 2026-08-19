export interface ResumeResponse {
  id: string;
  fileName: string;
  displayName: string;
  targetRole: string | null;
  storageBucket: string;
  storagePath: string;
  contentType: string;
  sizeBytes: number;
  extension: string;
  status: string;
  originalText: string | null;
  extractedJson: string | null;
  analysisJson: string | null;
  score: number | null;
  isActive: boolean;
  isArchived: boolean;
  parserVersion: number;
  createdAtUtc: string;
  updatedAtUtc: string | null;
}

export interface ResumeExtractedData {
  contact: { name: string; email: string; phone: string; linkedIn: string; website: string };
  sections: ResumeExtractedSection[];
}

export interface ResumeExtractedSection { heading: string; category: string; items: string[]; }

export interface ResumeAnalysisData {
  score: number;
  atsCompatibility: number;
  keywordStrength: number;
  impactStatements: number;
  strengths: string[];
  missingKeywords: string[];
  suggestions: string[];
}

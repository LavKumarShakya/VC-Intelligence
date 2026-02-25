export type Stage = "Seed" | "Series A" | "Series B" | "Series C" | "Growth" | "Public";

export interface Signal {
  id: string;
  date: string;
  type: string;
  description: string;
}

export interface Company {
  id: string;
  name: string;
  industry: string;
  stage: Stage;
  location: string;
  website: string;
  description: string;
  founded: number;
  signalsCount: number;
  lastEnriched: string | null;
  signals: Signal[];
}

export interface Note {
  id: string;
  companyId: string;
  content: string;
  createdAt: string;
}

export interface EnrichmentResult {
  companyId: string;
  summary: string;
  whatTheyDo: string[];
  keywords: string[];
  derivedSignals: string[];
  sources: { url: string; timestamp: string }[];
  enrichedAt: string;
}

export interface CompanyList {
  id: string;
  name: string;
  companyIds: string[];
  createdAt: string;
}

export interface SavedSearch {
  id: string;
  query: string;
  filters: {
    industry?: string;
    stage?: string;
    location?: string;
  };
  createdAt: string;
}

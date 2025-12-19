import { Tables, Json } from '@/integrations/supabase/types';

// Research types
export type ProspectResearch = Tables<'lab_prospect_research'>;
export type ResearchInsert = Omit<ProspectResearch, 'id' | 'created_at' | 'updated_at'>;
export type ResearchUpdate = Partial<ResearchInsert>;

// Research status
export type ResearchStatus = 'pending' | 'processing' | 'completed' | 'failed';

// Form data for initiating research
export interface ResearchFormData {
  company_name: string;
  website_url: string;
  linkedin_url?: string | null;
  research_type: 'standard' | 'quick' | 'deep';
  notes?: string;
}

// Research results structure (dynamic from AI)
export interface ResearchResults {
  executive_summary?: {
    fit_score: number;
    summary: string;
    [key: string]: unknown;
  };
  [key: string]: unknown;
}

// Webhook response format
export interface WebhookResponse {
  output: {
    executive_summary: {
      fit_score: number;
      [key: string]: unknown;
    };
    [key: string]: unknown;
  };
}

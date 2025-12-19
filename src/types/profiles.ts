import { Tables } from '@/integrations/supabase/types';

// User Profile types
export type UserProfile = Tables<'lab_user_profiles'>;
export type UserProfileInsert = Omit<UserProfile, 'id' | 'created_at' | 'updated_at'>;
export type UserProfileUpdate = Partial<UserProfileInsert>;

// Company Profile types
export type CompanyProfile = Tables<'lab_company_profiles'>;
export type CompanyProfileInsert = Omit<CompanyProfile, 'id' | 'created_at' | 'updated_at'>;
export type CompanyProfileUpdate = Partial<CompanyProfileInsert>;

// Form data types for wizard components
export interface UserProfileFormData {
  full_name: string;
  linkedin_profile?: string | null;
  current_location?: string | null;
  birthplace?: string | null;
  role_in_organization: string;
  outreach_experience: string;
  prospects_per_week: string;
  communication_style: string;
  introduction_style: string;
  credibility_preference: string[];
  preferred_contact_channel: string[];
  followup_timing: string;
  nonresponse_handling: string;
  pain_points_focus: string[];
  expertise_positioning: string;
  objection_handling: string[];
  meeting_format: string[];
  meeting_duration: string;
  success_metrics: string[];
}

export interface CompanyProfileFormData {
  company_name: string;
  website_url: string;
  linkedin_url?: string | null;
  business_registration?: string | null;
  industry: string;
  years_active?: string | null;
  company_size: string;
  mission: string;
  vision?: string | null;
  values: string[];
  offering_type: string[];
  main_offerings: string[];
  unique_differentiators: string[];
  typical_results: string[];
  ideal_client_size: string[];
  target_industries: string[];
  project_scope: string;
  geographic_markets: string[];
  pricing_positioning: string;
  delivery_model: string[];
  success_story?: string | null;
  known_clients?: boolean | null;
  known_clients_list?: string | null;
  credentials: string[];
  organizational_personality: string[];
  communication_style: string;
}

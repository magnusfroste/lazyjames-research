import { supabase } from '@/integrations/supabase/client';
import type { UserProfile, CompanyProfile, UserProfileFormData, CompanyProfileFormData } from '@/types/profiles';

// ============ User Profile Operations ============

export async function getUserProfile(userId: string): Promise<UserProfile | null> {
  const { data, error } = await supabase
    .from('lab_user_profiles')
    .select('*')
    .eq('user_id', userId)
    .maybeSingle();
  
  if (error) throw error;
  return data;
}

export async function upsertUserProfile(userId: string, formData: UserProfileFormData): Promise<UserProfile> {
  const payload = {
    user_id: userId,
    is_complete: true,
    full_name: formData.full_name ?? '',
    linkedin_profile: formData.linkedin_profile ?? null,
    current_location: formData.current_location ?? null,
    birthplace: formData.birthplace ?? null,
    role_in_organization: formData.role_in_organization ?? '',
    outreach_experience: formData.outreach_experience ?? '',
    prospects_per_week: formData.prospects_per_week ?? '',
    communication_style: formData.communication_style ?? '',
    introduction_style: formData.introduction_style ?? '',
    credibility_preference: formData.credibility_preference ?? [],
    preferred_contact_channel: formData.preferred_contact_channel ?? [],
    followup_timing: formData.followup_timing ?? '',
    nonresponse_handling: formData.nonresponse_handling ?? '',
    pain_points_focus: formData.pain_points_focus ?? [],
    expertise_positioning: formData.expertise_positioning ?? '',
    objection_handling: formData.objection_handling ?? [],
    meeting_format: formData.meeting_format ?? [],
    meeting_duration: formData.meeting_duration ?? '',
    success_metrics: formData.success_metrics ?? []
  };

  const { data, error } = await supabase
    .from('lab_user_profiles')
    .upsert(payload, { onConflict: 'user_id' })
    .select()
    .single();

  if (error) throw error;
  return data;
}

// ============ Company Profile Operations ============

export async function getCompanyProfile(userId: string): Promise<CompanyProfile | null> {
  const { data, error } = await supabase
    .from('lab_company_profiles')
    .select('*')
    .eq('user_id', userId)
    .maybeSingle();

  if (error) throw error;
  return data;
}

export async function upsertCompanyProfile(userId: string, formData: CompanyProfileFormData): Promise<CompanyProfile> {
  const payload = {
    user_id: userId,
    is_complete: true,
    company_name: formData.company_name ?? '',
    website_url: formData.website_url ?? '',
    linkedin_url: formData.linkedin_url ?? null,
    business_registration: formData.business_registration ?? null,
    industry: formData.industry ?? '',
    years_active: formData.years_active ?? '',
    company_size: formData.company_size ?? '',
    mission: formData.mission ?? '',
    vision: formData.vision ?? null,
    values: formData.values ?? [],
    offering_type: formData.offering_type ?? [],
    main_offerings: formData.main_offerings ?? [],
    unique_differentiators: formData.unique_differentiators ?? [],
    typical_results: formData.typical_results ?? [],
    ideal_client_size: formData.ideal_client_size ?? [],
    target_industries: formData.target_industries ?? [],
    project_scope: formData.project_scope ?? '',
    geographic_markets: formData.geographic_markets ?? [],
    pricing_positioning: formData.pricing_positioning ?? '',
    delivery_model: formData.delivery_model ?? [],
    success_story: formData.success_story ?? null,
    known_clients: formData.known_clients ?? false,
    known_clients_list: formData.known_clients_list ?? null,
    credentials: formData.credentials ?? [],
    organizational_personality: formData.organizational_personality ?? [],
    communication_style: formData.communication_style ?? ''
  };

  const { data, error } = await supabase
    .from('lab_company_profiles')
    .upsert(payload, { onConflict: 'user_id' })
    .select()
    .single();

  if (error) throw error;
  return data;
}

// ============ Combined Profile Fetch ============

export async function getProfiles(userId: string): Promise<{
  userProfile: UserProfile | null;
  companyProfile: CompanyProfile | null;
}> {
  const [userResult, companyResult] = await Promise.all([
    supabase.from('lab_user_profiles').select('*').eq('user_id', userId).maybeSingle(),
    supabase.from('lab_company_profiles').select('*').eq('user_id', userId).maybeSingle()
  ]);

  if (userResult.error) throw userResult.error;
  if (companyResult.error) throw companyResult.error;

  return {
    userProfile: userResult.data,
    companyProfile: companyResult.data
  };
}

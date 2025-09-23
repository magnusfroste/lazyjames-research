import React, { useState } from 'react';
import { ResearchDashboard } from './ResearchDashboard';
import { CompanyProfileWizard } from './CompanyProfileWizard';
import { ResearchInitiator } from './ResearchInitiator';
import { UserProfileWizard } from './UserProfileWizard';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

type ViewMode = 'dashboard' | 'company-profile' | 'user-profile' | 'research';

// Dummy user ID for POC demo without authentication
const DEMO_USER_ID = '00000000-0000-0000-0000-000000000000';

export const LabApp: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewMode>('dashboard');
  const [isLoading, setIsLoading] = useState(false);
  
  const { toast } = useToast();

  const handleSaveCompanyProfile = async (data: any) => {
    try {
      setIsLoading(true);
      
      const { error } = await supabase
        .from('lab_company_profiles')
        .upsert({
          ...data,
          user_id: DEMO_USER_ID,
          is_complete: true
        }, {
          onConflict: 'user_id'
        });

      if (error) throw error;

      toast({
        title: "Profile saved successfully",
        description: "Your company profile has been updated."
      });
      
      setCurrentView('dashboard');
    } catch (error) {
      console.error('Error saving company profile:', error);
      toast({
        title: "Error saving profile",
        description: "Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveUserProfile = async (data: any) => {
    try {
      setIsLoading(true);
      
      const { error } = await supabase
        .from('lab_user_profiles')
        .upsert({
          ...data,
          user_id: DEMO_USER_ID,
          is_complete: true
        }, {
          onConflict: 'user_id'
        });

      if (error) throw error;

      toast({
        title: "Profile saved successfully",
        description: "Your user profile has been updated."
      });
      
      setCurrentView('dashboard');
    } catch (error) {
      console.error('Error saving user profile:', error);
      toast({
        title: "Error saving profile",
        description: "Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleStartResearch = async (data: any) => {
    try {
      setIsLoading(true);

      // Get the user's company and user profiles
      const [companyProfile, userProfile] = await Promise.all([
        supabase.from('lab_company_profiles').select('*').eq('user_id', DEMO_USER_ID).maybeSingle(),
        supabase.from('lab_user_profiles').select('*').eq('user_id', DEMO_USER_ID).maybeSingle()
      ]);

      if (companyProfile.error || userProfile.error) {
        throw new Error('Error fetching profiles. Please try again.');
      }

      if (!companyProfile.data || !userProfile.data) {
        throw new Error('Missing required profiles. Please complete your company and user profiles first.');
      }

      // Get webhook URL from settings
      const { data: webhookData } = await supabase
        .from('webhook_testing')
        .select('webhook_url')
        .eq('is_active', true)
        .maybeSingle();

      const webhookUrl = webhookData?.webhook_url || 'https://example.com/webhook';

      // Create the research record
      const { error: insertError } = await supabase
        .from('lab_prospect_research')
        .insert({
          user_id: DEMO_USER_ID,
          company_profile_id: companyProfile.data.id,
          user_profile_id: userProfile.data.id,
          prospect_company_name: data.companyName,
          prospect_website_url: data.websiteUrl,
          prospect_linkedin_url: data.linkedinUrl,
          research_type: data.researchType || 'standard',
          webhook_url: webhookUrl,
          status: 'pending'
        });

      if (insertError) throw insertError;

      toast({
        title: "Research started successfully",
        description: "Your prospect research has been queued for processing."
      });

      setCurrentView('dashboard');
    } catch (error) {
      console.error('Error starting research:', error);
      toast({
        title: "Error starting research",
        description: error instanceof Error ? error.message : "Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const renderView = () => {
    switch (currentView) {
      case 'company-profile':
        return (
          <CompanyProfileWizard
            onSave={handleSaveCompanyProfile}
            onCancel={() => setCurrentView('dashboard')}
          />
        );
        
      case 'user-profile':
        return (
          <UserProfileWizard
            onSave={handleSaveUserProfile}
            onCancel={() => setCurrentView('dashboard')}
          />
        );
        
      case 'research':
        return (
          <ResearchInitiator
            onSubmit={handleStartResearch}
            onCancel={() => setCurrentView('dashboard')}
            isLoading={isLoading}
          />
        );
        
      default:
        return (
          <ResearchDashboard
            onStartResearch={() => setCurrentView('research')}
            onSetupCompanyProfile={() => setCurrentView('company-profile')}
            onSetupUserProfile={() => setCurrentView('user-profile')}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-6 py-8">
        {renderView()}
      </div>
    </div>
  );
};
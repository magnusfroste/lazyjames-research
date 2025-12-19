import React, { useState } from 'react';
import { ResearchDashboard } from './ResearchDashboard';
import { CompanyProfileWizard } from './CompanyProfileWizard';
import { ResearchInitiator } from './ResearchInitiator';
import { UserProfileWizard } from './UserProfileWizard';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { upsertCompanyProfile, upsertUserProfile } from '@/services/profileService';
import { useStartResearch } from '@/hooks/useStartResearch';
import type { CompanyProfileFormData, UserProfileFormData } from '@/types/profiles';

type ViewMode = 'dashboard' | 'company-profile' | 'user-profile' | 'research';

export const LabApp: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewMode>('dashboard');
  const [isLoading, setIsLoading] = useState(false);
  
  const { toast } = useToast();
  const { user } = useAuth();
  const { startResearch } = useStartResearch();

  const handleSaveCompanyProfile = async (data: CompanyProfileFormData) => {
    try {
      if (!user) throw new Error('User not authenticated');
      
      setIsLoading(true);
      await upsertCompanyProfile(user.id, data);

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

  const handleSaveUserProfile = async (data: UserProfileFormData) => {
    try {
      if (!user) throw new Error('User not authenticated');
      
      setIsLoading(true);
      await upsertUserProfile(user.id, data);

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
      if (!user) throw new Error('User not authenticated');
      
      setIsLoading(true);
      const result = await startResearch(data);

      if (result.success) {
        toast({
          title: "Research Started",
          description: `Research initiated. ID: ${result.researchId}`,
          duration: 5000
        });
        setCurrentView('dashboard');
      } else if (result.error === 'missing_profiles') {
        toast({
          title: "Missing Profiles",
          description: result.message,
          variant: "destructive"
        });
      } else {
        toast({
          title: "Error",
          description: result.message || "Failed to start research",
          variant: "destructive"
        });
      }
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

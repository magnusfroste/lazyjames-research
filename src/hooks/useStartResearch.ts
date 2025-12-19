import { useState, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { 
  checkUserCredits, 
  deductCredits 
} from '@/services/creditService';
import { 
  getProfiles 
} from '@/services/profileService';
import { 
  createResearchRecord, 
  getActiveWebhookUrl,
  updateResearchStatus
} from '@/services/researchService';
import { 
  buildWebhookPayload, 
  sendWebhookInBackground 
} from '@/services/webhookService';
import { parseAndSaveN8nResponse } from '@/lib/researchResponseUtils';
import { RESEARCH_CREDIT_COST } from '@/types/credits';
import type { ResearchFormData } from '@/types/research';

interface StartResearchResult {
  success: boolean;
  error?: 'insufficient_credits' | 'missing_profiles' | 'unknown';
  message?: string;
  researchId?: string;
}

export function useStartResearch() {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const startResearch = useCallback(async (formData: ResearchFormData): Promise<StartResearchResult> => {
    if (!user?.id) {
      return { success: false, error: 'unknown', message: 'User not authenticated' };
    }

    setIsLoading(true);

    try {
      // 1. Check credits
      const creditCheck = await checkUserCredits(user.id);
      if (!creditCheck.hasCredits) {
        return { success: false, error: 'insufficient_credits' };
      }

      // 2. Get profiles
      const { userProfile, companyProfile } = await getProfiles(user.id);
      if (!userProfile || !companyProfile) {
        return { 
          success: false, 
          error: 'missing_profiles',
          message: 'Missing required profiles. Please complete your company and user profiles first.'
        };
      }

      // 3. Get webhook URL
      const webhookUrl = await getActiveWebhookUrl();

      // 4. Create research record
      const researchRecord = await createResearchRecord(
        user.id,
        companyProfile.id,
        userProfile.id,
        formData,
        webhookUrl
      );

      // 5. Deduct credits
      await deductCredits(
        user.id,
        RESEARCH_CREDIT_COST,
        `Research: ${formData.company_name}`,
        researchRecord.id
      );

      // 6. Build and send webhook (fire-and-forget)
      const payload = buildWebhookPayload(
        formData,
        companyProfile,
        userProfile,
        researchRecord.id
      );

      sendWebhookInBackground(
        webhookUrl,
        payload,
        researchRecord.id,
        // onSuccess
        async (responseText) => {
          await parseAndSaveN8nResponse(
            responseText,
            researchRecord.id,
            formData.company_name
          );
        },
        // onError
        async (errorMessage) => {
          await updateResearchStatus(researchRecord.id, 'pending', errorMessage);
        }
      );

      return { success: true, researchId: researchRecord.id };

    } catch (error) {
      console.error('Error starting research:', error);
      return { 
        success: false, 
        error: 'unknown',
        message: error instanceof Error ? error.message : 'Unknown error'
      };
    } finally {
      setIsLoading(false);
    }
  }, [user?.id]);

  return { startResearch, isLoading };
}

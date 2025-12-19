import { supabase } from '@/integrations/supabase/client';
import { enhanceWebhookPayload, EnhancedWebhookPayload } from '@/lib/webhookPayloadUtils';
import type { ResearchFormData } from '@/types/research';
import type { CompanyProfile, UserProfile } from '@/types/profiles';

export interface WebhookSendResult {
  success: boolean;
  response?: string;
  error?: string;
}

// ============ Webhook Operations ============

export function buildWebhookPayload(
  formData: ResearchFormData,
  companyProfile: CompanyProfile,
  userProfile: UserProfile,
  researchId: string
): EnhancedWebhookPayload {
  return enhanceWebhookPayload(
    {
      company_name: formData.company_name,
      website_url: formData.website_url,
      linkedin_url: formData.linkedin_url,
      research_type: formData.research_type,
      notes: formData.notes
    },
    companyProfile,
    userProfile,
    researchId
  );
}

export async function sendWebhookRequest(
  webhookUrl: string,
  payload: EnhancedWebhookPayload
): Promise<WebhookSendResult> {
  try {
    console.log('🚀 Sending webhook to:', webhookUrl);
    console.log('📦 Payload:', JSON.stringify(payload, null, 2));

    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
      mode: 'cors'
    });

    console.log('📡 Response status:', response.status);

    if (response.ok) {
      const responseText = await response.text();
      console.log('✅ Webhook response:', responseText);
      return { success: true, response: responseText };
    } else {
      const errorText = await response.text();
      console.error('❌ Webhook error response:', errorText);
      return { 
        success: false, 
        error: `Webhook failed: ${response.status} - ${errorText}` 
      };
    }
  } catch (error) {
    console.error('🚨 Fetch error:', error);
    
    let errorMessage = 'Unknown webhook error';
    if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
      errorMessage = `Cannot reach ${webhookUrl} - likely CORS or n8n not running`;
    } else if (error instanceof Error) {
      errorMessage = error.message;
    }
    
    return { success: false, error: errorMessage };
  }
}

export async function sendWebhookInBackground(
  webhookUrl: string,
  payload: EnhancedWebhookPayload,
  researchId: string,
  onSuccess?: (responseText: string) => Promise<void>,
  onError?: (errorMessage: string) => Promise<void>
): Promise<void> {
  // Fire-and-forget pattern
  sendWebhookRequest(webhookUrl, payload)
    .then(async (result) => {
      if (result.success && result.response && onSuccess) {
        await onSuccess(result.response);
      } else if (!result.success && onError) {
        const errorMsg = `${result.error}. Click "Resend" to retry.`;
        await onError(errorMsg);
      }
    })
    .catch(async (error) => {
      if (onError) {
        await onError(`Unexpected error: ${error.message}`);
      }
    });
}

import { ResearchInitiator } from "@/components/lab/ResearchInitiator";
import { useNavigate } from "react-router-dom";
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useState } from 'react';
import { enhanceWebhookPayload } from '@/lib/webhookPayloadUtils';
import { parseAndSaveN8nResponse } from '@/lib/researchResponseUtils';

const DEMO_USER_ID = '00000000-0000-0000-0000-000000000000';

const ResearchPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

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
      const { data: researchRecord, error: insertError } = await supabase
        .from('lab_prospect_research')
        .insert({
          user_id: DEMO_USER_ID,
          company_profile_id: companyProfile.data.id,
          user_profile_id: userProfile.data.id,
          prospect_company_name: data.company_name,
          prospect_website_url: data.website_url,
          prospect_linkedin_url: data.linkedin_url,
          research_type: data.research_type || 'standard',
          notes: data.notes || '',
          webhook_url: webhookUrl,
          status: 'pending'
        })
        .select()
        .single();

      if (insertError) throw insertError;

      // Prepare enhanced webhook payload
      const webhookPayload = enhanceWebhookPayload(
        data,
        companyProfile.data,
        userProfile.data,
        researchRecord.id
      );

      // Send POST request to webhook endpoint and wait for response
      console.log('🚀 Sending webhook to:', webhookUrl);
      console.log('📦 Payload:', JSON.stringify(webhookPayload, null, 2));
      
      try {
        const response = await fetch(webhookUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(webhookPayload),
          mode: 'cors'
        });

        console.log('📡 Response status:', response.status);
        console.log('📡 Response ok:', response.ok);

        if (response.ok) {
          const responseText = await response.text();
          console.log('✅ Webhook response:', responseText);
          
          // Parse and save the n8n analysis response
          const parseResult = await parseAndSaveN8nResponse(
            responseText, 
            researchRecord.id, 
            data.company_name
          );
          
          if (parseResult.success) {
            toast({
              title: "Analysis Complete!",
              description: `Research analysis completed for ${data.company_name}${parseResult.fitScore ? ` (Fit Score: ${parseResult.fitScore}/100)` : ''}`,
              duration: 5000
            });
          } else {
            toast({
              title: "Analysis Received",
              description: `Research data sent for ${data.company_name}, but analysis parsing failed: ${parseResult.error}`,
              variant: "destructive",
              duration: 5000
            });
          }
        } else {
          const errorText = await response.text();
          console.error('❌ Webhook error response:', errorText);
          throw new Error(`Webhook failed: ${response.status} - ${errorText}`);
        }
      } catch (webhookError) {
        console.error('🚨 Fetch error:', webhookError);
        
        // Check if it's a CORS error
        if (webhookError instanceof TypeError && webhookError.message.includes('Failed to fetch')) {
          toast({
            title: "CORS Error", 
            description: `Cannot reach ${webhookUrl} - likely a CORS issue. Check n8n webhook settings.`,
            variant: "destructive",
            duration: 8000
          });
        } else {
          toast({
            title: "Research Started (Webhook Failed)",
            description: `Research created but webhook failed. Research ID: ${researchRecord.id}`,
            variant: "destructive",
            duration: 8000
          });
        }
      }

      navigate('/');
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

  return (
    <ResearchInitiator
      onSubmit={handleStartResearch}
      onCancel={() => navigate('/')}
      isLoading={isLoading}
    />
  );
};

export default ResearchPage;
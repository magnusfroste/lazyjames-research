import { supabase } from '@/integrations/supabase/client';

export interface N8nAnalysisResponse {
  executive_summary?: {
    fit_score?: number;
  };
  analysis?: {
    '2_organization_decision_making'?: any;
    '7_contact_strategy_approach'?: any;
    '8_personalized_outreach_recommendations'?: any;
  };
}

/**
 * Parses n8n response and updates the research record in the database
 */
export const parseAndSaveN8nResponse = async (
  responseText: string, 
  researchId: string,
  prospectCompanyName: string
): Promise<{ success: boolean; fitScore?: number; error?: string }> => {
  try {
    const responseData = JSON.parse(responseText);
    const analysisOutput: N8nAnalysisResponse = Array.isArray(responseData) 
      ? responseData[0].output 
      : responseData.output;
    
    if (analysisOutput && analysisOutput.executive_summary) {
      // Update the research record with parsed analysis
      const { error } = await supabase
        .from('lab_prospect_research')
        .update({
          status: 'completed',
          completed_at: new Date().toISOString(),
          fit_score: analysisOutput.executive_summary.fit_score,
          research_results: analysisOutput as any,
          decision_makers: analysisOutput.analysis?.['2_organization_decision_making'],
          contact_strategy: analysisOutput.analysis?.['7_contact_strategy_approach'],
          value_proposition: analysisOutput.analysis?.['8_personalized_outreach_recommendations']
        })
        .eq('id', researchId);
      
      if (error) throw error;
      
      console.log('💾 Analysis saved to database');
      
      return { 
        success: true, 
        fitScore: analysisOutput.executive_summary.fit_score 
      };
    } else {
      return { 
        success: false, 
        error: 'Invalid analysis response format' 
      };
    }
  } catch (parseError) {
    console.error('❌ Failed to parse analysis response:', parseError);
    return { 
      success: false, 
      error: parseError instanceof Error ? parseError.message : 'Unknown parsing error' 
    };
  }
};
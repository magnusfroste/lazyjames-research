/**
 * N8N Prompt Manager - Integrates enhanced system prompt with webhook payloads
 */

import { ENHANCED_N8N_SYSTEM_PROMPT, getEnhancedSystemPrompt } from './enhancedN8nSystemPrompt';
import { EnhancedWebhookPayload } from './webhookPayloadUtils';

export interface N8nPromptConfig {
  systemPrompt: string;
  userPrompt: string;
  enhancedPayload: EnhancedWebhookPayload;
}

/**
 * Generates a complete N8N prompt configuration from enhanced webhook payload
 */
export function generateN8nPromptConfig(
  enhancedPayload: EnhancedWebhookPayload,
  customUserPrompt?: string
): N8nPromptConfig {
  const { processing_hints, metadata } = enhancedPayload;

  // Get enhanced system prompt with dynamic adaptations
  const systemPrompt = getEnhancedSystemPrompt(
    processing_hints.research_depth,
    metadata.processing_context.user_experience_level,
    processing_hints.focus_areas
  );

  // Generate context-aware user prompt
  const userPrompt = customUserPrompt || generateContextualUserPrompt(enhancedPayload);

  return {
    systemPrompt,
    userPrompt,
    enhancedPayload
  };
}

/**
 * Generates a contextual user prompt based on the enhanced payload data
 */
export function generateContextualUserPrompt(payload: EnhancedWebhookPayload): string {
  const { prospect_data, processing_hints, metadata } = payload;

  const researchTypeContext = {
    quick: "Provide a quick but comprehensive analysis focusing on immediate engagement opportunities",
    standard: "Conduct a thorough analysis covering all key areas for strategic engagement planning",  
    deep: "Perform an extensive deep-dive analysis with detailed competitive and financial intelligence"
  };

  const focusAreaContext = processing_hints.focus_areas.length > 0 
    ? ` Pay special attention to: ${processing_hints.focus_areas.join(', ')}.`
    : '';

  const communicationContext = {
    professional: "Use formal business language and data-driven insights",
    casual: "Use conversational tone with practical, actionable recommendations",
    consultative: "Provide strategic advisory perspective with partnership-focused insights"
  };

  const experienceContext = {
    beginner: "Include explanatory context and step-by-step guidance",
    intermediate: "Provide balanced insights with practical implementation tips",
    expert: "Focus on advanced strategic insights and sophisticated tactics"
  };

  return `Analyze ${prospect_data.company_name} (${prospect_data.website_url}) for business development opportunities.

Research Context:
- Research Type: ${researchTypeContext[processing_hints.research_depth]}
- Communication Style: ${communicationContext[processing_hints.communication_style]}
- User Experience Level: ${experienceContext[metadata.processing_context.user_experience_level]}
- Company Maturity Stage: ${metadata.processing_context.company_maturity}
- Industry Context: ${processing_hints.industry_context || 'Cross-industry'}
- Priority Level: ${processing_hints.priority_level}

${focusAreaContext}

Additional Context: ${prospect_data.notes || 'No additional context provided.'}

Please provide comprehensive analysis following the Wassching Method framework with personalized recommendations for engagement strategy.`;
}

/**
 * Creates a research template record for the enhanced prompt
 */
export function createEnhancedResearchTemplate(
  name: string = "Enhanced Wassching Method Analysis",
  description: string = "AI-powered prospect analysis using Claude's Wassching Method with intelligent payload adaptation",
  researchType: string = 'enhanced'
) {
  return {
    name,
    description,
    research_type: researchType,
    master_prompt: ENHANCED_N8N_SYSTEM_PROMPT,
    is_default: true,
    is_active: true
  };
}

/**
 * Formats the complete prompt package for N8N webhook consumption
 */
export function formatN8nWebhookPayload(config: N8nPromptConfig): any {
  return {
    system_prompt: config.systemPrompt,
    user_prompt: config.userPrompt,
    enhanced_data: config.enhancedPayload,
    
    // Legacy compatibility fields
    prospect_data: config.enhancedPayload.prospect_data,
    company_profile: config.enhancedPayload.company_profile,
    user_profile: config.enhancedPayload.user_profile,
    
    // New intelligence fields
    processing_hints: config.enhancedPayload.processing_hints,
    metadata: config.enhancedPayload.metadata,
    
    // Processing instructions
    instructions: {
      model_recommendations: {
        quick: "Use fast model (GPT-4o-mini) for quick research",
        standard: "Use balanced model (GPT-4o) for standard research", 
        deep: "Use advanced model (GPT-4 or Claude) for deep research"
      },
      output_format: "JSON",
      required_sections: [
        "executive_summary",
        "analysis", 
        "actionable_next_steps",
        "risk_assessment"
      ],
      quality_checks: [
        "Verify all JSON fields are populated",
        "Ensure fit_score is 0-100 integer",
        "Include specific decision maker personas",
        "Provide quantified business impact projections"
      ]
    }
  };
}

export default {
  generateN8nPromptConfig,
  generateContextualUserPrompt,
  createEnhancedResearchTemplate,
  formatN8nWebhookPayload,
  ENHANCED_N8N_SYSTEM_PROMPT
};
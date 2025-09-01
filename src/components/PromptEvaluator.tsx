import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { EvaluationForm } from './EvaluationForm';
import { ResultsDisplay } from './ResultsDisplay';
import { Brain, Sparkles } from 'lucide-react';

export interface EvaluationRequest {
  companyName: string;
  companyUrl: string;
  linkedinUrl: string;
  userPrompt: string;
  masterPrompt: string;
  webhookUrl: string;
}

export interface EvaluationResult {
  id: string;
  request: EvaluationRequest;
  response: any;
  timestamp: Date;
  success: boolean;
  error?: string;
}

export const PromptEvaluator: React.FC = () => {
  const [results, setResults] = useState<EvaluationResult[]>([]);
  const [isEvaluating, setIsEvaluating] = useState(false);

  const handleEvaluation = async (request: EvaluationRequest) => {
    setIsEvaluating(true);
    
    const resultId = Date.now().toString();
    
    try {
      const response = await fetch(request.webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        mode: 'cors',
        body: JSON.stringify({
          company_name: request.companyName,
          company_url: request.companyUrl,
          linkedin_url: request.linkedinUrl,
          user_prompt: request.userPrompt,
          master_prompt: request.masterPrompt,
          timestamp: new Date().toISOString(),
        }),
      });

      let responseData;
      let errorMessage;

      // Clone response to allow reading both JSON and text if needed
      const responseClone = response.clone();

      try {
        responseData = await response.json();
        
        // Check for specific n8n webhook errors
        if (!response.ok) {
          if (response.status === 404 && responseData?.message?.includes('not registered for POST')) {
            errorMessage = 'Webhook not configured for POST requests. Please check your n8n workflow setup.';
          } else if (response.status === 404) {
            errorMessage = 'Webhook endpoint not found. Please verify the webhook URL in your n8n workflow.';
          } else {
            errorMessage = `HTTP ${response.status}: ${responseData?.message || response.statusText}`;
          }
        }
      } catch {
        // Use cloned response for text fallback
        responseData = await responseClone.text();
        if (!response.ok) {
          errorMessage = `HTTP ${response.status}: ${response.statusText}`;
        }
      }

      const result: EvaluationResult = {
        id: resultId,
        request,
        response: responseData,
        timestamp: new Date(),
        success: response.ok,
        error: errorMessage,
      };

      setResults(prev => [result, ...prev]);
    } catch (error) {
      let errorMessage = 'Connection failed';
      
      if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
        errorMessage = 'CORS error or network failure. Please ensure:\n• n8n workflow is active\n• Webhook has CORS headers enabled\n• URL is accessible from browser';
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }

      const result: EvaluationResult = {
        id: resultId,
        request,
        response: null,
        timestamp: new Date(),
        success: false,
        error: errorMessage,
      };

      setResults(prev => [result, ...prev]);
    } finally {
      setIsEvaluating(false);
    }
  };

  const clearResults = () => {
    setResults([]);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-gradient-accent">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-gradient-primary rounded-lg shadow-glow">
              <Brain className="w-6 h-6 text-primary-foreground" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              Prompt Refine Station
            </h1>
            <Sparkles className="w-6 h-6 text-primary" />
          </div>
          <p className="text-muted-foreground text-lg">
            Optimize your prompts by testing different parameters and analyzing results in real-time
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <div className="space-y-6">
            <Card className="p-6 bg-gradient-secondary border-primary/20 shadow-elegant">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                Evaluation Parameters
              </h2>
              <EvaluationForm onSubmit={handleEvaluation} isLoading={isEvaluating} />
            </Card>
          </div>

          {/* Results Section */}
          <div className="space-y-6">
            <Card className="p-6 bg-gradient-secondary border-primary/20 shadow-elegant">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                  Evaluation Results
                </h2>
                {results.length > 0 && (
                  <button
                    onClick={clearResults}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Clear All
                  </button>
                )}
              </div>
              <ResultsDisplay results={results} isEvaluating={isEvaluating} />
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};
import React from 'react';
import { Button } from '@/components/ui/button';
import { EvaluationResult } from './PromptEvaluator';
import { Copy, Loader2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface SimpleResultsDisplayProps {
  result: EvaluationResult | null;
  isEvaluating: boolean;
}

export const SimpleResultsDisplay: React.FC<SimpleResultsDisplayProps> = ({ result, isEvaluating }) => {
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: "Content copied to clipboard",
    });
  };

  const formatResponse = (response: any): string => {
    if (typeof response === 'string') return response;
    
    // Handle n8n text node response format: [{"text": "content"}]
    if (Array.isArray(response) && response.length > 0 && response[0].text) {
      return response[0].text;
    }
    
    return JSON.stringify(response, null, 2);
  };

  if (isEvaluating) {
    return (
      <div className="border border-gray-200 rounded-lg p-6 bg-gray-50">
        <div className="flex items-center justify-center py-8">
          <div className="text-center">
            <Loader2 className="w-6 h-6 animate-spin text-blue-600 mx-auto mb-3" />
            <p className="text-gray-600">Evaluating your prompt...</p>
            <p className="text-sm text-gray-500 mt-1">This may take a few moments</p>
          </div>
        </div>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="border border-gray-200 rounded-lg p-6 bg-white">
        <div className="text-center py-8">
          <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <span className="text-gray-400 text-xl">📄</span>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Results Yet</h3>
          <p className="text-gray-500">
            Configure your prompts and run an evaluation to see results here.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="border border-gray-200 rounded-lg bg-white">
      {/* Status Header */}
      <div className={`px-4 py-3 border-b border-gray-200 ${
        result.success ? 'bg-green-50' : 'bg-red-50'
      }`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${
              result.success ? 'bg-green-500' : 'bg-red-500'
            }`} />
            <span className={`text-sm font-medium ${
              result.success ? 'text-green-800' : 'text-red-800'
            }`}>
              {result.success ? 'Success' : 'Failed'}
            </span>
            <span className="text-xs text-gray-500">
              {result.timestamp.toLocaleTimeString()}
            </span>
          </div>
          <span className="text-sm font-medium text-gray-700">{result.request.companyName}</span>
        </div>
      </div>

      {/* Response Content */}
      <div className="p-4">
        {result.success && result.response ? (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-medium text-gray-900">AI Response</h4>
              <Button
                variant="outline"
                size="sm"
                onClick={() => copyToClipboard(formatResponse(result.response))}
                className="text-xs border-gray-300 hover:border-gray-400"
              >
                <Copy className="w-3 h-3 mr-1" />
                Copy
              </Button>
            </div>
            <div className="bg-gray-50 rounded border border-gray-200 p-4 max-h-96 overflow-y-auto">
              <pre className="text-sm text-gray-800 whitespace-pre-wrap font-mono leading-relaxed">
                {formatResponse(result.response)}
              </pre>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-red-800">Error</h4>
            <div className="bg-red-50 border border-red-200 rounded p-3">
              <p className="text-sm text-red-700">{result.error || 'Unknown error occurred'}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
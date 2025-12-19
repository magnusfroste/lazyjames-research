import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { getUserResearchList, getResearchById } from '@/services/researchService';
import type { ProspectResearch } from '@/types/research';

interface UseResearchListResult {
  research: ProspectResearch[];
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

export function useResearchList(): UseResearchListResult {
  const { user } = useAuth();
  const [research, setResearch] = useState<ProspectResearch[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchResearch = useCallback(async () => {
    if (!user?.id) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      const data = await getUserResearchList(user.id);
      setResearch(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch research'));
    } finally {
      setIsLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    fetchResearch();
  }, [fetchResearch]);

  return {
    research,
    isLoading,
    error,
    refetch: fetchResearch
  };
}

interface UseResearchDetailResult {
  research: ProspectResearch | null;
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

export function useResearchDetail(researchId: string | null): UseResearchDetailResult {
  const [research, setResearch] = useState<ProspectResearch | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchResearch = useCallback(async () => {
    if (!researchId) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      const data = await getResearchById(researchId);
      setResearch(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch research'));
    } finally {
      setIsLoading(false);
    }
  }, [researchId]);

  useEffect(() => {
    fetchResearch();
  }, [fetchResearch]);

  return {
    research,
    isLoading,
    error,
    refetch: fetchResearch
  };
}

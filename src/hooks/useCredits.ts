import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { checkUserCredits, getUserCredits, getCreditTransactions } from '@/services/creditService';
import type { CreditTransaction } from '@/types/credits';

interface UseCreditsResult {
  credits: number;
  hasCredits: boolean;
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

export function useCredits(): UseCreditsResult {
  const { user } = useAuth();
  const [credits, setCredits] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchCredits = useCallback(async () => {
    if (!user?.id) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      const result = await checkUserCredits(user.id);
      setCredits(result.currentBalance);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch credits'));
    } finally {
      setIsLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    fetchCredits();
  }, [fetchCredits]);

  return {
    credits,
    hasCredits: credits >= 1,
    isLoading,
    error,
    refetch: fetchCredits
  };
}

interface UseCreditTransactionsResult {
  transactions: CreditTransaction[];
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

export function useCreditTransactions(limit = 50): UseCreditTransactionsResult {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<CreditTransaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchTransactions = useCallback(async () => {
    if (!user?.id) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      const data = await getCreditTransactions(user.id, limit);
      setTransactions(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch transactions'));
    } finally {
      setIsLoading(false);
    }
  }, [user?.id, limit]);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  return {
    transactions,
    isLoading,
    error,
    refetch: fetchTransactions
  };
}

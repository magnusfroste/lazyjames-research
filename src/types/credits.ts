import { Tables } from '@/integrations/supabase/types';

// Credit transaction types
export type CreditTransaction = Tables<'lab_credit_transactions'>;
export type CreditTransactionInsert = Omit<CreditTransaction, 'id' | 'created_at'>;

// Credit operation result
export interface CreditCheckResult {
  hasCredits: boolean;
  currentBalance: number;
}

export interface CreditDeductResult {
  success: boolean;
  newBalance: number;
  transactionId?: string;
}

// Credit purchase options
export interface CreditPackage {
  id: string;
  credits: number;
  price: number;
  currency: string;
  label: string;
}

export const CREDIT_PACKAGES: CreditPackage[] = [
  { id: 'pack_1', credits: 1, price: 100, currency: 'EUR', label: '1 Credit' },
  { id: 'pack_5', credits: 5, price: 400, currency: 'EUR', label: '5 Credits' },
  { id: 'pack_10', credits: 10, price: 700, currency: 'EUR', label: '10 Credits' },
];

export const RESEARCH_CREDIT_COST = 1;

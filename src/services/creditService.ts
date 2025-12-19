import { supabase } from '@/integrations/supabase/client';
import type { CreditCheckResult, CreditDeductResult } from '@/types/credits';
import { RESEARCH_CREDIT_COST } from '@/types/credits';

// ============ Credit Operations ============

export async function checkUserCredits(userId: string): Promise<CreditCheckResult> {
  const { data, error } = await supabase
    .from('lab_user_profiles')
    .select('credits')
    .eq('user_id', userId)
    .maybeSingle();

  if (error) throw error;

  const currentBalance = data?.credits ?? 0;
  return {
    hasCredits: currentBalance >= RESEARCH_CREDIT_COST,
    currentBalance
  };
}

export async function getUserCredits(userId: string): Promise<number> {
  const { data, error } = await supabase
    .from('lab_user_profiles')
    .select('credits')
    .eq('user_id', userId)
    .maybeSingle();

  if (error) throw error;
  return data?.credits ?? 0;
}

export async function deductCredits(
  userId: string,
  amount: number,
  description: string,
  researchId?: string
): Promise<CreditDeductResult> {
  // Get current credits
  const currentCredits = await getUserCredits(userId);
  
  if (currentCredits < amount) {
    return { success: false, newBalance: currentCredits };
  }

  const newBalance = currentCredits - amount;

  // Update credits
  const { error: creditError } = await supabase
    .from('lab_user_profiles')
    .update({ credits: newBalance })
    .eq('user_id', userId);

  if (creditError) throw creditError;

  // Log transaction
  const { data: transaction, error: transactionError } = await supabase
    .from('lab_credit_transactions')
    .insert({
      user_id: userId,
      amount: -amount,
      description,
      research_id: researchId ?? null
    })
    .select('id')
    .single();

  if (transactionError) {
    console.error('Error logging transaction:', transactionError);
  }

  return {
    success: true,
    newBalance,
    transactionId: transaction?.id
  };
}

export async function addCredits(
  userId: string,
  amount: number,
  description: string
): Promise<CreditDeductResult> {
  // Get current credits
  const currentCredits = await getUserCredits(userId);
  const newBalance = currentCredits + amount;

  // Update credits
  const { error: creditError } = await supabase
    .from('lab_user_profiles')
    .update({ credits: newBalance })
    .eq('user_id', userId);

  if (creditError) throw creditError;

  // Log transaction
  const { data: transaction, error: transactionError } = await supabase
    .from('lab_credit_transactions')
    .insert({
      user_id: userId,
      amount: amount,
      description
    })
    .select('id')
    .single();

  if (transactionError) {
    console.error('Error logging transaction:', transactionError);
  }

  return {
    success: true,
    newBalance,
    transactionId: transaction?.id
  };
}

// ============ Transaction History ============

export async function getCreditTransactions(userId: string, limit = 50) {
  const { data, error } = await supabase
    .from('lab_credit_transactions')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data || [];
}

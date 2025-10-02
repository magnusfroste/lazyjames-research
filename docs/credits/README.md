# Credit System

## Overview

The Research Engine uses a credit-based system to manage research usage. Each user receives credits upon signup, and credits are consumed when running prospect research.

## Credit Allocation

- **Default Credits**: 5 credits per user (set on profile creation)
- **Cost Per Research**: 1 credit per prospect research
- **Credit Field**: `lab_user_profiles.credits` (integer)

## How It Works

### 1. Initial Allocation
When a user completes their profile setup, they receive 5 free credits automatically.

### 2. Credit Deduction
Each time a research is initiated:
1. System checks if user has available credits (`credits >= 1`)
2. If yes, deducts 1 credit and creates research record
3. If no, prevents research and shows "insufficient credits" message

### 3. Transaction Logging
Every credit change is logged in `lab_credit_transactions`:
```sql
{
  user_id: uuid,
  amount: integer,        // Negative for deductions, positive for additions
  description: string,    // e.g., "Research for Acme Corp"
  research_id: uuid,      // Links to lab_prospect_research record
  created_at: timestamp
}
```

## Database Schema

### User Credits
```sql
lab_user_profiles.credits
- Type: integer
- Default: 5
- Constraints: NOT NULL
```

### Credit Transactions
```sql
lab_credit_transactions
- id: uuid (primary key)
- user_id: uuid (foreign key)
- research_id: uuid (optional, links to research)
- amount: integer (negative = deduction, positive = addition)
- description: text
- created_at: timestamp
```

## UI Display Locations

### Dashboard (ResearchDashboard)
- Shows current credit balance
- Displays credit warning if low

### User Profile Page
- Displays current credits
- Shows recent credit transaction history

### Research Initiation
- Checks credits before allowing new research
- Shows error toast if insufficient credits

## Future Enhancements

Potential credit system expansions:
- Credit purchase/top-up functionality
- Subscription tiers with credit allocations
- Credit expiration policies
- Bulk research discounts

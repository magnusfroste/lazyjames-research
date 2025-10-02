# Getting Started

Quick guide to set up your Research Engine account and run your first prospect research.

## Prerequisites

### 1. Authentication Required
- Create account via `/auth` page
- Email verification enabled via Supabase Auth
- User session managed by `AuthContext`

### 2. Database Setup
On first login, the system automatically creates:
- User profile record (`lab_user_profiles`)
- Initial credit allocation (5 credits)

## Initial Setup Steps

### Step 1: Complete Company Profile
Navigate to `/company-profile` and fill out:

**Required Fields:**
- Company name
- Industry
- Website URL
- Main offerings (array)
- Target industries (array)
- Communication style
- Mission statement

**Important:** Set `is_complete = true` to enable research functionality.

### Step 2: Complete User Profile
Navigate to `/user-profile` and fill out:

**Required Fields:**
- Full name
- Role in organization
- Communication style
- Meeting preferences
- Expertise positioning
- Success metrics

**Important:** Set `is_complete = true` to enable research functionality.

### Step 3: Verify Credit Balance
Check your dashboard at `/` to confirm:
- ✅ 5 credits allocated
- ✅ Company profile complete
- ✅ User profile complete

## Running Your First Research

### 1. Navigate to Research Page
Go to `/research` or click "Start New Research" from dashboard.

### 2. Enter Prospect Details
**Required Information:**
- Prospect company name
- Prospect website URL
- LinkedIn URL (optional but recommended)

### 3. Submit Research Request
1. Click "Start Research"
2. System validates:
   - Company profile complete
   - User profile complete
   - Sufficient credits (≥1)
3. Deducts 1 credit
4. Sends enhanced payload to N8N webhook
5. Redirects to results page

### 4. View Results
Results appear on `/research` page when webhook returns:
- Research results (JSONB format)
- Fit score
- Decision makers
- Contact strategy
- Value proposition

## Troubleshooting

### "Complete your profiles first"
- Ensure both company and user profiles have `is_complete = true`
- Check all required fields are filled

### "Insufficient credits"
- Check credit balance in dashboard
- Default allocation is 5 credits
- Each research costs 1 credit

### "Research failed"
- Check network requests for webhook errors
- Verify N8N workflow is active
- Check webhook URL configuration in settings

### Authentication Issues
- Clear browser cache and cookies
- Verify email confirmation
- Check Supabase Auth providers settings

## What's Next?

After your first successful research:
1. Review research results and export options
2. Star important research for quick access
3. Add tags and notes for organization
4. Monitor credit usage in user profile

## Credit System

- **Starting Credits**: 5 per user
- **Research Cost**: 1 credit per research
- **Credit Tracking**: View history in User Profile page
- **Future**: Credit top-up functionality planned

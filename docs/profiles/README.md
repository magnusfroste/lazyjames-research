# Profile System

User and company profile questions and structure for context-aware prospect research.

## Overview

Two profile types power personalized research:

- **Company Profile** (`lab_company_profiles`) - Business details, offerings, differentiators
- **User Profile** (`lab_user_profiles`) - Role, preferences, communication style, credits

## Profile Questions

- **[Company Profile Questions](./company-profile-questions.md)** - Complete field list with types
- **[User Profile Questions](./user-profile-questions.md)** - Complete field list with options
- **[Original Company Questions](./original-company-questions.md)** - Source document

## Design Principles

### Context-Driven
Questions provide maximum context for AI-powered research analysis.

### Progressive Disclosure
Wizard forms break complex profiles into manageable steps.

### Required vs Optional
Minimal required fields for basic functionality, optional fields enhance analysis.

## Data Structure

### Company Profile (`lab_company_profiles`)
```typescript
{
  user_id: uuid,
  company_name: text,
  website_url: text,
  linkedin_url: text,
  business_registration: text,
  industry: text,
  years_active: text,
  company_size: text,
  geographic_markets: text[],
  mission: text,
  vision: text,
  values: text[],
  organizational_personality: text[],
  offering_type: text[],
  main_offerings: text[],
  target_industries: text[],
  ideal_client_size: text[],
  project_scope: text,
  unique_differentiators: text[],
  credentials: text[],
  typical_results: text[],
  known_clients: boolean,
  known_clients_list: text,
  success_story: text,
  delivery_model: text[],
  pricing_positioning: text,
  communication_style: text,
  is_complete: boolean,
  created_at: timestamp,
  updated_at: timestamp
  // Total: 28 fields
}
```

### User Profile (`lab_user_profiles`)
```typescript
{
  user_id: uuid,
  full_name: text,
  linkedin_profile: text,
  current_location: text,
  birthplace: text,
  date_of_birth: date,
  role_in_organization: text,
  outreach_experience: text,
  prospects_per_week: text,
  communication_style: text,
  introduction_style: text,
  credibility_preference: text[],
  preferred_contact_channel: text[],
  followup_timing: text,
  nonresponse_handling: text,
  pain_points_focus: text[],
  expertise_positioning: text,
  objection_handling: text[],
  meeting_format: text[],
  meeting_duration: text,
  success_metrics: text[],
  credits: integer,  // Default: 5
  is_complete: boolean,
  created_at: timestamp,
  updated_at: timestamp
  // Total: 26 fields
}
```

## Credits Field

### User Profile Credits
- **Field**: `lab_user_profiles.credits`
- **Type**: Integer
- **Default**: 5 (set on profile creation)
- **Purpose**: Track available research credits
- **Deduction**: 1 credit per research

### Credit Initialization
When a user completes profile setup:
1. Record created in `lab_user_profiles`
2. `credits` field set to 5
3. No transaction logged (initial allocation)

## Profile Completion

### Required for Research
Both profiles must have `is_complete = true` before initiating research.

### Completion Tracking
```typescript
// Check if ready for research
const canResearch = 
  companyProfile?.is_complete && 
  userProfile?.is_complete &&
  userProfile?.credits >= 1;
```

## Usage in Research

Profile data enhances webhook payload:
1. **Processing Hints**: Focus areas, communication style
2. **Metadata**: Experience level, company maturity
3. **Context**: Industry, role, preferences

See [Payload Documentation](../payload/README.md) for full structure.

## Adding New Questions

When extending profiles:
1. Check for duplicate/redundant questions
2. Assess research context value
3. Update database schema
4. Update TypeScript interfaces
5. Document rationale
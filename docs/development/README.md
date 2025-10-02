# Development Guide

Development guidelines and best practices for the Research Engine codebase.

## Principles

### Code Organization
- **Single Responsibility**: Components do one thing well
- **Composition**: Build complex UIs from simple components
- **Separation of Concerns**: Business logic separate from UI

### Architecture
- **Dynamic System**: AI controls content structure, UI adapts automatically
- **Type Safety**: TypeScript strict mode, Zod validation
- **Database First**: Supabase as source of truth

## Project Structure

```
src/
├── components/
│   ├── lab/              # Research Engine components
│   ├── profiles/         # Profile management
│   ├── ui/               # Shadcn components
│   └── layout/           # App shell (header, sidebar)
├── hooks/                # Custom React hooks
├── lib/                  # Utilities and helpers
├── pages/                # Route components
├── contexts/             # React contexts (AuthContext)
└── integrations/
    └── supabase/         # Supabase client & types

docs/
├── architecture/         # System design
├── n8n/                  # Workflows and prompts
├── profiles/             # Profile questions
├── credits/              # Credit system
└── setup/                # Getting started
```

## Key Database Tables

All tables use `lab_` prefix and enforce RLS policies:

**Profiles:**
- `lab_user_profiles` - User info, credits, preferences
- `lab_company_profiles` - Company details, offerings

**Research:**
- `lab_prospect_research` - Research records (JSONB results)
- `lab_credit_transactions` - Credit history

**Templates:**
- `lab_research_templates` - Custom research templates

## Development Workflow

### 1. Planning
- Review existing architecture
- Identify affected components
- Check database schema requirements
- Plan minimal changes

### 2. Implementation
- Write database migrations first (if needed)
- Update TypeScript types
- Implement UI components
- Add error handling

### 3. Testing
- Test authentication flow
- Verify RLS policies work
- Check credit deduction
- Test webhook integration

## Component Patterns

### React Component
```typescript
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';

interface MyComponentProps {
  userId: string;
  onComplete: () => void;
}

export const MyComponent = ({ userId, onComplete }: MyComponentProps) => {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      // Business logic
      onComplete();
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button onClick={handleSubmit} disabled={loading}>
      {loading ? 'Processing...' : 'Submit'}
    </Button>
  );
};
```

### Custom Hook
```typescript
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useUserCredits = (userId: string | undefined) => {
  const [credits, setCredits] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;

    const fetchCredits = async () => {
      const { data } = await supabase
        .from('lab_user_profiles')
        .select('credits')
        .eq('user_id', userId)
        .single();

      if (data) setCredits(data.credits);
      setLoading(false);
    };

    fetchCredits();
  }, [userId]);

  return { credits, loading };
};
```

## State Management

### Local State
Use `useState` for component-only state (loading, form values).

### Server State
Use Supabase queries for database data:
```typescript
const { data, error } = await supabase
  .from('lab_user_profiles')
  .select('*')
  .eq('user_id', userId)
  .single();
```

### Global State
Use React Context for auth state (`AuthContext`).

## API Integration

### Supabase Queries
```typescript
// Read
const { data } = await supabase
  .from('lab_prospect_research')
  .select('*')
  .eq('user_id', userId)
  .order('created_at', { ascending: false });

// Insert
const { data } = await supabase
  .from('lab_prospect_research')
  .insert({
    user_id: userId,
    prospect_company_name: 'Acme Corp',
    // ... other fields
  })
  .select()
  .single();

// Update
const { data } = await supabase
  .from('lab_prospect_research')
  .update({ is_starred: true })
  .eq('id', researchId)
  .eq('user_id', userId);
```

### Webhook Payloads
```typescript
const response = await fetch(webhookUrl, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    user_profile: userProfile,
    company_profile: companyProfile,
    prospect_data: prospectData,
    processing_hints: hints,
  }),
});
```

## Error Handling

### Component Level
```typescript
try {
  await someAsyncOperation();
} catch (error) {
  console.error('Operation failed:', error);
  toast({
    title: "Error",
    description: error.message,
    variant: "destructive",
  });
}
```

### API Errors
```typescript
const { data, error } = await supabase
  .from('lab_user_profiles')
  .select('*');

if (error) {
  console.error('Database error:', error);
  return null;
}

return data;
```

## Design System

### Use Semantic Tokens
```tsx
// ❌ WRONG - Direct colors
<div className="bg-white text-black">

// ✅ CORRECT - Semantic tokens
<div className="bg-background text-foreground">
```

### Component Variants
Use `class-variance-authority` for variants:
```typescript
import { cva } from "class-variance-authority";

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground",
        outline: "border border-input bg-background",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 px-3",
      },
    },
  }
);
```

## Credit System Implementation

### Check Credits Before Research
```typescript
// 1. Fetch current credits
const { data: profile } = await supabase
  .from('lab_user_profiles')
  .select('credits')
  .eq('user_id', userId)
  .single();

if (!profile || profile.credits < 1) {
  toast({ title: "Insufficient credits" });
  return;
}

// 2. Deduct credit and log transaction
const { error } = await supabase.rpc('deduct_credit', {
  p_user_id: userId,
  p_description: `Research for ${companyName}`,
});
```

## Authentication Requirements

### Protected Routes
```typescript
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';

<Route element={<ProtectedRoute />}>
  <Route path="/research" element={<ResearchPage />} />
</Route>
```

### Auth Context Usage
```typescript
import { useAuth } from '@/contexts/AuthContext';

const { user, loading } = useAuth();

if (loading) return <div>Loading...</div>;
if (!user) return <Navigate to="/auth" />;
```

## Testing Guidelines

### Manual Testing Checklist
- [ ] Authentication flow works
- [ ] Profiles can be created/updated
- [ ] Credit deduction works correctly
- [ ] Research initiates and completes
- [ ] RLS policies prevent unauthorized access
- [ ] Webhook payload is correct
- [ ] Results display properly

### Database Testing
- Test with multiple users to verify RLS
- Verify credit transactions log correctly
- Check JSONB fields store/retrieve data

## Performance

### React Optimization
- Use `useMemo` for expensive computations
- Use `useCallback` for function props
- Lazy load heavy components

### Database Optimization
- Select only needed columns
- Use indexes on frequently queried fields
- Batch operations when possible

## Security

### Input Validation
Use Zod for all user inputs:
```typescript
import { z } from 'zod';

const prospectSchema = z.object({
  company_name: z.string().min(1),
  website_url: z.string().url(),
});

const validated = prospectSchema.parse(formData);
```

### RLS Policy Verification
Always include `user_id` filter:
```typescript
// RLS enforces this, but explicit is better
.eq('user_id', auth.uid())
```

## Markdown Rendering

**ALWAYS use pure react-markdown with prose classes**

```typescript
// ✅ CORRECT - Stupid simple & fully dynamic
const renderMarkdownContent = (content: string) => (
  <ReactMarkdown className="prose prose-sm dark:prose-invert max-w-none prose-table:text-sm">
    {content}
  </ReactMarkdown>
);

// ❌ WRONG - Custom component overrides
// DO NOT add custom components prop
// Let Tailwind Typography handle ALL styling
// N8N system prompt controls presentation
```

This automatically styles:
- Tables (with borders, padding, alignment)
- Lists (bullets, numbering, nesting)
- Headings (h1-h6 hierarchy)
- Paragraphs, strong/emphasis, code blocks, etc.

## Documentation

Update docs when:
- Adding new database tables
- Changing payload structure
- Modifying N8N workflow
- Adding new features

Keep docs tight - remove outdated content immediately.
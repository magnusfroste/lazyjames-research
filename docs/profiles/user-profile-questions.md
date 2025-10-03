# User Profile Questions

Complete reference for all user profile questions used in the Research Engine forms.

## Section A: Personal Information

### 1. Full Name
- **Field**: `full_name`
- **Type**: Text (required)
- **Validation**: 1-100 characters
- **Purpose**: User identification and personalization in outreach

### 2. LinkedIn Profile URL
- **Field**: `linkedin_profile`
- **Type**: URL (optional)
- **Purpose**: Credibility verification and networking insights

### 3. Current City/Location
- **Field**: `current_location`
- **Type**: Text (optional)
- **Purpose**: Local connections and regional personalization

### 4. Birthplace/Hometown
- **Field**: `birthplace`
- **Type**: Text (optional)
- **Purpose**: Shared background and connection opportunities

### 5. Date of Birth
- **Field**: `date_of_birth`
- **Type**: Date (optional)
- **Purpose**: Timing and personalization insights

## Section B: Role & Context

### 6. Role in Organization
- **Field**: `role_in_organization`
- **Type**: Select dropdown (required)
- **Options**:
  - CEO/Founder
  - Sales Director/Manager
  - Business Development Manager
  - Marketing Director/Manager
  - Operations Manager
  - Partner/Co-founder
  - Consultant/Advisor
  - Other
- **Purpose**: Understanding authority level and perspective

### 7. Outreach Experience
- **Field**: `outreach_experience`
- **Type**: Radio button (required)
- **Options**:
  - New (< 1 year)
  - Beginner (1-2 years)
  - Experienced (3-5 years)
  - Expert (5+ years)
- **Purpose**: Tailoring research complexity and guidance level

### 8. Prospects per Week
- **Field**: `prospects_per_week`
- **Type**: Radio button (required)
- **Options**:
  - 1-5
  - 6-15
  - 16-30
  - 30+
  - Variable
- **Purpose**: Understanding volume and resource requirements

## Section C: Communication Style & Personality

### 9. Communication Style
- **Field**: `communication_style`
- **Type**: Radio button (required)
- **Options**:
  - Direct & to-the-point (business first)
  - Relational & personal (connection first)
  - Analytical & data-driven (facts first)
  - Inspiring & visionary (possibilities first)
  - Consultative & advisory (questions first)
- **Purpose**: Matching prospect research tone and approach

### 10. Introduction Style
- **Field**: `introduction_style`
- **Type**: Radio button (required)
- **Options**:
  - "Hi [name], I'm [your name] from [company]. We help..."
  - "Hello [name], I noticed you're working on..."
  - "Hi [name], I thought this might be interesting for you..."
  - "Dear [name], based on your [observation]..."
  - "Hi [name], I saw your recent [post/update] about..."
- **Purpose**: Personalizing opening message recommendations

### 11. Credibility Preference
- **Field**: `credibility_preference`
- **Type**: Multi-select checkboxes array (required)
- **Options**:
  - Case studies & concrete examples
  - Methodology & frameworks
  - Team credentials & experience
  - Client testimonials & references
  - Industry awards & recognition
  - Personal expertise & track record
- **Purpose**: Identifying relevant proof points to highlight

## Section D: Outreach Preferences

### 12. Preferred Contact Channels
- **Field**: `preferred_contact_channel`
- **Type**: Multi-select checkboxes array (required)
- **Options**:
  - LinkedIn message
  - Email outreach
  - Phone call
  - Referral introduction
  - Social media (Twitter, etc.)
  - Event/networking meeting
- **Purpose**: Channel-specific prospect research and contact strategy

### 13. Follow-up Timing
- **Field**: `followup_timing`
- **Type**: Radio button (required)
- **Options**:
  - Quick & persistent (within 3 days)
  - Moderate & respectful (within 1 week)
  - Patient & strategic (within 2 weeks)
  - Varies per prospect
- **Purpose**: Timing recommendations for follow-up sequences

### 14. Non-response Handling
- **Field**: `nonresponse_handling`
- **Type**: Radio button (required)
- **Options**:
  - Multiple follow-ups until clear 'no'
  - 2-3 attempts then move on
  - 1 follow-up then stop
  - Depends on prospect value/fit
- **Purpose**: Persistence strategy alignment

## Section E: Value Proposition & Messaging

### 15. Pain Points Focus
- **Field**: `pain_points_focus`
- **Type**: Multi-select checkboxes array (required)
- **Options**:
  - Cost/efficiency issues
  - Growth/scaling challenges
  - Technology/digital gaps
  - Compliance/risk issues
  - Process/operational friction
  - Team/organizational challenges
  - Customer experience problems
- **Purpose**: Identifying relevant prospect pain points to research

### 16. Expertise Positioning
- **Field**: `expertise_positioning`
- **Type**: Radio button (required)
- **Options**:
  - As industry specialist/expert
  - As problem solver/consultant
  - As strategic partner/advisor
  - As innovative solution provider
  - As results-driven implementer
- **Purpose**: Framing research insights around positioning

### 17. Objection Handling Approach
- **Field**: `objection_handling`
- **Type**: Multi-select checkboxes array (required)
- **Options**:
  - Address upfront in initial message
  - Respond when objections arise
  - Use social proof to preempt
  - Ask questions to understand concerns
  - Provide alternatives/flexibility
- **Purpose**: Anticipating and researching potential objections

## Section F: Meeting & Conversion Preferences

### 18. Meeting Format
- **Field**: `meeting_format`
- **Type**: Multi-select checkboxes array (required)
- **Options**:
  - Video call (Teams/Zoom)
  - Phone call
  - In-person meeting
  - Coffee meeting (informal)
  - Prospect's office visit
  - Flexible - prospect choice
- **Purpose**: Meeting logistics and scheduling insights

### 19. Meeting Duration
- **Field**: `meeting_duration`
- **Type**: Radio button (required)
- **Options**:
  - 15-30 minutes (quick qualification)
  - 30-45 minutes (standard discovery)
  - 45-60 minutes (deep dive)
  - 60+ minutes (comprehensive)
- **Purpose**: Time allocation and meeting preparation depth

### 20. Success Metrics
- **Field**: `success_metrics`
- **Type**: Multi-select checkboxes array (required)
- **Options**:
  - Response rate %
  - Meeting booking rate %
  - Qualified opportunities
  - Conversion to proposal
  - Closed deals
  - All of the above
- **Purpose**: Aligning research insights with user's KPIs

## Metadata Fields

### Profile Completion
- **Field**: `is_complete`
- **Type**: Boolean
- **Purpose**: Tracking profile setup status

### Credits
- **Field**: `credits`
- **Type**: Integer
- **Default**: 5
- **Purpose**: Available research credits (1 credit per research)

### Timestamps
- **Field**: `created_at`
- **Type**: Timestamp
- **Purpose**: Profile creation date

- **Field**: `updated_at`
- **Type**: Timestamp
- **Purpose**: Last modification date

### User Association
- **Field**: `user_id`
- **Type**: UUID (required)
- **Purpose**: Link to user account

## Form Implementation Notes

### Multi-Step Wizard
- 6 sections presented as sequential steps
- Clear progress indication
- Navigation between steps
- Final review before completion

### Required vs Optional Fields
- **Required**: full_name, role_in_organization, outreach_experience, prospects_per_week, communication_style, introduction_style, credibility_preference, preferred_contact_channel, followup_timing, nonresponse_handling, pain_points_focus, expertise_positioning, objection_handling, meeting_format, meeting_duration, success_metrics
- **Optional**: linkedin_profile, current_location, birthplace, date_of_birth

### Progressive Disclosure
- Basic personal information collected first
- Role and context establish baseline
- Communication preferences refine approach
- Meeting preferences finalize conversion strategy

### Validation Strategy
- Required fields clearly marked with asterisks
- Real-time validation with helpful error messages
- Array fields require at least one selection
- Profile marked complete only when all required fields populated

### Data Storage
- All data stored in Supabase `lab_user_profiles` table
- Array fields stored as PostgreSQL arrays
- Credits initialized to 5 on profile creation
- Proper indexing for performance

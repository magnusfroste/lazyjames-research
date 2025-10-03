# Company Profile Questions

Complete reference for all company profile questions used in the Research Engine forms.

## Basic Information

### 1. Company Name
- **Field**: `company_name`
- **Type**: Text (required)
- **Validation**: 1-100 characters
- **Purpose**: Primary identifier for the company

### 2. Website URL
- **Field**: `website_url`
- **Type**: URL (required)
- **Validation**: Valid URL format
- **Purpose**: Company website for research context

### 3. LinkedIn URL
- **Field**: `linkedin_url`
- **Type**: URL (optional)
- **Validation**: Valid URL format
- **Purpose**: Company LinkedIn profile for additional research context

### 4. Business Registration
- **Field**: `business_registration`
- **Type**: Text (optional)
- **Purpose**: Business registration details or legal entity information

### 5. Industry
- **Field**: `industry`
- **Type**: Text (required)
- **Purpose**: Industry classification for targeted research

### 6. Years Active
- **Field**: `years_active`
- **Type**: Text (optional)
- **Purpose**: Years in business for maturity context

### 7. Company Size
- **Field**: `company_size`
- **Type**: Select dropdown (required)
- **Options**:
  - Solo (1 person)
  - Startup (2-10 people)
  - Small Business (11-50 people)
  - Medium Business (51-200 people)
  - Large Business (201-1000 people)
  - Enterprise (1000+ people)
- **Purpose**: Context for company scale and resources

### 8. Geographic Markets
- **Field**: `geographic_markets`
- **Type**: Multi-select array (required, default: [])
- **Options**:
  - Local/Regional
  - National
  - International
  - Global
- **Purpose**: Understanding market reach and expansion context

## Mission & Vision

### 9. Mission Statement
- **Field**: `mission`
- **Type**: Textarea (required)
- **Purpose**: Core purpose and values for research alignment

### 10. Vision Statement
- **Field**: `vision`
- **Type**: Textarea (optional)
- **Purpose**: Future aspirations and strategic direction

## Values & Culture

### 11. Company Values
- **Field**: `values`
- **Type**: Multi-select checkboxes array (required, default: [])
- **Options**:
  - Innovation
  - Quality
  - Customer Service
  - Sustainability
  - Transparency
  - Collaboration
  - Excellence
  - Integrity
  - Growth
  - Community Impact
- **Purpose**: Cultural alignment for communication style

### 12. Organizational Personality
- **Field**: `organizational_personality`
- **Type**: Multi-select checkboxes array (required, default: [])
- **Options**:
  - Remote-First
  - Hybrid
  - In-Person
  - Flexible Hours
  - Results-Oriented
  - Collaborative
  - Fast-Paced
  - Innovation-Focused
- **Purpose**: Understanding organizational dynamics

## Offerings & Services

### 13. Offering Type
- **Field**: `offering_type`
- **Type**: Multi-select checkboxes array (required, default: [])
- **Options**:
  - Products
  - Services
  - Software
  - Consulting
  - E-commerce
  - SaaS
  - Hardware
  - Content
- **Purpose**: Categorizing business model for relevant research

### 14. Main Offerings
- **Field**: `main_offerings`
- **Type**: Multi-select array (required, default: [])
- **Purpose**: Primary products or services offered

### 15. Target Industries
- **Field**: `target_industries`
- **Type**: Multi-select array (required, default: [])
- **Purpose**: Industries the company targets for business

### 16. Ideal Client Size
- **Field**: `ideal_client_size`
- **Type**: Multi-select array (required, default: [])
- **Purpose**: Preferred client company sizes

### 17. Project Scope
- **Field**: `project_scope`
- **Type**: Text (required)
- **Purpose**: Typical project scope and engagement types

### 18. Unique Differentiators
- **Field**: `unique_differentiators`
- **Type**: Multi-select array (required, default: [])
- **Purpose**: Unique selling propositions and competitive advantages

### 19. Credentials
- **Field**: `credentials`
- **Type**: Multi-select array (required, default: [])
- **Purpose**: Professional credentials, certifications, and qualifications

### 20. Typical Results
- **Field**: `typical_results`
- **Type**: Multi-select array (required, default: [])
- **Purpose**: Common outcomes and results delivered to clients

### 21. Known Clients
- **Field**: `known_clients`
- **Type**: Boolean (optional, default: false)
- **Purpose**: Whether the company has notable/referenceable clients

### 22. Known Clients List
- **Field**: `known_clients_list`
- **Type**: Text (optional)
- **Purpose**: List of notable clients (if known_clients is true)

### 23. Success Story
- **Field**: `success_story`
- **Type**: Text (optional)
- **Purpose**: Detailed success story or case study

### 24. Delivery Model
- **Field**: `delivery_model`
- **Type**: Multi-select array (required, default: [])
- **Purpose**: How services/products are delivered to clients

### 25. Pricing Positioning
- **Field**: `pricing_positioning`
- **Type**: Text (required)
- **Purpose**: Pricing strategy and market positioning

### 26. Communication Style
- **Field**: `communication_style`
- **Type**: Text (required)
- **Purpose**: Preferred communication tone and approach

## Summary

**Total Company Profile Fields: 28**
- 26 core profile fields
- 2 metadata fields (`is_complete`, `user_id`)
- Automatic timestamps: `created_at`, `updated_at`

## Metadata Fields

### Profile Completion
- **Field**: `is_complete`
- **Type**: Boolean
- **Purpose**: Tracking profile setup status

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
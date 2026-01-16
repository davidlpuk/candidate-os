# CandidateOS

Job application management system with pipeline tracking, follow-up automation, and analytics.

## Features

- Pipeline Tracker - Track all job applications in one place
- Contact CRM - Manage recruiter and network contacts
- Follow-up Automation - Never miss a follow-up again
- Email Import - Parse job descriptions from emails
- Movement Tracking - Get alerts when contacts change companies
- Analytics Dashboard - Track response rates and conversion funnels

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/davidlpuk/candidate-os.git
cd candidate-os
npm install
```

### 2. Set up Supabase

1. Create a Supabase project at https://supabase.com
2. Run the database migration:

```bash
# Copy .env.example to .env
cp .env.example .env

# Add your Supabase credentials
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

3. Run the SQL migration in Supabase SQL Editor:
   - Open `supabase/migrations/001_initial_schema.sql`
   - Paste into Supabase SQL Editor
   - Run the query

### 3. Start development

```bash
npm run dev
```

The app will be available at http://localhost:3000

## Deployment

### Vercel

```bash
# Build for production
npm run build

# Deploy to Vercel
vercel --prod
```

### Environment Variables

Add these to your Vercel project:

```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

## Project Structure

```
candidate-os/
├── client/                      # Vite + React frontend
│   ├── src/
│   │   ├── components/         # UI components
│   │   ├── contexts/           # Auth + Theme providers
│   │   ├── hooks/              # React hooks (useJobs, useContacts, etc.)
│   │   ├── lib/                # Utilities (Supabase, parsers, templates)
│   │   ├── pages/              # Page components
│   │   └── types/              # TypeScript interfaces
├── supabase/
│   ├── migrations/             # Database schema
│   └── functions/              # Edge Functions
└── package.json
```

## Stack

- **Frontend:** React 19 + TypeScript + Vite
- **Styling:** Tailwind CSS
- **Database:** Supabase (PostgreSQL)
- **Auth:** Supabase Auth
- **Routing:** Wouter

## License

MIT

## Support

For issues or questions, please open a GitHub issue.

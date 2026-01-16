-- CandidateOS Database Schema
-- Run this in Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Jobs table
CREATE TABLE jobs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  company TEXT NOT NULL,
  location TEXT,
  url TEXT,
  status TEXT CHECK (status IN ('wishlist', 'applied', 'screening', 'interview', 'offer', 'rejected', 'withdrawn')) DEFAULT 'wishlist',
  source TEXT CHECK (source IN ('email', 'linkedin', 'manual', 'referral')) DEFAULT 'manual',
  applied_date TIMESTAMP WITH TIME ZONE,
  follow_up_date TIMESTAMP WITH TIME ZONE,
  last_contact_date TIMESTAMP WITH TIME ZONE,
  salary_range TEXT,
  contact_id UUID REFERENCES contacts(id) ON DELETE SET NULL,
  notes TEXT DEFAULT '',
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Contacts table
CREATE TABLE contacts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  linkedin_url TEXT,
  last_known_company TEXT,
  current_company TEXT,
  last_checked_date TIMESTAMP WITH TIME ZONE,
  company_changed BOOLEAN DEFAULT FALSE,
  company_changed_date TIMESTAMP WITH TIME ZONE,
  previous_company TEXT,
  title TEXT,
  warmth_score INTEGER CHECK (warmth_score >= 1 AND warmth_score <= 10) DEFAULT 5,
  last_contact_date TIMESTAMP WITH TIME ZONE,
  notes TEXT DEFAULT '',
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Follow-ups table
CREATE TABLE follow_ups (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  job_id UUID REFERENCES jobs(id) ON DELETE CASCADE NOT NULL,
  contact_id UUID REFERENCES contacts(id) ON DELETE SET NULL,
  scheduled_date TIMESTAMP WITH TIME ZONE NOT NULL,
  template_id UUID REFERENCES templates(id) ON DELETE SET NULL,
  status TEXT CHECK (status IN ('pending', 'sent', 'dismissed', 'snoozed')) DEFAULT 'pending',
  sent_date TIMESTAMP WITH TIME ZONE,
  snoozed_until TIMESTAMP WITH TIME ZONE,
  template_content TEXT,
  notes TEXT DEFAULT '',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Templates table
CREATE TABLE templates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  type TEXT CHECK (type IN ('followup', 'reconnection', 'application', 'interview')) DEFAULT 'followup',
  subject TEXT,
  body TEXT NOT NULL,
  variables TEXT[] DEFAULT '{}',
  usage_count INTEGER DEFAULT 0,
  is_default BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Email subscriptions table
CREATE TABLE email_subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  source TEXT NOT NULL,
  filters JSONB DEFAULT '{}',
  forward_to TEXT,
  last_processed_date TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Row Level Security
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE follow_ups ENABLE ROW LEVEL SECURITY;
ALTER TABLE templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_subscriptions ENABLE ROW LEVEL SECURITY;

-- Policies (users can only see their own data)
CREATE POLICY "Users can manage own jobs" ON jobs FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own contacts" ON contacts FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own follow_ups" ON follow_ups FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own templates" ON templates FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own email_subscriptions" ON email_subscriptions FOR ALL USING (auth.uid() = user_id);

-- Indexes for performance
CREATE INDEX idx_jobs_user_id ON jobs(user_id);
CREATE INDEX idx_jobs_status ON jobs(status);
CREATE INDEX idx_jobs_follow_up_date ON jobs(follow_up_date);
CREATE INDEX idx_contacts_user_id ON contacts(user_id);
CREATE INDEX idx_contacts_company ON contacts(current_company);
CREATE INDEX idx_follow_ups_user_id ON follow_ups(user_id);
CREATE INDEX idx_follow_ups_scheduled ON follow_ups(scheduled_date);
CREATE INDEX idx_follow_ups_status ON follow_ups(status);

-- Updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_jobs_updated_at BEFORE UPDATE ON jobs
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_contacts_updated_at BEFORE UPDATE ON contacts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_follow_ups_updated_at BEFORE UPDATE ON follow_ups
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_templates_updated_at BEFORE UPDATE ON templates
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

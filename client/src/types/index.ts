export type JobStatus =
  | "wishlist"
  | "applied"
  | "screening"
  | "interview"
  | "offer"
  | "rejected"
  | "withdrawn";
export type JobSource = "email" | "linkedin" | "manual" | "referral";
export type FollowUpStatus = "pending" | "sent" | "dismissed" | "snoozed";
export type TemplateType =
  | "followup"
  | "reconnection"
  | "application"
  | "interview";
export type ContactType = "recruiter" | "hiring_manager" | "network" | "peer";

export interface Job {
  id: string;
  user_id: string;
  title: string;
  company: string;
  location?: string;
  url?: string;
  status: JobStatus;
  source: JobSource;
  applied_date?: string;
  follow_up_date?: string;
  last_contact_date?: string;
  salary_range?: string;
  contact_id?: string;
  notes: string;
  tags: string[];
  created_at: string;
  updated_at: string;
  contact?: Contact;
}

export interface Contact {
  id: string;
  user_id: string;
  name: string;
  email?: string;
  phone?: string;
  linkedin_url?: string;
  last_known_company?: string;
  current_company?: string;
  last_checked_date?: string;
  company_changed: boolean;
  company_changed_date?: string;
  previous_company?: string;
  title?: string;
  warmth_score: number;
  last_contact_date?: string;
  notes: string;
  tags: string[];
  created_at: string;
  updated_at: string;
}

export interface FollowUp {
  id: string;
  user_id: string;
  job_id: string;
  contact_id?: string;
  scheduled_date: string;
  template_id?: string;
  status: FollowUpStatus;
  sent_date?: string;
  snoozed_until?: string;
  template_content?: string;
  notes: string;
  created_at: string;
  updated_at: string;
  job?: Job;
  contact?: Contact;
}

export interface Template {
  id?: string;
  name: string;
  type: TemplateType;
  subject?: string;
  body: string;
  variables: string[];
  usage_count?: number;
  is_default?: boolean;
  is_active?: boolean;
}

export interface MovementAlert {
  id: string;
  name: string;
  oldCompany: string;
  newCompany: string;
  changedDate: string;
}

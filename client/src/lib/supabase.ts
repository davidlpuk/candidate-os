import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    "Missing Supabase environment variables. Please check your .env file.",
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    flowType: "pkce",
  },
});

export type Database = {
  public: {
    Tables: {
      jobs: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          company: string;
          location: string | null;
          url: string | null;
          status:
            | "wishlist"
            | "applied"
            | "screening"
            | "interview"
            | "offer"
            | "reacted"
            | "withdrawn";
          source: "email" | "linkedin" | "manual" | "referral";
          applied_date: string | null;
          follow_up_date: string | null;
          last_contact_date: string | null;
          salary_range: string | null;
          contact_id: string | null;
          notes: string;
          tags: string[];
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<
          Database["public"]["Tables"]["jobs"]["Row"],
          "id" | "created_at" | "updated_at"
        >;
        Update: Partial<Database["public"]["Tables"]["jobs"]["Row"]>;
      };
      contacts: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          email: string | null;
          phone: string | null;
          linkedin_url: string | null;
          last_known_company: string | null;
          current_company: string | null;
          last_checked_date: string | null;
          company_changed: boolean;
          company_changed_date: string | null;
          previous_company: string | null;
          title: string | null;
          warmth_score: number;
          last_contact_date: string | null;
          notes: string;
          tags: string[];
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<
          Database["public"]["Tables"]["contacts"]["Row"],
          "id" | "created_at" | "updated_at"
        >;
        Update: Partial<Database["public"]["Tables"]["contacts"]["Row"]>;
      };
      follow_ups: {
        Row: {
          id: string;
          user_id: string;
          job_id: string;
          contact_id: string | null;
          scheduled_date: string;
          template_id: string | null;
          status: "pending" | "sent" | "dismissed" | "snoozed";
          sent_date: string | null;
          snoozed_until: string | null;
          template_content: string | null;
          notes: string;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<
          Database["public"]["Tables"]["follow_ups"]["Row"],
          "id" | "created_at" | "updated_at"
        >;
        Update: Partial<Database["public"]["Tables"]["follow_ups"]["Row"]>;
      };
      templates: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          type: "followup" | "reconnection" | "application" | "interview";
          subject: string | null;
          body: string;
          variables: string[];
          usage_count: number;
          is_default: boolean;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<
          Database["public"]["Tables"]["templates"]["Row"],
          "id" | "created_at" | "updated_at"
        >;
        Update: Partial<Database["public"]["Tables"]["templates"]["Row"]>;
      };
      email_subscriptions: {
        Row: {
          id: string;
          user_id: string;
          source: string;
          filters: Record<string, unknown>;
          forward_to: string | null;
          last_processed_date: string | null;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<
          Database["public"]["Tables"]["email_subscriptions"]["Row"],
          "id" | "created_at" | "updated_at"
        >;
        Update: Partial<
          Database["public"]["Tables"]["email_subscriptions"]["Row"]
        >;
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
};

export type Job = Database["public"]["Tables"]["jobs"]["Row"];
export type JobInsert = Database["public"]["Tables"]["jobs"]["Insert"];
export type JobUpdate = Database["public"]["Tables"]["jobs"]["Update"];

export type Contact = Database["public"]["Tables"]["contacts"]["Row"];
export type ContactInsert = Database["public"]["Tables"]["contacts"]["Insert"];
export type ContactUpdate = Database["public"]["Tables"]["contacts"]["Update"];

export type FollowUp = Database["public"]["Tables"]["follow_ups"]["Row"];
export type FollowUpInsert =
  Database["public"]["Tables"]["follow_ups"]["Insert"];
export type FollowUpUpdate =
  Database["public"]["Tables"]["follow_ups"]["Update"];

export type Template = Database["public"]["Tables"]["templates"]["Row"];
export type TemplateInsert =
  Database["public"]["Tables"]["templates"]["Insert"];
export type TemplateUpdate =
  Database["public"]["Tables"]["templates"]["Update"];

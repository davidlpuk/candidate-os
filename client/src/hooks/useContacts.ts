import { useState, useEffect } from "react";
import {
  supabase,
  type Contact,
  ContactInsert,
  ContactUpdate,
} from "../lib/supabase";

export function useContacts() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchContacts();
  }, []);

  async function fetchContacts() {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from("contacts")
        .select("*")
        .eq("user_id", user.id)
        .order("updated_at", { ascending: false });

      if (error) throw error;
      setContacts(data || []);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to fetch contacts");
    } finally {
      setLoading(false);
    }
  }

  async function createContact(contact: ContactInsert) {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error("Not authenticated");

    const { data, error } = await supabase
      .from("contacts")
      .insert({ ...contact, user_id: user.id })
      .select()
      .single();

    if (error) throw error;
    setContacts([data, ...contacts]);
    return data;
  }

  async function updateContact(id: string, updates: ContactUpdate) {
    const { data, error } = await supabase
      .from("contacts")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    if (updates.current_company && data.last_known_company) {
      await supabase
        .from("contacts")
        .update({
          company_changed: data.current_company !== data.last_known_company,
          company_changed_date:
            data.current_company !== data.last_known_company
              ? new Date().toISOString()
              : null,
          previous_company: data.last_known_company,
        })
        .eq("id", id);
    }

    setContacts(
      contacts.map((c) => (c.id === id ? { ...data, ...updates } : c)),
    );
    return data;
  }

  async function deleteContact(id: string) {
    const { error } = await supabase.from("contacts").delete().eq("id", id);

    if (error) throw error;
    setContacts(contacts.filter((c) => c.id !== id));
  }

  async function checkMovements(
    contactIds: string[],
  ): Promise<MovementAlert[]> {
    const alerts: MovementAlert[] = [];

    for (const id of contactIds) {
      const { data, error } = await supabase
        .from("contacts")
        .select("id, linkedin_url, last_known_company")
        .eq("id", id)
        .single();

      if (error || !data) continue;

      try {
        const currentCompany = await scrapeLinkedIn(data.linkedin_url || "");

        if (currentCompany && currentCompany !== data.last_known_company) {
          alerts.push({
            id: data.id,
            name: "", // Would need to fetch name
            oldCompany: data.last_known_company || "",
            newCompany: currentCompany,
            changedDate: new Date().toISOString(),
          });

          await supabase
            .from("contacts")
            .update({
              current_company: currentCompany,
              company_changed: true,
              company_changed_date: new Date().toISOString(),
              previous_company: data.last_known_company,
            })
            .eq("id", id);
        }
      } catch (e) {
        console.error(`Error checking movement for ${id}:`, e);
      }
    }

    return alerts;
  }

  async function scrapeLinkedIn(url: string): Promise<string | null> {
    // This would require LinkedIn scraping logic
    // For MVP, return null or use a headless browser
    return null;
  }

  return {
    contacts,
    loading,
    error,
    createContact,
    updateContact,
    deleteContact,
    checkMovements,
    refetch: fetchContacts,
  };
}

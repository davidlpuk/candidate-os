import { useState, useEffect } from "react";
import {
  supabase,
  type FollowUp,
  FollowUpInsert,
  FollowUpUpdate,
  Template,
} from "../lib/supabase";
import { populateTemplate, DEFAULT_TEMPLATES } from "../lib/templates";

export function useFollowUps() {
  const [followUps, setFollowUps] = useState<FollowUp[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchFollowUps();
  }, []);

  async function fetchFollowUps() {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from("follow_ups")
        .select("*, job:jobs(*), contact:contacts(*)")
        .eq("user_id", user.id)
        .order("scheduled_date", { ascending: true });

      if (error) throw error;
      setFollowUps(data || []);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to fetch follow-ups");
    } finally {
      setLoading(false);
    }
  }

  async function createFollowUp(followUp: FollowUpInsert) {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error("Not authenticated");

    const { data, error } = await supabase
      .from("follow_ups")
      .insert({ ...followUp, user_id: user.id })
      .select()
      .single();

    if (error) throw error;
    setFollowUps([...followUps, data]);
    return data;
  }

  async function updateFollowUp(id: string, updates: FollowUpUpdate) {
    const { data, error } = await supabase
      .from("follow_ups")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    if (updates.template_id && updates.template_id) {
      await incrementTemplateUsage(updates.template_id);
    }

    setFollowUps(followUps.map((f) => (f.id === id ? data : f)));
    return data;
  }

  async function deleteFollowUp(id: string) {
    const { error } = await supabase.from("follow_ups").delete().eq("id", id);

    if (error) throw error;
    setFollowUps(followUps.filter((f) => f.id !== id));
  }

  async function markAsSent(id: string, templateId?: string) {
    const update: FollowUpUpdate = {
      status: "sent",
      sent_date: new Date().toISOString(),
    };

    if (templateId) {
      update.template_id = templateId;
    }

    return await updateFollowUp(id, update);
  }

  async function snoozeFollowUp(id: string, days: number) {
    const followUp = followUps.find((f) => f.id === id);
    if (!followUp) throw new Error("Follow-up not found");

    const newDate = new Date(followUp.scheduled_date);
    newDate.setDate(newDate.getDate() + days);

    return await updateFollowUp(id, {
      status: "snoozed",
      snoozed_until: newDate.toISOString(),
      scheduled_date: newDate.toISOString(),
    });
  }

  async function dismissFollowUp(id: string) {
    return await updateFollowUp(id, { status: "dismissed" });
  }

  async function incrementTemplateUsage(templateId: string) {
    await supabase
      .from("templates")
      .update({ usage_count: supabase.raw("usage_count") + 1 })
      .eq("id", templateId);
  }

  function generateMailtoLink(
    followUp: FollowUp,
    template: Template,
    variables: Record<string, string>,
  ): string {
    const body = populateTemplate(template, variables);
    const encodedBody = encodeURIComponent(body);
    const encodedSubject = encodeURIComponent(
      template.subject || "Following up",
    );

    const contact = followUp.contact;
    if (!contact?.email) {
      alert("Contact has no email address");
      return "";
    }

    return `mailto:${contact.email}?subject=${encodedSubject}&body=${encodedBody}`;
  }

  function getPendingFollowUps(): FollowUp[] {
    return followUps.filter(
      (f) => f.status === "pending" && new Date(f.scheduled_date) < new Date(),
    );
  }

  function getUpcomingFollowUps(): FollowUp[] {
    return followUps.filter(
      (f) => f.status === "pending" && new Date(f.scheduled_date) >= new Date(),
    );
  }

  return {
    followUps,
    loading,
    error,
    createFollowUp,
    updateFollowUp,
    deleteFollowUp,
    markAsSent,
    snoozeFollowUp,
    dismissFollowUp,
    generateMailtoLink,
    getPendingFollowUps,
    getUpcomingFollowUps,
    refetch: fetchFollowUps,
  };
}

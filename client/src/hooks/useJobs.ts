import { useState, useEffect } from "react";
import { supabase, type Job, JobInsert, JobUpdate } from "../lib/supabase";

export function useJobs() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchJobs();
  }, []);

  async function fetchJobs() {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from("jobs")
        .select("*, contact:contacts(*)")
        .eq("user_id", user.id)
        .order("updated_at", { ascending: false });

      if (error) throw error;
      setJobs(data || []);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to fetch jobs");
    } finally {
      setLoading(false);
    }
  }

  async function createJob(job: JobInsert) {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error("Not authenticated");

    const { data, error } = await supabase
      .from("jobs")
      .insert({ ...job, user_id: user.id })
      .select()
      .single();

    if (error) throw error;

    await createFollowUpForJob(data.id, job.status || "wishlist");
    setJobs([data, ...jobs]);
    return data;
  }

  async function updateJob(id: string, updates: JobUpdate) {
    const { data, error } = await supabase
      .from("jobs")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    if (updates.status) {
      await updateFollowUpForJob(id, updates.status);
    }

    setJobs(jobs.map((j) => (j.id === id ? data : j)));
    return data;
  }

  async function deleteJob(id: string) {
    const { error } = await supabase.from("jobs").delete().eq("id", id);

    if (error) throw error;
    setJobs(jobs.filter((j) => j.id !== id));
  }

  async function createFollowUpForJob(jobId: string, status: string) {
    const { calculateFollowUpDate } = await import("../lib/formatters");
    const followUpDate = calculateFollowUpDate(status);

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    await supabase.from("follow_ups").insert({
      user_id: user.id,
      job_id: jobId,
      scheduled_date: followUpDate.toISOString(),
      status: "pending",
    });
  }

  async function updateFollowUpForJob(jobId: string, status: string) {
    const { calculateFollowUpDate } = await import("../lib/formatters");
    const followUpDate = calculateFollowUpDate(status);

    await supabase
      .from("follow_ups")
      .update({ scheduled_date: followUpDate.toISOString() })
      .eq("job_id", jobId)
      .eq("status", "pending");
  }

  return {
    jobs,
    loading,
    error,
    createJob,
    updateJob,
    deleteJob,
    refetch: fetchJobs,
  };
}

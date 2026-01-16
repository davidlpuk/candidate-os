import { supabase } from "./supabase";
import type { Job, FollowUp } from "./supabase";

export interface Analytics {
  totalApplications: number;
  responseRate: number;
  conversionRate: number;
  pendingFollowUps: number;
  sentFollowUps: number;
  byStatus: Record<string, number>;
  byWeek: Record<string, number>;
}

export async function getAnalytics(userId: string): Promise<Analytics> {
  const { count: totalApplications } = await supabase
    .from("jobs")
    .select("*", { count: "exact", head: true })
    .eq("user_id", userId);

  const { data: jobs } = await supabase
    .from("jobs")
    .select("status, created_at")
    .eq("user_id", userId);

  const responded =
    jobs?.filter((j) => ["screening", "interview", "offer"].includes(j.status))
      .length ?? 0;

  const responseRate = totalApplications
    ? Math.round((responded / totalApplications) * 100)
    : 0;

  const interviews =
    jobs?.filter((j) => ["interview", "offer"].includes(j.status)).length ?? 0;

  const conversionRate = responded
    ? Math.round((interviews / responded) * 100)
    : 0;

  const { count: pendingFollowUps } = await supabase
    .from("follow_ups")
    .select("*", { count: "exact", head: true })
    .eq("user_id", userId)
    .eq("status", "pending")
    .lt("scheduled_date", new Date().toISOString());

  const { count: sentFollowUps } = await supabase
    .from("follow_ups")
    .select("*", { count: "exact", head: true })
    .eq("user_id", userId)
    .eq("status", "sent");

  const { data: byWeek } = await supabase
    .from("jobs")
    .select("created_at")
    .eq("user_id", userId)
    .gte(
      "created_at",
      new Date(Date.now() - 8 * 7 * 24 * 60 * 60 * 1000).toISOString(),
    );

  return {
    totalApplications: totalApplications ?? 0,
    responseRate,
    conversionRate,
    pendingFollowUps: pendingFollowUps ?? 0,
    sentFollowUps: sentFollowUps ?? 0,
    byStatus: groupBy(jobs ?? [], (j) => j.status),
    byWeek: groupBy(byWeek ?? [], (d) => getWeekLabel(d.created_at)),
  };
}

function groupBy<T>(
  array: T[],
  keyFn: (item: T) => string,
): Record<string, number> {
  return array.reduce(
    (acc, item) => {
      const key = keyFn(item);
      acc[key] = (acc[key] ?? 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  );
}

function getWeekLabel(dateStr: string): string {
  const date = new Date(dateStr);
  const week = Math.ceil(date.getDate() / 7);
  return `${date.getFullYear()}-W${week}`;
}

export function calculateFollowUpDate(status: string): Date {
  const now = new Date();
  switch (status) {
    case "applied":
      return new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    case "screening":
      return new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000);
    case "interview":
      return new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000);
    default:
      return new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000);
  }
}

export function getWarmthScoreColor(score: number): string {
  if (score >= 8) return "text-green-400";
  if (score >= 5) return "text-yellow-400";
  return "text-red-400";
}

export function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    wishlist: "text-purple-400",
    applied: "text-blue-400",
    screening: "text-cyan-400",
    interview: "text-green-400",
    offer: "text-emerald-400",
    rejected: "text-red-400",
    withdrawn: "text-gray-400",
  };
  return colors[status] || "text-gray-400";
}

export function getStatusBgColor(status: string): string {
  const colors: Record<string, string> = {
    wishlist: "bg-purple-400/10",
    applied: "bg-blue-400/10",
    screening: "bg-cyan-400/10",
    interview: "bg-green-400/10",
    offer: "bg-emerald-400/10",
    rejected: "bg-red-400/10",
    withdrawn: "bg-gray-400/10",
  };
  return colors[status] || "bg-gray-400/10";
}

export function formatDate(date: string | Date | null): string {
  if (!date) return "N/A";
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function formatRelativeDate(date: string | Date | null): string {
  if (!date) return "N/A";
  const d = typeof date === "string" ? new Date(date) : date;
  const now = new Date();
  const diff = d.getTime() - now.getTime();
  const days = Math.floor(diff / (24 * 60 * 60 * 1000));

  if (days < 0) return `Overdue by ${Math.abs(days)} days`;
  if (days === 0) return "Today";
  if (days === 1) return "Tomorrow";
  if (days < 7) return `In ${days} days`;
  const weeks = Math.ceil(days / 7);
  return `In ${weeks} week${weeks > 1 ? "s" : ""}`;
}

export function isOverdue(date: string | Date | null): boolean {
  if (!date) return false;
  const d = typeof date === "string" ? new Date(date) : date;
  return d < new Date();
}

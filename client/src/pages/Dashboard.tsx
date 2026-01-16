import { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { supabase } from "../lib/supabase";

interface Analytics {
  totalApplications: number;
  responseRate: number;
  conversionRate: number;
  pendingFollowUps: number;
  sentFollowUps: number;
  byStatus: Record<string, number>;
  byWeek: Record<string, number>;
}

export default function Dashboard() {
  const { user } = useAuth();
  const [analytics, setAnalytics] = useState<Analytics>({
    totalApplications: 0,
    responseRate: 0,
    conversionRate: 0,
    pendingFollowUps: 0,
    sentFollowUps: 0,
    byStatus: {},
    byWeek: {},
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadAnalytics();
    }
  }, [user]);

  async function loadAnalytics() {
    setLoading(true);
    try {
      const {
        data: { user: authUser },
      } = await supabase.auth.getUser();
      if (!authUser) return;

      const { count: totalApplications } = await supabase
        .from("jobs")
        .select("*", { count: "exact", head: true })
        .eq("user_id", authUser.id);

      const { data: jobs } = await supabase
        .from("jobs")
        .select("status, created_at")
        .eq("user_id", authUser.id);

      const responded =
        jobs?.filter((j) =>
          ["screening", "interview", "offer"].includes(j.status),
        ).length ?? 0;

      const responseRate = totalApplications
        ? Math.round((responded / totalApplications) * 100)
        : 0;

      const interviews =
        jobs?.filter((j) => ["interview", "offer"].includes(j.status)).length ??
        0;

      const conversionRate = responded
        ? Math.round((interviews / responded) * 100)
        : 0;

      const { count: pendingFollowUps } = await supabase
        .from("follow_ups")
        .select("*", { count: "exact", head: true })
        .eq("user_id", authUser.id)
        .eq("status", "pending")
        .lt("scheduled_date", new Date().toISOString());

      const { count: sentFollowUps } = await supabase
        .from("follow_ups")
        .select("*", { count: "exact", head: true })
        .eq("user_id", authUser.id)
        .eq("status", "sent");

      const { data: byWeek } = await supabase
        .from("jobs")
        .select("created_at")
        .eq("user_id", authUser.id)
        .gte(
          "created_at",
          new Date(Date.now() - 8 * 7 * 24 * 60 * 60 * 1000).toISOString(),
        );

      setAnalytics({
        totalApplications: totalApplications ?? 0,
        responseRate,
        conversionRate,
        pendingFollowUps: pendingFollowUps ?? 0,
        sentFollowUps: sentFollowUps ?? 0,
        byStatus: groupBy(jobs ?? [], (j) => j.status),
        byWeek: groupBy(byWeek ?? [], (d) => getWeekLabel(d.created_at)),
      });
    } catch (e) {
      console.error("Failed to load analytics:", e);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-400">Loading analytics...</div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Dashboard</h1>
        <p className="text-gray-400">Overview of your job search progress</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <div className="text-gray-400 text-sm mb-1">Total Applications</div>
          <div className="text-3xl font-bold text-white">
            {analytics.totalApplications}
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <div className="text-gray-400 text-sm mb-1">Response Rate</div>
          <div className="text-3xl font-bold text-blue-400">
            {analytics.responseRate}%
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <div className="text-gray-400 text-sm mb-1">Conversion Rate</div>
          <div className="text-3xl font-bold text-green-400">
            {analytics.conversionRate}%
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <div className="text-gray-400 text-sm mb-1">Pending Follow-ups</div>
          <div className="text-3xl font-bold text-yellow-400">
            {analytics.pendingFollowUps}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <h2 className="text-xl font-bold text-white mb-4">Pipeline Status</h2>
          <div className="space-y-3">
            {Object.entries(analytics.byStatus).map(([status, count]) => (
              <div key={status} className="flex justify-between items-center">
                <span className="text-gray-300 capitalize">{status}</span>
                <span className="text-2xl font-bold text-white">{count}</span>
              </div>
            ))}
            {Object.keys(analytics.byStatus).length === 0 && (
              <p className="text-gray-400">
                No data yet. Add jobs to see your pipeline.
              </p>
            )}
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <h2 className="text-xl font-bold text-white mb-4">Weekly Activity</h2>
          <div className="space-y-3">
            {Object.entries(analytics.byWeek)
              .sort((a, b) => b[0].localeCompare(a[0]))
              .slice(0, 8)
              .map(([week, count]) => (
                <div key={week} className="flex justify-between items-center">
                  <span className="text-gray-300">{week}</span>
                  <span className="text-2xl font-bold text-white">{count}</span>
                </div>
              ))}
            {Object.keys(analytics.byWeek).length === 0 && (
              <p className="text-gray-400">
                No activity yet. Start applying to jobs!
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="mt-8 bg-gray-800 rounded-lg p-6 border border-gray-700">
        <h2 className="text-xl font-bold text-white mb-4">Quick Stats</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-white">
              {analytics.sentFollowUps}
            </div>
            <div className="text-sm text-gray-400">Follow-ups Sent</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-white">
              {analytics.totalApplications > 0
                ? Math.round(analytics.responseRate)
                : 0}
              %
            </div>
            <div className="text-sm text-gray-400">Response Rate</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-white">
              {analytics.totalApplications > 0
                ? Math.round(analytics.conversionRate)
                : 0}
              %
            </div>
            <div className="text-sm text-gray-400">Interview Rate</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-400">
              {analytics.pendingFollowUps}
            </div>
            <div className="text-sm text-gray-400">Need Follow-up</div>
          </div>
        </div>
      </div>
    </div>
  );
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

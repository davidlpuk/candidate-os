import {
  getAnalytics,
  formatDate,
  formatRelativeDate,
} from "../lib/formatters";
import { useAuth } from "../contexts/AuthContext";
import { useEffect, useState } from "react";

export default function Dashboard() {
  const { user } = useAuth();
  const [analytics, setAnalytics] = useState({
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
      const data = await getAnalytics(user.id);
      setAnalytics(data);
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
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Dashboard</h1>
        <p className="text-gray-400">Overview of your job search progress</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="card">
          <div className="text-gray-400 text-sm mb-1">Total Applications</div>
          <div className="text-3xl font-bold text-white">
            {analytics.totalApplications}
          </div>
        </div>

        <div className="card">
          <div className="text-gray-400 text-sm mb-1">Response Rate</div>
          <div className="text-3xl font-bold text-blue-400">
            {analytics.responseRate}%
          </div>
        </div>

        <div className="card">
          <div className="text-gray-400 text-sm mb-1">Conversion Rate</div>
          <div className="text-3xl font-bold text-green-400">
            {analytics.conversionRate}%
          </div>
        </div>

        <div className="card">
          <div className="text-gray-400 text-sm mb-1">Pending Follow-ups</div>
          <div className="text-3xl font-bold text-yellow-400">
            {analytics.pendingFollowUps}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h2 className="text-xl font-bold text-white mb-4">Pipeline Status</h2>
          <div className="space-y-3">
            {Object.entries(analytics.byStatus).map(([status, count]) => (
              <div key={status} className="flex justify-between items-center">
                <span className="text-gray-300 capitalize">{status}</span>
                <span className="text-2xl font-bold text-white">{count}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
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
          </div>
        </div>
      </div>
    </div>
  );
}

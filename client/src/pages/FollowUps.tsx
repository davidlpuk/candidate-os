import { useFollowUps } from "../hooks/useFollowUps";
import { useTemplates } from "../hooks/useTemplates";
import { formatDate, formatRelativeDate } from "../lib/formatters";
import { useState } from "react";
import { Clock, Send, X, AlertCircle, CheckCircle } from "lucide-react";

export default function FollowUps() {
  const {
    followUps,
    loading,
    markAsSent,
    snoozeFollowUp,
    dismissFollowUp,
    generateMailtoLink,
  } = useFollowUps();
  const { templates } = useTemplates();
  const [selectedTemplate, setSelectedTemplate] = useState<string>("");

  const pendingFollowUps = followUps.filter(
    (f) => f.status === "pending" && new Date(f.scheduled_date) < new Date(),
  );
  const upcomingFollowUps = followUps.filter(
    (f) => f.status === "pending" && new Date(f.scheduled_date) >= new Date(),
  );
  const sentFollowUps = followUps
    .filter((f) => f.status === "sent")
    .slice(0, 10);

  const handleSendFollowUp = async (followUpId: string) => {
    const followUp = followUps.find((f) => f.id === followUpId);
    if (!followUp) return;

    if (!selectedTemplate) {
      alert("Please select a template first");
      return;
    }

    const template = templates.find((t) => t.id === selectedTemplate);
    if (!template) return;

    // Generate mailto link with template variables
    const variables = {
      name: followUp.contact?.name || "Contact",
      role: followUp.job?.title || "Position",
      company: followUp.job?.company || "Company",
      my_name: "Your Name", // This should come from user profile
    };

    const mailtoLink = generateMailtoLink(followUp, template, variables);
    window.open(mailtoLink, "_blank");

    // Mark as sent
    await markAsSent(followUpId, selectedTemplate);
  };

  const handleSnooze = async (followUpId: string, days: number) => {
    await snoozeFollowUp(followUpId, days);
  };

  const handleDismiss = async (followUpId: string) => {
    if (confirm("Are you sure you want to dismiss this follow-up?")) {
      await dismissFollowUp(followUpId);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-400">Loading follow-ups...</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Follow-ups</h1>
        <p className="text-gray-400">Manage your follow-up communications</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Overdue Follow-ups */}
        <div className="lg:col-span-2">
          <div className="card mb-6">
            <div className="flex items-center gap-2 mb-4">
              <AlertCircle className="w-5 h-5 text-red-400" />
              <h2 className="text-xl font-bold text-white">
                Overdue Follow-ups
              </h2>
              <span className="bg-red-600 text-white px-2 py-1 rounded-full text-sm">
                {pendingFollowUps.length}
              </span>
            </div>

            {pendingFollowUps.length === 0 ? (
              <div className="text-gray-400 text-center py-8">
                No overdue follow-ups! 🎉
              </div>
            ) : (
              <div className="space-y-4">
                {pendingFollowUps.map((followUp) => (
                  <div
                    key={followUp.id}
                    className="border border-red-600/30 rounded-lg p-4 bg-red-900/10"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-semibold text-white">
                          {followUp.job?.title} at {followUp.job?.company}
                        </h3>
                        <p className="text-sm text-gray-400">
                          Contact:{" "}
                          {followUp.contact?.name || "No contact assigned"}
                        </p>
                        <p className="text-sm text-red-400">
                          Due: {formatRelativeDate(followUp.scheduled_date)}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="text-xs text-gray-500 mb-1">Status</div>
                        <span className="px-2 py-1 bg-yellow-600 text-white rounded-full text-xs">
                          {followUp.status}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 mb-3">
                      <select
                        className="input text-sm py-1"
                        value={selectedTemplate}
                        onChange={(e) => setSelectedTemplate(e.target.value)}
                      >
                        <option value="">Select template...</option>
                        {templates.map((template) => (
                          <option key={template.id} value={template.id}>
                            {template.name}
                          </option>
                        ))}
                      </select>
                      <button
                        onClick={() => handleSendFollowUp(followUp.id)}
                        disabled={!selectedTemplate}
                        className="btn btn-primary text-sm py-1"
                      >
                        <Send className="w-3 h-3 mr-1" />
                        Send
                      </button>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => handleSnooze(followUp.id, 3)}
                        className="btn btn-secondary text-sm py-1"
                      >
                        <Clock className="w-3 h-3 mr-1" />
                        Snooze 3 days
                      </button>
                      <button
                        onClick={() => handleSnooze(followUp.id, 7)}
                        className="btn btn-secondary text-sm py-1"
                      >
                        Snooze 1 week
                      </button>
                      <button
                        onClick={() => handleDismiss(followUp.id)}
                        className="btn btn-danger text-sm py-1"
                      >
                        <X className="w-3 h-3 mr-1" />
                        Dismiss
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Upcoming Follow-ups */}
          <div className="card">
            <div className="flex items-center gap-2 mb-4">
              <Clock className="w-5 h-5 text-blue-400" />
              <h2 className="text-xl font-bold text-white">
                Upcoming Follow-ups
              </h2>
              <span className="bg-blue-600 text-white px-2 py-1 rounded-full text-sm">
                {upcomingFollowUps.length}
              </span>
            </div>

            {upcomingFollowUps.length === 0 ? (
              <div className="text-gray-400 text-center py-8">
                No upcoming follow-ups
              </div>
            ) : (
              <div className="space-y-3">
                {upcomingFollowUps.map((followUp) => (
                  <div
                    key={followUp.id}
                    className="flex items-center justify-between p-3 border border-gray-700 rounded-lg"
                  >
                    <div>
                      <h3 className="font-medium text-white">
                        {followUp.job?.title} at {followUp.job?.company}
                      </h3>
                      <p className="text-sm text-gray-400">
                        Due: {formatRelativeDate(followUp.scheduled_date)}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleSnooze(followUp.id, 3)}
                        className="btn btn-secondary text-sm py-1"
                      >
                        Snooze
                      </button>
                      <button
                        onClick={() => handleDismiss(followUp.id)}
                        className="btn btn-danger text-sm py-1"
                      >
                        Dismiss
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Recent Activity */}
        <div>
          <div className="card">
            <div className="flex items-center gap-2 mb-4">
              <CheckCircle className="w-5 h-5 text-green-400" />
              <h2 className="text-xl font-bold text-white">Recent Activity</h2>
            </div>

            {sentFollowUps.length === 0 ? (
              <div className="text-gray-400 text-center py-8">
                No recent follow-ups
              </div>
            ) : (
              <div className="space-y-3">
                {sentFollowUps.map((followUp) => (
                  <div
                    key={followUp.id}
                    className="p-3 border border-gray-700 rounded-lg"
                  >
                    <h3 className="font-medium text-white text-sm">
                      {followUp.job?.title} at {followUp.job?.company}
                    </h3>
                    <p className="text-xs text-gray-400">
                      Sent:{" "}
                      {followUp.sent_date
                        ? formatDate(followUp.sent_date)
                        : "Unknown"}
                    </p>
                    <div className="mt-2">
                      <span className="px-2 py-1 bg-green-600 text-white rounded-full text-xs">
                        Sent
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

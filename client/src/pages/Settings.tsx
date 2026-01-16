import { useTemplates } from "../hooks/useTemplates";
import { useAuth } from "../contexts/AuthContext";
import { useTheme } from "../contexts/ThemeContext";
import { useState } from "react";
import { supabase } from "../lib/supabase";
import {
  Settings as SettingsIcon,
  Moon,
  Sun,
  Mail,
  Download,
  Upload,
  Database,
  CheckCircle,
} from "lucide-react";

export default function Settings() {
  const { user } = useAuth();
  const { theme, setTheme } = useTheme();
  const { templates } = useTemplates();
  const [exporting, setExporting] = useState(false);
  const [importing, setImporting] = useState(false);
  const [message, setMessage] = useState("");

  const handleThemeChange = (newTheme: "dark" | "light") => {
    setTheme(newTheme);
  };

  const handleSaveDefaultTemplates = async () => {
    try {
      const { saveDefaultsToDatabase } = await import("../hooks/useTemplates");
      await saveDefaultsToDatabase();
      setMessage("Templates saved successfully!");
      setTimeout(() => setMessage(""), 3000);
    } catch (e) {
      setMessage(
        "Failed to save templates: " +
          (e instanceof Error ? e.message : "Unknown error"),
      );
      setTimeout(() => setMessage(""), 5000);
    }
  };

  const handleExportData = async () => {
    setExporting(true);
    try {
      const {
        data: { user: authUser },
      } = await supabase.auth.getUser();
      if (!authUser) {
        setMessage("Please sign in to export data");
        setExporting(false);
        return;
      }

      const { data: jobs } = await supabase
        .from("jobs")
        .select("*")
        .eq("user_id", authUser.id);

      const { data: contacts } = await supabase
        .from("contacts")
        .select("*")
        .eq("user_id", authUser.id);

      const { data: followUps } = await supabase
        .from("follow_ups")
        .select("*")
        .eq("user_id", authUser.id);

      const exportData = {
        exportDate: new Date().toISOString(),
        version: "1.0",
        jobs: jobs || [],
        contacts: contacts || [],
        followUps: followUps || [],
      };

      const blob = new Blob([JSON.stringify(exportData, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `candidate-os-export-${new Date().toISOString().split("T")[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);

      setMessage("Data exported successfully!");
      setTimeout(() => setMessage(""), 3000);
    } catch (e) {
      setMessage("Failed to export data");
    } finally {
      setExporting(false);
    }
  };

  const handleImportData = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json";
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;

      setImporting(true);
      try {
        const text = await file.text();
        const data = JSON.parse(text);

        const {
          data: { user: authUser },
        } = await supabase.auth.getUser();
        if (!authUser) {
          setMessage("Please sign in to import data");
          setImporting(false);
          return;
        }

        if (data.jobs && Array.isArray(data.jobs)) {
          for (const job of data.jobs) {
            const { id, created_at, updated_at, ...jobData } = job;
            await supabase.from("jobs").insert({
              ...jobData,
              user_id: authUser.id,
            });
          }
        }

        if (data.contacts && Array.isArray(data.contacts)) {
          for (const contact of data.contacts) {
            const { id, created_at, updated_at, ...contactData } = contact;
            await supabase.from("contacts").insert({
              ...contactData,
              user_id: authUser.id,
            });
          }
        }

        setMessage("Data imported successfully! Refresh to see changes.");
        setTimeout(() => setMessage(""), 5000);
      } catch (e) {
        setMessage("Failed to import data: Invalid file format");
      } finally {
        setImporting(false);
      }
    };
    input.click();
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Settings</h1>
        <p className="text-gray-400">Customize your CandidateOS experience</p>
      </div>

      {message && (
        <div
          className={`mb-6 p-4 rounded-lg ${message.includes("Failed") ? "bg-red-900/50 border border-red-500 text-red-400" : "bg-green-900/50 border border-green-500 text-green-400"}`}
        >
          {message}
        </div>
      )}

      <div className="space-y-6">
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <div className="flex items-center gap-3 mb-4">
            <SettingsIcon className="w-5 h-5 text-blue-400" />
            <h2 className="text-xl font-bold text-white">Appearance</h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Theme
              </label>
              <div className="flex gap-3">
                <button
                  onClick={() => handleThemeChange("dark")}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                    theme === "dark"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                  }`}
                >
                  <Moon className="w-4 h-4" />
                  Dark
                </button>
                <button
                  onClick={() => handleThemeChange("light")}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                    theme === "light"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                  }`}
                >
                  <Sun className="w-4 h-4" />
                  Light
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <div className="flex items-center gap-3 mb-4">
            <Mail className="w-5 h-5 text-green-400" />
            <h2 className="text-xl font-bold text-white">Email Templates</h2>
          </div>

          <div className="space-y-4">
            <div>
              <p className="text-gray-400 mb-3">
                You have {templates.length} email templates configured. Default
                templates include follow-up messages, reconnection emails, and
                more.
              </p>

              <button
                onClick={handleSaveDefaultTemplates}
                className="btn bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                Save Default Templates
              </button>
            </div>

            <div className="border-t border-gray-700 pt-4">
              <h3 className="text-lg font-semibold text-white mb-3">
                Available Templates
              </h3>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {templates.slice(0, 5).map((template) => (
                  <div
                    key={template.id}
                    className="p-3 border border-gray-700 rounded-lg"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-white">
                        {template.name}
                      </h4>
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          template.type === "followup"
                            ? "bg-blue-600"
                            : template.type === "reconnection"
                              ? "bg-green-600"
                              : "bg-purple-600"
                        } text-white`}
                      >
                        {template.type}
                      </span>
                    </div>
                    <p className="text-sm text-gray-400 line-clamp-2">
                      {template.body.substring(0, 100)}...
                    </p>
                  </div>
                ))}
                {templates.length > 5 && (
                  <p className="text-sm text-gray-400">
                    And {templates.length - 5} more templates...
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <div className="flex items-center gap-3 mb-4">
            <Database className="w-5 h-5 text-yellow-400" />
            <h2 className="text-xl font-bold text-white">Data Management</h2>
          </div>

          <div className="space-y-4">
            <div>
              <p className="text-gray-400 mb-3">
                Export your data for backup or migration, or import data from
                another source.
              </p>

              <div className="flex gap-3">
                <button
                  onClick={handleExportData}
                  disabled={exporting}
                  className="btn bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50"
                >
                  <Download className="w-4 h-4 mr-2" />
                  {exporting ? "Exporting..." : "Export Data"}
                </button>

                <button
                  onClick={handleImportData}
                  disabled={importing}
                  className="btn bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  {importing ? "Importing..." : "Import Data"}
                </button>
              </div>
            </div>

            <div className="border-t border-gray-700 pt-4">
              <p className="text-sm text-gray-400">
                Data includes your jobs, contacts, follow-ups, and templates.
                Export creates a JSON file that can be imported later.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <div className="flex items-center gap-3 mb-4">
            <Database className="w-5 h-5 text-purple-400" />
            <h2 className="text-xl font-bold text-white">Account</h2>
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-300">
                Email
              </label>
              <p className="text-gray-300">{user?.email || "Not signed in"}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300">
                User ID
              </label>
              <p className="text-gray-500 font-mono text-sm">
                {user?.id || "N/A"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

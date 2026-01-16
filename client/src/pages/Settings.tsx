import { useTemplates } from "../hooks/useTemplates";
import { useAuth } from "../contexts/AuthContext";
import { useTheme } from "../contexts/ThemeContext";
import { useState } from "react";
import {
  Settings as SettingsIcon,
  Moon,
  Sun,
  Mail,
  Download,
  Upload,
} from "lucide-react";

export default function Settings() {
  const { user } = useAuth();
  const { theme, setTheme } = useTheme();
  const { templates, saveDefaultsToDatabase } = useTemplates();
  const [exporting, setExporting] = useState(false);
  const [importing, setImporting] = useState(false);

  const handleThemeChange = (newTheme: "dark" | "light") => {
    setTheme(newTheme);
  };

  const handleSaveDefaultTemplates = async () => {
    try {
      await saveDefaultsToDatabase();
      alert("Default templates saved successfully!");
    } catch (e) {
      alert(
        "Failed to save templates: " +
          (e instanceof Error ? e.message : "Unknown error"),
      );
    }
  };

  const handleExportData = async () => {
    setExporting(true);
    try {
      // This would export all user data as JSON
      // For MVP, we'll just show a placeholder
      alert("Export functionality will be implemented in the next version");
    } catch (e) {
      alert("Failed to export data");
    } finally {
      setExporting(false);
    }
  };

  const handleImportData = async () => {
    setImporting(true);
    try {
      // This would import JSON data
      // For MVP, we'll just show a placeholder
      alert("Import functionality will be implemented in the next version");
    } catch (e) {
      alert("Failed to import data");
    } finally {
      setImporting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Settings</h1>
        <p className="text-gray-400">Customize your CandidateOS experience</p>
      </div>

      <div className="space-y-6">
        {/* Theme Settings */}
        <div className="card">
          <div className="flex items-center gap-3 mb-4">
            <SettingsIcon className="w-5 h-5 text-blue-400" />
            <h2 className="text-xl font-bold text-white">Appearance</h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="input-label">Theme</label>
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

        {/* Email Templates */}
        <div className="card">
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
                className="btn btn-primary"
              >
                Save Default Templates
              </button>
            </div>

            <div className="border-t border-gray-700 pt-4">
              <h3 className="text-lg font-semibold text-white mb-3">
                Available Templates
              </h3>
              <div className="space-y-2">
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

        {/* Data Management */}
        <div className="card">
          <div className="flex items-center gap-3 mb-4">
            <Download className="w-5 h-5 text-yellow-400" />
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
                  className="btn btn-primary"
                >
                  <Download className="w-4 h-4 mr-2" />
                  {exporting ? "Exporting..." : "Export Data"}
                </button>

                <button
                  onClick={handleImportData}
                  disabled={importing}
                  className="btn btn-secondary"
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

        {/* Account Information */}
        <div className="card">
          <div className="flex items-center gap-3 mb-4">
            <SettingsIcon className="w-5 h-5 text-purple-400" />
            <h2 className="text-xl font-bold text-white">Account</h2>
          </div>

          <div className="space-y-3">
            <div>
              <label className="input-label">Email</label>
              <p className="text-gray-300">{user?.email}</p>
            </div>

            <div>
              <label className="input-label">User ID</label>
              <p className="text-gray-500 font-mono text-sm">{user?.id}</p>
            </div>

            <div>
              <label className="input-label">Account Created</label>
              <p className="text-gray-400">
                {user?.created_at
                  ? new Date(user.created_at).toLocaleDateString()
                  : "Unknown"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

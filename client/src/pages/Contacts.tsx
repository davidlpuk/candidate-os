import { useContacts } from "../hooks/useContacts";
import { getWarmthScoreColor } from "../lib/formatters";
import { useState } from "react";
import { Edit, Trash2, ExternalLink, UserPlus } from "lucide-react";

export default function Contacts() {
  const { contacts, loading, deleteContact } = useContacts();
  const [searchTerm, setSearchTerm] = useState("");
  const [warmthFilter, setWarmthFilter] = useState<string>("all");

  const filteredContacts = contacts.filter((contact) => {
    const matchesSearch =
      contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.company?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.title?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesWarmth =
      warmthFilter === "all" ||
      (warmthFilter === "high" && contact.warmth_score >= 8) ||
      (warmthFilter === "medium" &&
        contact.warmth_score >= 5 &&
        contact.warmth_score < 8) ||
      (warmthFilter === "low" && contact.warmth_score < 5);

    return matchesSearch && matchesWarmth;
  });

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this contact?")) {
      await deleteContact(id);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-400">Loading contacts...</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Contacts</h1>
        <p className="text-gray-400">
          Manage your network and track relationships
        </p>
      </div>

      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <input
          type="text"
          placeholder="Search contacts..."
          className="input flex-1"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <select
          className="input w-full sm:w-48"
          value={warmthFilter}
          onChange={(e) => setWarmthFilter(e.target.value)}
        >
          <option value="all">All Warmth</option>
          <option value="high">High (8-10)</option>
          <option value="medium">Medium (5-7)</option>
          <option value="low">Low (1-4)</option>
        </select>

        <button className="btn btn-primary whitespace-nowrap">
          <UserPlus className="w-4 h-4 mr-2" />
          Add Contact
        </button>
      </div>

      {filteredContacts.length === 0 ? (
        <div className="card text-center py-12">
          <div className="text-gray-400 mb-4">
            <div className="text-4xl mb-2">👥</div>
            <div className="text-xl">No contacts found</div>
          </div>
          <p className="text-gray-500 mb-6">
            {contacts.length === 0
              ? "Build your network by adding your first contact."
              : "Try adjusting your search or filters."}
          </p>
          <button className="btn btn-primary">Add Your First Contact</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredContacts.map((contact) => (
            <div
              key={contact.id}
              className="card hover:bg-gray-800/50 transition-colors"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-white mb-1">
                    {contact.name}
                  </h3>
                  <div className="text-gray-400 text-sm">
                    {contact.title && <div>{contact.title}</div>}
                    {contact.company && <div>{contact.company}</div>}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${getWarmthScoreColor(contact.warmth_score)} bg-current/10`}
                  >
                    {contact.warmth_score}/10
                  </span>
                  {contact.company_changed && (
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-600 text-white">
                      Moved
                    </span>
                  )}
                </div>
              </div>

              <div className="space-y-2 mb-4">
                {contact.email && (
                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <span>📧</span>
                    <span>{contact.email}</span>
                  </div>
                )}
                {contact.phone && (
                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <span>📱</span>
                    <span>{contact.phone}</span>
                  </div>
                )}
                {contact.linkedin_url && (
                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <span>💼</span>
                    <a
                      href={contact.linkedin_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-400 hover:text-blue-300"
                    >
                      LinkedIn Profile
                    </a>
                  </div>
                )}
              </div>

              {contact.notes && (
                <div className="text-sm text-gray-400 mb-4 line-clamp-2">
                  {contact.notes}
                </div>
              )}

              <div className="flex items-center justify-between">
                <div className="text-xs text-gray-500">
                  Last contact:{" "}
                  {contact.last_contact_date
                    ? new Date(contact.last_contact_date).toLocaleDateString()
                    : "Never"}
                </div>
                <div className="flex items-center gap-1">
                  {contact.linkedin_url && (
                    <button
                      onClick={() =>
                        window.open(contact.linkedin_url, "_blank")
                      }
                      className="p-2 text-gray-400 hover:text-blue-400 transition-colors"
                      title="View LinkedIn profile"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </button>
                  )}
                  <button className="p-2 text-gray-400 hover:text-white transition-colors">
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(contact.id)}
                    className="p-2 text-gray-400 hover:text-red-400 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

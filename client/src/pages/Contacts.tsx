import { useContacts } from "../hooks/useContacts";
import { useState } from "react";
import {
  Edit,
  Trash2,
  ExternalLink,
  UserPlus,
  X,
  Mail,
  Phone,
  Link as LinkIcon,
  Building2,
  Star,
} from "lucide-react";
import type { Contact } from "../types";

export default function Contacts() {
  const { contacts, loading, createContact, deleteContact } = useContacts();
  const [searchTerm, setSearchTerm] = useState("");
  const [warmthFilter, setWarmthFilter] = useState<string>("all");
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    linkedin_url: "",
    title: "",
    last_known_company: "",
    warmth_score: 5,
    notes: "",
  });

  const filteredContacts = contacts.filter((contact: Contact) => {
    const matchesSearch =
      contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (contact.last_known_company
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ??
        false) ||
      (contact.title?.toLowerCase().includes(searchTerm.toLowerCase()) ??
        false);

    const matchesWarmth =
      warmthFilter === "all" ||
      (warmthFilter === "high" && contact.warmth_score >= 8) ||
      (warmthFilter === "medium" &&
        contact.warmth_score >= 5 &&
        contact.warmth_score < 8) ||
      (warmthFilter === "low" && contact.warmth_score < 5);

    return matchesSearch && matchesWarmth;
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createContact({
        name: formData.name,
        email: formData.email || null,
        phone: formData.phone || null,
        linkedin_url: formData.linkedin_url || null,
        title: formData.title || null,
        last_known_company: formData.last_known_company || null,
        warmth_score: formData.warmth_score,
        notes: formData.notes,
        tags: [],
        company_changed: false,
      });
      setShowForm(false);
      setFormData({
        name: "",
        email: "",
        phone: "",
        linkedin_url: "",
        title: "",
        last_known_company: "",
        warmth_score: 5,
        notes: "",
      });
    } catch (e) {
      alert(
        "Failed to create contact: " +
          (e instanceof Error ? e.message : "Unknown error"),
      );
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this contact?")) {
      await deleteContact(id);
    }
  };

  const getWarmthColor = (score: number) => {
    if (score >= 8) return "text-green-400";
    if (score >= 5) return "text-yellow-400";
    return "text-red-400";
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-400">Loading contacts...</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Contacts</h1>
          <p className="text-gray-400">
            Manage your network and track relationships
          </p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="btn bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
        >
          <UserPlus className="w-5 h-5" />
          Add Contact
        </button>
      </div>

      {showForm && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setShowForm(false)}
        >
          <div
            className="bg-gray-800 rounded-lg p-6 w-full max-w-lg border border-gray-700"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">Add New Contact</h2>
              <button
                onClick={() => setShowForm(false)}
                className="text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Name *
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="Contact name"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="email"
                      className="w-full pl-10 pr-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      placeholder="email@example.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Phone
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      className="w-full pl-10 pr-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                      placeholder="+44..."
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  LinkedIn URL
                </label>
                <div className="relative">
                  <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="url"
                    className="w-full pl-10 pr-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={formData.linkedin_url}
                    onChange={(e) =>
                      setFormData({ ...formData, linkedin_url: e.target.value })
                    }
                    placeholder="https://linkedin.com/in/..."
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Title
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    placeholder="e.g., Senior Recruiter"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Company
                  </label>
                  <div className="relative">
                    <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      className="w-full pl-10 pr-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={formData.last_known_company}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          last_known_company: e.target.value,
                        })
                      }
                      placeholder="e.g., Google"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Warmth Score: {formData.warmth_score}
                </label>
                <div className="flex items-center gap-4">
                  <input
                    type="range"
                    min="1"
                    max="10"
                    className="flex-1 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                    value={formData.warmth_score}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        warmth_score: parseInt(e.target.value),
                      })
                    }
                  />
                  <div
                    className={`flex items-center gap-1 ${getWarmthColor(formData.warmth_score)}`}
                  >
                    <Star className="w-5 h-5 fill-current" />
                    <span className="font-bold">{formData.warmth_score}</span>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Notes
                </label>
                <textarea
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                  value={formData.notes}
                  onChange={(e) =>
                    setFormData({ ...formData, notes: e.target.value })
                  }
                  placeholder="Add any notes about this contact..."
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
                >
                  Add Contact
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <input
          type="text"
          placeholder="Search contacts..."
          className="flex-1 px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <select
          className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={warmthFilter}
          onChange={(e) => setWarmthFilter(e.target.value)}
        >
          <option value="all">All Warmth</option>
          <option value="high">High (8-10)</option>
          <option value="medium">Medium (5-7)</option>
          <option value="low">Low (1-4)</option>
        </select>
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
          <button
            onClick={() => setShowForm(true)}
            className="btn bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            Add Your First Contact
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredContacts.map((contact: Contact) => (
            <div
              key={contact.id}
              className="bg-gray-800 rounded-lg p-6 border border-gray-700 hover:bg-gray-800/50 transition-colors"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-white mb-1">
                    {contact.name}
                  </h3>
                  <div className="text-gray-400 text-sm">
                    {contact.title && <div>{contact.title}</div>}
                    {contact.last_known_company && (
                      <div>{contact.last_known_company}</div>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getWarmthColor(contact.warmth_score)} bg-current/10`}
                  >
                    <Star className="w-3 h-3 fill-current" />
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
                    <Mail className="w-4 h-4" />
                    <span>{contact.email}</span>
                  </div>
                )}
                {contact.phone && (
                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <Phone className="w-4 h-4" />
                    <span>{contact.phone}</span>
                  </div>
                )}
                {contact.linkedin_url && (
                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <LinkIcon className="w-4 h-4" />
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

              <div className="flex items-center justify-between pt-4 border-t border-gray-700">
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
                        contact.linkedin_url &&
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

import { useJobs } from "../hooks/useJobs";
import { useContacts } from "../hooks/useContacts";
import {
  formatDate,
  formatRelativeDate,
  getStatusColor,
  getStatusBgColor,
} from "../lib/formatters";
import { useState } from "react";
import { MoreHorizontal, Edit, Trash2, ExternalLink } from "lucide-react";

export default function Pipeline() {
  const { jobs, loading, deleteJob } = useJobs();
  const { contacts } = useContacts();
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");

  const filteredJobs = jobs.filter((job) => {
    const matchesStatus = statusFilter === "all" || job.status === statusFilter;
    const matchesSearch =
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.company.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const getContactName = (contactId?: string) => {
    if (!contactId) return "No contact";
    const contact = contacts.find((c) => c.id === contactId);
    return contact?.name || "Unknown";
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this job?")) {
      await deleteJob(id);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-400">Loading jobs...</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Pipeline</h1>
        <p className="text-gray-400">Track all your job applications</p>
      </div>

      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <input
          type="text"
          placeholder="Search jobs..."
          className="input flex-1"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <select
          className="input w-full sm:w-48"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="all">All Status</option>
          <option value="wishlist">Wishlist</option>
          <option value="applied">Applied</option>
          <option value="screening">Screening</option>
          <option value="interview">Interview</option>
          <option value="offer">Offer</option>
          <option value="rejected">Rejected</option>
          <option value="withdrawn">Withdrawn</option>
        </select>

        <button className="btn btn-primary whitespace-nowrap">Add Job</button>
      </div>

      {filteredJobs.length === 0 ? (
        <div className="card text-center py-12">
          <div className="text-gray-400 mb-4">
            <div className="text-4xl mb-2">📋</div>
            <div className="text-xl">No jobs found</div>
          </div>
          <p className="text-gray-500 mb-6">
            {jobs.length === 0
              ? "Get started by adding your first job application."
              : "Try adjusting your search or filters."}
          </p>
          <button className="btn btn-primary">Add Your First Job</button>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="text-left py-3 px-4 text-gray-300 font-medium">
                  Job
                </th>
                <th className="text-left py-3 px-4 text-gray-300 font-medium">
                  Company
                </th>
                <th className="text-left py-3 px-4 text-gray-300 font-medium">
                  Status
                </th>
                <th className="text-left py-3 px-4 text-gray-300 font-medium">
                  Applied
                </th>
                <th className="text-left py-3 px-4 text-gray-300 font-medium">
                  Follow-up
                </th>
                <th className="text-left py-3 px-4 text-gray-300 font-medium">
                  Contact
                </th>
                <th className="text-right py-3 px-4 text-gray-300 font-medium">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredJobs.map((job) => (
                <tr
                  key={job.id}
                  className="border-b border-gray-800 hover:bg-gray-800/50"
                >
                  <td className="py-4 px-4">
                    <div>
                      <div className="font-medium text-white">{job.title}</div>
                      {job.location && (
                        <div className="text-sm text-gray-400">
                          {job.location}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="text-gray-300">{job.company}</div>
                  </td>
                  <td className="py-4 px-4">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBgColor(job.status)} ${getStatusColor(job.status)}`}
                    >
                      {job.status}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <div className="text-gray-300">
                      {job.applied_date
                        ? formatDate(job.applied_date)
                        : "Not applied"}
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="text-gray-300">
                      {job.follow_up_date
                        ? formatRelativeDate(job.follow_up_date)
                        : "No follow-up"}
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="text-gray-300">
                      {getContactName(job.contact_id)}
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center justify-end gap-2">
                      {job.url && (
                        <button
                          onClick={() => window.open(job.url, "_blank")}
                          className="p-2 text-gray-400 hover:text-blue-400 transition-colors"
                          title="Open job link"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </button>
                      )}
                      <button className="p-2 text-gray-400 hover:text-white transition-colors">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(job.id)}
                        className="p-2 text-gray-400 hover:text-red-400 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

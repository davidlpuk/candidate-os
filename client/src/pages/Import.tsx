import { parseJobEmail, type ExtractedJob } from "../lib/parsers";
import { useJobs } from "../hooks/useJobs";
import { useState } from "react";

export default function Import() {
  const { createJob } = useJobs();
  const [text, setText] = useState("");
  const [parsed, setParsed] = useState<ExtractedJob | null>(null);
  const [editing, setEditing] = useState<ExtractedJob | null>(null);

  function handleParse() {
    const result = parseJobEmail(text);
    setParsed(result);
    setEditing({ ...result });
  }

  async function handleSave() {
    if (!editing) return;

    try {
      await createJob({
        title: editing.title || "Untitled Position",
        company: editing.company || "Unknown Company",
        location: editing.location,
        url: editing.url,
        status: "wishlist",
        source: "email",
        salary_range: editing.salary_range,
      });

      setText("");
      setParsed(null);
      setEditing(null);
    } catch (e) {
      alert(e instanceof Error ? e.message : "Failed to create job");
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">
          Import Job from Email
        </h1>
        <p className="text-gray-400">
          Paste job description from email to auto-extract details
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label className="input-label" htmlFor="email-text">
              Paste Job Description
            </label>
            <textarea
              id="email-text"
              className="input min-h-[400px] font-mono text-sm"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Paste job description email here..."
            />
          </div>

          <button
            onClick={handleParse}
            className="btn btn-primary w-full"
            disabled={!text}
          >
            Parse & Extract
          </button>
        </div>

        {(parsed || editing) && (
          <div className="card space-y-4">
            <h2 className="text-xl font-bold text-white mb-4">
              Extracted Details
            </h2>

            {editing && (
              <>
                <div>
                  <label className="input-label" htmlFor="title">
                    Job Title
                  </label>
                  <input
                    id="title"
                    type="text"
                    className="input"
                    value={editing.title || ""}
                    onChange={(e) =>
                      setEditing({ ...editing, title: e.target.value })
                    }
                    placeholder="e.g., Senior Product Manager"
                  />
                </div>

                <div>
                  <label className="input-label" htmlFor="company">
                    Company
                  </label>
                  <input
                    id="company"
                    type="text"
                    className="input"
                    value={editing.company || ""}
                    onChange={(e) =>
                      setEditing({ ...editing, company: e.target.value })
                    }
                    placeholder="e.g., Acme Corp"
                  />
                </div>

                <div>
                  <label className="input-label" htmlFor="location">
                    Location
                  </label>
                  <input
                    id="location"
                    type="text"
                    className="input"
                    value={editing.location || ""}
                    onChange={(e) =>
                      setEditing({ ...editing, location: e.target.value })
                    }
                    placeholder="e.g., London or Remote"
                  />
                </div>

                <div>
                  <label className="input-label" htmlFor="salary">
                    Salary Range
                  </label>
                  <input
                    id="salary"
                    type="text"
                    className="input"
                    value={editing.salary_range || ""}
                    onChange={(e) =>
                      setEditing({ ...editing, salary_range: e.target.value })
                    }
                    placeholder="e.g., £80k-£120k"
                  />
                </div>

                <div>
                  <label className="input-label" htmlFor="url">
                    Job URL
                  </label>
                  <input
                    id="url"
                    type="url"
                    className="input"
                    value={editing.url || ""}
                    onChange={(e) =>
                      setEditing({ ...editing, url: e.target.value })
                    }
                    placeholder="https://..."
                  />
                </div>

                <button onClick={handleSave} className="btn btn-primary w-full">
                  Save to Pipeline
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

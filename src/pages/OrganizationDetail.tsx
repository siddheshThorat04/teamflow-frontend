import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { getOrganizationBySlug } from "../api/organizations";
import { getProjectsForOrg, createProject } from "../api/projects";
import type { Organization, Project } from "../types";

export default function OrganizationDetail() {
  const { orgSlug } = useParams<{ orgSlug: string }>();
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newProjectName, setNewProjectName] = useState("");
  const [newProjectKey, setNewProjectKey] = useState("");
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    if (orgSlug) {
      loadData(orgSlug);
    }
  }, [orgSlug]);

  async function loadData(slug: string) {
    try {
      const [orgData, projectsData] = await Promise.all([
        getOrganizationBySlug(slug),
        getProjectsForOrg(slug),
      ]);
      setOrganization(orgData);
      setProjects(projectsData);
    } catch (err) {
      setError("Failed to load organization.");
    } finally {
      setLoading(false);
    }
  }

  async function handleCreateProject(e: React.FormEvent) {
    e.preventDefault();
    if (!orgSlug) return;
    setCreating(true);
    setError(null);

    try {
      const newProject = await createProject(orgSlug, {
        name: newProjectName,
        key: newProjectKey.toUpperCase(),
      });
      setProjects([...projects, newProject]);
      setNewProjectName("");
      setNewProjectKey("");
      setShowCreateForm(false);
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to create project.");
    } finally {
      setCreating(false);
    }
  }

  if (loading) {
    return <div className="min-h-screen bg-slate-900 text-white p-8">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <nav className="border-b border-slate-800 px-6 py-4">
        <Link to="/dashboard" className="text-slate-400 hover:text-white text-sm">
          ← Back to Dashboard
        </Link>
      </nav>

      <main className="max-w-4xl mx-auto px-6 py-10">
        <h1 className="text-3xl font-bold mb-1">{organization?.name}</h1>
        <p className="text-slate-400 mb-8">/{organization?.slug}</p>

        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Projects</h2>
          <button
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded font-medium transition-colors"
          >
            + New Project
          </button>
        </div>

        {error && (
          <div className="bg-red-900/50 border border-red-700 text-red-200 px-4 py-2 rounded mb-4 text-sm">
            {error}
          </div>
        )}

        {showCreateForm && (
          <form
            onSubmit={handleCreateProject}
            className="bg-slate-800 rounded-lg p-4 mb-6 space-y-3"
          >
            <input
              type="text"
              placeholder="Project name"
              value={newProjectName}
              onChange={(e) => setNewProjectName(e.target.value)}
              required
              className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="text"
              placeholder="Project key (e.g. WEB)"
              value={newProjectKey}
              onChange={(e) => setNewProjectKey(e.target.value.toUpperCase())}
              required
              maxLength={10}
              className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              disabled={creating}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 px-4 py-2 rounded font-medium transition-colors"
            >
              {creating ? "Creating..." : "Create Project"}
            </button>
          </form>
        )}

        {projects.length === 0 ? (
          <p className="text-slate-400">No projects yet. Create one to get started.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {projects.map((project) => (
              <Link
                key={project.id}
                to={`/projects/${project.id}`}
                className="bg-slate-800 hover:bg-slate-750 border border-slate-700 rounded-lg p-5 transition-colors"
              >
                <div className="flex justify-between items-start">
                  <h3 className="font-semibold text-lg">{project.name}</h3>
                  <span className="text-xs bg-slate-700 px-2 py-1 rounded font-mono">
                    {project.key}
                  </span>
                </div>
                {project.description && (
                  <p className="text-slate-400 text-sm mt-2">{project.description}</p>
                )}
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
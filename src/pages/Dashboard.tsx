import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getMyOrganizations, createOrganization } from "../api/organizations";
import { useAuth } from "../context/AuthContext";
import type { Organization } from "../types";

export default function Dashboard() {
  const { userEmail, logout } = useAuth();
  const navigate = useNavigate();
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newOrgName, setNewOrgName] = useState("");
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    loadOrganizations();
  }, []);

  async function loadOrganizations() {
    try {
      const data = await getMyOrganizations();
      setOrganizations(data);
    } catch (err) {
      setError("Failed to load organizations.");
    } finally {
      setLoading(false);
    }
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setCreating(true);
    setError(null);

    try {
      const newOrg = await createOrganization(newOrgName);
      setOrganizations([...organizations, newOrg]);
      setNewOrgName("");
      setShowCreateForm(false);
    } catch (err) {
      setError("Failed to create organization.");
    } finally {
      setCreating(false);
    }
  }

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <nav className="border-b border-slate-800 px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">Teamflow</h1>
        <div className="flex items-center gap-4">
          <span className="text-slate-400 text-sm">{userEmail}</span>
          <button
            onClick={handleLogout}
            className="text-sm text-slate-400 hover:text-white transition-colors"
          >
            Sign out
          </button>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-6 py-10">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold">Your Organizations</h2>
          <button
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded font-medium transition-colors"
          >
            + New Organization
          </button>
        </div>

        {error && (
          <div className="bg-red-900/50 border border-red-700 text-red-200 px-4 py-2 rounded mb-4 text-sm">
            {error}
          </div>
        )}

        {showCreateForm && (
          <form
            onSubmit={handleCreate}
            className="bg-slate-800 rounded-lg p-4 mb-6 flex gap-2"
          >
            <input
              type="text"
              placeholder="Organization name"
              value={newOrgName}
              onChange={(e) => setNewOrgName(e.target.value)}
              required
              className="flex-1 px-3 py-2 bg-slate-700 border border-slate-600 rounded text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              disabled={creating}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 px-4 py-2 rounded font-medium transition-colors"
            >
              {creating ? "Creating..." : "Create"}
            </button>
          </form>
        )}

        {loading ? (
          <p className="text-slate-400">Loading...</p>
        ) : organizations.length === 0 ? (
          <p className="text-slate-400">
            You don't belong to any organizations yet. Create one to get started.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {organizations.map((org) => (
              <Link
                key={org.id}
                to={`/organizations/${org.slug}`}
                className="bg-slate-800 hover:bg-slate-750 border border-slate-700 rounded-lg p-5 transition-colors"
              >
                <h3 className="font-semibold text-lg">{org.name}</h3>
                <p className="text-slate-400 text-sm mt-1">/{org.slug}</p>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
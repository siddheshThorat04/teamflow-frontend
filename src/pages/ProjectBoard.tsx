import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { getTasksForProject, createTask, updateTask } from "../api/tasks";
import TaskCard from "../components/TaskCard";
import type { Task, TaskStatus } from "../types";

const columns: { status: TaskStatus; label: string }[] = [
  { status: "TODO", label: "To Do" },
  { status: "IN_PROGRESS", label: "In Progress" },
  { status: "IN_REVIEW", label: "In Review" },
  { status: "DONE", label: "Done" },
];

export default function ProjectBoard() {
  const { projectId } = useParams<{ projectId: string }>();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [creating, setCreating] = useState(false);

  const numericProjectId = projectId ? parseInt(projectId, 10) : null;

  useEffect(() => {
    if (numericProjectId) {
      loadTasks(numericProjectId);
    }
  }, [numericProjectId]);

  async function loadTasks(pid: number) {
    try {
      const data = await getTasksForProject(pid);
      setTasks(data);
    } catch (err) {
      setError("Failed to load tasks.");
    } finally {
      setLoading(false);
    }
  }

  async function handleCreateTask(e: React.FormEvent) {
    e.preventDefault();
    if (!numericProjectId) return;
    setCreating(true);
    setError(null);

    try {
      const newTask = await createTask(numericProjectId, { title: newTaskTitle });
      setTasks([...tasks, newTask]);
      setNewTaskTitle("");
      setShowCreateForm(false);
    } catch (err) {
      setError("Failed to create task.");
    } finally {
      setCreating(false);
    }
  }

  async function handleStatusChange(task: Task, newStatus: TaskStatus) {
    if (!numericProjectId) return;
    try {
      const updated = await updateTask(numericProjectId, task.id, { status: newStatus });
      setTasks(tasks.map((t) => (t.id === updated.id ? updated : t)));
    } catch (err) {
      setError("Failed to update task.");
    }
  }

  if (loading) {
    return <div className="min-h-screen bg-slate-900 text-white p-8">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <nav className="border-b border-slate-800 px-6 py-4 flex justify-between items-center">
        <Link to="/dashboard" className="text-slate-400 hover:text-white text-sm">
          ← Back to Dashboard
        </Link>
        <button
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded font-medium text-sm transition-colors"
        >
          + New Task
        </button>
      </nav>

      {error && (
        <div className="bg-red-900/50 border border-red-700 text-red-200 px-4 py-2 mx-6 mt-4 rounded text-sm">
          {error}
        </div>
      )}

      {showCreateForm && (
        <form
          onSubmit={handleCreateTask}
          className="bg-slate-800 rounded-lg p-4 mx-6 mt-4 flex gap-2"
        >
          <input
            type="text"
            placeholder="Task title"
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
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

      <main className="p-6 grid grid-cols-1 md:grid-cols-4 gap-4">
        {columns.map((col) => (
          <div key={col.status} className="bg-slate-850 rounded-lg p-3">
            <h3 className="font-semibold text-sm text-slate-300 mb-3 uppercase tracking-wide">
              {col.label} ({tasks.filter((t) => t.status === col.status).length})
            </h3>
            {tasks
              .filter((t) => t.status === col.status)
              .map((task) => (
                <div key={task.id}>
                  <TaskCard task={task} onClick={() => {}} />
                  <select
                    value={task.status}
                    onChange={(e) => handleStatusChange(task, e.target.value as TaskStatus)}
                    className="w-full text-xs bg-slate-700 border border-slate-600 rounded px-2 py-1 mb-3 -mt-2"
                  >
                    {columns.map((c) => (
                      <option key={c.status} value={c.status}>
                        Move to {c.label}
                      </option>
                    ))}
                  </select>
                </div>
              ))}
          </div>
        ))}
      </main>
    </div>
  );
}
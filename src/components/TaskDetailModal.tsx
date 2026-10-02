import { useState } from "react";
import type { Task, TaskStatus, TaskPriority } from "../types";
import { useEffect } from "react";
import { getCommentsForTask, addComment } from "../api/comments";
import type { Comment } from "../api/comments";
interface TaskDetailModalProps {
  task: Task;
  onClose: () => void;
  onUpdate: (taskId: number, updates: { title?: string; description?: string; status?: TaskStatus; priority?: TaskPriority; dueDate?: string }) => Promise<void>;
}

const statusOptions: TaskStatus[] = ["TODO", "IN_PROGRESS", "IN_REVIEW", "DONE"];
const priorityOptions: TaskPriority[] = ["LOW", "MEDIUM", "HIGH", "URGENT"];

export default function TaskDetailModal({ task, onClose, onUpdate }: TaskDetailModalProps) {
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description || "");
  const [status, setStatus] = useState<TaskStatus>(task.status);
  const [priority, setPriority] = useState<TaskPriority>(task.priority);
  const [dueDate, setDueDate] = useState(task.dueDate || "");
  const [saving, setSaving] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [loadingComments, setLoadingComments] = useState(true);
  const [postingComment, setPostingComment] = useState(false);

  useEffect(() => {
    loadComments();
  }, [task.id]);

  async function loadComments() {
    try {
      const data = await getCommentsForTask(task.id);
      setComments(data);
    } finally {
      setLoadingComments(false);
    }
  }

  async function handleAddComment() {
    if (!newComment.trim()) return;
    setPostingComment(true);
    try {
      const comment = await addComment(task.id, newComment);
      setComments([...comments, comment]);
      setNewComment("");
    } finally {
      setPostingComment(false);
    }
  }
  async function handleSave() {
    setSaving(true);
    try {
      await onUpdate(task.id, {
        title,
        description,
        status,
        priority,
        dueDate: dueDate || undefined,
      });
      onClose();
    } finally {
      setSaving(false);
    }
  }

  return (
    <div
      className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-slate-800 rounded-lg shadow-xl w-full max-w-lg p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-start mb-4">
          <span className="text-xs text-slate-500 font-mono">{task.taskKey}</span>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white text-xl leading-none"
          >
            ×
          </button>
        </div>

        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full text-lg font-semibold bg-transparent border-b border-slate-700 focus:border-blue-500 outline-none pb-2 mb-4 text-white"
        />

        <label className="block text-sm text-slate-400 mb-1">Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
          placeholder="Add a description..."
          className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded text-white text-sm mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm text-slate-400 mb-1">Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as TaskStatus)}
              className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded text-white text-sm"
            >
              {statusOptions.map((s) => (
                <option key={s} value={s}>{s.replace("_", " ")}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm text-slate-400 mb-1">Priority</label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value as TaskPriority)}
              className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded text-white text-sm"
            >
              {priorityOptions.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm text-slate-400 mb-1">Due Date</label>
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded text-white text-sm"
          />
        </div>

        <div className="text-xs text-slate-500 mb-4">
          Reported by {task.reporterName}
          {task.assigneeName && ` · Assigned to ${task.assigneeName}`}
        </div>
        <div className="border-t border-slate-700 pt-4 mb-4">
          <h3 className="text-sm font-semibold text-slate-300 mb-3">Comments</h3>

          {loadingComments ? (
            <p className="text-sm text-slate-500">Loading comments...</p>
          ) : comments.length === 0 ? (
            <p className="text-sm text-slate-500 mb-3">No comments yet.</p>
          ) : (
            <div className="space-y-3 mb-3 max-h-48 overflow-y-auto">
              {comments.map((c) => (
                <div key={c.id} className="bg-slate-700/50 rounded p-2">
                  <div className="flex justify-between items-baseline mb-1">
                    <span className="text-xs font-medium text-slate-300">{c.authorName}</span>
                    <span className="text-xs text-slate-500">
                      {new Date(c.createdAt).toLocaleString()}
                    </span>
                  </div>
                  <p className="text-sm text-slate-200">{c.content}</p>
                </div>
              ))}
            </div>
          )}

          <div className="flex gap-2">
            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Add a comment..."
              onKeyDown={(e) => e.key === "Enter" && handleAddComment()}
              className="flex-1 px-3 py-1.5 bg-slate-700 border border-slate-600 rounded text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={handleAddComment}
              disabled={postingComment}
              className="bg-slate-600 hover:bg-slate-500 disabled:bg-slate-700 px-3 py-1.5 rounded text-sm transition-colors"
            >
              Post
            </button>
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 text-slate-300 hover:text-white text-sm transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 px-4 py-2 rounded font-medium text-sm transition-colors"
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}
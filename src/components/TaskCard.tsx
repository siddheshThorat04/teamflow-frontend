import type { Task } from "../types";

const priorityColors: Record<string, string> = {
  LOW: "bg-slate-600",
  MEDIUM: "bg-blue-600",
  HIGH: "bg-orange-600",
  URGENT: "bg-red-600",
};

interface TaskCardProps {
  task: Task;
  onClick: () => void;
}

export default function TaskCard({ task, onClick }: TaskCardProps) {
  return (
    <div
      onClick={onClick}
      className="bg-slate-800 border border-slate-700 rounded-lg p-3 mb-3 cursor-pointer hover:border-slate-500 transition-colors"
    >
      <div className="flex justify-between items-start mb-2">
        <span className="text-xs text-slate-500 font-mono">{task.taskKey}</span>
        <span className={`text-xs text-white px-2 py-0.5 rounded ${priorityColors[task.priority]}`}>
          {task.priority}
        </span>
      </div>
      <p className="text-sm font-medium mb-2">{task.title}</p>
      {task.assigneeName && (
        <p className="text-xs text-slate-400">👤 {task.assigneeName}</p>
      )}
      {task.dueDate && (
        <p className="text-xs text-slate-500 mt-1">Due {task.dueDate}</p>
      )}
    </div>
  );
}
import React from 'react';
import { 
  Calendar, 
  Clock, 
  CheckCircle2, 
  Circle, 
  Edit3, 
  Trash2, 
  AlertTriangle,
  Flame,
  ArrowUpRight
} from 'lucide-react';

export default function TaskCard({ task, onEdit, onDelete, onStatusChange }) {
  const isCompleted = task.status === 'completed';

  // Format Due Date
  const formatDueDate = (dateStr) => {
    if (!dateStr) return null;
    const date = new Date(dateStr);
    const now = new Date();
    const isPast = date < now.setHours(0, 0, 0, 0) && !isCompleted;

    const formatted = date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: date.getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined,
    });

    return { formatted, isPast };
  };

  const dueInfo = formatDueDate(task.dueDate);

  // Format Created At
  const createdDate = new Date(task.createdAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });

  const priorityStyles = {
    low: {
      bg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      dot: 'bg-emerald-500',
      label: 'Low',
    },
    medium: {
      bg: 'bg-amber-50 text-amber-700 border-amber-200',
      dot: 'bg-amber-500',
      label: 'Medium',
    },
    high: {
      bg: 'bg-rose-50 text-rose-700 border-rose-200',
      dot: 'bg-rose-500',
      label: 'High Priority',
    },
  };

  const statusStyles = {
    pending: {
      border: 'border-l-amber-400',
      badge: 'bg-amber-100/70 text-amber-800',
      label: 'Pending',
    },
    in_progress: {
      border: 'border-l-blue-500',
      badge: 'bg-blue-100/70 text-blue-800',
      label: 'In Progress',
    },
    completed: {
      border: 'border-l-emerald-500',
      badge: 'bg-emerald-100/70 text-emerald-800',
      label: 'Completed',
    },
  };

  const currentPriority = priorityStyles[task.priority] || priorityStyles.medium;
  const currentStatus = statusStyles[task.status] || statusStyles.pending;

  const handleToggleComplete = () => {
    const nextStatus = isCompleted ? 'pending' : 'completed';
    onStatusChange(task._id, nextStatus);
  };

  return (
    <div
      className={`group relative bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between overflow-hidden border-l-4 ${currentStatus.border} ${
        isCompleted ? 'bg-slate-50/70' : ''
      }`}
    >
      <div className="p-5">
        {/* Header Row: Priority & Quick Actions */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${currentPriority.bg}`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${currentPriority.dot}`} />
            {currentPriority.label}
          </span>

          <div className="flex items-center gap-1 opacity-90 sm:opacity-0 group-hover:opacity-100 transition-opacity duration-150">
            <button
              onClick={() => onEdit(task)}
              title="Edit task"
              className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-md transition-colors cursor-pointer"
            >
              <Edit3 className="w-4 h-4" />
            </button>
            <button
              onClick={() => onDelete(task)}
              title="Delete task"
              className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors cursor-pointer"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Title and Completion Checkbox */}
        <div className="flex items-start gap-3 mb-2">
          <button
            onClick={handleToggleComplete}
            title={isCompleted ? 'Mark as incomplete' : 'Mark as completed'}
            className="mt-0.5 flex-shrink-0 text-slate-400 hover:text-indigo-600 transition-colors cursor-pointer"
          >
            {isCompleted ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-500 fill-emerald-50" />
            ) : (
              <Circle className="w-5 h-5 text-slate-300 hover:text-indigo-500" />
            )}
          </button>

          <h3
            className={`text-base font-semibold text-slate-900 leading-snug break-words ${
              isCompleted ? 'line-through text-slate-400 font-normal' : ''
            }`}
          >
            {task.title}
          </h3>
        </div>

        {/* Description */}
        {task.description && (
          <p
            className={`text-sm text-slate-600 pl-8 line-clamp-3 leading-relaxed ${
              isCompleted ? 'text-slate-400' : ''
            }`}
          >
            {task.description}
          </p>
        )}
      </div>

      {/* Footer Info Row */}
      <div className="px-5 py-3 bg-slate-50/50 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500">
        <div className="flex items-center gap-3">
          {/* Status Dropdown selector */}
          <select
            value={task.status}
            onChange={(e) => onStatusChange(task._id, e.target.value)}
            className={`font-medium py-1 px-2 rounded-md border text-xs cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500/20 ${
              task.status === 'completed'
                ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                : task.status === 'in_progress'
                ? 'bg-blue-50 border-blue-200 text-blue-700'
                : 'bg-amber-50 border-amber-200 text-amber-700'
            }`}
          >
            <option value="pending">⏳ Pending</option>
            <option value="in_progress">⚡ In Progress</option>
            <option value="completed">✅ Completed</option>
          </select>

          {/* Due date */}
          {dueInfo && (
            <div
              className={`flex items-center gap-1 font-medium ${
                dueInfo.isPast ? 'text-rose-600 font-semibold' : 'text-slate-600'
              }`}
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>{dueInfo.formatted}</span>
              {dueInfo.isPast && (
                <span className="text-[10px] uppercase bg-rose-100 text-rose-700 px-1 rounded font-bold">
                  Overdue
                </span>
              )}
            </div>
          )}
        </div>

        <span className="text-[11px] text-slate-400">Added {createdDate}</span>
      </div>
    </div>
  );
}

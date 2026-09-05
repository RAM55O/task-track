import React from 'react';
import TaskCard from './TaskCard';
import { ClipboardList, PlusCircle } from 'lucide-react';

export default function TaskList({
  tasks,
  loading,
  onEdit,
  onDelete,
  onStatusChange,
  onOpenCreateModal,
  searchQuery,
  statusFilter,
}) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 3, 4, 5, 6].map((n) => (
          <div
            key={n}
            className="bg-white rounded-xl border border-slate-200 p-5 animate-pulse flex flex-col justify-between h-48"
          >
            <div>
              <div className="flex justify-between items-center mb-3">
                <div className="h-5 bg-slate-200 rounded-full w-20"></div>
                <div className="h-5 bg-slate-200 rounded w-10"></div>
              </div>
              <div className="h-5 bg-slate-200 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-slate-200 rounded w-full mb-1"></div>
              <div className="h-3 bg-slate-200 rounded w-2/3"></div>
            </div>
            <div className="h-8 bg-slate-100 rounded mt-4"></div>
          </div>
        ))}
      </div>
    );
  }

  if (tasks.length === 0) {
    const isFiltered = searchQuery || (statusFilter && statusFilter !== 'all');
    return (
      <div className="text-center py-16 px-4 bg-white rounded-2xl border border-slate-200 shadow-xs my-6">
        <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <ClipboardList className="w-8 h-8" />
        </div>
        <h3 className="text-lg font-bold text-slate-800 mb-1">
          {isFiltered ? 'No matching tasks found' : 'No tasks created yet'}
        </h3>
        <p className="text-sm text-slate-500 max-w-md mx-auto mb-6">
          {isFiltered
            ? 'Try changing your search terms or filter settings to see other tasks.'
            : 'Get started by creating your very first task to stay organized and productive.'}
        </p>
        {!isFiltered && (
          <button
            onClick={onOpenCreateModal}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-lg shadow-sm hover:shadow-indigo-500/20 transition-all cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Create First Task</span>
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
      {tasks.map((task) => (
        <TaskCard
          key={task._id}
          task={task}
          onEdit={onEdit}
          onDelete={onDelete}
          onStatusChange={onStatusChange}
        />
      ))}
    </div>
  );
}

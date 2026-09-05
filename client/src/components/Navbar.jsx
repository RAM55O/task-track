import React from 'react';
import { CheckSquare, Plus, Clock, CheckCircle2, AlertCircle } from 'lucide-react';

export default function Navbar({ stats, onOpenCreateModal }) {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo & Name */}
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-tr from-indigo-600 to-violet-600 p-2.5 rounded-xl text-white shadow-md shadow-indigo-100 flex items-center justify-center">
              <CheckSquare className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold bg-gradient-to-r from-slate-900 via-indigo-950 to-indigo-800 bg-clip-text text-transparent">
                  TaskTrack
                </h1>
                <span className="text-[10px] font-semibold tracking-wide uppercase px-2 py-0.5 bg-indigo-50 text-indigo-600 rounded-full border border-indigo-200/60">
                  MERN
                </span>
              </div>
              <p className="text-xs text-slate-500 hidden sm:block">Full-Stack Task Manager</p>
            </div>
          </div>

          {/* Quick Stats Pill */}
          {stats && (
            <div className="hidden md:flex items-center gap-4 text-xs font-medium text-slate-600 bg-slate-50 py-1.5 px-4 rounded-full border border-slate-200">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-slate-400"></span>
                <span>Total: <strong className="text-slate-800">{stats.total || 0}</strong></span>
              </div>
              <span className="text-slate-300">|</span>
              <div className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-amber-500" />
                <span>Pending: <strong className="text-amber-700">{stats.pending || 0}</strong></span>
              </div>
              <span className="text-slate-300">|</span>
              <div className="flex items-center gap-1.5">
                <AlertCircle className="w-3.5 h-3.5 text-blue-500" />
                <span>In Progress: <strong className="text-blue-700">{stats.inProgress || 0}</strong></span>
              </div>
              <span className="text-slate-300">|</span>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                <span>Done: <strong className="text-emerald-700">{stats.completed || 0}</strong></span>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center space-x-3">
            <button
              onClick={onOpenCreateModal}
              className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98] text-white text-sm font-semibold rounded-lg shadow-sm hover:shadow-indigo-500/20 transition duration-150 ease-in-out cursor-pointer"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>Add Task</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}

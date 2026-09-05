import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export default function Toast({ message, type = 'success', onClose }) {
  if (!message) return null;

  const isSuccess = type === 'success';
  const isError = type === 'error';

  return (
    <div className="fixed bottom-5 right-5 z-50 flex items-center gap-3 px-4 py-3 bg-slate-900 text-white rounded-xl shadow-xl border border-slate-800 animate-fade-in text-sm">
      {isSuccess && <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />}
      {isError && <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />}
      {!isSuccess && !isError && <Info className="w-4 h-4 text-indigo-400 flex-shrink-0" />}

      <span className="font-medium text-slate-100">{message}</span>

      <button
        onClick={onClose}
        className="text-slate-400 hover:text-white transition-colors ml-2 cursor-pointer"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}

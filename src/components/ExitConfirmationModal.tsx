import React, { useEffect } from 'react';
import { LogOut, ShieldCheck, X } from 'lucide-react';

export interface ExitConfirmationModalProps {
  isOpen: boolean;
  onStay: () => void;
  onExit: () => void;
  isDarkMode?: boolean;
}

export const ExitConfirmationModal: React.FC<ExitConfirmationModalProps> = ({
  isOpen,
  onStay,
  onExit,
}) => {
  // Close on Escape key press
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onStay();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onStay]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 bg-neutral-950/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 transition-opacity duration-200"
      onClick={onStay}
      role="dialog"
      aria-modal="true"
      aria-labelledby="exit-modal-title"
    >
      <div
        className="w-full sm:max-w-md bg-white dark:bg-neutral-900 rounded-t-3xl sm:rounded-2xl p-6 sm:p-7 border border-neutral-200 dark:border-neutral-800 shadow-2xl space-y-5 pb-[max(1.75rem,calc(env(safe-area-inset-bottom,0px)+1rem))] sm:pb-7 transition-all duration-200 transform"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Mobile Drag Indicator Bar */}
        <div className="w-12 h-1 bg-neutral-300 dark:bg-neutral-700 rounded-full mx-auto sm:hidden -mt-1 mb-3" />

        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 flex items-center justify-center shrink-0 text-blue-600 dark:text-blue-400">
              <LogOut className="w-5 h-5" />
            </div>
            <div>
              <h3 id="exit-modal-title" className="text-lg font-bold text-neutral-950 dark:text-white tracking-tight">
                Leave JobFit Studio?
              </h3>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                You pressed back from the home screen
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onStay}
            className="w-9 h-9 rounded-xl flex items-center justify-center text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
            aria-label="Close dialog"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Informative Vault Safety Card */}
        <div className="p-3.5 rounded-xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200/80 dark:border-neutral-700/60 flex items-start gap-3">
          <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
          <p className="text-xs text-neutral-600 dark:text-neutral-300 leading-relaxed">
            Your resume files, skills, and progress are saved in your local browser vault and will be ready when you return.
          </p>
        </div>

        {/* Action Button Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
          <button
            type="button"
            onClick={onStay}
            className="w-full min-h-[48px] px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold transition-all cursor-pointer shadow-xs active:scale-98 flex items-center justify-center"
          >
            Stay on Page
          </button>

          <button
            type="button"
            onClick={onExit}
            className="w-full min-h-[48px] px-4 py-3 bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-300 rounded-xl text-sm font-semibold transition-all cursor-pointer active:scale-98 flex items-center justify-center"
          >
            Exit Website
          </button>
        </div>
      </div>
    </div>
  );
};

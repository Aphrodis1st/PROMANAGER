import React from 'react';
import { X, Save, Loader2 } from 'lucide-react';

/** Shared input/select styles for all NGO modals */
export const NGO_INPUT_CLASS =
  'w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-600 transition-all duration-200';

export function NGOFormGrid({ children }) {
  return <div className="grid grid-cols-1 md:grid-cols-2 gap-5">{children}</div>;
}

export function NGOFormField({ label, required = false, colSpan = 1, hint, children }) {
  return (
    <div className={colSpan === 2 ? 'md:col-span-2' : undefined}>
      <label className="block text-sm font-semibold text-gray-700 mb-2">
        {label}
        {required ? ' *' : ''}
      </label>
      {children}
      {hint ? <p className="mt-1.5 text-xs text-gray-500">{hint}</p> : null}
    </div>
  );
}

/**
 * Standard NGO modal shell — matches Organizations page design.
 * Use across all /ngo pages for consistent add / edit / view dialogs.
 */
export default function NGOModal({
  open,
  onClose,
  mode = 'add',
  title,
  subtitle,
  children,
  onSave,
  saving = false,
  saveLabel = 'Save',
  maxWidth = '3xl'
}) {
  if (!open) return null;

  const maxWidthClass = maxWidth === '4xl' ? 'max-w-4xl' : 'max-w-3xl';
  const isView = mode === 'view';

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn"
      role="dialog"
      aria-modal="true"
      aria-labelledby="ngo-modal-title"
    >
      <div
        className={`bg-white rounded-2xl ${maxWidthClass} w-full max-h-[90vh] overflow-hidden shadow-2xl animate-slideUp flex flex-col`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="shrink-0 bg-linear-to-r from-blue-600 to-blue-700 px-6 py-5 flex justify-between items-center">
          <div>
            <h2 id="ngo-modal-title" className="text-xl font-bold text-white">
              {title}
            </h2>
            {subtitle ? <p className="text-blue-100 text-sm mt-1">{subtitle}</p> : null}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-lg transition-all duration-200"
            aria-label="Close"
          >
            <X size={22} className="text-white" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">{children}</div>

        {/* Footer */}
        {!isView ? (
          <div className="shrink-0 bg-white px-6 py-4 flex justify-end gap-3 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-all duration-200 font-medium text-gray-700"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={onSave}
              disabled={saving}
              className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed font-medium shadow-md"
            >
              {saving ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Save size={18} />
                  <span>{saveLabel}</span>
                </>
              )}
            </button>
          </div>
        ) : (
          <div className="shrink-0 bg-white px-6 py-4 flex justify-end border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-all duration-200 font-medium"
            >
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

/** Build title/subtitle from entity name and mode */
export function ngoModalCopy(entityLabel, mode) {
  const labels = {
    add: { title: `Add New ${entityLabel}`, subtitle: `Create a new ${entityLabel.toLowerCase()} record` },
    edit: { title: `Edit ${entityLabel}`, subtitle: `Update ${entityLabel.toLowerCase()} information` },
    view: { title: `${entityLabel} Details`, subtitle: `View ${entityLabel.toLowerCase()} information` }
  };
  return labels[mode] || labels.view;
}

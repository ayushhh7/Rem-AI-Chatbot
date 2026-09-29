import React, { useState } from 'react';

/**
 * Array of available AI models
 * Stored in a simple JavaScript array as required
 */
export const AVAILABLE_MODELS = [
  { id: 'openai/gpt-oss-120b', label: 'GPT-OSS 120B' },
  { id: 'openai/gpt-oss-20b', label: 'GPT-OSS 20B' },
];

/**
 * ModelSelector Component
 * Compact dropdown selector for choosing between AI models
 * Uses simple useState and array mapping within syllabus concepts
 */
export default function ModelSelector({ currentModel, onSelectModel }) {
  // Local state to toggle dropdown
  const [isOpen, setIsOpen] = useState(false);

  // Find the label for the currently selected model
  const activeModelObj = AVAILABLE_MODELS.find((m) => m.id === currentModel) || AVAILABLE_MODELS[0];

  const handleSelect = (modelId) => {
    onSelectModel(modelId);
    setIsOpen(false);
  };

  return (
    <div className="relative inline-block text-left">
      {/* Selector Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/90 border border-slate-200/90 text-slate-700 text-xs font-medium hover:bg-white hover:border-slate-300 transition-all shadow-2xs cursor-pointer active:scale-95"
        title="Select AI Model"
      >
        <span className="material-symbols-outlined text-indigo-500 text-sm">
          neurology
        </span>
        <span className="font-mono text-[11px]">{activeModelObj.label}</span>
        <span className="material-symbols-outlined text-slate-400 text-sm">
          {isOpen ? 'expand_less' : 'expand_more'}
        </span>
      </button>

      {/* Dropdown Options */}
      {isOpen && (
        <>
          {/* Backdrop to close when clicking outside */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          ></div>

          {/* Menu Container */}
          <div className="absolute left-0 mt-1.5 w-44 rounded-xl bg-white/95 backdrop-blur-md border border-slate-200 shadow-lg py-1.5 z-50 text-xs animate-in fade-in zoom-in-95 duration-100">
            <div className="px-3 py-1 text-[10px] font-mono uppercase tracking-wider text-slate-400 font-semibold">
              Select Model
            </div>
            {AVAILABLE_MODELS.map((model) => {
              const isSelected = currentModel === model.id;
              return (
                <button
                  key={model.id}
                  type="button"
                  onClick={() => handleSelect(model.id)}
                  className={`w-full text-left px-3 py-2 flex items-center justify-between transition-colors cursor-pointer ${
                    isSelected
                      ? 'bg-indigo-50/80 text-indigo-700 font-medium'
                      : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex flex-col">
                    <span className="font-medium text-xs">{model.label}</span>
                    <span className="font-mono text-[10px] text-slate-400">
                      {model.id}
                    </span>
                  </div>
                  {isSelected && (
                    <span className="material-symbols-outlined text-indigo-600 text-sm">
                      check
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}

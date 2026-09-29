import React, { useState } from 'react';

/**
 * ModeSelector Component
 * Allows the user to switch between 4 AI conversation modes:
 * - Normal (default)
 * - Friendly
 * - Tutor
 * - Research
 */
export default function ModeSelector({ currentMode, onSelectMode }) {
  // Local state to toggle the dropdown menu open/closed
  const [isOpen, setIsOpen] = useState(false);

  // Available chat modes as specified in requirements
  const modes = [
    { id: 'Normal', label: 'Normal', icon: 'chat_bubble_outline', desc: 'Direct & balanced' },
    { id: 'Friendly', label: 'Friendly', icon: 'sentiment_satisfied', desc: 'Warm & casual' },
    { id: 'Tutor', label: 'Tutor', icon: 'school', desc: 'Step-by-step guidance' },
    { id: 'Research', label: 'Research', icon: 'psychology', desc: 'Deep analytical focus' },
  ];

  // Handler when a mode is clicked
  const handleModeClick = (modeId) => {
    onSelectMode(modeId);
    setIsOpen(false);
  };

  return (
    <div className="relative inline-block text-left">
      {/* Dropdown Toggle Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/90 border border-slate-200/90 text-slate-700 text-xs font-medium hover:bg-white hover:border-slate-300 transition-all shadow-2xs cursor-pointer active:scale-95"
      >
        <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
        <span>{currentMode}</span>
        <span className="material-symbols-outlined text-slate-400 text-sm">
          {isOpen ? 'expand_less' : 'expand_more'}
        </span>
      </button>

      {/* Dropdown Menu Modal */}
      {isOpen && (
        <>
          {/* Backdrop to close when clicking outside */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          ></div>

          {/* Menu Items Container */}
          <div className="absolute left-0 mt-1.5 w-44 rounded-xl bg-white/95 backdrop-blur-md border border-slate-200 shadow-lg py-1.5 z-50 text-xs animate-in fade-in zoom-in-95 duration-100">
            <div className="px-3 py-1 text-[10px] font-mono uppercase tracking-wider text-slate-400 font-semibold">
              Select Mode
            </div>
            {modes.map((mode) => {
              const isSelected = currentMode === mode.id;
              return (
                <button
                  key={mode.id}
                  onClick={() => handleModeClick(mode.id)}
                  className={`w-full text-left px-3 py-2 flex items-center justify-between transition-colors ${
                    isSelected
                      ? 'bg-indigo-50/80 text-indigo-700 font-medium'
                      : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span
                      className={`material-symbols-outlined text-sm ${
                        isSelected ? 'text-indigo-600' : 'text-slate-400'
                      }`}
                    >
                      {mode.icon}
                    </span>
                    <div>
                      <div className="font-medium leading-none">{mode.label}</div>
                      <div className="text-[10px] text-slate-400 mt-0.5 leading-none">
                        {mode.desc}
                      </div>
                    </div>
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

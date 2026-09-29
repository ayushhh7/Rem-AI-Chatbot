import React, { useState } from 'react';

/**
 * ChatInput Component
 * Provides clean input field for user prompts with:
 * - Enter key to send (Shift+Enter for multi-line)
 * - Send button with visual feedback
 * - Attachment and voice placeholder icons matching reference design
 */
export default function ChatInput({ onSendMessage, disabled }) {
  // Input text state
  const [inputText, setInputText] = useState('');

  // Handle form submission / send message
  const handleSend = () => {
    // Trim whitespace to prevent sending empty messages
    const trimmed = inputText.trim();
    if (trimmed && !disabled) {
      onSendMessage(trimmed);
      setInputText(''); // Reset textarea
    }
  };

  // Handle keyboard shortcuts (Enter to send, Shift+Enter for new line)
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault(); // Prevent default newline insertion
      handleSend();
    }
  };

  return (
    <div className="w-full">
      {/* Floating Frosted Glass Input Container */}
      <div className="relative bg-white/85 backdrop-blur-md border border-white/90 rounded-2xl shadow-[0_4px_20px_-2px_rgba(148,163,184,0.15)] p-3 focus-within:border-indigo-300 focus-within:ring-2 focus-within:ring-indigo-100 transition-all duration-200">
        {/* Multiline Textarea */}
        <textarea
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask anything..."
          rows={2}
          disabled={disabled}
          className="w-full bg-transparent text-slate-800 placeholder-slate-400 text-sm resize-none border-0 focus:ring-0 p-1.5 focus:outline-none custom-scroll"
        />

        {/* Input Action Bar Bottom */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-100/80 mt-1">
          {/* Left tools: Attachment & Code */}
          <div className="flex items-center gap-1 text-slate-400">
            <button
              type="button"
              className="p-1.5 hover:text-slate-700 rounded-lg hover:bg-slate-100/70 transition-colors cursor-pointer"
              title="Attach file"
              onClick={() => alert("File attachment will be available with the backend integration.")}
            >
              <span className="material-symbols-outlined text-xl">attach_file</span>
            </button>
            <button
              type="button"
              className="p-1.5 hover:text-slate-700 rounded-lg hover:bg-slate-100/70 transition-colors cursor-pointer"
              title="Insert code block"
              onClick={() => setInputText((prev) => prev + "```\n\n```")}
            >
              <span className="material-symbols-outlined text-xl">code</span>
            </button>
          </div>

          {/* Right controls: Dictation + Send Button */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100/70 transition-colors cursor-pointer"
              title="Voice dictation"
            >
              <span className="material-symbols-outlined text-xl">mic</span>
            </button>
            <button
              type="button"
              onClick={handleSend}
              disabled={disabled || !inputText.trim()}
              title="Send message"
              className={`p-2 rounded-xl transition-all duration-150 flex items-center justify-center cursor-pointer ${
                inputText.trim() && !disabled
                  ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm shadow-indigo-200 active:scale-95'
                  : 'bg-slate-100 text-slate-300 cursor-not-allowed'
              }`}
            >
              <span className="material-symbols-outlined text-lg leading-none">
                arrow_upward
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Subtle safety disclaimer matching the reference design */}
      <div className="text-center text-[11px] text-slate-400 px-1 mt-2.5">
        Rem can make mistakes. Verify important information.
      </div>
    </div>
  );
}

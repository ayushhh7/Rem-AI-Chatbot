import React, { useState } from 'react';
import logoImg from '../assets/logo.jpeg';

/**
 * Helper function to render text and code blocks cleanly
 * Uses simple string methods and array mapping within syllabus
 */
function renderMessageContent(text, handleCopy, copied) {
  if (!text) return null;

  // If no markdown code block is present, render with clean whitespace formatting
  if (!text.includes('```')) {
    return (
      <div className="whitespace-pre-wrap leading-relaxed text-[14px] text-slate-800 break-words">
        {text}
      </div>
    );
  }

  // Split by markdown code fences
  const segments = text.split(/(```[\s\S]*?```)/g);

  return (
    <div className="space-y-3 w-full">
      {segments.map((segment, index) => {
        if (segment.startsWith('```') && segment.endsWith('```')) {
          const content = segment.slice(3, -3).trim();
          const lines = content.split('\n');
          const firstLine = lines[0].trim();
          const isLangHeader = /^[a-zA-Z0-9_-]+$/.test(firstLine);
          const lang = isLangHeader ? firstLine : '';
          const codeBody = isLangHeader ? lines.slice(1).join('\n') : content;

          return (
            <div
              key={index}
              className="w-full rounded-xl overflow-hidden border border-slate-800/10 bg-[#1e2433] my-2 text-slate-100 shadow-md"
            >
              <div className="flex items-center justify-between px-3.5 py-1.5 bg-[#171b26] border-b border-slate-700/60 text-xs">
                <span className="font-mono text-[11px] text-slate-400">
                  {lang || 'code'}
                </span>
                <button
                  type="button"
                  onClick={() => handleCopy(codeBody)}
                  className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-white transition-colors cursor-pointer"
                >
                  <span className="material-symbols-outlined text-xs">
                    {copied ? 'check' : 'content_copy'}
                  </span>
                  <span>{copied ? 'Copied' : 'Copy code'}</span>
                </button>
              </div>
              <pre className="p-3.5 font-mono text-[13px] leading-relaxed overflow-x-auto custom-scroll text-slate-200">
                <code>{codeBody}</code>
              </pre>
            </div>
          );
        }

        return (
          <div
            key={index}
            className="whitespace-pre-wrap leading-relaxed text-[14px] text-slate-800 break-words"
          >
            {segment}
          </div>
        );
      })}
    </div>
  );
}

/**
 * ChatMessage Component
 * Displays a single chat message (either from the user or Rem)
 */
export default function ChatMessage({ message, onRegenerate }) {
  const isUser = message.sender === 'user';
  const [copied, setCopied] = useState(false);
  const [liked, setLiked] = useState(null); // 'like', 'dislike', or null

  // Helper to copy content to clipboard
  const handleCopy = (content) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Helper to get friendly model label
  const getModelLabel = () => {
    if (!message.model) return null;
    if (message.model.includes('120b')) return 'GPT-OSS 120B';
    if (message.model.includes('20b')) return 'GPT-OSS 20B';
    return message.model;
  };

  // ----------------------------------------------------
  // USER MESSAGE VIEW
  // ----------------------------------------------------
  if (isUser) {
    return (
      <div className="flex flex-col items-end gap-1.5 self-end max-w-2xl w-full group animate-in fade-in slide-in-from-bottom-2 duration-200">
        {/* User Info Header: Neutral User / Student */}
        <div className="flex items-center gap-2 mb-0.5">
          <span className="text-[11px] text-slate-400">
            {message.timestamp || 'Just now'}
          </span>
          <span className="text-[12px] font-medium text-slate-700">User</span>
          <div className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 text-[10px] font-semibold flex items-center justify-center border border-indigo-200 shadow-2xs">
            U
          </div>
        </div>

        {/* Message Bubble */}
        <div className="p-4 rounded-2xl rounded-tr-sm bg-white/90 backdrop-blur-md border border-slate-200/80 text-slate-800 text-[14px] leading-relaxed shadow-[0_2px_12px_rgba(148,163,184,0.08)]">
          {message.text}
        </div>
      </div>
    );
  }

  // ----------------------------------------------------
  // REM ASSISTANT MESSAGE VIEW
  // ----------------------------------------------------
  const modelLabel = getModelLabel();

  return (
    <div className="flex flex-col items-start gap-2.5 self-start w-full group animate-in fade-in slide-in-from-bottom-2 duration-200">
      {/* Rem Header Bar: Minimal, no 'Verified Explanation' badge */}
      <div className="flex items-center gap-2">
        <div className="w-7 h-7 shrink-0 flex items-center justify-center bg-transparent rounded-xl overflow-hidden">
          <img
            src={logoImg}
            alt="Rem"
            className="w-full h-full object-contain rounded-xl"
          />
        </div>
        <span className="text-[13px] font-semibold text-indigo-700">
          Rem{modelLabel ? ` · ${modelLabel}` : ''}
        </span>
        <span className="text-[11px] text-slate-400">
          {message.timestamp || 'Just now'}
        </span>
      </div>

      {/* Main Message Content */}
      <div className="w-full max-w-3xl pl-9">
        {renderMessageContent(message.text, handleCopy, copied)}

        {/* Optional Secondary Detail text */}
        {message.secondaryText && (
          <div className="mt-2.5">
            {renderMessageContent(message.secondaryText, handleCopy, copied)}
          </div>
        )}

        {/* Action Buttons Toolbar at bottom of Rem message: Subtle & Clean */}
        <div className="flex items-center gap-2 pt-2 text-slate-400 text-xs">
          <button
            type="button"
            onClick={() => handleCopy(message.text)}
            className="p-1 rounded hover:text-slate-600 transition-colors flex items-center gap-1 cursor-pointer"
            title="Copy message"
          >
            <span className="material-symbols-outlined text-sm">
              {copied ? 'check' : 'content_copy'}
            </span>
            <span className="text-[11px]">{copied ? 'Copied' : 'Copy'}</span>
          </button>

          {onRegenerate && (
            <button
              type="button"
              onClick={onRegenerate}
              className="p-1 rounded hover:text-slate-600 transition-colors flex items-center gap-1 cursor-pointer"
              title="Regenerate response"
            >
              <span className="material-symbols-outlined text-sm">replay</span>
              <span className="text-[11px]">Regenerate</span>
            </button>
          )}

          <div className="h-3 w-px bg-slate-200/80 mx-0.5"></div>

          <button
            type="button"
            onClick={() => setLiked(liked === 'like' ? null : 'like')}
            className={`p-1 rounded transition-colors cursor-pointer ${
              liked === 'like'
                ? 'text-indigo-600 bg-indigo-50'
                : 'hover:text-slate-600'
            }`}
            title="Helpful"
          >
            <span className="material-symbols-outlined text-sm">thumb_up</span>
          </button>

          <button
            type="button"
            onClick={() => setLiked(liked === 'dislike' ? null : 'dislike')}
            className={`p-1 rounded transition-colors cursor-pointer ${
              liked === 'dislike'
                ? 'text-rose-600 bg-rose-50'
                : 'hover:text-slate-600'
            }`}
            title="Not helpful"
          >
            <span className="material-symbols-outlined text-sm">thumb_down</span>
          </button>
        </div>
      </div>
    </div>
  );
}

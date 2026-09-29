import React, { useRef, useEffect } from 'react';
import ModeSelector from './ModeSelector.jsx';
import ModelSelector from './ModelSelector.jsx';
import ChatMessage from './ChatMessage.jsx';
import ChatInput from './ChatInput.jsx';
import logoImg from '../assets/logo.jpeg';

/**
 * ChatWindow Component
 * Main viewport containing:
 * - Top header with conversation title, mode selector, model selector, and actions
 * - Message feed or minimal welcome greeting
 * - Prompt starter chips
 * - Bottom floating input dock
 */
export default function ChatWindow({
  activeChat,
  currentMode,
  onSelectMode,
  currentModel,
  onSelectModel,
  messages,
  isTyping,
  onSendMessage,
  onToggleSidebar,
}) {
  // Reference to auto-scroll chat to the latest message
  const messagesEndRef = useRef(null);

  // Auto-scroll when messages update or typing state changes (demonstrating React useEffect)
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping]);

  return (
    <div className="flex-1 flex flex-col h-screen overflow-hidden relative lg:ml-[260px]">
      {/* ----------------------------------------------------
          TOP BAR HEADER
          ---------------------------------------------------- */}
      <header className="h-14 z-30 bg-white/70 backdrop-blur-xl border-b border-slate-200/70 flex justify-between items-center px-4 md:px-6 shadow-2xs shrink-0">
        {/* Left: Mobile Menu Toggle + Context & Mode Selector */}
        <div className="flex items-center gap-3">
          {/* Hamburger button for mobile devices */}
          <button
            type="button"
            onClick={onToggleSidebar}
            className="lg:hidden text-slate-500 hover:text-slate-800 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
            title="Toggle Menu"
          >
            <span className="material-symbols-outlined text-xl">menu</span>
          </button>

          {/* Active Conversation Indicator */}
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></span>
            <span className="text-xs font-semibold text-slate-800 truncate max-w-[140px] sm:max-w-xs md:max-w-md">
              {activeChat ? activeChat.title : 'New Conversation'}
            </span>
          </div>

          <div className="h-3.5 w-px bg-slate-200"></div>

          {/* Compact Mode Selector Dropdown */}
          <ModeSelector
            currentMode={currentMode}
            onSelectMode={onSelectMode}
          />

          {/* Model Selector Dropdown */}
          <ModelSelector
            currentModel={currentModel}
            onSelectModel={onSelectModel}
          />
        </div>

        {/* Right: Quick Action Buttons */}
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => alert("Share link copied to clipboard!")}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/80 hover:bg-white text-slate-700 text-xs font-medium border border-slate-200/90 shadow-2xs hover:shadow-xs transition-all cursor-pointer active:scale-95"
          >
            <span className="material-symbols-outlined text-sm text-indigo-600">
              share
            </span>
            <span className="hidden sm:inline">Share</span>
          </button>

          <button
            type="button"
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-white/80 transition-colors cursor-pointer active:scale-95"
            title="Bookmarks"
          >
            <span className="material-symbols-outlined text-base">bookmark</span>
          </button>

          <button
            type="button"
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-white/80 transition-colors cursor-pointer active:scale-95"
            title="More options"
          >
            <span className="material-symbols-outlined text-base">more_vert</span>
          </button>
        </div>
      </header>

      {/* ----------------------------------------------------
          MAIN CHAT STREAM / FEED
          ---------------------------------------------------- */}
      <main className="flex-1 overflow-y-auto custom-scroll flex flex-col justify-between">
        {messages.length === 0 ? (
          /* EMPTY STATE: Minimal Welcome Greeting matching reference */
          <div className="max-w-2xl w-full mx-auto flex flex-col items-center justify-center text-center px-4 my-auto pt-10 pb-6 animate-in fade-in duration-300">
            <div className="w-16 h-16 mb-4 flex items-center justify-center bg-transparent rounded-2xl overflow-hidden">
              <img
                src={logoImg}
                alt="Rem"
                className="w-full h-full object-contain rounded-2xl"
              />
            </div>
            <h1 className="text-3xl font-semibold text-slate-800 tracking-tight">
              Hi there 👋
            </h1>
            <p className="text-base sm:text-lg text-slate-500 mt-2 font-normal">
              How can I help you today?
            </p>
          </div>
        ) : (
          /* ACTIVE MESSAGES STREAM */
          <div className="max-w-3xl w-full mx-auto px-4 md:px-6 py-6 space-y-6">
            {messages.map((msg) => (
              <ChatMessage
                key={msg.id}
                message={msg}
                onRegenerate={() => onSendMessage(msg.text, true)}
              />
            ))}

            {/* Rem Thinking / Typing State Indicator */}
            {isTyping && (
              <div className="flex items-center gap-2 self-start py-2 px-3 rounded-2xl bg-white/80 backdrop-blur-md border border-slate-200/80 shadow-2xs text-xs text-slate-600 animate-in fade-in duration-150">
                <div className="w-5 h-5 shrink-0 flex items-center justify-center bg-transparent rounded-lg overflow-hidden">
                  <img
                    src={logoImg}
                    alt="Rem"
                    className="w-full h-full object-contain rounded-lg"
                  />
                </div>
                <span className="font-medium text-indigo-700">Rem is thinking...</span>
                <div className="flex items-center gap-1 ml-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-dot-1"></span>
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-dot-2"></span>
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-dot-3"></span>
                </div>
              </div>
            )}

            {/* Auto-scroll target */}
            <div ref={messagesEndRef} />
          </div>
        )}

        {/* ----------------------------------------------------
            BOTTOM INPUT DOCK
            ---------------------------------------------------- */}
        <div className="max-w-3xl w-full mx-auto px-4 md:px-6 pb-6 pt-2 shrink-0">
          {/* Large Minimal Chat Input Box */}
          <ChatInput
            onSendMessage={onSendMessage}
            disabled={isTyping}
          />
        </div>
      </main>
    </div>
  );
}

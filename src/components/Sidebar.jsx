import React, { useState } from 'react';
import logoImg from '../assets/logo.jpeg';

/**
 * Sidebar Component
 * Displays the navigation rail with:
 * - Rem Logo & Brand
 * - "+ New Chat" CTA button
 * - Filterable search input
 * - Dynamic list of recent conversations
 * - Theme, Settings, and User Profile card
 */
export default function Sidebar({
  recentChats,
  activeChatId,
  onSelectChat,
  onNewChat,
  isOpenMobile,
  onCloseMobile,
}) {
  // Local state for searching recent chats
  const [searchQuery, setSearchQuery] = useState('');

  // Filter recent chats based on search query (demonstrating Array.prototype.filter)
  const filteredChats = recentChats.filter((chat) =>
    chat.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isOpenMobile && (
        <div
          className="fixed inset-0 bg-slate-900/30 backdrop-blur-xs z-40 lg:hidden"
          onClick={onCloseMobile}
        />
      )}

      {/* Sidebar Rail Container */}
      <aside
        className={`fixed top-0 left-0 h-screen w-[260px] bg-white/80 backdrop-blur-xl border-r border-slate-200/70 flex flex-col justify-between p-3.5 z-50 select-none shadow-[2px_0_16px_rgba(148,163,184,0.06)] transition-transform duration-200 ease-in-out ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Top & Navigation Group */}
        <div className="flex flex-col gap-3.5 overflow-hidden">
          {/* Logo & Brand Header */}
          <div className="flex items-center justify-between px-1 pt-1">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 shrink-0 flex items-center justify-center bg-transparent rounded-xl overflow-hidden">
                <img
                  src={logoImg}
                  alt="Rem"
                  className="w-full h-full object-contain rounded-xl"
                />
              </div>
              <div className="flex flex-col leading-tight">
                <span className="text-[16px] font-bold text-slate-800 tracking-tight">
                  Rem
                </span>
                <span className="text-[11px] text-slate-400 font-medium">
                  AI Assistant
                </span>
              </div>
            </div>

            {/* Mobile Close Button */}
            <button
              onClick={onCloseMobile}
              className="lg:hidden text-slate-400 hover:text-slate-600 p-1 rounded-lg"
            >
              <span className="material-symbols-outlined text-xl">close</span>
            </button>
          </div>

          {/* Action Button: + New Chat */}
          <button
            type="button"
            onClick={() => {
              onNewChat();
              if (isOpenMobile) onCloseMobile();
            }}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white text-[13px] font-medium shadow-[0_4px_16px_rgba(99,102,241,0.25)] hover:shadow-[0_6px_20px_rgba(99,102,241,0.35)] cursor-pointer active:scale-[0.99] transition-all duration-150 border-t border-white/25"
          >
            <span className="material-symbols-outlined text-[18px]">add</span>
            <span>+ New Chat</span>
          </button>

          {/* Quick Search Bar with keyboard shortcut badge */}
          <div className="relative flex items-center">
            <span className="material-symbols-outlined absolute left-2.5 text-slate-400 text-[16px] pointer-events-none">
              search
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search chats..."
              className="w-full bg-slate-100/70 border border-slate-200/80 rounded-xl pl-8 pr-12 py-1.5 text-[12px] text-slate-700 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all"
            />
            <span className="absolute right-2 px-1.5 py-0.5 rounded-md bg-white border border-slate-200 text-slate-400 text-[10px] font-mono shadow-2xs">
              ⌘K
            </span>
          </div>

          {/* Section Header: Recent Chats */}
          <div className="flex items-center justify-between px-1 pt-1">
            <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-medium">
              Recent Chats
            </span>
            <span className="material-symbols-outlined text-slate-400 text-base">
              unfold_more
            </span>
          </div>

          {/* Dynamic Recent Chats List */}
          <nav className="flex flex-col gap-0.5 overflow-y-auto max-h-[calc(100vh-340px)] custom-scroll pr-1">
            {filteredChats.length === 0 ? (
              <div className="text-center py-4 text-xs text-slate-400 italic">
                No chats found
              </div>
            ) : (
              filteredChats.map((chat) => {
                const isActive = activeChatId === chat.id;
                return (
                  <div
                    key={chat.id}
                    onClick={() => {
                      onSelectChat(chat);
                      if (isOpenMobile) onCloseMobile();
                    }}
                    className={`group flex items-center justify-between px-2.5 py-2 rounded-xl text-xs font-medium cursor-pointer transition-all duration-150 ${
                      isActive
                        ? 'bg-indigo-50/90 text-indigo-700 border border-indigo-200/70 shadow-2xs'
                        : 'text-slate-600 hover:bg-slate-100/70 hover:text-slate-900 border border-transparent'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 overflow-hidden">
                      <span
                        className={`material-symbols-outlined text-base ${
                          isActive
                            ? 'text-indigo-600'
                            : 'text-slate-400 group-hover:text-indigo-600 transition-colors'
                        }`}
                      >
                        {chat.icon || 'chat_bubble_outline'}
                      </span>
                      <span className="truncate">{chat.title}</span>
                    </div>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                      }}
                      className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-slate-600 p-0.5 rounded transition-opacity"
                      title="More options"
                    >
                      <span className="material-symbols-outlined text-sm">
                        more_vert
                      </span>
                    </button>
                  </div>
                );
              })
            )}
          </nav>
        </div>

        {/* Bottom Controls & User Profile */}
        <div className="flex flex-col gap-2 pt-3 border-t border-slate-200/70">
          <div className="flex flex-col gap-0.5">
            {/* Theme Indicator / Switcher */}
            <button
              type="button"
              className="flex items-center justify-between w-full px-2.5 py-1.5 rounded-lg text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors text-xs font-medium cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-base text-slate-400">
                  light_mode
                </span>
                <span>Theme</span>
              </div>
              <span className="text-[11px] text-slate-400 font-normal">Pastel</span>
            </button>

            {/* Settings Button */}
            <button
              type="button"
              className="flex items-center gap-2 w-full px-2.5 py-1.5 rounded-lg text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors text-xs font-medium cursor-pointer"
            >
              <span className="material-symbols-outlined text-base text-slate-400">
                settings
              </span>
              <span>Settings</span>
            </button>
          </div>

          {/* User Profile Card */}
          <div className="mt-1 p-2 rounded-xl bg-white/90 border border-slate-200/80 flex items-center justify-between hover:border-slate-300 transition-colors shadow-2xs">
            <div className="flex items-center gap-2.5 overflow-hidden">
              <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-xs font-semibold shrink-0 border border-indigo-200/60">
                U
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-xs text-slate-800 font-semibold truncate">
                  User
                </span>
                <span className="text-[11px] text-slate-400 truncate">
                  Student
                </span>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}

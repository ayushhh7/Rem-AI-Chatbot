import React, { useState } from 'react';
import Sidebar from './components/Sidebar.jsx';
import ChatWindow from './components/ChatWindow.jsx';

/**
 * Initial list of recent conversations
 * Demonstrating array of objects in JavaScript
 */
const INITIAL_RECENT_CHATS = [
  { id: 'react-hooks', title: 'React Hooks', icon: 'code' },
  { id: 'js-promises', title: 'JS Promises', icon: 'javascript' },
  { id: 'python-funcs', title: 'Python Functions', icon: 'terminal' },
  { id: 'java-oop', title: 'Java OOP', icon: 'data_object' },
  { id: 'project-ideas', title: 'Project Ideas', icon: 'lightbulb' },
  { id: 'exam-prep', title: 'Exam Prep', icon: 'school' },
];

/**
 * Pre-populated messages for the "React Hooks" conversation
 * Exactly reproducing the active reference design screenshot
 */
const SAMPLE_HOOKS_MESSAGES = [
  {
    id: 1,
    sender: 'user',
    timestamp: '10:42 AM',
    text: 'Can you explain how useEffect cleanup functions work with an event listener or WebSocket example, and how to avoid memory leaks?',
  },
  {
    id: 2,
    sender: 'rem',
    mode: 'Tutor',
    timestamp: '10:43 AM',
    thought: {
      summary: 'Analyzed React lifecycles & unmounting behavior (1.2s)',
      details: [
        'Verified effect cleanup execution prior to re-execution and component unmount.',
        'Structured window resize event listener to demonstrate listener detachment.',
        'Added guidelines to avoid stale closures in callback functions.',
      ],
    },
    text: 'In React, the cleanup function returned inside useEffect is your defense mechanism against lingering side effects, stale closures, and memory leaks.',
    secondaryText:
      'When dealing with persistent channels like DOM Event Listeners, WebSockets, or interval timers, failing to tear them down leads to accumulated listeners triggering multiple times on a single browser action.',
    codeSnippet: {
      filename: 'useWindowSize.js',
      language: 'javascript',
      code: `import { useState, useEffect } from 'react';

export function useWindowSize() {
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    // 1. Define event handler function
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    // 2. Attach listener on mount
    window.addEventListener('resize', handleResize);

    // 3. Cleanup function: runs on unmount or before effect re-runs
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []); // Empty dependency array: runs once on mount

  return windowSize;
}`,
    },
    takeaways: [
      {
        title: 'Execution Timing',
        desc: 'The cleanup function runs immediately before the effect executes again if dependencies change, and on unmount.',
      },
      {
        title: 'Function Reference Stability',
        desc: 'Always pass the exact same callback instance to removeEventListener that was passed to addEventListener.',
      },
      {
        title: 'Memory Leak Prevention',
        desc: 'Without cleanup, listeners remain active in memory even after the component is removed from the DOM.',
      },
    ],
  },
];

/**
 * Helper function to simulate Rem's response based on the selected mode
 * Demonstrates:
 * - JavaScript Promises
 * - Async / Await
 * - setTimeout callback
 */
const generateRemResponse = (userPrompt, mode) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const timeString = new Date().toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      });

      let responseText = '';
      let secondary = '';
      let code = null;
      let takeaways = null;

      if (mode === 'Friendly') {
        responseText = `Hey Alex! Great question about "${userPrompt}". I'm happy to help you work through this!`;
        secondary =
          'Let me know if you would like me to break this down into bite-sized examples or if you want to try practicing a quick coding exercise together.';
      } else if (mode === 'Tutor') {
        responseText = `Let's break down "${userPrompt}" step-by-step so you can understand the underlying concept thoroughly.`;
        secondary =
          'When learning this concept, focus first on why we use it, how data flows through it, and the most common mistakes to watch out for.';
        takeaways = [
          {
            title: 'Core Concept',
            desc: 'Understand the fundamental purpose before jumping into complex syntax.',
          },
          {
            title: 'Best Practice',
            desc: 'Keep logic modular and test each small piece independently.',
          },
        ];
      } else if (mode === 'Research') {
        responseText = `Analyzing technical documentation and common implementation patterns for "${userPrompt}".`;
        secondary =
          'From an architectural standpoint, this involves state transitions, performance tradeoffs, and compliance with modern standards.';
      } else {
        // Normal mode (default)
        responseText = `Here is a clear overview regarding "${userPrompt}".`;
        secondary =
          'You can apply this in your project using standard React state and functions.';
      }

      // If user asks about code, supply a simple example
      if (
        userPrompt.toLowerCase().includes('code') ||
        userPrompt.toLowerCase().includes('state') ||
        userPrompt.toLowerCase().includes('challenge') ||
        userPrompt.toLowerCase().includes('hook')
      ) {
        code = {
          filename: 'example.js',
          language: 'javascript',
          code: `// Practical demonstration for: ${userPrompt}
import React, { useState } from 'react';

function CounterExample() {
  const [count, setCount] = useState(0);

  const increment = () => {
    setCount(prevCount => prevCount + 1);
  };

  return (
    <button onClick={increment}>
      Clicked {count} times
    </button>
  );
}`,
        };
      }

      resolve({
        id: Date.now(),
        sender: 'rem',
        mode: mode,
        timestamp: timeString,
        text: responseText,
        secondaryText: secondary,
        codeSnippet: code,
        takeaways: takeaways,
      });
    }, 1200);
  });
};

/**
 * Main App Component
 */
export default function App() {
  // ----------------------------------------------------
  // REACT STATE (using basic useState hook)
  // ----------------------------------------------------
  const [recentChats, setRecentChats] = useState(INITIAL_RECENT_CHATS);
  const [activeChatId, setActiveChatId] = useState(null); // null means "New Conversation"
  const [currentMode, setCurrentMode] = useState('Normal'); // Default: Normal
  const [currentModel, setCurrentModel] = useState('openai/gpt-oss-120b'); // Default: GPT-OSS 120B
  const [messages, setMessages] = useState([]); // Empty array = Welcome screen
  const [chatHistory, setChatHistory] = useState({ 'react-hooks': SAMPLE_HOOKS_MESSAGES });
  const [isTyping, setIsTyping] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Find currently active chat object if any (using Array.prototype.find)
  const activeChat = recentChats.find((chat) => chat.id === activeChatId) || null;

  // ----------------------------------------------------
  // EVENT HANDLERS
  // ----------------------------------------------------

  // Handler: User clicks "+ New Chat"
  const handleNewChat = () => {
    setActiveChatId(null);
    setMessages([]);
    setCurrentMode('Normal'); // Reset mode to Normal as required
    setCurrentModel('openai/gpt-oss-120b'); // Reset model to default GPT-OSS 120B
  };

  // Handler: User clicks an existing chat in the sidebar
  const handleSelectChat = (chat) => {
    setActiveChatId(chat.id);
    if (chatHistory[chat.id]) {
      setMessages(chatHistory[chat.id]);
    } else {
      // Default starter messages for initial recent items
      const starterMessages = [
        {
          id: 1,
          sender: 'user',
          timestamp: 'Yesterday',
          text: `Notes and study materials on ${chat.title}.`,
        },
        {
          id: 2,
          sender: 'rem',
          mode: 'Normal',
          model: 'openai/gpt-oss-120b',
          timestamp: 'Yesterday',
          text: `Here are the foundational concepts for ${chat.title}. What specific topic would you like to review?`,
        },
      ];
      setMessages(starterMessages);
      setChatHistory((prev) => ({ ...prev, [chat.id]: starterMessages }));
    }
  };

  // Handler: User sends a message
  const handleSendMessage = async (text) => {
    if (!text || !text.trim()) return;

    const timeString = new Date().toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });

    // 1. Immediately create and display user message object
    const userMessage = {
      id: Date.now(),
      sender: 'user',
      timestamp: timeString,
      text: text,
    };

    const updatedUserMessages = [...messages, userMessage];
    setMessages(updatedUserMessages);

    // 2. If in a new chat, generate meaningful title from first user message
    let currentId = activeChatId;
    if (!currentId) {
      currentId = `chat-${Date.now()}`;
      const firstLine = text.trim().split('\n')[0].trim();
      const newChatTitle = firstLine.length > 24 ? firstLine.slice(0, 24).trim() + '...' : firstLine;
      const newChatObj = {
        id: currentId,
        title: newChatTitle || 'New Conversation',
        icon: 'chat_bubble_outline',
      };
      setRecentChats((prevChats) => [newChatObj, ...prevChats]);
      setActiveChatId(currentId);
    }

    // Keep chatHistory updated
    setChatHistory((prev) => ({ ...prev, [currentId]: updatedUserMessages }));

    // 3. Set loading / typing indicator
    setIsTyping(true);

    try {
      // 4. Call FastAPI backend using fetch() with async/await
      const response = await fetch('http://localhost:8000/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: text,
          mode: currentMode,
          model: currentModel,
        }),
      });

      if (!response.ok) {
        throw new Error(`Server returned status ${response.status}`);
      }

      const data = await response.json();

      // 5. Create Rem message from API response
      const remReply = {
        id: Date.now() + 1,
        sender: 'rem',
        mode: currentMode,
        model: currentModel,
        timestamp: new Date().toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        }),
        text: data.response,
      };

      setMessages((prevMessages) => [...prevMessages, remReply]);
      setChatHistory((prev) => ({
        ...prev,
        [currentId]: [...updatedUserMessages, remReply],
      }));
    } catch (error) {
      console.error('FastAPI connection error:', error);
      // Handle API errors gracefully in the chat window
      const errorReply = {
        id: Date.now() + 1,
        sender: 'rem',
        mode: currentMode,
        model: currentModel,
        timestamp: new Date().toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        }),
        text: `⚠️ Could not reach the FastAPI backend at http://localhost:8000. Please ensure the backend server is running.\n\nError: ${error.message}`,
      };
      setMessages((prevMessages) => [...prevMessages, errorReply]);
      setChatHistory((prev) => ({
        ...prev,
        [currentId]: [...updatedUserMessages, errorReply],
      }));
    } finally {
      // 6. Clear loading / typing indicator
      setIsTyping(false);
    }
  };

  return (
    <div className="mesh-gradient-bg min-h-screen text-slate-800 flex overflow-hidden font-sans">
      {/* Sidebar Navigation */}
      <Sidebar
        recentChats={recentChats}
        activeChatId={activeChatId}
        onSelectChat={handleSelectChat}
        onNewChat={handleNewChat}
        isOpenMobile={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
      />

      {/* Main Chat Interface */}
      <ChatWindow
        activeChat={activeChat}
        currentMode={currentMode}
        onSelectMode={setCurrentMode}
        currentModel={currentModel}
        onSelectModel={setCurrentModel}
        messages={messages}
        isTyping={isTyping}
        onSendMessage={handleSendMessage}
        onToggleSidebar={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
      />
    </div>
  );
}

import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useChat } from "../hooks/Usechat";

const BOT_ICON = () => (
  <svg viewBox="0 0 36 36" fill="none" className="w-full h-full">
    <rect width="36" height="36" rx="10" fill="#7c3aed" />
    <circle cx="13" cy="15" r="2.5" fill="white" />
    <circle cx="23" cy="15" r="2.5" fill="white" />
    <path
      d="M12 22c1.5 2 8.5 2 10 0"
      stroke="white"
      strokeWidth="1.8"
      strokeLinecap="round"
    />
    <rect x="16" y="6" width="4" height="3" rx="1" fill="white" opacity="0.7" />
    <circle cx="18" cy="6" r="1" fill="white" />
  </svg>
);

const MessageActions = () => (
  <div className="flex items-center gap-3 mt-3 pt-3 border-t border-white/5">
    {[
      {
        label: "Copy",
        icon: (
          <path
            d="M8 4H6a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2v-2M8 4h8a2 2 0 012 2v8M8 4a2 2 0 012-2h2a2 2 0 012 2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        ),
      },
      {
        label: "Like",
        icon: (
          <path
            d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017a2 2 0 01-1.789-1.106L7 14H4a1 1 0 01-1-1V9a1 1 0 011-1h2.5l3-5a1 1 0 011.5.87V10z"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        ),
      },
      {
        label: "Dislike",
        icon: (
          <path
            d="M10 14H5.236a2 2 0 01-1.789-2.894l3.5-7A2 2 0 018.736 3h4.018a2 2 0 011.789 1.106L17 10h2.764a1 1 0 011 1v4a1 1 0 01-1 1H17l-3 5a1 1 0 01-1.5-.87V14z"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        ),
      },
      {
        label: "Read",
        icon: (
          <path
            d="M15.536 8.464a5 5 0 010 7.072M12 6a8 8 0 010 12M8.464 8.464a5 5 0 000 7.072"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        ),
      },
    ].map(({ label, icon }) => (
      <button
        key={label}
        title={label}
        className="text-gray-500 hover:text-purple-400 transition-colors duration-150 p-1 rounded"
      >
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          viewBox="0 0 24 24"
        >
          {icon}
        </svg>
      </button>
    ))}
  </div>
);

const formatChatTime = (date) => {
  if (!date) return "";
  return new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "numeric",
  }).format(new Date(date));
};

const formatMessageTime = (date) => {
  if (!date) return "";
  return new Intl.DateTimeFormat(undefined, {
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(date));
};

const Dashboard = () => {
  const { user } = useSelector((state) => state.auth);
  const { chats, currentChatId, error, isLoading } = useSelector((state) => state.chat);
  const {
    connectSocket,
    disconnectSocket,
    handleSendMessage,
    loadChatList,
    loadChatMessages,
    startNewChat,
  } = useChat();
  const [input, setInput] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const bottomRef = useRef(null);

  const recentChats = Object.values(chats).sort(
    (a, b) => new Date(b.updatedAt || b.createdAt || 0) - new Date(a.updatedAt || a.createdAt || 0)
  );
  const activeChat = currentChatId ? chats[currentChatId] : null;
  const messages = activeChat?.messages || [];

  useEffect(() => {
    connectSocket();
    loadChatList().catch(() => {});
    return () => disconnectSocket();
  }, [connectSocket, disconnectSocket, loadChatList]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length, isLoading]);

  const initials = user?.name
    ?.split(" ")
    .map((name) => name[0])
    .join("")
    .toUpperCase();

  const submitMessage = async () => {
    const message = input.trim();
    if (!message || isLoading) return;

    setInput("");
    try {
      await handleSendMessage(message, currentChatId);
    } catch {
      setInput(message);
    }
  };

  return (
    <div
      className="flex h-screen w-screen overflow-hidden font-sans antialiased"
      style={{
        background: "#0e0e12",
        fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
      }}
    >
      <aside
        className={`flex flex-col flex-shrink-0 transition-all duration-300 ease-in-out border-r border-white/[0.06] ${
          sidebarOpen ? "w-72" : "w-0 overflow-hidden"
        }`}
        style={{ background: "#13131a" }}
      >
        <div className="flex items-center justify-between px-5 py-5">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8">
              <BOT_ICON />
            </div>
            <span className="text-lg font-bold tracking-tight text-white">
              Talk<span className="text-purple-400">AI</span>
            </span>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="text-gray-500 hover:text-gray-300 transition-colors"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>

        <div className="px-4 pb-4">
          <button
            onClick={() => {
              setInput("");
              startNewChat();
            }}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium text-white transition-all duration-150 hover:opacity-90 active:scale-[0.98]"
            style={{ background: "linear-gradient(135deg, #7c3aed, #6d28d9)" }}
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              viewBox="0 0 24 24"
            >
              <path d="M12 5v14M5 12h14" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            New Chat
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-3 space-y-0.5 scrollbar-thin">
          <p className="px-2 py-2 text-[11px] font-semibold uppercase tracking-widest text-gray-600">
            Recent Chats
          </p>
          {recentChats.length === 0 && (
            <p className="px-3 py-2 text-sm text-gray-500">No chats yet</p>
          )}
          {recentChats.map((chat) => (
            <button
              key={chat._id}
              onClick={() => loadChatMessages(chat._id).catch(() => {})}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-left transition-all duration-150 group ${
                currentChatId === chat._id
                  ? "bg-purple-600/15 text-white"
                  : "text-gray-400 hover:bg-white/5 hover:text-gray-200"
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <svg
                  className={`w-3.5 h-3.5 flex-shrink-0 ${
                    currentChatId === chat._id ? "text-purple-400" : "text-gray-600"
                  }`}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path
                    d="M8 10h8M8 14h5M5 5h14a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2z"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <span className="text-sm truncate">{chat.title || "New chat"}</span>
              </div>
              <span className="text-[11px] text-gray-600 flex-shrink-0 ml-2">
                {formatChatTime(chat.updatedAt || chat.createdAt)}
              </span>
            </button>
          ))}
        </div>

        <div className="px-4 py-4 border-t border-white/[0.06]">
          <div className="flex items-center gap-3 px-2 py-2 rounded-xl hover:bg-white/5 transition-colors cursor-pointer">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
              style={{ background: "linear-gradient(135deg, #7c3aed, #a855f7)" }}
            >
              {initials || "U"}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium text-white truncate">
                {user?.name || user?.username || "User"}
              </p>
              <p className="text-[11px] text-gray-500 truncate">{user?.email || ""}</p>
            </div>
          </div>
        </div>
      </aside>

      <main className="flex flex-col flex-1 min-w-0">
        <header
          className="flex items-center gap-3 px-6 py-4 border-b border-white/[0.06] flex-shrink-0"
          style={{ background: "#0e0e12" }}
        >
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-gray-500 hover:text-gray-300 transition-colors p-1"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path d="M4 6h16M4 12h16M4 18h16" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
            <span className="text-sm text-gray-400 font-medium truncate">
              {activeChat?.title || "New chat"}
            </span>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
          <div className="max-w-3xl mx-auto space-y-6">
            {messages.length === 0 && !isLoading && (
              <div className="py-24 text-center">
                <div className="w-12 h-12 mx-auto mb-4">
                  <BOT_ICON />
                </div>
                <h1 className="text-xl font-semibold text-white">Ask anything</h1>
                <p className="text-sm text-gray-500 mt-2">
                  Start a new conversation from the box below.
                </p>
              </div>
            )}

            {messages.map((message, index) =>
              message.role === "user" ? (
                <div className="flex justify-end" key={message._id || `${message.role}-${index}`}>
                  <div
                    className="max-w-lg px-4 py-3 rounded-2xl rounded-tr-sm text-sm text-white"
                    style={{ background: "linear-gradient(135deg, #7c3aed, #6d28d9)" }}
                  >
                    <p className="whitespace-pre-wrap">{message.text}</p>
                    <p className="text-right text-[11px] text-purple-200/60 mt-1.5">
                      {formatMessageTime(message.createdAt)}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="flex gap-3 items-start" key={message._id || `${message.role}-${index}`}>
                  <div className="w-9 h-9 flex-shrink-0 rounded-xl overflow-hidden mt-0.5">
                    <BOT_ICON />
                  </div>
                  <div
                    className="flex-1 rounded-2xl rounded-tl-sm px-5 py-4 text-sm text-gray-300 whitespace-pre-wrap leading-relaxed"
                    style={{ background: "#1a1a24", border: "1px solid rgba(255,255,255,0.06)" }}
                  >
                    {message.text}
                    <MessageActions />
                  </div>
                </div>
              )
            )}

            {isLoading && (
              <div className="flex gap-3 items-center text-sm text-gray-500">
                <div className="w-9 h-9 flex-shrink-0 rounded-xl overflow-hidden">
                  <BOT_ICON />
                </div>
                Thinking...
              </div>
            )}

            {error && <p className="text-sm text-red-400 text-center">{error}</p>}
          </div>
          <div ref={bottomRef} />
        </div>

        <div
          className="px-6 py-4 border-t border-white/[0.06] flex-shrink-0"
          style={{ background: "#0e0e12" }}
        >
          <div className="max-w-3xl mx-auto">
            <div
              className="flex flex-col rounded-2xl overflow-hidden"
              style={{ background: "#1a1a24", border: "1px solid rgba(255,255,255,0.08)" }}
            >
              <textarea
                rows={1}
                value={input}
                onChange={(event) => setInput(event.target.value)}
                placeholder="Type your message..."
                className="w-full bg-transparent text-gray-200 placeholder-gray-600 text-sm px-4 pt-3.5 pb-2 resize-none outline-none leading-relaxed"
                style={{ minHeight: "48px", maxHeight: "160px" }}
                onKeyDown={(event) => {
                  if (event.key === "Enter" && !event.shiftKey) {
                    event.preventDefault();
                    submitMessage();
                  }
                }}
              />
              <div className="flex items-center justify-between px-3 pb-3 pt-1">
                <div className="flex items-center gap-1">
                  <button className="p-2 rounded-lg text-gray-500 hover:text-gray-300 hover:bg-white/5 transition-all">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                    >
                      <path
                        d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                  <button className="p-2 rounded-lg text-gray-500 hover:text-gray-300 hover:bg-white/5 transition-all">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                    >
                      <circle cx="12" cy="12" r="10" />
                      <path
                        d="M2 12h20M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                </div>
                <button
                  onClick={submitMessage}
                  disabled={!input.trim() || isLoading}
                  className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-150 ${
                    input.trim() && !isLoading
                      ? "text-white shadow-lg hover:opacity-90 active:scale-95"
                      : "text-gray-600 cursor-not-allowed"
                  }`}
                  style={
                    input.trim() && !isLoading
                      ? { background: "linear-gradient(135deg, #7c3aed, #6d28d9)" }
                      : { background: "#2a2a35" }
                  }
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 19V5M5 12l7-7 7 7" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              </div>
            </div>
            <p className="text-center text-[11px] text-gray-700 mt-2.5">
              TalkAI can make mistakes. Consider checking important information.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;

"use client";

import { useState, useEffect, useRef } from "react";

// SVG Icon for the send button
const SendIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.428A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
    </svg>
);

export default function StudentChat({ token, studentName }) {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [history, setHistory] = useState([]);
  const [activeTab, setActiveTab] = useState("chat");
  const [isLoading, setIsLoading] = useState(false); // For bot typing indicator

  const chatEndRef = useRef(null);

  // ✅ FIX: The auto-scrolling useEffect has been commented out to disable the feature.
  /*
  // Effect to scroll to the bottom of the chat on new messages
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);
  */

  // Effect to fetch chat history on component mount
  useEffect(() => {
    if (token) {
      fetch("http://localhost:5000/api/chat/history", {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.messages && data.messages.length > 0) {
            setHistory(data.messages);
            // Prepend a welcome message to the live chat
            setMessages([
              { role: "assistant", content: `Hello ${studentName}! Welcome back. You can ask me anything about your progress.` },
            ]);
          } else {
            setMessages([
              { role: "assistant", content: `Hello ${studentName}! How can I help you today?` },
            ]);
          }
        })
        .catch((err) => console.error("History fetch error:", err));
    }
  }, [token, studentName]);

  const sendMessage = async () => {
    if (!message.trim() || isLoading) return;
    
    const newMessages = [...messages, { role: "user", content: message }];
    setMessages(newMessages);
    setMessage("");
    setIsLoading(true);

    try {
      const res = await fetch("http://localhost:5000/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ message }),
      });

      const data = await res.json();
      
      let replyContent = "⚠️ Sorry, I encountered an error.";
      if (data.reply) {
        replyContent = data.reply;
      } else if (data.error) {
        replyContent = `Error: ${data.error}`;
      }

      setMessages((prev) => [...prev, { role: "assistant", content: replyContent }]);
    } catch (err) {
      console.error("Chat send error:", err);
      setMessages((prev) => [...prev, { role: "assistant", content: "⚠️ Network error. Please check your connection." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[75vh]">
        <div className="p-4 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-800 text-center">Student Counseling Chatbot</h2>
            <div className="flex justify-center gap-4 mt-4">
                <button
                    className={`px-4 py-2 rounded-lg font-semibold transition-colors ${activeTab === "chat" ? "bg-purple-500 text-white shadow-md" : "bg-gray-200 text-gray-600 hover:bg-gray-300"}`}
                    onClick={() => setActiveTab("chat")}
                >
                    Live Chat
                </button>
                <button
                    className={`px-4 py-2 rounded-lg font-semibold transition-colors ${activeTab === "history" ? "bg-purple-500 text-white shadow-md" : "bg-gray-200 text-gray-600 hover:bg-gray-300"}`}
                    onClick={() => setActiveTab("history")}
                >
                    Chat History
                </button>
            </div>
        </div>

        {/* Chat & History Views */}
        <div className="flex-grow p-4 overflow-y-auto bg-gray-50">
            {activeTab === "chat" && (
                messages.map((msg, i) => (
                    <div key={i} className={`mb-4 flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                        <div className={`py-2 px-4 rounded-2xl max-w-[80%] ${msg.role === "user" ? "bg-purple-500 text-white rounded-br-none" : "bg-gray-200 text-gray-800 rounded-bl-none"}`}>
                            {msg.content}
                        </div>
                    </div>
                ))
            )}
            {activeTab === "history" && (
                history.length === 0 
                ? <p className="text-center text-gray-500">No previous chat history found.</p>
                : history.map((msg, i) => (
                    <div key={i} className="mb-2 text-sm">
                        <b className={`font-semibold ${msg.role === 'user' ? 'text-purple-700' : 'text-gray-700'}`}>{msg.role === "user" ? "You" : "Bot"}:</b> <span className="text-gray-600">{msg.content}</span>
                    </div>
                ))
            )}
            {isLoading && activeTab === "chat" && (
                <div className="flex justify-start">
                    <div className="py-2 px-4 rounded-2xl bg-gray-200 text-gray-800 rounded-bl-none">
                        <span className="animate-pulse">Bot is typing...</span>
                    </div>
                </div>
            )}
            {/* The ref is still here but the scroll effect is disabled */}
            <div ref={chatEndRef} />
        </div>

        {/* Input Area */}
        {activeTab === "chat" && (
            <div className="p-4 border-t border-gray-200 bg-white">
                <div className="flex items-center gap-3">
                    <input
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                        className="text-black flex-1 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 transition-shadow"
                        placeholder="Ask about your progress..."
                        disabled={isLoading}
                    />
                    <button 
                        className="p-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 disabled:bg-purple-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200" 
                        onClick={sendMessage}
                        disabled={isLoading}
                    >
                        <SendIcon />
                    </button>
                </div>
            </div>
        )}
    </div>
  );
}


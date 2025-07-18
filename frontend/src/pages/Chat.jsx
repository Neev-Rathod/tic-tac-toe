import { useState, useRef, useEffect } from "react";
import { useGame } from "../context/GameContext";
import { useAuth } from "../context/AuthContext";
import { Send, X, Users } from "lucide-react";

const Chat = ({ onClose }) => {
  const [messageInput, setMessageInput] = useState("");
  const messagesEndRef = useRef(null);
  const { username } = useAuth();
  const { messages, sendMessage, players } = useGame();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (messageInput.trim()) {
      sendMessage(messageInput);
      setMessageInput("");
    }
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-indigo-50 to-blue-50">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-indigo-100 rounded-lg">
            <Users size={18} className="text-indigo-600" />
          </div>
          <h3 className="font-bold text-lg text-gray-800">Game Chat</h3>
        </div>

        {/* Mobile Close Button */}
        {onClose && (
          <button
            onClick={onClose}
            className="lg:hidden p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        )}
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="p-4 bg-white rounded-full shadow-sm mb-3">
              <Users size={24} className="text-gray-400" />
            </div>
            <p className="text-gray-500 italic">No messages yet</p>
            <p className="text-sm text-gray-400 mt-1">
              Start the conversation!
            </p>
          </div>
        ) : (
          <>
            {messages.map((msg, index) => {
              const isOwnMessage = msg.sender === username;
              const showAvatar =
                index === 0 || messages[index - 1]?.sender !== msg.sender;

              return (
                <div
                  key={index}
                  className={`flex ${
                    isOwnMessage ? "justify-end" : "justify-start"
                  } ${showAvatar ? "mt-4" : "mt-1"}`}
                >
                  {!isOwnMessage && showAvatar && (
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full flex items-center justify-center text-white text-xs font-bold mr-2 flex-shrink-0">
                      {msg.sender.charAt(0).toUpperCase()}
                    </div>
                  )}

                  {!isOwnMessage && !showAvatar && (
                    <div className="w-8 mr-2 flex-shrink-0" />
                  )}

                  <div
                    className={` max-w-[90vw] lg:max-w-76 ${
                      isOwnMessage ? "ml-12" : ""
                    }`}
                  >
                    {showAvatar && (
                      <div
                        className={`text-xs font-medium mb-1 ${
                          isOwnMessage
                            ? "text-right text-indigo-600"
                            : "text-gray-600"
                        }`}
                      >
                        {msg.sender}
                      </div>
                    )}

                    <div
                      className={`px-4 py-2 rounded-2xl shadow-sm ${
                        isOwnMessage
                          ? "bg-gradient-to-r from-indigo-500 to-blue-500 text-white rounded-br-md"
                          : "bg-white text-gray-800 border border-gray-200 rounded-bl-md"
                      }`}
                    >
                      <div className="break-words">{msg.message}</div>
                      {msg.timestamp && (
                        <div
                          className={`text-xs mt-1 ${
                            isOwnMessage ? "text-indigo-100" : "text-gray-400"
                          }`}
                        >
                          {formatTime(msg.timestamp)}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Message Input */}
      <div className="p-4 border-t bg-white">
        <form onSubmit={handleSubmit} className="flex space-x-3">
          <div className="flex-1 relative">
            <input
              type="text"
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              placeholder="Type your message..."
              className="w-full px-4 py-3 pr-12 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-gray-50 transition-colors"
              maxLength={500}
            />
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xs text-gray-400">
              {messageInput.length}/500
            </div>
          </div>

          <button
            type="submit"
            disabled={!messageInput.trim()}
            className="bg-gradient-to-r from-indigo-500 to-blue-500 text-white p-3 rounded-xl hover:from-indigo-600 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-md hover:shadow-lg"
          >
            <Send size={18} />
          </button>
        </form>
      </div>
    </div>
  );
};

export default Chat;

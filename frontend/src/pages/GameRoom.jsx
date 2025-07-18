import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useGame } from "../context/GameContext";
import GameBoard from "../components/GameBoard";
import GameStatus from "../components/GameStatus";
import Chat from "./Chat";
import { X, MessageCircle } from "lucide-react";

const GameRoom = () => {
  const { roomCode: urlRoomCode } = useParams();
  const navigate = useNavigate();
  const { roomCode, resetGame } = useGame();
  const [isChatOpen, setIsChatOpen] = useState(false);

  useEffect(() => {
    // If no active game session, redirect to lobby
    if (!roomCode && urlRoomCode) {
      navigate("/lobby");
    }
  }, [roomCode, urlRoomCode, navigate]);

  const handleBackToLobby = () => {
    resetGame();
    navigate("/lobby");
  };

  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 bg-white shadow-sm border-b z-50 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="text-sm text-gray-600">
              Room:{" "}
              <span className="font-bold text-indigo-600">{roomCode}</span>
            </div>
          </div>
          <button
            onClick={toggleChat}
            className="p-2 rounded-lg bg-indigo-100 text-indigo-600 hover:bg-indigo-200 transition-colors"
          >
            {isChatOpen ? <X size={20} /> : <MessageCircle size={20} />}
          </button>
        </div>
      </div>

      {/* Game Area */}
      <div
        className={`flex-1 flex flex-col items-center justify-center p-4 transition-all duration-300 ${
          isChatOpen ? "lg:mr-0" : ""
        } pt-20 lg:pt-4`}
      >
        <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md border border-gray-100">
          {/* Desktop Room Code */}
          <div className="hidden lg:block text-center mb-6">
            <div className="inline-flex items-center bg-indigo-50 px-4 py-2 rounded-full">
              <span className="text-sm text-gray-600 mr-2">Room Code:</span>
              <span className="font-bold text-lg text-indigo-600">
                {roomCode}
              </span>
            </div>
          </div>

          {/* Game Status */}
          <div className="mb-6">
            <GameStatus />
          </div>

          {/* Game Board */}
          <div className="mb-6">
            <GameBoard />
          </div>

          {/* Actions */}
          <div className="text-center space-y-3">
            <button
              onClick={handleBackToLobby}
              className="w-full bg-gray-100 text-gray-700 px-4 py-3 rounded-xl hover:bg-gray-200 transition-colors font-medium"
            >
              Back to Lobby
            </button>

            {/* Desktop Chat Toggle */}
            <button
              onClick={toggleChat}
              className="hidden lg:flex w-full items-center justify-center space-x-2 bg-indigo-100 text-indigo-600 px-4 py-3 rounded-xl hover:bg-indigo-200 transition-colors font-medium"
            >
              <MessageCircle size={18} />
              <span>{isChatOpen ? "Hide Chat" : "Show Chat"}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Chat Area - Responsive */}
      <div
        className={`fixed lg:relative inset-y-0 right-0 z-40 w-full sm:w-96 bg-white shadow-2xl lg:shadow-lg transform transition-transform duration-300 ease-in-out ${
          isChatOpen ? "translate-x-0" : "translate-x-full lg:translate-x-0"
        } ${isChatOpen ? "lg:block" : "lg:hidden"}`}
      >
        <Chat onClose={() => setIsChatOpen(false)} />
      </div>

      {/* Mobile Overlay */}
      {isChatOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={() => setIsChatOpen(false)}
        />
      )}
    </div>
  );
};

export default GameRoom;

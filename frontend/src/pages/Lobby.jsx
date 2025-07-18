import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useGame } from "../context/GameContext";
import RoomPermissions from "../components/RoomPermissions";
import {
  Plus,
  LogIn,
  LogOut,
  Settings,
  History,
  Users,
  ChevronDown,
  ChevronUp,
  Gamepad2,
} from "lucide-react";

const Lobby = () => {
  const [showPermissions, setShowPermissions] = useState(false);
  const [joinRoomCode, setJoinRoomCode] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [isJoining, setIsJoining] = useState(false);
  const { username, logout } = useAuth();
  const { createRoom, joinRoom, resetGame } = useGame();
  const navigate = useNavigate();

  const handleCreateRoom = async () => {
    setIsCreating(true);
    try {
      createRoom((code) => {
        navigate(`/game/${code}`);
      });
    } finally {
      setIsCreating(false);
    }
  };

  const handleJoinRoom = async (e) => {
    e.preventDefault();
    if (!joinRoomCode.trim()) return;

    setIsJoining(true);
    try {
      joinRoom(
        joinRoomCode,
        () => {
          navigate(`/game/${joinRoomCode}`);
        },
        (error) => {
          alert(error);
        }
      );
    } finally {
      setIsJoining(false);
    }
  };

  const handleLogout = () => {
    resetGame();
    logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-white to-purple-100 flex items-center justify-center p-4">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-gradient-to-br from-blue-400/20 to-purple-400/20 blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-gradient-to-br from-indigo-400/20 to-blue-400/20 blur-3xl"></div>
      </div>

      <div className="relative w-full max-w-md">
        {/* Header Card */}
        <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20 p-6 mb-6">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl">
                <Gamepad2 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-800">Game Lobby</h2>
                <p className="text-sm text-gray-600">
                  Welcome back, {username}!
                </p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all duration-200"
              title="Logout"
            >
              <LogOut size={18} />
            </button>
          </div>
        </div>

        {/* Main Actions Card */}
        <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20 p-6 space-y-6">
          {/* Room Permissions Section */}
          <div className="space-y-3">
            <button
              onClick={() => setShowPermissions(!showPermissions)}
              className="w-full flex items-center justify-between p-4 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl border border-purple-200 hover:from-purple-100 hover:to-indigo-100 transition-all duration-200 group"
            >
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-purple-100 rounded-lg group-hover:bg-purple-200 transition-colors">
                  <Settings size={18} className="text-purple-600" />
                </div>
                <span className="font-medium text-gray-700">
                  Room Permissions
                </span>
              </div>
              {showPermissions ? (
                <ChevronUp size={20} className="text-gray-400" />
              ) : (
                <ChevronDown size={20} className="text-gray-400" />
              )}
            </button>

            {showPermissions && (
              <div className="bg-gray-50/80 backdrop-blur-sm rounded-xl p-4 border border-gray-200 animate-in slide-in-from-top-2 duration-300">
                <RoomPermissions />
              </div>
            )}
          </div>

          {/* Create Room Button */}
          <button
            onClick={handleCreateRoom}
            disabled={isCreating}
            className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-4 px-6 rounded-xl hover:from-blue-600 hover:to-indigo-700 focus:outline-none focus:ring-4 focus:ring-blue-500/20 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-3 group"
          >
            <div className="p-1 bg-white/20 rounded-lg group-hover:bg-white/30 transition-colors">
              <Plus size={20} />
            </div>
            <span className="font-semibold text-lg">
              {isCreating ? "Creating..." : "Create New Room"}
            </span>
          </button>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-gray-500 font-medium">
                or
              </span>
            </div>
          </div>

          {/* Join Room Section */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2 text-gray-700 mb-3">
              <Users size={18} className="text-gray-500" />
              <span className="font-medium">Join Existing Room</span>
            </div>

            <form onSubmit={handleJoinRoom} className="space-y-3">
              <div className="relative">
                <input
                  type="text"
                  value={joinRoomCode}
                  onChange={(e) =>
                    setJoinRoomCode(e.target.value.toUpperCase())
                  }
                  placeholder="Enter room code"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-green-500/20 focus:border-green-500 transition-all duration-200 text-center font-mono text-lg tracking-wider"
                  maxLength={6}
                />
                {joinRoomCode && (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  </div>
                )}
              </div>

              <button
                type="submit"
                disabled={!joinRoomCode.trim() || isJoining}
                className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white py-3 px-6 rounded-xl hover:from-green-600 hover:to-emerald-700 focus:outline-none focus:ring-4 focus:ring-green-500/20 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-3 group"
              >
                <div className="p-1 bg-white/20 rounded-lg group-hover:bg-white/30 transition-colors">
                  <LogIn size={18} />
                </div>
                <span className="font-semibold">
                  {isJoining ? "Joining..." : "Join Room"}
                </span>
              </button>
            </form>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="mt-6 text-center">
          <button
            onClick={() => navigate("/history")}
            className="inline-flex items-center space-x-2 text-gray-600 hover:text-indigo-600 transition-colors duration-200 bg-white/60 hover:bg-white/80 px-4 py-2 rounded-xl backdrop-blur-sm"
          >
            <History size={16} />
            <span className="font-medium">View Game History</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Lobby;

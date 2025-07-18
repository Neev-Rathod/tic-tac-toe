import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useGame } from "../context/GameContext";
import {
  UserPlus,
  X,
  Lock,
  Globe,
  Users,
  AlertCircle,
  Check,
} from "lucide-react";

const RoomPermissions = () => {
  const [selectedUser, setSelectedUser] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const { username } = useAuth();
  const { allowedUsers, allUsers, addAllowedUser, removeAllowedUser } =
    useGame();

  const availableUsers = allUsers.filter(
    (user) => user !== username && !allowedUsers.includes(user)
  );

  const handleAddUser = async () => {
    if (selectedUser) {
      setIsAdding(true);
      try {
        addAllowedUser(selectedUser);
        setSelectedUser("");
      } finally {
        setIsAdding(false);
      }
    }
  };

  const handleRemoveUser = (user) => {
    removeAllowedUser(user);
  };

  const isPublicRoom = allowedUsers.length === 0;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center space-x-3">
        <div
          className={`p-2 rounded-lg ${
            isPublicRoom
              ? "bg-green-100 text-green-600"
              : "bg-orange-100 text-orange-600"
          }`}
        >
          {isPublicRoom ? <Globe size={18} /> : <Lock size={18} />}
        </div>
        <div>
          <h3 className="font-semibold text-gray-800">Room Access Control</h3>
          <p className="text-xs text-gray-500">
            {isPublicRoom
              ? "Public room - anyone can join"
              : "Private room - restricted access"}
          </p>
        </div>
      </div>

      {/* Add User Section */}
      {availableUsers.length > 0 && (
        <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
          <div className="flex items-center space-x-2 mb-3">
            <UserPlus size={16} className="text-gray-600" />
            <span className="text-sm font-medium text-gray-700">
              Add Specific Users
            </span>
          </div>

          <div className="flex space-x-2">
            <div className="flex-1 relative">
              <select
                value={selectedUser}
                onChange={(e) => setSelectedUser(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 text-sm appearance-none cursor-pointer"
              >
                <option value="">Choose a user...</option>
                {availableUsers.map((user) => (
                  <option key={user} value={user}>
                    {user}
                  </option>
                ))}
              </select>
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                <svg
                  className="w-4 h-4 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </div>

            <button
              onClick={handleAddUser}
              disabled={!selectedUser || isAdding}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              {isAdding ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <UserPlus size={16} />
              )}
              <span className="hidden sm:inline">Add</span>
            </button>
          </div>
        </div>
      )}

      {/* No Available Users Message */}
      {availableUsers.length === 0 && allUsers.length > 1 && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start space-x-3">
          <AlertCircle
            size={18}
            className="text-amber-600 mt-0.5 flex-shrink-0"
          />
          <div>
            <p className="text-sm text-amber-800">
              All available users have been added to the allowed list.
            </p>
          </div>
        </div>
      )}

      {/* Allowed Users List */}
      {allowedUsers.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Users size={16} className="text-gray-600" />
              <span className="text-sm font-medium text-gray-700">
                Allowed Users ({allowedUsers.length})
              </span>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {allowedUsers.map((user) => (
              <div
                key={user}
                className="group bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 text-blue-800 px-3 py-2 rounded-lg flex items-center space-x-2 transition-all duration-200 hover:from-blue-100 hover:to-indigo-100"
              >
                <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                  {user.charAt(0).toUpperCase()}
                </div>
                <span className="text-sm font-medium">{user}</span>
                <button
                  onClick={() => handleRemoveUser(user)}
                  className="p-1 text-blue-500 hover:text-red-500 hover:bg-red-50 rounded-full transition-all duration-200 opacity-70 group-hover:opacity-100"
                  title={`Remove ${user}`}
                >
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default RoomPermissions;

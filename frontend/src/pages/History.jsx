import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import GameDetails from "../components/GameDetails";
import {
  ArrowLeft,
  Trophy,
  Target,
  Calendar,
  User,
  TrendingUp,
  Filter,
  Search,
  RefreshCw,
  AlertTriangle,
  Gamepad2,
  Medal,
  Award,
} from "lucide-react";

const History = () => {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterResult, setFilterResult] = useState("all");
  const { token } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/user/history`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setGames(response.data);
      } catch (err) {
        setError("Failed to load game history");
        console.error("Error fetching history:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [token]);

  const getResultColor = (result) => {
    switch (result) {
      case "win":
        return "text-green-600";
      case "loss":
        return "text-red-600";
      default:
        return "text-amber-600";
    }
  };

  const getResultBadgeStyle = (result) => {
    switch (result) {
      case "win":
        return "bg-gradient-to-r from-green-500 to-emerald-600 text-white";
      case "loss":
        return "bg-gradient-to-r from-red-500 to-rose-600 text-white";
      default:
        return "bg-gradient-to-r from-amber-500 to-orange-600 text-white";
    }
  };

  const getResultIcon = (result) => {
    switch (result) {
      case "win":
        return <Trophy size={16} />;
      case "loss":
        return <Target size={16} />;
      default:
        return <Medal size={16} />;
    }
  };

  const calculateStats = () => {
    const wins = games.filter((game) => game.result === "win").length;
    const losses = games.filter((game) => game.result === "loss").length;
    const draws = games.filter((game) => game.result === "draw").length;
    const winRate =
      games.length > 0 ? Math.round((wins / games.length) * 100) : 0;

    return { wins, losses, draws, winRate, total: games.length };
  };

  const filteredGames = games.filter((game) => {
    const matchesSearch = game.opponent
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesFilter =
      filterResult === "all" || game.result === filterResult;
    return matchesSearch && matchesFilter;
  });

  const stats = calculateStats();

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return "Today";
    if (diffDays === 2) return "Yesterday";
    if (diffDays <= 7) return `${diffDays - 1} days ago`;

    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-white to-purple-100">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-gradient-to-br from-blue-400/20 to-purple-400/20 blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-gradient-to-br from-indigo-400/20 to-blue-400/20 blur-3xl"></div>
        </div>

        <div className="relative py-8">
          <div className="max-w-6xl mx-auto px-4">
            {/* Header Skeleton */}
            <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20 p-6 mb-8">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gray-200 rounded-xl animate-pulse"></div>
                  <div>
                    <div className="w-32 h-6 bg-gray-200 rounded animate-pulse mb-2"></div>
                    <div className="w-24 h-4 bg-gray-200 rounded animate-pulse"></div>
                  </div>
                </div>
                <div className="w-24 h-10 bg-gray-200 rounded-lg animate-pulse"></div>
              </div>
            </div>

            {/* Stats Skeleton */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-white/20"
                >
                  <div className="w-8 h-8 bg-gray-200 rounded-lg animate-pulse mb-3"></div>
                  <div className="w-12 h-8 bg-gray-200 rounded animate-pulse mb-2"></div>
                  <div className="w-16 h-4 bg-gray-200 rounded animate-pulse"></div>
                </div>
              ))}
            </div>

            {/* Game Cards Skeleton */}
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="bg-white/80 backdrop-blur-lg rounded-xl p-6 border border-white/20"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gray-200 rounded-full animate-pulse"></div>
                      <div>
                        <div className="w-32 h-5 bg-gray-200 rounded animate-pulse mb-2"></div>
                        <div className="w-24 h-4 bg-gray-200 rounded animate-pulse"></div>
                      </div>
                    </div>
                    <div className="w-20 h-8 bg-gray-200 rounded-lg animate-pulse"></div>
                  </div>
                  <div className="w-full h-24 bg-gray-200 rounded-lg animate-pulse"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-rose-100 flex items-center justify-center p-4">
        <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20 p-8 max-w-md w-full text-center">
          <div className="p-4 bg-red-100 rounded-full w-fit mx-auto mb-4">
            <AlertTriangle size={32} className="text-red-600" />
          </div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">
            Oops! Something went wrong
          </h3>
          <p className="text-red-600 mb-6">{error}</p>
          <div className="space-y-3">
            <button
              onClick={() => window.location.reload()}
              className="w-full bg-gradient-to-r from-red-500 to-rose-600 text-white py-3 px-6 rounded-xl hover:from-red-600 hover:to-rose-700 transition-all duration-200 flex items-center justify-center space-x-2"
            >
              <RefreshCw size={18} />
              <span>Try Again</span>
            </button>
            <button
              onClick={() => navigate("/lobby")}
              className="w-full bg-gray-100 text-gray-700 py-3 px-6 rounded-xl hover:bg-gray-200 transition-all duration-200 flex items-center justify-center space-x-2"
            >
              <ArrowLeft size={18} />
              <span>Back to Lobby</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-white to-purple-100">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-gradient-to-br from-blue-400/20 to-purple-400/20 blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-gradient-to-br from-indigo-400/20 to-blue-400/20 blur-3xl"></div>
      </div>

      <div className="relative py-8">
        <div className="max-w-6xl mx-auto px-4">
          {/* Header */}
          <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20 p-6 mb-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl">
                  <Gamepad2 className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-800">
                    Game History
                  </h1>
                  <p className="text-gray-600">
                    Track your gaming journey and progress
                  </p>
                </div>
              </div>
              <button
                onClick={() => navigate("/lobby")}
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-xl transition-all duration-200 flex items-center space-x-2"
              >
                <ArrowLeft size={18} />
                <span className="hidden sm:inline">Back to Lobby</span>
              </button>
            </div>
          </div>

          {/* Stats Dashboard */}
          {games.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <div className="flex items-center justify-between mb-2">
                  <Trophy className="w-8 h-8 text-yellow-500" />
                  <TrendingUp className="w-5 h-5 text-gray-400" />
                </div>
                <div className="text-2xl font-bold text-gray-800">
                  {stats.wins}
                </div>
                <div className="text-sm text-gray-600">Wins</div>
              </div>

              <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <div className="flex items-center justify-between mb-2">
                  <Target className="w-8 h-8 text-red-500" />
                  <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded-full">
                    {Math.round((stats.losses / stats.total) * 100)}%
                  </span>
                </div>
                <div className="text-2xl font-bold text-gray-800">
                  {stats.losses}
                </div>
                <div className="text-sm text-gray-600">Losses</div>
              </div>

              <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <div className="flex items-center justify-between mb-2">
                  <Medal className="w-8 h-8 text-amber-500" />
                  <span className="text-xs bg-amber-100 text-amber-600 px-2 py-1 rounded-full">
                    {Math.round((stats.draws / stats.total) * 100)}%
                  </span>
                </div>
                <div className="text-2xl font-bold text-gray-800">
                  {stats.draws}
                </div>
                <div className="text-sm text-gray-600">Draws</div>
              </div>

              <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <div className="flex items-center justify-between mb-2">
                  <Award className="w-8 h-8 text-green-500" />
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${
                      stats.winRate >= 70
                        ? "bg-green-100 text-green-600"
                        : stats.winRate >= 50
                        ? "bg-yellow-100 text-yellow-600"
                        : "bg-red-100 text-red-600"
                    }`}
                  >
                    {stats.winRate}%
                  </span>
                </div>
                <div className="text-2xl font-bold text-gray-800">
                  {stats.total}
                </div>
                <div className="text-sm text-gray-600">Total Games</div>
              </div>
            </div>
          )}

          {/* Search and Filter */}
          {games.length > 0 && (
            <div className="bg-white/80 backdrop-blur-lg rounded-xl p-4 mb-6 border border-white/20">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    size={18}
                  />
                  <input
                    type="text"
                    placeholder="Search by opponent name..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-200"
                  />
                </div>
                <div className="relative">
                  <Filter
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    size={18}
                  />
                  <select
                    value={filterResult}
                    onChange={(e) => setFilterResult(e.target.value)}
                    className="pl-10 pr-8 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-200 appearance-none cursor-pointer"
                  >
                    <option value="all">All Results</option>
                    <option value="win">Wins Only</option>
                    <option value="loss">Losses Only</option>
                    <option value="draw">Draws Only</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Games List */}
          {filteredGames.length === 0 ? (
            <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20 p-12 text-center">
              <div className="p-4 bg-gray-100 rounded-full w-fit mx-auto mb-6">
                <Gamepad2 size={48} className="text-gray-400" />
              </div>
              {games.length === 0 ? (
                <>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">
                    No Games Yet
                  </h3>
                  <p className="text-gray-600 mb-8">
                    Start your gaming journey and build your history!
                  </p>
                  <button
                    onClick={() => navigate("/lobby")}
                    className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-8 py-3 rounded-xl hover:from-indigo-600 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center space-x-2 mx-auto"
                  >
                    <Gamepad2 size={18} />
                    <span>Start Playing</span>
                  </button>
                </>
              ) : (
                <>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">
                    No Matches Found
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Try adjusting your search or filter criteria
                  </p>
                  <button
                    onClick={() => {
                      setSearchTerm("");
                      setFilterResult("all");
                    }}
                    className="text-indigo-600 hover:text-indigo-700 font-medium"
                  >
                    Clear Filters
                  </button>
                </>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredGames.map((game, index) => (
                <div
                  key={index}
                  className="bg-white/80 backdrop-blur-lg rounded-xl border border-white/20 p-6 hover:shadow-xl transition-all duration-300 group"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                        {game.opponent.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <User size={16} className="text-gray-500" />
                          <span className="font-semibold text-gray-800">
                            vs{" "}
                            <span className="text-indigo-600">
                              {game.opponent}
                            </span>
                          </span>
                        </div>
                        <div className="flex items-center space-x-2 text-sm text-gray-500">
                          <Calendar size={14} />
                          <span>{formatDate(game.createdAt)}</span>
                          <span className="text-gray-300">•</span>
                          <span>
                            {new Date(game.createdAt).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div
                      className={`px-4 py-2 rounded-lg font-semibold text-sm flex items-center space-x-2 ${getResultBadgeStyle(
                        game.result
                      )}`}
                    >
                      {getResultIcon(game.result)}
                      <span>{game.result.toUpperCase()}</span>
                    </div>
                  </div>

                  <div className="border-t border-gray-100 pt-4">
                    <GameDetails game={game} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default History;

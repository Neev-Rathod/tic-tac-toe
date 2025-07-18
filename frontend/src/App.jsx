import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import io from "socket.io-client";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { GameProvider } from "./context/GameContext";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Lobby from "./pages/Lobby";
import GameRoom from "./pages/GameRoom";
import History from "./pages/History";

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

const socket = io(import.meta.env.VITE_API_URL);

function App() {
  return (
    <AuthProvider>
      <GameProvider socket={socket}>
        <div className="min-h-screen bg-gray-50">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/lobby"
              element={
                <ProtectedRoute>
                  <Lobby socket={socket} />
                </ProtectedRoute>
              }
            />
            <Route
              path="/game/:roomCode"
              element={
                <ProtectedRoute>
                  <GameRoom socket={socket} />
                </ProtectedRoute>
              }
            />
            <Route
              path="/history"
              element={
                <ProtectedRoute>
                  <History />
                </ProtectedRoute>
              }
            />
            <Route path="/" element={<Navigate to="/lobby" replace />} />
          </Routes>
        </div>
      </GameProvider>
    </AuthProvider>
  );
}

export default App;

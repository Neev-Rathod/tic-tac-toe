import React, { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";
import axios from "axios";

const GameContext = createContext();

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error("useGame must be used within a GameProvider");
  }
  return context;
};

export const GameProvider = ({ children, socket }) => {
  const { username, token } = useAuth();

  // Game state
  const [roomCode, setRoomCode] = useState("");
  const [opponent, setOpponent] = useState("");
  const [players, setPlayers] = useState([]);
  const [board, setBoard] = useState(Array(9).fill(null));
  const [myTurn, setMyTurn] = useState(false);
  const [moves, setMoves] = useState([]);
  const [result, setResult] = useState(null);
  const [mySymbol, setMySymbol] = useState("X");
  const [winner, setWinner] = useState(null);

  // Chat state
  const [messages, setMessages] = useState([]);

  // Room permissions
  const [allowedUsers, setAllowedUsers] = useState([]);
  const [allUsers, setAllUsers] = useState([]);

  // Get all users for permissions
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/user`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setAllUsers(response.data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    if (token) {
      fetchUsers();
    }
  }, [token]);

  // Socket event listeners

  useEffect(() => {
    if (!username) return;

    socket.on("startGame", (players) => {
      setPlayers(players);
      setMySymbol(players[0] === username ? "X" : "O");
      setMyTurn(players[0] === username);
      setBoard(Array(9).fill(null));
      setMoves([]);
      setResult(null);
      setOpponent(players.find((p) => p !== username));
    });

    socket.on("moveMade", (gameState) => {
      setBoard(gameState.board);
      setMoves(gameState.moves);
      setMyTurn(gameState.currentPlayer === username);
    });

    socket.on("gameOver", (gameResult) => {
      setResult(gameResult.result);
      setBoard(gameResult.board);
      setMoves(gameResult.moves);
      saveGame(gameResult);
      setWinner(gameResult.winner);
    });

    socket.on("newMessage", (messageData) => {
      setMessages((prev) => [...prev, messageData]);
    });

    return () => {
      socket.off("startGame");
      socket.off("moveMade");
      socket.off("gameOver");
      socket.off("newMessage");
    };
  }, [username, socket]);

  const createRoom = (onSuccess) => {
    socket.emit(
      "createRoom",
      {
        username,
        allowedUsers: allowedUsers.length > 0 ? allowedUsers : null,
      },
      (code) => {
        setRoomCode(code);
        setPlayers([username]);
        setMessages([]);
        resetPermissions();
        onSuccess(code);
      }
    );
  };

  const joinRoom = (code, onSuccess, onError) => {
    socket.emit("joinRoom", { roomCode: code, username }, (resp) => {
      if (resp.error) {
        onError(resp.error);
        return;
      }
      setRoomCode(code);
      setPlayers([username]);
      setMessages([]);
      resetPermissions();
      onSuccess();
    });
  };

  const makeMove = (cellIndex) => {
    if (!myTurn || board[cellIndex] || result) return;

    const move = {
      cell: cellIndex,
      player: username,
      symbol: mySymbol,
      moveNum: moves.length + 1,
    };

    socket.emit("makeMove", { roomCode, move });
  };

  const sendMessage = (message) => {
    if (message.trim()) {
      socket.emit("sendMessage", {
        roomCode,
        message,
        sender: username,
      });
    }
  };

  const saveGame = async (gameResult) => {
    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/game/save`,
        {
          opponent,
          result: gameResult.result,
          steps: gameResult.moves,
          winner: gameResult.winner,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (error) {
      console.error("Error saving game:", error);
    }
  };

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setMoves([]);
    setResult(null);
    setMyTurn(false);
    setOpponent("");
    setPlayers([]);
    setRoomCode("");
    setMessages([]);
  };

  const resetPermissions = () => {
    setAllowedUsers([]);
  };

  const addAllowedUser = (user) => {
    if (!allowedUsers.includes(user) && user !== username) {
      setAllowedUsers([...allowedUsers, user]);
    }
  };

  const removeAllowedUser = (user) => {
    setAllowedUsers(allowedUsers.filter((u) => u !== user));
  };

  const value = {
    // Game state
    roomCode,
    opponent,
    players,
    board,
    myTurn,
    moves,
    result,
    mySymbol,
    winner,

    // Chat
    messages,

    // Permissions
    allowedUsers,
    allUsers,

    // Actions
    createRoom,
    joinRoom,
    makeMove,
    sendMessage,
    resetGame,
    addAllowedUser,
    removeAllowedUser,
  };

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
};

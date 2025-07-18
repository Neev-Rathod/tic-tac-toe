const { createRoom, getRoom } = require("../utils/roomManager");
const { checkWinner, isBoardFull } = require("../utils/gameLogic");

const socketHandler = (io) => {
  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    socket.on("createRoom", ({ username, allowedUsers }, callback) => {
      const roomCode = createRoom(username, allowedUsers);
      socket.join(roomCode);
      callback(roomCode);
    });

    socket.on("joinRoom", ({ roomCode, username }, callback) => {
      const room = getRoom(roomCode);

      if (!room) {
        return callback({ error: "Room not found" });
      }

      if (room.players.length >= 2) {
        return callback({ error: "Room is full" });
      }

      if (room.allowedUsers && room.allowedUsers.length > 0) {
        if (!room.allowedUsers.includes(username)) {
          return callback({
            error: "You are not authorized to join this room",
          });
        }
      }

      room.players.push(username);
      room.currentPlayer = room.players[0]; // X always starts
      room.gameStarted = true;
      socket.join(roomCode);

      // Send existing messages to the new player
      socket.emit("existingMessages", room.messages);

      // Start the game when both players are present
      io.to(roomCode).emit("startGame", room.players);
      callback({ success: true });
    });

    socket.on("makeMove", ({ roomCode, move }) => {
      const room = getRoom(roomCode);
      if (!room || room.gameOver) return;

      if (room.currentPlayer !== move.player) {
        console.log(`Invalid move: not ${move.player}'s turn`);
        return;
      }

      if (room.board[move.cell] !== null) {
        console.log(`Invalid move: cell ${move.cell} already occupied`);
        return;
      }

      room.board[move.cell] = move.symbol;
      room.moves.push(move);

      const winner = checkWinner(room.board);
      const boardFull = isBoardFull(room.board);

      if (winner || boardFull) {
        room.gameOver = true;

        const gameResult = {
          board: room.board,
          moves: room.moves,
          winner: winner ? move.player : null,
          result: winner ? "win" : "draw",
        };

        room.players.forEach((player) => {
          const playerResult = {
            ...gameResult,
            result: winner
              ? winner === move.player
                ? player === move.player
                  ? "win"
                  : "loss"
                : player === move.player
                ? "loss"
                : "win"
              : "draw",
          };

          const playerSockets = io.sockets.adapter.rooms.get(roomCode);
          if (playerSockets) {
            playerSockets.forEach((socketId) => {
              const playerSocket = io.sockets.sockets.get(socketId);
              if (playerSocket) {
                playerSocket.emit("gameOver", playerResult);
              }
            });
          }
        });
      } else {
        room.currentPlayer = room.players.find((p) => p !== room.currentPlayer);

        io.to(roomCode).emit("moveMade", {
          board: room.board,
          moves: room.moves,
          currentPlayer: room.currentPlayer,
        });
      }
    });

    socket.on("sendMessage", ({ roomCode, message, sender }) => {
      const room = getRoom(roomCode);
      if (!room) return;

      const messageData = {
        message,
        sender,
        timestamp: new Date().toISOString(),
      };

      room.messages.push(messageData);
      io.to(roomCode).emit("newMessage", messageData);
    });

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });
  });
};

module.exports = socketHandler;

const rooms = {};

const createRoom = (username, allowedUsers) => {
  const roomCode = Math.floor(100000 + Math.random() * 900000).toString();

  rooms[roomCode] = {
    players: [username],
    board: Array(9).fill(null),
    moves: [],
    messages: [],
    allowedUsers: allowedUsers || null,
    creator: username,
    currentPlayer: null,
    gameStarted: false,
    gameOver: false,
  };

  return roomCode;
};

const getRoom = (roomCode) => {
  return rooms[roomCode];
};

const deleteRoom = (roomCode) => {
  delete rooms[roomCode];
};

const cleanupEmptyRooms = () => {
  Object.keys(rooms).forEach((roomCode) => {
    const room = rooms[roomCode];
    if (room.players.length === 0) {
      delete rooms[roomCode];
    }
  });
};

// Cleanup empty rooms every minute
setInterval(cleanupEmptyRooms, 60000);

module.exports = {
  createRoom,
  getRoom,
  deleteRoom,
  cleanupEmptyRooms,
};

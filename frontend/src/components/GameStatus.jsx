import { useGame } from "../context/GameContext";
import { useNavigate } from "react-router-dom";
const GameStatus = () => {
  const { opponent, myTurn, result, resetGame, winner } = useGame();
  const navigate = useNavigate();
  console.log(opponent, myTurn, result);

  const handlePlayAgain = () => {
    resetGame();
    navigate("/lobby");
  };

  if (result) {
    return (
      <div className="text-center">
        <div className="text-2xl font-bold mb-4">
          {result === "draw" ? (
            <span className="text-yellow-600">🤝 IT'S A DRAW! 🤝</span>
          ) : winner.winner === opponent ? (
            <span className="text-red-600">😞 YOU LOST 😞</span>
          ) : (
            <span className="text-green-600">🎉 YOU WON! 🎉</span>
          )}
        </div>
        <button
          onClick={handlePlayAgain}
          className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Play Again
        </button>
      </div>
    );
  }

  return (
    <div className="text-center">
      <div className="text-lg mb-2">
        {opponent ? (
          <>
            <div className="text-gray-600">Playing against:</div>
            <div className="font-bold text-xl">{opponent}</div>
          </>
        ) : (
          <div className="text-gray-500">Waiting for opponent...</div>
        )}
      </div>

      {opponent && (
        <div className="text-lg">
          {myTurn ? (
            <span className="text-green-600 font-semibold">🎯 Your turn</span>
          ) : (
            <span className="text-orange-500 font-semibold">
              ⏳ Opponent's turn
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default GameStatus;

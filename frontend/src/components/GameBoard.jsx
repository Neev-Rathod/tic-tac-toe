import { useGame } from "../context/GameContext";

const GameBoard = () => {
  const { board, makeMove, myTurn, result } = useGame();

  const handleCellClick = (index) => {
    makeMove(index);
  };

  return (
    <div className="grid grid-cols-3 gap-2 mx-auto w-fit">
      {board.map((cell, index) => (
        <button
          key={index}
          className={`
            w-16 h-16 border-2 border-gray-300 text-2xl font-bold
            flex items-center justify-center
            transition-colors duration-200
            ${
              !cell && myTurn && !result
                ? "hover:bg-blue-50 cursor-pointer"
                : "cursor-not-allowed"
            }
            ${cell === "X" ? "text-blue-600" : "text-red-600"}
          `}
          onClick={() => handleCellClick(index)}
          disabled={!myTurn || !!cell || !!result}
        >
          {cell}
        </button>
      ))}
    </div>
  );
};

export default GameBoard;

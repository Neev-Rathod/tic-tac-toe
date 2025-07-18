import React, { useState } from "react";
const GameDetails = ({ game }) => {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <div>
      <button
        onClick={() => setShowDetails(!showDetails)}
        className="text-blue-500 hover:text-blue-700 text-sm font-medium flex items-center space-x-1"
      >
        <span>{showDetails ? "Hide" : "View"} Game Details</span>
        <svg
          className={`w-4 h-4 transition-transform ${
            showDetails ? "rotate-180" : ""
          }`}
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
      </button>

      {showDetails && (
        <div className="mt-3 p-3 bg-gray-50 rounded border">
          {game.steps && game.steps.length > 0 ? (
            <div>
              <h4 className="font-semibold mb-2 text-sm">Game Moves:</h4>
              <div className="space-y-1">
                {game.steps.map((step, index) => (
                  <div
                    key={index}
                    className="text-sm flex items-center space-x-2 py-1"
                  >
                    <span className="w-6 h-6 bg-blue-100 text-blue-800 rounded-full flex items-center justify-center text-xs font-bold">
                      {step.moveNum}
                    </span>
                    <span className="font-medium">{step.player}</span>
                    <span className="text-gray-600">played</span>
                    <span className="font-mono bg-white px-2 py-1 rounded border text-lg">
                      {step.symbol}
                    </span>
                    <span className="text-gray-600">at position</span>
                    <span className="font-semibold">{step.cell + 1}</span>
                  </div>
                ))}
              </div>

              {game.winner && (
                <div className="mt-3 pt-2 border-t text-sm">
                  <span className="text-gray-600">Winner: </span>
                  <span className="font-semibold text-green-600">
                    {game.winner}
                  </span>
                </div>
              )}
            </div>
          ) : (
            <p className="text-gray-500 italic text-sm">
              No moves recorded for this game
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default GameDetails;

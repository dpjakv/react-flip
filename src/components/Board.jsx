import { useEffect, useState } from "react";
const [MIN_SIZE, MAX_SIZE] = [2, 8];
const Board = () => {
  const [gridSize, setGridSize] = useState(4);
  const [card, setCard] = useState([]);
  const [moveCount, setMoveCount] = useState(0);

  const [flipped, setFlipped] = useState([]);
  const [solved, setSolved] = useState([]);
  const [disabled, setDisabled] = useState(false);
  const [won, setWon] = useState(false);

  const handleGridChange = (e) => {
    let gridVal = Number(e.target.value);
    if (gridVal >= MIN_SIZE && gridVal <= MAX_SIZE) setGridSize(gridVal);
  };

  const initializeGame = () => {
    setFlipped([]);
    setSolved([]);
    setDisabled(false);
    setMoveCount(0);

    const totalCards = gridSize * gridSize;
    const pairCount = Math.floor(totalCards / 2);
    const numbers = [...Array(pairCount).keys()].map((x) => x + 1);
    const shuffledCards = [...numbers, ...numbers]
      .sort(() => Math.random() - 0.5)
      .map((num, index) => ({ id: index, num }));
    setCard(shuffledCards);
    setWon(false);
  };

  useEffect(() => {
    initializeGame();
  }, [gridSize]);

  useEffect(() => {
    if (solved.length == card.length) {
      setWon(true);
    } else if (solved.length == 0 && card.length == gridSize * gridSize) {
      setWon(false);
    }
  }, [solved, card]);

  const checkMatch = (newCard) => {
    const [prevCard] = flipped;
    if (card[prevCard].num == card[newCard].num) {
      setSolved([...solved, prevCard, newCard]);
      return true;
    }
    return false;
  };

  const resetFlip = () => {
    setFlipped([]);
    setDisabled(false);
  };

  const handleClick = (id) => {
    if (disabled || won) return;

    setMoveCount(moveCount + 1);

    if (flipped.length == 0) {
      setFlipped([id]);
      return;
    }

    if (flipped.length == 1) {
      setDisabled(true);
      if (id == flipped[0]) {
        resetFlip();
      } else {
        setFlipped([flipped[0], id]);
        if (checkMatch(id)) {
          resetFlip();
        } else {
          setTimeout(() => {
            resetFlip();
          }, 1000);
        }
      }
    }
  };

  const isFlipped = (id) => {
    return flipped.includes(id) || isSolved(id);
  };

  const isSolved = (id) => {
    return solved.includes(id);
  };

  return (
    <div className="flex flex-col items-center justify-start min-h-screen bg-gray-100 p-2">
      {/*Header */}
      <h1 className="text-6xl font-light tracking-widest">FLIP</h1>
      <h2 className="text-base font-light mb-6">A Memory Game</h2>
      <div className="mb-4">
        <label htmlFor="gridSize" className="mr-2">
          Grid Size (max {MAX_SIZE}):{" "}
        </label>
        <input
          type="number"
          id="gridSize"
          min={MIN_SIZE}
          max={MAX_SIZE}
          value={gridSize}
          onChange={handleGridChange}
          className="border-2 border-gray-300 px-2 py-1"
        />
        <span className="px-3">No. of moves: {moveCount}</span>
      </div>
      {/*Board */}
      <div
        className="grid gap-1 mb-4"
        style={{
          gridTemplateColumns: `repeat(${gridSize}, minmax(0, 1fr))`,
          width: `min(100%, ${gridSize * 5}rem)`,
        }}
      >
        {card.map((card) => {
          return (
            <div
              className={`aspect-square flex items-center justify-center text-xl rounded-lg font-bold cursor-pointer transition-all duration-300 ${
                isFlipped(card.id)
                  ? isSolved(card.id)
                    ? "bg-green-500 text-white"
                    : "bg-blue-500 text-white"
                  : "bg-gray-300 text-gray-700"
              }`}
              key={card.id}
              onClick={() => handleClick(card.id)}
            >
              {isFlipped(card.id) ? card.num : "?"}
            </div>
          );
        })}
      </div>
      {/*Win Message*/}
      {won && (
        <div className="mt-4 text-3xl font-semibold text-orange-500 animate-bounce">
          You Won!!
        </div>
      )}
      {/*Reset/ Play Again*/}
      <button
        className="mt-4 px-4 py-2 bg-orange-400 text-gray-50 rounded hover:bg-green-600 transition-colors duration-500"
        onClick={initializeGame}
      >
        {won ? "Play Again" : "Reset"}
      </button>
    </div>
  );
};

export default Board;

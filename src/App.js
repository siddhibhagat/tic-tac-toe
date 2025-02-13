import { useState } from "react";

// let isX = true;

function Square({ position, value, handleSquareClick, winnerPosition }) {
  let classSelected = "";
  if (winnerPosition?.includes(parseInt(position))) {
    classSelected = "winner-color";
  }
  console.log(winnerPosition, position, classSelected);
  return (
    <button className="square" onClick={handleSquareClick}>
      <span className={classSelected}>{value}</span>
    </button>
  );
}

function Board({ isX, squares, onPlay, currentMove }) {
  // const [squares, setSquares] = useState(Array(9).fill(null));
  function handleClick(i, row, column) {
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    const nextSquares = squares.slice();
    nextSquares[i] = isX ? "X" : "O";
    const position = [row, column];
    onPlay(nextSquares, position);
  }

  const winnerDetails = calculateWinner(squares);
  console.log("winnerDetails", winnerDetails);
  const winner = winnerDetails?.winner;
  let status = "";
  if (winner) {
    status = `Winner: ${winner}`;
  } else if (currentMove != 9) {
    status = `Next Player: ${isX ? `X` : `O`}`;
  } else {
    status = `Match Draw`;
  }
  return (
    <>
      <div className="status">{status}</div>
      {[0, 3, 6].map((row) => {
        return (
          <div className="board-row" key={row}>
            {[0, 1, 2].map((column) => {
              const position = row + column;
              return (
                <Square
                  key={position}
                  position={position}
                  value={squares[position]}
                  handleSquareClick={() =>
                    handleClick(position, row / 3, column)
                  }
                  winnerPosition={winnerDetails?.position}
                />
              );
            })}
          </div>
        );
      })}
      {/* <div className="board-row">
        <Square value={squares[0]} handleSquareClick={() => handleClick(0)} />
        <Square value={squares[1]} handleSquareClick={() => handleClick(1)} />
        <Square value={squares[2]} handleSquareClick={() => handleClick(2)} />
      </div>
      <div className="board-row">
        <Square value={squares[3]} handleSquareClick={() => handleClick(3)} />
        <Square value={squares[4]} handleSquareClick={() => handleClick(4)} />
        <Square value={squares[5]} handleSquareClick={() => handleClick(5)} />
      </div>
      <div className="board-row">
        <Square value={squares[6]} handleSquareClick={() => handleClick(6)} />
        <Square value={squares[7]} handleSquareClick={() => handleClick(7)} />
        <Square value={squares[8]} handleSquareClick={() => handleClick(8)} />
      </div> */}
    </>
  );
}

export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const [movePosition, setmovePosition] = useState([Array(9).fill(null)]);
  const isX = currentMove % 2 === 0;
  let currentSquares = history[currentMove];

  function handlePlay(nextSquares, position) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    console.log(nextHistory);
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
    const nextPosition = [...movePosition.slice(0, currentMove + 1), position];
    setmovePosition(nextPosition);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  const moves = history.map((squares, move) => {
    let text = "";
    if (move > 0) {
      text = `Go to move #${move}: (${movePosition[move]})`;
    } else {
      text = `Go to game start`;
    }
    let list;
    if (move == currentMove) {
      list = (
        <li key={move}>
          <span className="code">{text}</span>
        </li>
      );
    } else {
      list = (
        <li key={move}>
          <button onClick={() => jumpTo(move)}>{text}</button>
        </li>
      );
    }

    return list;
  });

  return (
    <div className="game">
      <div className="game-board">
        <Board
          isX={isX}
          squares={currentSquares}
          onPlay={handlePlay}
          currentMove={currentMove}
        />
      </div>
      <div className="game-info">
        <ol>{moves}</ol>
      </div>
    </div>
  );
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return { winner: squares[a], position: [a, b, c] };
    }
  }
  return null;
}

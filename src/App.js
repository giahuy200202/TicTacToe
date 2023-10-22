import { useState } from "react";
import $ from "jquery";

function Square({ value, indColor, onSquareClick }) {
  return (
    <button className={`square ${indColor}`} onClick={onSquareClick}>
      {value}
    </button>
  );
}

function Board({ xIsNext, squares, onPlay }) {
  function handleClick(i) {
    const objWinner = calculateWinner(squares);
    if (objWinner.winner !==null || squares[i]) {
      return;
    }
    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[i] = "X";
    } else {
      nextSquares[i] = "O";
    }
    onPlay(nextSquares, i, nextSquares[i]);
  }

  const objWinner = calculateWinner(squares);
  let status;
  if (objWinner.winner!==null) {
    status = "Winner: " + objWinner.winner;
    for(let i=0; i<objWinner.path.length; i++){
      console.log(`.square ${objWinner.path[i]}`);
      $(`.${objWinner.path[i]}`).css('background-color', 'yellow');
    }
   
  } else {
    $(`.square`).css('background-color', '#fff');
    if(!squares.includes(null)){
      status = "Draw";
    }
    else{
      status = "Next player: " + (xIsNext ? "X" : "O");
    }
  }
    return (
      <>
        <div className="status">{status}</div>
        {[0, 3, 6].map((row, indexRow) => (
          <div className="board-row" key={indexRow}>
            {[0, 1, 2].map((column, indexColumn) => (
              <Square
                // id={`${row + column}`}
                className="abc"
                key={indexColumn}
                value={squares[row + column]}
                indColor = {row+column}
                onSquareClick={() => handleClick(row + column)}
              />
            ))}
          </div>
        ))}
      </>
    );

}

export default function Game() {
  const [isAscending, setIsAscending] = useState(true);
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [positionWithPlayerHistory, setPositionWithPlayerHistory] = useState(
    []
  );

  const [currentMove, setCurrentMove] = useState(0);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];

  function handlePlay(nextSquares, index, player) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    const nextPositionWithPlayerHistory = [
      ...positionWithPlayerHistory.slice(0, currentMove),
      { index: index, player: player },
    ];
    setHistory(nextHistory);
    setPositionWithPlayerHistory(nextPositionWithPlayerHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  const moves = history.map((squares, move) => {
    let description;
    let moreInfoPositionAndPlayer = '';
    if (move > 0) {
      moreInfoPositionAndPlayer = `at position (${parseInt(
        positionWithPlayerHistory[move - 1].index / 3
      )}, ${positionWithPlayerHistory[move - 1].index % 3}) with player ${
        positionWithPlayerHistory[move - 1].player
      }`;
      description = `Go to move #${move} ${moreInfoPositionAndPlayer}`;
    } else {
      description = "Go to game start";
    }
    return (
      <li key={move}>
        {currentMove === move ? (
          <div className="current-move-text">{`You are at move #${move} ${moreInfoPositionAndPlayer}`}</div>
        ) : (
          <button onClick={() => jumpTo(move)}>{description}</button>
        )}
      </li>
    );
  });

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
        <button
          style={{ marginTop: "1rem" }}
          onClick={() => setIsAscending((prevState) => !prevState)}
        >
          {isAscending
            ? "Moves with descending order"
            : "Moves with ascending order"}
        </button>
      </div>
      <div className="game-info">
        <ol>{isAscending ? moves : moves.reverse()}</ol>
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
      return { winner: squares[a], path: lines[i] };
    }
  }
  return { winner: null, path: null };
}

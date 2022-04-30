import React from "react";
import { createRoot } from "react-dom/client";
import "./index.css";

function Square(props) {
  return (
    <button className="square" onClick={props.onClick}>
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  renderSquare(i) {
    return (
      <Square
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
      />
    );
  }

  render() {
    return (
      <div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{ 
        squares: Array(9).fill(null), 
        lastPosition: {
          row: null,
          col: null
        } 
      }],
      stepNumber: 0,
      xIsNext: true
    };
  }

  handleClick(i) {
    // remove previous histories because they get overwritten
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    // creates a shadow copy
    const squares = current.squares.slice();

    // ignore a click if someone has won the game or if a Square is already filled
    if (calculateWinner(squares) || squares[i]) return;

    squares[i] = this.state.xIsNext ? "X" : "O";

    this.setState({
      history: history.concat({ 
        squares, 
        lastPosition: {
          row: (Math.floor(i/3))+1, 
          col: (Math.floor(i%3))+1} 
        }),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0
    })
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);

    const moves = history.map((step, move) => {
      const desc = move ? "Go to move #" + move : "Go to game start";
      
      // React tutorial challenge 1
      // Display the location for each move in the format (col, row) in the move history list.
      const {row, col} = step.lastPosition;
      const position = row ? `row: ${row} col: ${col}` : null;

      // React tutorial challenge 2
      // Bold the currently selected item in the move list.
      const isSelected = move === this.state.stepNumber;

      return (
        <li key={move}>
          <button className={isSelected? 'selected-move': ''} onClick={() => this.jumpTo(move)}>{desc}</button>
          <span className="position">{position}</span>
        </li>
      );
    });

    let status;

    if (winner) {
      status = "Winner: " + winner;
    } else {
      status = "Next player: " + (this.state.xIsNext ? "X" : "O");
    }
    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div className="status"> {status} </div>
          <ol> {moves} </ol>
        </div>
      </div>
    );
  }
}

function calculateWinner(squares) {
  // All possible wining line combinations
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

  // loop through each line
  for (let i = 0; i < lines.length; i++) {
    // extracting each item into a seperate variable
    const [a, b, c] = lines[i];
    // checks first item matches the second
    // first matches the third
    // if first item is null then && fails
    // hence 'squares[a] && squares[a]'
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}

// ========================================

const root = createRoot(document.getElementById("root"));
root.render(<Game />);

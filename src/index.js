import { Component } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";

function Square(props) {
  return (
    <button className={'square' + (props.isWinningBlock ? ' highlighted' : '')} onClick={props.onClick}>
      {props.value}
    </button>
  );
}

class Board extends Component {
  renderSquare(i) {
    return (
      <Square
        key={i}
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
        isWinningBlock={this.props.winningSequence.includes(i)}
      />
    );
  }

  render() {
    // React tutorial challenge 3
    // Rewrite Board to use two loops to make the squares instead of hardcoding them.

    // start indexes of each row
    const arr = [0, 3, 6];

    return (
      <div>
        {arr.map((a, b) => <div key={b} className="board-row">{arr.map((x, y) => this.renderSquare(a+y))}</div>)}
      </div>
    );
  }
}

class Game extends Component {
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
      xIsNext: true,
      isHistoryReversed: false
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
          <button className={'move-btn' + (isSelected? ' selected-move': '')} onClick={() => this.jumpTo(move)}>{desc}</button>
          {position ? 
          <span className="position">{position}</span> : 
          <button className="move-btn" onClick={
            () => this.setState({isHistoryReversed: !this.state.isHistoryReversed})
          }>History: {this.state.isHistoryReversed ? 'desc' : 'asc'}</button>}
        </li>
      );
    });

    // React tutorial challenge 4
    // Add a toggle button that lets you sort the moves in either ascending or descending order.
    if(this.state.isHistoryReversed) {
      // This is a simple solution.
      // I was messing with map function for around 2 hours.
      moves.reverse();
      moves.unshift(moves.pop());
    }

    let status;

    if (winner) {
      status = "Winner: " + winner.winner;
    } else {
      status = "Next player: " + (this.state.xIsNext ? "X" : "O");
    }
    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
            // React tutorial challenge 5
            // When someone wins, highlight the three squares that caused the win.
            winningSequence={winner ? winner.winningSequence : []}
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
  // All possible winning line combinations
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
      return {winner: squares[a], winningSequence: lines[i]};
    }
  }
  return null;
}

// ========================================

const root = createRoot(document.getElementById("root"));
root.render(<Game />);

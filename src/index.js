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
        key={i.toString()}
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
      // adding array 1 num to array 2 indexes
      <div className="game-board">
        <div>
          {arr.map((a, b) => <div key={b} className="board-row">{arr.map((x, y) => this.renderSquare(a+y))}</div>)}
        </div>
      </div>
    );
  }
}

function MovesList(props) {
  const { history, stepNumber, isHistoryReversed, toggleHistory, jumpTo } = props;

  const moves = history.map((step, move) => {
    const desc = move ? "Go to move #" + move : "Go to game start";
    
    // React tutorial challenge 1
    // Display the location for each move in the format (col, row) in the move history list.
    const {row, col} = step.lastPosition;
    const position = row ? `row: ${row} col: ${col}` : null;

    // React tutorial challenge 2
    // Bold the currently selected item in the move list.
    const isSelected = move === stepNumber;

    return (
      <li key={move}>
        <button className={'move-btn' + (isSelected? ' selected-move': '')} onClick={() => {jumpTo(move)}}>{desc}</button>
        {position ? 
        <span className="position">{position}</span> : 
        <button className="move-btn" onClick={toggleHistory}>History: {isHistoryReversed ? 'desc' : 'asc'}</button>}
      </li>
    );
  });

  // React tutorial challenge 4
  // Add a toggle button that lets you sort the moves in either ascending or descending order.
  if(isHistoryReversed) {
    // This is a simple solution.
    // I was messing with map function for around 2 hours.
    moves.reverse();
    // to move the menu buttons to top.
    moves.unshift(moves.pop());
  }

  return moves;
}

function GameInfo({ winner, xIsNext, ...passedAsProps }) {
  const { history, stepNumber } = passedAsProps;

  let status;

  if (winner) {
    status = 'Winner: ' + winner.winner;
  } else {
    // React tutorial challenge 6
    // When no one wins, display a message about the result being a draw.
    // #18
    status = history[stepNumber].squares.includes(null) ? 
    'Next player: ' + (xIsNext ? "X" : "O") :
    'Draw';
  }

  return (
    <div className="game-info">
      <div className="status"> {status} </div>
      <ol>
        <MovesList {...passedAsProps} />
      </ol>
    </div>
  )
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

    this.toggleHistory = this.toggleHistory.bind(this);
    this.jumpTo = this.jumpTo.bind(this);
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

    this.setState(prevState => {
      return {
        history: history.concat({ 
          squares,
          lastPosition: {
              row: (Math.floor(i/3))+1,
              col: (Math.floor(i%3))+1
            }
          }),
        stepNumber: history.length,
        xIsNext: !prevState.xIsNext
      }
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0
    })
  }

  toggleHistory() {
    // Updating state using a function lets us use previous state.
    this.setState(prevState => ({isHistoryReversed: !prevState.isHistoryReversed}));
  }

  render() {
    // #13
    const history = this.state.history.map(({squares, lastPosition}) => 
      ({
        squares: squares.slice(),
        lastPosition: {...lastPosition}
      }));
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);
    
    const { toggleHistory, jumpTo } = this;
    const passedAsProps = {...this.state, history, toggleHistory, jumpTo, winner};

    return (
      <div className="game">
        <Board
          squares={current.squares}
          onClick={(i) => this.handleClick(i)}
          // React tutorial challenge 5
          // When someone wins, highlight the three squares that caused the win.
          winningSequence={winner ? winner.winningSequence : []}
        />
        <GameInfo {...passedAsProps} />
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

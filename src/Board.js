import React from 'react';
import './index.css';
import openSocket from 'socket.io-client';

function Square(props) {
  return (
    <button className="square" onClick={props.onClick}>
      {props.value}
    </button>
  );
}

export default class Board extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      squares: Array(9).fill(null),
      turn: "X",
      player: "X",
    };
    this.setUpSockets();
  }

  setUpSockets() {
    const { gameId } = this.props;
    const { squares } = this.state;
    this.socket = openSocket('http://api.tgt101.com:4444');
    this.socket.emit('getTicBoard', gameId);

    this.socket.on('ticBoard', ({ board, gameId: gid }) => {
      if (gid !== gameId) { // not my game
        return;
      }
      console.log(board);
      this.setState({ squares: board });
      if (board.join('') !== squares.join('')) {
        console.log("Changing turn");
        this.changeTurn();
      }
    });
  }

  handleClick(index) {
    const { gameId } = this.props;
    const { turn, player } = this.state;

    if (turn !== player) { // it is not your turn!!
      console.log("Not your turn", turn, player);
      return;
    }

    const squares = this.state.squares.slice();
    if (calculateWinner(squares) || squares[index]) {
      return;
    }
    this.socket.emit('placeTic', { gameId, player, index });

    squares[index] = player;

    this.setState({ squares });
  }

  changeTurn() {
    this.setState(prev => ({
      turn: prev.turn === "X" ? "O" : "X",
    }));
  }

  renderSquare(i) {
    return (
      <Square
        value={this.state.squares[i]}
        onClick={() => this.handleClick(i)}
      />
    );
  }

  render() {
    const { player, turn } = this.state;
    const winner = calculateWinner(this.state.squares);
    let status;
    if (winner) {
      status = 'Winner: ' + winner;
    } else {
      status = 'Next player: ' + turn;
    }

    return (
      <div>
        <p>
          {status} <br/>
          Playing as { player }
        </p>

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
        <button
          onClick={() => this.setState({ player: "X"})}
        > Play as X </button>
        <button
          onClick={() => this.setState({ player: "O"})}
        > Play as O </button>
      </div>
    );
  }
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
      return squares[a];
    }
  }
  return null;
}
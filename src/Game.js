import React from 'react';
import Board from './Board';

export default class Game extends React.Component {
  render() {
    return (
      <div className="game">
        <div className="game-board">
          <Board gameId="3"/>
          <Board gameId="3"/>
          <Board gameId="4"/>
          <Board gameId="4"/>
        </div>
      </div>
    );
  }
}

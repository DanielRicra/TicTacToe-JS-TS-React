import { StoreState, Player, GameStatus, Stats } from "./types";

function deriveGameStats(state: StoreState, players: Player[]): Stats {

    return {
      playerWithStats: players.map((player) => {
          const wins = state.history.currentRoundGames.filter((game) => {
            return game.status.winner?.id === player.id;
          }).length;

          return {
            ...player,
            wins,
          }
        }),
      ties: state.history.currentRoundGames.filter((game) => {
        return game.status.winner === null;
      }).length,  
    }
}

function deriveGameStatus(state: StoreState, players: Player[]): GameStatus  {
  const currentPlayer = players[state.currentGameMoves.length % 2];

  const winningPatterns = [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9],
    [1, 4, 7],
    [2, 5, 8],
    [3, 6, 9],
    [1, 5, 9],
    [7, 5, 3],
  ];

  let winner: Player | null = null;

  playersMoves:
  for (const player of players) {
    const selectedSquareIds = state.currentGameMoves
          .filter((move) => move.player.id === player.id)
          .map((move) => move.squareId);

    for (const pattern of winningPatterns) {
      if (pattern.every((squareId) => selectedSquareIds.includes(squareId))) {
        winner = player;
        break playersMoves;
      }
    }
  }

  return {
    moves: state.currentGameMoves,
    currentPlayer,
    status: {
      isComplete: !!winner || state.currentGameMoves.length === 9,
      winner,
    }
  }
}

export {
  deriveGameStats,
  deriveGameStatus,
}
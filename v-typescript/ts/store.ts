import { GameStatus, Player, Stats, StoreState } from "./types";

const initialValue: StoreState = {
  currentGameMoves: [],
  history: {
    currentRoundGames: [],  
    allGames: [],
  }
}

class Store extends EventTarget {
  public storageKey: string;
  private players: Player[];

  constructor(storageKey: string, players: Player[]) {
    super();
    this.storageKey = storageKey;
    this.players = players;
  }

  get stats(): Stats {
    const state = this.#getState();

    return {
      playerWithStats: this.players.map((player) => {
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

  get game(): GameStatus {
    const state = this.#getState();

    const currentPlayer = this.players[state.currentGameMoves.length % 2];
    
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
    for (const player of this.players) {
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

  playerMove(squareId: number): void {
    const stateClone: StoreState = structuredClone(this.#getState());

    stateClone.currentGameMoves.push({
      squareId,
      player: this.game.currentPlayer,
    })

    this.#saveState(stateClone);
  }

  reset() {
    const stateClone: StoreState = structuredClone(this.#getState());

    const { moves, status } = this.game;

    if (this.game.status.isComplete) {
      stateClone.history.currentRoundGames.push({
        status,
        moves,
      })
    }

    stateClone.currentGameMoves = [];

    this.#saveState(stateClone);
  }

  newRound() {
    const stateClone: StoreState = structuredClone(this.#getState());
    const { moves, status } = this.game;

    if (this.game.status.isComplete) {
      stateClone.history.currentRoundGames.push({
        status,
        moves,
      })
    }
    
    stateClone.currentGameMoves = [];
    stateClone.history.allGames.push(...stateClone.history.currentRoundGames);
    stateClone.history.currentRoundGames = [];

    this.#saveState(stateClone);
  }

  #getState(): StoreState {
    const state = localStorage.getItem(this.storageKey);
    return state ? JSON.parse(state) : initialValue;
  }

  #saveState(state: StoreState): void {
    localStorage.setItem(this.storageKey, JSON.stringify(state));
    this.dispatchEvent(new Event("state-changed"));
  }
}

export default Store;
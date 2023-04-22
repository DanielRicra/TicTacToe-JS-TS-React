
const initialValues = {
  currentGameMoves: [],
  history: {
    currentRoundGames: [],
    allGames: [],
  }
}

class Store extends EventTarget {
  constructor(key, players) {
    super();
    this.key = key;
    this.players = players;
  }

  get stats() {
    const state = this.#getState();

    return {
      playerWithStats: this.players.map((player) => {
          const wins = state.history.currentRoundGames.filter((game) => {
              return game.status.winner?.id === player.id 
            }).length;
      
          return {
            ...player,
            wins,
          }
        }),
      ties: state.history.currentRoundGames.filter((game) => game.status.winner === null).length,
    }
  }

  get game() {
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

    let winner = null;

    for (const player of this.players) {
      const selectedSquareIds =  state.currentGameMoves.filter((move) => {
          return move.player.id === player.id;
      }).map((move) => move.squareId);

      for (const pattern of winningPatterns) {
        if (pattern.every((squareId) => selectedSquareIds.includes(squareId))) {
          winner = player;         
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

  playerMove(squareId) {
    const stateClone = structuredClone(this.#getState());

    stateClone.currentGameMoves.push({
      squareId,
      player: this.game.currentPlayer,
    });

    this.#saveState(stateClone);
  }

  reset() {
    const stateClone = structuredClone(this.#getState());

    const { moves, status } = this.game;

    if (this.game.status.isComplete) {
      stateClone.history.currentRoundGames.push({
        moves, 
        status,
      });
    }
    stateClone.currentGameMoves = [];

    this.#saveState(stateClone);
  }

   newRound() {
    this.reset();
    const stateClone = structuredClone(this.#getState());
    stateClone.history.allGames.push(...stateClone.history.currentRoundGames);
    stateClone.history.currentRoundGames = [];

    this.#saveState(stateClone);
   }

  #getState() {
    const state = localStorage.getItem(this.key);
    return state ? JSON.parse(state) : initialValues;
  }

  #saveState(stateOrFn) {
    const previousState = this.#getState();
    
    let newState;
    
    switch(typeof stateOrFn) {
      case "function":
        newState = stateOrFn(previousState);
        break;
      case "object":
        newState = stateOrFn;
        break;
      default:{
        throw new Error("Invalid argument stateOrFn");
      }
    }

    localStorage.setItem(this.key, JSON.stringify(newState));
    this.dispatchEvent(new Event("state-change"));
  }
}

export default Store;
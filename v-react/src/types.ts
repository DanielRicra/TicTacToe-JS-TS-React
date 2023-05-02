
export type Player = {
  id: number;
  name: string;
  colorClass: string;
  iconClass: string;
}

export type GameMove = {
  squareId: number;
  player: Player;
}

export type Game = {
  status: {
    winner: null | Player;
  };
  moves:GameMove[];
}

export type StoreState = {
  currentGameMoves: GameMove[];
  history: {
    currentRoundGames: Game[];
    allGames: Game[]
  }
}

export type PlayerStats = {
  wins: number;
} & Player;

export type Stats = {
  playerWithStats: PlayerStats[];
  ties: number;
}

export type GameStatus = {
  moves: GameMove[],
  currentPlayer: Player,
  status: {
    isComplete: boolean,
    winner: Player | null,
  }
}

export type ScoreCardProps = {
  playerName: string;
  score: number;
  backgroundColor: string;
}

export type SquareProps = {
  squareId: number;
  status: GameStatus;
  currentGameMoves: GameMove[];
  setStatus: React.Dispatch<React.SetStateAction<StoreState>>;
}

export type ModalProps = {
  message: string;
  handlePlayAgain: () => void;
}

export type MenuProps = {
  handlePlayAgain: () => void;
  newRound: () => void;
}

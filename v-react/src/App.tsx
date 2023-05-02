import { useState, useEffect} from 'react';

import './App.css'
import Footer from './components/Footer';
import Menu from './components/Menu';
import Modal from './components/Modal';
import ScoreCard from './components/ScoreCard';
import Square from './components/Square';
import { deriveGameStats, deriveGameStatus } from './helpers';
import { Player, StoreState } from './types';

const players: Player[] = [
  {
    id: 1,
    name: "Player 1",
    iconClass: "fa-x",
    colorClass: "turquoise",
  },
  {
    id: 2,
    name: "Player 2",
    iconClass: "fa-o",
    colorClass: "yellow",
  }
]

const initialStatus: StoreState = {
  currentGameMoves: [],
  history: {
    currentRoundGames: [],
    allGames: [],
  }
}

function App() {
  const [status, setStatus] = useState<StoreState>(() => {
    const state = localStorage.getItem('game-status');
    return state ? JSON.parse(state) : initialStatus;
  });

  useEffect(() => {
    localStorage.setItem('game-status', JSON.stringify(status));
  }, [status]);
  

  const gameStats = deriveGameStats(status, players);
  const gameStatus = deriveGameStatus(status, players);

  const handlePlayAgain = () => {
    const { status, moves } = gameStatus;

    if (status.isComplete) {
      setStatus((previous) => {
        return {
          currentGameMoves: [],
          history: {
            ...previous.history,
            currentRoundGames: [
              ...previous.history.currentRoundGames,
              { status: status, moves }
            ]
          }
        }
      });
    } else {
      setStatus((previous) => {
        return {
          ...previous,
          currentGameMoves: [],
        }
      });
    }
  }

  const newRound = () => {
    setStatus((previous) => {
      return {
        currentGameMoves: [],
        history: {
          allGames: [...previous.history.allGames, ...previous.history.currentRoundGames],
          currentRoundGames: [],
        }
      }
    });
  }

  return (
    <>
      <main>
        <div className='grid'>
          <div className='turn'>
            <i className={`fa-solid ${gameStatus.currentPlayer.iconClass} ${gameStatus.currentPlayer.colorClass}`}></i>
            <p className={gameStatus.currentPlayer.colorClass}>{gameStatus.currentPlayer.name}, you're up!</p>
          </div>

          <Menu handlePlayAgain={handlePlayAgain} newRound={newRound} />

          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((id) => (
            <Square
              key={id}
              currentGameMoves={status.currentGameMoves}
              squareId={id}
              setStatus={setStatus}
              status={gameStatus}
            />
          ))}

          <ScoreCard backgroundColor='var(--turquoise)' playerName='Player 1' score={gameStats.playerWithStats[0].wins} />
          <ScoreCard backgroundColor='var(--light-gray)' playerName='Ties' score={gameStats.ties} />
          <ScoreCard backgroundColor='var(--yellow)' playerName='Player 2' score={gameStats.playerWithStats[1].wins} />
        </div>
      </main >

      <Footer />
      {gameStatus.status.isComplete && (
        <Modal
          handlePlayAgain={handlePlayAgain}
          message={gameStatus.status.winner ? `${gameStatus.status.winner.name} Wins!` : 'It is a Tie!'}
        />
      )}
    </>
  )
}

export default App;

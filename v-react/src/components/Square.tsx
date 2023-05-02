import { SquareProps } from "../types";

const Square = ({ status, squareId, setStatus, currentGameMoves }: SquareProps) => {

  const markedSquare = currentGameMoves.find((move) => move.squareId === squareId);

  const handleClick = () => {
    if (markedSquare) {
      return
    }

    setStatus((previous) => {
      return {
        ...previous,
        currentGameMoves: [
          ...previous.currentGameMoves, 
          { player: status.currentPlayer, squareId }
        ],
      }
    })
  }

  return (
    <div className="square shadow" onClick={handleClick}>
      {markedSquare !== undefined && (
        <i className={`fa-solid ${markedSquare.player.colorClass} ${markedSquare.player.iconClass}`}></i>
      )}
    </div>
  )
}

export default Square;
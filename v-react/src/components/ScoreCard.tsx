import { ScoreCardProps } from "../types";


const ScoreCard = ({ playerName, score, backgroundColor }: ScoreCardProps) => {
  return (
    <div className="score shadow" style={{ backgroundColor: backgroundColor }}>
      <p>{playerName}</p>
      <span>{score} Wins</span>
    </div>
  )
}

export default ScoreCard;
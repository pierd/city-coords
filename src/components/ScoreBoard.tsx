interface ScoreBoardProps {
  score: number;
  round: number;
  totalRounds: number;
}

export function ScoreBoard({ score, round, totalRounds }: ScoreBoardProps) {
  return (
    <div className="score-board">
      <div className="score-item">
        <span className="score-value">{score}</span>
        <span className="score-label">Score</span>
      </div>
      <div className="score-divider" />
      <div className="score-item">
        <span className="score-value">
          {round}<span className="score-total">/{totalRounds}</span>
        </span>
        <span className="score-label">Round</span>
      </div>
    </div>
  );
}

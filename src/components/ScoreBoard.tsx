import { useTranslation } from 'react-i18next';

interface ScoreBoardProps {
  score: number;
  round: number;
  totalRounds: number;
}

export function ScoreBoard({ score, round, totalRounds }: ScoreBoardProps) {
  const { t } = useTranslation();

  return (
    <div className="score-board">
      <div className="score-item">
        <span className="score-value">{score}</span>
        <span className="score-label">{t('scoreBoard.score')}</span>
      </div>
      <div className="score-divider" />
      <div className="score-item">
        <span className="score-value">
          {round}<span className="score-total">/{totalRounds}</span>
        </span>
        <span className="score-label">{t('scoreBoard.round')}</span>
      </div>
    </div>
  );
}

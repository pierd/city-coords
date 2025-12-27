import { useTranslation } from 'react-i18next';

interface ScoreBoardProps {
  medianDistance: number | null;
  perfectGuesses: number;
  round: number;
  totalRounds: number;
}

export function ScoreBoard({ medianDistance, perfectGuesses, round, totalRounds }: ScoreBoardProps) {
  const { t } = useTranslation();

  return (
    <div className="score-board">
      <div className="score-item score-item-main">
        <span className="score-value">
          {medianDistance !== null ? (
            <>
              {medianDistance.toLocaleString()}
              <span className="score-unit">km</span>
            </>
          ) : (
            '—'
          )}
        </span>
        <span className="score-label">{t('scoreBoard.typicalMiss')}</span>
      </div>
      <div className="score-divider" />
      <div className="score-item">
        <span className="score-value score-value-secondary">{perfectGuesses}</span>
        <span className="score-label">{t('scoreBoard.perfect')}</span>
      </div>
      <div className="score-divider" />
      <div className="score-item">
        <span className="score-value score-value-secondary">
          {round}<span className="score-total">/{totalRounds}</span>
        </span>
        <span className="score-label">{t('scoreBoard.round')}</span>
      </div>
    </div>
  );
}

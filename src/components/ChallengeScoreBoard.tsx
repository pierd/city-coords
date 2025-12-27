import { useTranslation } from 'react-i18next';
import type { GameMode } from '../types/gameMode';

interface ChallengeScoreBoardProps {
  mode: GameMode;
  attempt: number;
  maxAttempts: number;
  bestDistance: number | null;
}

export function ChallengeScoreBoard({
  mode,
  attempt,
  maxAttempts,
  bestDistance,
}: ChallengeScoreBoardProps) {
  const { t } = useTranslation();

  const getModeLabel = () => {
    switch (mode) {
      case 'daily':
        return t('modes.daily');
      case 'random':
        return t('modes.random');
      default:
        return '';
    }
  };

  return (
    <div className="challenge-score-board">
      <div className="challenge-mode-badge">
        <span className="mode-icon">{mode === 'daily' ? '📅' : '🎲'}</span>
        <span className="mode-label">{getModeLabel()}</span>
      </div>
      <div className="challenge-stats-row">
        <div className="challenge-stat-item">
          <span className="stat-value">{attempt - 1}/{maxAttempts}</span>
          <span className="stat-label">{t('challenge.attempts')}</span>
        </div>
        {bestDistance !== null && (
          <>
            <div className="stat-divider" />
            <div className="challenge-stat-item">
              <span className="stat-value">
                {bestDistance.toLocaleString()}
                <span className="stat-unit">km</span>
              </span>
              <span className="stat-label">{t('challenge.closest')}</span>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

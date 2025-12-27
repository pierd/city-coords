import { useTranslation } from 'react-i18next';
import type { AttemptResult } from '../hooks/useGame';
import { useTranslatedCity } from '../hooks/useTranslatedCity';
import { formatCoordinate } from './CoordinateDisplay';

interface AttemptHistoryProps {
  attempts: AttemptResult[];
  maxAttempts: number;
}

export function AttemptHistory({ attempts, maxAttempts }: AttemptHistoryProps) {
  const { t } = useTranslation();
  const { getDisplayName, getDisplayCountry } = useTranslatedCity();

  if (attempts.length === 0) {
    return null;
  }

  return (
    <div className="attempt-history">
      <div className="attempt-header">
        <span className="attempt-title">{t('attempts.title')}</span>
        <span className="attempt-count">{attempts.length}/{maxAttempts}</span>
      </div>
      <div className="attempt-list">
        {attempts.map((attempt, index) => (
          <div
            key={index}
            className={`attempt-row ${attempt.isCorrect ? 'correct' : ''}`}
          >
            <span className="attempt-number">{index + 1}</span>
            <div className="attempt-city">
              <div className="attempt-city-info">
                <span className="attempt-city-name">{getDisplayName(attempt.guess)}</span>
                <span className="attempt-country">{getDisplayCountry(attempt.guess)}</span>
              </div>
              <div className="attempt-coords">
                <span>{formatCoordinate(attempt.guess.lat, 'lat')}</span>
                <span className="attempt-coords-divider">·</span>
                <span>{formatCoordinate(attempt.guess.lng, 'lng')}</span>
              </div>
            </div>
            {attempt.isCorrect ? (
              <span className="attempt-correct">✓</span>
            ) : (
              <div className="attempt-hint">
                <span
                  className="attempt-arrow"
                  style={{ transform: `rotate(${attempt.bearing}deg)` }}
                >
                  ↑
                </span>
                <span className="attempt-distance">{attempt.distance.toLocaleString()} km</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

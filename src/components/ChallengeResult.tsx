import { useTranslation } from 'react-i18next';
import type { City } from '../data/capitals';
import type { AttemptResult } from '../hooks/useGame';
import type { GameMode } from '../types/gameMode';
import { useTranslatedCity } from '../hooks/useTranslatedCity';
import { getDailyStats } from '../utils/dailyStorage';

interface ChallengeResultProps {
  mode: GameMode;
  city: City;
  solved: boolean;
  attempts: AttemptResult[];
  maxAttempts: number;
  bestDistance: number | null;
  onPlayAgain: () => void;
  onBackToMenu: () => void;
}

function formatCoordinateDMS(value: number, type: 'lat' | 'lng'): string {
  const absolute = Math.abs(value);
  const degrees = Math.floor(absolute);
  const minutes = Math.floor((absolute - degrees) * 60);
  const seconds = Math.round(((absolute - degrees) * 60 - minutes) * 60);
  const direction = type === 'lat' ? (value >= 0 ? 'N' : 'S') : value >= 0 ? 'E' : 'W';
  return `${degrees}°${minutes}'${seconds}"${direction}`;
}

export function ChallengeResult({
  mode,
  city,
  solved,
  attempts,
  maxAttempts,
  bestDistance,
  onPlayAgain,
  onBackToMenu,
}: ChallengeResultProps) {
  const { t } = useTranslation();
  const { getDisplayName, getDisplayCountry } = useTranslatedCity();
  const dailyStats = mode === 'daily' ? getDailyStats() : null;

  const getEmoji = () => {
    if (solved) {
      if (attempts.length === 1) return '🏆';
      if (attempts.length <= 3) return '🌟';
      return '✨';
    }
    return '🗺️';
  };

  const getMessage = () => {
    if (solved) {
      if (attempts.length === 1) return t('challengeResult.messages.firstTry');
      if (attempts.length <= 3) return t('challengeResult.messages.great');
      return t('challengeResult.messages.gotIt');
    }
    return t('challengeResult.messages.notThisTime');
  };

  return (
    <div className={`challenge-result ${solved ? 'solved' : 'failed'}`}>
      <div className="challenge-result-emoji">{getEmoji()}</div>

      <h2 className="challenge-result-title">
        {solved ? t('challengeResult.solved') : t('challengeResult.notSolved')}
      </h2>

      <div className="challenge-result-city">
        <span className="challenge-city-name">{getDisplayName(city)}</span>
        <span className="challenge-city-country">{getDisplayCountry(city)}</span>
        <div className="challenge-city-coords">
          <span>{formatCoordinateDMS(city.lat, 'lat')}</span>
          <span className="coord-sep">×</span>
          <span>{formatCoordinateDMS(city.lng, 'lng')}</span>
        </div>
      </div>

      <div className="challenge-stats">
        {solved ? (
          <div className="challenge-stat">
            <span className="stat-value">{attempts.length}/{maxAttempts}</span>
            <span className="stat-label">{t('challengeResult.attempts')}</span>
          </div>
        ) : (
          <div className="challenge-stat">
            <span className="stat-value">{bestDistance?.toLocaleString() ?? '—'}</span>
            <span className="stat-unit">km</span>
            <span className="stat-label">{t('challengeResult.closestGuess')}</span>
          </div>
        )}
      </div>

      <p className="challenge-message">{getMessage()}</p>

      {/* Show attempts breakdown */}
      <div className="challenge-attempts-list">
        {attempts.map((attempt, index) => (
          <div
            key={index}
            className={`challenge-attempt ${attempt.isCorrect ? 'correct' : ''}`}
          >
            <span className="attempt-num">{index + 1}</span>
            <span className="attempt-name">{getDisplayName(attempt.guess)}</span>
            {attempt.isCorrect ? (
              <span className="attempt-check">✓</span>
            ) : (
              <>
                <span className="attempt-dir">{attempt.arrow}</span>
                <span className="attempt-dist">{attempt.distance.toLocaleString()} km</span>
              </>
            )}
          </div>
        ))}
      </div>

      {/* Daily stats */}
      {mode === 'daily' && dailyStats && (
        <div className="daily-result-stats">
          <div className="result-stat">
            <span className="result-stat-icon">🔥</span>
            <span className="result-stat-value">{dailyStats.currentStreak}</span>
            <span className="result-stat-label">{t('challengeResult.streak')}</span>
          </div>
          <div className="result-stat">
            <span className="result-stat-icon">⭐</span>
            <span className="result-stat-value">{dailyStats.maxStreak}</span>
            <span className="result-stat-label">{t('challengeResult.maxStreak')}</span>
          </div>
        </div>
      )}

      <div className="challenge-actions">
        {mode === 'random' && (
          <button className="action-btn primary" onClick={onPlayAgain}>
            {t('challengeResult.playAgain')}
          </button>
        )}
        <button
          className={`action-btn ${mode === 'daily' ? 'primary' : 'secondary'}`}
          onClick={onBackToMenu}
        >
          {t('challengeResult.backToMenu')}
        </button>
      </div>
    </div>
  );
}

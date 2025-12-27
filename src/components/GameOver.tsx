import { useTranslation } from 'react-i18next';
import type { RoundResult } from '../hooks/useGame';
import { useTranslatedCity } from '../hooks/useTranslatedCity';

interface GameOverProps {
  score: number;
  totalRounds: number;
  medianDistance: number | null;
  onRestart: () => void;
  history: RoundResult[];
}

export function GameOver({ score, totalRounds, medianDistance, onRestart, history }: GameOverProps) {
  const { t } = useTranslation();
  const { getDisplayName, getDisplayCountry } = useTranslatedCity();

  // Get message based on median distance (lower is better)
  const getMessage = () => {
    if (medianDistance === null) return t('gameOver.messages.needsPractice');
    if (medianDistance === 0) return t('gameOver.messages.perfect');
    if (medianDistance <= 500) return t('gameOver.messages.excellent');
    if (medianDistance <= 1500) return t('gameOver.messages.good');
    if (medianDistance <= 3000) return t('gameOver.messages.notBad');
    return t('gameOver.messages.needsPractice');
  };

  // Get emoji based on median distance
  const getEmoji = () => {
    if (medianDistance === null) return '🗺️';
    if (medianDistance === 0) return '🏆';
    if (medianDistance <= 500) return '🌟';
    if (medianDistance <= 1500) return '🎯';
    if (medianDistance <= 3000) return '📍';
    return '🗺️';
  };

  return (
    <div className="game-over">
      <div className="game-over-emoji">{getEmoji()}</div>
      <h2 className="game-over-title">{t('gameOver.title')}</h2>
      <div className="final-score">
        <span className="final-score-value">
          {medianDistance !== null ? medianDistance.toLocaleString() : '—'}
        </span>
        <span className="final-score-unit">km</span>
      </div>
      <div className="final-score-label">{t('gameOver.typicalMiss')}</div>
      <div className="perfect-guesses">
        <span className="perfect-guesses-value">{score}</span>
        <span className="perfect-guesses-label">/ {totalRounds} {t('gameOver.perfectGuesses')}</span>
      </div>
      <p className="game-over-message">{getMessage()}</p>

      <div className="stats-list-container">
        <div className="stats-list">
          {history.map((round, index) => (
            <div key={index} className={`stats-row ${round.isCorrect ? 'row-correct' : 'row-incorrect'}`}>
              <span className="round-badge">{index + 1}</span>
              <div className="stats-row-content">
                <div className="stats-city-line">
                  <span className="target-city">{getDisplayName(round.city)}</span>
                  <span className="target-country">{getDisplayCountry(round.city)}</span>
                </div>
                {!round.isCorrect && (
                  <div className="stats-guess-line">
                    <span className="guess-arrow">→</span>
                    {round.guess ? (
                      <span className="guess-city">{getDisplayName(round.guess)}</span>
                    ) : (
                      <span className="no-guess">—</span>
                    )}
                  </div>
                )}
              </div>
              <div className="stats-result">
                {round.isCorrect ? (
                  <span className="result-correct">✓</span>
                ) : (
                  <span className="result-distance">
                    {round.distance ? `${round.distance.toLocaleString()} km` : '✗'}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <button className="restart-button" onClick={onRestart}>
        {t('gameOver.playAgain')}
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="23 4 23 10 17 10" />
          <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
        </svg>
      </button>
    </div>
  );
}

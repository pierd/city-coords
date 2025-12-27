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

      <div className="stats-table-container">
        <table className="stats-table">
          <thead>
            <tr>
              <th>{t('gameOver.table.round')}</th>
              <th>{t('gameOver.table.city')}</th>
              <th>{t('gameOver.table.yourGuess')}</th>
              <th>{t('gameOver.table.result')}</th>
            </tr>
          </thead>
          <tbody>
            {history.map((round, index) => (
              <tr key={index} className={round.isCorrect ? 'row-correct' : 'row-incorrect'}>
                <td className="round-number">{index + 1}</td>
                <td className="city-cell">
                  <span className="city-name">{getDisplayName(round.city)}</span>
                  <span className="country-name">{getDisplayCountry(round.city)}</span>
                </td>
                <td className="guess-cell">
                  {round.guess ? (
                    <>
                      <span className="city-name">{getDisplayName(round.guess)}</span>
                      <span className="country-name">{getDisplayCountry(round.guess)}</span>
                    </>
                  ) : (
                    <span className="no-guess">—</span>
                  )}
                </td>
                <td className="result-cell">
                  {round.isCorrect ? (
                    <span className="result-correct">✓</span>
                  ) : (
                    <span className="result-incorrect">
                      {round.distance ? `${round.distance.toLocaleString()} km` : '✗'}
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
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

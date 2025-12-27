import { useTranslation } from 'react-i18next';
import type { RoundResult } from '../hooks/useGame';
import { useTranslatedCity } from '../hooks/useTranslatedCity';

interface GameOverProps {
  score: number;
  totalRounds: number;
  onRestart: () => void;
  history: RoundResult[];
}

export function GameOver({ score, totalRounds, onRestart, history }: GameOverProps) {
  const { t } = useTranslation();
  const { getDisplayName, getDisplayCountry } = useTranslatedCity();
  const percentage = Math.round((score / totalRounds) * 100);

  const getMessage = () => {
    if (percentage === 100) return t('gameOver.messages.perfect');
    if (percentage >= 80) return t('gameOver.messages.excellent');
    if (percentage >= 60) return t('gameOver.messages.good');
    if (percentage >= 40) return t('gameOver.messages.notBad');
    return t('gameOver.messages.needsPractice');
  };

  const getEmoji = () => {
    if (percentage === 100) return '🏆';
    if (percentage >= 80) return '🌟';
    if (percentage >= 60) return '🎯';
    if (percentage >= 40) return '📍';
    return '🗺️';
  };

  return (
    <div className="game-over">
      <div className="game-over-emoji">{getEmoji()}</div>
      <h2 className="game-over-title">{t('gameOver.title')}</h2>
      <div className="final-score">
        <span className="final-score-value">{score}</span>
        <span className="final-score-total">/ {totalRounds}</span>
      </div>
      <div className="final-percentage">{percentage}%</div>
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

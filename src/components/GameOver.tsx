import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { RoundResult, OpponentData } from '../hooks/useGame';
import { useTranslatedCity } from '../hooks/useTranslatedCity';
import { generateClassicChallengeUrl, copyToClipboard } from '../utils/challengeUrl';

interface GameOverProps {
  score: number;
  totalRounds: number;
  medianDistance: number | null;
  onRestart: () => void;
  onBackToMenu: () => void;
  history: RoundResult[];
  // Challenge mode props
  seed: string;
  isChallenge: boolean;
  opponent: OpponentData | null;
}

export function GameOver({
  score,
  totalRounds,
  medianDistance,
  onRestart,
  onBackToMenu,
  history,
  seed,
  isChallenge,
  opponent,
}: GameOverProps) {
  const { t } = useTranslation();
  const { getDisplayName, getDisplayCountry } = useTranslatedCity();
  const [copied, setCopied] = useState(false);

  const handleCopyChallenge = async () => {
    const url = generateClassicChallengeUrl(seed, history, score, medianDistance);
    const success = await copyToClipboard(url);

    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Determine winner when playing a challenge
  const getChallengeResult = () => {
    if (!isChallenge || !opponent) return null;

    const yourScore = score;
    const opponentScore = opponent.score ?? 0;
    const yourMedian = medianDistance;
    const opponentMedian = opponent.medianDistance;
    if (opponentMedian === undefined) return null;

    // Compare by perfect guesses first
    if (yourScore > opponentScore) return 'win';
    if (yourScore < opponentScore) return 'lose';

    // Tie-breaker: lower median distance wins
    if (yourMedian !== null && opponentMedian !== null) {
      if (yourMedian < opponentMedian) return 'win';
      if (yourMedian > opponentMedian) return 'lose';
    }

    return 'tie';
  };

  const challengeResult = getChallengeResult();

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

      {/* Challenge comparison */}
      {isChallenge && opponent && (
        <div className="challenge-comparison classic-comparison">
          <h3 className="comparison-title">{t('challengeFriend.comparison')}</h3>
          <div className="comparison-grid">
            <div className={`comparison-player ${challengeResult === 'win' ? 'winner' : ''}`}>
              <span className="player-label">{t('challengeFriend.you')}</span>
              <div className="player-stats">
                <span className="player-score">{score}/{totalRounds}</span>
                <span className="player-median">{medianDistance?.toLocaleString() ?? '—'} km</span>
              </div>
            </div>
            <div className="comparison-vs">vs</div>
            <div className={`comparison-player ${challengeResult === 'lose' ? 'winner' : ''}`}>
              <span className="player-label">{t('challengeFriend.opponent')}</span>
              <div className="player-stats">
                <span className="player-score">{opponent.score ?? 0}/{totalRounds}</span>
                <span className="player-median">{opponent.medianDistance?.toLocaleString() ?? '—'} km</span>
              </div>
            </div>
          </div>
          <div className={`challenge-verdict ${challengeResult}`}>
            {challengeResult === 'win' && t('challengeFriend.youWin')}
            {challengeResult === 'lose' && t('challengeFriend.youLose')}
            {challengeResult === 'tie' && t('challengeFriend.tie')}
          </div>
        </div>
      )}

      <div className="game-over-actions">
        <button className="action-btn primary" onClick={onRestart}>
          {t('gameOver.playAgain')}
        </button>
        {!isChallenge && (
          <button
            className="action-btn challenge-btn"
            onClick={handleCopyChallenge}
          >
            {copied ? (
              <>
                <span className="btn-icon">✓</span>
                {t('challengeFriend.copied')}
              </>
            ) : (
              <>
                <span className="btn-icon">🔗</span>
                {t('challengeFriend.button')}
              </>
            )}
          </button>
        )}
        <button className="action-btn secondary" onClick={onBackToMenu}>
          {t('challengeResult.backToMenu')}
        </button>
      </div>
    </div>
  );
}

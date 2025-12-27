import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { City } from '../data/capitals';
import type { AttemptResult, OpponentData } from '../hooks/useGame';
import type { GameMode } from '../types/gameMode';
import { useTranslatedCity } from '../hooks/useTranslatedCity';
import { getDailyStats } from '../utils/dailyStorage';
import { generateChallengeUrl, copyToClipboard } from '../utils/challengeUrl';

interface ChallengeResultProps {
  mode: GameMode;
  city: City;
  solved: boolean;
  attempts: AttemptResult[];
  maxAttempts: number;
  bestDistance: number | null;
  onPlayAgain: () => void;
  onBackToMenu: () => void;
  // Challenge mode props
  seed: string;
  isChallenge: boolean;
  opponent: OpponentData | null;
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
  seed,
  isChallenge,
  opponent,
}: ChallengeResultProps) {
  const { t } = useTranslation();
  const { getDisplayName, getDisplayCountry } = useTranslatedCity();
  const dailyStats = mode === 'daily' ? getDailyStats() : null;
  const [copied, setCopied] = useState(false);

  const handleCopyChallenge = async () => {
    if (mode !== 'random') return;

    const url = generateChallengeUrl(mode, seed, attempts, solved);
    const success = await copyToClipboard(url);

    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Determine winner when playing a challenge
  const getChallengeResult = () => {
    if (!isChallenge || !opponent) return null;

    const youSolved = solved;
    const opponentSolved = opponent.solved;
    const yourAttempts = attempts.length;
    const opponentAttempts = opponent.guesses.length;

    if (youSolved && !opponentSolved) {
      return 'win';
    } else if (!youSolved && opponentSolved) {
      return 'lose';
    } else if (youSolved && opponentSolved) {
      // Both solved - fewer attempts wins
      if (yourAttempts < opponentAttempts) return 'win';
      if (yourAttempts > opponentAttempts) return 'lose';
      return 'tie';
    } else {
      // Neither solved - compare best distance
      if (bestDistance === null) return 'lose';
      // We don't store opponent's best distance for single-city modes,
      // so ties are based on attempts alone
      return 'tie';
    }
  };

  const challengeResult = getChallengeResult();

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
                <span
                  className="attempt-dir"
                  style={{ transform: `rotate(${attempt.bearing}deg)`, display: 'inline-block' }}
                >
                  ↑
                </span>
                <span className="attempt-dist">{attempt.distance.toLocaleString()} km</span>
              </>
            )}
          </div>
        ))}
      </div>

      {/* Challenge comparison */}
      {isChallenge && opponent && (
        <div className="challenge-comparison">
          <h3 className="comparison-title">{t('challengeFriend.comparison')}</h3>
          <div className="comparison-grid">
            <div className={`comparison-player ${challengeResult === 'win' ? 'winner' : ''}`}>
              <span className="player-label">{t('challengeFriend.you')}</span>
              <span className="player-result">
                {solved ? `✓ ${attempts.length}/${maxAttempts}` : `✗ ${bestDistance?.toLocaleString() ?? '—'} km`}
              </span>
            </div>
            <div className="comparison-vs">vs</div>
            <div className={`comparison-player ${challengeResult === 'lose' ? 'winner' : ''}`}>
              <span className="player-label">{t('challengeFriend.opponent')}</span>
              <span className="player-result">
                {opponent.solved ? `✓ ${opponent.guesses.length}/${maxAttempts}` : `✗`}
              </span>
            </div>
          </div>
          <div className={`challenge-verdict ${challengeResult}`}>
            {challengeResult === 'win' && t('challengeFriend.youWin')}
            {challengeResult === 'lose' && t('challengeFriend.youLose')}
            {challengeResult === 'tie' && t('challengeFriend.tie')}
          </div>
        </div>
      )}

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
          <>
            <button className="action-btn primary" onClick={onPlayAgain}>
              {t('challengeResult.playAgain')}
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
          </>
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

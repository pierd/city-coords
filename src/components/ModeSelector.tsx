import { useTranslation } from 'react-i18next';
import type { GameMode } from '../types/gameMode';
import { getDailyStats, hasTodayBeenCompleted } from '../utils/dailyStorage';

interface ModeSelectorProps {
  onSelectMode: (mode: GameMode) => void;
}

export function ModeSelector({ onSelectMode }: ModeSelectorProps) {
  const { t } = useTranslation();
  const stats = getDailyStats();
  const dailyCompleted = hasTodayBeenCompleted();

  return (
    <div className="mode-selector">
      <h2 className="mode-selector-title">{t('modeSelector.title')}</h2>

      <div className="mode-cards">
        {/* Daily Challenge */}
        <button
          className={`mode-card mode-daily ${dailyCompleted ? 'completed' : ''}`}
          onClick={() => onSelectMode('daily')}
        >
          <div className="mode-icon">📅</div>
          <div className="mode-info">
            <h3 className="mode-name">{t('modeSelector.daily.name')}</h3>
            <p className="mode-description">{t('modeSelector.daily.description')}</p>
          </div>
          {stats.currentStreak > 0 && (
            <div className="mode-streak">
              <span className="streak-icon">🔥</span>
              <span className="streak-count">{stats.currentStreak}</span>
            </div>
          )}
          {dailyCompleted && (
            <div className="mode-completed-badge">
              <span>✓</span>
            </div>
          )}
        </button>

        {/* Random Challenge */}
        <button
          className="mode-card mode-random"
          onClick={() => onSelectMode('random')}
        >
          <div className="mode-icon">🎲</div>
          <div className="mode-info">
            <h3 className="mode-name">{t('modeSelector.random.name')}</h3>
            <p className="mode-description">{t('modeSelector.random.description')}</p>
          </div>
        </button>

        {/* Classic 10x */}
        <button
          className="mode-card mode-classic"
          onClick={() => onSelectMode('classic')}
        >
          <div className="mode-icon">🎯</div>
          <div className="mode-info">
            <h3 className="mode-name">{t('modeSelector.classic.name')}</h3>
            <p className="mode-description">{t('modeSelector.classic.description')}</p>
          </div>
        </button>
      </div>

      {stats.gamesPlayed > 0 && (
        <div className="daily-stats">
          <div className="daily-stat">
            <span className="daily-stat-value">{stats.gamesPlayed}</span>
            <span className="daily-stat-label">{t('modeSelector.stats.played')}</span>
          </div>
          <div className="daily-stat">
            <span className="daily-stat-value">{stats.gamesWon}</span>
            <span className="daily-stat-label">{t('modeSelector.stats.won')}</span>
          </div>
          <div className="daily-stat">
            <span className="daily-stat-value">{stats.currentStreak}</span>
            <span className="daily-stat-label">{t('modeSelector.stats.streak')}</span>
          </div>
          <div className="daily-stat">
            <span className="daily-stat-value">{stats.maxStreak}</span>
            <span className="daily-stat-label">{t('modeSelector.stats.maxStreak')}</span>
          </div>
        </div>
      )}

      <div className="also-like-section">
        <span className="also-like-title">{t('modeSelector.alsoLike.title')}</span>
        <a
          href="https://borders.lessismore.studio/"
          target="_blank"
          rel="noopener noreferrer"
          className="also-like-link"
        >
          <span className="also-like-icon">🗺️</span>
          <span className="also-like-name">Border Guess</span>
        </a>
      </div>
    </div>
  );
}

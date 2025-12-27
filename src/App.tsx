import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useGame } from './hooks/useGame';
import { CoordinateDisplay } from './components/CoordinateDisplay';
import { CitySearch } from './components/CitySearch';
import { ScoreBoard } from './components/ScoreBoard';
import { ResultFeedback } from './components/ResultFeedback';
import { GameOver } from './components/GameOver';
import { LanguageSelector } from './components/LanguageSelector';
import { ModeSelector } from './components/ModeSelector';
import { AttemptHistory } from './components/AttemptHistory';
import { ChallengeScoreBoard } from './components/ChallengeScoreBoard';
import { ChallengeResult } from './components/ChallengeResult';
import type { GameMode } from './types/gameMode';
import { getChallengeFromUrl, clearChallengeFromUrl } from './utils/challengeUrl';
import './App.css';

function App() {
  const { t } = useTranslation();
  const {
    gameState,
    medianDistance,
    startGame,
    searchCities,
    checkAnswer,
    nextRound,
    resetGame,
    goToMenu,
  } = useGame();

  const challengeChecked = useRef(false);

  // Check for challenge URL on mount
  useEffect(() => {
    if (challengeChecked.current) return;
    challengeChecked.current = true;

    const challengeData = getChallengeFromUrl();
    if (challengeData) {
      // Clear the URL parameter
      clearChallengeFromUrl();
      // Start game with challenge data
      startGame(challengeData.mode, challengeData);
    }
  }, [startGame]);

  const handleSelectMode = (mode: GameMode) => {
    startGame(mode);
  };

  const handleNextRound = () => {
    if (gameState && gameState.round >= gameState.totalRounds) {
      nextRound();
    } else {
      nextRound();
    }
  };

  const handlePlayAgain = () => {
    if (gameState) {
      startGame(gameState.mode);
    }
  };

  // Mode selection screen
  if (!gameState) {
    return (
      <div className="app">
        <div className="background-grid" />
        <div className="background-glow" />

        <LanguageSelector />

        <header className="header">
          <h1 className="title">
            <span className="title-icon">◎</span>
            {t('app.title')}
          </h1>
          <p className="subtitle">{t('app.subtitle')}</p>
        </header>

        <main className="main">
          <ModeSelector onSelectMode={handleSelectMode} />
        </main>

        <footer className="footer">
          <span>{t('app.footer', { count: 150 })}</span>
        </footer>
      </div>
    );
  }

  const { mode, currentCity, score, round, totalRounds, isCorrect, gameOver, guessedCity, history, attempts, maxAttempts, bestDistance, attempt } = gameState;

  // Challenge modes (daily/random) game over
  if ((mode === 'daily' || mode === 'random') && gameOver) {
    return (
      <div className="app">
        <div className="background-grid" />
        <div className="background-glow" />

        <LanguageSelector />

        <header className="header">
          <h1 className="title">
            <span className="title-icon">◎</span>
            {t('app.title')}
          </h1>
        </header>

        <main className="main">
          <ChallengeResult
            mode={mode}
            city={currentCity}
            solved={isCorrect === true}
            attempts={attempts}
            maxAttempts={maxAttempts}
            bestDistance={bestDistance}
            onPlayAgain={handlePlayAgain}
            onBackToMenu={goToMenu}
            seed={gameState.seed}
            isChallenge={gameState.isChallenge}
            opponent={gameState.opponent}
          />
        </main>
      </div>
    );
  }

  // Classic mode game over
  if (mode === 'classic' && gameOver) {
    return (
      <div className="app">
        <div className="background-grid" />
        <div className="background-glow" />

        <LanguageSelector />

        <header className="header">
          <h1 className="title">
            <span className="title-icon">◎</span>
            {t('app.title')}
          </h1>
        </header>

        <main className="main">
          <GameOver
            score={score}
            totalRounds={totalRounds}
            medianDistance={medianDistance}
            onRestart={resetGame}
            history={history}
            seed={gameState.seed}
            isChallenge={gameState.isChallenge}
            opponent={gameState.opponent}
          />
        </main>
      </div>
    );
  }

  // Challenge modes (daily/random) gameplay
  if (mode === 'daily' || mode === 'random') {
    return (
      <div className="app">
        <div className="background-grid" />
        <div className="background-glow" />

        <LanguageSelector />

        <header className="header header-compact">
          <h1 className="title title-small">
            <span className="title-icon">◎</span>
            {t('app.title')}
          </h1>
        </header>

        <main className="main">
          <div className="game-container">
            <ChallengeScoreBoard
              mode={mode}
              attempt={attempt}
              maxAttempts={maxAttempts}
              bestDistance={bestDistance}
            />

            <CoordinateDisplay city={currentCity} />

            {attempts.length > 0 && (
              <AttemptHistory attempts={attempts} maxAttempts={maxAttempts} />
            )}

            <CitySearch
              onSearch={searchCities}
              onSelect={checkAnswer}
              disabled={gameOver}
            />

            <button className="back-to-menu-btn" onClick={goToMenu}>
              ← {t('game.backToMenu')}
            </button>
          </div>
        </main>
      </div>
    );
  }

  // Classic mode gameplay
  return (
    <div className="app">
      <div className="background-grid" />
      <div className="background-glow" />

      <LanguageSelector />

      <header className="header">
        <h1 className="title">
          <span className="title-icon">◎</span>
          {t('app.title')}
        </h1>
        <p className="subtitle">{t('app.subtitle')}</p>
      </header>

      <main className="main">
        <div className="game-container">
          <ScoreBoard
            medianDistance={medianDistance}
            perfectGuesses={score}
            round={round}
            totalRounds={totalRounds}
          />

          {isCorrect === null ? (
            <>
              <CoordinateDisplay city={currentCity} />
              <CitySearch
                onSearch={searchCities}
                onSelect={checkAnswer}
                disabled={false}
              />
            </>
          ) : (
            <ResultFeedback
              isCorrect={isCorrect}
              correctCity={currentCity}
              guessedCity={guessedCity}
              distance={history[history.length - 1]?.distance ?? null}
              onNext={handleNextRound}
              isLastRound={round >= totalRounds}
            />
          )}

          <button className="back-to-menu-btn" onClick={goToMenu}>
            ← {t('game.backToMenu')}
          </button>
        </div>
      </main>

      <footer className="footer">
        <span>{gameState.usedCities.size > 0 ? t('app.footer', { count: 150 }) : ''}</span>
      </footer>
    </div>
  );
}

export default App;

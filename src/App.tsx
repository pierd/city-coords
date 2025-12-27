import { useTranslation } from 'react-i18next';
import { useGame } from './hooks/useGame';
import { CoordinateDisplay } from './components/CoordinateDisplay';
import { CitySearch } from './components/CitySearch';
import { ScoreBoard } from './components/ScoreBoard';
import { ResultFeedback } from './components/ResultFeedback';
import { GameOver } from './components/GameOver';
import { LanguageSelector } from './components/LanguageSelector';
import './App.css';

function App() {
  const { t } = useTranslation();
  const { gameState, medianDistance, searchCities, checkAnswer, nextRound, resetGame } = useGame();
  const { currentCity, score, round, totalRounds, isCorrect, gameOver, guessedCity, history } = gameState;

  const handleNextRound = () => {
    if (round >= totalRounds) {
      // This will trigger game over state
      nextRound();
    } else {
      nextRound();
    }
  };

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
        {gameOver ? (
          <GameOver score={score} totalRounds={totalRounds} medianDistance={medianDistance} onRestart={resetGame} history={history} />
        ) : (
          <div className="game-container">
            <ScoreBoard medianDistance={medianDistance} perfectGuesses={score} round={round} totalRounds={totalRounds} />

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
          </div>
        )}
      </main>

      <footer className="footer">
        <span>{gameState.usedCities.size > 0 ? t('app.footer', { count: 150 }) : ''}</span>
      </footer>
    </div>
  );
}

export default App;

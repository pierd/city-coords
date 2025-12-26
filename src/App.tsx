import { useGame } from './hooks/useGame';
import { CoordinateDisplay } from './components/CoordinateDisplay';
import { CitySearch } from './components/CitySearch';
import { ScoreBoard } from './components/ScoreBoard';
import { ResultFeedback } from './components/ResultFeedback';
import { GameOver } from './components/GameOver';
import './App.css';

function App() {
  const { gameState, searchCities, checkAnswer, nextRound, resetGame } = useGame();
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

      <header className="header">
        <h1 className="title">
          <span className="title-icon">◎</span>
          City Coords
        </h1>
        <p className="subtitle">Guess the capital city from its coordinates</p>
      </header>

      <main className="main">
        {gameOver ? (
          <GameOver score={score} totalRounds={totalRounds} onRestart={resetGame} history={history} />
        ) : (
          <div className="game-container">
            <ScoreBoard score={score} round={round} totalRounds={totalRounds} />

            <CoordinateDisplay
              city={currentCity}
              revealed={isCorrect !== null}
            />

            {isCorrect === null ? (
              <CitySearch
                onSearch={searchCities}
                onSelect={checkAnswer}
                disabled={isCorrect !== null}
              />
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
        <span>{gameState.usedCities.size > 0 ? `${150}+ capital cities` : ''}</span>
      </footer>
    </div>
  );
}

export default App;

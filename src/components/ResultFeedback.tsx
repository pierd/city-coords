import type { City } from '../data/capitals';

interface ResultFeedbackProps {
  isCorrect: boolean;
  correctCity: City;
  guessedCity: City | null;
  distance: number | null;
  onNext: () => void;
  isLastRound: boolean;
}

function formatCoordinate(value: number, isLat: boolean): string {
  const direction = isLat
    ? (value >= 0 ? 'N' : 'S')
    : (value >= 0 ? 'E' : 'W');
  return `${Math.abs(value).toFixed(2)}° ${direction}`;
}

export function ResultFeedback({
  isCorrect,
  correctCity,
  guessedCity,
  distance,
  onNext,
  isLastRound,
}: ResultFeedbackProps) {
  return (
    <div className={`result-feedback ${isCorrect ? 'correct' : 'incorrect'}`}>
      <div className="result-icon">
        {isCorrect ? (
          <svg
            width="48"
            height="48"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
        ) : (
          <svg
            width="48"
            height="48"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        )}
      </div>
      <div className="result-text">
        {isCorrect ? 'Correct!' : 'Not quite...'}
      </div>
      {!isCorrect && guessedCity && (
        <div className="wrong-answer-details">
          <div className="correct-answer">
            The answer was <strong>{correctCity.name}</strong>, {correctCity.country}
          </div>
          <div className="guess-comparison">
            <div className="guess-info">
              <span className="guess-label">Your guess:</span>
              <span className="guess-city">{guessedCity.name}</span>
              <span className="guess-coords">
                {formatCoordinate(guessedCity.lat, true)}, {formatCoordinate(guessedCity.lng, false)}
              </span>
            </div>
            {distance !== null && (
              <div className="distance-info">
                <span className="distance-value">{distance.toLocaleString()} km</span>
                <span className="distance-label">off target</span>
              </div>
            )}
          </div>
        </div>
      )}
      <button className="next-button" onClick={onNext}>
        {isLastRound ? 'See Results' : 'Next City'}
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
          <line x1="5" y1="12" x2="19" y2="12" />
          <polyline points="12 5 19 12 12 19" />
        </svg>
      </button>
    </div>
  );
}

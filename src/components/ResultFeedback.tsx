import { useTranslation } from 'react-i18next';
import type { City } from '../data/capitals';
import { useTranslatedCity } from '../hooks/useTranslatedCity';

interface ResultFeedbackProps {
  isCorrect: boolean;
  correctCity: City;
  guessedCity: City | null;
  distance: number | null;
  onNext: () => void;
  isLastRound: boolean;
}

function formatCoordinateDMS(value: number, type: 'lat' | 'lng'): string {
  const absolute = Math.abs(value);
  const degrees = Math.floor(absolute);
  const minutes = Math.floor((absolute - degrees) * 60);
  const seconds = Math.round(((absolute - degrees) * 60 - minutes) * 60);
  const direction = type === 'lat' ? (value >= 0 ? 'N' : 'S') : value >= 0 ? 'E' : 'W';
  return `${degrees}°${minutes}'${seconds}"${direction}`;
}

export function ResultFeedback({
  isCorrect,
  correctCity,
  guessedCity,
  distance,
  onNext,
  isLastRound,
}: ResultFeedbackProps) {
  const { t } = useTranslation();
  const { getDisplayName, getDisplayCountry } = useTranslatedCity();

  return (
    <div className={`result-card ${isCorrect ? 'correct' : 'incorrect'}`}>
      {/* Header with coordinates and result indicator */}
      <div className="result-header">
        <div className="result-coords">
          <span className="result-coord">{formatCoordinateDMS(correctCity.lat, 'lat')}</span>
          <span className="result-coord-sep">×</span>
          <span className="result-coord">{formatCoordinateDMS(correctCity.lng, 'lng')}</span>
        </div>
        <div className={`result-badge ${isCorrect ? 'correct' : 'incorrect'}`}>
          {isCorrect ? (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          ) : (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          )}
        </div>
      </div>

      {/* City answer */}
      <div className="result-answer">
        <span className="result-city-name">{getDisplayName(correctCity)}</span>
        <span className="result-country-name">{getDisplayCountry(correctCity)}</span>
      </div>

      {/* Guess comparison (only if incorrect) */}
      {!isCorrect && guessedCity && (
        <div className="result-comparison">
          <div className="comparison-row">
            <span className="comparison-label">{t('result.yourGuess')}</span>
            <span className="comparison-value">{getDisplayName(guessedCity)}</span>
          </div>
          <div className="comparison-row coords">
            <span className="comparison-label">{t('coordinates.coordinates')}</span>
            <span className="comparison-coords">
              {formatCoordinateDMS(guessedCity.lat, 'lat')} × {formatCoordinateDMS(guessedCity.lng, 'lng')}
            </span>
          </div>
          {distance !== null && (
            <div className="comparison-row distance">
              <span className="comparison-label">{t('result.offTarget')}</span>
              <span className="comparison-distance">{distance.toLocaleString()} km</span>
            </div>
          )}
        </div>
      )}

      {/* Next button */}
      <button className="next-button" onClick={onNext}>
        {isLastRound ? t('result.seeResults') : t('result.nextCity')}
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="5" y1="12" x2="19" y2="12" />
          <polyline points="12 5 19 12 12 19" />
        </svg>
      </button>
    </div>
  );
}

import type { City } from '../data/capitals';

interface CoordinateDisplayProps {
  city: City;
  revealed?: boolean;
}

function formatCoordinate(value: number, type: 'lat' | 'lng'): string {
  const absolute = Math.abs(value);
  const degrees = Math.floor(absolute);
  const minutes = Math.floor((absolute - degrees) * 60);
  const seconds = Math.round(((absolute - degrees) * 60 - minutes) * 60);

  const direction =
    type === 'lat' ? (value >= 0 ? 'N' : 'S') : value >= 0 ? 'E' : 'W';

  return `${degrees}°${minutes}'${seconds}"${direction}`;
}

export function CoordinateDisplay({ city, revealed }: CoordinateDisplayProps) {
  return (
    <div className="coordinate-display">
      <div className="coordinate-label">Find this city</div>
      <div className="coordinates">
        <div className="coordinate">
          <span className="coord-value">{formatCoordinate(city.lat, 'lat')}</span>
          <span className="coord-label">Latitude</span>
        </div>
        <div className="coordinate-divider">×</div>
        <div className="coordinate">
          <span className="coord-value">{formatCoordinate(city.lng, 'lng')}</span>
          <span className="coord-label">Longitude</span>
        </div>
      </div>
      {revealed && (
        <div className="revealed-city">
          <span className="city-name">{city.name}</span>
          <span className="country-name">{city.country}</span>
        </div>
      )}
    </div>
  );
}

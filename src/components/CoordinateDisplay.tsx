import { useTranslation } from 'react-i18next';
import type { City } from '../data/capitals';
import { formatCoordinate } from '../utils/formatCoordinate';

interface CoordinateDisplayProps {
  city: City;
}

export function CoordinateDisplay({ city }: CoordinateDisplayProps) {
  const { t } = useTranslation();

  return (
    <div className="coordinate-display">
      <div className="coordinate-label">{t('coordinates.findCity')}</div>
      <div className="coordinates">
        <div className="coordinate">
          <span className="coord-value">{formatCoordinate(city.lat, 'lat')}</span>
          <span className="coord-label">{t('coordinates.latitude')}</span>
        </div>
        <div className="coordinate-divider">×</div>
        <div className="coordinate">
          <span className="coord-value">{formatCoordinate(city.lng, 'lng')}</span>
          <span className="coord-label">{t('coordinates.longitude')}</span>
        </div>
      </div>
    </div>
  );
}

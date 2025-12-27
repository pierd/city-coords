// Calculate the bearing (direction) from one coordinate to another
export function calculateBearing(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δλ = ((lng2 - lng1) * Math.PI) / 180;

  const y = Math.sin(Δλ) * Math.cos(φ2);
  const x =
    Math.cos(φ1) * Math.sin(φ2) - Math.sin(φ1) * Math.cos(φ2) * Math.cos(Δλ);

  const θ = Math.atan2(y, x);
  const bearing = ((θ * 180) / Math.PI + 360) % 360;

  return bearing;
}

// Convert bearing to compass direction arrow
export function bearingToArrow(bearing: number): string {
  const arrows = ['↑', '↗', '→', '↘', '↓', '↙', '←', '↖'];
  const index = Math.round(bearing / 45) % 8;
  return arrows[index];
}

// Convert bearing to compass direction name
export function bearingToDirection(bearing: number): string {
  const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
  const index = Math.round(bearing / 45) % 8;
  return directions[index];
}

// Get direction from guess to target
export function getDirectionToTarget(
  guessLat: number,
  guessLng: number,
  targetLat: number,
  targetLng: number
): { arrow: string; direction: string; bearing: number } {
  const bearing = calculateBearing(guessLat, guessLng, targetLat, targetLng);
  return {
    arrow: bearingToArrow(bearing),
    direction: bearingToDirection(bearing),
    bearing,
  };
}

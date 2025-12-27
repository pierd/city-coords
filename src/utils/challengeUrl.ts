import type { RoundResult, AttemptResult } from '../hooks/useGame';

// Data structure for challenge URL (single city modes: random/daily)
export interface ChallengeData {
  mode: 'random' | 'daily';
  seed: string;
  // Opponent's guesses stored as city names
  opponentGuesses: string[];
  opponentSolved: boolean;
}

// Data structure for classic mode challenge URL (10x mode)
export interface ClassicChallengeData {
  mode: 'classic';
  seed: string;
  // Opponent's history: city name -> guessed city name (null if skipped)
  opponentHistory: Array<{
    cityName: string;
    guessName: string | null;
    distance: number | null;
  }>;
  opponentScore: number;
  opponentMedianDistance: number | null;
}

export type AnyChallengeData = ChallengeData | ClassicChallengeData;

// Encode challenge data to base64
export function encodeChallengeData(data: AnyChallengeData): string {
  const json = JSON.stringify(data);
  // Use btoa for base64 encoding, but make it URL safe
  const base64 = btoa(unescape(encodeURIComponent(json)));
  // Make URL safe: replace + with -, / with _, remove =
  return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

// Decode challenge data from base64
export function decodeChallengeData(encoded: string): AnyChallengeData | null {
  try {
    // Restore base64 padding and chars
    let base64 = encoded.replace(/-/g, '+').replace(/_/g, '/');
    // Add padding if needed
    while (base64.length % 4) {
      base64 += '=';
    }
    const json = decodeURIComponent(escape(atob(base64)));
    const data = JSON.parse(json);

    // Validate the data structure
    if (!data.mode || !data.seed) {
      return null;
    }

    if (data.mode === 'classic') {
      if (!Array.isArray(data.opponentHistory)) {
        return null;
      }
      return data as ClassicChallengeData;
    }

    if (data.mode === 'random' || data.mode === 'daily') {
      if (!Array.isArray(data.opponentGuesses)) {
        return null;
      }
      return data as ChallengeData;
    }

    return null;
  } catch {
    return null;
  }
}

// Generate challenge URL from current game state (for random mode)
export function generateChallengeUrl(
  mode: 'random' | 'daily',
  seed: string,
  attempts: AttemptResult[],
  solved: boolean
): string {
  const data: ChallengeData = {
    mode,
    seed,
    opponentGuesses: attempts.map(a => a.guess.name),
    opponentSolved: solved,
  };

  const encoded = encodeChallengeData(data);
  const baseUrl = window.location.origin + window.location.pathname;
  return `${baseUrl}?c=${encoded}`;
}

// Generate challenge URL for classic mode (10x)
export function generateClassicChallengeUrl(
  seed: string,
  history: RoundResult[],
  score: number,
  medianDistance: number | null
): string {
  const data: ClassicChallengeData = {
    mode: 'classic',
    seed,
    opponentHistory: history.map(r => ({
      cityName: r.city.name,
      guessName: r.guess?.name ?? null,
      distance: r.distance,
    })),
    opponentScore: score,
    opponentMedianDistance: medianDistance,
  };

  const encoded = encodeChallengeData(data);
  const baseUrl = window.location.origin + window.location.pathname;
  return `${baseUrl}?c=${encoded}`;
}

// Parse challenge data from URL
export function getChallengeFromUrl(): AnyChallengeData | null {
  const params = new URLSearchParams(window.location.search);
  const encoded = params.get('c');

  if (!encoded) {
    return null;
  }

  return decodeChallengeData(encoded);
}

// Clear challenge from URL (after starting the game)
export function clearChallengeFromUrl(): void {
  const url = new URL(window.location.href);
  url.searchParams.delete('c');
  window.history.replaceState({}, '', url.toString());
}

// Copy text to clipboard
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    // Fallback for older browsers
    try {
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      const result = document.execCommand('copy');
      document.body.removeChild(textArea);
      return result;
    } catch {
      return false;
    }
  }
}

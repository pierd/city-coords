import { useState, useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import Fuse from 'fuse.js';
import { capitals } from '../data/capitals';
import type { City } from '../data/capitals';
import {
  cityNameTranslations,
  countryNameTranslations,
  type SupportedLang,
} from '../data/cityTranslations';
import type { GameMode } from '../types/gameMode';
import { GAME_MODE_CONFIGS } from '../types/gameMode';
import {
  createPRNG,
  stringToSeed,
  getTodaySeed,
  generateRandomSeed,
  shuffleArray,
} from '../utils/prng';
import { calculateBearing, bearingToArrow, bearingToDirection } from '../utils/direction';
import {
  getTodayProgress,
  saveDailyProgress,
  completeDailyChallenge,
} from '../utils/dailyStorage';

export interface AttemptResult {
  guess: City;
  distance: number;
  direction: string;
  arrow: string;
  bearing: number;
  isCorrect: boolean;
}

export interface RoundResult {
  city: City;
  guess: City | null;
  isCorrect: boolean;
  distance: number | null;
}

export interface GameState {
  mode: GameMode;
  currentCity: City;
  score: number;
  round: number;
  totalRounds: number;
  attempt: number;
  maxAttempts: number;
  isCorrect: boolean | null;
  gameOver: boolean;
  usedCities: Set<number>;
  guessedCity: City | null;
  history: RoundResult[];
  attempts: AttemptResult[];
  bestDistance: number | null;
  seed: string;
}

// City with all language variants for search
interface SearchableCity extends City {
  name_en: string;
  name_pl: string;
  name_es: string;
  country_en: string;
  country_pl: string;
  country_es: string;
}

// Calculate distance between two coordinates using Haversine formula
export function calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c);
}

// Calculate median from an array of numbers
export function calculateMedian(values: number[]): number | null {
  if (values.length === 0) return null;
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  if (sorted.length % 2 === 0) {
    return Math.round((sorted[mid - 1] + sorted[mid]) / 2);
  }
  return sorted[mid];
}

// Create searchable cities with all language variants
function createSearchableCities(): SearchableCity[] {
  return capitals.map((city) => ({
    ...city,
    name_en: city.name,
    name_pl: cityNameTranslations[city.name]?.pl ?? city.name,
    name_es: cityNameTranslations[city.name]?.es ?? city.name,
    country_en: city.country,
    country_pl: countryNameTranslations[city.country]?.pl ?? city.country,
    country_es: countryNameTranslations[city.country]?.es ?? city.country,
  }));
}

function getCityForMode(
  mode: GameMode,
  seed: string,
  roundIndex: number,
  usedCities: Set<number>
): { city: City; index: number } {
  const random = createPRNG(stringToSeed(seed));

  // For daily/random mode with single city, just get the first shuffled city
  if (mode === 'daily' || mode === 'random') {
    const shuffled = shuffleArray([...capitals.keys()], random);
    return { city: capitals[shuffled[0]], index: shuffled[0] };
  }

  // For classic mode, advance the PRNG to the correct position
  const shuffled = shuffleArray([...capitals.keys()], random);
  const availableIndices = shuffled.filter(i => !usedCities.has(i));

  if (availableIndices.length === 0) {
    return { city: capitals[shuffled[roundIndex % shuffled.length]], index: shuffled[roundIndex % shuffled.length] };
  }

  const cityIndex = availableIndices[roundIndex % availableIndices.length];
  return { city: capitals[cityIndex], index: cityIndex };
}

function initializeGameState(mode: GameMode, existingSeed?: string): GameState {
  const config = GAME_MODE_CONFIGS[mode];

  // Determine seed based on mode
  let seed: string;
  if (mode === 'daily') {
    seed = getTodaySeed();
  } else if (existingSeed) {
    seed = existingSeed;
  } else {
    seed = generateRandomSeed();
  }

  // Check for existing daily progress
  if (mode === 'daily') {
    const existingProgress = getTodayProgress();
    if (existingProgress) {
      const { city, index } = getCityForMode(mode, seed, 0, new Set());
      return {
        mode,
        currentCity: city,
        score: existingProgress.solved ? 1 : 0,
        round: 1,
        totalRounds: config.totalRounds,
        attempt: existingProgress.attempts + 1,
        maxAttempts: config.maxAttempts,
        isCorrect: existingProgress.solved ? true : null,
        gameOver: existingProgress.solved || existingProgress.attempts >= config.maxAttempts,
        usedCities: new Set([index]),
        guessedCity: null,
        history: [],
        attempts: existingProgress.guesses.map(g => ({
          guess: capitals.find(c => c.name === g.cityName) || city,
          distance: g.distance,
          direction: g.direction,
          arrow: g.arrow,
          bearing: g.bearing ?? 0,
          isCorrect: g.distance === 0,
        })),
        bestDistance: existingProgress.bestDistance,
        seed,
      };
    }
  }

  const { city, index } = getCityForMode(mode, seed, 0, new Set());

  return {
    mode,
    currentCity: city,
    score: 0,
    round: 1,
    totalRounds: config.totalRounds,
    attempt: 1,
    maxAttempts: config.maxAttempts,
    isCorrect: null,
    gameOver: false,
    usedCities: new Set([index]),
    guessedCity: null,
    history: [],
    attempts: [],
    bestDistance: null,
    seed,
  };
}

export function useGame() {
  const { i18n } = useTranslation();
  const currentLang = (i18n.language?.substring(0, 2) || 'en') as SupportedLang;

  const [gameState, setGameState] = useState<GameState | null>(null);

  // Create searchable cities with all translations
  const searchableCities = useMemo(() => createSearchableCities(), []);

  // Create Fuse instance that searches across all language variants
  const fuse = useMemo(() => {
    const getSearchKeys = (lang: SupportedLang) => {
      const langOrder = [lang, 'en', 'pl', 'es'].filter((l, i, arr) => arr.indexOf(l) === i);

      return langOrder.flatMap((l) => [
        { name: `name_${l}`, weight: l === lang ? 2 : 1 },
        { name: `country_${l}`, weight: l === lang ? 1.5 : 0.5 },
      ]);
    };

    return new Fuse(searchableCities, {
      keys: getSearchKeys(currentLang),
      threshold: 0.4,
      includeScore: true,
    });
  }, [searchableCities, currentLang]);

  const startGame = useCallback((mode: GameMode) => {
    setGameState(initializeGameState(mode));
  }, []);

  const searchCities = useCallback(
    (query: string): City[] => {
      if (!query.trim()) return [];
      const results = fuse.search(query, { limit: 5 });
      return results.map((r) => ({
        name: r.item.name,
        country: r.item.country,
        lat: r.item.lat,
        lng: r.item.lng,
      }));
    },
    [fuse]
  );

  const checkAnswer = useCallback(
    (selectedCity: City) => {
      if (!gameState) return false;

      const isCorrect = selectedCity.name === gameState.currentCity.name;
      const distance = isCorrect ? 0 : calculateDistance(
        gameState.currentCity.lat,
        gameState.currentCity.lng,
        selectedCity.lat,
        selectedCity.lng
      );

      const bearing = calculateBearing(
        selectedCity.lat,
        selectedCity.lng,
        gameState.currentCity.lat,
        gameState.currentCity.lng
      );
      const direction = bearingToDirection(bearing);
      const arrow = bearingToArrow(bearing);

      setGameState((prev) => {
        if (!prev) return prev;

        const attemptResult: AttemptResult = {
          guess: selectedCity,
          distance,
          direction,
          arrow,
          bearing,
          isCorrect,
        };

        const newAttempts = [...prev.attempts, attemptResult];
        const newBestDistance = prev.bestDistance === null
          ? distance
          : Math.min(prev.bestDistance, distance);

        // For multi-attempt modes (daily/random)
        if (prev.mode === 'daily' || prev.mode === 'random') {
          const isLastAttempt = prev.attempt >= prev.maxAttempts;
          const gameEnded = isCorrect || isLastAttempt;

          // Save daily progress
          if (prev.mode === 'daily') {
            saveDailyProgress({
              solved: isCorrect,
              attempts: prev.attempt,
              bestDistance: newBestDistance,
              guesses: newAttempts.map(a => ({
                cityName: a.guess.name,
                distance: a.distance,
                direction: a.direction,
                arrow: a.arrow,
                bearing: a.bearing,
              })),
            });

            if (gameEnded) {
              completeDailyChallenge(isCorrect, newBestDistance);
            }
          }

          return {
            ...prev,
            attempt: prev.attempt + 1,
            isCorrect: isCorrect ? true : (isLastAttempt ? false : null),
            gameOver: gameEnded,
            guessedCity: selectedCity,
            attempts: newAttempts,
            bestDistance: newBestDistance,
            score: isCorrect ? 1 : 0,
          };
        }

        // For classic mode (single attempt per round)
        const newScore = isCorrect ? prev.score + 1 : prev.score;
        const roundResult: RoundResult = {
          city: prev.currentCity,
          guess: selectedCity,
          isCorrect,
          distance,
        };

        return {
          ...prev,
          score: newScore,
          isCorrect,
          guessedCity: selectedCity,
          history: [...prev.history, roundResult],
          attempts: newAttempts,
          bestDistance: newBestDistance,
        };
      });

      return isCorrect;
    },
    [gameState]
  );

  const nextRound = useCallback(() => {
    setGameState((prev) => {
      if (!prev || prev.gameOver) return prev;

      // For classic mode - move to next round
      if (prev.mode === 'classic') {
        if (prev.round >= prev.totalRounds) {
          return {
            ...prev,
            gameOver: true,
          };
        }

        const { city, index } = getCityForMode(
          prev.mode,
          prev.seed,
          prev.round,
          prev.usedCities
        );
        const newUsedCities = new Set(prev.usedCities);
        newUsedCities.add(index);

        return {
          ...prev,
          currentCity: city,
          round: prev.round + 1,
          isCorrect: null,
          guessedCity: null,
          usedCities: newUsedCities,
          attempts: [],
        };
      }

      return prev;
    });
  }, []);

  const resetGame = useCallback(() => {
    setGameState(null);
  }, []);

  const goToMenu = useCallback(() => {
    setGameState(null);
  }, []);

  // Calculate median distance from all guesses (for classic mode)
  const medianDistance = useMemo(() => {
    const gameStateHistory = gameState?.history ?? [];
    if (gameStateHistory.length === 0) return null;
    const distances = gameStateHistory.map(r => r.distance ?? 0);
    return calculateMedian(distances);
  }, [gameState?.history]);

  return {
    gameState,
    medianDistance,
    startGame,
    searchCities,
    checkAnswer,
    nextRound,
    resetGame,
    goToMenu,
    allCities: capitals,
  };
}

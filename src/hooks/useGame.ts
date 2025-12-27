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

export interface RoundResult {
  city: City;
  guess: City | null;
  isCorrect: boolean;
  distance: number | null;
}

export interface GameState {
  currentCity: City;
  score: number;
  round: number;
  totalRounds: number;
  isCorrect: boolean | null;
  gameOver: boolean;
  usedCities: Set<number>;
  guessedCity: City | null;
  history: RoundResult[];
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

const TOTAL_ROUNDS = 10;

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

function getRandomCity(usedCities: Set<number>): { city: City; index: number } {
  const availableIndices = capitals
    .map((_, i) => i)
    .filter((i) => !usedCities.has(i));

  if (availableIndices.length === 0) {
    // Reset if we've used all cities
    const randomIndex = Math.floor(Math.random() * capitals.length);
    return { city: capitals[randomIndex], index: randomIndex };
  }

  const randomIndex = availableIndices[Math.floor(Math.random() * availableIndices.length)];
  return { city: capitals[randomIndex], index: randomIndex };
}

export function useGame() {
  const { i18n } = useTranslation();
  const currentLang = (i18n.language?.substring(0, 2) || 'en') as SupportedLang;

  const [gameState, setGameState] = useState<GameState>(() => {
    const { city, index } = getRandomCity(new Set());
    return {
      currentCity: city,
      score: 0,
      round: 1,
      totalRounds: TOTAL_ROUNDS,
      isCorrect: null,
      gameOver: false,
      usedCities: new Set([index]),
      guessedCity: null,
      history: [],
    };
  });

  // Create searchable cities with all translations
  const searchableCities = useMemo(() => createSearchableCities(), []);

  // Create Fuse instance that searches across all language variants
  // Priority: current language fields first, then other languages
  const fuse = useMemo(() => {
    const getSearchKeys = (lang: SupportedLang) => {
      // Prioritize current language, then add others
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

  const searchCities = useCallback(
    (query: string): City[] => {
      if (!query.trim()) return [];
      const results = fuse.search(query, { limit: 5 });
      // Return the original City objects (without the extra search fields)
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
      const isCorrect = selectedCity.name === gameState.currentCity.name;
      const distance = isCorrect ? 0 : calculateDistance(
        gameState.currentCity.lat,
        gameState.currentCity.lng,
        selectedCity.lat,
        selectedCity.lng
      );

      setGameState((prev) => {
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
        };
      });

      return isCorrect;
    },
    [gameState.currentCity]
  );

  const nextRound = useCallback(() => {
    setGameState((prev) => {
      if (prev.gameOver) return prev;

      // If this was the last round, trigger game over
      if (prev.round >= TOTAL_ROUNDS) {
        return {
          ...prev,
          gameOver: true,
        };
      }

      const { city, index } = getRandomCity(prev.usedCities);
      const newUsedCities = new Set(prev.usedCities);
      newUsedCities.add(index);

      return {
        ...prev,
        currentCity: city,
        round: prev.round + 1,
        isCorrect: null,
        guessedCity: null,
        usedCities: newUsedCities,
      };
    });
  }, []);

  const resetGame = useCallback(() => {
    const { city, index } = getRandomCity(new Set());
    setGameState({
      currentCity: city,
      score: 0,
      round: 1,
      totalRounds: TOTAL_ROUNDS,
      isCorrect: null,
      gameOver: false,
      usedCities: new Set([index]),
      guessedCity: null,
      history: [],
    });
  }, []);

  // Calculate median distance from all guesses (including correct ones as 0)
  const medianDistance = useMemo(() => {
    if (gameState.history.length === 0) return null;
    const distances = gameState.history.map(r => r.distance ?? 0);
    return calculateMedian(distances);
  }, [gameState.history]);

  return {
    gameState,
    medianDistance,
    searchCities,
    checkAnswer,
    nextRound,
    resetGame,
    allCities: capitals,
  };
}

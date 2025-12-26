import { useState, useCallback, useMemo } from 'react';
import Fuse from 'fuse.js';
import { capitals } from '../data/capitals';
import type { City } from '../data/capitals';

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

const TOTAL_ROUNDS = 10;

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

  const fuse = useMemo(
    () =>
      new Fuse(capitals, {
        keys: ['name', 'country'],
        threshold: 0.4,
        includeScore: true,
      }),
    []
  );

  const searchCities = useCallback(
    (query: string): City[] => {
      if (!query.trim()) return [];
      const results = fuse.search(query, { limit: 5 });
      return results.map((r) => r.item);
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

  return {
    gameState,
    searchCities,
    checkAnswer,
    nextRound,
    resetGame,
    allCities: capitals,
  };
}

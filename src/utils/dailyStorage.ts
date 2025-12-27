import { getTodaySeed } from './prng';

const DAILY_STORAGE_KEY = 'city-coords-daily';

export interface DailyProgress {
  date: string;
  solved: boolean;
  attempts: number;
  bestDistance: number | null;
  guesses: Array<{
    cityName: string;
    distance: number;
    direction: string;
    arrow: string;
  }>;
}

export interface DailyStats {
  currentStreak: number;
  maxStreak: number;
  lastPlayedDate: string | null;
  gamesPlayed: number;
  gamesWon: number;
}

interface DailyStorageData {
  progress: DailyProgress | null;
  stats: DailyStats;
}

function getDefaultStats(): DailyStats {
  return {
    currentStreak: 0,
    maxStreak: 0,
    lastPlayedDate: null,
    gamesPlayed: 0,
    gamesWon: 0,
  };
}

function loadDailyData(): DailyStorageData {
  try {
    const data = localStorage.getItem(DAILY_STORAGE_KEY);
    if (!data) {
      return { progress: null, stats: getDefaultStats() };
    }
    return JSON.parse(data);
  } catch {
    return { progress: null, stats: getDefaultStats() };
  }
}

function saveDailyData(data: DailyStorageData): void {
  localStorage.setItem(DAILY_STORAGE_KEY, JSON.stringify(data));
}

export function getTodayProgress(): DailyProgress | null {
  const data = loadDailyData();
  const today = getTodaySeed();

  if (data.progress && data.progress.date === today) {
    return data.progress;
  }

  return null;
}

export function getDailyStats(): DailyStats {
  const data = loadDailyData();
  return data.stats;
}

export function saveDailyProgress(progress: Omit<DailyProgress, 'date'>): void {
  const data = loadDailyData();
  const today = getTodaySeed();

  data.progress = {
    ...progress,
    date: today,
  };

  saveDailyData(data);
}

export function completeDailyChallenge(solved: boolean, bestDistance: number | null): void {
  const data = loadDailyData();
  const today = getTodaySeed();
  const yesterday = getYesterdaySeed();

  // Update stats
  data.stats.gamesPlayed++;

  if (solved) {
    data.stats.gamesWon++;

    // Check if we're continuing a streak
    if (data.stats.lastPlayedDate === yesterday) {
      data.stats.currentStreak++;
    } else if (data.stats.lastPlayedDate !== today) {
      // Starting a new streak (either first game or streak was broken)
      data.stats.currentStreak = 1;
    }

    data.stats.maxStreak = Math.max(data.stats.maxStreak, data.stats.currentStreak);
  } else {
    // Lost - reset streak unless already played today
    if (data.stats.lastPlayedDate !== today) {
      data.stats.currentStreak = 0;
    }
  }

  data.stats.lastPlayedDate = today;

  // Update progress
  if (data.progress && data.progress.date === today) {
    data.progress.solved = solved;
    data.progress.bestDistance = bestDistance;
  }

  saveDailyData(data);
}

function getYesterdaySeed(): string {
  const now = new Date();
  now.setDate(now.getDate() - 1);
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
}

export function hasTodayBeenCompleted(): boolean {
  const progress = getTodayProgress();
  return progress !== null && (progress.solved || progress.attempts >= 6);
}

export function resetDailyStorage(): void {
  localStorage.removeItem(DAILY_STORAGE_KEY);
}

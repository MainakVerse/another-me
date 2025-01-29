interface TrialData {
  lastTryTime: number;
  triesLeft: number;
}

export function useTrialLimit() {
  const DAILY_LIMIT = 4;
  const STORAGE_KEY = 'cloth_ai_trial';

  const getTrialData = (): TrialData => {
    if (typeof window === 'undefined') return { lastTryTime: 0, triesLeft: DAILY_LIMIT };
    
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return { lastTryTime: 0, triesLeft: DAILY_LIMIT };
    
    const data: TrialData = JSON.parse(stored);
    const lastTryDate = new Date(data.lastTryTime).setHours(0, 0, 0, 0);
    const today = new Date().setHours(0, 0, 0, 0);
    
    // Reset if it's a new day
    if (lastTryDate < today) {
      return { lastTryTime: 0, triesLeft: DAILY_LIMIT };
    }
    
    return data;
  };

  const updateTrialData = () => {
    const newData: TrialData = {
      lastTryTime: Date.now(),
      triesLeft: getTrialData().triesLeft - 1
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newData));
    return newData;
  };

  const getTimeUntilReset = (): string => {
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    
    const msLeft = tomorrow.getTime() - now.getTime();
    const hoursLeft = Math.floor(msLeft / (1000 * 60 * 60));
    const minutesLeft = Math.floor((msLeft % (1000 * 60 * 60)) / (1000 * 60));
    
    return `${hoursLeft}h ${minutesLeft}m`;
  };

  return {
    getTrialData,
    updateTrialData,
    getTimeUntilReset
  };
} 
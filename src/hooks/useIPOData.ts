import { useState, useEffect, useCallback } from 'react';
import { IPO, fetchLiveIPOData, getCachedIPOData, setCachedIPOData, fetchIPOSubscriptionStatus } from '../services/liveIPOService';

interface UseIPODataReturn {
  ipos: IPO[];
  loading: boolean;
  error: string | null;
  refreshData: () => Promise<void>;
  lastUpdated: Date | null;
  isLiveData: boolean;
}

export function useIPOData(): UseIPODataReturn {
  const [ipos, setIpos] = useState<IPO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [isLiveData, setIsLiveData] = useState(false);

  const loadIPOData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      console.log('Loading IPO data from APIs...');

      // First, try to get cached data for immediate display
      const cachedData = getCachedIPOData();
      if (cachedData && cachedData.length > 0) {
        console.log('Using cached data for immediate display');
        setIpos(cachedData);
        setIsLiveData(true);
        setLastUpdated(new Date());
      }

      // Fetch fresh data from APIs
      const freshData = await fetchLiveIPOData();
      
      if (freshData && freshData.length > 0) {
        console.log(`Loaded ${freshData.length} IPOs from live APIs`);
        setIpos(freshData);
        setCachedIPOData(freshData);
        setIsLiveData(true);
        setLastUpdated(new Date());
        setError(null); // Clear any previous errors
      } else {
        throw new Error('No IPO data received from APIs');
      }
    } catch (err) {
      console.error('Error loading IPO data:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to load IPO data from APIs';
      setError(errorMessage);
      setIsLiveData(false);
      
      // If no cached data is available, show empty state
      const cachedData = getCachedIPOData();
      if (!cachedData || cachedData.length === 0) {
        setIpos([]);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  const refreshData = useCallback(async () => {
    console.log('Manually refreshing IPO data...');
    await loadIPOData();
  }, [loadIPOData]);

  useEffect(() => {
    loadIPOData();
    
    // Set up auto-refresh every 10 minutes for live data
    const interval = setInterval(() => {
      console.log('Auto-refreshing IPO data...');
      loadIPOData();
    }, 10 * 60 * 1000);

    return () => clearInterval(interval);
  }, [loadIPOData]);

  return {
    ipos,
    loading,
    error,
    refreshData,
    lastUpdated,
    isLiveData,
  };
}

// Hook for subscription status updates
export function useIPOSubscription(ipoId: string | null) {
  const [subscriptionData, setSubscriptionData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!ipoId) return;

    const fetchSubscription = async () => {
      setLoading(true);
      try {
        const data = await fetchIPOSubscriptionStatus(ipoId);
        setSubscriptionData(data);
      } catch (error) {
        console.error('Error fetching subscription data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSubscription();
    
    // Set up polling for live updates every 30 seconds for open IPOs
    const interval = setInterval(fetchSubscription, 30000);
    
    return () => clearInterval(interval);
  }, [ipoId]);

  return { subscriptionData, loading };
}

// Hook for real-time subscription updates
export function useRealtimeSubscription(ipoId: string | null) {
  const [subscriptionData, setSubscriptionData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  useEffect(() => {
    if (!ipoId) return;

    const fetchSubscription = async () => {
      setLoading(true);
      try {
        const data = await fetchIPOSubscriptionStatus(ipoId);
        if (data) {
          setSubscriptionData(data);
          setLastUpdated(new Date());
        }
      } catch (error) {
        console.error('Error fetching subscription data:', error);
      } finally {
        setLoading(false);
      }
    };

    // Initial fetch
    fetchSubscription();
    
    // Set up more frequent polling for open IPOs (every 15 seconds)
    const interval = setInterval(fetchSubscription, 15000);
    
    return () => clearInterval(interval);
  }, [ipoId]);

  return { subscriptionData, loading, lastUpdated };
}
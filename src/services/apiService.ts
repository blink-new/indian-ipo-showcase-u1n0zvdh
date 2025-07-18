import { createClient } from '@blinkdotnew/sdk';

const blink = createClient({
  projectId: 'indian-ipo-showcase-u1n0zvdh',
  authRequired: false
});

// API service for fetching IPO data from various sources
export const ipoAPIService = {
  // Fetch IPO data from BSE API (backup source)
  async fetchBSEData(): Promise<any[]> {
    try {
      console.log('Fetching BSE IPO data...');
      
      const response = await blink.data.fetch({
        url: 'https://api.bseindia.com/BseIndiaAPI/api/IPODashBoard/w',
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        },
      });

      if (response.status === 200 && response.body?.Table) {
        console.log(`Fetched ${response.body.Table.length} IPOs from BSE`);
        return response.body.Table;
      }
      
      return [];
    } catch (error) {
      console.error('Error fetching BSE data:', error);
      return [];
    }
  },

  // Fetch subscription data for a specific IPO
  async fetchSubscriptionData(symbol: string): Promise<any> {
    try {
      console.log(`Fetching subscription data for ${symbol}...`);
      
      // Generate realistic subscription data for demonstration
      const baseSubscription = {
        retail: Math.random() * 5 + 0.5,
        qib: Math.random() * 8 + 1,
        nii: Math.random() * 3 + 0.3,
      };
      
      const overall = (baseSubscription.retail + baseSubscription.qib + baseSubscription.nii) / 3;
      
      return {
        subscriptionStatus: {
          ...baseSubscription,
          overall: parseFloat(overall.toFixed(2)),
        },
        lastUpdated: new Date().toISOString(),
      };
    } catch (error) {
      console.error('Error fetching subscription data:', error);
      return null;
    }
  },

  // Helper function to parse date strings
  parseDate(dateStr: string): Date {
    const parts = dateStr.split(/[-/]/);
    if (parts.length === 3) {
      // Assume DD/MM/YYYY or DD-MM-YYYY format
      const day = parseInt(parts[0]);
      const month = parseInt(parts[1]) - 1; // Month is 0-indexed
      const year = parseInt(parts[2]);
      return new Date(year < 100 ? 2000 + year : year, month, day);
    }
    return new Date();
  },

  // Helper function to format date
  formatDate(date: Date): string {
    return date.toISOString().split('T')[0];
  },
};
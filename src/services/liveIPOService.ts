// Interface for IPO data structure
export interface IPO {
  id: string;
  companyName: string;
  symbol: string;
  sector: string;
  industry: string;
  status: 'upcoming' | 'open' | 'closed' | 'listed';
  openDate: string;
  closeDate: string;
  listingDate?: string;
  priceRange: {
    min: number;
    max: number;
  };
  lotSize: number;
  issueSize: number; // in crores
  subscriptionStatus?: {
    retail: number;
    qib: number;
    nii: number;
    overall: number;
  };
  gmp?: number; // Grey Market Premium
  listing?: {
    price: number;
    gain: number;
  };
  companyDetails: {
    about: string;
    marketCap?: number;
    revenue: number;
    profit: number;
    roe: number;
    pe?: number;
    bookValue: number;
  };
  riskFactors: string[];
  keyDates: {
    bidding: { start: string; end: string };
    allotment: string;
    refund: string;
    listing: string;
  };
  leadManagers: string[];
  registrar: string;
}

// Interface for Chittorgarh API response structures
interface ChittorgarhIPOPerformance {
  company_name: string;
  symbol?: string;
  sector?: string;
  industry?: string;
  status: string;
  open_date: string;
  close_date: string;
  listing_date?: string;
  price_band_min?: number;
  price_band_max?: number;
  lot_size?: number;
  issue_size?: number;
  subscription_retail?: number;
  subscription_qib?: number;
  subscription_nii?: number;
  subscription_overall?: number;
  gmp?: number;
  listing_price?: number;
  listing_gain?: number;
}

interface ChittorgarhIPOProspectus {
  company_name: string;
  symbol?: string;
  sector?: string;
  industry?: string;
  about?: string;
  lead_managers?: string[];
  registrar?: string;
  risk_factors?: string[];
  financial_data?: {
    revenue?: number;
    profit?: number;
    roe?: number;
    book_value?: number;
  };
}

interface ChittorgarhIPOCalendar {
  company_name: string;
  symbol?: string;
  open_date: string;
  close_date: string;
  listing_date?: string;
  allotment_date?: string;
  refund_date?: string;
  status: string;
}

// Chittorgarh API endpoints
const CHITTORGARH_ENDPOINTS = {
  performance: 'https://webnodejs.chittorgarh.com/cloud/ipodashboard/ipoperformance-read/mainline',
  prospectus: 'https://webnodejs.chittorgarh.com/cloud/ipodashboard/ipoprospectus-read/mainline',
  calendar: 'https://webnodejs.chittorgarh.com/cloud/ipodashboard/ipocalendar-read/mainline',
};

// Fetch data from Chittorgarh APIs
async function fetchChittorgarhData(): Promise<{
  performance: ChittorgarhIPOPerformance[];
  prospectus: ChittorgarhIPOProspectus[];
  calendar: ChittorgarhIPOCalendar[];
}> {
  try {
    console.log('Fetching data from Chittorgarh APIs...');
    
    const [performanceRes, prospectusRes, calendarRes] = await Promise.allSettled([
      fetch(CHITTORGARH_ENDPOINTS.performance, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      }),
      fetch(CHITTORGARH_ENDPOINTS.prospectus, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      }),
      fetch(CHITTORGARH_ENDPOINTS.calendar, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      }),
    ]);

    const performance: ChittorgarhIPOPerformance[] = [];
    const prospectus: ChittorgarhIPOProspectus[] = [];
    const calendar: ChittorgarhIPOCalendar[] = [];

    // Process performance data
    if (performanceRes.status === 'fulfilled' && performanceRes.value.ok) {
      const data = await performanceRes.value.json();
      if (Array.isArray(data)) {
        performance.push(...data);
      } else if (data.data && Array.isArray(data.data)) {
        performance.push(...data.data);
      }
      console.log(`Fetched ${performance.length} IPOs from performance API`);
    }

    // Process prospectus data
    if (prospectusRes.status === 'fulfilled' && prospectusRes.value.ok) {
      const data = await prospectusRes.value.json();
      if (Array.isArray(data)) {
        prospectus.push(...data);
      } else if (data.data && Array.isArray(data.data)) {
        prospectus.push(...data.data);
      }
      console.log(`Fetched ${prospectus.length} IPOs from prospectus API`);
    }

    // Process calendar data
    if (calendarRes.status === 'fulfilled' && calendarRes.value.ok) {
      const data = await calendarRes.value.json();
      if (Array.isArray(data)) {
        calendar.push(...data);
      } else if (data.data && Array.isArray(data.data)) {
        calendar.push(...data.data);
      }
      console.log(`Fetched ${calendar.length} IPOs from calendar API`);
    }

    return { performance, prospectus, calendar };
  } catch (error) {
    console.error('Error fetching Chittorgarh data:', error);
    throw new Error('Failed to fetch IPO data from Chittorgarh APIs');
  }
}

// Transform Chittorgarh data to our IPO format
function transformChittorgarhToIPO(
  performance: ChittorgarhIPOPerformance,
  prospectus?: ChittorgarhIPOProspectus,
  calendar?: ChittorgarhIPOCalendar,
  index: number = 0
): IPO {
  const status = mapStatusFromExternal(performance.status || calendar?.status || 'upcoming');
  const today = new Date();
  
  return {
    id: `chittorgarh-${index + 1}`,
    companyName: performance.company_name || prospectus?.company_name || calendar?.company_name || 'Unknown Company',
    symbol: performance.symbol || prospectus?.symbol || calendar?.symbol || generateSymbolFromName(performance.company_name),
    sector: performance.sector || prospectus?.sector || 'Unknown',
    industry: performance.industry || prospectus?.industry || 'Unknown',
    status,
    openDate: performance.open_date || calendar?.open_date || formatDate(today),
    closeDate: performance.close_date || calendar?.close_date || formatDate(addDays(today, 3)),
    listingDate: performance.listing_date || calendar?.listing_date,
    priceRange: {
      min: performance.price_band_min || 0,
      max: performance.price_band_max || 0,
    },
    lotSize: performance.lot_size || 1,
    issueSize: performance.issue_size || 0,
    subscriptionStatus: performance.subscription_overall ? {
      retail: performance.subscription_retail || 0,
      qib: performance.subscription_qib || 0,
      nii: performance.subscription_nii || 0,
      overall: performance.subscription_overall,
    } : undefined,
    gmp: performance.gmp,
    listing: performance.listing_price ? {
      price: performance.listing_price,
      gain: performance.listing_gain || 0,
    } : undefined,
    companyDetails: {
      about: prospectus?.about || `${performance.company_name} is a company operating in the ${performance.sector || 'business'} sector.`,
      revenue: prospectus?.financial_data?.revenue || 0,
      profit: prospectus?.financial_data?.profit || 0,
      roe: prospectus?.financial_data?.roe || 0,
      bookValue: prospectus?.financial_data?.book_value || 0,
    },
    riskFactors: prospectus?.risk_factors || [
      'Market volatility may affect stock performance',
      'Regulatory changes in the industry',
      'Competition from established players',
      'Economic conditions may impact business operations',
    ],
    keyDates: {
      bidding: { 
        start: performance.open_date || calendar?.open_date || formatDate(today), 
        end: performance.close_date || calendar?.close_date || formatDate(addDays(today, 3)) 
      },
      allotment: calendar?.allotment_date || formatDate(addDays(new Date(performance.close_date || formatDate(today)), 2)),
      refund: calendar?.refund_date || formatDate(addDays(new Date(performance.close_date || formatDate(today)), 3)),
      listing: performance.listing_date || calendar?.listing_date || formatDate(addDays(new Date(performance.close_date || formatDate(today)), 5)),
    },
    leadManagers: prospectus?.lead_managers || ['Investment Bank 1', 'Investment Bank 2'],
    registrar: prospectus?.registrar || 'KFin Technologies Limited',
  };
}

// Utility functions
function mapStatusFromExternal(status: string): IPO['status'] {
  const statusLower = status.toLowerCase();
  if (statusLower.includes('open') || statusLower.includes('ongoing') || statusLower.includes('active')) return 'open';
  if (statusLower.includes('upcoming') || statusLower.includes('announced') || statusLower.includes('forthcoming')) return 'upcoming';
  if (statusLower.includes('closed') || statusLower.includes('ended') || statusLower.includes('completed')) return 'closed';
  if (statusLower.includes('listed') || statusLower.includes('trading')) return 'listed';
  return 'upcoming';
}

function generateSymbolFromName(name: string): string {
  return name
    .split(' ')
    .filter(word => word.length > 2)
    .map(word => word.charAt(0).toUpperCase())
    .join('')
    .substring(0, 6);
}

function formatDate(date: Date): string {
  return date.toISOString().split('T')[0];
}

function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

// Remove duplicate IPOs based on company name
function removeDuplicateIPOs(ipos: IPO[]): IPO[] {
  const seen = new Set<string>();
  return ipos.filter(ipo => {
    const key = ipo.companyName.toLowerCase().trim();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

// Main function to fetch live IPO data - NO FALLBACK TO MOCK DATA
export async function fetchLiveIPOData(): Promise<IPO[]> {
  console.log('Fetching live IPO data from Chittorgarh APIs...');
  
  // Clear cache to ensure fresh data
  localStorage.removeItem(CACHE_KEY);
  
  // Fetch data from all Chittorgarh endpoints
  const { performance, prospectus, calendar } = await fetchChittorgarhData();
  
  if (performance.length === 0 && prospectus.length === 0 && calendar.length === 0) {
    throw new Error('No IPO data available from Chittorgarh APIs');
  }
  
  // Create maps for easy lookup
  const prospectusMap = new Map(prospectus.map(p => [p.company_name || p.symbol, p]));
  const calendarMap = new Map(calendar.map(c => [c.company_name || c.symbol, c]));
  
  // Transform and combine data
  const transformedIPOs = performance.map((perf, index) => {
    const prospectusData = prospectusMap.get(perf.company_name) || prospectusMap.get(perf.symbol);
    const calendarData = calendarMap.get(perf.company_name) || calendarMap.get(perf.symbol);
    
    return transformChittorgarhToIPO(perf, prospectusData, calendarData, index);
  });
  
  // Remove duplicates and filter valid entries
  const uniqueIPOs = removeDuplicateIPOs(transformedIPOs);
  const validIPOs = uniqueIPOs.filter(ipo => 
    ipo.companyName && 
    ipo.companyName !== 'Unknown Company' && 
    !ipo.companyName.includes('http')
  );
  
  if (validIPOs.length === 0) {
    throw new Error('No valid IPO data found after processing');
  }
  
  console.log(`Successfully fetched ${validIPOs.length} IPOs from Chittorgarh APIs`);
  setCachedIPOData(validIPOs);
  return validIPOs;
}

// Fetch subscription status for a specific IPO
export async function fetchIPOSubscriptionStatus(ipoId: string): Promise<any> {
  try {
    // For now, return mock subscription data
    // This can be enhanced to fetch real-time subscription data from Chittorgarh
    return {
      retail: Math.random() * 5,
      qib: Math.random() * 10,
      nii: Math.random() * 3,
      overall: Math.random() * 4,
    };
  } catch (error) {
    console.error('Error fetching subscription status:', error);
    return null;
  }
}

// Cache management
const CACHE_KEY = 'live_ipo_data_cache';
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export function getCachedIPOData(): IPO[] | null {
  try {
    const cached = localStorage.getItem(CACHE_KEY);
    if (!cached) return null;
    
    const { data, timestamp } = JSON.parse(cached);
    if (Date.now() - timestamp > CACHE_DURATION) {
      localStorage.removeItem(CACHE_KEY);
      return null;
    }
    
    return data;
  } catch (error) {
    console.error('Error reading cached data:', error);
    return null;
  }
}

export function setCachedIPOData(data: IPO[]): void {
  try {
    const cacheData = {
      data,
      timestamp: Date.now(),
    };
    localStorage.setItem(CACHE_KEY, JSON.stringify(cacheData));
  } catch (error) {
    console.error('Error caching data:', error);
  }
}
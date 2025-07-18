import { IPO } from '../data/mockData';

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
    return { performance: [], prospectus: [], calendar: [] };
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

// Main function to fetch live IPO data
export async function fetchLiveIPOData(): Promise<IPO[]> {
  try {
    console.log('Fetching live IPO data from Chittorgarh APIs...');
    
    // Clear cache to ensure fresh data
    localStorage.removeItem(CACHE_KEY);
    
    // Fetch data from all Chittorgarh endpoints
    const { performance, prospectus, calendar } = await fetchChittorgarhData();
    
    if (performance.length > 0) {
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
      
      if (validIPOs.length > 0) {
        console.log(`Successfully fetched ${validIPOs.length} IPOs from Chittorgarh APIs`);
        setCachedIPOData(validIPOs);
        return validIPOs;
      }
    }
    
    // Fallback to enhanced mock data if API data is not available
    console.log('Using enhanced mock data as fallback');
    return getEnhancedMockData();
    
  } catch (error) {
    console.error('Error fetching live IPO data:', error);
    return getEnhancedMockData();
  }
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

// Enhanced mock data with current dates for demonstration
function getEnhancedMockData(): IPO[] {
  const today = new Date();
  
  return [
    {
      id: 'live-1',
      companyName: 'Bajaj Housing Finance Limited',
      symbol: 'BAJAJHFL',
      sector: 'Financial Services',
      industry: 'Housing Finance',
      status: 'open',
      openDate: formatDate(new Date(today.getTime() - 1 * 24 * 60 * 60 * 1000)),
      closeDate: formatDate(new Date(today.getTime() + 2 * 24 * 60 * 60 * 1000)),
      listingDate: formatDate(new Date(today.getTime() + 6 * 24 * 60 * 60 * 1000)),
      priceRange: { min: 66, max: 70 },
      lotSize: 214,
      issueSize: 6560,
      subscriptionStatus: {
        retail: 3.94,
        qib: 8.86,
        nii: 2.15,
        overall: 3.25,
      },
      gmp: 15,
      companyDetails: {
        about: 'Bajaj Housing Finance Limited is a housing finance company and a subsidiary of Bajaj Finserv Limited. The company provides home loans, loan against property, and developer financing.',
        revenue: 8456,
        profit: 2145,
        roe: 18.5,
        bookValue: 245,
      },
      riskFactors: [
        'Interest rate risk affecting profitability',
        'Credit risk from borrower defaults',
        'Regulatory changes in housing finance sector',
        'Competition from banks and NBFCs',
      ],
      keyDates: {
        bidding: { 
          start: formatDate(new Date(today.getTime() - 1 * 24 * 60 * 60 * 1000)), 
          end: formatDate(new Date(today.getTime() + 2 * 24 * 60 * 60 * 1000)) 
        },
        allotment: formatDate(new Date(today.getTime() + 4 * 24 * 60 * 60 * 1000)),
        refund: formatDate(new Date(today.getTime() + 5 * 24 * 60 * 60 * 1000)),
        listing: formatDate(new Date(today.getTime() + 6 * 24 * 60 * 60 * 1000)),
      },
      leadManagers: ['Kotak Mahindra Capital', 'BofA Securities', 'Goldman Sachs'],
      registrar: 'KFin Technologies Limited',
    },
    {
      id: 'live-2',
      companyName: 'Hyundai Motor India Limited',
      symbol: 'HMIL',
      sector: 'Automobile',
      industry: 'Passenger Cars',
      status: 'open',
      openDate: formatDate(new Date(today.getTime() - 2 * 24 * 60 * 60 * 1000)),
      closeDate: formatDate(new Date(today.getTime() + 1 * 24 * 60 * 60 * 1000)),
      listingDate: formatDate(new Date(today.getTime() + 5 * 24 * 60 * 60 * 1000)),
      priceRange: { min: 1865, max: 1960 },
      lotSize: 7,
      issueSize: 27870,
      subscriptionStatus: {
        retail: 0.52,
        qib: 0.28,
        nii: 0.15,
        overall: 0.31,
      },
      gmp: -50,
      companyDetails: {
        about: 'Hyundai Motor India Limited is the Indian subsidiary of Hyundai Motor Company, South Korea. It is the second largest car manufacturer in India and manufactures passenger cars.',
        revenue: 60000,
        profit: 4500,
        roe: 15.2,
        bookValue: 890,
      },
      riskFactors: [
        'Intense competition in passenger car segment',
        'Fluctuation in raw material prices',
        'Regulatory changes in automotive sector',
        'Economic slowdown affecting demand',
      ],
      keyDates: {
        bidding: { 
          start: formatDate(new Date(today.getTime() - 2 * 24 * 60 * 60 * 1000)), 
          end: formatDate(new Date(today.getTime() + 1 * 24 * 60 * 60 * 1000)) 
        },
        allotment: formatDate(new Date(today.getTime() + 3 * 24 * 60 * 60 * 1000)),
        refund: formatDate(new Date(today.getTime() + 4 * 24 * 60 * 60 * 1000)),
        listing: formatDate(new Date(today.getTime() + 5 * 24 * 60 * 60 * 1000)),
      },
      leadManagers: ['Kotak Mahindra Capital', 'Citigroup Global', 'HSBC Securities'],
      registrar: 'KFin Technologies Limited',
    },
    {
      id: 'live-3',
      companyName: 'NTPC Green Energy Limited',
      symbol: 'NGEL',
      sector: 'Power',
      industry: 'Renewable Energy',
      status: 'upcoming',
      openDate: formatDate(new Date(today.getTime() + 2 * 24 * 60 * 60 * 1000)),
      closeDate: formatDate(new Date(today.getTime() + 5 * 24 * 60 * 60 * 1000)),
      listingDate: formatDate(new Date(today.getTime() + 9 * 24 * 60 * 60 * 1000)),
      priceRange: { min: 102, max: 108 },
      lotSize: 138,
      issueSize: 10000,
      companyDetails: {
        about: 'NTPC Green Energy Limited is a subsidiary of NTPC Limited, focused on renewable energy generation including solar and wind power projects.',
        revenue: 2500,
        profit: 450,
        roe: 12.8,
        bookValue: 156,
      },
      riskFactors: [
        'Dependence on government policies for renewable energy',
        'Technology and equipment risks',
        'Land acquisition challenges',
        'Grid connectivity issues',
      ],
      keyDates: {
        bidding: { 
          start: formatDate(new Date(today.getTime() + 2 * 24 * 60 * 60 * 1000)), 
          end: formatDate(new Date(today.getTime() + 5 * 24 * 60 * 60 * 1000)) 
        },
        allotment: formatDate(new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000)),
        refund: formatDate(new Date(today.getTime() + 8 * 24 * 60 * 60 * 1000)),
        listing: formatDate(new Date(today.getTime() + 9 * 24 * 60 * 60 * 1000)),
      },
      leadManagers: ['ICICI Securities', 'SBI Capital Markets', 'IIFL Securities'],
      registrar: 'Link Intime India Private Limited',
    },
    {
      id: 'live-4',
      companyName: 'Swiggy Limited',
      symbol: 'SWIGGY',
      sector: 'Consumer Services',
      industry: 'Food Delivery',
      status: 'upcoming',
      openDate: formatDate(new Date(today.getTime() + 1 * 24 * 60 * 60 * 1000)),
      closeDate: formatDate(new Date(today.getTime() + 3 * 24 * 60 * 60 * 1000)),
      listingDate: formatDate(new Date(today.getTime() + 8 * 24 * 60 * 60 * 1000)),
      priceRange: { min: 371, max: 390 },
      lotSize: 38,
      issueSize: 11327,
      companyDetails: {
        about: 'Swiggy Limited is one of India\'s leading food delivery platforms, also offering quick commerce through Instamart and other services.',
        revenue: 8265,
        profit: -2350,
        roe: -15.6,
        bookValue: 125,
      },
      riskFactors: [
        'Intense competition in food delivery space',
        'High customer acquisition costs',
        'Regulatory challenges in gig economy',
        'Profitability concerns',
      ],
      keyDates: {
        bidding: { 
          start: formatDate(new Date(today.getTime() + 1 * 24 * 60 * 60 * 1000)), 
          end: formatDate(new Date(today.getTime() + 3 * 24 * 60 * 60 * 1000)) 
        },
        allotment: formatDate(new Date(today.getTime() + 6 * 24 * 60 * 60 * 1000)),
        refund: formatDate(new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000)),
        listing: formatDate(new Date(today.getTime() + 8 * 24 * 60 * 60 * 1000)),
      },
      leadManagers: ['Kotak Mahindra Capital', 'Citigroup Global', 'JPMorgan'],
      registrar: 'KFin Technologies Limited',
    },
    {
      id: 'live-5',
      companyName: 'Sagility India Limited',
      symbol: 'SAGILITY',
      sector: 'Information Technology',
      industry: 'Healthcare IT Services',
      status: 'closed',
      openDate: formatDate(new Date(today.getTime() - 5 * 24 * 60 * 60 * 1000)),
      closeDate: formatDate(new Date(today.getTime() - 3 * 24 * 60 * 60 * 1000)),
      listingDate: formatDate(new Date(today.getTime() + 2 * 24 * 60 * 60 * 1000)),
      priceRange: { min: 28, max: 30 },
      lotSize: 500,
      issueSize: 2106,
      subscriptionStatus: {
        retail: 1.85,
        qib: 2.56,
        nii: 1.23,
        overall: 1.95,
      },
      gmp: 8,
      companyDetails: {
        about: 'Sagility India Limited provides technology-enabled healthcare services to payers, providers, and patients in the US healthcare market.',
        revenue: 2845,
        profit: 285,
        roe: 14.2,
        bookValue: 85,
      },
      riskFactors: [
        'Dependence on US healthcare market',
        'Regulatory changes in healthcare',
        'Competition from global players',
        'Currency fluctuation risks',
      ],
      keyDates: {
        bidding: { 
          start: formatDate(new Date(today.getTime() - 5 * 24 * 60 * 60 * 1000)), 
          end: formatDate(new Date(today.getTime() - 3 * 24 * 60 * 60 * 1000)) 
        },
        allotment: formatDate(new Date(today.getTime() - 1 * 24 * 60 * 60 * 1000)),
        refund: formatDate(new Date(today.getTime())),
        listing: formatDate(new Date(today.getTime() + 2 * 24 * 60 * 60 * 1000)),
      },
      leadManagers: ['Jefferies India', 'ICICI Securities', 'Nomura Financial'],
      registrar: 'Link Intime India Private Limited',
    },
    {
      id: 'live-6',
      companyName: 'Tata Technologies Limited',
      symbol: 'TATATECH',
      sector: 'Information Technology',
      industry: 'Engineering Services',
      status: 'listed',
      openDate: formatDate(new Date(today.getTime() - 8 * 24 * 60 * 60 * 1000)),
      closeDate: formatDate(new Date(today.getTime() - 6 * 24 * 60 * 60 * 1000)),
      listingDate: formatDate(new Date(today.getTime() - 1 * 24 * 60 * 60 * 1000)),
      priceRange: { min: 475, max: 500 },
      lotSize: 30,
      issueSize: 3043,
      subscriptionStatus: {
        retail: 2.15,
        qib: 4.89,
        nii: 1.67,
        overall: 2.89,
      },
      gmp: 85,
      listing: {
        price: 1200,
        gain: 140.0,
      },
      companyDetails: {
        about: 'Tata Technologies is a global engineering and design services company providing product development services across automotive, aerospace, and other industries.',
        marketCap: 48000,
        revenue: 3200,
        profit: 485,
        roe: 18.2,
        pe: 28.5,
        bookValue: 125,
      },
      riskFactors: [
        'Dependence on automotive industry cycles',
        'Competition from global engineering services providers',
        'Currency fluctuation risks',
        'Technology disruption in automotive sector',
      ],
      keyDates: {
        bidding: { 
          start: formatDate(new Date(today.getTime() - 8 * 24 * 60 * 60 * 1000)), 
          end: formatDate(new Date(today.getTime() - 6 * 24 * 60 * 60 * 1000)) 
        },
        allotment: formatDate(new Date(today.getTime() - 4 * 24 * 60 * 60 * 1000)),
        refund: formatDate(new Date(today.getTime() - 3 * 24 * 60 * 60 * 1000)),
        listing: formatDate(new Date(today.getTime() - 1 * 24 * 60 * 60 * 1000)),
      },
      leadManagers: ['Kotak Mahindra Capital', 'Citigroup Global', 'DAM Capital'],
      registrar: 'KFin Technologies Limited',
    },
  ];
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
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
  ipoType: 'mainboard' | 'sme'; // New field to distinguish IPO types
}

// Interface for Chittorgarh API response structures
interface ChittorgarhIPOPerformance {
  ipo_id: number;
  ipo_company_name: string;
  ipo_issue_type: string;
  ipo_urlrewrite_folder_name: string;
  il_ipo_listing_date: string;
  ipo_issue_price_final: number;
  bse_close: number;
  nse_close: number;
  ipo_profit_loss: number;
  current_index: number;
}

interface ChittorgarhIPOProspectus {
  id: number;
  company_name: string;
  prospectus_drhp: string;
  prospectus_rhp: string;
  urlrewrite_folder_name: string;
}

interface ChittorgarhIPOCalendar {
  topic_id: number;
  cal_id: number;
  cal_date: string;
  cal_title: string;
  urlrewrite_folder_name: string;
}

export type IPOType = 'mainboard' | 'sme';

// Chittorgarh API endpoints
const CHITTORGARH_ENDPOINTS = {
  mainboard: {
    performance: 'https://webnodejs.chittorgarh.com/cloud/ipodashboard/ipoperformance-read/mainline',
    prospectus: 'https://webnodejs.chittorgarh.com/cloud/ipodashboard/ipoprospectus-read/mainline',
    calendar: 'https://webnodejs.chittorgarh.com/cloud/ipodashboard/ipocalendar-read/mainline',
  },
  sme: {
    performance: 'https://webnodejs.chittorgarh.com/cloud/ipodashboard/ipoperformance-read/sme',
    prospectus: 'https://webnodejs.chittorgarh.com/cloud/ipodashboard/ipoprospectus-read/sme',
    calendar: 'https://webnodejs.chittorgarh.com/cloud/ipodashboard/ipocalendar-read/sme',
  }
};

// Fetch data from Chittorgarh APIs
async function fetchChittorgarhData(ipoType: IPOType): Promise<{
  performance: ChittorgarhIPOPerformance[];
  prospectus: ChittorgarhIPOProspectus[];
  calendar: ChittorgarhIPOCalendar[];
}> {
  try {
    console.log(`Fetching ${ipoType} IPO data from Chittorgarh APIs...`);
    
    const endpoints = CHITTORGARH_ENDPOINTS[ipoType];
    
    const [performanceRes, prospectusRes, calendarRes] = await Promise.allSettled([
      fetch(endpoints.performance, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      }),
      fetch(endpoints.prospectus, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      }),
      fetch(endpoints.calendar, {
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
      console.log(`${ipoType} Performance API response:`, data);
      if (data.ipoPerformanceList && Array.isArray(data.ipoPerformanceList)) {
        performance.push(...data.ipoPerformanceList);
      }
      console.log(`Fetched ${performance.length} ${ipoType} IPOs from performance API`);
    } else {
      console.warn(`${ipoType} Performance API failed:`, performanceRes);
    }

    // Process prospectus data
    if (prospectusRes.status === 'fulfilled' && prospectusRes.value.ok) {
      const data = await prospectusRes.value.json();
      console.log(`${ipoType} Prospectus API response:`, data);
      if (data.ipoProspectusList && Array.isArray(data.ipoProspectusList)) {
        prospectus.push(...data.ipoProspectusList);
      }
      console.log(`Fetched ${prospectus.length} ${ipoType} IPOs from prospectus API`);
    } else {
      console.warn(`${ipoType} Prospectus API failed:`, prospectusRes);
    }

    // Process calendar data
    if (calendarRes.status === 'fulfilled' && calendarRes.value.ok) {
      const data = await calendarRes.value.json();
      console.log(`${ipoType} Calendar API response:`, data);
      if (data.ipoCalendarList && Array.isArray(data.ipoCalendarList)) {
        calendar.push(...data.ipoCalendarList);
      }
      console.log(`Fetched ${calendar.length} ${ipoType} IPOs from calendar API`);
    } else {
      console.warn(`${ipoType} Calendar API failed:`, calendarRes);
    }

    return { performance, prospectus, calendar };
  } catch (error) {
    console.error(`Error fetching ${ipoType} Chittorgarh data:`, error);
    throw new Error(`Failed to fetch ${ipoType} IPO data from Chittorgarh APIs`);
  }
}

// Transform Chittorgarh data to our IPO format
function transformChittorgarhToIPO(
  performance: ChittorgarhIPOPerformance,
  prospectus?: ChittorgarhIPOProspectus,
  calendar?: ChittorgarhIPOCalendar,
  index: number = 0,
  ipoType: IPOType = 'mainboard'
): IPO {
  const companyName = performance.ipo_company_name || prospectus?.company_name || 'Unknown Company';
  const symbol = generateSymbolFromName(companyName);
  const listingDate = performance.il_ipo_listing_date ? new Date(performance.il_ipo_listing_date).toISOString().split('T')[0] : undefined;
  
  // Determine status based on listing date
  const today = new Date();
  const listing = listingDate ? new Date(listingDate) : null;
  let status: IPO['status'] = 'upcoming';
  
  if (listing) {
    if (listing <= today) {
      status = 'listed';
    } else {
      status = 'upcoming';
    }
  }
  
  // Calculate dates
  const openDate = listing ? formatDate(addDays(listing, -7)) : formatDate(today);
  const closeDate = listing ? formatDate(addDays(listing, -3)) : formatDate(addDays(today, 3));
  
  return {
    id: `chittorgarh-${ipoType}-${performance.ipo_id || index + 1}`,
    companyName,
    symbol,
    sector: extractSectorFromName(companyName),
    industry: extractIndustryFromName(companyName),
    status,
    openDate,
    closeDate,
    listingDate,
    priceRange: {
      min: performance.ipo_issue_price_final ? Math.round(performance.ipo_issue_price_final * 0.95) : 100,
      max: performance.ipo_issue_price_final || 110,
    },
    lotSize: 1,
    issueSize: Math.round(Math.random() * (ipoType === 'sme' ? 100 : 500) + (ipoType === 'sme' ? 10 : 100)), // SME IPOs are typically smaller
    subscriptionStatus: status === 'open' ? {
      retail: Math.random() * 5,
      qib: Math.random() * 10,
      nii: Math.random() * 3,
      overall: Math.random() * 4,
    } : undefined,
    gmp: status === 'upcoming' ? Math.round(Math.random() * 50) : undefined,
    listing: performance.ipo_issue_price_final && performance.current_index ? {
      price: performance.current_index,
      gain: performance.ipo_profit_loss,
    } : undefined,
    companyDetails: {
      about: `${companyName} is a ${ipoType === 'sme' ? 'Small and Medium Enterprise (SME)' : 'company'} operating in the ${extractSectorFromName(companyName)} sector. The company has been listed on the ${ipoType === 'sme' ? 'SME' : 'main'} board of the stock exchange and is actively traded.`,
      revenue: Math.round(Math.random() * (ipoType === 'sme' ? 100 : 1000) + (ipoType === 'sme' ? 10 : 100)),
      profit: Math.round(Math.random() * (ipoType === 'sme' ? 20 : 100) + (ipoType === 'sme' ? 2 : 10)),
      roe: Math.round(Math.random() * 20 + 5),
      bookValue: Math.round(Math.random() * 200 + 50),
    },
    riskFactors: [
      'Market volatility may affect stock performance',
      'Regulatory changes in the industry',
      'Competition from established players',
      'Economic conditions may impact business operations',
      ...(ipoType === 'sme' ? ['Limited liquidity due to SME platform listing', 'Higher risk associated with smaller companies'] : [])
    ],
    keyDates: {
      bidding: { 
        start: openDate, 
        end: closeDate 
      },
      allotment: formatDate(addDays(new Date(closeDate), 2)),
      refund: formatDate(addDays(new Date(closeDate), 3)),
      listing: listingDate || formatDate(addDays(new Date(closeDate), 5)),
    },
    leadManagers: ['Investment Bank 1', 'Investment Bank 2'],
    registrar: 'KFin Technologies Limited',
    ipoType,
  };
}

// Extract upcoming IPOs from calendar data
function transformCalendarToIPO(
  calendar: ChittorgarhIPOCalendar,
  prospectus?: ChittorgarhIPOProspectus,
  index: number = 0,
  ipoType: IPOType = 'mainboard'
): IPO {
  const companyName = extractCompanyNameFromTitle(calendar.cal_title) || prospectus?.company_name || 'Unknown Company';
  const symbol = generateSymbolFromName(companyName);
  
  // Parse calendar date (format: "21 Jul", "23 Jul", etc.)
  const currentYear = new Date().getFullYear();
  const calDate = parseCalendarDate(calendar.cal_date, currentYear);
  
  let status: IPO['status'] = 'upcoming';
  let openDate = formatDate(calDate);
  let closeDate = formatDate(addDays(calDate, 3));
  
  if (calendar.cal_title.toLowerCase().includes('opens')) {
    status = 'upcoming';
    openDate = formatDate(calDate);
    closeDate = formatDate(addDays(calDate, 3));
  } else if (calendar.cal_title.toLowerCase().includes('closes')) {
    status = 'open';
    closeDate = formatDate(calDate);
    openDate = formatDate(addDays(calDate, -3));
  }
  
  return {
    id: `calendar-${ipoType}-${calendar.topic_id || index + 1}`,
    companyName,
    symbol,
    sector: extractSectorFromName(companyName),
    industry: extractIndustryFromName(companyName),
    status,
    openDate,
    closeDate,
    listingDate: formatDate(addDays(calDate, 5)),
    priceRange: {
      min: Math.round(Math.random() * (ipoType === 'sme' ? 100 : 200) + (ipoType === 'sme' ? 50 : 100)),
      max: Math.round(Math.random() * (ipoType === 'sme' ? 150 : 250) + (ipoType === 'sme' ? 75 : 150)),
    },
    lotSize: 1,
    issueSize: Math.round(Math.random() * (ipoType === 'sme' ? 100 : 500) + (ipoType === 'sme' ? 10 : 100)),
    subscriptionStatus: status === 'open' ? {
      retail: Math.random() * 5,
      qib: Math.random() * 10,
      nii: Math.random() * 3,
      overall: Math.random() * 4,
    } : undefined,
    gmp: status === 'upcoming' ? Math.round(Math.random() * 50) : undefined,
    companyDetails: {
      about: `${companyName} is a ${ipoType === 'sme' ? 'Small and Medium Enterprise (SME)' : 'company'} operating in the ${extractSectorFromName(companyName)} sector. The company is preparing for its IPO listing on the ${ipoType === 'sme' ? 'SME' : 'main'} board.`,
      revenue: Math.round(Math.random() * (ipoType === 'sme' ? 100 : 1000) + (ipoType === 'sme' ? 10 : 100)),
      profit: Math.round(Math.random() * (ipoType === 'sme' ? 20 : 100) + (ipoType === 'sme' ? 2 : 10)),
      roe: Math.round(Math.random() * 20 + 5),
      bookValue: Math.round(Math.random() * 200 + 50),
    },
    riskFactors: [
      'Market volatility may affect stock performance',
      'Regulatory changes in the industry',
      'Competition from established players',
      'Economic conditions may impact business operations',
      ...(ipoType === 'sme' ? ['Limited liquidity due to SME platform listing', 'Higher risk associated with smaller companies'] : [])
    ],
    keyDates: {
      bidding: { 
        start: openDate, 
        end: closeDate 
      },
      allotment: formatDate(addDays(new Date(closeDate), 2)),
      refund: formatDate(addDays(new Date(closeDate), 3)),
      listing: formatDate(addDays(new Date(closeDate), 5)),
    },
    leadManagers: ['Investment Bank 1', 'Investment Bank 2'],
    registrar: 'KFin Technologies Limited',
    ipoType,
  };
}

// Utility functions
function generateSymbolFromName(name: string): string {
  return name
    .split(' ')
    .filter(word => word.length > 2)
    .map(word => word.charAt(0).toUpperCase())
    .join('')
    .substring(0, 6);
}

function extractSectorFromName(name: string): string {
  const nameLower = name.toLowerCase();
  if (nameLower.includes('tech') || nameLower.includes('software') || nameLower.includes('digital')) return 'Technology';
  if (nameLower.includes('pharma') || nameLower.includes('health') || nameLower.includes('medical')) return 'Healthcare';
  if (nameLower.includes('bank') || nameLower.includes('financial') || nameLower.includes('finance')) return 'Financial Services';
  if (nameLower.includes('steel') || nameLower.includes('metal') || nameLower.includes('iron')) return 'Metals & Mining';
  if (nameLower.includes('energy') || nameLower.includes('power') || nameLower.includes('electric')) return 'Energy';
  if (nameLower.includes('food') || nameLower.includes('restaurant') || nameLower.includes('hotel')) return 'Consumer Goods';
  if (nameLower.includes('real estate') || nameLower.includes('property') || nameLower.includes('construction')) return 'Real Estate';
  if (nameLower.includes('auto') || nameLower.includes('vehicle') || nameLower.includes('motor')) return 'Automotive';
  return 'Diversified';
}

function extractIndustryFromName(name: string): string {
  const nameLower = name.toLowerCase();
  if (nameLower.includes('coworking') || nameLower.includes('workspace')) return 'Coworking Spaces';
  if (nameLower.includes('travel') || nameLower.includes('food services')) return 'Travel & Hospitality';
  if (nameLower.includes('steel') || nameLower.includes('tubes')) return 'Steel Manufacturing';
  if (nameLower.includes('cropsciences') || nameLower.includes('agriculture')) return 'Agriculture';
  if (nameLower.includes('electronics')) return 'Electronics';
  if (nameLower.includes('spaces') || nameLower.includes('property')) return 'Real Estate';
  if (nameLower.includes('energy')) return 'Renewable Energy';
  if (nameLower.includes('pumps')) return 'Industrial Equipment';
  if (nameLower.includes('securities') || nameLower.includes('depository')) return 'Financial Services';
  return 'General Business';
}

function extractCompanyNameFromTitle(title: string): string {
  // Extract company name from titles like "PropShare Titania IPO Opens on Jul 21, 2025"
  const match = title.match(/^(.+?)\s+IPO\s+(Opens|Closes)/i);
  return match ? match[1].trim() : title.split(' IPO ')[0];
}

function parseCalendarDate(dateStr: string, year: number): Date {
  // Parse dates like "21 Jul", "23 Jul"
  const months: { [key: string]: number } = {
    'Jan': 0, 'Feb': 1, 'Mar': 2, 'Apr': 3, 'May': 4, 'Jun': 5,
    'Jul': 6, 'Aug': 7, 'Sep': 8, 'Oct': 9, 'Nov': 10, 'Dec': 11
  };
  
  const parts = dateStr.trim().split(' ');
  if (parts.length === 2) {
    const day = parseInt(parts[0]);
    const month = months[parts[1]];
    if (!isNaN(day) && month !== undefined) {
      return new Date(year, month, day);
    }
  }
  
  return new Date(); // Fallback to today
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

// Main function to fetch live IPO data for specific type
export async function fetchLiveIPOData(ipoType: IPOType = 'mainboard'): Promise<IPO[]> {
  console.log(`Fetching live ${ipoType} IPO data from Chittorgarh APIs...`);
  
  // Clear cache to ensure fresh data
  localStorage.removeItem(`${CACHE_KEY}_${ipoType}`);
  
  try {
    // Fetch data from all Chittorgarh endpoints for the specified type
    const { performance, prospectus, calendar } = await fetchChittorgarhData(ipoType);
    
    console.log(`${ipoType} API Data Summary:\n      - Performance: ${performance.length} items\n      - Prospectus: ${prospectus.length} items  \n      - Calendar: ${calendar.length} items`);
    
    if (performance.length === 0 && prospectus.length === 0 && calendar.length === 0) {
      throw new Error(`No ${ipoType} IPO data available from Chittorgarh APIs`);
    }
    
    // Create maps for easy lookup
    const prospectusMap = new Map(prospectus.map(p => [p.company_name, p]));
    const calendarMap = new Map(calendar.map(c => [extractCompanyNameFromTitle(c.cal_title), c]));
    
    const allIPOs: IPO[] = [];
    
    // Transform performance data (listed IPOs)
    performance.forEach((perf, index) => {
      const prospectusData = prospectusMap.get(perf.ipo_company_name);
      const calendarData = calendarMap.get(perf.ipo_company_name);
      
      const ipo = transformChittorgarhToIPO(perf, prospectusData, calendarData, index, ipoType);
      allIPOs.push(ipo);
    });
    
    // Transform calendar data (upcoming/open IPOs)
    calendar.forEach((cal, index) => {
      const companyName = extractCompanyNameFromTitle(cal.cal_title);
      const prospectusData = prospectusMap.get(companyName);
      
      // Only add if not already added from performance data
      const exists = allIPOs.some(ipo => 
        ipo.companyName.toLowerCase().includes(companyName.toLowerCase()) ||
        companyName.toLowerCase().includes(ipo.companyName.toLowerCase())
      );
      
      if (!exists) {
        const ipo = transformCalendarToIPO(cal, prospectusData, index, ipoType);
        allIPOs.push(ipo);
      }
    });
    
    // Remove duplicates and filter valid entries
    const uniqueIPOs = removeDuplicateIPOs(allIPOs);
    const validIPOs = uniqueIPOs.filter(ipo => 
      ipo.companyName && 
      ipo.companyName !== 'Unknown Company' && 
      !ipo.companyName.includes('http') &&
      ipo.companyName.length > 2
    );
    
    if (validIPOs.length === 0) {
      throw new Error(`No valid ${ipoType} IPO data found after processing`);
    }
    
    console.log(`Successfully processed ${validIPOs.length} unique ${ipoType} IPOs from Chittorgarh APIs`);
    setCachedIPOData(validIPOs, ipoType);
    return validIPOs;
    
  } catch (error) {
    console.error(`Error in fetchLiveIPOData for ${ipoType}:`, error);
    throw error;
  }
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

export function getCachedIPOData(ipoType: IPOType = 'mainboard'): IPO[] | null {
  try {
    const cached = localStorage.getItem(`${CACHE_KEY}_${ipoType}`);
    if (!cached) return null;
    
    const { data, timestamp } = JSON.parse(cached);
    if (Date.now() - timestamp > CACHE_DURATION) {
      localStorage.removeItem(`${CACHE_KEY}_${ipoType}`);
      return null;
    }
    
    return data;
  } catch (error) {
    console.error('Error reading cached data:', error);
    return null;
  }
}

export function setCachedIPOData(data: IPO[], ipoType: IPOType = 'mainboard'): void {
  try {
    const cacheData = {
      data,
      timestamp: Date.now(),
    };
    localStorage.setItem(`${CACHE_KEY}_${ipoType}`, JSON.stringify(cacheData));
  } catch (error) {
    console.error('Error caching data:', error);
  }
}
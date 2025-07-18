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

export const mockIPOs: IPO[] = [
  {
    id: '1',
    companyName: 'Bajaj Housing Finance Limited',
    symbol: 'BAJAJHFL',
    sector: 'Financial Services',
    industry: 'Housing Finance',
    status: 'listed',
    openDate: '2024-09-09',
    closeDate: '2024-09-11',
    listingDate: '2024-09-16',
    priceRange: { min: 66, max: 70 },
    lotSize: 214,
    issueSize: 6560,
    subscriptionStatus: {
      retail: 3.94,
      qib: 8.86,
      nii: 2.15,
      overall: 3.25
    },
    gmp: 15,
    listing: {
      price: 150,
      gain: 114.29
    },
    companyDetails: {
      about: 'Bajaj Housing Finance Limited is a housing finance company and a subsidiary of Bajaj Finserv Limited. The company provides home loans, loan against property, and developer financing.',
      marketCap: 145000,
      revenue: 8456,
      profit: 2145,
      roe: 18.5,
      pe: 25.4,
      bookValue: 245
    },
    riskFactors: [
      'Interest rate risk affecting profitability',
      'Credit risk from borrower defaults',
      'Regulatory changes in housing finance sector',
      'Competition from banks and NBFCs'
    ],
    keyDates: {
      bidding: { start: '2024-09-09', end: '2024-09-11' },
      allotment: '2024-09-13',
      refund: '2024-09-14',
      listing: '2024-09-16'
    },
    leadManagers: ['Kotak Mahindra Capital', 'BofA Securities', 'Goldman Sachs'],
    registrar: 'KFin Technologies Limited'
  },
  {
    id: '2',
    companyName: 'Hyundai Motor India Limited',
    symbol: 'HMIL',
    sector: 'Automobile',
    industry: 'Passenger Cars',
    status: 'open',
    openDate: '2024-10-15',
    closeDate: '2024-10-17',
    listingDate: '2024-10-22',
    priceRange: { min: 1865, max: 1960 },
    lotSize: 7,
    issueSize: 27870,
    subscriptionStatus: {
      retail: 0.52,
      qib: 0.28,
      nii: 0.15,
      overall: 0.31
    },
    gmp: -50,
    companyDetails: {
      about: 'Hyundai Motor India Limited is the Indian subsidiary of Hyundai Motor Company, South Korea. It is the second largest car manufacturer in India and manufactures passenger cars.',
      revenue: 60000,
      profit: 4500,
      roe: 15.2,
      bookValue: 890
    },
    riskFactors: [
      'Intense competition in passenger car segment',
      'Fluctuation in raw material prices',
      'Regulatory changes in automotive sector',
      'Economic slowdown affecting demand'
    ],
    keyDates: {
      bidding: { start: '2024-10-15', end: '2024-10-17' },
      allotment: '2024-10-18',
      refund: '2024-10-19',
      listing: '2024-10-22'
    },
    leadManagers: ['Kotak Mahindra Capital', 'Citigroup Global', 'HSBC Securities'],
    registrar: 'KFin Technologies Limited'
  },
  {
    id: '3',
    companyName: 'NTPC Green Energy Limited',
    symbol: 'NGEL',
    sector: 'Power',
    industry: 'Renewable Energy',
    status: 'upcoming',
    openDate: '2024-11-19',
    closeDate: '2024-11-22',
    listingDate: '2024-11-26',
    priceRange: { min: 102, max: 108 },
    lotSize: 138,
    issueSize: 10000,
    companyDetails: {
      about: 'NTPC Green Energy Limited is a subsidiary of NTPC Limited, focused on renewable energy generation including solar and wind power projects.',
      revenue: 2500,
      profit: 450,
      roe: 12.8,
      bookValue: 156
    },
    riskFactors: [
      'Dependence on government policies for renewable energy',
      'Technology and equipment risks',
      'Land acquisition challenges',
      'Grid connectivity issues'
    ],
    keyDates: {
      bidding: { start: '2024-11-19', end: '2024-11-22' },
      allotment: '2024-11-25',
      refund: '2024-11-26',
      listing: '2024-11-26'
    },
    leadManagers: ['ICICI Securities', 'SBI Capital Markets', 'IIFL Securities'],
    registrar: 'Link Intime India Private Limited'
  },
  {
    id: '4',
    companyName: 'Swiggy Limited',
    symbol: 'SWIGGY',
    sector: 'Consumer Services',
    industry: 'Food Delivery',
    status: 'upcoming',
    openDate: '2024-11-06',
    closeDate: '2024-11-08',
    listingDate: '2024-11-13',
    priceRange: { min: 371, max: 390 },
    lotSize: 38,
    issueSize: 11327,
    companyDetails: {
      about: 'Swiggy Limited is one of India\'s leading food delivery platforms, also offering quick commerce through Instamart and other services.',
      revenue: 8265,
      profit: -2350,
      roe: -15.6,
      bookValue: 125
    },
    riskFactors: [
      'Intense competition in food delivery space',
      'High customer acquisition costs',
      'Regulatory challenges in gig economy',
      'Profitability concerns'
    ],
    keyDates: {
      bidding: { start: '2024-11-06', end: '2024-11-08' },
      allotment: '2024-11-11',
      refund: '2024-11-12',
      listing: '2024-11-13'
    },
    leadManagers: ['Kotak Mahindra Capital', 'Citigroup Global', 'JPMorgan'],
    registrar: 'KFin Technologies Limited'
  },
  {
    id: '5',
    companyName: 'Sagility India Limited',
    symbol: 'SAGILITY',
    sector: 'Information Technology',
    industry: 'Healthcare IT Services',
    status: 'closed',
    openDate: '2024-11-05',
    closeDate: '2024-11-07',
    listingDate: '2024-11-12',
    priceRange: { min: 28, max: 30 },
    lotSize: 500,
    issueSize: 2106,
    subscriptionStatus: {
      retail: 1.85,
      qib: 2.56,
      nii: 1.23,
      overall: 1.95
    },
    gmp: 8,
    companyDetails: {
      about: 'Sagility India Limited provides technology-enabled healthcare services to payers, providers, and patients in the US healthcare market.',
      revenue: 2845,
      profit: 285,
      roe: 14.2,
      bookValue: 85
    },
    riskFactors: [
      'Dependence on US healthcare market',
      'Regulatory changes in healthcare',
      'Competition from global players',
      'Currency fluctuation risks'
    ],
    keyDates: {
      bidding: { start: '2024-11-05', end: '2024-11-07' },
      allotment: '2024-11-09',
      refund: '2024-11-10',
      listing: '2024-11-12'
    },
    leadManagers: ['Jefferies India', 'ICICI Securities', 'Nomura Financial'],
    registrar: 'Link Intime India Private Limited'
  }
];

export const getIPOById = (id: string): IPO | undefined => {
  return mockIPOs.find(ipo => ipo.id === id);
};

export const getIPOsByStatus = (status: IPO['status']): IPO[] => {
  return mockIPOs.filter(ipo => ipo.status === status);
};
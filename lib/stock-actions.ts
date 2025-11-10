'use server'

import { unstable_cache } from 'next/cache'

const POLYGON_API_KEY = process.env.POLYGON_API_KEY || 'uBHWmV9nY9dXSxbrZJ8iiuFrcHsEiHED'
const POLYGON_API_BASE = 'https://api.polygon.io/v2'

export interface StockData {
  symbol: string
  name: string
  price: number
  change: number
  changePercent: number
  volume: number
  open: number
  high: number
  low: number
  close: number
  marketCap?: number
}

// Map of popular stock symbols to company names
const STOCK_NAMES: Record<string, string> = {
  'AAPL': 'Apple Inc.',
  'MSFT': 'Microsoft Corp.',
  'GOOGL': 'Alphabet Inc.',
  'AMZN': 'Amazon.com Inc.',
  'NVDA': 'NVIDIA Corp.',
  'TSLA': 'Tesla Inc.',
  'META': 'Meta Platforms',
  'NFLX': 'Netflix Inc.',
  'AMD': 'Advanced Micro Devices',
  'INTC': 'Intel Corp.',
  'PYPL': 'PayPal Holdings',
  'ADBE': 'Adobe Inc.',
  'CRM': 'Salesforce Inc.',
  'ORCL': 'Oracle Corp.',
  'CSCO': 'Cisco Systems',
  'IBM': 'IBM Corp.',
  'DIS': 'Walt Disney Co.',
  'NKE': 'Nike Inc.',
  'BA': 'Boeing Co.',
  'JPM': 'JPMorgan Chase',
}

// Get the previous trading day in YYYY-MM-DD format
function getPreviousTradingDay(): string {
  const date = new Date()
  // Go back 1-3 days to ensure we get a trading day
  date.setDate(date.getDate() - 1)
  
  // If it's Sunday, go back 2 more days
  if (date.getDay() === 0) {
    date.setDate(date.getDate() - 2)
  }
  // If it's Saturday, go back 1 more day
  if (date.getDay() === 6) {
    date.setDate(date.getDate() - 1)
  }
  
  return date.toISOString().split('T')[0]
}

// Cached function to fetch stock data from Polygon
const getCachedStockData = unstable_cache(
  async (): Promise<StockData[]> => {
    try {
      const date = getPreviousTradingDay()
      const url = `${POLYGON_API_BASE}/aggs/grouped/locale/us/market/stocks/${date}?adjusted=true&apiKey=${POLYGON_API_KEY}`
      
      console.log('📊 Fetching stock data from Polygon.io:', url.replace(POLYGON_API_KEY, 'API_KEY'))
      
      const response = await fetch(url, {
        headers: {
          'Accept': 'application/json',
        },
        next: { revalidate: 300 } // Cache for 5 minutes
      })

      if (!response.ok) {
        console.error('Polygon API error:', response.status, response.statusText)
        throw new Error(`Polygon API error: ${response.status}`)
      }

      const data = await response.json()
      
      if (!data.results || !Array.isArray(data.results)) {
        console.error('Invalid Polygon API response:', data)
        throw new Error('Invalid API response')
      }

      console.log('✅ Fetched stock data successfully:', data.results.length, 'stocks')

      // Filter for popular stocks and transform data
      const popularStocks = data.results
        .filter((stock: any) => STOCK_NAMES[stock.T])
        .map((stock: any) => {
          const change = stock.c - stock.o
          const changePercent = (change / stock.o) * 100

          return {
            symbol: stock.T,
            name: STOCK_NAMES[stock.T],
            price: stock.c,
            change: change,
            changePercent: changePercent,
            volume: stock.v,
            open: stock.o,
            high: stock.h,
            low: stock.l,
            close: stock.c,
          }
        })
        .slice(0, 20) // Limit to 20 stocks

      return popularStocks
    } catch (error) {
      console.error('❌ Error fetching stock data:', error)
      // Return fallback data
      return getFallbackStockData()
    }
  },
  ['stock-market-data'],
  {
    revalidate: 300, // Cache for 5 minutes
  }
)

// Get all stocks
export async function getStocks(): Promise<StockData[]> {
  try {
    return await getCachedStockData()
  } catch (error) {
    console.error('Error in getStocks:', error)
    return getFallbackStockData()
  }
}

// Get stocks by symbols
export async function getStocksBySymbols(symbols: string[]): Promise<StockData[]> {
  try {
    const allStocks = await getCachedStockData()
    return allStocks.filter(stock => symbols.includes(stock.symbol))
  } catch (error) {
    console.error('Error in getStocksBySymbols:', error)
    return getFallbackStockData().filter(stock => symbols.includes(stock.symbol))
  }
}

// Fallback stock data
function getFallbackStockData(): StockData[] {
  return [
    { symbol: 'AAPL', name: 'Apple Inc.', price: 178.25, change: 4.15, changePercent: 2.38, volume: 52000000, open: 174.10, high: 179.50, low: 173.80, close: 178.25, marketCap: 2800000000000 },
    { symbol: 'MSFT', name: 'Microsoft Corp.', price: 412.80, change: 7.65, changePercent: 1.89, volume: 28000000, open: 405.15, high: 414.20, low: 404.50, close: 412.80, marketCap: 3100000000000 },
    { symbol: 'GOOGL', name: 'Alphabet Inc.', price: 142.65, change: -1.24, changePercent: -0.86, volume: 31000000, open: 143.89, high: 144.50, low: 141.80, close: 142.65, marketCap: 1800000000000 },
    { symbol: 'AMZN', name: 'Amazon.com Inc.', price: 178.35, change: 5.40, changePercent: 3.12, volume: 45000000, open: 172.95, high: 179.20, low: 172.30, close: 178.35, marketCap: 1850000000000 },
    { symbol: 'NVDA', name: 'NVIDIA Corp.', price: 875.28, change: 47.04, changePercent: 5.67, volume: 38000000, open: 828.24, high: 880.50, low: 825.00, close: 875.28, marketCap: 2150000000000 },
    { symbol: 'TSLA', name: 'Tesla Inc.', price: 242.84, change: -6.10, changePercent: -2.45, volume: 95000000, open: 248.94, high: 250.50, low: 240.20, close: 242.84, marketCap: 770000000000 },
    { symbol: 'META', name: 'Meta Platforms', price: 512.42, change: 6.23, changePercent: 1.23, volume: 18000000, open: 506.19, high: 515.80, low: 505.00, close: 512.42, marketCap: 1300000000000 },
    { symbol: 'NFLX', name: 'Netflix Inc.', price: 485.73, change: 4.72, changePercent: 0.98, volume: 4200000, open: 481.01, high: 488.50, low: 480.00, close: 485.73, marketCap: 210000000000 },
    { symbol: 'AMD', name: 'Advanced Micro Devices', price: 165.89, change: 6.73, changePercent: 4.23, volume: 52000000, open: 159.16, high: 167.20, low: 158.50, close: 165.89, marketCap: 268000000000 },
    { symbol: 'INTC', name: 'Intel Corp.', price: 45.67, change: -0.62, changePercent: -1.34, volume: 38000000, open: 46.29, high: 46.80, low: 45.20, close: 45.67, marketCap: 189000000000 },
    { symbol: 'PYPL', name: 'PayPal Holdings', price: 68.92, change: 0.38, changePercent: 0.56, volume: 12000000, open: 68.54, high: 69.50, low: 68.20, close: 68.92, marketCap: 72000000000 },
    { symbol: 'ADBE', name: 'Adobe Inc.', price: 562.18, change: 11.08, changePercent: 2.01, volume: 2800000, open: 551.10, high: 565.00, low: 550.00, close: 562.18, marketCap: 256000000000 },
    { symbol: 'CRM', name: 'Salesforce Inc.', price: 285.47, change: -1.92, changePercent: -0.67, volume: 5600000, open: 287.39, high: 289.50, low: 284.00, close: 285.47, marketCap: 278000000000 },
    { symbol: 'ORCL', name: 'Oracle Corp.', price: 128.93, change: 1.84, changePercent: 1.45, volume: 8900000, open: 127.09, high: 130.20, low: 126.80, close: 128.93, marketCap: 354000000000 },
    { symbol: 'CSCO', name: 'Cisco Systems', price: 56.84, change: 0.44, changePercent: 0.78, volume: 18000000, open: 56.40, high: 57.20, low: 56.10, close: 56.84, marketCap: 232000000000 },
    { symbol: 'IBM', name: 'IBM Corp.', price: 185.32, change: -0.43, changePercent: -0.23, volume: 4100000, open: 185.75, high: 187.00, low: 184.50, close: 185.32, marketCap: 170000000000 },
    { symbol: 'DIS', name: 'Walt Disney Co.', price: 95.67, change: 1.77, changePercent: 1.89, volume: 11000000, open: 93.90, high: 96.50, low: 93.50, close: 95.67, marketCap: 174000000000 },
    { symbol: 'NKE', name: 'Nike Inc.', price: 108.42, change: -1.23, changePercent: -1.12, volume: 7200000, open: 109.65, high: 110.20, low: 107.80, close: 108.42, marketCap: 165000000000 },
    { symbol: 'BA', name: 'Boeing Co.', price: 187.56, change: 4.88, changePercent: 2.67, volume: 6800000, open: 182.68, high: 188.50, low: 181.90, close: 187.56, marketCap: 115000000000 },
    { symbol: 'JPM', name: 'JPMorgan Chase', price: 198.73, change: 1.75, changePercent: 0.89, volume: 9200000, open: 196.98, high: 200.20, low: 196.50, close: 198.73, marketCap: 575000000000 },
  ]
}

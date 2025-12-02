'use server'

import { unstable_cache } from 'next/cache'

const COINGECKO_API_BASE = 'https://api.coingecko.com/api/v3'

// Types for CoinGecko API responses
export interface CryptoData {
  id: string
  symbol: string
  name: string
  image: string
  current_price: number
  market_cap: number
  market_cap_rank: number
  fully_diluted_valuation: number | null
  total_volume: number
  high_24h: number
  low_24h: number
  price_change_24h: number
  price_change_percentage_24h: number
  market_cap_change_24h: number
  market_cap_change_percentage_24h: number
  circulating_supply: number
  total_supply: number | null
  max_supply: number | null
  ath: number
  ath_change_percentage: number
  ath_date: string
  atl: number
  atl_change_percentage: number
  atl_date: string
  last_updated: string
  localIcon?: string
}

export interface CryptoPrice {
  id: string
  symbol: string
  name: string
  current_price: number
  price_change_percentage_24h: number
  market_cap: number
  total_volume: number
  image: string
}

// Map CoinGecko IDs to our symbols
const CRYPTO_ID_MAP: Record<string, string> = {
  'BTC': 'bitcoin',
  'ETH': 'ethereum',
  'SOL': 'solana',
  'ADA': 'cardano',
  'DOGE': 'dogecoin',
  'SHIB': 'shiba-inu',
  'LTC': 'litecoin',
  'XRP': 'ripple',
  'DOT': 'polkadot',
  'MATIC': 'matic-network',
  'LINK': 'chainlink',
  'USDT': 'tether',
  'USDC': 'usd-coin',
  'AVAX': 'avalanche-2',
  'UNI': 'uniswap',
  'AAVE': 'aave',
  'ALGO': 'algorand'
}

// Get our local crypto icon path
function getLocalCryptoIcon(symbol: string): string {
  return `/assets/crypto/${symbol.toUpperCase()}.svg`
}

// Cached function to fetch crypto market data
const getCachedCryptoData = unstable_cache(
  async (ids: string[], vsCurrency: string = 'usd') => {
    try {
      const idsParam = ids.join(',')
      // Use the simple/price endpoint as specified
      const url = `https://api.coingecko.com/api/v3/simple/price?ids=${idsParam}&vs_currencies=${vsCurrency}&include_24hr_change=true&include_market_cap=true&include_24hr_vol=true`
      
      console.log('📊 Fetching crypto data from CoinGecko:', url)
      
      const response = await fetch(url, {
        headers: {
          'Accept': 'application/json',
        },
        next: { revalidate: 300 } // Cache for 5 minutes to avoid rate limits
      })

      if (!response.ok) {
        throw new Error(`CoinGecko API error: ${response.status}`)
      }

      const priceData = await response.json()
      console.log('✅ Fetched crypto prices:', Object.keys(priceData).length, 'cryptos')
      
      // Also fetch market data for additional info
      const marketUrl = `${COINGECKO_API_BASE}/coins/markets?vs_currency=${vsCurrency}&ids=${idsParam}&order=market_cap_desc&per_page=100&page=1&sparkline=false&price_change_percentage=24h`
      
      const marketResponse = await fetch(marketUrl, {
        headers: {
          'Accept': 'application/json',
        },
        next: { revalidate: 300 } // Cache for 5 minutes to avoid rate limits
      })

      if (!marketResponse.ok) {
        throw new Error(`CoinGecko API error: ${marketResponse.status}`)
      }

      const marketData: CryptoData[] = await marketResponse.json()
      
      // Transform data to include our local icons
      return marketData.map(crypto => ({
        ...crypto,
        localIcon: getLocalCryptoIcon(crypto.symbol)
      }))
    } catch (error) {
      console.error('❌ Error fetching crypto data:', error)
      throw error
    }
  },
  ['crypto-market-data'],
  {
    revalidate: 300, // Cache for 5 minutes to avoid rate limits
  }
)

// Get top cryptocurrencies by market cap
export async function getTopCryptos(limit: number = 10): Promise<CryptoData[]> {
  try {
    const topCryptoIds = Object.values(CRYPTO_ID_MAP).slice(0, limit)
    return await getCachedCryptoData(topCryptoIds)
  } catch (error) {
    console.error('Error in getTopCryptos:', error)
    // Return fallback data if API fails
    return getFallbackCryptoData().slice(0, limit)
  }
}

// Get specific crypto by symbol
export async function getCryptoBySymbol(symbol: string): Promise<CryptoData | null> {
  try {
    const cryptoId = CRYPTO_ID_MAP[symbol.toUpperCase()]
    if (!cryptoId) {
      throw new Error(`Crypto symbol ${symbol} not found`)
    }

    const data = await getCachedCryptoData([cryptoId])
    return data[0] || null
  } catch (error) {
    console.error('Error in getCryptoBySymbol:', error)
    return null
  }
}

// Get multiple cryptos by symbols
export async function getCryptosBySymbols(symbols: string[]): Promise<CryptoData[]> {
  try {
    const cryptoIds = symbols
      .map(symbol => CRYPTO_ID_MAP[symbol.toUpperCase()])
      .filter(Boolean)

    if (cryptoIds.length === 0) {
      return []
    }

    return await getCachedCryptoData(cryptoIds)
  } catch (error) {
    console.error('Error in getCryptosBySymbols:', error)
    return getFallbackCryptoData().filter(crypto => 
      symbols.includes(crypto.symbol.toUpperCase())
    )
  }
}

// Get gainers and losers
export async function getGainersAndLosers(): Promise<{
  gainers: CryptoData[]
  losers: CryptoData[]
}> {
  try {
    const allCryptos = await getTopCryptos(20)
    
    const sorted = [...allCryptos].sort((a, b) => 
      b.price_change_percentage_24h - a.price_change_percentage_24h
    )

    return {
      gainers: sorted.slice(0, 4),
      losers: sorted.slice(-4).reverse()
    }
  } catch (error) {
    console.error('Error in getGainersAndLosers:', error)
    const fallback = getFallbackCryptoData()
    return {
      gainers: fallback.slice(0, 4),
      losers: fallback.slice(-4)
    }
  }
}

// Fallback data when API is unavailable
function getFallbackCryptoData(): CryptoData[] {
  return [
    {
      id: 'bitcoin',
      symbol: 'btc',
      name: 'Bitcoin',
      image: 'https://assets.coingecko.com/coins/images/1/large/bitcoin.png',
      current_price: 67420.50,
      market_cap: 1320000000000,
      market_cap_rank: 1,
      fully_diluted_valuation: null,
      total_volume: 28500000000,
      high_24h: 68500,
      low_24h: 66200,
      price_change_24h: 2840.50,
      price_change_percentage_24h: 4.4,
      market_cap_change_24h: 55000000000,
      market_cap_change_percentage_24h: 4.35,
      circulating_supply: 19500000,
      total_supply: 21000000,
      max_supply: 21000000,
      ath: 69000,
      ath_change_percentage: -2.3,
      ath_date: '2021-11-10T14:24:11.849Z',
      atl: 67.81,
      atl_change_percentage: 99300.5,
      atl_date: '2013-07-06T00:00:00.000Z',
      last_updated: new Date().toISOString(),
      localIcon: '/assets/crypto/BTC.svg'
    },
    {
      id: 'ethereum',
      symbol: 'eth',
      name: 'Ethereum',
      image: 'https://assets.coingecko.com/coins/images/279/large/ethereum.png',
      current_price: 3840.25,
      market_cap: 462000000000,
      market_cap_rank: 2,
      fully_diluted_valuation: null,
      total_volume: 15200000000,
      high_24h: 3920,
      low_24h: 3780,
      price_change_24h: 244.50,
      price_change_percentage_24h: 6.8,
      market_cap_change_24h: 29000000000,
      market_cap_change_percentage_24h: 6.7,
      circulating_supply: 120000000,
      total_supply: null,
      max_supply: null,
      ath: 4878.26,
      ath_change_percentage: -21.3,
      ath_date: '2021-11-10T14:24:19.604Z',
      atl: 0.432979,
      atl_change_percentage: 886900.2,
      atl_date: '2015-10-20T00:00:00.000Z',
      last_updated: new Date().toISOString(),
      localIcon: '/assets/crypto/ETH.svg'
    }
    // Add more fallback data as needed
  ] as CryptoData[]
}

// Server action for real-time price updates
export async function refreshCryptoPrices(symbols: string[]): Promise<CryptoData[]> {
  'use server'
  
  try {
    return await getCryptosBySymbols(symbols)
  } catch (error) {
    console.error('Error refreshing crypto prices:', error)
    throw new Error('Failed to refresh crypto prices')
  }
} 
export interface CryptoPrice {
  id: string
  symbol: string
  name: string
  current_price: number
  price_change_percentage_24h: number
  market_cap_rank: number
  image: string
}

export interface CoinGeckoResponse {
  [key: string]: {
    usd: number
    usd_24h_change?: number
  }
}

const COINGECKO_API_BASE = 'https://api.coingecko.com/api/v3'

// Map of crypto symbols to CoinGecko IDs
const CRYPTO_ID_MAP: { [key: string]: string } = {
  BTC: 'bitcoin',
  ETH: 'ethereum',
  ADA: 'cardano',
  DOT: 'polkadot',
  SOL: 'solana',
  MATIC: 'matic-network',
  LINK: 'chainlink',
  UNI: 'uniswap',
  AAVE: 'aave',
  AVAX: 'avalanche-2',
  ALGO: 'algorand',
  USDT: 'tether',
  USDC: 'usd-coin',
  BNB: 'binancecoin',
  XRP: 'ripple',
  DOGE: 'dogecoin',
  SHIB: 'shiba-inu',
  LTC: 'litecoin',
  BCH: 'bitcoin-cash',
  TRX: 'tron',
  XLM: 'stellar',
  VET: 'vechain',
  XTZ: 'tezos',
  MANA: 'decentraland',
  CRO: 'crypto-com-chain',
  XMR: 'monero',
  ETC: 'ethereum-classic',
  DASH: 'dash',
  ZEC: 'zcash',
  NEO: 'neo',
  IOTA: 'iota'
}

export async function fetchCryptoPrices(symbols: string[]): Promise<CryptoPrice[]> {
  try {
    // Convert symbols to CoinGecko IDs
    const coinIds = symbols
      .map(symbol => CRYPTO_ID_MAP[symbol.toUpperCase()])
      .filter(Boolean)
    
    if (coinIds.length === 0) {
      throw new Error('No valid crypto symbols provided')
    }

    const idsParam = coinIds.join(',')
    const response = await fetch(
      `${COINGECKO_API_BASE}/simple/price?ids=${idsParam}&vs_currencies=usd&include_24hr_change=true&include_market_cap=true`,
      {
        headers: {
          'Accept': 'application/json',
        },
        next: { revalidate: 300 } // Cache for 5 minutes to avoid rate limits
      }
    )

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data: CoinGeckoResponse = await response.json()
    
    // Transform the data to match our interface
    const cryptoPrices: CryptoPrice[] = Object.entries(data).map(([coinId, priceData]) => {
      const symbol = Object.keys(CRYPTO_ID_MAP).find(
        key => CRYPTO_ID_MAP[key] === coinId
      ) || coinId.toUpperCase()
      
      return {
        id: coinId,
        symbol: symbol.toUpperCase(),
        name: coinId.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
        current_price: priceData.usd,
        price_change_percentage_24h: priceData.usd_24h_change || 0,
        market_cap_rank: 1, // We'll set a default rank
        image: `/assets/crypto/${symbol.toUpperCase()}.svg`
      }
    })

    return cryptoPrices
  } catch (error) {
    console.error('Error fetching crypto prices:', error)
    // Return fallback data
    return getFallbackPrices(symbols)
  }
}

export function getFallbackPrices(symbols: string[]): CryptoPrice[] {
  const fallbackData: { [key: string]: { price: number, change: number } } = {
    BTC: { price: 67420.50, change: 3.21 },
    ETH: { price: 3245.80, change: -1.54 },
    ADA: { price: 0.485, change: 4.82 },
    SOL: { price: 98.20, change: -0.95 },
    DOT: { price: 6.85, change: 1.67 },
    MATIC: { price: 0.852, change: 2.45 },
    LINK: { price: 14.32, change: -0.78 },
    UNI: { price: 8.95, change: 3.12 },
    AAVE: { price: 142.50, change: -2.31 },
    AVAX: { price: 35.80, change: 1.89 }
  }

  return symbols.map((symbol, index) => {
    const upperSymbol = symbol.toUpperCase()
    const fallback = fallbackData[upperSymbol] || { price: 100, change: 0 }
    
    return {
      id: symbol.toLowerCase(),
      symbol: upperSymbol,
      name: upperSymbol,
      current_price: fallback.price,
      price_change_percentage_24h: fallback.change,
      market_cap_rank: index + 1,
      image: `/assets/crypto/${upperSymbol}.svg`
    }
  })
}

export async function fetchTopCryptos(limit: number = 10): Promise<CryptoPrice[]> {
  const topSymbols = ['BTC', 'ETH', 'BNB', 'SOL', 'ADA', 'AVAX', 'DOT', 'MATIC', 'LINK', 'UNI']
  return fetchCryptoPrices(topSymbols.slice(0, limit))
} 
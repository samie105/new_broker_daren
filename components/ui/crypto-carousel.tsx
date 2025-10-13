"use client"

import React from 'react'
import Image from 'next/image'

const cryptoTokens = [
  'BTC', 'ETH', 'USDT', 'USDC', 'SOL', 'ADA', 'AVAX', 'DOT', 'MATIC', 'LINK',
  'UNI', 'DOGE', 'SHIB', 'LTC', 'TRX', 'DAI', 'AAVE', 'SUSHI', 'CRO', 'VET',
  'ALGO', 'XLM', 'MANA', 'AXS', 'APE', 'GMT', 'OP', 'GRT', 'BCH', 'ETC'
]

export function CryptoCarousel() {
  return (
    <div className="relative w-full overflow-hidden py-8">
      {/* Left gradient fade */}
      <div className="absolute left-0 top-0 bottom-0 w-24 lg:w-32 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
      
      {/* Right gradient fade */}
      <div className="absolute right-0 top-0 bottom-0 w-24 lg:w-32 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />
      
      {/* Carousel content */}
      <div className="flex animate-infinite-scroll hover:pause">
        {/* First set of tokens */}
        {cryptoTokens.map((token, index) => (
          <div
            key={`${token}-1-${index}`}
            className="flex-shrink-0 mx-4 lg:mx-6 grayscale hover:grayscale-0 transition-all duration-300 opacity-60 hover:opacity-100 hover:scale-110"
          >
            <Image
              src={`/assets/crypto/${token}.svg`}
              alt={token}
              width={48}
              height={48}
              className="w-10 h-10 lg:w-12 lg:h-12"
            />
          </div>
        ))}
        {/* Duplicate set for seamless loop */}
        {cryptoTokens.map((token, index) => (
          <div
            key={`${token}-2-${index}`}
            className="flex-shrink-0 mx-4 lg:mx-6 grayscale hover:grayscale-0 transition-all duration-300 opacity-60 hover:opacity-100 hover:scale-110"
          >
            <Image
              src={`/assets/crypto/${token}.svg`}
              alt={token}
              width={48}
              height={48}
              className="w-10 h-10 lg:w-12 lg:h-12"
            />
          </div>
        ))}
      </div>
    </div>
  )
}

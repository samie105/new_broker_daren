"use client"

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ChevronDown, ChevronUp } from 'lucide-react'

const faqs = [
  {
    category: 'Account & Verification',
    questions: [
      {
        q: 'How do I verify my account?',
        a: 'Go to the Verification page in your dashboard and upload the required documents (ID, proof of address). Verification typically takes 1-2 business days.'
      },
      {
        q: 'Can I change my email address?',
        a: 'Yes, you can change your email address in Settings > Profile Settings. You will need to verify the new email address.'
      },
      {
        q: 'How do I enable two-factor authentication?',
        a: 'Navigate to Settings > Security Settings and enable 2FA. Scan the QR code with your authenticator app and enter the verification code.'
      }
    ]
  },
  {
    category: 'Deposits & Withdrawals',
    questions: [
      {
        q: 'How long do deposits take?',
        a: 'Cryptocurrency deposits are credited after network confirmations (typically 10-30 minutes). Bank transfers may take 1-3 business days.'
      },
      {
        q: 'What are the withdrawal limits?',
        a: 'Verified accounts can withdraw up to $100,000 per day. Limits can be increased by contacting support.'
      },
      {
        q: 'Are there any deposit fees?',
        a: 'We do not charge deposit fees, but your payment provider or blockchain network may charge network fees.'
      }
    ]
  },
  {
    category: 'Trading',
    questions: [
      {
        q: 'What cryptocurrencies can I trade?',
        a: 'We support trading for Bitcoin, Ethereum, Solana, Cardano, Polkadot, and many other major cryptocurrencies.'
      },
      {
        q: 'What are the trading fees?',
        a: 'Trading fees start at 0.1% per transaction and decrease with higher trading volumes. View our fee schedule in Settings.'
      },
      {
        q: 'Can I set stop-loss orders?',
        a: 'Yes, you can set stop-loss and take-profit orders in the trading interface to manage your risk automatically.'
      }
    ]
  },
  {
    category: 'Staking',
    questions: [
      {
        q: 'What is staking?',
        a: 'Staking allows you to earn rewards by holding and locking your cryptocurrencies for a specified period. Rewards are distributed based on the APY rate.'
      },
      {
        q: 'Can I unstake early?',
        a: 'Yes, but unstaking before the lock period ends may result in reduced or no rewards, depending on the specific staking pool terms.'
      },
      {
        q: 'How often are staking rewards distributed?',
        a: 'Staking rewards are typically distributed daily or weekly, depending on the specific cryptocurrency and staking pool.'
      }
    ]
  },
  {
    category: 'Security',
    questions: [
      {
        q: 'How secure is my account?',
        a: 'We use industry-standard security measures including encryption, 2FA, and cold storage for the majority of funds. Your assets are protected with multiple security layers.'
      },
      {
        q: 'What should I do if I suspect unauthorized access?',
        a: 'Immediately change your password, enable 2FA if not already active, and contact support via live chat or WhatsApp for urgent assistance.'
      },
      {
        q: 'Do you store my private keys?',
        a: 'We use secure custodial wallets for your convenience. Your funds are protected with institutional-grade security measures.'
      }
    ]
  }
]

export function HelpFAQ() {
  const [openCategory, setOpenCategory] = useState<number | null>(0)
  const [openQuestion, setOpenQuestion] = useState<string | null>(null)

  const toggleCategory = (index: number) => {
    setOpenCategory(openCategory === index ? null : index)
  }

  const toggleQuestion = (key: string) => {
    setOpenQuestion(openQuestion === key ? null : key)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Frequently Asked Questions</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {faqs.map((category, categoryIndex) => (
          <div key={categoryIndex} className="border rounded-lg">
            <button
              onClick={() => toggleCategory(categoryIndex)}
              className="w-full p-4 flex items-center justify-between hover:bg-muted/50 transition-colors"
            >
              <h3 className="font-semibold text-left">{category.category}</h3>
              {openCategory === categoryIndex ? (
                <ChevronUp className="w-5 h-5" />
              ) : (
                <ChevronDown className="w-5 h-5" />
              )}
            </button>

            {openCategory === categoryIndex && (
              <div className="px-4 pb-4 space-y-3">
                {category.questions.map((faq, qIndex) => {
                  const questionKey = `${categoryIndex}-${qIndex}`
                  return (
                    <div key={qIndex} className="border-t pt-3">
                      <button
                        onClick={() => toggleQuestion(questionKey)}
                        className="w-full text-left flex items-start justify-between gap-2 group"
                      >
                        <p className="text-sm font-medium group-hover:text-primary transition-colors">
                          {faq.q}
                        </p>
                        {openQuestion === questionKey ? (
                          <ChevronUp className="w-4 h-4 flex-shrink-0 mt-0.5" />
                        ) : (
                          <ChevronDown className="w-4 h-4 flex-shrink-0 mt-0.5" />
                        )}
                      </button>
                      {openQuestion === questionKey && (
                        <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
                          {faq.a}
                        </p>
                      )}
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

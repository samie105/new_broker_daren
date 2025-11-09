"use client"

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ChevronDown, ChevronUp } from 'lucide-react'

type FAQ = {
  id: string
  question: string
  answer: string
  category: string
  order_index: number
}

type HelpFAQProps = {
  faqs: FAQ[]
}

// Map database categories to display names
const categoryDisplayNames: Record<string, string> = {
  account: 'Account & Verification',
  trading: 'Trading',
  deposits: 'Deposits',
  withdrawals: 'Withdrawals',
  verification: 'Verification',
  general: 'General',
}

export function HelpFAQ({ faqs }: HelpFAQProps) {
  const [openCategory, setOpenCategory] = useState<string | null>(null)
  const [openQuestion, setOpenQuestion] = useState<string | null>(null)

  // Group FAQs by category
  const groupedFaqs = faqs.reduce((acc, faq) => {
    if (!acc[faq.category]) {
      acc[faq.category] = []
    }
    acc[faq.category].push(faq)
    return acc
  }, {} as Record<string, FAQ[]>)

  // Sort FAQs within each category by order_index
  Object.keys(groupedFaqs).forEach((category) => {
    groupedFaqs[category].sort((a, b) => a.order_index - b.order_index)
  })

  const toggleCategory = (category: string) => {
    setOpenCategory(openCategory === category ? null : category)
  }

  const toggleQuestion = (questionId: string) => {
    setOpenQuestion(openQuestion === questionId ? null : questionId)
  }

  if (faqs.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Frequently Asked Questions</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground py-8">
            No FAQs available at the moment.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Frequently Asked Questions</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {Object.entries(groupedFaqs).map(([category, categoryFaqs]) => (
          <div key={category} className="border rounded-lg">
            <button
              onClick={() => toggleCategory(category)}
              className="w-full p-4 flex items-center justify-between hover:bg-muted/50 transition-colors"
            >
              <h3 className="font-semibold text-left">
                {categoryDisplayNames[category] || category}
              </h3>
              {openCategory === category ? (
                <ChevronUp className="w-5 h-5" />
              ) : (
                <ChevronDown className="w-5 h-5" />
              )}
            </button>

            {openCategory === category && (
              <div className="px-4 pb-4 space-y-3">
                {categoryFaqs.map((faq) => (
                  <div key={faq.id} className="border-t pt-3">
                    <button
                      onClick={() => toggleQuestion(faq.id)}
                      className="w-full text-left flex items-start justify-between gap-2 group"
                    >
                      <p className="text-sm font-medium group-hover:text-primary transition-colors">
                        {faq.question}
                      </p>
                      {openQuestion === faq.id ? (
                        <ChevronUp className="w-4 h-4 flex-shrink-0 mt-0.5" />
                      ) : (
                        <ChevronDown className="w-4 h-4 flex-shrink-0 mt-0.5" />
                      )}
                    </button>
                    {openQuestion === faq.id && (
                      <p className="text-sm text-muted-foreground mt-2 leading-relaxed whitespace-pre-wrap">
                        {faq.answer}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

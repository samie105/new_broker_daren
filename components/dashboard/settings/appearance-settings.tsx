"use client"

import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Monitor, Moon, Sun, Globe, ChevronDown, ChevronUp } from 'lucide-react'
import { useTheme } from 'next-themes'

export function AppearanceSettings() {
  const { theme, setTheme } = useTheme()
  const [language, setLanguage] = useState('en')
  
  const [isThemeOpen, setIsThemeOpen] = useState(true)
  const [isLanguageOpen, setIsLanguageOpen] = useState(true)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Appearance</CardTitle>
        <CardDescription>Customize how the platform looks and feels</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Theme Selection */}
        <div className="space-y-4">
          <button
            onClick={() => setIsThemeOpen(!isThemeOpen)}
            className="flex items-center justify-between w-full text-left"
          >
            <Label>Theme</Label>
            {isThemeOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </button>
          
          {isThemeOpen && (
          <div className="grid grid-cols-3 gap-3">
            <button
              onClick={() => setTheme('light')}
              className={`flex flex-col items-center gap-2 p-4 border rounded-lg transition-colors ${
                theme === 'light' ? 'border-primary bg-primary/5' : 'border-border'
              }`}
            >
              <Sun className="h-5 w-5" />
              <span className="text-sm font-medium">Light</span>
            </button>
            <button
              onClick={() => setTheme('dark')}
              className={`flex flex-col items-center gap-2 p-4 border rounded-lg transition-colors ${
                theme === 'dark' ? 'border-primary bg-primary/5' : 'border-border'
              }`}
            >
              <Moon className="h-5 w-5" />
              <span className="text-sm font-medium">Dark</span>
            </button>
            <button
              onClick={() => setTheme('system')}
              className={`flex flex-col items-center gap-2 p-4 border rounded-lg transition-colors ${
                theme === 'system' ? 'border-primary bg-primary/5' : 'border-border'
              }`}
            >
              <Monitor className="h-5 w-5" />
              <span className="text-sm font-medium">System</span>
            </button>
          </div>
          )}
        </div>

        <div className="border-t pt-6" />

        {/* Language Selection */}
        <div className="space-y-4">
          <button
            onClick={() => setIsLanguageOpen(!isLanguageOpen)}
            className="flex items-center justify-between w-full text-left"
          >
            <Label htmlFor="language">Language</Label>
            {isLanguageOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </button>
          
          {isLanguageOpen && (
          <Select value={language} onValueChange={setLanguage}>
            <SelectTrigger id="language" className="w-full">
              <div className="flex items-center gap-2">
                <Globe className="h-4 w-4" />
                <SelectValue />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="en">English</SelectItem>
              <SelectItem value="es">Español</SelectItem>
              <SelectItem value="fr">Français</SelectItem>
              <SelectItem value="de">Deutsch</SelectItem>
              <SelectItem value="zh">中文</SelectItem>
              <SelectItem value="ja">日本語</SelectItem>
              <SelectItem value="ko">한국어</SelectItem>
            </SelectContent>
          </Select>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

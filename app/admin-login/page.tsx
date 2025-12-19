"use client"

import React, { useState } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ArrowLeft, Mail, Lock, AlertCircle, Eye, EyeOff, Shield } from 'lucide-react'
import { adminLoginAction } from '@/server/actions/admin-auth'
import { toast } from 'sonner'

export default function AdminLoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const result = await adminLoginAction({ email, password })
      
      if (!result) {
        toast.error('No response from server. Please try again.')
        setError('No response from server')
        setLoading(false)
        return
      }

      if (result.success) {
        toast.success('Welcome Admin!')
        // Hard redirect to ensure cookie is sent with request - fixes production auth issues
        window.location.href = '/admin'
      } else {
        toast.error('Login failed', {
          description: result.error || 'Invalid admin credentials',
        })
        setError(result.error || 'Invalid admin credentials')
        setLoading(false)
      }
    } catch (err) {
      console.error('Admin login error:', err)
      toast.error('An error occurred', {
        description: 'Please try again later.',
      })
      setError('An unexpected error occurred')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4">
      <div className="w-full max-w-md">
        {/* Back to Home Button */}
        <Link href="/" className="inline-flex items-center text-sm text-slate-400 hover:text-white mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Link>

        <Card className="shadow-2xl border-slate-700 bg-slate-800/50 backdrop-blur">
          <CardHeader className="space-y-1">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                <Shield className="w-8 h-8 text-primary" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold text-center text-white">Admin Portal</CardTitle>
            <CardDescription className="text-center text-slate-400">
              Administrator access only
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="flex items-center gap-2 p-3 text-sm text-red-400 bg-red-950/30 border border-red-900 rounded-lg">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="admin-email" className="text-slate-200">Admin Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                  <Input
                    id="admin-email"
                    type="email"
                    placeholder="admin@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 bg-slate-900/50 border-slate-700 text-white placeholder:text-slate-500"
                    required
                    autoComplete="username"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="admin-password" className="text-slate-200">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                  <Input
                    id="admin-password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10 bg-slate-900/50 border-slate-700 text-white placeholder:text-slate-500"
                    required
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-200 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Verifying...' : 'Access Admin Panel'}
              </Button>

              <div className="pt-4 border-t border-slate-700">
                <p className="text-xs text-center text-slate-400">
                  Regular user?{' '}
                  <Link href="/auth/login" className="text-primary hover:underline font-medium">
                    Login here
                  </Link>
                </p>
              </div>

              <div className="text-xs text-center text-slate-500 space-y-1">
                <p>⚠️ Unauthorized access attempts are logged</p>
                <p>For support, contact: support@example.com</p>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

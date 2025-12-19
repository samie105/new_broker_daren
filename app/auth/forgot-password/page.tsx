"use client"

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ArrowLeft, Mail, AlertCircle, CheckCircle } from 'lucide-react'
import { forgotPasswordAction } from '@/server/actions/auth'
import { toast } from 'sonner'

export default function ForgotPasswordPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [otpSent, setOtpSent] = useState(false)

  // Prefetch the verify-otp page for faster navigation
  useEffect(() => {
    router.prefetch('/auth/verify-otp')
  }, [router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const result = await forgotPasswordAction(email)
      
      if (result.success && result.data?.emailSent) {
        toast.success('Reset code sent!', {
          description: 'Check your email for the verification code.',
        })
        setOtpSent(true)
      } else if (result.success && !result.data?.emailSent) {
        toast.info('Check your email', {
          description: 'If an account exists with this email, a code will be sent.',
        })
        // Still proceed to OTP page - user might have entered wrong email
        setOtpSent(true)
      } else {
        toast.error('Failed to send reset code', {
          description: result.error || 'Please try again.',
        })
        setError(result.error || 'Failed to send reset code')
      }
    } catch (err) {
      toast.error('Something went wrong', {
        description: 'An unexpected error occurred. Please try again.',
      })
      setError('An error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleResend = async () => {
    setLoading(true)
    setError('')
    
    try {
      const result = await forgotPasswordAction(email)
      
      if (result.success && result.data?.emailSent) {
        toast.success('Code resent!', {
          description: 'A new verification code has been sent to your email.',
        })
      } else if (result.success && !result.data?.emailSent) {
        toast.info('Check your email', {
          description: 'If an account exists with this email, a code will be sent.',
        })
      } else {
        toast.error('Failed to resend code', {
          description: result.error || 'Please try again.',
        })
      }
    } catch (err) {
      toast.error('Failed to resend code', {
        description: 'An unexpected error occurred.',
      })
      setError('Failed to resend code')
    } finally {
      setLoading(false)
    }
  }

  if (otpSent) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-muted/20 p-4">
        <div className="w-full max-w-md">
          <Link href="/auth/login" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Login
          </Link>

          <Card className="shadow-xl">
            <CardHeader className="space-y-1">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center">
                  <Mail className="w-8 h-8 text-blue-600" />
                </div>
              </div>
              <CardTitle className="text-2xl font-bold text-center">OTP Code Sent!</CardTitle>
              <CardDescription className="text-center">
                We've sent a 6-digit verification code to<br />
                <span className="font-medium text-foreground">{email}</span>
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-muted/50 rounded-lg border border-border">
                <p className="text-sm text-muted-foreground">
                  Enter the code on the next page to reset your password. The code will expire in 10 minutes.
                </p>
              </div>
              
              <Button 
                className="w-full"
                onClick={() => router.push(`/auth/verify-otp?email=${encodeURIComponent(email)}&type=reset`)}
              >
                Enter OTP Code
              </Button>

              <div className="text-center space-y-2">
                <p className="text-sm text-muted-foreground">
                  Didn't receive the code?
                </p>
                <Button 
                  variant="outline" 
                  onClick={handleResend}
                  className="w-full"
                  disabled={loading}
                >
                  {loading ? 'Sending...' : 'Resend Code'}
                </Button>
              </div>

              <div className="text-center">
                <Link href="/auth/login" className="text-sm text-primary hover:underline">
                  Back to Login
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-muted/20 p-4">
      <div className="w-full max-w-md">
        <Link href="/auth/login" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Login
        </Link>

        <Card className="shadow-xl">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">Forgot Password?</CardTitle>
            <CardDescription className="text-center">
              No worries, we'll send you reset instructions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="flex items-center gap-2 p-3 text-sm text-red-600 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 rounded-lg">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  Enter the email address associated with your account
                </p>
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Sending...' : 'Reset Password'}
              </Button>

              <div className="text-center text-sm text-muted-foreground">
                Remember your password?{' '}
                <Link href="/auth/login" className="text-primary hover:underline font-medium">
                  Sign in
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

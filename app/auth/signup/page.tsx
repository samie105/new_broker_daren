"use client"

import React, { useState, useMemo } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { ArrowLeft, ArrowRight, Mail, Lock, User, Phone, Globe, Check, AlertCircle, X, CheckCircle, Eye, EyeOff, Facebook, Github, Info } from 'lucide-react'
import { signupAction } from '@/server/actions/auth'
import { Country, State } from 'country-state-city'
import { toast } from 'sonner'

export default function SignupPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [showOAuthDialog, setShowOAuthDialog] = useState(false)

  // Form data
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    country: '',
    countryCode: '', // ISO code for fetching states
    state: '',
    phone: '',
    password: '',
    confirmPassword: ''
  })

  // Get all countries
  const countries = useMemo(() => Country.getAllCountries(), [])

  // Get states for selected country
  const states = useMemo(() => {
    if (!formData.countryCode) return []
    return State.getStatesOfCountry(formData.countryCode)
  }, [formData.countryCode])

  // Password strength tracking
  const [passwordStrength, setPasswordStrength] = useState({
    hasLowercase: false,
    hasUppercase: false,
    hasNumber: false,
    hasSpecialChar: false,
    isLongEnough: false
  })

  const updateField = (field: string, value: string) => {
    setFormData(prev => {
      const updated = { ...prev, [field]: value }
      
      // If country changes, reset state and update country code
      if (field === 'country') {
        const selectedCountry = countries.find(c => c.name === value)
        updated.countryCode = selectedCountry?.isoCode || ''
        updated.state = '' // Reset state when country changes
      }
      
      return updated
    })
    setError('')
    
    // Update password strength when password changes
    if (field === 'password') {
      setPasswordStrength({
        hasLowercase: /[a-z]/.test(value),
        hasUppercase: /[A-Z]/.test(value),
        hasNumber: /[0-9]/.test(value),
        hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(value),
        isLongEnough: value.length >= 8
      })
    }
  }

  const validateStep1 = () => {
    if (!formData.firstName) {
      setError('First name is required')
      return false
    }
    if (!formData.lastName) {
      setError('Last name is required')
      return false
    }
    if (!formData.email) {
      setError('Email is required')
      return false
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setError('Please enter a valid email')
      return false
    }
    return true
  }

  const validateStep2 = () => {
    if (!formData.country) {
      setError('Please select a country')
      return false
    }
    if (!formData.state) {
      setError('Please enter your state/province')
      return false
    }
    if (!formData.phone) {
      setError('Phone number is required')
      return false
    }
    return true
  }

  const validateStep3 = () => {
    if (!formData.password) {
      setError('Password is required')
      return false
    }
    if (!passwordStrength.isLongEnough) {
      setError('Password must be at least 8 characters')
      return false
    }
    if (!passwordStrength.hasLowercase) {
      setError('Password must contain at least one lowercase letter')
      return false
    }
    if (!passwordStrength.hasUppercase) {
      setError('Password must contain at least one uppercase letter')
      return false
    }
    if (!passwordStrength.hasNumber) {
      setError('Password must contain at least one number')
      return false
    }
    if (!passwordStrength.hasSpecialChar) {
      setError('Password must contain at least one special character')
      return false
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      return false
    }
    return true
  }

  const handleNext = () => {
    setError('')
    
    if (currentStep === 1 && validateStep1()) {
      setCurrentStep(2)
    } else if (currentStep === 2 && validateStep2()) {
      setCurrentStep(3)
    }
  }

  const handleBack = () => {
    setError('')
    setCurrentStep(prev => Math.max(1, prev - 1))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateStep3()) return

    setLoading(true)
    setError('')

    try {
      const result = await signupAction({
        email: formData.email,
        password: formData.password,
        firstName: formData.firstName,
        lastName: formData.lastName,
        username: `${formData.firstName.toLowerCase()}${formData.lastName.toLowerCase()}${Math.floor(Math.random() * 1000)}`,
        phone: formData.phone,
        country: formData.country,
        state: formData.state
      })

      if (result.success) {
        toast.success('Account created!', {
          description: 'Verification code sent to your email.',
        })
        // Redirect to OTP verification
        router.push(`/auth/verify-otp?email=${encodeURIComponent(formData.email)}&type=verify`)
      } else {
        toast.error('Signup failed', {
          description: result.error || 'Please try again.',
        })
        setError(result.error || 'Signup failed')
      }
    } catch (err) {
      toast.error('Something went wrong', {
        description: 'An unexpected error occurred. Please try again.',
      })
      setError('An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  const steps = [
    { number: 1, title: 'Personal', description: 'Your legal name' },
    { number: 2, title: 'Location', description: 'Where you are' },
    { number: 3, title: 'Security', description: 'Secure your account' }
  ]

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-muted/20 p-4">
      <div className="w-full max-w-2xl">
        {/* Back to Home Button */}
        <Link href="/" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Link>

        <Card className="shadow-xl">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">Create Account</CardTitle>
            <CardDescription className="text-center">
              Join us and start trading in minutes
            </CardDescription>

            {/* Progress Steps */}
            <div className="flex items-center justify-center gap-2 pt-6">
              {steps.map((step, index) => (
                <React.Fragment key={step.number}>
                  <div className="flex flex-col items-center gap-2">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm transition-all ${
                        currentStep > step.number
                          ? 'bg-primary text-primary-foreground'
                          : currentStep === step.number
                          ? 'bg-primary text-primary-foreground ring-4 ring-primary/20'
                          : 'bg-muted text-muted-foreground'
                      }`}
                    >
                      {currentStep > step.number ? <Check className="w-5 h-5" /> : step.number}
                    </div>
                    <div className="text-center hidden sm:block">
                      <div className="text-xs font-medium">{step.title}</div>
                    </div>
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`h-0.5 w-16 sm:w-24 transition-all ${
                      currentStep > step.number ? 'bg-primary' : 'bg-muted'
                    }`} />
                  )}
                </React.Fragment>
              ))}
            </div>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="flex items-center gap-2 p-3 text-sm text-red-600 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 rounded-lg">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* Step 1: Personal Information */}
              {currentStep === 1 && (
                <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">Legal First Name</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                      <Input
                        id="firstName"
                        type="text"
                        placeholder="John"
                        value={formData.firstName}
                        onChange={(e) => updateField('firstName', e.target.value)}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="lastName">Legal Last Name</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                      <Input
                        id="lastName"
                        type="text"
                        placeholder="Doe"
                        value={formData.lastName}
                        onChange={(e) => updateField('lastName', e.target.value)}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="you@example.com"
                        value={formData.email}
                        onChange={(e) => updateField('email', e.target.value)}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  <div className="p-4 bg-muted/50 rounded-lg border border-border">
                    <p className="text-sm text-muted-foreground">
                      Your legal name will be used for account verification and compliance purposes.
                    </p>
                  </div>
                </div>
              )}

              {/* Step 2: Location Information */}
              {currentStep === 2 && (
                <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                  <div className="space-y-2">
                    <Label htmlFor="country">Country</Label>
                    <Select
                      value={formData.country}
                      onValueChange={(value) => updateField('country', value)}
                    >
                      <SelectTrigger className="w-full">
                        <Globe className="w-4 h-4 mr-2 text-muted-foreground" />
                        <SelectValue placeholder="Select your country" />
                      </SelectTrigger>
                      <SelectContent>
                        {countries.map((country) => (
                          <SelectItem key={country.isoCode} value={country.name}>
                            <div className="flex items-center gap-2">
                              <span>{country.flag}</span>
                              <span>{country.name}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="state">State / Province</Label>
                    {states.length > 0 ? (
                      <Select
                        value={formData.state}
                        onValueChange={(value) => updateField('state', value)}
                        disabled={!formData.country}
                      >
                        <SelectTrigger className="w-full">
                          <Globe className="w-4 h-4 mr-2 text-muted-foreground" />
                          <SelectValue placeholder={formData.country ? "Select your state/province" : "Select country first"} />
                        </SelectTrigger>
                        <SelectContent>
                          {states.map((state) => (
                            <SelectItem key={state.isoCode} value={state.name}>
                              {state.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ) : (
                      <div className="relative">
                        <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                        <Input
                          id="state"
                          type="text"
                          placeholder={formData.country ? "Enter your state/province" : "Select country first"}
                          value={formData.state}
                          onChange={(e) => updateField('state', e.target.value)}
                          className="pl-10"
                          disabled={!formData.country}
                          required
                        />
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="+1 (555) 123-4567"
                        value={formData.phone}
                        onChange={(e) => updateField('phone', e.target.value)}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  <div className="p-4 bg-muted/50 rounded-lg border border-border">
                    <p className="text-sm text-muted-foreground">
                      We'll use this information to verify your identity and comply with regulations.
                    </p>
                  </div>
                </div>
              )}

              {/* Step 3: Security - Password */}
              {currentStep === 3 && (
                <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                  <div className="space-y-2">
                    <Label htmlFor="password">Create Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter a strong password"
                        value={formData.password}
                        onChange={(e) => updateField('password', e.target.value)}
                        className="pl-10 pr-10"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Password Strength Guide */}
                  <div className="p-4 bg-muted/50 rounded-lg border border-border space-y-3">
                    <p className="text-sm font-medium text-foreground">Password must contain:</p>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        {passwordStrength.hasLowercase ? (
                          <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                        ) : (
                          <X className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                        )}
                        <span className={`text-sm ${passwordStrength.hasLowercase ? 'text-green-600' : 'text-muted-foreground'}`}>
                          At least one lowercase letter (a-z)
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        {passwordStrength.hasUppercase ? (
                          <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                        ) : (
                          <X className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                        )}
                        <span className={`text-sm ${passwordStrength.hasUppercase ? 'text-green-600' : 'text-muted-foreground'}`}>
                          At least one uppercase letter (A-Z)
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        {passwordStrength.hasNumber ? (
                          <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                        ) : (
                          <X className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                        )}
                        <span className={`text-sm ${passwordStrength.hasNumber ? 'text-green-600' : 'text-muted-foreground'}`}>
                          At least one number (0-9)
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        {passwordStrength.hasSpecialChar ? (
                          <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                        ) : (
                          <X className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                        )}
                        <span className={`text-sm ${passwordStrength.hasSpecialChar ? 'text-green-600' : 'text-muted-foreground'}`}>
                          At least one special character (!@#$%^&*)
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        {passwordStrength.isLongEnough ? (
                          <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                        ) : (
                          <X className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                        )}
                        <span className={`text-sm ${passwordStrength.isLongEnough ? 'text-green-600' : 'text-muted-foreground'}`}>
                          At least 8 characters long
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                      <Input
                        id="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Re-enter your password"
                        value={formData.confirmPassword}
                        onChange={(e) => updateField('confirmPassword', e.target.value)}
                        className="pl-10 pr-10"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="p-4 bg-muted/50 rounded-lg border border-border">
                    <p className="text-sm text-muted-foreground">
                      By creating an account, you agree to our Terms of Service and Privacy Policy.
                    </p>
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex gap-3 pt-4">
                {currentStep > 1 && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleBack}
                    className="flex-1"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back
                  </Button>
                )}
                
                {currentStep < 3 ? (
                  <Button
                    type="button"
                    onClick={handleNext}
                    className="flex-1"
                  >
                    Next
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    disabled={loading}
                    className="flex-1"
                  >
                    {loading ? 'Creating Account...' : 'Create Account'}
                  </Button>
                )}
              </div>

              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">
                    Or continue with
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={() => setShowOAuthDialog(true)}
                >
                  <Facebook className="w-5 h-5 mr-2" />
                  Facebook
                </Button>
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={() => setShowOAuthDialog(true)}
                >
                  <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  Google
                </Button>
              </div>

              <div className="text-center text-sm text-muted-foreground pt-4">
                Already have an account?{' '}
                <Link href="/auth/login" className="text-primary hover:underline font-medium">
                  Sign in
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* OAuth On Hold Dialog */}
        <Dialog open={showOAuthDialog} onOpenChange={setShowOAuthDialog}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-primary/10 dark:bg-primary/20 rounded-full flex items-center justify-center">
                  <Info className="w-8 h-8 text-primary" />
                </div>
              </div>
              <DialogTitle className="text-center">Feature Currently On Hold</DialogTitle>
              <DialogDescription className="text-center pt-2">
                Social authentication is currently on hold and will be available right away. Please use email and password to continue.
              </DialogDescription>
            </DialogHeader>
            <div className="flex justify-center pt-2">
              <Button onClick={() => setShowOAuthDialog(false)} className="w-full sm:w-auto">
                Got it
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}

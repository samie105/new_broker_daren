"use client"

import React, { useState, useRef } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { CreditCard, FileText, Upload, X, CheckCircle, Loader2 } from 'lucide-react'
import { DatePicker } from '@/components/ui/datefield-rac'
import { uploadVerificationDocumentAction, submitVerificationAction } from '@/server/actions/verification'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

const idTypes = [
  {
    id: 'passport',
    name: 'Passport',
    icon: FileText,
    description: 'International travel document',
    requiresBack: false
  },
  {
    id: 'drivers-license',
    name: "Driver's License",
    icon: CreditCard,
    description: 'Government-issued driving permit',
    requiresBack: true
  },
  {
    id: 'national-id',
    name: 'National ID Card',
    icon: CreditCard,
    description: 'Government-issued identification',
    requiresBack: true
  }
]

export function VerificationForm() {
  const [selectedIdType, setSelectedIdType] = useState<string | null>(null)
  const [frontImage, setFrontImage] = useState<string | null>(null)
  const [backImage, setBackImage] = useState<string | null>(null)
  const [frontFileName, setFrontFileName] = useState<string>('')
  const [backFileName, setBackFileName] = useState<string>('')
  const [frontImageUrl, setFrontImageUrl] = useState<string>('')
  const [backImageUrl, setBackImageUrl] = useState<string>('')
  const [uploading, setUploading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const router = useRouter()
  
  // Form fields
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    idNumber: '',
    dateOfBirth: '',
    address: '',
    city: '',
    country: '',
    postalCode: ''
  })
  
  const frontInputRef = useRef<HTMLInputElement>(null)
  const backInputRef = useRef<HTMLInputElement>(null)

  const selectedType = idTypes.find(type => type.id === selectedIdType)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleDateChange = (date: string) => {
    setFormData({
      ...formData,
      dateOfBirth: date
    })
  }

  const handleFileUpload = async (file: File | null, side: 'front' | 'back') => {
    if (!file) return

    // Validate file size (10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast.error('File size must be less than 10MB')
      return
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf']
    if (!allowedTypes.includes(file.type)) {
      toast.error('Invalid file type. Only JPG, PNG, and PDF are allowed')
      return
    }

    setUploading(true)

    try {
      // Upload to Supabase Storage
      const result = await uploadVerificationDocumentAction(file, side)

      if (!result.success || !result.data) {
        toast.error(result.error || 'Failed to upload document')
        return
      }

      // Set preview and URL
      const reader = new FileReader()
      reader.onloadend = () => {
        if (side === 'front') {
          setFrontImage(reader.result as string)
          setFrontFileName(file.name)
          setFrontImageUrl(result.data!.url)
        } else {
          setBackImage(reader.result as string)
          setBackFileName(file.name)
          setBackImageUrl(result.data!.url)
        }
      }
      reader.readAsDataURL(file)

      toast.success(`${side === 'front' ? 'Front' : 'Back'} side uploaded successfully`)
    } catch (error: any) {
      toast.error(error.message || 'Failed to upload document')
    } finally {
      setUploading(false)
    }
  }

  const clearImage = (side: 'front' | 'back') => {
    if (side === 'front') {
      setFrontImage(null)
      setFrontFileName('')
      setFrontImageUrl('')
      if (frontInputRef.current) frontInputRef.current.value = ''
    } else {
      setBackImage(null)
      setBackFileName('')
      setBackImageUrl('')
      if (backInputRef.current) backInputRef.current.value = ''
    }
  }

  const handleSubmit = async () => {
    if (!selectedIdType) {
      toast.error('Please select an ID type')
      return
    }

    if (!frontImageUrl) {
      toast.error('Please upload the front side of your ID')
      return
    }

    if (selectedType?.requiresBack && !backImageUrl) {
      toast.error('Please upload the back side of your ID')
      return
    }

    if (!isFormValid()) {
      toast.error('Please fill in all required fields')
      return
    }

    setSubmitting(true)

    try {
      const result = await submitVerificationAction({
        id_type: selectedIdType as 'passport' | 'drivers-license' | 'national-id',
        first_name: formData.firstName,
        last_name: formData.lastName,
        id_number: formData.idNumber,
        date_of_birth: formData.dateOfBirth,
        address: formData.address,
        city: formData.city,
        country: formData.country,
        postal_code: formData.postalCode,
        front_image_url: frontImageUrl,
        back_image_url: backImageUrl || undefined,
      })

      if (result.success) {
        toast.success('Verification submitted successfully!')
        router.refresh()
      } else {
        toast.error(result.error || 'Failed to submit verification')
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to submit verification')
    } finally {
      setSubmitting(false)
    }
  }

  const isFormValid = () => {
    return (
      formData.firstName &&
      formData.lastName &&
      formData.idNumber &&
      formData.dateOfBirth &&
      formData.address &&
      formData.city &&
      formData.country &&
      formData.postalCode
    )
  }

  const canSubmit = selectedIdType && frontImageUrl && (!selectedType?.requiresBack || backImageUrl) && isFormValid() && !uploading && !submitting

  return (
    <div className="space-y-6">
      {/* ID Type Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Step 1: Select ID Type</CardTitle>
          <CardDescription>Choose the type of identification document you want to upload</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {idTypes.map((idType) => {
              const Icon = idType.icon
              const isSelected = selectedIdType === idType.id
              
              return (
                <div
                  key={idType.id}
                  onClick={() => setSelectedIdType(idType.id)}
                  className={`p-4 rounded-xl border-2 transition-all cursor-pointer text-left ${
                    isSelected
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:border-primary/50 hover:bg-muted/50'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-lg ${
                      isSelected ? 'bg-primary/10' : 'bg-muted'
                    }`}>
                      <Icon className={`w-5 h-5 ${
                        isSelected ? 'text-primary' : 'text-muted-foreground'
                      }`} />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold mb-1">{idType.name}</h3>
                      <p className="text-xs text-muted-foreground">{idType.description}</p>
                    </div>
                    {isSelected && (
                      <CheckCircle className="w-5 h-5 text-primary flex-shrink-0" />
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Document Upload */}
      {selectedIdType && (
        <>
          {/* Personal Information Form */}
          <Card>
            <CardHeader>
              <CardTitle>Step 2: Personal Information</CardTitle>
              <CardDescription>
                Enter your personal details as they appear on your ID document
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name *</Label>
                  <Input
                    id="firstName"
                    name="firstName"
                    placeholder="John"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name *</Label>
                  <Input
                    id="lastName"
                    name="lastName"
                    placeholder="Doe"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="idNumber">ID Number *</Label>
                  <Input
                    id="idNumber"
                    name="idNumber"
                    placeholder="Enter your ID number"
                    value={formData.idNumber}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <DatePicker
                  label="Date of Birth"
                  name="dateOfBirth"
                  id="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleDateChange}
                  required
                  placeholder="Select your date of birth"
                />

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="address">Street Address *</Label>
                  <Input
                    id="address"
                    name="address"
                    placeholder="123 Main Street, Apt 4B"
                    value={formData.address}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="city">City *</Label>
                  <Input
                    id="city"
                    name="city"
                    placeholder="New York"
                    value={formData.city}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="country">Country *</Label>
                  <Input
                    id="country"
                    name="country"
                    placeholder="United States"
                    value={formData.country}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="postalCode">Postal Code *</Label>
                  <Input
                    id="postalCode"
                    name="postalCode"
                    placeholder="10001"
                    value={formData.postalCode}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Document Upload Card */}
          <Card>
            <CardHeader>
              <CardTitle>Step 3: Upload Your {selectedType?.name}</CardTitle>
              <CardDescription>
                Please ensure your document is clear, readable, and all corners are visible
              </CardDescription>
            </CardHeader>
          <CardContent className="space-y-6">
            {/* Front Side Upload */}
            <div className="space-y-3">
              <Label className="text-base">
                Front Side {selectedType?.id === 'passport' ? '(Photo Page)' : ''}
              </Label>
              
              {!frontImage ? (
                <div
                  onClick={() => frontInputRef.current?.click()}
                  className="border border-dashed border-border rounded-lg p-8 hover:border-primary hover:bg-muted/50 transition-all cursor-pointer"
                >
                  <div className="flex flex-col items-center gap-3 text-center">
                    <div className="p-4 rounded-full bg-primary/10">
                      <Upload className="w-8 h-8 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium mb-1">Click to upload front side</p>
                      <p className="text-sm text-muted-foreground">
                        PNG, JPG or PDF (max. 10MB)
                      </p>
                    </div>
                  </div>
                  <input
                    ref={frontInputRef}
                    type="file"
                    accept="image/*,.pdf"
                    className="hidden"
                    onChange={(e) => handleFileUpload(e.target.files?.[0] || null, 'front')}
                  />
                </div>
              ) : (
                <div className="border border-emerald-200 dark:border-emerald-800 rounded-lg p-4 bg-emerald-50/50 dark:bg-emerald-900/10">
                  <div className="flex items-center gap-4">
                    <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                      {frontImage && (
                        <img
                          src={frontImage}
                          alt="Front side preview"
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                        <p className="font-medium text-sm">Front side uploaded</p>
                      </div>
                      <p className="text-xs text-muted-foreground truncate">{frontFileName}</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => clearImage('front')}
                      className="flex-shrink-0"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              )}
            </div>

            {/* Back Side Upload (if required) */}
            {selectedType?.requiresBack && (
              <div className="space-y-3">
                <Label className="text-base">Back Side</Label>
                
                {!backImage ? (
                  <div
                    onClick={() => backInputRef.current?.click()}
                    className="border border-dashed border-border rounded-lg p-8 hover:border-primary hover:bg-muted/50 transition-all cursor-pointer"
                  >
                    <div className="flex flex-col items-center gap-3 text-center">
                      <div className="p-4 rounded-full bg-primary/10">
                        <Upload className="w-8 h-8 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium mb-1">Click to upload back side</p>
                        <p className="text-sm text-muted-foreground">
                          PNG, JPG or PDF (max. 10MB)
                        </p>
                      </div>
                    </div>
                    <input
                      ref={backInputRef}
                      type="file"
                      accept="image/*,.pdf"
                      className="hidden"
                      onChange={(e) => handleFileUpload(e.target.files?.[0] || null, 'back')}
                    />
                  </div>
                ) : (
                  <div className="border border-emerald-200 dark:border-emerald-800 rounded-lg p-4 bg-emerald-50/50 dark:bg-emerald-900/10">
                    <div className="flex items-center gap-4">
                      <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                        {backImage && (
                          <img
                            src={backImage}
                            alt="Back side preview"
                            className="w-full h-full object-cover"
                          />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                          <p className="font-medium text-sm">Back side uploaded</p>
                        </div>
                        <p className="text-xs text-muted-foreground truncate">{backFileName}</p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => clearImage('back')}
                        className="flex-shrink-0"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Important Notes */}
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
              <h4 className="font-medium text-sm mb-2">Important Guidelines:</h4>
              <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                <li>Ensure all text is clearly readable</li>
                <li>All four corners of the document must be visible</li>
                <li>No glare or reflections on the document</li>
                <li>Document must be in color and not expired</li>
              </ul>
            </div>

            {/* Submit Button */}
            <Button 
              className="w-full" 
              size="lg"
              disabled={!canSubmit}
              onClick={handleSubmit}
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Submitting...
                </>
              ) : (
                'Submit for Verification'
              )}
            </Button>
          </CardContent>
        </Card>
        </>
      )}
    </div>
  )
}

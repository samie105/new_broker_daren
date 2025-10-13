"use client"

import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { User, Mail, Phone, MapPin, Camera, ChevronDown, ChevronUp } from 'lucide-react'

export function ProfileSettings() {
  const [formData, setFormData] = useState({
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    phone: '+1 234 567 8900',
    country: 'United States',
    city: 'New York',
  })

  const [isPhotoOpen, setIsPhotoOpen] = useState(true)
  const [isInfoOpen, setIsInfoOpen] = useState(true)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSave = () => {
    // Handle save logic
    console.log('Saving profile:', formData)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile Information</CardTitle>
        <CardDescription>Update your personal information and profile picture</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Profile Picture */}
        <div className="space-y-4">
          <button
            onClick={() => setIsPhotoOpen(!isPhotoOpen)}
            className="flex items-center justify-between w-full text-left"
          >
            <h3 className="text-sm font-semibold">Profile Picture</h3>
            {isPhotoOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </button>
          
          {isPhotoOpen && (
        <div className="flex items-center gap-4">
          <Avatar className="h-20 w-20">
            <AvatarImage src="/placeholder-avatar.jpg" alt="Profile" />
            <AvatarFallback className="text-xl">JD</AvatarFallback>
          </Avatar>
          <div>
            <Button variant="outline" size="sm" className="gap-2">
              <Camera className="h-4 w-4" />
              Change Photo
            </Button>
            <p className="text-xs text-muted-foreground mt-2">JPG, PNG or GIF. Max size 2MB</p>
          </div>
        </div>
          )}
        </div>

        <div className="border-t pt-6" />

        {/* Form Fields */}
        <div className="space-y-4">
          <button
            onClick={() => setIsInfoOpen(!isInfoOpen)}
            className="flex items-center justify-between w-full text-left"
          >
            <h3 className="text-sm font-semibold">Personal Information</h3>
            {isInfoOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </button>
          
          {isInfoOpen && (
            <>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="firstName">First Name</Label>
            <div className="relative">
              <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                className="pl-10"
                placeholder="Enter first name"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="lastName">Last Name</Label>
            <div className="relative">
              <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                className="pl-10"
                placeholder="Enter last name"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                className="pl-10"
                placeholder="Enter email"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <div className="relative">
              <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className="pl-10"
                placeholder="Enter phone number"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="country">Country</Label>
            <div className="relative">
              <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="country"
                name="country"
                value={formData.country}
                onChange={handleInputChange}
                className="pl-10"
                placeholder="Enter country"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="city">City</Label>
            <div className="relative">
              <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="city"
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                className="pl-10"
                placeholder="Enter city"
              />
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <Button onClick={handleSave}>Save Changes</Button>
        </div>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

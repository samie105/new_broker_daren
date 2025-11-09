'use server'

import { createServerSupabase } from '@/server/db/supabase'
import { revalidatePath } from 'next/cache'
import { getCurrentUser } from '@/lib/auth-actions'

export interface VerificationSubmission {
  id_type: 'passport' | 'drivers-license' | 'national-id'
  first_name: string
  last_name: string
  id_number: string
  date_of_birth: string
  address: string
  city: string
  country: string
  postal_code: string
  front_image_url: string
  back_image_url?: string
}

export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

// UPLOAD VERIFICATION DOCUMENT TO CLOUDINARY
export async function uploadVerificationDocumentAction(
  file: File,
  side: 'front' | 'back'
): Promise<ApiResponse<{ url: string }>> {
  try {
    // Get current user from our custom auth
    const user = await getCurrentUser()

    if (!user) {
      return {
        success: false,
        error: 'Not authenticated',
      }
    }

    // Validate file
    const maxSize = 10 * 1024 * 1024 // 10MB
    if (file.size > maxSize) {
      return {
        success: false,
        error: 'File size must be less than 10MB',
      }
    }

    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf']
    if (!allowedTypes.includes(file.type)) {
      return {
        success: false,
        error: 'Invalid file type. Only JPG, PNG, and PDF are allowed',
      }
    }

    // Upload to Cloudinary
    const formData = new FormData()
    formData.append('file', file)
    formData.append('upload_preset', 'ml_default')
    formData.append('folder', `verification/${user.id}`)
    formData.append('public_id', `${side}-${Date.now()}`)

    const response = await fetch('https://api.cloudinary.com/v1_1/dgqjunu7l/upload', {
      method: 'POST',
      body: formData,
    })

    if (!response.ok) {
      const error = await response.json()
      console.error('Cloudinary upload error:', error)
      return {
        success: false,
        error: 'Failed to upload document',
      }
    }

    const result = await response.json()

    return {
      success: true,
      data: { url: result.secure_url },
      message: 'Document uploaded successfully',
    }
  } catch (error: any) {
    console.error('Upload verification document error:', error)
    return {
      success: false,
      error: error.message || 'Failed to upload document',
    }
  }
}

// SUBMIT VERIFICATION REQUEST
export async function submitVerificationAction(
  data: VerificationSubmission
): Promise<ApiResponse> {
  try {
    const supabase = createServerSupabase()

    // Get current user from our custom auth
    const user = await getCurrentUser()

    if (!user) {
      return {
        success: false,
        error: 'Not authenticated',
      }
    }

    // Check if user already has a pending or approved verification
    const { data: existingUser } = await supabase
      .from('users')
      .select('kyc_status')
      .eq('id', user.id)
      .single()

    if (existingUser) {
      if ((existingUser as any).kyc_status === 'approved') {
        return {
          success: false,
          error: 'Your account is already verified',
        }
      }
      if ((existingUser as any).kyc_status === 'pending') {
        return {
          success: false,
          error: 'You already have a pending verification request',
        }
      }
    }

    // Update user record with verification data
    const { error: updateError } = await supabase
      .from('users')
      .update({
        kyc_status: 'pending',
        kyc_id_type: data.id_type,
        kyc_id_number: data.id_number,
        kyc_address: data.address,
        kyc_city: data.city,
        kyc_postal_code: data.postal_code,
        kyc_front_image_url: data.front_image_url,
        kyc_back_image_url: data.back_image_url,
        kyc_submitted_at: new Date().toISOString(),
        first_name: data.first_name,
        last_name: data.last_name,
        date_of_birth: data.date_of_birth,
        country: data.country,
      } as any)
      .eq('id', user.id)

    if (updateError) {
      console.error('Update verification error:', updateError)
      return {
        success: false,
        error: 'Failed to submit verification request',
      }
    }

    // TODO: Create notification for user (store in users.notifications JSONB)
    // await supabase.from('notifications').insert({
    //   user_id: user.id,
    //   type: 'kyc',
    //   title: 'Verification Submitted',
    //   message: 'Your identity verification has been submitted and is pending review. We\'ll notify you once it\'s processed.',
    //   icon: '✅',
    //   is_read: false,
    //   metadata: {
    //     status: 'pending'
    //   }
    // })

    revalidatePath('/dashboard/verification')

    return {
      success: true,
      message: 'Verification request submitted successfully',
    }
  } catch (error: any) {
    console.error('Submit verification error:', error)
    return {
      success: false,
      error: error.message || 'Failed to submit verification',
    }
  }
}

// GET VERIFICATION STATUS
export async function getVerificationStatusAction(): Promise<
  ApiResponse<{
    status: 'not_started' | 'pending' | 'approved' | 'rejected'
    data?: any
  }>
> {
  try {
    const supabase = createServerSupabase()

    // Get current user from our custom auth
    const user = await getCurrentUser()

    if (!user) {
      return {
        success: false,
        error: 'Not authenticated',
      }
    }

    // Get user's KYC data from users table
    const { data: userData, error } = await supabase
      .from('users')
      .select('kyc_status, kyc_id_type, kyc_id_number, kyc_submitted_at, kyc_reviewed_at, kyc_rejection_reason')
      .eq('id', user.id)
      .single()

    if (error) {
      console.error('Get verification status error:', error)
      return {
        success: false,
        error: 'Failed to fetch verification status',
      }
    }

    if (!userData || !(userData as any).kyc_status || (userData as any).kyc_status === 'not_started') {
      return {
        success: true,
        data: {
          status: 'not_started',
        },
      }
    }

    return {
      success: true,
      data: {
        status: (userData as any).kyc_status,
        data: {
          status: (userData as any).kyc_status,
          id_type: (userData as any).kyc_id_type,
          submitted_at: (userData as any).kyc_submitted_at,
          reviewed_at: (userData as any).kyc_reviewed_at,
          rejection_reason: (userData as any).kyc_rejection_reason,
        },
      },
    }
  } catch (error: any) {
    console.error('Get verification status error:', error)
    return {
      success: false,
      error: error.message || 'Failed to fetch verification status',
    }
  }
}

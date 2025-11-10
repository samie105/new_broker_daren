import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

/**
 * Emergency route to clear authentication session
 * Visit /api/clear-session to clear your auth cookie
 */
export async function GET() {
  try {
    const cookieStore = await cookies()
    
    // Clear the auth_session cookie
    cookieStore.delete('auth_session')
    
    // Also clear the old auth-token cookie if it exists
    cookieStore.delete('auth-token')
    
    return NextResponse.json(
      {
        success: true,
        message: 'Session cleared successfully. You can now login again.',
        redirectUrl: '/',
      },
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    )
  } catch (error) {
    console.error('Clear session error:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to clear session',
      },
      { status: 500 }
    )
  }
}

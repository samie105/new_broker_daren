'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

// Types
export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  phone: string
  country: string
  createdAt: string
}

interface SignupData {
  email: string
  password: string
  firstName: string
  lastName: string
  phone: string
  country: string
  state: string
}

// In-memory store (replace with database in production)
const users: Map<string, User & { password: string }> = new Map()

// Cookie configuration
const COOKIE_NAME = 'auth-token'
const COOKIE_MAX_AGE = 60 * 60 * 24 * 7 // 7 days

// Helper to generate a simple session token
function generateToken(email: string): string {
  return Buffer.from(`${email}:${Date.now()}:${Math.random()}`).toString('base64')
}

// Helper to get user from token
async function getUserFromToken(token: string): Promise<User | null> {
  try {
    const decoded = Buffer.from(token, 'base64').toString()
    const email = decoded.split(':')[0]
    const user = Array.from(users.values()).find(u => u.email === email)
    
    if (user) {
      const { password, ...userWithoutPassword } = user
      return userWithoutPassword
    }
    return null
  } catch {
    return null
  }
}

// Get current user
export async function getCurrentUser(): Promise<User | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get(COOKIE_NAME)?.value
  
  if (!token) return null
  
  return getUserFromToken(token)
}

// Login action
export async function loginAction(email: string, password: string) {
  try {
    // Find user
    const user = Array.from(users.values()).find(u => u.email === email)
    
    if (!user) {
      return { success: false, error: 'Invalid email or password' }
    }
    
    // Check password (in production, use bcrypt)
    if (user.password !== password) {
      return { success: false, error: 'Invalid email or password' }
    }
    
    // Generate token
    const token = generateToken(email)
    
    // Set cookie
    const cookieStore = await cookies()
    cookieStore.set(COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: COOKIE_MAX_AGE,
      path: '/'
    })
    
    return { success: true }
  } catch (error) {
    console.error('Login error:', error)
    return { success: false, error: 'An error occurred during login' }
  }
}

// Signup action
export async function signupAction(data: SignupData) {
  try {
    // Check if user exists
    const existingUser = Array.from(users.values()).find(u => u.email === data.email)
    
    if (existingUser) {
      return { success: false, error: 'Email already registered' }
    }
    
    // Create user
    const userId = `user_${Date.now()}_${Math.random().toString(36).substring(7)}`
    const newUser = {
      id: userId,
      email: data.email,
      password: data.password, // In production, hash this with bcrypt
      firstName: data.firstName,
      lastName: data.lastName,
      phone: data.phone,
      country: data.country,
      state: data.state,
      createdAt: new Date().toISOString()
    }
    
    users.set(userId, newUser)
    
    // Generate token
    const token = generateToken(data.email)
    
    // Set cookie
    const cookieStore = await cookies()
    cookieStore.set(COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: COOKIE_MAX_AGE,
      path: '/'
    })
    
    return { success: true }
  } catch (error) {
    console.error('Signup error:', error)
    return { success: false, error: 'An error occurred during signup' }
  }
}

// Logout action
export async function logoutAction() {
  const cookieStore = await cookies()
  cookieStore.delete(COOKIE_NAME)
  redirect('/')
}

// Check if user is authenticated
export async function isAuthenticated(): Promise<boolean> {
  const user = await getCurrentUser()
  return user !== null
}

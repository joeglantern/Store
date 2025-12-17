import type { Socket } from 'socket.io'
import type { ExtendedError } from 'socket.io/dist/namespace'
import { supabase } from '../../lib/supabase.js'

// Extend Socket with user data
declare module 'socket.io' {
  interface Socket {
    data: {
      user: {
        id: string
        email: string
        role: 'customer' | 'admin' | 'super_admin'
        full_name?: string
      }
    }
  }
}

/**
 * WebSocket authentication middleware
 * Verifies token and attaches user data to socket
 */
export async function authenticateSocket(
  socket: Socket,
  next: (err?: ExtendedError) => void
) {
  try {
    const token = socket.handshake.auth.token

    if (!token) {
      return next(new Error('Authentication token required'))
    }

    // Verify token with Supabase
    const { data: { user }, error } = await supabase.auth.getUser(token)

    if (error || !user) {
      return next(new Error('Invalid authentication token'))
    }

    // Fetch user profile with role
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('role, email, full_name')
      .eq('id', user.id)
      .single()

    if (profileError || !profile) {
      return next(new Error('User profile not found'))
    }

    // Attach user data to socket
    socket.data.user = {
      id: user.id,
      email: profile.email,
      role: profile.role as 'customer' | 'admin' | 'super_admin',
      full_name: profile.full_name
    }

    next()
  } catch (error) {
    console.error('WebSocket authentication error:', error)
    next(new Error('Authentication failed'))
  }
}

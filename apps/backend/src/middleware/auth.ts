import { FastifyRequest, FastifyReply } from 'fastify'
import { supabase } from '../lib/supabase.js'

// Extend Fastify request to include user
declare module 'fastify' {
  interface FastifyRequest {
    user?: {
      id: string
      email: string
      role: 'customer' | 'admin' | 'super_admin'
      full_name?: string
    }
  }
}

/**
 * Middleware to require authentication
 * Verifies the JWT token from Authorization header
 * Attaches user data to request.user
 */
export async function requireAuth(
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    const authHeader = request.headers.authorization

    if (!authHeader?.startsWith('Bearer ')) {
      return reply.code(401).send({
        success: false,
        error: {
          code: 'UNAUTHORIZED',
          message: 'Missing or invalid authorization header'
        }
      })
    }

    const token = authHeader.substring(7)

    // Verify token with Supabase
    const { data: { user }, error } = await supabase.auth.getUser(token)

    if (error || !user) {
      return reply.code(401).send({
        success: false,
        error: {
          code: 'UNAUTHORIZED',
          message: 'Invalid or expired token'
        }
      })
    }

    // Fetch role from profiles table
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('role, full_name')
      .eq('id', user.id)
      .single()

    if (profileError || !profile) {
      return reply.code(403).send({
        success: false,
        error: {
          code: 'FORBIDDEN',
          message: 'User profile not found'
        }
      })
    }

    // Attach user data to request
    request.user = {
      id: user.id,
      email: user.email!,
      role: profile.role as 'customer' | 'admin' | 'super_admin',
      full_name: profile.full_name
    }
  } catch (error) {
    request.log.error('Authentication error:', error)
    return reply.code(500).send({
      success: false,
      error: {
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Authentication failed'
      }
    })
  }
}

/**
 * Middleware to require admin role (admin or super_admin)
 * Must be used after requireAuth
 */
export async function requireAdmin(
  request: FastifyRequest,
  reply: FastifyReply
) {
  if (!request.user) {
    return reply.code(401).send({
      success: false,
      error: {
        code: 'UNAUTHORIZED',
        message: 'Authentication required'
      }
    })
  }

  if (!['admin', 'super_admin'].includes(request.user.role)) {
    return reply.code(403).send({
      success: false,
      error: {
        code: 'FORBIDDEN',
        message: 'Admin access required'
      }
    })
  }
}

/**
 * Middleware to require super_admin role
 * Must be used after requireAuth
 */
export async function requireSuperAdmin(
  request: FastifyRequest,
  reply: FastifyReply
) {
  if (!request.user) {
    return reply.code(401).send({
      success: false,
      error: {
        code: 'UNAUTHORIZED',
        message: 'Authentication required'
      }
    })
  }

  if (request.user.role !== 'super_admin') {
    return reply.code(403).send({
      success: false,
      error: {
        code: 'FORBIDDEN',
        message: 'Super admin access required'
      }
    })
  }
}

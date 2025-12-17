import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify'
import { requireAuth, requireAdmin } from '../middleware/auth.js'
import * as productService from '../services/product.service.js'
import type { ProductListQuery, CreateProductRequest, UpdateProductRequest } from '../types/product.types.js'

/**
 * Register product routes
 */
export async function productRoutes(fastify: FastifyInstance) {
  // Public routes (no auth required)

  // GET /api/v1/products - List products
  fastify.get('/products', async (request: FastifyRequest<{ Querystring: ProductListQuery }>, reply: FastifyReply) => {
    try {
      const result = await productService.getProducts(request.query)
      return reply.send({
        success: true,
        data: result
      })
    } catch (error) {
      request.log.error(error)
      return reply.code(500).send({
        success: false,
        error: {
          code: 'INTERNAL_SERVER_ERROR',
          message: error instanceof Error ? error.message : 'Failed to fetch products'
        }
      })
    }
  })

  // GET /api/v1/products/:slug - Get product by slug
  fastify.get<{ Params: { slug: string } }>('/products/:slug', async (request, reply) => {
    try {
      const product = await productService.getProductBySlug(request.params.slug)
      return reply.send({
        success: true,
        data: product
      })
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to fetch product'
      const statusCode = message === 'Product not found' ? 404 : 500
      return reply.code(statusCode).send({
        success: false,
        error: {
          code: statusCode === 404 ? 'NOT_FOUND' : 'INTERNAL_SERVER_ERROR',
          message
        }
      })
    }
  })

  // Admin routes (auth + admin role required)

  // POST /api/v1/products - Create product
  fastify.post<{ Body: CreateProductRequest }>(
    '/products',
    { preHandler: [requireAuth, requireAdmin] },
    async (request, reply) => {
      try {
        const product = await productService.createProduct(request.body)
        return reply.code(201).send({
          success: true,
          data: product
        })
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to create product'
        const statusCode = message.includes('already exists') ? 409 : 500
        return reply.code(statusCode).send({
          success: false,
          error: {
            code: statusCode === 409 ? 'CONFLICT' : 'INTERNAL_SERVER_ERROR',
            message
          }
        })
      }
    }
  )

  // PUT /api/v1/products/:id - Update product
  fastify.put<{ Params: { id: string }; Body: UpdateProductRequest }>(
    '/products/:id',
    { preHandler: [requireAuth, requireAdmin] },
    async (request, reply) => {
      try {
        const product = await productService.updateProduct(request.params.id, request.body)
        return reply.send({
          success: true,
          data: product
        })
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to update product'
        let statusCode = 500
        if (message === 'Product not found') statusCode = 404
        if (message.includes('already exists')) statusCode = 409

        return reply.code(statusCode).send({
          success: false,
          error: {
            code: statusCode === 404 ? 'NOT_FOUND' : statusCode === 409 ? 'CONFLICT' : 'INTERNAL_SERVER_ERROR',
            message
          }
        })
      }
    }
  )

  // DELETE /api/v1/products/:id - Delete product
  fastify.delete<{ Params: { id: string } }>(
    '/products/:id',
    { preHandler: [requireAuth, requireAdmin] },
    async (request, reply) => {
      try {
        await productService.deleteProduct(request.params.id)
        return reply.send({
          success: true,
          message: 'Product deleted successfully'
        })
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to delete product'
        return reply.code(500).send({
          success: false,
          error: {
            code: 'INTERNAL_SERVER_ERROR',
            message
          }
        })
      }
    }
  )
}

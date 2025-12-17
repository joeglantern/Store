import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify'
import { requireAuth, requireAdmin } from '../middleware/auth.js'
import * as variantService from '../services/variant.service.js'
import * as inventoryService from '../services/inventory.service.js'

/**
 * Register variant and inventory routes
 */
export async function variantRoutes(fastify: FastifyInstance) {
  // Public routes

  // GET /api/v1/products/:id/variants - List variants for a product
  fastify.get<{ Params: { id: string } }>('/products/:id/variants', async (request, reply) => {
    try {
      const variants = await variantService.getProductVariants(request.params.id)
      return reply.send({
        success: true,
        data: { variants }
      })
    } catch (error) {
      request.log.error(error)
      return reply.code(500).send({
        success: false,
        error: {
          code: 'INTERNAL_SERVER_ERROR',
          message: error instanceof Error ? error.message : 'Failed to fetch variants'
        }
      })
    }
  })

  // GET /api/v1/variants/:id - Get single variant
  fastify.get<{ Params: { id: string } }>('/variants/:id', async (request, reply) => {
    try {
      const variant = await variantService.getVariantById(request.params.id)
      return reply.send({
        success: true,
        data: variant
      })
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to fetch variant'
      const statusCode = message === 'Variant not found' ? 404 : 500
      return reply.code(statusCode).send({
        success: false,
        error: {
          code: statusCode === 404 ? 'NOT_FOUND' : 'INTERNAL_SERVER_ERROR',
          message
        }
      })
    }
  })

  // Admin routes

  // POST /api/v1/products/:id/variants - Create variant
  fastify.post<{ Params: { id: string }; Body: variantService.CreateVariantRequest }>(
    '/products/:id/variants',
    { preHandler: [requireAuth, requireAdmin] },
    async (request, reply) => {
      try {
        const variant = await variantService.createVariant({
          ...request.body,
          product_id: request.params.id
        })
        return reply.code(201).send({
          success: true,
          data: variant
        })
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to create variant'
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

  // PUT /api/v1/variants/:id - Update variant
  fastify.put<{ Params: { id: string }; Body: variantService.UpdateVariantRequest }>(
    '/variants/:id',
    { preHandler: [requireAuth, requireAdmin] },
    async (request, reply) => {
      try {
        const variant = await variantService.updateVariant(request.params.id, request.body)
        return reply.send({
          success: true,
          data: variant
        })
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to update variant'
        let statusCode = 500
        if (message === 'Variant not found') statusCode = 404
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

  // DELETE /api/v1/variants/:id - Delete variant
  fastify.delete<{ Params: { id: string } }>(
    '/variants/:id',
    { preHandler: [requireAuth, requireAdmin] },
    async (request, reply) => {
      try {
        await variantService.deleteVariant(request.params.id)
        return reply.send({
          success: true,
          message: 'Variant deleted successfully'
        })
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to delete variant'
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

  // PATCH /api/v1/variants/:id/inventory - Update inventory
  fastify.patch<{ Params: { id: string }; Body: inventoryService.UpdateInventoryRequest }>(
    '/variants/:id/inventory',
    { preHandler: [requireAuth, requireAdmin] },
    async (request, reply) => {
      try {
        const inventory = await inventoryService.updateInventory(request.params.id, request.body)
        return reply.send({
          success: true,
          data: inventory
        })
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to update inventory'
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

  // GET /api/v1/inventory/low-stock - Get low stock alerts
  fastify.get(
    '/inventory/low-stock',
    { preHandler: [requireAuth, requireAdmin] },
    async (request, reply) => {
      try {
        const lowStockItems = await inventoryService.getLowStockVariants()
        return reply.send({
          success: true,
          data: { items: lowStockItems }
        })
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to fetch low stock items'
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

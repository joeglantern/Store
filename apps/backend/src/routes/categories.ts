import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify'
import { requireAuth, requireAdmin } from '../middleware/auth.js'
import * as categoryService from '../services/category.service.js'

/**
 * Register category routes
 */
export async function categoryRoutes(fastify: FastifyInstance) {
  // Public routes

  // GET /api/v1/categories - List all categories (hierarchical)
  fastify.get('/categories', async (request, reply) => {
    try {
      const categories = await categoryService.getCategories()
      return reply.send({
        success: true,
        data: { categories }
      })
    } catch (error) {
      request.log.error(error)
      return reply.code(500).send({
        success: false,
        error: {
          code: 'INTERNAL_SERVER_ERROR',
          message: error instanceof Error ? error.message : 'Failed to fetch categories'
        }
      })
    }
  })

  // GET /api/v1/categories/:id - Get single category
  fastify.get<{ Params: { id: string } }>('/categories/:id', async (request, reply) => {
    try {
      const category = await categoryService.getCategoryById(request.params.id)
      return reply.send({
        success: true,
        data: category
      })
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to fetch category'
      const statusCode = message === 'Category not found' ? 404 : 500
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

  // POST /api/v1/categories - Create category
  fastify.post<{ Body: categoryService.CreateCategoryRequest }>(
    '/categories',
    { preHandler: [requireAuth, requireAdmin] },
    async (request, reply) => {
      try {
        const category = await categoryService.createCategory(request.body)
        return reply.code(201).send({
          success: true,
          data: category
        })
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to create category'
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

  // PUT /api/v1/categories/:id - Update category
  fastify.put<{ Params: { id: string }; Body: categoryService.UpdateCategoryRequest }>(
    '/categories/:id',
    { preHandler: [requireAuth, requireAdmin] },
    async (request, reply) => {
      try {
        const category = await categoryService.updateCategory(request.params.id, request.body)
        return reply.send({
          success: true,
          data: category
        })
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to update category'
        let statusCode = 500
        if (message === 'Category not found') statusCode = 404
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

  // DELETE /api/v1/categories/:id - Delete category
  fastify.delete<{ Params: { id: string } }>(
    '/categories/:id',
    { preHandler: [requireAuth, requireAdmin] },
    async (request, reply) => {
      try {
        await categoryService.deleteCategory(request.params.id)
        return reply.send({
          success: true,
          message: 'Category deleted successfully'
        })
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to delete category'
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

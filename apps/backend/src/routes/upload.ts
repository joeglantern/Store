import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify'
import { requireAuth, requireAdmin } from '../middleware/auth.js'
import * as storageService from '../services/storage.service.js'

/**
 * Register upload routes
 */
export async function uploadRoutes(fastify: FastifyInstance) {
  // POST /api/v1/upload/product-image - Upload single product image
  fastify.post(
    '/upload/product-image',
    { preHandler: [requireAuth, requireAdmin] },
    async (request, reply) => {
      try {
        const data = await request.file()

        if (!data) {
          return reply.code(400).send({
            success: false,
            error: {
              code: 'VALIDATION_ERROR',
              message: 'No file uploaded'
            }
          })
        }

        // Convert stream to buffer
        const buffer = await data.toBuffer()

        const file = {
          filename: data.filename,
          mimetype: data.mimetype,
          data: buffer,
          size: buffer.length
        }

        const result = await storageService.uploadProductImage(file)

        return reply.send({
          success: true,
          data: result
        })
      } catch (error) {
        request.log.error(error)
        const message = error instanceof Error ? error.message : 'Failed to upload image'
        return reply.code(400).send({
          success: false,
          error: {
            code: 'UPLOAD_ERROR',
            message
          }
        })
      }
    }
  )

  // POST /api/v1/upload/product-images - Upload multiple product images
  fastify.post(
    '/upload/product-images',
    { preHandler: [requireAuth, requireAdmin] },
    async (request, reply) => {
      try {
        const files = []
        const parts = request.parts()

        for await (const part of parts) {
          if (part.type === 'file') {
            const buffer = await part.toBuffer()
            files.push({
              filename: part.filename,
              mimetype: part.mimetype,
              data: buffer,
              size: buffer.length
            })
          }
        }

        if (files.length === 0) {
          return reply.code(400).send({
            success: false,
            error: {
              code: 'VALIDATION_ERROR',
              message: 'No files uploaded'
            }
          })
        }

        const result = await storageService.uploadMultipleImages(files)

        return reply.send({
          success: true,
          data: result
        })
      } catch (error) {
        request.log.error(error)
        const message = error instanceof Error ? error.message : 'Failed to upload images'
        return reply.code(400).send({
          success: false,
          error: {
            code: 'UPLOAD_ERROR',
            message
          }
        })
      }
    }
  )

  // POST /api/v1/products/:id/images - Add image to product
  fastify.post<{
    Params: { id: string }
    Body: { image_url: string; alt_text?: string; display_order?: number }
  }>(
    '/products/:id/images',
    { preHandler: [requireAuth, requireAdmin] },
    async (request, reply) => {
      try {
        const { image_url, alt_text, display_order } = request.body

        if (!image_url) {
          return reply.code(400).send({
            success: false,
            error: {
              code: 'VALIDATION_ERROR',
              message: 'image_url is required'
            }
          })
        }

        const image = await storageService.addProductImage(
          request.params.id,
          image_url,
          alt_text,
          display_order
        )

        return reply.code(201).send({
          success: true,
          data: image
        })
      } catch (error) {
        request.log.error(error)
        const message = error instanceof Error ? error.message : 'Failed to add product image'
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

  // DELETE /api/v1/product-images/:id - Delete product image
  fastify.delete<{ Params: { id: string } }>(
    '/product-images/:id',
    { preHandler: [requireAuth, requireAdmin] },
    async (request, reply) => {
      try {
        await storageService.deleteProductImage(request.params.id)

        return reply.send({
          success: true,
          message: 'Product image deleted successfully'
        })
      } catch (error) {
        request.log.error(error)
        const message = error instanceof Error ? error.message : 'Failed to delete product image'
        const statusCode = message === 'Image not found' ? 404 : 500

        return reply.code(statusCode).send({
          success: false,
          error: {
            code: statusCode === 404 ? 'NOT_FOUND' : 'INTERNAL_SERVER_ERROR',
            message
          }
        })
      }
    }
  )
}

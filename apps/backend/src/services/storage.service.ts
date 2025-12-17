import { supabase } from '../lib/supabase.js'
import crypto from 'crypto'

const BUCKET_NAME = 'product-images'
const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg']

/**
 * Initialize storage bucket (should be run once during setup)
 */
export async function initializeStorageBucket() {
  try {
    // Check if bucket exists
    const { data: buckets } = await supabase.storage.listBuckets()
    const bucketExists = buckets?.some(b => b.name === BUCKET_NAME)

    if (!bucketExists) {
      // Create bucket
      await supabase.storage.createBucket(BUCKET_NAME, {
        public: true,
        fileSizeLimit: MAX_FILE_SIZE
      })
      console.log(`✅ Storage bucket '${BUCKET_NAME}' created`)
    }
  } catch (error) {
    console.error('Failed to initialize storage bucket:', error)
  }
}

/**
 * Validate image file
 */
function validateImageFile(file: any): { valid: boolean; error?: string } {
  if (!file) {
    return { valid: false, error: 'No file provided' }
  }

  // Check file type
  if (!ALLOWED_TYPES.includes(file.mimetype)) {
    return {
      valid: false,
      error: `Invalid file type. Allowed: ${ALLOWED_TYPES.join(', ')}`
    }
  }

  // Check file size (if available)
  if (file.size && file.size > MAX_FILE_SIZE) {
    return {
      valid: false,
      error: `File too large. Maximum size: ${MAX_FILE_SIZE / 1024 / 1024}MB`
    }
  }

  return { valid: true }
}

/**
 * Generate unique filename
 */
function generateFilename(originalFilename: string): string {
  const timestamp = Date.now()
  const randomString = crypto.randomBytes(8).toString('hex')
  const extension = originalFilename.split('.').pop()
  return `${timestamp}-${randomString}.${extension}`
}

/**
 * Upload product image to Supabase Storage
 */
export async function uploadProductImage(file: any) {
  // Validate file
  const validation = validateImageFile(file)
  if (!validation.valid) {
    throw new Error(validation.error)
  }

  // Generate unique filename
  const filename = generateFilename(file.filename)
  const filepath = `products/${filename}`

  // Upload to Supabase Storage
  const { data, error } = await supabase.storage
    .from(BUCKET_NAME)
    .upload(filepath, file.data, {
      contentType: file.mimetype,
      cacheControl: '3600',
      upsert: false
    })

  if (error) {
    throw new Error(`Failed to upload image: ${error.message}`)
  }

  // Get public URL
  const { data: { publicUrl } } = supabase.storage
    .from(BUCKET_NAME)
    .getPublicUrl(filepath)

  return {
    filename,
    filepath,
    url: publicUrl,
    size: file.size,
    mimetype: file.mimetype
  }
}

/**
 * Delete image from Supabase Storage
 */
export async function deleteImage(filepath: string) {
  const { error } = await supabase.storage
    .from(BUCKET_NAME)
    .remove([filepath])

  if (error) {
    throw new Error(`Failed to delete image: ${error.message}`)
  }

  return { success: true }
}

/**
 * Upload multiple product images
 */
export async function uploadMultipleImages(files: any[]) {
  const uploadedImages = []
  const errors = []

  for (const file of files) {
    try {
      const result = await uploadProductImage(file)
      uploadedImages.push(result)
    } catch (error) {
      errors.push({
        filename: file.filename,
        error: error instanceof Error ? error.message : 'Upload failed'
      })
    }
  }

  return {
    uploaded: uploadedImages,
    errors: errors.length > 0 ? errors : undefined
  }
}

/**
 * Add uploaded image to product_images table
 */
export async function addProductImage(productId: string, imageUrl: string, altText?: string, displayOrder?: number) {
  const { data, error } = await supabase
    .from('product_images')
    .insert({
      product_id: productId,
      image_url: imageUrl,
      alt_text: altText || null,
      display_order: displayOrder ?? 0
    })
    .select()
    .single()

  if (error) {
    throw new Error(`Failed to add product image: ${error.message}`)
  }

  return data
}

/**
 * Delete product image from database and storage
 */
export async function deleteProductImage(imageId: string) {
  // Get image info
  const { data: image, error: fetchError } = await supabase
    .from('product_images')
    .select('image_url')
    .eq('id', imageId)
    .single()

  if (fetchError) {
    throw new Error('Image not found')
  }

  // Extract filepath from URL
  const urlParts = image.image_url.split('/')
  const filepath = urlParts.slice(-2).join('/') // Get last two parts (products/filename)

  // Delete from storage
  await deleteImage(filepath)

  // Delete from database
  const { error: deleteError } = await supabase
    .from('product_images')
    .delete()
    .eq('id', imageId)

  if (deleteError) {
    throw new Error(`Failed to delete product image: ${deleteError.message}`)
  }

  return { success: true }
}

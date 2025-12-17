import { supabase } from '../lib/supabase.js'
import type { Variant, VariantWithInventory } from '../types/product.types.js'

export interface CreateVariantRequest {
  product_id: string
  sku: string
  name: string
  attributes: Record<string, any>
  price_adjustment?: number
  image_url?: string
  is_active?: boolean
  initial_quantity?: number
  low_stock_threshold?: number
}

export interface UpdateVariantRequest {
  sku?: string
  name?: string
  attributes?: Record<string, any>
  price_adjustment?: number
  image_url?: string
  is_active?: boolean
}

/**
 * Get variants for a product
 */
export async function getProductVariants(productId: string) {
  const { data, error } = await supabase
    .from('variants')
    .select(`
      *,
      inventory(quantity, reserved, low_stock_threshold)
    `)
    .eq('product_id', productId)
    .eq('is_active', true)
    .order('name', { ascending: true })

  if (error) {
    throw new Error(`Failed to fetch variants: ${error.message}`)
  }

  // Calculate available stock
  const variants = (data as any[]).map(variant => ({
    ...variant,
    inventory: variant.inventory ? {
      ...variant.inventory,
      available: variant.inventory.quantity - variant.inventory.reserved
    } : null
  }))

  return variants as VariantWithInventory[]
}

/**
 * Get single variant by ID
 */
export async function getVariantById(id: string) {
  const { data, error } = await supabase
    .from('variants')
    .select(`
      *,
      inventory(quantity, reserved, low_stock_threshold)
    `)
    .eq('id', id)
    .single()

  if (error) {
    if (error.code === 'PGRST116') {
      throw new Error('Variant not found')
    }
    throw new Error(`Failed to fetch variant: ${error.message}`)
  }

  return data as VariantWithInventory
}

/**
 * Create new variant (Admin only)
 */
export async function createVariant(variantData: CreateVariantRequest) {
  const { initial_quantity, low_stock_threshold, ...variantFields } = variantData

  // Create variant
  const { data: variant, error: variantError } = await supabase
    .from('variants')
    .insert({
      ...variantFields,
      is_active: variantFields.is_active ?? true,
      price_adjustment: variantFields.price_adjustment ?? 0
    })
    .select()
    .single()

  if (variantError) {
    if (variantError.code === '23505') {
      throw new Error('Variant SKU already exists')
    }
    throw new Error(`Failed to create variant: ${variantError.message}`)
  }

  // Create inventory record
  const { error: inventoryError } = await supabase
    .from('inventory')
    .insert({
      variant_id: variant.id,
      quantity: initial_quantity ?? 0,
      reserved: 0,
      low_stock_threshold: low_stock_threshold ?? 10
    })

  if (inventoryError) {
    // Rollback: delete variant if inventory creation fails
    await supabase.from('variants').delete().eq('id', variant.id)
    throw new Error(`Failed to create inventory: ${inventoryError.message}`)
  }

  return variant as Variant
}

/**
 * Update variant (Admin only)
 */
export async function updateVariant(id: string, variantData: UpdateVariantRequest) {
  const { data, error } = await supabase
    .from('variants')
    .update(variantData)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    if (error.code === 'PGRST116') {
      throw new Error('Variant not found')
    }
    if (error.code === '23505') {
      throw new Error('Variant SKU already exists')
    }
    throw new Error(`Failed to update variant: ${error.message}`)
  }

  return data as Variant
}

/**
 * Delete variant (Admin only)
 */
export async function deleteVariant(id: string) {
  const { error } = await supabase
    .from('variants')
    .delete()
    .eq('id', id)

  if (error) {
    throw new Error(`Failed to delete variant: ${error.message}`)
  }

  return { success: true }
}

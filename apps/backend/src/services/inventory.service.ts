import { supabase } from '../lib/supabase.js'

export interface UpdateInventoryRequest {
  quantity: number
  low_stock_threshold?: number
}

/**
 * Update inventory quantity (Admin only)
 * Uses database function to ensure consistency
 */
export async function updateInventory(variantId: string, data: UpdateInventoryRequest) {
  const updateData: any = {}

  if (data.quantity !== undefined) {
    updateData.quantity = data.quantity
  }

  if (data.low_stock_threshold !== undefined) {
    updateData.low_stock_threshold = data.low_stock_threshold
  }

  const { data: inventory, error } = await supabase
    .from('inventory')
    .update(updateData)
    .eq('variant_id', variantId)
    .select(`
      *,
      variant:variants(id, product_id, name)
    `)
    .single()

  if (error) {
    throw new Error(`Failed to update inventory: ${error.message}`)
  }

  // Calculate available stock
  const available = inventory.quantity - inventory.reserved

  return {
    ...inventory,
    available
  }
}

/**
 * Get available stock for a variant
 */
export async function getAvailableStock(variantId: string): Promise<number> {
  const { data, error } = await supabase
    .rpc('get_available_stock', { variant_uuid: variantId })

  if (error) {
    throw new Error(`Failed to get available stock: ${error.message}`)
  }

  return data as number
}

/**
 * Reserve inventory during checkout
 */
export async function reserveInventory(variantId: string, quantity: number): Promise<boolean> {
  const { data, error } = await supabase
    .rpc('reserve_inventory', {
      variant_uuid: variantId,
      reserve_qty: quantity
    })

  if (error) {
    throw new Error(`Failed to reserve inventory: ${error.message}`)
  }

  return data as boolean
}

/**
 * Release inventory (e.g., when checkout fails)
 */
export async function releaseInventory(variantId: string, quantity: number): Promise<void> {
  const { error } = await supabase
    .rpc('release_inventory', {
      variant_uuid: variantId,
      release_qty: quantity
    })

  if (error) {
    throw new Error(`Failed to release inventory: ${error.message}`)
  }
}

/**
 * Commit inventory (after payment success)
 */
export async function commitInventory(variantId: string, quantity: number): Promise<void> {
  const { error } = await supabase
    .rpc('commit_inventory', {
      variant_uuid: variantId,
      commit_qty: quantity
    })

  if (error) {
    throw new Error(`Failed to commit inventory: ${error.message}`)
  }
}

/**
 * Get low stock variants (for admin alerts)
 */
export async function getLowStockVariants() {
  const { data, error } = await supabase
    .from('inventory')
    .select(`
      *,
      variant:variants(
        id,
        name,
        sku,
        product:products(id, name)
      )
    `)
    .lte('quantity', supabase.rpc('low_stock_threshold'))

  if (error) {
    throw new Error(`Failed to fetch low stock variants: ${error.message}`)
  }

  return data.map(inv => ({
    ...inv,
    available: inv.quantity - inv.reserved
  }))
}

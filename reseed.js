/**
 * Clear and reseed database with image data
 */

import { createClient } from '@supabase/supabase-js'
import { execSync } from 'child_process'

const supabase = createClient(
  process.env.SUPABASE_URL || 'https://dskaabnhmnviqeabcstn.supabase.co',
  process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRza2FhYm5obW52aXFlYWJjc3RuIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NTgxOTI5MywiZXhwIjoyMDgxMzk1MjkzfQ.btR2Jd7Eycilx0Qo16q0vXFnQ9VR9N8lx0B2ORQcLkU'
)

async function reseed() {
  console.log('🧹 Clearing existing data...\n')

  // Delete in reverse dependency order
  await supabase.from('inventory').delete().neq('id', '00000000-0000-0000-0000-000000000000')
  await supabase.from('variants').delete().neq('id', '00000000-0000-0000-0000-000000000000')
  await supabase.from('product_images').delete().neq('id', '00000000-0000-0000-0000-000000000000')
  await supabase.from('products').delete().neq('id', '00000000-0000-0000-0000-000000000000')
  await supabase.from('categories').delete().neq('id', '00000000-0000-0000-0000-000000000000')

  console.log('✅ Cleared all data\n')
  console.log('🌱 Re-seeding with images...\n')

  // Run the seed script
  execSync('node seed-direct.js', { stdio: 'inherit' })
}

reseed().catch(console.error)

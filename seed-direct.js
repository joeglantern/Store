/**
 * Direct Database Seeding Script
 * Seeds data directly to Supabase, bypassing the API
 */

import { createClient } from '@supabase/supabase-js'
import 'dotenv/config'

// Initialize Supabase client with service role key (bypasses RLS)
const supabase = createClient(
  process.env.SUPABASE_URL || 'https://dskaabnhmnviqeabcstn.supabase.co',
  process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRza2FhYm5obW52aXFlYWJjc3RuIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NTgxOTI5MywiZXhwIjoyMDgxMzk1MjkzfQ.btR2Jd7Eycilx0Qo16q0vXFnQ9VR9N8lx0B2ORQcLkU'
)

console.log('🌱 Starting direct database seeding...\n')

// Categories data
const categories = [
  {
    name: "Men's Fashion",
    slug: 'mens-fashion',
    description: 'Clothing and accessories for men',
    is_active: true,
    display_order: 1
  },
  {
    name: "Women's Fashion",
    slug: 'womens-fashion',
    description: 'Clothing and accessories for women',
    is_active: true,
    display_order: 2
  },
  {
    name: 'Electronics',
    slug: 'electronics',
    description: 'Tech gadgets and electronics',
    is_active: true,
    display_order: 3
  },
  {
    name: 'Home & Living',
    slug: 'home-living',
    description: 'Home decor and living essentials',
    is_active: true,
    display_order: 4
  },
  {
    name: 'Sports & Outdoors',
    slug: 'sports-outdoors',
    description: 'Fitness and outdoor equipment',
    is_active: true,
    display_order: 5
  }
]

// Products data
const products = [
  // Men's Fashion
  {
    name: 'Classic Cotton T-Shirt',
    slug: 'classic-cotton-tshirt',
    description: 'Comfortable 100% cotton t-shirt, perfect for everyday wear. Soft, breathable fabric ideal for daily use. Pre-shrunk and machine washable.',
    category_slug: 'mens-fashion',
    base_price: 19.99,
    brand: 'ComfortWear',
    is_active: true,
    is_featured: true,
    specs: {
      material: '100% Cotton',
      fit: 'Regular Fit',
      care: 'Machine wash cold, tumble dry low',
      origin: 'Made in USA',
      weight: '5.3 oz'
    },
    images: [
      { url: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&h=800&fit=crop', alt: 'Black cotton t-shirt front view', display_order: 1 },
      { url: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800&h=800&fit=crop', alt: 'White cotton t-shirt', display_order: 2 },
      { url: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=800&h=800&fit=crop', alt: 'T-shirt detail', display_order: 3 }
    ],
    variants: [
      { name: 'Small / Black', sku: 'TSH-BLK-S', attributes: { size: 'S', color: 'Black' }, price_adjustment: 0, quantity: 100 },
      { name: 'Medium / Black', sku: 'TSH-BLK-M', attributes: { size: 'M', color: 'Black' }, price_adjustment: 0, quantity: 150 },
      { name: 'Large / Black', sku: 'TSH-BLK-L', attributes: { size: 'L', color: 'Black' }, price_adjustment: 0, quantity: 120 },
      { name: 'Small / White', sku: 'TSH-WHT-S', attributes: { size: 'S', color: 'White' }, price_adjustment: 0, quantity: 80 },
      { name: 'Medium / White', sku: 'TSH-WHT-M', attributes: { size: 'M', color: 'White' }, price_adjustment: 0, quantity: 130 },
      { name: 'Large / White', sku: 'TSH-WHT-L', attributes: { size: 'L', color: 'White' }, price_adjustment: 0, quantity: 110 }
    ]
  },
  {
    name: 'Slim Fit Denim Jeans',
    slug: 'slim-fit-denim-jeans',
    description: 'Modern slim fit jeans with stretch comfort',
    category_slug: 'mens-fashion',
    base_price: 59.99,
    brand: 'DenimCo',
    is_active: true,
    is_featured: false,
    images: [
      { url: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=800&h=800&fit=crop', alt: 'Blue denim jeans', display_order: 1 },
      { url: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=800&h=800&fit=crop', alt: 'Jeans side view', display_order: 2 }
    ],
    variants: [
      { name: '30x30 / Blue', sku: 'JNS-BLU-3030', attributes: { waist: '30', length: '30', color: 'Blue' }, price_adjustment: 0, quantity: 50 },
      { name: '32x32 / Blue', sku: 'JNS-BLU-3232', attributes: { waist: '32', length: '32', color: 'Blue' }, price_adjustment: 0, quantity: 70 },
      { name: '34x32 / Blue', sku: 'JNS-BLU-3432', attributes: { waist: '34', length: '32', color: 'Blue' }, price_adjustment: 0, quantity: 60 },
      { name: '32x32 / Black', sku: 'JNS-BLK-3232', attributes: { waist: '32', length: '32', color: 'Black' }, price_adjustment: 5, quantity: 55 }
    ]
  },

  // Women's Fashion
  {
    name: 'Floral Summer Dress',
    slug: 'floral-summer-dress',
    description: 'Light and breezy summer dress with floral print',
    category_slug: 'womens-fashion',
    base_price: 49.99,
    brand: 'FloraFashion',
    is_active: true,
    is_featured: true,
    images: [
      { url: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=800&h=800&fit=crop', alt: 'Floral summer dress', display_order: 1 },
      { url: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&h=800&fit=crop', alt: 'Dress detail view', display_order: 2 }
    ],
    variants: [
      { name: 'XS / Floral Blue', sku: 'DRS-FLR-XS', attributes: { size: 'XS', pattern: 'Floral Blue' }, price_adjustment: 0, quantity: 40 },
      { name: 'Small / Floral Blue', sku: 'DRS-FLR-S', attributes: { size: 'S', pattern: 'Floral Blue' }, price_adjustment: 0, quantity: 65 },
      { name: 'Medium / Floral Blue', sku: 'DRS-FLR-M', attributes: { size: 'M', pattern: 'Floral Blue' }, price_adjustment: 0, quantity: 70 },
      { name: 'Large / Floral Blue', sku: 'DRS-FLR-L', attributes: { size: 'L', pattern: 'Floral Blue' }, price_adjustment: 0, quantity: 50 }
    ]
  },
  {
    name: 'Yoga Leggings - High Waist',
    slug: 'yoga-leggings-high-waist',
    description: 'Stretchy high-waisted leggings for yoga and fitness',
    category_slug: 'womens-fashion',
    base_price: 34.99,
    brand: 'ActiveFit',
    is_active: true,
    is_featured: false,
    images: [
      { url: 'https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=800&h=800&fit=crop', alt: 'Black yoga leggings', display_order: 1 },
      { url: 'https://images.unsplash.com/photo-1556906781-9a412961c28c?w=800&h=800&fit=crop', alt: 'Leggings in use', display_order: 2 }
    ],
    variants: [
      { name: 'XS / Black', sku: 'LEG-BLK-XS', attributes: { size: 'XS', color: 'Black' }, price_adjustment: 0, quantity: 60 },
      { name: 'Small / Black', sku: 'LEG-BLK-S', attributes: { size: 'S', color: 'Black' }, price_adjustment: 0, quantity: 90 },
      { name: 'Medium / Black', sku: 'LEG-BLK-M', attributes: { size: 'M', color: 'Black' }, price_adjustment: 0, quantity: 85 },
      { name: 'Small / Navy', sku: 'LEG-NAV-S', attributes: { size: 'S', color: 'Navy' }, price_adjustment: 2, quantity: 45 }
    ]
  },

  // Electronics
  {
    name: 'Wireless Bluetooth Headphones',
    slug: 'wireless-bluetooth-headphones',
    description: 'Premium noise-cancelling headphones with 30-hour battery',
    category_slug: 'electronics',
    base_price: 149.99,
    brand: 'SoundMax',
    is_active: true,
    is_featured: true,
    images: [
      { url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&h=800&fit=crop', alt: 'Black wireless headphones', display_order: 1 },
      { url: 'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=800&h=800&fit=crop', alt: 'Headphones detail', display_order: 2 }
    ],
    variants: [
      { name: 'Black', sku: 'HDP-BLK-01', attributes: { color: 'Black' }, price_adjustment: 0, quantity: 30 },
      { name: 'Silver', sku: 'HDP-SLV-01', attributes: { color: 'Silver' }, price_adjustment: 10, quantity: 25 },
      { name: 'Rose Gold', sku: 'HDP-RSG-01', attributes: { color: 'Rose Gold' }, price_adjustment: 15, quantity: 20 }
    ]
  },
  {
    name: 'Smart Fitness Watch',
    slug: 'smart-fitness-watch',
    description: 'Track your fitness goals with heart rate and GPS',
    category_slug: 'electronics',
    base_price: 199.99,
    brand: 'FitTech',
    is_active: true,
    is_featured: true,
    images: [
      { url: 'https://images.unsplash.com/photo-1544117519-31a4b719223d?w=800&h=800&fit=crop', alt: 'Black fitness watch', display_order: 1 },
      { url: 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=800&h=800&fit=crop', alt: 'Watch in use', display_order: 2 }
    ],
    variants: [
      { name: 'Black / 42mm', sku: 'FWT-BLK-42', attributes: { color: 'Black', size: '42mm' }, price_adjustment: 0, quantity: 45 },
      { name: 'Silver / 42mm', sku: 'FWT-SLV-42', attributes: { color: 'Silver', size: '42mm' }, price_adjustment: 0, quantity: 40 },
      { name: 'Black / 46mm', sku: 'FWT-BLK-46', attributes: { color: 'Black', size: '46mm' }, price_adjustment: 20, quantity: 35 }
    ]
  },

  // Home & Living
  {
    name: 'Memory Foam Pillow Set',
    slug: 'memory-foam-pillow-set',
    description: 'Set of 2 ergonomic memory foam pillows',
    category_slug: 'home-living',
    base_price: 79.99,
    brand: 'DreamComfort',
    is_active: true,
    is_featured: false,
    images: [
      { url: 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=800&h=800&fit=crop', alt: 'Memory foam pillows', display_order: 1 },
      { url: 'https://images.unsplash.com/photo-1631049307197-70e050085fbc?w=800&h=800&fit=crop', alt: 'Pillow on bed', display_order: 2 }
    ],
    variants: [
      { name: 'Standard / White', sku: 'PIL-WHT-STD', attributes: { size: 'Standard', color: 'White' }, price_adjustment: 0, quantity: 100 },
      { name: 'Queen / White', sku: 'PIL-WHT-QN', attributes: { size: 'Queen', color: 'White' }, price_adjustment: 10, quantity: 80 },
      { name: 'King / White', sku: 'PIL-WHT-KG', attributes: { size: 'King', color: 'White' }, price_adjustment: 20, quantity: 60 }
    ]
  },

  // Sports & Outdoors
  {
    name: 'Yoga Mat - Extra Thick',
    slug: 'yoga-mat-extra-thick',
    description: '10mm thick yoga mat with carrying strap',
    category_slug: 'sports-outdoors',
    base_price: 39.99,
    brand: 'ZenFit',
    is_active: true,
    is_featured: false,
    images: [
      { url: 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=800&h=800&fit=crop', alt: 'Purple yoga mat', display_order: 1 },
      { url: 'https://images.unsplash.com/photo-1592432678016-e910b452e0a0?w=800&h=800&fit=crop', alt: 'Yoga mat in use', display_order: 2 }
    ],
    variants: [
      { name: 'Purple', sku: 'YGM-PRP-01', attributes: { color: 'Purple' }, price_adjustment: 0, quantity: 70 },
      { name: 'Blue', sku: 'YGM-BLU-01', attributes: { color: 'Blue' }, price_adjustment: 0, quantity: 65 },
      { name: 'Pink', sku: 'YGM-PNK-01', attributes: { color: 'Pink' }, price_adjustment: 0, quantity: 60 }
    ]
  }
]

async function seed() {
  try {
    // 1. Insert categories
    console.log('📁 Creating categories...')
    const { data: insertedCategories, error: catError } = await supabase
      .from('categories')
      .insert(categories)
      .select()

    if (catError) {
      console.error('   ❌ Categories error:', catError)
      throw catError
    }

    console.log(`   ✅ Created ${insertedCategories.length} categories\n`)

    // Create category lookup map
    const categoryMap = {}
    insertedCategories.forEach(cat => {
      categoryMap[cat.slug] = cat.id
    })

    // 2. Insert products and variants
    console.log('📦 Creating products and variants...\n')
    let totalProducts = 0
    let totalVariants = 0

    for (const productData of products) {
      const { variants, category_slug, images, ...productFields } = productData

      // Insert product
      const { data: product, error: prodError } = await supabase
        .from('products')
        .insert({
          ...productFields,
          category_id: categoryMap[category_slug]
        })
        .select()
        .single()

      if (prodError) {
        console.error(`   ❌ Product error (${productData.name}):`, prodError)
        continue
      }

      console.log(`   ✅ Created: ${product.name}`)
      totalProducts++

      // Insert product images if any
      if (images && images.length > 0) {
        const imagesToInsert = images.map(img => ({
          product_id: product.id,
          image_url: img.url,
          alt_text: img.alt,
          display_order: img.display_order
        }))

        const { error: imgError } = await supabase
          .from('product_images')
          .insert(imagesToInsert)

        if (imgError) {
          console.error(`      ❌ Images error:`, imgError)
        } else {
          console.log(`      → ${images.length} images added`)
        }
      }

      // Insert variants
      const variantsToInsert = variants.map(v => ({
        product_id: product.id,
        name: v.name,
        sku: v.sku,
        attributes: v.attributes,
        price_adjustment: v.price_adjustment,
        is_active: true
      }))

      const { data: insertedVariants, error: varError } = await supabase
        .from('variants')
        .insert(variantsToInsert)
        .select()

      if (varError) {
        console.error(`      ❌ Variants error:`, varError)
        continue
      }

      // Insert inventory for each variant
      const inventoryToInsert = insertedVariants.map((variant, index) => ({
        variant_id: variant.id,
        quantity: variants[index].quantity,
        reserved: 0,
        low_stock_threshold: 10
      }))

      const { error: invError } = await supabase
        .from('inventory')
        .insert(inventoryToInsert)

      if (invError) {
        console.error(`      ❌ Inventory error:`, invError)
        continue
      }

      console.log(`      → ${insertedVariants.length} variants with inventory`)
      totalVariants += insertedVariants.length
    }

    console.log('\n==================================================')
    console.log('🎉 Seeding Complete!')
    console.log('')
    console.log(`📁 Categories created: ${insertedCategories.length}`)
    console.log(`📦 Products created: ${totalProducts}`)
    console.log(`🏷️  Variants created: ${totalVariants}`)
    console.log('==================================================\n')
    console.log('🌐 Visit http://localhost:3000 to see your store!')

  } catch (error) {
    console.error('\n❌ Seeding failed:', error)
    process.exit(1)
  }
}

seed()

/**
 * Mock Product Data Seeder
 *
 * This script populates the database with realistic mock products.
 *
 * Usage:
 * 1. Ensure backend is running: cd apps/backend && pnpm dev
 * 2. Run this script: node seed-data.js
 */

const API_URL = 'http://localhost:4000/api';

// Mock categories
const categories = [
  {
    name: "Men's Fashion",
    slug: "mens-fashion",
    description: "Stylish clothing and accessories for men"
  },
  {
    name: "Women's Fashion",
    slug: "womens-fashion",
    description: "Trendy apparel and accessories for women"
  },
  {
    name: "Electronics",
    slug: "electronics",
    description: "Latest gadgets and electronic devices"
  },
  {
    name: "Home & Living",
    slug: "home-living",
    description: "Furniture, decor, and home essentials"
  },
  {
    name: "Sports & Outdoors",
    slug: "sports-outdoors",
    description: "Equipment and gear for active lifestyles"
  }
];

// Mock products with realistic data
const products = [
  // Men's Fashion
  {
    name: "Classic Cotton T-Shirt",
    slug: "classic-cotton-tshirt",
    description: "Premium quality 100% cotton t-shirt. Soft, breathable, and perfect for everyday wear. Pre-shrunk fabric ensures lasting fit.",
    brand: "Urban Basics",
    base_price: 29.99,
    category_slug: "mens-fashion",
    variants: [
      { name: "Small / Black", sku: "TSHIRT-S-BLK", price_adjustment: 0, quantity: 50 },
      { name: "Medium / Black", sku: "TSHIRT-M-BLK", price_adjustment: 0, quantity: 75 },
      { name: "Large / Black", sku: "TSHIRT-L-BLK", price_adjustment: 0, quantity: 60 },
      { name: "Small / White", sku: "TSHIRT-S-WHT", price_adjustment: 0, quantity: 45 },
      { name: "Medium / White", sku: "TSHIRT-M-WHT", price_adjustment: 0, quantity: 80 },
      { name: "Large / White", sku: "TSHIRT-L-WHT", price_adjustment: 0, quantity: 55 },
      { name: "Small / Navy", sku: "TSHIRT-S-NVY", price_adjustment: 0, quantity: 40 },
      { name: "Medium / Navy", sku: "TSHIRT-M-NVY", price_adjustment: 0, quantity: 70 },
      { name: "Large / Navy", sku: "TSHIRT-L-NVY", price_adjustment: 0, quantity: 50 }
    ]
  },
  {
    name: "Slim Fit Denim Jeans",
    slug: "slim-fit-denim-jeans",
    description: "Modern slim fit jeans crafted from premium stretch denim. Features classic 5-pocket styling and subtle distressing for a contemporary look.",
    brand: "Denim Co.",
    base_price: 79.99,
    category_slug: "mens-fashion",
    variants: [
      { name: "30x30 / Dark Wash", sku: "JEANS-3030-DRK", price_adjustment: 0, quantity: 30 },
      { name: "32x30 / Dark Wash", sku: "JEANS-3230-DRK", price_adjustment: 0, quantity: 45 },
      { name: "32x32 / Dark Wash", sku: "JEANS-3232-DRK", price_adjustment: 0, quantity: 50 },
      { name: "34x32 / Dark Wash", sku: "JEANS-3432-DRK", price_adjustment: 0, quantity: 40 },
      { name: "32x30 / Light Wash", sku: "JEANS-3230-LGT", price_adjustment: 5, quantity: 35 },
      { name: "32x32 / Light Wash", sku: "JEANS-3232-LGT", price_adjustment: 5, quantity: 38 },
      { name: "34x32 / Light Wash", sku: "JEANS-3432-LGT", price_adjustment: 5, quantity: 32 }
    ]
  },
  {
    name: "Leather Casual Sneakers",
    slug: "leather-casual-sneakers",
    description: "Handcrafted genuine leather sneakers with cushioned insole. Perfect blend of style and comfort for everyday wear.",
    brand: "FootStyle",
    base_price: 89.99,
    category_slug: "mens-fashion",
    variants: [
      { name: "Size 8 / White", sku: "SNKR-8-WHT", price_adjustment: 0, quantity: 25 },
      { name: "Size 9 / White", sku: "SNKR-9-WHT", price_adjustment: 0, quantity: 35 },
      { name: "Size 10 / White", sku: "SNKR-10-WHT", price_adjustment: 0, quantity: 40 },
      { name: "Size 11 / White", sku: "SNKR-11-WHT", price_adjustment: 0, quantity: 30 },
      { name: "Size 8 / Black", sku: "SNKR-8-BLK", price_adjustment: 0, quantity: 28 },
      { name: "Size 9 / Black", sku: "SNKR-9-BLK", price_adjustment: 0, quantity: 38 },
      { name: "Size 10 / Black", sku: "SNKR-10-BLK", price_adjustment: 0, quantity: 42 },
      { name: "Size 11 / Black", sku: "SNKR-11-BLK", price_adjustment: 0, quantity: 32 }
    ]
  },

  // Women's Fashion
  {
    name: "Floral Summer Dress",
    slug: "floral-summer-dress",
    description: "Elegant floral print dress perfect for summer occasions. Lightweight fabric with flattering A-line silhouette and adjustable straps.",
    brand: "Bella Mode",
    base_price: 59.99,
    category_slug: "womens-fashion",
    variants: [
      { name: "XS / Pink Floral", sku: "DRESS-XS-PNK", price_adjustment: 0, quantity: 20 },
      { name: "S / Pink Floral", sku: "DRESS-S-PNK", price_adjustment: 0, quantity: 35 },
      { name: "M / Pink Floral", sku: "DRESS-M-PNK", price_adjustment: 0, quantity: 40 },
      { name: "L / Pink Floral", sku: "DRESS-L-PNK", price_adjustment: 0, quantity: 30 },
      { name: "XS / Blue Floral", sku: "DRESS-XS-BLU", price_adjustment: 0, quantity: 18 },
      { name: "S / Blue Floral", sku: "DRESS-S-BLU", price_adjustment: 0, quantity: 32 },
      { name: "M / Blue Floral", sku: "DRESS-M-BLU", price_adjustment: 0, quantity: 38 },
      { name: "L / Blue Floral", sku: "DRESS-L-BLU", price_adjustment: 0, quantity: 28 }
    ]
  },
  {
    name: "Yoga Leggings - High Waist",
    slug: "yoga-leggings-high-waist",
    description: "Ultra-comfortable high-waisted leggings with four-way stretch. Moisture-wicking fabric perfect for yoga, gym, or casual wear.",
    brand: "ActiveFit",
    base_price: 44.99,
    category_slug: "womens-fashion",
    variants: [
      { name: "XS / Black", sku: "YOGA-XS-BLK", price_adjustment: 0, quantity: 50 },
      { name: "S / Black", sku: "YOGA-S-BLK", price_adjustment: 0, quantity: 65 },
      { name: "M / Black", sku: "YOGA-M-BLK", price_adjustment: 0, quantity: 70 },
      { name: "L / Black", sku: "YOGA-L-BLK", price_adjustment: 0, quantity: 55 },
      { name: "S / Navy", sku: "YOGA-S-NVY", price_adjustment: 0, quantity: 45 },
      { name: "M / Navy", sku: "YOGA-M-NVY", price_adjustment: 0, quantity: 50 },
      { name: "L / Navy", sku: "YOGA-L-NVY", price_adjustment: 0, quantity: 40 }
    ]
  },

  // Electronics
  {
    name: "Wireless Bluetooth Headphones",
    slug: "wireless-bluetooth-headphones",
    description: "Premium noise-canceling headphones with 30-hour battery life. Superior sound quality with deep bass and crystal-clear highs. Includes carrying case.",
    brand: "SoundWave Pro",
    base_price: 149.99,
    category_slug: "electronics",
    variants: [
      { name: "Black / Standard", sku: "HEAD-BLK-STD", price_adjustment: 0, quantity: 45 },
      { name: "Silver / Standard", sku: "HEAD-SLV-STD", price_adjustment: 0, quantity: 35 },
      { name: "Black / Premium (with case)", sku: "HEAD-BLK-PRM", price_adjustment: 30, quantity: 25 },
      { name: "Silver / Premium (with case)", sku: "HEAD-SLV-PRM", price_adjustment: 30, quantity: 20 }
    ]
  },
  {
    name: "Smart Fitness Watch",
    slug: "smart-fitness-watch",
    description: "Advanced fitness tracker with heart rate monitor, GPS, sleep tracking, and 50+ sport modes. Water-resistant up to 50m. 7-day battery life.",
    brand: "TechFit",
    base_price: 199.99,
    category_slug: "electronics",
    variants: [
      { name: "Black / 42mm", sku: "WATCH-BLK-42", price_adjustment: 0, quantity: 40 },
      { name: "Silver / 42mm", sku: "WATCH-SLV-42", price_adjustment: 0, quantity: 35 },
      { name: "Rose Gold / 42mm", sku: "WATCH-RSG-42", price_adjustment: 10, quantity: 30 },
      { name: "Black / 46mm", sku: "WATCH-BLK-46", price_adjustment: 20, quantity: 25 },
      { name: "Silver / 46mm", sku: "WATCH-SLV-46", price_adjustment: 20, quantity: 22 }
    ]
  },
  {
    name: "Portable Power Bank 20000mAh",
    slug: "portable-power-bank-20000mah",
    description: "High-capacity power bank with dual USB ports and USB-C. Fast charging technology. LED battery indicator. Perfect for travel and emergencies.",
    brand: "ChargeMax",
    base_price: 39.99,
    category_slug: "electronics",
    variants: [
      { name: "Black / 20000mAh", sku: "PWR-BLK-20K", price_adjustment: 0, quantity: 80 },
      { name: "White / 20000mAh", sku: "PWR-WHT-20K", price_adjustment: 0, quantity: 70 },
      { name: "Black / 30000mAh", sku: "PWR-BLK-30K", price_adjustment: 15, quantity: 50 },
      { name: "White / 30000mAh", sku: "PWR-WHT-30K", price_adjustment: 15, quantity: 45 }
    ]
  },

  // Home & Living
  {
    name: "Memory Foam Pillow Set",
    slug: "memory-foam-pillow-set",
    description: "Premium memory foam pillows with cooling gel technology. Hypoallergenic bamboo cover. Pack of 2. Perfect neck and spine alignment.",
    brand: "DreamRest",
    base_price: 69.99,
    category_slug: "home-living",
    variants: [
      { name: "Standard / 2-Pack", sku: "PILLOW-STD-2", price_adjustment: 0, quantity: 60 },
      { name: "Queen / 2-Pack", sku: "PILLOW-QN-2", price_adjustment: 10, quantity: 55 },
      { name: "King / 2-Pack", sku: "PILLOW-KG-2", price_adjustment: 20, quantity: 40 }
    ]
  },
  {
    name: "Ceramic Coffee Mug Set",
    slug: "ceramic-coffee-mug-set",
    description: "Handcrafted ceramic mugs with modern design. Microwave and dishwasher safe. Set of 4. Perfect for coffee, tea, or hot chocolate.",
    brand: "HomeEssentials",
    base_price: 34.99,
    category_slug: "home-living",
    variants: [
      { name: "White / 4-Pack", sku: "MUG-WHT-4", price_adjustment: 0, quantity: 75 },
      { name: "Grey / 4-Pack", sku: "MUG-GRY-4", price_adjustment: 0, quantity: 65 },
      { name: "Mixed Colors / 4-Pack", sku: "MUG-MIX-4", price_adjustment: 5, quantity: 55 }
    ]
  },

  // Sports & Outdoors
  {
    name: "Yoga Mat - Extra Thick",
    slug: "yoga-mat-extra-thick",
    description: "Premium 8mm thick yoga mat with non-slip surface. Eco-friendly TPE material. Includes carrying strap. Perfect for yoga, pilates, and floor exercises.",
    brand: "ZenFlow",
    base_price: 39.99,
    category_slug: "sports-outdoors",
    variants: [
      { name: "Purple / 8mm", sku: "YMAT-PUR-8", price_adjustment: 0, quantity: 50 },
      { name: "Blue / 8mm", sku: "YMAT-BLU-8", price_adjustment: 0, quantity: 55 },
      { name: "Pink / 8mm", sku: "YMAT-PNK-8", price_adjustment: 0, quantity: 45 },
      { name: "Black / 8mm", sku: "YMAT-BLK-8", price_adjustment: 0, quantity: 60 }
    ]
  },
  {
    name: "Resistance Bands Set",
    slug: "resistance-bands-set",
    description: "Professional resistance band set with 5 different resistance levels. Includes door anchor, handles, and ankle straps. Perfect for home workouts.",
    brand: "FitPro",
    base_price: 29.99,
    category_slug: "sports-outdoors",
    variants: [
      { name: "Standard Set / 5 Bands", sku: "BAND-STD-5", price_adjustment: 0, quantity: 70 },
      { name: "Premium Set / 5 Bands + Accessories", sku: "BAND-PRM-5", price_adjustment: 15, quantity: 50 }
    ]
  },
  {
    name: "Camping Tent - 4 Person",
    slug: "camping-tent-4-person",
    description: "Spacious 4-person camping tent with waterproof rainfly. Easy setup with color-coded poles. Includes storage bag and stakes. Perfect for family camping trips.",
    brand: "OutdoorPro",
    base_price: 129.99,
    category_slug: "sports-outdoors",
    variants: [
      { name: "Green / 4-Person", sku: "TENT-GRN-4", price_adjustment: 0, quantity: 25 },
      { name: "Blue / 4-Person", sku: "TENT-BLU-4", price_adjustment: 0, quantity: 20 },
      { name: "Green / 6-Person", sku: "TENT-GRN-6", price_adjustment: 40, quantity: 15 },
      { name: "Blue / 6-Person", sku: "TENT-BLU-6", price_adjustment: 40, quantity: 12 }
    ]
  }
];

// Helper function to make API calls
async function apiCall(endpoint, method = 'GET', data = null) {
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json',
    }
  };

  if (data) {
    options.body = JSON.stringify(data);
  }

  try {
    const response = await fetch(`${API_URL}${endpoint}`, options);
    const result = await response.json();

    if (!response.ok) {
      console.error(`API Error (${response.status}):`, result);
      return null;
    }

    return result;
  } catch (error) {
    console.error(`Network Error:`, error.message);
    return null;
  }
}

// Main seeding function
async function seedDatabase() {
  console.log('🌱 Starting database seeding...\n');

  // Step 1: Create categories
  console.log('📁 Creating categories...');
  const categoryMap = {};

  for (const category of categories) {
    const result = await apiCall('/categories', 'POST', category);
    if (result && result.success) {
      categoryMap[category.slug] = result.data.category.id;
      console.log(`   ✅ Created: ${category.name}`);
    } else {
      console.log(`   ❌ Failed: ${category.name}`);
    }
  }

  console.log(`\n✅ Created ${Object.keys(categoryMap).length} categories\n`);

  // Step 2: Create products with variants
  console.log('📦 Creating products and variants...\n');
  let productCount = 0;
  let variantCount = 0;

  for (const product of products) {
    const categoryId = categoryMap[product.category_slug];
    if (!categoryId) {
      console.log(`   ❌ Category not found for: ${product.name}`);
      continue;
    }

    // Create product
    const productData = {
      name: product.name,
      slug: product.slug,
      description: product.description,
      brand: product.brand,
      base_price: product.base_price,
      category_id: categoryId,
      is_active: true
    };

    const productResult = await apiCall('/products', 'POST', productData);

    if (productResult && productResult.success) {
      const productId = productResult.data.product.id;
      console.log(`   ✅ Created product: ${product.name}`);
      productCount++;

      // Create variants for this product
      for (const variant of product.variants) {
        const variantData = {
          product_id: productId,
          name: variant.name,
          sku: variant.sku,
          price_adjustment: variant.price_adjustment,
          is_active: true
        };

        const variantResult = await apiCall('/variants', 'POST', variantData);

        if (variantResult && variantResult.success) {
          const variantId = variantResult.data.variant.id;

          // Set inventory for this variant
          const inventoryData = {
            variant_id: variantId,
            quantity: variant.quantity,
            reserved: 0
          };

          const inventoryResult = await apiCall('/inventory', 'POST', inventoryData);

          if (inventoryResult && inventoryResult.success) {
            console.log(`      ✅ Variant: ${variant.name} (${variant.quantity} in stock)`);
            variantCount++;
          } else {
            console.log(`      ❌ Inventory failed for: ${variant.name}`);
          }
        } else {
          console.log(`      ❌ Variant failed: ${variant.name}`);
        }
      }

      console.log(''); // Empty line between products
    } else {
      console.log(`   ❌ Failed to create product: ${product.name}\n`);
    }
  }

  // Summary
  console.log('\n' + '='.repeat(50));
  console.log('🎉 Seeding Complete!\n');
  console.log(`📁 Categories created: ${Object.keys(categoryMap).length}`);
  console.log(`📦 Products created: ${productCount}`);
  console.log(`🏷️  Variants created: ${variantCount}`);
  console.log('='.repeat(50) + '\n');
  console.log('🌐 Visit http://localhost:3000 to see your store!\n');
}

// Run the seeder
seedDatabase().catch(error => {
  console.error('❌ Seeding failed:', error);
  process.exit(1);
});

# 🌱 Seeding Mock Products

This guide will help you populate your e-commerce store with realistic mock products.

## What Gets Created

Running the seed script will create:

### 📁 Categories (5)
1. **Men's Fashion** - Stylish clothing and accessories for men
2. **Women's Fashion** - Trendy apparel and accessories for women
3. **Electronics** - Latest gadgets and electronic devices
4. **Home & Living** - Furniture, decor, and home essentials
5. **Sports & Outdoors** - Equipment and gear for active lifestyles

### 📦 Products (15)

**Men's Fashion:**
- Classic Cotton T-Shirt ($29.99) - 9 variants (S/M/L in Black/White/Navy)
- Slim Fit Denim Jeans ($79.99) - 7 variants (different sizes and washes)
- Leather Casual Sneakers ($89.99) - 8 variants (sizes 8-11 in White/Black)

**Women's Fashion:**
- Floral Summer Dress ($59.99) - 8 variants (XS-L in Pink/Blue floral)
- Yoga Leggings - High Waist ($44.99) - 7 variants (XS-L in Black/Navy)

**Electronics:**
- Wireless Bluetooth Headphones ($149.99) - 4 variants (Black/Silver, Standard/Premium)
- Smart Fitness Watch ($199.99) - 5 variants (42mm/46mm in various colors)
- Portable Power Bank 20000mAh ($39.99) - 4 variants (20K/30K capacity)

**Home & Living:**
- Memory Foam Pillow Set ($69.99) - 3 variants (Standard/Queen/King 2-packs)
- Ceramic Coffee Mug Set ($34.99) - 3 variants (White/Grey/Mixed 4-packs)

**Sports & Outdoors:**
- Yoga Mat - Extra Thick ($39.99) - 4 variants (Purple/Blue/Pink/Black)
- Resistance Bands Set ($29.99) - 2 variants (Standard/Premium sets)
- Camping Tent - 4 Person ($129.99) - 4 variants (Green/Blue in 4/6-person)

### 🏷️ Total Created
- **15 products**
- **80+ variants** (sizes, colors, configurations)
- **Realistic inventory** (20-80 units per variant)
- **Proper SKUs** (e.g., TSHIRT-M-BLK, JEANS-3232-DRK)
- **Price variations** (some variants have price adjustments)

## Prerequisites

Before running the seed script, ensure:

1. ✅ **Backend is running** on port 4000
   ```bash
   cd apps/backend
   pnpm dev
   ```

2. ✅ **Database migrations are applied** in Supabase

3. ✅ **Environment variables are configured** in `apps/backend/.env`

## How to Run

### Step 1: Start the Backend

```bash
# In a terminal window
cd apps/backend
pnpm dev
```

Wait for: `Server listening at http://localhost:4000`

### Step 2: Verify Backend is Running

```bash
curl http://localhost:4000/api/health
```

Expected: `{"status":"ok"}`

### Step 3: Run the Seed Script

```bash
# From the root directory
node seed-data.js
```

### Expected Output

```
🌱 Starting database seeding...

📁 Creating categories...
   ✅ Created: Men's Fashion
   ✅ Created: Women's Fashion
   ✅ Created: Electronics
   ✅ Created: Home & Living
   ✅ Created: Sports & Outdoors

✅ Created 5 categories

📦 Creating products and variants...

   ✅ Created product: Classic Cotton T-Shirt
      ✅ Variant: Small / Black (50 in stock)
      ✅ Variant: Medium / Black (75 in stock)
      ✅ Variant: Large / Black (60 in stock)
      ...

==================================================
🎉 Seeding Complete!

📁 Categories created: 5
📦 Products created: 15
🏷️  Variants created: 82
==================================================

🌐 Visit http://localhost:3000 to see your store!
```

## Verify the Results

### 1. Check the Storefront

Open http://localhost:3000 and you should see:

- **Homepage**: Featured products displayed in "HOT DEALS" section
- **Products Page**: All 15 products with category filters on the left
- **Category Filters**: Click "Men's Fashion", "Electronics", etc. to filter

### 2. View a Product Detail Page

1. Click on any product card (e.g., "Classic Cotton T-Shirt")
2. You should see:
   - Product name, brand, description
   - Base price ($29.99)
   - Multiple variants (Small/Medium/Large in different colors)
   - Stock quantity per variant
   - Variant selection updates the price
   - Quantity selector

### 3. Check Different Categories

Try each category to see different products:
- **Men's Fashion**: T-shirts, jeans, sneakers
- **Women's Fashion**: Dresses, leggings
- **Electronics**: Headphones, smartwatch, power bank
- **Home & Living**: Pillows, mugs
- **Sports & Outdoors**: Yoga mat, resistance bands, tent

### 4. Test Variant Selection

On a product detail page:
1. Click different variants (e.g., "Small / Black" vs "Large / White")
2. Price should update if there's a price adjustment
3. Stock quantity should change
4. Out-of-stock variants should be disabled

### 5. Test Sorting

On the products page, try different sort options:
- Name (A-Z)
- Name (Z-A)
- Price (Low to High)
- Price (High to Low)
- Newest First

## Troubleshooting

### "Backend not running" error

**Problem**: The script cannot connect to the backend API.

**Solution**:
```bash
# Check if backend is running
lsof -i :4000

# If not running, start it:
cd apps/backend
pnpm dev
```

### "Category not found" errors

**Problem**: Database might have existing data conflicting with slugs.

**Solution**:
1. Check Supabase dashboard
2. Clear existing categories/products if needed
3. Run the script again

### Products created but not showing on storefront

**Problem**: Frontend might be caching old data or backend not connected.

**Solutions**:
1. Refresh the browser (Cmd+Shift+R or Ctrl+Shift+F5)
2. Check browser console for errors
3. Verify `NEXT_PUBLIC_BACKEND_URL=http://localhost:4000` in `apps/storefront/.env.local`
4. Restart storefront: `cd apps/storefront && pnpm dev`

### Some variants showing "Out of Stock"

**Problem**: This might be intentional if inventory was set to 0.

**Solution**: Check the `seed-data.js` file - all variants should have quantity > 0. If you see 0, it might be a database issue.

## Running Multiple Times

**Important**: Running the seed script multiple times will create duplicate products with different IDs.

If you want to re-seed:

1. **Option A - Clear existing data** (in Supabase SQL Editor):
   ```sql
   -- Delete in order to respect foreign keys
   DELETE FROM inventory;
   DELETE FROM variants;
   DELETE FROM products;
   DELETE FROM categories;
   ```

2. **Option B - Keep existing data** and just run the script (will add more products)

## What to Do After Seeding

Once seeding is complete:

1. ✅ **Browse the storefront** - See how products look
2. ✅ **Test variant selection** - Click different sizes/colors
3. ✅ **Check product details** - View descriptions, pricing
4. ✅ **Test filters and sorting** - Use category filters and sort options
5. ✅ **Try the admin dashboard** - View products in admin panel at http://localhost:3001

## Next Steps

Now that you have mock data:

1. **Phase 3**: Implement shopping cart functionality
2. **Phase 4**: Add order management
3. **Phase 5**: Implement real-time features (WebSocket)

See `enhancements/08-phased-implementation-plan.md` for the full roadmap.

## Sample Product Preview

Here's what one product looks like:

**Classic Cotton T-Shirt**
- Brand: Urban Basics
- Price: $29.99
- Description: "Premium quality 100% cotton t-shirt. Soft, breathable, and perfect for everyday wear. Pre-shrunk fabric ensures lasting fit."
- Variants: 9 options (S/M/L × Black/White/Navy)
- Stock: 50-80 units per variant

**Wireless Bluetooth Headphones**
- Brand: SoundWave Pro
- Price: $149.99 (Standard) / $179.99 (Premium)
- Description: "Premium noise-canceling headphones with 30-hour battery life. Superior sound quality with deep bass and crystal-clear highs."
- Variants: 4 options (Black/Silver × Standard/Premium)
- Stock: 20-45 units per variant

---

**Ready to seed?** Run `node seed-data.js` and watch your store come to life! 🚀

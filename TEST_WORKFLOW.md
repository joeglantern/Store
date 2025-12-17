# 🧪 End-to-End Workflow Test Guide

## Current System Status

✅ **Storefront**: Running on port 3000
✅ **Admin**: Running on port 3001
❌ **Backend**: Not running (needs to be started)

## Step 1: Start the Backend

The backend API must be running for the system to work properly.

```bash
# In a new terminal window
cd apps/backend
pnpm dev
```

Expected output:
```
Server listening at http://localhost:4000
```

## Step 2: Verify Backend API

Once backend is running, test these endpoints:

### Health Check
```bash
curl http://localhost:4000/api/health
```
Expected: `{"status":"ok"}`

### Get All Categories
```bash
curl http://localhost:4000/api/categories
```
Expected: JSON array of categories (may be empty initially)

### Get All Products
```bash
curl http://localhost:4000/api/products
```
Expected: JSON response with products array (may be empty initially)

## Step 3: Admin Creates Content

1. **Open Admin Dashboard**
   - Navigate to: `http://localhost:3001`
   - You should see the admin interface with navigation

2. **Create a Category**
   - Click "Categories" in navigation
   - Click "Create Category" button
   - Fill in:
     - Name: `Men's Fashion`
     - Slug: `mens-fashion`
     - Description: `Stylish clothing for men`
   - Click "Create"
   - Verify category appears in the list

3. **Create a Product**
   - Click "Products" in navigation
   - Click "Create Product" button
   - Fill in:
     - Name: `Classic Cotton T-Shirt`
     - Slug: `classic-cotton-tshirt`
     - Description: `Premium quality cotton t-shirt`
     - Brand: `Fashion Co.`
     - Category: Select "Men's Fashion"
     - Base Price: `29.99`
     - Is Active: Check the box
   - Click "Create"
   - Verify product appears in the list

4. **Add Product Variants**
   - From products list, click on "Classic Cotton T-Shirt"
   - Look for "Variants" section
   - Click "Add Variant" (if available) or manage variants
   - Create variants:

     **Variant 1:**
     - Name: `Small / Black`
     - SKU: `SHIRT-SM-BLK`
     - Price Adjustment: `0`
     - Inventory Quantity: `50`
     - Is Active: Yes

     **Variant 2:**
     - Name: `Medium / Blue`
     - SKU: `SHIRT-MD-BLU`
     - Price Adjustment: `0`
     - Inventory Quantity: `30`
     - Is Active: Yes

     **Variant 3:**
     - Name: `Large / White`
     - SKU: `SHIRT-LG-WHT`
     - Price Adjustment: `2.00`
     - Inventory Quantity: `25`
     - Is Active: Yes

## Step 4: Customer Views Products

1. **Open Storefront**
   - Navigate to: `http://localhost:3000`

2. **Verify Homepage**
   - Should see "HOT DEALS" section
   - Should display the "Classic Cotton T-Shirt" product
   - Price should show: `$29.99`
   - Brand should show: "Fashion Co."

3. **Browse Products Page**
   - Click "SHOP NOW" button or navigate to `/products`
   - Should see products grid
   - Should see "Men's Fashion" in category sidebar
   - Click on the category to filter

4. **View Product Details**
   - Click on "Classic Cotton T-Shirt" card
   - URL should be: `/products/classic-cotton-tshirt`
   - Verify displayed information:
     - ✅ Product name: "Classic Cotton T-Shirt"
     - ✅ Brand: "Fashion Co."
     - ✅ Description: "Premium quality cotton t-shirt"
     - ✅ Base price: "$29.99"
     - ✅ Stock status: "In Stock"
     - ✅ Three variants (Small/Black, Medium/Blue, Large/White)

5. **Test Variant Selection**
   - Click "Small / Black" variant
   - Price should remain: `$29.99` (no adjustment)
   - Stock: `50 available`

   - Click "Large / White" variant
   - Price should change to: `$31.99` (+$2.00 adjustment)
   - Stock: `25 available`

6. **Test Quantity Selector**
   - Use `-` and `+` buttons to adjust quantity
   - Verify it doesn't go below 1
   - Verify it doesn't exceed available stock

7. **Test Add to Cart Button**
   - Click "Add to Cart"
   - Should see alert: "Add to cart functionality coming in Phase 3!"
   - (This is expected - cart is not yet implemented)

## Step 5: Verify API Responses

### Get Product by Slug
```bash
curl http://localhost:4000/api/products/classic-cotton-tshirt
```

Expected response structure:
```json
{
  "success": true,
  "data": {
    "product": {
      "id": "...",
      "name": "Classic Cotton T-Shirt",
      "slug": "classic-cotton-tshirt",
      "description": "Premium quality cotton t-shirt",
      "base_price": 29.99,
      "brand": "Fashion Co.",
      "category": {
        "id": "...",
        "name": "Men's Fashion",
        "slug": "mens-fashion"
      },
      "variants": [
        {
          "id": "...",
          "name": "Small / Black",
          "sku": "SHIRT-SM-BLK",
          "price_adjustment": 0,
          "is_active": true,
          "inventory": {
            "quantity": 50,
            "reserved": 0,
            "available": 50
          }
        }
        // ... more variants
      ]
    }
  }
}
```

### Get Products with Category Filter
```bash
curl "http://localhost:4000/api/products?category=<category-id>"
```

## Verification Checklist

### Backend API ✅
- [ ] Server starts successfully
- [ ] `/api/health` returns 200 OK
- [ ] `/api/products` returns products
- [ ] `/api/categories` returns categories
- [ ] `/api/products/:slug` returns product with variants

### Admin Dashboard ✅
- [ ] Loads successfully at port 3001
- [ ] Can create categories
- [ ] Can create products
- [ ] Can add variants
- [ ] Products show in products list
- [ ] Can edit products
- [ ] Can set inventory quantities

### Customer Storefront ✅
- [ ] Loads successfully at port 3000
- [ ] Homepage shows featured products
- [ ] Products page shows all products
- [ ] Category filtering works
- [ ] Product sorting works
- [ ] Product detail page loads correctly
- [ ] All product information displays
- [ ] Variant selection works
- [ ] Price updates with variant selection
- [ ] Stock status displays correctly
- [ ] Quantity selector works
- [ ] Add to Cart shows Phase 3 message

### Design Compliance ✅
- [ ] Orange #FF9900 used for CTAs
- [ ] Dark #2D2D2D used for header
- [ ] Professional icons (no emojis)
- [ ] Authentic e-commerce look (not AI-generated)
- [ ] 3-tier header structure
- [ ] Responsive design works

## Known Limitations (Phase 2)

These features are NOT yet implemented (coming in Phase 3+):

- ❌ Shopping cart functionality
- ❌ Checkout process
- ❌ Payment processing
- ❌ User authentication
- ❌ Order management
- ❌ Real-time inventory updates via WebSocket
- ❌ Search functionality
- ❌ Image upload (products show placeholder icons)

## Next Steps

After verifying all items above:

1. **Document any issues found** in this file
2. **Proceed to Phase 3**: Shopping Cart & Checkout
3. **Continue following** the phased implementation plan from Enhancement 08

## Troubleshooting

### Backend won't start
- Check if port 4000 is already in use: `lsof -i :4000`
- Verify .env file exists in `apps/backend/`
- Check Supabase credentials are valid

### Products not showing
- Verify backend is running and accessible
- Check browser console for API errors
- Verify products are marked as "active" in admin
- Check CORS settings in backend

### Variants not working
- Ensure variants have `is_active: true`
- Verify inventory quantity > 0
- Check that variant belongs to the product

## Success Criteria

✅ The workflow is successful when:
- Admin can create categories
- Admin can create products
- Admin can add variants with inventory
- Customers can browse products
- Customers can filter by category
- Customers can view product details
- Variant selection updates price
- Stock status displays correctly
- All design guidelines are followed

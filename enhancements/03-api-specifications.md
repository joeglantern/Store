# Enhancement 03: API Specifications

> **Supplements Section 3 of ecommerce_guide.md**  
> Complete API endpoint definitions for the backend Node.js server.

---

## Base URL

**Development**: `http://localhost:3001/api/v1`  
**Production**: `https://api.yourdomain.com/api/v1`

---

## Authentication Endpoints

### POST /auth/register
Register a new customer account.

**Auth Required**: No

**Request Body**:
```json
{
  "email": "user@example.com",
  "password": "SecurePass123!",
  "full_name": "John Doe",
  "phone": "+1234567890"
}
```

**Response** (201):
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "full_name": "John Doe",
      "role": "customer"
    },
    "session": {
      "access_token": "eyJhbGc...",
      "refresh_token": "eyJhbGc...",
      "expires_in": 3600
    }
  }
}
```

**Errors**:
- `400`: Validation error (weak password, invalid email)
- `409`: Email already registered

---

### POST /auth/login
Login with email and password.

**Auth Required**: No

**Request Body**:
```json
{
  "email": "user@example.com",
  "password": "SecurePass123!"
}
```

**Response** (200):
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "full_name": "John Doe",
      "role": "customer"
    },
    "session": {
      "access_token": "eyJhbGc...",
      "refresh_token": "eyJhbGc...",
      "expires_in": 3600
    }
  }
}
```

**Errors**:
- `401`: Invalid credentials
- `403`: Email not verified

---

### POST /auth/refresh
Refresh access token using refresh token.

**Auth Required**: Yes (refresh token)

**Request Body**:
```json
{
  "refresh_token": "eyJhbGc..."
}
```

**Response** (200):
```json
{
  "success": true,
  "data": {
    "access_token": "eyJhbGc...",
    "expires_in": 3600
  }
}
```

**Errors**:
- `401`: Invalid or expired refresh token

---

### POST /auth/logout
Logout and invalidate tokens.

**Auth Required**: Yes

**Response** (200):
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

---

## Product Endpoints

### GET /products
Get paginated list of products.

**Auth Required**: No

**Query Parameters**:
- `page` (default: 1)
- `limit` (default: 20, max: 100)
- `category_id` (optional)
- `is_featured` (optional: true/false)
- `search` (optional: search term)
- `sort` (optional: price_asc, price_desc, newest, popular)

**Response** (200):
```json
{
  "success": true,
  "data": {
    "products": [
      {
        "id": "uuid",
        "name": "Classic T-Shirt",
        "slug": "classic-t-shirt",
        "description": "Comfortable cotton t-shirt",
        "base_price": 29.99,
        "category": {
          "id": "uuid",
          "name": "T-Shirts",
          "slug": "t-shirts"
        },
        "images": [
          {
            "id": "uuid",
            "image_url": "https://...",
            "alt_text": "Front view"
          }
        ],
        "variants_count": 12,
        "is_featured": true,
        "created_at": "2025-01-01T00:00:00Z"
      }
    ],
    "pagination": {
      "current_page": 1,
      "total_pages": 5,
      "total_items": 98,
      "items_per_page": 20
    }
  }
}
```

---

### GET /products/:slug
Get single product by slug.

**Auth Required**: No

**Response** (200):
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "Classic T-Shirt",
    "slug": "classic-t-shirt",
    "description": "Comfortable cotton t-shirt",
    "base_price": 29.99,
    "category": {
      "id": "uuid",
      "name": "T-Shirts",
      "slug": "t-shirts"
    },
    "images": [
      {
        "id": "uuid",
        "image_url": "https://...",
        "alt_text": "Front view",
        "display_order": 0
      }
    ],
    "variants": [
      {
        "id": "uuid",
        "sku": "TSHIRT-CLS-M-BLK",
        "name": "Medium / Black",
        "attributes": {
          "size": "M",
          "color": "Black"
        },
        "price_adjustment": 0,
        "inventory": {
          "quantity": 50,
          "reserved": 5,
          "available": 45
        }
      }
    ],
    "meta_title": "Classic T-Shirt | Shop",
    "meta_description": "Buy our classic t-shirt..."
  }
}
```

**Errors**:
- `404`: Product not found

---

### POST /products (Admin Only)
Create a new product.

**Auth Required**: Yes (admin/super_admin)

**Request Body**:
```json
{
  "name": "Classic T-Shirt",
  "slug": "classic-t-shirt",
  "description": "Comfortable cotton t-shirt",
  "category_id": "uuid",
  "base_price": 29.99,
  "is_active": true,
  "is_featured": false,
  "meta_title": "Classic T-Shirt",
  "meta_description": "Buy our classic t-shirt"
}
```

**Response** (201):
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "Classic T-Shirt",
    ...
  }
}
```

**Errors**:
- `400`: Validation error
- `403`: Forbidden (not admin)
- `409`: Slug already exists

---

### PUT /products/:id (Admin Only)
Update existing product.

**Auth Required**: Yes (admin/super_admin)

**Request Body**: Same as POST, all fields optional

**Response** (200): Updated product object

**Errors**:
- `403`: Forbidden
- `404`: Product not found

---

### DELETE /products/:id (Admin Only)
Delete a product (cascades to variants, images).

**Auth Required**: Yes (admin/super_admin)

**Response** (200):
```json
{
  "success": true,
  "message": "Product deleted"
}
```

**Errors**:
- `403`: Forbidden
- `404`: Product not found

---

## Cart Endpoints

### GET /cart
Get current user's cart.

**Auth Required**: Yes

**Response** (200):
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "items": [
      {
        "id": "uuid",
        "variant": {
          "id": "uuid",
          "sku": "TSHIRT-CLS-M-BLK",
          "name": "Medium / Black",
          "product": {
            "id": "uuid",
            "name": "Classic T-Shirt",
            "slug": "classic-t-shirt",
            "image_url": "https://..."
          },
          "price": 29.99
        },
        "quantity": 2,
        "subtotal": 59.98
      }
    ],
    "totals": {
      "items_count": 3,
      "subtotal": 89.97
    }
  }
}
```

---

### POST /cart/items
Add item to cart.

**Auth Required**: Yes

**Request Body**:
```json
{
  "variant_id": "uuid",
  "quantity": 2
}
```

**Response** (201):
```json
{
  "success": true,
  "data": {
    "cart_item": {
      "id": "uuid",
      "variant_id": "uuid",
      "quantity": 2
    }
  }
}
```

**Errors**:
- `400`: Invalid quantity or out of stock
- `404`: Variant not found

---

### PATCH /cart/items/:id
Update cart item quantity.

**Auth Required**: Yes

**Request Body**:
```json
{
  "quantity": 3
}
```

**Response** (200): Updated cart item

**Errors**:
- `400`: Insufficient stock
- `404`: Cart item not found

---

### DELETE /cart/items/:id
Remove item from cart.

**Auth Required**: Yes

**Response** (200):
```json
{
  "success": true,
  "message": "Item removed"
}
```

---

## Order Endpoints

### POST /orders
Create new order from cart.

**Auth Required**: Yes

**Request Body**:
```json
{
  "shipping_address_id": "uuid",
  "discount_code": "SUMMER2025",
  "payment_method": "stripe"
}
```

**Response** (201):
```json
{
  "success": true,
  "data": {
    "order": {
      "id": "uuid",
      "order_number": "202501000001",
      "status": "pending",
      "subtotal": 89.97,
      "discount_amount": 9.00,
      "tax_amount": 7.20,
      "shipping_amount": 5.00,
      "total": 93.17,
      "payment_intent_id": "pi_xxx" // Stripe
    }
  }
}
```

**Errors**:
- `400`: Empty cart, invalid address, invalid discount code
- `409`: Stock no longer available

---

### GET /orders
Get user's order history.

**Auth Required**: Yes

**Query Parameters**:
- `page` (default: 1)
- `limit` (default: 10)
- `status` (optional filter)

**Response** (200):
```json
{
  "success": true,
  "data": {
    "orders": [
      {
        "id": "uuid",
        "order_number": "202501000001",
        "status": "delivered",
        "total": 93.17,
        "items_count": 3,
        "created_at": "2025-01-15T10:00:00Z"
      }
    ],
    "pagination": { ... }
  }
}
```

---

### GET /orders/:id
Get order details.

**Auth Required**: Yes (must be order owner or admin)

**Response** (200):
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "order_number": "202501000001",
    "status": "delivered",
    "items": [
      {
        "product_name": "Classic T-Shirt",
        "variant_name": "Medium / Black",
        "sku": "TSHIRT-CLS-M-BLK",
        "quantity": 2,
        "unit_price": 29.99,
        "total_price": 59.98
      }
    ],
    "shipping_address": {
      "full_name": "John Doe",
      "address_line1": "123 Main St",
      "city": "New York",
      "state": "NY",
      "postal_code": "10001"
    },
    "subtotal": 89.97,
    "discount_amount": 9.00,
    "tax_amount": 7.20,
    "shipping_amount": 5.00,
    "total": 93.17,
    "created_at": "2025-01-15T10:00:00Z"
  }
}
```

**Errors**:
- `403`: Not authorized to view this order
- `404`: Order not found

---

### PATCH /orders/:id/status (Admin Only)
Update order status.

**Auth Required**: Yes (admin/super_admin)

**Request Body**:
```json
{
  "status": "shipped",
  "tracking_number": "1Z999AA10123456784"
}
```

**Response** (200): Updated order object

---

## Category Endpoints

### GET /categories
Get all active categories.

**Auth Required**: No

**Response** (200):
```json
{
  "success": true,
  "data": {
    "categories": [
      {
        "id": "uuid",
        "name": "T-Shirts",
        "slug": "t-shirts",
        "description": "Cotton t-shirts",
        "image_url": "https://...",
        "parent_id": null,
        "subcategories": [
          {
            "id": "uuid",
            "name": "Men's T-Shirts",
            "slug": "mens-t-shirts"
          }
        ],
        "products_count": 45
      }
    ]
  }
}
```

---

### POST /categories (Admin Only)
Create category.

**Auth Required**: Yes (admin/super_admin)

**Request Body**:
```json
{
  "name": "T-Shirts",
  "slug": "t-shirts",
  "description": "Cotton t-shirts",
  "parent_id": null,
  "image_url": "https://...",
  "is_active": true
}
```

**Response** (201): Created category object

---

## Admin Endpoints

### GET /admin/analytics
Get sales analytics.

**Auth Required**: Yes (admin/super_admin)

**Query Parameters**:
- `start_date` (ISO 8601)
- `end_date` (ISO 8601)

**Response** (200):
```json
{
  "success": true,
  "data": {
    "total_revenue": 125000.00,
    "total_orders": 543,
    "average_order_value": 230.20,
    "top_products": [
      {
        "product_name": "Classic T-Shirt",
        "units_sold": 234,
        "revenue": 6986.66
      }
    ],
    "orders_by_status": {
      "pending": 12,
      "paid": 5,
      "processing": 8,
      "shipped": 15,
      "delivered": 503
    }
  }
}
```

---

### GET /admin/users
List all users.

**Auth Required**: Yes (admin/super_admin)

**Query Parameters**:
- `page`, `limit`
- `role` (filter by role)
- `search` (search by email/name)

**Response** (200):
```json
{
  "success": true,
  "data": {
    "users": [
      {
        "id": "uuid",
        "email": "user@example.com",
        "full_name": "John Doe",
        "role": "customer",
        "email_verified": true,
        "created_at": "2025-01-01T00:00:00Z"
      }
    ],
    "pagination": { ... }
  }
}
```

---

### PATCH /admin/users/:id/role (Super Admin Only)
Change user role.

**Auth Required**: Yes (super_admin)

**Request Body**:
```json
{
  "role": "admin"
}
```

**Response** (200): Updated user object

---

## Standard Error Format

All errors follow this format:

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data",
    "details": [
      {
        "field": "email",
        "message": "Invalid email format"
      }
    ]
  }
}
```

### Common Error Codes
- `VALIDATION_ERROR` (400)
- `UNAUTHORIZED` (401)
- `FORBIDDEN` (403)
- `NOT_FOUND` (404)
- `CONFLICT` (409)
- `RATE_LIMIT_EXCEEDED` (429)
- `INTERNAL_SERVER_ERROR` (500)

---

## Rate Limiting

- **Anonymous users**: 100 requests/hour
- **Authenticated users**: 1000 requests/hour
- **Admin users**: 5000 requests/hour

Implemented using Fastify rate-limit plugin with Redis store.

---

## Pagination Standard

All paginated endpoints use:
```json
{
  "pagination": {
    "current_page": 1,
    "total_pages": 10,
    "total_items": 200,
    "items_per_page": 20,
    "has_next": true,
    "has_prev": false
  }
}
```

---

## Next Steps
- [Chunk 4] Document environment variables for these endpoints
- [Chunk 5] Detail inventory locking flow during checkout
- [Chunk 7] Add Stripe payment webhook endpoints

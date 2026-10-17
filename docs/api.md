# REST API Specification

Base URL: `https://<api-id>.execute-api.us-east-1.amazonaws.com/api` (or `http://localhost:3001/api` in local mode)

## 1. Authentication
Endpoints requiring authentication accept a standard HTTP `Authorization` header:
```http
Authorization: Bearer <cognito_id_or_access_token>
```
Claims are inspected server-side to extract `sub` (User ID) and `cognito:groups` (e.g. `admins`).

---

## 2. Public Endpoints

### `GET /products`
List catalog products with pagination, category filter, brand filter, rating filter, price range, and sorting.
- **Query Parameters**:
  - `category` (optional, string)
  - `brand` (optional, string)
  - `minPrice` (optional, number)
  - `maxPrice` (optional, number)
  - `minRating` (optional, number)
  - `sort` (optional: `price-asc`, `price-desc`, `rating`, `newest`, `popular`)
  - `limit` (optional, integer, default: 20)
  - `nextToken` (optional, pagination token)
- **Response**: `200 OK`
```json
{
  "products": [
    {
      "id": "prod-101",
      "name": "Artisan Cold Brew Coffee Beans",
      "category": "Home and Kitchen",
      "brand": "Forest Reserve",
      "currentPrice": 24.99,
      "originalPrice": 29.99,
      "discountPercentage": 17,
      "rating": 4.8,
      "reviewCount": 128,
      "stockQuantity": 45,
      "image": "/images/products/coffee.jpg",
      "isActive": true
    }
  ],
  "total": 1,
  "nextToken": null
}
```

### `GET /products/{productId}`
Retrieve full product details, including image gallery, specifications, and related items.

### `GET /categories`
Get list of unique categories and counts.

### `GET /products/search`
- **Query Parameter**: `q=<query>`
- Full-text autocomplete and prefix search.

---

## 3. Customer Endpoints (Authenticated)

### `GET /cart`
Retrieve the current authenticated user's active cart.
- Server validates current prices and stock levels against DynamoDB.

### `POST /cart/items`
Add an item to the cart.
- **Request Body**:
```json
{
  "productId": "prod-101",
  "quantity": 2
}
```

### `PATCH /cart/items/{productId}`
Update item quantity. Validates available inventory.

### `DELETE /cart/items/{productId}`
Remove an item from the cart.

### `DELETE /cart`
Clear all items in the user's cart.

### `GET /wishlist` & `POST /wishlist/items` & `DELETE /wishlist/items/{productId}`
Customer saved favorites management.

### `POST /checkout`
Calculate authoritative subtotal, applied discounts, shipping fees, tax, and prepare an order draft.

### `POST /payments/simulate`
Simulate card / UPI / netbanking payment with idempotency key.
- **Request Body**:
```json
{
  "idempotencyKey": "uuid-v4",
  "shippingAddress": {
    "fullName": "Jane Doe",
    "street": "100 Forest Ave",
    "city": "Seattle",
    "state": "WA",
    "postalCode": "98101",
    "country": "US"
  },
  "shippingMethod": "standard",
  "outcome": "SUCCESS", // or "FAILURE"
  "cartItems": [
    { "productId": "prod-101", "quantity": 2 }
  ]
}
```
- Performs a DynamoDB transaction:
  1. Decrements product stock quantity conditionally (`stockQuantity >= requestedQuantity`).
  2. Creates order record in Orders table.
  3. Records idempotency token with TTL.
  4. Empties user's cart items.

### `GET /orders` & `GET /orders/{orderId}`
Retrieve customer order history and order tracking status.

---

## 4. Admin Endpoints (Cognito Group: `admins`)

### `POST /admin/products`
Create a new product.

### `PUT /admin/products/{productId}`
Update product details, pricing, and descriptions.

### `PATCH /admin/inventory/{productId}`
Adjust available stock quantity.

### `DELETE /admin/products/{productId}`
Soft-delete (deactivate) or delete a product.

### `GET /admin/orders` & `PATCH /admin/orders/{orderId}`
View all customer orders and update fulfillment status (`PENDING`, `PROCESSING`, `SHIPPED`, `DELIVERED`, `CANCELLED`).

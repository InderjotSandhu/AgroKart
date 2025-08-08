# AgroKart - Technical Architecture

## 🏗️ System Architecture Overview

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Frontend      │    │     Backend      │    │    Database     │
│   (React TS)    │◄──►│   (Node.js)      │◄──►│  (PostgreSQL)   │
│   - Customer    │    │   - REST API     │    │   - Users       │
│   - Farmer      │    │   - Auth         │    │   - Products    │
│   - Middleman   │    │   - Orders       │    │   - Orders      │
│   - Admin       │    │   - Payments     │    │   - Reviews     │
└─────────────────┘    └──────────────────┘    └─────────────────┘
         │                       │                       │
         │              ┌──────────────────┐             │
         │              │   External       │             │
         └──────────────►│   Services       │◄────────────┘
                        │   - Payment      │
                        │   - File Storage │
                        │   - Email/SMS    │
                        │   - Maps/Geo     │
                        └──────────────────┘
```

## 🎯 Technology Stack Justification

### Frontend: React.js + TypeScript
**Why React?**
- Large ecosystem and community support
- Component-based architecture for reusability
- Excellent performance with Virtual DOM
- Strong mobile responsiveness capabilities
- Easy integration with modern tooling

**Why TypeScript?**
- Type safety reduces runtime errors
- Better IDE support and developer experience
- Easier refactoring and maintenance
- Self-documenting code

### Backend: Node.js + Express
**Why Node.js?**
- Single language (JavaScript) across the stack
- Excellent performance for I/O operations
- Rich ecosystem (npm)
- Great for real-time features
- Easy deployment options

### Database: PostgreSQL + Redis
**Why PostgreSQL?**
- ACID compliance for transaction safety
- Rich data types (JSON, arrays, geometric)
- Excellent performance and scalability
- Strong community and tooling
- Advanced indexing capabilities

**Why Redis?**
- Session management
- Caching frequently accessed data
- Real-time features (notifications)
- Rate limiting implementation

## 📊 Database Design

### Core Tables Structure

```sql
-- Users table with multi-role support
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role user_role NOT NULL, -- 'customer', 'farmer', 'middleman', 'admin'
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    is_verified BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Role-specific profile tables
CREATE TABLE farmer_profiles (
    user_id INTEGER REFERENCES users(id),
    farm_name VARCHAR(255),
    farm_address TEXT,
    farm_size_acres DECIMAL,
    organic_certified BOOLEAN DEFAULT FALSE,
    verification_status VARCHAR(50) DEFAULT 'pending',
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8)
);

CREATE TABLE middleman_profiles (
    user_id INTEGER REFERENCES users(id),
    company_name VARCHAR(255),
    license_number VARCHAR(100),
    warehouse_capacity INTEGER,
    service_areas TEXT[], -- Array of locations they serve
    verification_status VARCHAR(50) DEFAULT 'pending'
);

-- Products and categories
CREATE TABLE categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    parent_id INTEGER REFERENCES categories(id)
);

CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    seller_id INTEGER REFERENCES users(id),
    category_id INTEGER REFERENCES categories(id),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    unit VARCHAR(20) NOT NULL, -- 'kg', 'piece', 'bunch'
    stock_quantity INTEGER NOT NULL,
    harvest_date DATE,
    expiry_date DATE,
    is_organic BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    images TEXT[], -- Array of image URLs
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Orders system
CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    customer_id INTEGER REFERENCES users(id),
    total_amount DECIMAL(10, 2) NOT NULL,
    status order_status DEFAULT 'pending',
    delivery_address TEXT NOT NULL,
    delivery_date DATE,
    payment_status payment_status DEFAULT 'pending',
    payment_method VARCHAR(50),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE order_items (
    id SERIAL PRIMARY KEY,
    order_id INTEGER REFERENCES orders(id),
    product_id INTEGER REFERENCES products(id),
    quantity INTEGER NOT NULL,
    unit_price DECIMAL(10, 2) NOT NULL,
    total_price DECIMAL(10, 2) NOT NULL
);

-- Reviews and ratings
CREATE TABLE reviews (
    id SERIAL PRIMARY KEY,
    reviewer_id INTEGER REFERENCES users(id),
    product_id INTEGER REFERENCES products(id),
    seller_id INTEGER REFERENCES users(id),
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    is_verified_purchase BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW()
);
```

## 🔐 Authentication & Authorization

### JWT Implementation
```javascript
// Token structure
{
  "sub": "user_id",
  "role": "farmer|middleman|customer|admin",
  "email": "user@example.com",
  "iat": 1234567890,
  "exp": 1234567890
}
```

### Role-Based Access Control (RBAC)
- **Customer**: Browse, order, review
- **Farmer**: Manage own products, view orders, analytics
- **Middleman**: Manage multiple farmers' products, bulk operations
- **Admin**: Full system access, user management, moderation

## 🚀 API Design

### RESTful Endpoints Structure
```
Authentication:
POST /api/auth/register
POST /api/auth/login
POST /api/auth/logout
POST /api/auth/refresh

Users:
GET    /api/users/profile
PUT    /api/users/profile
POST   /api/users/verify-email

Products:
GET    /api/products              # Public - with filters
POST   /api/products              # Sellers only
GET    /api/products/:id          # Public
PUT    /api/products/:id          # Seller (own products)
DELETE /api/products/:id          # Seller (own products)

Orders:
GET    /api/orders               # User's own orders
POST   /api/orders               # Create new order
GET    /api/orders/:id           # Order details
PUT    /api/orders/:id/status    # Update status (sellers)

Reviews:
GET    /api/reviews/product/:id  # Public
POST   /api/reviews              # Customers only
PUT    /api/reviews/:id          # Own reviews only

Admin:
GET    /api/admin/users          # All users
POST   /api/admin/users/:id/verify
GET    /api/admin/analytics      # Platform analytics
```

## 📱 Frontend Architecture

### Component Structure
```
src/
├── components/
│   ├── ui/                    # Shadcn/UI base components
│   ├── layout/               # Layout components
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   └── Sidebar.tsx
│   ├── forms/               # Reusable form components
│   │   ├── LoginForm.tsx
│   │   ├── ProductForm.tsx
│   │   └── CheckoutForm.tsx
│   ├── product/             # Product-related components
│   │   ├── ProductCard.tsx
│   │   ├── ProductGrid.tsx
│   │   ├── ProductFilters.tsx
│   │   └── ProductDetails.tsx
│   └── common/              # Shared components
│       ├── Loading.tsx
│       ├── ErrorBoundary.tsx
│       └── Modal.tsx
├── pages/
│   ├── customer/
│   │   ├── HomePage.tsx
│   │   ├── ProductsPage.tsx
│   │   ├── CartPage.tsx
│   │   └── OrdersPage.tsx
│   ├── seller/
│   │   ├── Dashboard.tsx
│   │   ├── ProductManagement.tsx
│   │   ├── OrderManagement.tsx
│   │   └── Analytics.tsx
│   └── admin/
│       ├── AdminDashboard.tsx
│       ├── UserManagement.tsx
│       └── PlatformAnalytics.tsx
├── hooks/                   # Custom React hooks
│   ├── useAuth.ts
│   ├── useProducts.ts
│   ├── useOrders.ts
│   └── useLocalStorage.ts
├── services/               # API service functions
│   ├── authService.ts
│   ├── productService.ts
│   ├── orderService.ts
│   └── apiClient.ts
├── store/                  # State management (Zustand)
│   ├── authStore.ts
│   ├── cartStore.ts
│   ├── productStore.ts
│   └── index.ts
├── utils/                  # Helper functions
│   ├── formatters.ts
│   ├── validators.ts
│   ├── constants.ts
│   └── helpers.ts
└── types/                  # TypeScript definitions
    ├── auth.ts
    ├── product.ts
    ├── order.ts
    └── api.ts
```

### State Management Strategy
Using **Zustand** for simplicity and performance:
```javascript
// Example: Cart Store
import { create } from 'zustand';

interface CartStore {
  items: CartItem[];
  addItem: (product: Product, quantity: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getTotalPrice: () => number;
}

export const useCartStore = create<CartStore>((set, get) => ({
  items: [],
  addItem: (product, quantity) => {
    // Implementation
  },
  // ... other methods
}));
```

## 🔄 Data Flow Architecture

### Customer Purchase Flow
```
1. Browse Products → ProductsPage
2. Add to Cart → CartStore
3. Checkout → CheckoutForm
4. Payment → PaymentService
5. Order Created → OrderService
6. Notification → Seller Dashboard
7. Order Fulfillment → Status Updates
8. Delivery Tracking → Customer Updates
```

### Seller Product Management Flow
```
1. Add Product → ProductForm
2. Upload Images → FileUploadService
3. Save to Database → ProductService
4. Inventory Tracking → Stock Updates
5. Order Notifications → Order Management
6. Analytics Updates → Dashboard Metrics
```

## 🔒 Security Architecture

### Data Protection Layers
1. **Input Validation**: Joi/Yup schemas
2. **Authentication**: JWT tokens with refresh mechanism
3. **Authorization**: Route-level RBAC middleware
4. **Rate Limiting**: Redis-based request throttling
5. **Data Encryption**: bcrypt for passwords, HTTPS for transport
6. **SQL Injection Prevention**: Parameterized queries
7. **XSS Protection**: Input sanitization and CSP headers

### File Upload Security
```javascript
// Multer configuration with security
const upload = multer({
  storage: multerS3({
    s3: s3Client,
    bucket: process.env.AWS_BUCKET,
    contentType: multerS3.AUTO_CONTENT_TYPE,
    key: (req, file, cb) => {
      // Generate secure filename
      const uniqueFilename = `${Date.now()}-${crypto.randomUUID()}`;
      cb(null, `products/${uniqueFilename}`);
    }
  }),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
    files: 5 // Max 5 files per upload
  },
  fileFilter: (req, file, cb) => {
    // Allow only images
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files allowed!'), false);
    }
  }
});
```

## 📊 Performance Optimization

### Backend Optimizations
1. **Database Indexing**: Strategic indexes on frequently queried fields
2. **Query Optimization**: Use of joins and efficient queries
3. **Caching Strategy**: Redis for session data and frequent queries
4. **Connection Pooling**: PostgreSQL connection pooling
5. **API Response Compression**: Gzip compression middleware

### Frontend Optimizations
1. **Code Splitting**: Route-based and component-based splitting
2. **Lazy Loading**: Images and non-critical components
3. **Bundle Optimization**: Tree shaking and dead code elimination
4. **Caching Strategy**: Service worker for static assets
5. **Performance Monitoring**: Web vitals tracking

## 🔄 Development Workflow

### Git Workflow
```
main (production)
├── develop (staging)
│   ├── feature/user-authentication
│   ├── feature/product-catalog
│   ├── feature/order-management
│   └── hotfix/payment-bug
```

### CI/CD Pipeline
```yaml
# GitHub Actions workflow
name: AgroKart CI/CD
on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      - name: Install dependencies
        run: npm ci
      - name: Run tests
        run: npm test
      - name: Run linting
        run: npm run lint

  deploy:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - name: Deploy to production
        run: # Deployment commands
```

This architecture provides a solid foundation for building a scalable, secure, and maintainable AgroKart platform that can handle the complex requirements of a multi-role e-commerce system.

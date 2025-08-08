# AgroKart - Development Setup Guide

## 🚀 Quick Start Guide

This guide will help you set up the AgroKart development environment from scratch.

## 📋 Prerequisites

### Required Software
- **Node.js** (v18+ recommended) - [Download](https://nodejs.org/)
- **PostgreSQL** (v14+ recommended) - [Download](https://www.postgresql.org/download/)
- **Git** - [Download](https://git-scm.com/)
- **Code Editor** - VS Code recommended with these extensions:
  - ES7+ React/Redux/React-Native snippets
  - Prettier - Code formatter
  - ESLint
  - Tailwind CSS IntelliSense
  - TypeScript Importer

### Optional but Recommended
- **Redis** (for caching) - [Download](https://redis.io/download/)
- **Postman** (for API testing) - [Download](https://www.postman.com/)
- **pgAdmin** (PostgreSQL GUI) - [Download](https://www.pgadmin.org/)

## 🏗️ Project Structure Setup

### 1. Initialize the Project
```bash
# Navigate to the project directory
cd D:\Projects\Personal\AgroKart

# Initialize the main project
npm init -y

# Create the project structure
mkdir frontend backend database docs assets
```

### 2. Frontend Setup (React + TypeScript)
```bash
# Navigate to frontend directory
cd frontend

# Create React app with TypeScript template
npx create-react-app . --template typescript

# Install additional dependencies
npm install @reduxjs/toolkit react-redux
npm install zustand  # Alternative to Redux
npm install axios
npm install react-router-dom
npm install @types/react-router-dom
npm install tailwindcss postcss autoprefixer
npm install @headlessui/react @heroicons/react
npm install react-hook-form @hookform/resolvers yup
npm install react-query
npm install @stripe/stripe-js @stripe/react-stripe-js
npm install socket.io-client
npm install date-fns

# Install Shadcn/UI
npx shadcn-ui@latest init

# Dev dependencies
npm install -D @types/node @types/react @types/react-dom
npm install -D eslint-config-prettier prettier
npm install -D husky lint-staged
npm install -D @testing-library/react @testing-library/jest-dom
```

### 3. Backend Setup (Node.js + Express)
```bash
# Navigate to backend directory
cd ../backend

# Initialize backend
npm init -y

# Install core dependencies
npm install express cors helmet morgan dotenv
npm install jsonwebtoken bcryptjs
npm install pg pg-hstore sequelize  # PostgreSQL ORM
npm install redis ioredis
npm install multer multer-s3 aws-sdk
npm install nodemailer
npm install stripe
npm install socket.io
npm install joi  # Validation
npm install compression
npm install rate-limiter-flexible

# Install TypeScript and types
npm install -D typescript @types/node @types/express
npm install -D @types/jsonwebtoken @types/bcryptjs
npm install -D @types/cors @types/morgan
npm install -D @types/multer @types/nodemailer
npm install -D nodemon ts-node
npm install -D jest @types/jest supertest @types/supertest
npm install -D eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin

# Initialize TypeScript
npx tsc --init
```

## ⚙️ Configuration Files

### 1. Frontend Configuration

#### `frontend/tailwind.config.js`
```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0fdf4',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          900: '#14532d',
        },
        secondary: {
          50: '#fdf4ff',
          500: '#a855f7',
          600: '#9333ea',
          700: '#7c3aed',
          900: '#581c87',
        }
      }
    },
  },
  plugins: [],
}
```

#### `frontend/.env.example`
```env
REACT_APP_API_URL=http://localhost:3001/api
REACT_APP_STRIPE_PUBLIC_KEY=pk_test_your_stripe_key
REACT_APP_GOOGLE_MAPS_API_KEY=your_google_maps_key
REACT_APP_APP_NAME=AgroKart
REACT_APP_VERSION=1.0.0
```

#### `frontend/package.json` scripts section
```json
{
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test",
    "eject": "react-scripts eject",
    "lint": "eslint src --ext .ts,.tsx",
    "lint:fix": "eslint src --ext .ts,.tsx --fix",
    "format": "prettier --write src/**/*.{ts,tsx,js,jsx,json,css,md}"
  }
}
```

### 2. Backend Configuration

#### `backend/package.json` scripts section
```json
{
  "scripts": {
    "start": "node dist/index.js",
    "dev": "nodemon src/index.ts",
    "build": "tsc",
    "test": "jest",
    "test:watch": "jest --watch",
    "lint": "eslint src --ext .ts",
    "lint:fix": "eslint src --ext .ts --fix"
  }
}
```

#### `backend/tsconfig.json`
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "lib": ["ES2020"],
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist", "tests"]
}
```

#### `backend/.env.example`
```env
# Server Configuration
NODE_ENV=development
PORT=3001
CORS_ORIGIN=http://localhost:3000

# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=agrokart_dev
DB_USER=postgres
DB_PASS=your_password

# Redis Configuration
REDIS_URL=redis://localhost:6379

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRES_IN=7d
JWT_REFRESH_SECRET=your_refresh_secret
JWT_REFRESH_EXPIRES_IN=30d

# Email Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password

# AWS S3 Configuration (for file uploads)
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
AWS_REGION=us-east-1
AWS_S3_BUCKET=agrokart-uploads

# Payment Configuration
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret

# Other Services
GOOGLE_MAPS_API_KEY=your_google_maps_key
RAZORPAY_KEY_ID=your_razorpay_key
RAZORPAY_KEY_SECRET=your_razorpay_secret
```

## 🗄️ Database Setup

### 1. PostgreSQL Database Creation
```sql
-- Connect to PostgreSQL and create database
CREATE DATABASE agrokart_dev;
CREATE DATABASE agrokart_test;

-- Create user (optional)
CREATE USER agrokart_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE agrokart_dev TO agrokart_user;
GRANT ALL PRIVILEGES ON DATABASE agrokart_test TO agrokart_user;
```

### 2. Database Migration Files Structure
```
database/
├── migrations/
│   ├── 001_create_users_table.sql
│   ├── 002_create_farmer_profiles_table.sql
│   ├── 003_create_middleman_profiles_table.sql
│   ├── 004_create_categories_table.sql
│   ├── 005_create_products_table.sql
│   ├── 006_create_orders_table.sql
│   ├── 007_create_order_items_table.sql
│   └── 008_create_reviews_table.sql
├── seeds/
│   ├── categories.sql
│   ├── sample_users.sql
│   └── sample_products.sql
└── scripts/
    ├── setup.js
    ├── migrate.js
    └── seed.js
```

## 🔧 Initial File Structure

### Frontend Structure
```
frontend/
├── public/
│   ├── index.html
│   ├── favicon.ico
│   └── manifest.json
├── src/
│   ├── components/
│   │   ├── ui/
│   │   ├── layout/
│   │   ├── forms/
│   │   ├── product/
│   │   └── common/
│   ├── pages/
│   │   ├── customer/
│   │   ├── seller/
│   │   └── admin/
│   ├── hooks/
│   ├── services/
│   ├── store/
│   ├── utils/
│   ├── types/
│   ├── styles/
│   ├── assets/
│   ├── App.tsx
│   └── index.tsx
├── package.json
├── tsconfig.json
├── tailwind.config.js
└── .env
```

### Backend Structure
```
backend/
├── src/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── services/
│   ├── utils/
│   ├── config/
│   ├── types/
│   └── index.ts
├── tests/
├── dist/ (generated)
├── package.json
├── tsconfig.json
└── .env
```

## 🚀 Development Commands

### Frontend Development
```bash
cd frontend

# Start development server
npm start

# Build for production
npm run build

# Run tests
npm test

# Lint and format code
npm run lint
npm run format
```

### Backend Development
```bash
cd backend

# Start development server with hot reload
npm run dev

# Build TypeScript
npm run build

# Start production server
npm start

# Run tests
npm test

# Lint code
npm run lint
```

## 🔍 Environment Setup Verification

### Test Frontend Setup
1. Navigate to `frontend` directory
2. Run `npm start`
3. Open http://localhost:3000
4. Verify React app loads successfully

### Test Backend Setup
1. Navigate to `backend` directory
2. Run `npm run dev`
3. Verify server starts on port 3001
4. Test with: `curl http://localhost:3001/health`

### Test Database Connection
```javascript
// backend/src/config/database.ts
import { Sequelize } from 'sequelize';

const sequelize = new Sequelize(
  process.env.DB_NAME!,
  process.env.DB_USER!,
  process.env.DB_PASS!,
  {
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    dialect: 'postgres',
    logging: false,
  }
);

// Test connection
sequelize.authenticate()
  .then(() => console.log('Database connected successfully'))
  .catch(err => console.error('Database connection failed:', err));
```

## 📝 Next Steps

1. **Complete Environment Setup**: Ensure all prerequisites are installed
2. **Initialize Git Repository**: Set up version control
3. **Create Initial Database Schema**: Run migrations
4. **Set up Basic Authentication**: Implement user registration/login
5. **Create Basic UI Components**: Header, footer, navigation
6. **Implement Core Features**: Start with product listing

## 🔧 Development Tools Setup

### VS Code Extensions
- Install recommended extensions
- Configure workspace settings
- Set up code snippets for faster development

### Git Hooks Setup
```bash
# Install Husky for pre-commit hooks
npx husky install

# Add pre-commit hook
npx husky add .husky/pre-commit "npm run lint && npm run test"
```

### Package.json Configuration
```json
{
  "husky": {
    "hooks": {
      "pre-commit": "lint-staged"
    }
  },
  "lint-staged": {
    "src/**/*.{ts,tsx}": [
      "eslint --fix",
      "prettier --write",
      "git add"
    ]
  }
}
```

## 🐛 Troubleshooting

### Common Issues

1. **Port conflicts**: Change ports in environment files
2. **Database connection errors**: Check credentials and service status
3. **Module not found errors**: Clear node_modules and reinstall
4. **TypeScript errors**: Check tsconfig.json configuration
5. **Cors issues**: Verify CORS_ORIGIN in backend environment

### Useful Commands
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Reset database
npm run db:reset

# Check logs
npm run logs

# Health check
curl http://localhost:3001/health
```

This setup guide provides everything you need to get AgroKart up and running in your development environment. Follow the steps sequentially, and you'll have a solid foundation to start building upon.

Happy coding! 🌱

# Environment Configuration Guide

## Overview
Professional environment setup for PROMANAGER with separate configurations for development and production.

## Environment Structure

### Frontend (Vite + React)
- **Development**: `http://localhost:5173` → `http://localhost:5000/api/v1`
- **Production**: `https://your-app.vercel.app` → `https://promanager-production-d25a.up.railway.app/api/v1`

### Backend (Node.js + Express)
- **Development**: `http://localhost:5000`
- **Production**: `https://promanager-production-d25a.up.railway.app`

## Setup Instructions

### 1. Backend Setup

#### Development
```bash
cd backend
cp .env.example .env
# Edit .env with your development values
npm run dev
```

#### Production (Railway)
```bash
# Set environment variables in Railway dashboard:
NODE_ENV=production
PORT=5000
CORS_ORIGIN=https://your-vercel-app.vercel.app
# ... other Firebase variables
```

### 2. Frontend Setup

#### Development
```bash
cd frontend
cp .env.example .env
# .env is automatically used for development
npm run dev
```

#### Production (Vercel)
Environment variables are set in `vercel.json`:
- `VITE_API_URL=https://promanager-production-d25a.up.railway.app/api/v1`
- `VITE_ENVIRONMENT=production`

## Environment Files

### Backend
- `.env` - Development environment
- `.env.production` - Production reference
- `.env.example` - Template

### Frontend
- `.env` - Development environment
- `.env.production` - Production environment (used by Vite build)
- `.env.example` - Template

## Key Features

### Professional Configuration
- Environment-specific CORS settings
- Proper logging levels
- Timeout configurations
- Error handling

### Security
- Environment-specific JWT secrets
- Secure CORS origins
- Production-ready headers

### Monitoring
- Request/response logging in development
- Production-ready logging format
- Health check endpoints

## Deployment

### Backend (Railway)
1. Connect Railway to your GitHub repo
2. Set environment variables in Railway dashboard
3. Deploy automatically on push

### Frontend (Vercel)
1. Connect Vercel to your GitHub repo
2. Environment variables are set in `vercel.json`
3. Deploy automatically on push

## URLs

### Development
- Frontend: http://localhost:5173
- Backend: http://localhost:5000
- API: http://localhost:5000/api/v1

### Production
- Frontend: https://your-vercel-app.vercel.app
- Backend: https://promanager-production-d25a.up.railway.app
- API: https://promanager-production-d25a.up.railway.app/api/v1

## Environment Variables Reference

### Backend Required
```
NODE_ENV=development|production
PORT=5000
CORS_ORIGIN=http://localhost:5173|https://your-vercel-app.vercel.app
JWT_ACCESS_SECRET=your_access_secret
JWT_REFRESH_SECRET=your_refresh_secret
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_PRIVATE_KEY=your_private_key
FIREBASE_CLIENT_EMAIL=your_client_email
FIREBASE_CLIENT_ID=your_client_id
FIREBASE_STORAGE_BUCKET=your_storage_bucket
```

### Frontend Required
```
VITE_API_URL=http://localhost:5000/api/v1|https://promanager-production-d25a.up.railway.app/api/v1
VITE_ENVIRONMENT=development|production
```
# Quick Start Guide

## 🚀 Get Started in 5 Minutes

### Prerequisites
- Node.js 18+ 
- Python 3.11+
- Git

### 1. Clone & Install

```bash
# Clone repository
git clone <your-repo-url>
cd eco

# Install frontend dependencies
cd frontend
npm install

# Install backend dependencies
cd ../backend
pip install -r requirements.txt
```

### 2. Configure Environment

**Frontend** - Create `frontend/.env`:
```bash
VITE_API_URL=http://localhost:8000
```

**Backend** - No configuration needed for local development!

### 3. Run Application

**Terminal 1 - Backend:**
```bash
cd backend
uvicorn main:app --reload
```
Backend runs at: `http://localhost:8000`

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```
Frontend runs at: `http://localhost:5173`

### 4. Test It Out!

1. Open browser: `http://localhost:5173`
2. Navigate to Calculator
3. Enter your data
4. See your carbon footprint!

## 📦 Production Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions.

### Quick Deploy Options

**Frontend:**
- Vercel (recommended)
- Netlify
- AWS S3 + CloudFront

**Backend:**
- Render (recommended)
- Railway
- Fly.io
- AWS ECS/Fargate

## 🔧 Common Issues

### Port Already in Use
```bash
# Change port in frontend/vite.config.js
# Or backend: uvicorn main:app --reload --port 8001
```

### CORS Errors
- Make sure backend is running
- Check `VITE_API_URL` in frontend/.env
- Verify backend allows localhost in CORS settings

### Module Not Found
```bash
# Frontend
cd frontend && npm install

# Backend
cd backend && pip install -r requirements.txt
```

## 📚 Next Steps

- Read [README.md](./README.md) for full documentation
- Check [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) for API details
- See [DEPLOYMENT.md](./DEPLOYMENT.md) for production setup

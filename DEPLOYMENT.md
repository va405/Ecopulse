# Deployment Guide

This guide provides instructions for deploying EcoPulse to various cloud platforms.

## Prerequisites

- Git repository
- Node.js 18+ (for frontend)
- Python 3.11+ (for backend)
- Cloud platform account (your choice)

## Frontend Deployment

### Option 1: Vercel
1. Push code to GitHub
2. Import project on Vercel
3. Set root directory to `frontend`
4. Add environment variable: `VITE_API_URL=<your-backend-url>`
5. Deploy

### Option 2: Netlify
1. Push code to GitHub
2. Import project on Netlify
3. Set base directory to `frontend`
4. Build command: `npm run build`
5. Publish directory: `dist`
6. Add environment variable: `VITE_API_URL=<your-backend-url>`

### Option 3: Static Hosting (AWS S3, Azure, etc.)
```bash
cd frontend
npm install
npm run build
# Upload dist/ folder to your hosting
```

## Backend Deployment

### Option 1: Cloud Platform (Render, Railway, Fly.io)
1. Push code to GitHub
2. Create new web service
3. Set root directory to `backend`
4. Build command: `pip install -r requirements.txt`
5. Start command: `uvicorn main:app --host 0.0.0.0 --port $PORT`

### Option 2: Docker Deployment
```bash
cd backend
docker build -t ecopulse-api .
docker run -p 8000:8000 ecopulse-api
```

### Option 3: VPS (DigitalOcean, Linode, etc.)
```bash
# Install dependencies
pip install -r requirements.txt

# Run with gunicorn (production)
gunicorn main:app -w 4 -k uvicorn.workers.UvicornWorker --bind 0.0.0.0:8000
```

## Environment Variables

### Frontend (.env)
```bash
VITE_API_URL=<your-backend-url>
VITE_FIREBASE_API_KEY=<optional>
VITE_FIREBASE_AUTH_DOMAIN=<optional>
VITE_FIREBASE_PROJECT_ID=<optional>
```

### Backend
```bash
DATABASE_URL=<optional-database-url>
GEMINI_API_KEY=<optional-ai-key>
DEBUG=False
```

## CORS Configuration

After deployment, update `backend/main.py` with your frontend URL:

```python
allow_origins=[
    "http://localhost:3000",
    "http://localhost:5173",
    "https://your-frontend-url.com",  # Add your actual URL
]
```

## Post-Deployment Checklist

- [ ] Frontend deployed and accessible
- [ ] Backend deployed and accessible
- [ ] Environment variables configured
- [ ] CORS configured with frontend URL
- [ ] API endpoints tested
- [ ] SSL/HTTPS enabled
- [ ] Health check endpoint responding

## Testing Deployment

### Test Backend
```bash
curl https://your-backend-url.com/health
```

### Test Frontend
Visit your frontend URL and try:
- Home page loads
- Calculator works
- API connection successful

## Troubleshooting

### CORS Errors
- Verify frontend URL is added to `allow_origins` in backend
- Check protocol (http vs https)
- Ensure no trailing slashes

### Build Failures
- Verify Node.js version (18+)
- Verify Python version (3.11+)
- Check all dependencies are listed
- Review build logs for specific errors

### API Connection Issues
- Verify `VITE_API_URL` is set correctly
- Test API endpoint directly
- Check network/firewall rules
- Verify SSL certificate if using HTTPS

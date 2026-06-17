# 🚀 Carbon AI Deployment Guide

## Quick Deployment Overview

Your repository: **https://github.com/technest078-cmyk/hack2skill**

---

## 1️⃣ Frontend Deployment (Vercel) - 5 minutes

### Step-by-Step:

1. **Go to Vercel**
   - Visit: https://vercel.com/signup
   - Sign up with GitHub account

2. **Import Project**
   - Click "Add New..." → "Project"
   - Import `technest078-cmyk/hack2skill`
   - Framework Preset: **Vite** (auto-detected)
   - Root Directory: **frontend**
   - Click "Deploy"

3. **Add Environment Variables** (after deployment)
   - Go to Project Settings → Environment Variables
   - Add:
     ```
     VITE_API_URL=https://carbon-api.onrender.com
     ```
   - You'll update this URL after backend deployment

4. **Your Frontend URL**
   - Will be: `https://hack2skill-xxx.vercel.app`
   - Or custom domain if you set one

---

## 2️⃣ Backend Deployment (Render) - 10 minutes

### Step-by-Step:

1. **Go to Render**
   - Visit: https://render.com/register
   - Sign up with GitHub account

2. **Create Web Service**
   - Click "New +" → "Web Service"
   - Connect GitHub: `technest078-cmyk/hack2skill`
   
3. **Configure Service**
   ```
   Name: carbon-api
   Region: Oregon (US West) or closest to you
   Branch: main
   Root Directory: backend
   Runtime: Python 3
   Build Command: pip install -r requirements.txt
   Start Command: uvicorn main:app --host 0.0.0.0 --port $PORT
   Instance Type: Free
   ```

4. **Add Environment Variables**
   ```
   DATABASE_URL=sqlite:///./carbon.db
   DEBUG=False
   GEMINI_API_KEY=your_gemini_key_here
   ```

5. **Your Backend URL**
   - Will be: `https://carbon-api.onrender.com` (or similar)
   - Copy this URL!

---

## 3️⃣ Update Frontend with Backend URL

1. **Go back to Vercel**
   - Project Settings → Environment Variables
   - Update `VITE_API_URL` with your Render URL
   - Example: `https://carbon-api-xxxx.onrender.com`

2. **Redeploy Frontend**
   - Go to Deployments
   - Click "..." → "Redeploy"

---

## 4️⃣ Update Backend CORS (Important!)

After you get your Vercel URL, you need to update backend CORS:

1. **Edit backend/main.py** on GitHub:
   - Go to: `https://github.com/technest078-cmyk/hack2skill/edit/main/backend/main.py`
   
2. **Find the CORS section** (around line 78) and update:
   ```python
   allow_origins=[
       "http://localhost:3000",
       "http://localhost:5173",
       "https://hack2skill-xxx.vercel.app",  # Add your Vercel URL
       "https://*.vercel.app",
   ],
   ```

3. **Commit changes** - Render will auto-deploy

---

## 5️⃣ Test Your Deployment

### Frontend Test:
- Visit your Vercel URL
- Check if the homepage loads
- Try the calculator page

### Backend Test:
- Visit: `https://your-backend.onrender.com/docs`
- Should see FastAPI documentation
- Try: `https://your-backend.onrender.com/`
- Should return: `{"message": "Welcome to Carbon AI API"}`

### Full Integration Test:
- Go to your frontend
- Navigate to Calculator page
- Fill in the form
- Click "Calculate Footprint"
- Should see results!

---

## 📋 Quick Checklist

- [ ] Vercel account created
- [ ] Frontend deployed to Vercel
- [ ] Got Vercel URL
- [ ] Render account created
- [ ] Backend deployed to Render
- [ ] Got Render URL
- [ ] Updated VITE_API_URL in Vercel
- [ ] Updated CORS in backend/main.py
- [ ] Tested frontend loads
- [ ] Tested backend /docs
- [ ] Tested calculator integration

---

## 🔧 Common Issues & Fixes

### Issue: CORS Error
**Fix:** Make sure your Vercel URL is added to backend CORS allow_origins

### Issue: API Not Responding
**Fix:** Check Render logs, might be cold start (free tier sleeps after inactivity)

### Issue: Build Failed on Vercel
**Fix:** Make sure Root Directory is set to `frontend`

### Issue: Backend Build Failed on Render
**Fix:** Check Python version is 3.9+ and requirements.txt exists

---

## 🎉 You're Live!

Once deployed, your app will be accessible at:
- **Frontend:** `https://your-app.vercel.app`
- **Backend API:** `https://carbon-api.onrender.com`
- **API Docs:** `https://carbon-api.onrender.com/docs`

---

## 💡 Next Steps (Optional)

1. **Custom Domain** (Vercel)
   - Project Settings → Domains
   - Add your custom domain

2. **Database Upgrade** (if needed)
   - Sign up for Neon PostgreSQL (free tier)
   - Update DATABASE_URL in Render

3. **Monitoring**
   - Enable Vercel Analytics
   - Check Render metrics

4. **Firebase Authentication** (if you want user login)
   - Create Firebase project
   - Add Firebase config to frontend
   - Update environment variables

---

**Need Help?**
- Vercel Docs: https://vercel.com/docs
- Render Docs: https://render.com/docs

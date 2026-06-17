<div align="center">

# 🌍 Carbon AI
### Carbon Footprint Intelligence Platform

<br/>

[![Live Demo](https://img.shields.io/badge/Live%20Demo-brightgreen?style=for-the-badge&logo=vercel)](https://hack2skill-zwoy.vercel.app)
[![GitHub](https://img.shields.io/badge/GitHub-black?style=for-the-badge&logo=github)](https://github.com/technest078-cmyk/hack2skill)
[![API](https://img.shields.io/badge/API-Live-blue?style=for-the-badge)](https://carbon-api-aihm.onrender.com)

<br/>

**🏆 PromptWars Virtual 2026 - Main Challenge 3 🏆**

*AI-powered platform to track, analyze, and reduce your carbon footprint*

<br/>

**🔗 Live Demo:** https://hack2skill-zwoy.vercel.app
**🔌 API Endpoint:** https://carbon-api-aihm.onrender.com

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Installation](#-installation)
- [Screenshots](#-screenshots)
- [Performance](#-performance)

---

## 🎯 Overview

**Carbon AI** is a carbon footprint awareness platform built for PromptWars Virtual 2026 (Hack2skill × Google for Developers). It helps individuals understand, track, and reduce their environmental impact through AI-driven insights and gamification.

### Problem Statement
Design a solution that helps people:
- Understand their carbon footprint
- Track impact over time  
- Reduce emissions through simple actions
- Receive personalized recommendations

### Solution
Carbon AI provides:
- **Real-time calculations** across 5 categories (transport, energy, water, diet, waste)
- **AI-powered recommendations** tailored to user behavior
- **Predictive analytics** to forecast future impact
- **Visual insights** through interactive 3D charts
- **Gamification** to encourage sustainable habits
- **Community benchmarking** for motivation

---

## ✨ Features

### Core Functionality
- 🧮 **Carbon Calculator** - Calculate emissions from transport, energy, food & lifestyle
- 📊 **Dashboard** - Personal analytics with trends and achievements
- 🤖 **AI Advisor** - Smart recommendations powered by ML
- 🏆 **Challenges** - Community eco-challenges with rewards
- 📚 **Learning Hub** - Educational sustainability resources
- 📈 **Analytics** - Platform-wide statistics and insights

### Advanced Features
- **ML Predictions** - 6-month carbon emission forecasting (85% confidence)
- **Benchmarking** - Compare against global/national averages
- **Real-time Updates** - Live counters and leaderboards
- **Data Export** - Download reports in CSV/JSON/PDF
- **PWA Support** - Install as mobile/desktop app, works offline
- **Gamification** - XP points, levels, badges, and rankings

---

## 🛠️ Tech Stack

**Frontend:** React 18 • Vite • Tailwind CSS • Framer Motion • Recharts  
**Backend:** FastAPI • Python • Pydantic • Docker  
**Deployment:** Vercel • Render

---

## 📦 Installation

### Prerequisites
```
Node.js >= 18.x
Python >= 3.11
npm >= 9.x
```

### Quick Start

**Frontend**
```bash
cd frontend
npm install
npm run dev
```
Access at: `http://localhost:3000`

**Backend**
```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
```
API at: `http://localhost:8000`

### Production Build
```bash
# Frontend
cd frontend
npm run build

# Backend (Docker)
cd backend
docker build -t greenpulse-api .
docker run -p 8000:8000 greenpulse-api
```

---

## 🏗️ Project Structure

```
greenpulse-ai/
├── frontend/
│   ├── src/
│   │   ├── components/     # 16 reusable components
│   │   ├── pages/          # 10 page routes
│   │   ├── context/        # Auth context
│   │   ├── utils/          # Analytics & export utilities
│   │   └── App.jsx
│   ├── public/
│   │   ├── manifest.json   # PWA manifest
│   │   └── service-worker.js
│   └── package.json
├── backend/
│   ├── main.py            # FastAPI (12 endpoints)
│   ├── database.py
│   ├── Dockerfile
│   └── requirements.txt
└── README.md
```

---

## 📸 Screenshots

### Home Page
Interactive landing page with carbon calculator

### Dashboard
Personal analytics with monthly trends

### Analytics
Platform-wide live statistics

### Challenges
Community eco-challenges and leaderboard

---

## 📊 Performance

| Metric | Score |
|--------|-------|
| Lighthouse Performance | 95/100 |
| Accessibility | 100/100 |
| Best Practices | 95/100 |
| SEO | 100/100 |
| Bundle Size | 783 KB (gzipped: 222 KB) |
| Load Time | < 2 seconds |

---

## 🎓 Key Learnings

- Full-stack development (React + FastAPI)
- Machine learning integration (linear regression)
- Progressive Web App architecture
- Real-time data visualization
- Performance optimization
- Cloud deployment (Vercel + Render)

---

## 👨‍💻 Author

**Nalla Poojitha Reddy**  
PromptWars Virtual 2026 Participant

---

## 🙏 Acknowledgments

- **Hack2skill** - For organizing PromptWars Virtual 2026
- **Google for Developers** - For collaboration
- Open source community

---

## 📄 License

MIT License

---

<div align="center">

## 🌍 Built for a Sustainable Future

**GreenPulse AI**  
*PromptWars Virtual 2026 Submission*

⭐ **Star this repo if you find it helpful!** ⭐

</div>

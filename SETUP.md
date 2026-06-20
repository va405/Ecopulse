# Local Development Setup

## Prerequisites

- **Node.js** 18+ ([Download](https://nodejs.org/))
- **Python** 3.9+ ([Download](https://www.python.org/))
- **Git** ([Download](https://git-scm.com/))

## Quick Start

### 1. Clone Repository
```bash
git clone https://github.com/<your-username>/<your-repo>.git
cd <your-repo>
```

### 2. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend will be available at: `http://localhost:3000`

### 3. Backend Setup

Open a new terminal:

```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
```

Backend API will be available at: `http://localhost:8000`
API docs: `http://localhost:8000/docs`

## Environment Variables

### Frontend (.env in frontend/)
```env
VITE_API_URL=http://localhost:8000
VITE_FIREBASE_API_KEY=your_firebase_api_key
```

### Backend (.env in backend/)
```env
DATABASE_URL=sqlite:///./greenpulse.db
GEMINI_API_KEY=your_gemini_api_key
DEBUG=True
```

## Project Structure

```
greenpulse-ai/
├── frontend/              # React + Vite frontend
│   ├── src/
│   │   ├── components/   # Reusable components
│   │   ├── pages/        # Page components
│   │   ├── context/      # React context (Auth)
│   │   ├── App.jsx       # Main app component
│   │   └── main.jsx      # Entry point
│   ├── public/           # Static assets
│   └── package.json
│
├── backend/              # FastAPI backend
│   ├── main.py          # API endpoints
│   ├── database.py      # Database models
│   └── requirements.txt
│
├── README.md
├── SETUP.md
└── DEPLOYMENT.md
```

## Available Scripts

### Frontend
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Backend
- `uvicorn main:app --reload` - Start with auto-reload
- `uvicorn main:app --port 8000` - Start on specific port

## Features to Test

1. **Home Page** - `http://localhost:3000/`
2. **Calculator** - `http://localhost:3000/calculator`
3. **Dashboard** - `http://localhost:3000/dashboard`
4. **AI Advisor** - `http://localhost:3000/ai-advisor`
5. **Challenges** - `http://localhost:3000/challenges`
6. **Learning Hub** - `http://localhost:3000/learning`

## API Endpoints

Test with the interactive docs at `http://localhost:8000/docs`

- `GET /` - Health check
- `POST /api/calculate-impact` - Calculate environmental impact
- `POST /api/ai-advisor` - Get AI recommendations
- `GET /api/challenges` - Get challenges
- `GET /api/dashboard/{user_id}` - Get dashboard data

## Next Steps

1. ✅ Run both frontend and backend
2. ✅ Test the calculator feature
3. ✅ Explore the dashboard
4. ✅ Try the AI advisor
5. 🔧 Integrate real AI API (Gemini/OpenAI)
6. 🔧 Set up Firebase Authentication
7. 🔧 Connect to PostgreSQL
8. 🚀 Deploy to production

## Troubleshooting

### Port Already in Use
```bash
# Frontend (change port in vite.config.js)
# Or kill process on port 3000
npx kill-port 3000

# Backend
uvicorn main:app --port 8001
```

### Module Not Found
```bash
# Frontend
cd frontend
rm -rf node_modules package-lock.json
npm install

# Backend
cd backend
pip install -r requirements.txt --upgrade
```

### CORS Errors
Make sure backend `main.py` includes your frontend URL in CORS origins.

## Support

For issues or questions:
- Check the [README.md](README.md)
- Review [DEPLOYMENT.md](DEPLOYMENT.md)
- Open an issue on GitHub

Happy coding! 🌱

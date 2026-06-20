# EcoPulse Backend

FastAPI backend for the EcoPulse sustainability tracking platform.

## Features

- 🔢 Impact calculation API
- 🤖 AI advisor endpoint
- 🎯 Challenge management
- 📊 Dashboard data
- 🔐 Firebase authentication (ready to integrate)
- 💾 PostgreSQL database support

## Setup

1. **Install dependencies**
```bash
pip install -r requirements.txt
```

2. **Configure environment**
```bash
cp .env.example .env
# Edit .env with your credentials
```

3. **Run the server**
```bash
uvicorn main:app --reload
```

The API will be available at `http://localhost:8000`

## API Documentation

Once running, visit:
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

## Endpoints

- `POST /api/calculate-impact` - Calculate environmental impact
- `POST /api/ai-advisor` - Get AI recommendations
- `GET /api/challenges` - Get available challenges
- `GET /api/dashboard/{user_id}` - Get user dashboard data

## Database

The app uses SQLAlchemy ORM with support for:
- PostgreSQL (production)
- SQLite (development)

## Next Steps

1. Integrate real AI API (Gemini or OpenAI)
2. Set up Firebase Authentication
3. Deploy to Render or Railway
4. Connect to Neon PostgreSQL

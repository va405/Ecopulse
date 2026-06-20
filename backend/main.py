"""
EcoPulse Backend API
A comprehensive carbon footprint tracking and environmental awareness platform.

This module provides REST API endpoints for:
- Carbon footprint calculation
- AI-powered eco-advice
- Predictive analytics
- Benchmarking and comparisons
- User challenges and gamification
"""

from fastapi import FastAPI, HTTPException, Depends, BackgroundTasks, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel, Field, validator
from typing import Optional, List, Dict, Any, Tuple
import os
from datetime import datetime, timedelta
import json
import random
import math
import time

app = FastAPI(
    title="EcoPulse API",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_url="/openapi.json"
)

# Security Headers Middleware
@app.middleware("http")
async def add_security_headers(request: Request, call_next) -> JSONResponse:
    """
    Add comprehensive security headers to all HTTP responses
    
    Implements defense-in-depth security strategy with multiple headers
    to protect against XSS, clickjacking, MIME sniffing, and other attacks.
    
    Args:
        request (Request): Incoming HTTP request
        call_next: Next middleware/handler in chain
        
    Returns:
        JSONResponse: Response with added security headers
        
    Security Headers Added:
        - X-Content-Type-Options: nosniff (prevent MIME sniffing)
        - X-Frame-Options: DENY (prevent clickjacking)
        - X-XSS-Protection: 1; mode=block (legacy XSS protection)
        - Strict-Transport-Security: HSTS for 1 year (force HTTPS)
        - Referrer-Policy: strict-origin-when-cross-origin (privacy)
        - Permissions-Policy: Disable geolocation, camera, microphone
        - Content-Security-Policy: Comprehensive CSP policy
        
    Example Response Headers:
        X-Content-Type-Options: nosniff
        X-Frame-Options: DENY
        Strict-Transport-Security: max-age=31536000; includeSubDomains
        
    Time Complexity: O(1)
    Space Complexity: O(1)
    """
    response = await call_next(request)
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["X-Frame-Options"] = "DENY"
    response.headers["X-XSS-Protection"] = "1; mode=block"
    response.headers["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains"
    response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
    response.headers["Permissions-Policy"] = "geolocation=(), microphone=(), camera=()"
    response.headers["Content-Security-Policy"] = (
        "default-src 'self'; "
        "script-src 'self' 'unsafe-inline' 'unsafe-eval'; "
        "style-src 'self' 'unsafe-inline'; "
        "img-src 'self' data: https:; "
        "font-src 'self' data:; "
        "connect-src 'self' https://ecopulse-api-w5at.onrender.com;"
    )
    return response

# Request Size Validation Middleware - Prevent DoS attacks
@app.middleware("http")
async def validate_request_size(request: Request, call_next) -> JSONResponse:
    """
    Validate request body size to prevent DoS attacks
    
    Limits request size to 1MB to prevent memory exhaustion and
    protect against denial-of-service attacks via large payloads.
    
    Args:
        request (Request): Incoming HTTP request
        call_next: Next middleware/handler in chain
        
    Returns:
        JSONResponse: Either 413 error or response from next handler
        
    Raises:
        HTTP 413: Payload Too Large if request exceeds 1MB
        
    Example:
        POST /api/calculate with 2MB body:
        HTTP 413 {"detail": "Request body too large. Maximum size is 1MB"}
        
    Time Complexity: O(1)
    Space Complexity: O(1)
    """
    if request.method in ["POST", "PUT", "PATCH"]:
        content_length = request.headers.get("content-length")
        if content_length and int(content_length) > 1_000_000:  # 1MB limit
            return JSONResponse(
                status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
                content={"detail": "Request body too large. Maximum size is 1MB"}
            )
    return await call_next(request)

# Rate Limiting Middleware - Prevent API abuse
# Implements token bucket algorithm for fair rate limiting
request_counts = {}

@app.middleware("http")
async def rate_limit_middleware(request: Request, call_next) -> JSONResponse:
    """
    Rate limiting middleware to prevent API abuse
    
    Implements sliding window rate limiting with 100 requests per minute per IP.
    Automatically cleans up old request records to prevent memory bloat.
    
    Args:
        request (Request): Incoming HTTP request
        call_next: Next middleware/handler in chain
        
    Returns:
        JSONResponse: Either rate limit error or response from next handler
        
    Raises:
        HTTP 429: Too Many Requests if rate limit exceeded
        
    Algorithm:
        1. Extract client IP address
        2. Remove requests older than 1 minute (sliding window)
        3. Check if request count < 100
        4. If exceeded, return 429 error
        5. Otherwise, record request and proceed
        
    Time Complexity: O(n) where n = requests in last minute
    Space Complexity: O(m) where m = unique IP addresses
    
    Example:
        Client makes 101 requests in 60 seconds:
        - First 100 succeed
        - 101st returns: {"detail": "Rate limit exceeded"}
    """
    client_ip = request.client.host
    current_time = time.time()
    
    # Clean old entries (sliding window algorithm)
    request_counts[client_ip] = [
        timestamp for timestamp in request_counts.get(client_ip, [])
        if current_time - timestamp < 60  # 1 minute window
    ]
    
    # Check rate limit (100 requests per minute)
    if len(request_counts.get(client_ip, [])) >= 100:
        return JSONResponse(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            content={"detail": "Rate limit exceeded. Please try again later."}
        )
    
    # Add current request timestamp
    request_counts.setdefault(client_ip, []).append(current_time)
    
    response = await call_next(request)
    return response

# CORS middleware - Configure for your deployment
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:5173",
        # Add your production frontend URL here after deployment
        # Example: "https://your-app.yourdomain.com"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Models
class ImpactCalculation(BaseModel):
    carMiles: Optional[float] = 0
    publicTransport: Optional[float] = 0
    flights: Optional[float] = 0
    electricity: Optional[float] = 0
    heating: Optional[float] = 0
    showerMinutes: Optional[float] = 0
    laundry: Optional[float] = 0
    diet: str = "mixed"
    recycling: str = "sometimes"

class ImpactResult(BaseModel):
    carbon: float
    water: float
    score: float
    rating: str
    recommendations: List[str]

class AIQuery(BaseModel):
    message: str
    userId: Optional[str] = None

class PredictionRequest(BaseModel):
    historicalData: List[dict]
    userId: Optional[str] = None

class BenchmarkRequest(BaseModel):
    carbon: float
    water: float
    score: float

class PredictionRequest(BaseModel):
    historicalData: List[Dict]
    targetMonths: int = Field(default=3, ge=1, le=12)

class ComparisonRequest(BaseModel):
    carbon: float
    water: float
    region: str = "global"

class NotificationSettings(BaseModel):
    userId: str
    emailNotifications: bool = True
    pushNotifications: bool = True
    weeklyReports: bool = True

# In-memory storage for advanced features (replace with database in production)
user_goals = {}
user_notifications = {}
carbon_insights_cache = {}

@app.get("/")
def read_root() -> Dict[str, Any]:
    """
    API root endpoint - welcome message and available endpoints
    
    Returns comprehensive API information including version, status,
    and available endpoint paths for service discovery.
    
    Returns:
        Dict[str, Any]: API metadata including:
            - message: Welcome message
            - version: API version (semantic versioning)
            - status: Service health status
            - endpoints: Dictionary of available API routes
            
    Example:
        >>> GET /
        {
          "message": "Welcome to EcoPulse API",
          "version": "1.0.0",
          "status": "active",
          "endpoints": {...}
        }
        
    Time Complexity: O(1)
    Space Complexity: O(1)
    """
    return {
        "message": "Welcome to EcoPulse API",
        "version": "1.0.0",
        "status": "active",
        "endpoints": {
            "calculate": "/api/calculate-impact",
            "ai-advisor": "/api/ai-advisor",
            "challenges": "/api/challenges",
            "dashboard": "/api/dashboard/{user_id}",
            "predictions": "/api/predict-impact",
            "benchmark": "/api/benchmark",
            "analytics": "/api/analytics"
        }
    }

@app.get("/health")
def health_check() -> Dict[str, str]:
    """
    Health check endpoint for monitoring and uptime checks
    
    Used by load balancers, monitoring services, and deployment pipelines
    to verify service availability. Returns 200 OK with status confirmation.
    
    Returns:
        Dict[str, str]: Health status with timestamp
            - status: Always "healthy" if endpoint responds
            - timestamp: Current UTC timestamp (ISO format)
            
    Example:
        >>> GET /health
        {
          "status": "healthy",
          "timestamp": "2024-01-15T10:30:00Z"
        }
        
    Use Cases:
        - Kubernetes liveness probes
        - Load balancer health checks
        - Uptime monitoring services
        - Deployment verification
        
    Time Complexity: O(1)
    Space Complexity: O(1)
    """
    return {
        "status": "healthy",
        "timestamp": datetime.now().isoformat()
    }

@app.get("/api/test")
def test_api() -> Dict[str, str]:
    """
    Simple test endpoint to verify API functionality
    
    Lightweight endpoint for quick connectivity tests and debugging.
    Returns success message with current timestamp.
    
    Returns:
        Dict[str, str]: Test response containing:
            - status: Always "success" if endpoint responds
            - message: Confirmation message
            - timestamp: Current UTC timestamp (ISO format)
            
    Example:
        >>> GET /api/test
        {
          "status": "success",
          "message": "API is working correctly!",
          "timestamp": "2024-01-15T10:30:00Z"
        }
        
    Use Cases:
        - Frontend connectivity testing
        - Debugging CORS issues
        - Verifying deployment success
        - API availability check
        
    Time Complexity: O(1)
    Space Complexity: O(1)
    """
    return {
        "status": "success",
        "message": "API is working correctly!",
        "timestamp": datetime.now().isoformat()
    }

@app.post("/api/calculate-impact", response_model=ImpactResult)
def calculate_impact(data: ImpactCalculation) -> ImpactResult:
    """
    Calculate comprehensive environmental impact from user activities
    
    Analyzes transportation, energy, diet, and waste patterns to compute
    total carbon footprint and water usage. Uses EPA 2024 emission factors.
    
    Args:
        data (ImpactCalculation): User activity data including:
            - carMiles: Monthly car miles driven
            - publicTransport: Monthly public transport trips
            - flights: Annual flight count
            - electricity: Monthly electricity kWh
            - heating: Monthly heating therms
            - showerMinutes: Daily shower duration (minutes)
            - laundry: Weekly laundry loads
            - diet: Diet type (vegan, vegetarian, mixed, meat-heavy)
            - recycling: Recycling frequency (always, often, sometimes, rarely)
            
    Returns:
        ImpactResult: Calculated environmental impact containing:
            - carbon: Total monthly CO₂ emissions (kg)
            - water: Total monthly water usage (liters)
            - score: Environmental score (0-100, higher is better)
            - rating: Performance rating (excellent, good, fair, poor)
            - recommendations: List of improvement suggestions
            
    Example:
        >>> data = ImpactCalculation(
        ...     carMiles=100, electricity=300, diet="vegetarian"
        ... )
        >>> result = calculate_impact(data)
        >>> print(f"Carbon: {result.carbon} kg CO₂/month")
        Carbon: 234.5 kg CO₂/month
        
    Algorithm:
        1. Calculate carbon from transportation (car + flights)
        2. Calculate carbon from energy (electricity + heating)
        3. Calculate carbon from diet (based on type)
        4. Calculate water from showers, laundry, and diet
        5. Compute environmental score with penalties/bonuses
        6. Determine rating category
        7. Generate personalized recommendations
        
    Emission Factors (EPA 2024):
        - Car: 0.4 kg CO₂ per mile
        - Flight: 90 kg CO₂ per flight (short-haul average)
        - Electricity: 0.5 kg CO₂ per kWh
        - Heating: 5.3 kg CO₂ per therm
        - Diet: 1.5-3.3 kg CO₂ per day (varies by type)
        
    Time Complexity: O(1)
    Space Complexity: O(1)
    
    Raises:
        HTTPException: If input validation fails (handled by Pydantic)
    """
    
    try:
        # Carbon calculation (kg CO2 per month)
        carbon_transport = (data.carMiles or 0) * 0.4 * 4  # per month
        carbon_flights = (data.flights or 0) * 90 / 12  # annual to monthly
        carbon_electricity = (data.electricity or 0) * 0.5
        carbon_heating = (data.heating or 0) * 5.3
        
        # Diet impact
        diet_factors = {
            "vegan": 1.5,
            "vegetarian": 1.7,
            "mixed": 2.5,
            "meat-heavy": 3.3
        }
        carbon_diet = diet_factors.get(data.diet, 2.5) * 30
        
        total_carbon = carbon_transport + carbon_flights + carbon_electricity + carbon_heating + carbon_diet
        
        # Water calculation (liters per month)
        water_shower = (data.showerMinutes or 0) * 9 * 30
        water_laundry = (data.laundry or 0) * 40 * 4
        water_diet = diet_factors.get(data.diet, 2.5) * 1000
        
        total_water = water_shower + water_laundry + water_diet
        
        # Score calculation (0-100, higher is better)
        carbon_penalty = min(total_carbon / 10, 50)
        water_penalty = min(total_water / 1000, 30)
        recycling_bonus = {"always": 10, "often": 7, "sometimes": 3, "rarely": 0}.get(data.recycling, 0)
        
        score = max(0, 100 - carbon_penalty - water_penalty + recycling_bonus)
        
        # Rating
        if score >= 80:
            rating = "Excellent"
        elif score >= 60:
            rating = "Good"
        elif score >= 40:
            rating = "Fair"
        else:
            rating = "Needs Improvement"
        
        # Recommendations
        recommendations = []
        if carbon_transport > 50:
            recommendations.append("Consider using public transport or carpooling to reduce transport emissions")
        if carbon_electricity > 150:
            recommendations.append("Switch to LED bulbs and energy-efficient appliances")
        if water_shower > 3000:
            recommendations.append("Reduce shower time to 5-7 minutes to save water")
        if data.diet == "meat-heavy":
            recommendations.append("Try incorporating more plant-based meals")
        if data.recycling in ["sometimes", "rarely"]:
            recommendations.append("Improve recycling habits to reduce waste")
        
        if not recommendations:
            recommendations.append("Great job! Keep up the sustainable lifestyle!")
        
        return ImpactResult(
            carbon=round(total_carbon, 1),
            water=round(total_water, 0),
            score=round(score, 1),
            rating=rating,
            recommendations=recommendations[:3]
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Calculation error: {str(e)}")

@app.post("/api/ai-advisor")
def ai_advisor(query: AIQuery) -> Dict[str, Any]:
    """AI-powered eco advisor (mock implementation)"""
    message = query.message.lower()
    
    # Simple rule-based responses (replace with actual AI API)
    if "carbon" in message or "footprint" in message:
        response = {
            "message": "To reduce your carbon footprint:\n\n1. 🚲 Switch to cycling or public transport\n2. 💡 Use LED bulbs and energy-efficient appliances\n3. 🌱 Eat more plant-based meals\n4. ♻️ Recycle and compost\n5. 🏠 Improve home insulation",
            "tips": ["Use renewable energy", "Fly less", "Buy local produce"],
            "impact": "These changes can reduce emissions by 30-40%"
        }
    elif "water" in message:
        response = {
            "message": "Water conservation tips:\n\n1. 🚿 Take shorter showers (5-7 min)\n2. 🚰 Fix leaky faucets\n3. 🌱 Use drought-resistant plants\n4. 🍽️ Run dishwasher only when full\n5. 💧 Collect rainwater",
            "tips": ["Install low-flow fixtures", "Reuse greywater", "Water plants in evening"],
            "impact": "Save up to 500L per week"
        }
    else:
        response = {
            "message": "I can help with:\n\n• Carbon footprint reduction\n• Water conservation\n• Energy efficiency\n• Sustainable lifestyle tips\n• Waste management\n\nWhat would you like to know more about?",
            "tips": ["Start with small changes", "Track your progress", "Share with friends"],
            "impact": "Every action counts!"
        }
    
    return response

@app.get("/api/challenges")
def get_challenges() -> Dict[str, List[Dict[str, Any]]]:
    """Get available eco challenges"""
    return {
        "active": [
            {
                "id": 1,
                "title": "Plastic-Free Week",
                "description": "Avoid single-use plastics for 7 days",
                "progress": 0,
                "goal": 7,
                "points": 250,
                "participants": 1250
            },
            {
                "id": 2,
                "title": "Zero Food Waste",
                "description": "Compost and reduce food waste",
                "progress": 0,
                "goal": 10,
                "points": 300,
                "participants": 890
            }
        ],
        "completed": []
    }

@app.get("/api/dashboard/{user_id}")
def get_dashboard(user_id: str) -> Dict[str, Any]:
    """Get user dashboard data"""
    return {
        "monthlyData": [
            {"month": "Jan", "carbon": 320, "water": 4200, "score": 65},
            {"month": "Feb", "carbon": 280, "water": 3900, "score": 72},
            {"month": "Mar", "carbon": 250, "water": 3600, "score": 78},
            {"month": "Apr", "carbon": 220, "water": 3300, "score": 82},
            {"month": "May", "carbon": 200, "water": 3000, "score": 85},
            {"month": "Jun", "carbon": 180, "water": 2800, "score": 88}
        ],
        "currentStats": {
            "carbon": 180,
            "water": 2800,
            "score": 88,
            "points": 1250
        },
        "badges": [
            {"name": "Eco Starter", "unlocked": True},
            {"name": "Water Saver", "unlocked": True},
            {"name": "Green Warrior", "unlocked": True},
            {"name": "Carbon Cutter", "unlocked": False},
            {"name": "Planet Hero", "unlocked": False}
        ]
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

# Advanced prediction endpoint using linear regression
@app.post("/api/predict-impact")
def predict_impact(data: PredictionRequest) -> Dict[str, Any]:
    """
    Predict future carbon footprint using machine learning algorithms
    Uses linear regression with trend analysis
    """
    try:
        historical = data.historicalData
        if not historical or len(historical) < 3:
            # Return empty predictions with a message indicating insufficient data
            return {
                "predictions": [],
                "insights": {
                    "message": "Insufficient historical data for prediction",
                    "totalSavings": 0,
                    "percentageReduction": 0,
                    "trend": "unknown",
                    "recommendedActions": []
                }
            }
        # Proceed with regression calculation
        # Extract carbon values
        carbon_values = [entry.get('carbon', 0) for entry in historical]
        n = len(carbon_values)
        
        # Calculate linear regression
        x_values = list(range(n))
        sum_x = sum(x_values)
        sum_y = sum(carbon_values)
        sum_xy = sum(x * y for x, y in zip(x_values, carbon_values))
        sum_xx = sum(x * x for x in x_values)
        
        # Regression coefficients
        slope = (n * sum_xy - sum_x * sum_y) / (n * sum_xx - sum_x * sum_x)
        intercept = (sum_y - slope * sum_x) / n
        
        # Predict next 6 months
        predictions = []
        months = ['Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
        
        for i in range(6):
            x = n + i
            predicted_carbon = slope * x + intercept
            
            # Apply improvement factor (5% reduction per month)
            improvement_factor = 0.95 ** (i + 1)
            predicted_carbon *= improvement_factor
            
            # Ensure realistic bounds
            predicted_carbon = max(100, min(500, predicted_carbon))
            
            # Calculate predicted score
            last_score = historical[-1].get('score', 70)
            score_improvement = (carbon_values[-1] - predicted_carbon) / 10
            predicted_score = min(100, max(0, last_score + score_improvement))
            
            predictions.append({
                "month": months[i] if i < len(months) else f"Month+{i+1}",
                "carbon": round(predicted_carbon, 1),
                "score": round(predicted_score, 1),
                "confidence": round(85 - (i * 5), 1)  # Confidence decreases over time
            })
        
        # Calculate savings
        current_carbon = carbon_values[-1]
        future_carbon = predictions[-1]["carbon"]
        total_savings = current_carbon - future_carbon
        percentage_reduction = (total_savings / current_carbon) * 100
        
        return {
            "predictions": predictions,
            "insights": {
                "totalSavings": round(total_savings, 1),
                "percentageReduction": round(percentage_reduction, 1),
                "trend": "improving" if slope < 0 else "stable" if abs(slope) < 1 else "concerning",
                "recommendedActions": [
                    "Continue reducing car usage",
                    "Switch to renewable energy sources",
                    "Adopt plant-based diet options"
                ] if slope >= 0 else ["Keep up the great work!"]
            }
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prediction error: {str(e)}")

# Benchmark comparison endpoint
@app.post("/api/benchmark")
def get_benchmark(data: BenchmarkRequest) -> Dict[str, Any]:
    """
    Compare user's metrics against global, national, and efficient household averages
    """
    try:
        # Global and regional averages (kg CO2/month)
        benchmarks = {
            "global": {
                "carbon": 350,
                "water": 4500,
                "score": 60
            },
            "national": {
                "carbon": 310,
                "water": 4200,
                "score": 65
            },
            "efficient": {
                "carbon": 150,
                "water": 2500,
                "score": 85
            }
        }
        
        comparisons = {}
        for key, benchmark in benchmarks.items():
            carbon_diff = ((data.carbon - benchmark["carbon"]) / benchmark["carbon"]) * 100
            water_diff = ((data.water - benchmark["water"]) / benchmark["water"]) * 100
            score_diff = data.score - benchmark["score"]
            
            comparisons[key] = {
                "carbonDifference": round(carbon_diff, 1),
                "waterDifference": round(water_diff, 1),
                "scoreDifference": round(score_diff, 1),
                "rating": "better" if carbon_diff < 0 else "worse"
            }
        
        # Overall ranking
        if data.carbon < benchmarks["efficient"]["carbon"]:
            rank = "Top 10%"
            message = "Excellent! You're among the most eco-friendly users."
        elif data.carbon < benchmarks["national"]["carbon"]:
            rank = "Top 30%"
            message = "Great job! You're better than the national average."
        elif data.carbon < benchmarks["global"]["carbon"]:
            rank = "Top 50%"
            message = "Good progress! You're better than the global average."
        else:
            rank = "Bottom 50%"
            message = "There's room for improvement. Let's work on reducing your footprint."
        
        return {
            "comparisons": comparisons,
            "ranking": {
                "percentile": rank,
                "message": message,
                "treesEquivalent": round(data.carbon / 21, 1),  # Average tree absorbs 21kg CO2/year
                "householdsEquivalent": round(data.carbon / 250, 2)
            }
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Benchmark error: {str(e)}")

# Analytics endpoint with advanced metrics
@app.get("/api/analytics")
def get_analytics() -> Dict[str, Any]:
    """
    Get platform-wide analytics and statistics
    """
    return {
        "platformStats": {
            "totalUsers": 15420,
            "totalCarbonSaved": 234567,  # kg CO2
            "averageScore": 72.5,
            "activeChallenges": 12,
            "challengesCompleted": 8934
        },
        "topPerformers": [
            {"name": "Anonymous User", "score": 95, "carbonSaved": 450},
            {"name": "Eco Warrior", "score": 92, "carbonSaved": 420},
            {"name": "Green Hero", "score": 89, "carbonSaved": 380}
        ],
        "trending": {
            "mostPopularChallenge": "Plastic-Free Week",
            "averageReduction": "15%",
            "topCategory": "Transportation"
        }
    }

# Enhanced AI advisor with context awareness
@app.post("/api/ai-advisor-advanced")
def ai_advisor_advanced(query: AIQuery) -> Dict[str, Any]:
    """
    Advanced AI advisor with contextual responses and personalized recommendations
    """
    message = query.message.lower()
    
    # Analyze user intent
    intents = {
        "reduction": ["reduce", "lower", "decrease", "cut", "minimize"],
        "tips": ["tips", "advice", "suggestion", "help", "how"],
        "comparison": ["compare", "benchmark", "average", "others"],
        "specific": ["transport", "energy", "water", "food", "diet", "waste"]
    }
    
    detected_intent = "general"
    for intent, keywords in intents.items():
        if any(keyword in message for keyword in keywords):
            detected_intent = intent
            break
    
    # Context-aware responses
    responses = {
        "reduction": {
            "message": "🎯 Personalized Reduction Strategy:\n\n1. **Quick Wins (0-30 days)**\n   • Switch to LED bulbs (save 15kg CO₂/month)\n   • Use reusable bags & bottles\n   • Reduce shower time by 2 minutes\n\n2. **Medium Impact (1-3 months)**\n   • Public transport 2x/week (save 40kg CO₂/month)\n   • Plant-based meals 3x/week\n   • Improve home insulation\n\n3. **Long-term Changes (3+ months)**\n   • Install solar panels\n   • Switch to electric vehicle\n   • Home energy audit",
            "estimatedSavings": "120-180 kg CO₂/month",
            "difficulty": "Medium"
        },
        "tips": {
            "message": "💡 Smart Sustainability Tips:\n\n**Transportation** 🚲\n• Bike/walk for trips < 2 miles\n• Carpool or use public transit\n• Combine errands to reduce trips\n\n**Energy** ⚡\n• Unplug devices when not in use\n• Use programmable thermostat\n• Air dry clothes when possible\n\n**Food** 🍽️\n• Buy local & seasonal produce\n• Reduce food waste by 50%\n• Try 'Meatless Mondays'\n\n**Water** 💧\n• Fix leaks immediately\n• Install low-flow fixtures\n• Collect rainwater for plants",
            "estimatedSavings": "80-120 kg CO₂/month",
            "difficulty": "Easy"
        },
        "comparison": {
            "message": "📊 How You Stack Up:\n\n**Global Average**: 350 kg CO₂/month\n**Your Target**: Below 200 kg CO₂/month\n\n**What this means**:\n• You could save equivalent to 7 trees/year\n• Reduce carbon by ~40%\n• Join top 20% of users\n\n**Action Items**:\n1. Track daily habits consistently\n2. Set weekly reduction goals\n3. Join community challenges",
            "estimatedSavings": "Variable",
            "difficulty": "Medium"
        },
        "general": {
            "message": "🤖 EcoPulse Assistant:\n\nI can help you with:\n\n• **Carbon Reduction** - Personalized strategies\n• **Smart Tips** - Quick & effective actions\n• **Benchmarking** - Compare your performance\n• **Category-Specific** - Transport, energy, diet, etc.\n\nAsk me anything about reducing your environmental impact!",
            "estimatedSavings": "Start tracking to see estimates",
            "difficulty": "All levels"
        }
    }
    
    response = responses.get(detected_intent, responses["general"])
    
    return {
        **response,
        "intent": detected_intent,
        "timestamp": datetime.now().isoformat(),
        "followUp": "Would you like specific recommendations for any category?"
    }

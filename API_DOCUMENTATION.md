# 📚 Carbon AI API Documentation

**Base URL:** `<your-api-url>` (configure after deployment)

**API Version:** 1.0.0

---

## 🔐 Authentication

Currently, the API is open for public use. Future versions will include API key authentication.

---

## 📍 Endpoints

### 1. Health Check

**GET** `/`

Check if the API is running.

**Response:**
```json
{
  "message": "Welcome to Carbon AI API",
  "version": "1.0.0",
  "status": "active"
}
```

---

### 2. Calculate Carbon Impact

**POST** `/api/calculate-impact`

Calculate carbon footprint based on user activities.

**Request Body:**
```json
{
  "carMiles": 100,
  "publicTransport": 50,
  "flights": 2,
  "electricity": 500,
  "heating": 300,
  "showerMinutes": 15,
  "laundry": 5,
  "diet": "mixed",
  "recycling": "always"
}
```

**Parameters:**
| Field | Type | Description | Required |
|-------|------|-------------|----------|
| carMiles | number | Miles driven per month | Yes |
| publicTransport | number | Miles on public transport per month | Yes |
| flights | number | Number of flights per year | Yes |
| electricity | number | kWh consumed per month | Yes |
| heating | number | Therms of gas per month | Yes |
| showerMinutes | number | Minutes showering per day | Yes |
| laundry | number | Loads per week | Yes |
| diet | string | "vegan", "vegetarian", "mixed", "meat-heavy" | Yes |
| recycling | string | "always", "sometimes", "never" | Yes |

**Response:**
```json
{
  "totalEmissions": 1250.5,
  "breakdown": {
    "transportation": 450.2,
    "energy": 380.5,
    "water": 50.3,
    "diet": 320.0,
    "waste": 49.5
  },
  "comparison": {
    "vsAverage": "+15%",
    "percentile": 65
  },
  "rating": "moderate",
  "treesNeeded": 63
}
```

---

### 3. Get AI Eco-Advice

**POST** `/api/eco-advice`

Get personalized AI-powered recommendations.

**Request Body:**
```json
{
  "category": "transportation",
  "currentEmissions": 450.2,
  "userContext": {
    "carMiles": 100,
    "publicTransport": 50
  }
}
```

**Parameters:**
| Field | Type | Description | Required |
|-------|------|-------------|----------|
| category | string | "transportation", "energy", "water", "diet", "waste", "general" | Yes |
| currentEmissions | number | Current emissions in kg CO2 | No |
| userContext | object | User's current activities | No |

**Response:**
```json
{
  "advice": "Switch to public transportation for 2 days/week to reduce emissions by 180 kg CO2 annually",
  "estimatedSavings": "180 kg CO2/year",
  "difficulty": "easy",
  "impact": "medium"
}
```

---

### 4. Predict Future Impact

**POST** `/api/predict-impact`

Predict future carbon footprint based on current trends.

**Request Body:**
```json
{
  "currentEmissions": 1250.5,
  "changeRate": -5,
  "months": 12
}
```

**Response:**
```json
{
  "predictions": [
    { "month": 1, "emissions": 1188.0 },
    { "month": 2, "emissions": 1128.6 },
    ...
  ],
  "totalReduction": 625.3,
  "trend": "improving"
}
```

---

### 5. Compare with Benchmarks

**POST** `/api/compare`

Compare user's footprint with various benchmarks.

**Request Body:**
```json
{
  "totalEmissions": 1250.5,
  "category": "transportation"
}
```

**Response:**
```json
{
  "userEmissions": 1250.5,
  "nationalAverage": 1100.0,
  "globalAverage": 900.0,
  "targetGoal": 700.0,
  "percentile": 65,
  "comparison": "above_average"
}
```

---

### 6. Get Leaderboard

**GET** `/api/leaderboard?timeframe=weekly`

Get community leaderboard rankings.

**Query Parameters:**
| Parameter | Type | Options | Default |
|-----------|------|---------|---------|
| timeframe | string | "daily", "weekly", "monthly", "all-time" | "weekly" |
| limit | number | 1-100 | 10 |

**Response:**
```json
{
  "leaderboard": [
    {
      "rank": 1,
      "username": "EcoWarrior",
      "emissions": 450.0,
      "reduction": 35.5,
      "streak": 30
    },
    ...
  ],
  "userRank": 42,
  "totalParticipants": 1523
}
```

---

### 7. Get Challenges

**GET** `/api/challenges`

Get available environmental challenges.

**Response:**
```json
{
  "challenges": [
    {
      "id": "walk-to-work-week",
      "title": "Walk to Work Week",
      "description": "Walk or bike to work for 5 days",
      "difficulty": "medium",
      "reward": 100,
      "participants": 523,
      "duration": "7 days"
    },
    ...
  ]
}
```

---

## 📊 Response Codes

| Code | Description |
|------|-------------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request - Invalid parameters |
| 404 | Not Found |
| 429 | Too Many Requests - Rate limit exceeded |
| 500 | Internal Server Error |

---

## 🚦 Rate Limiting

- **Limit:** 100 requests per 15 minutes per IP
- **Headers:** 
  - `X-RateLimit-Limit`: Maximum requests allowed
  - `X-RateLimit-Remaining`: Requests remaining
  - `X-RateLimit-Reset`: Time when limit resets

---

## 🔍 Error Responses

All errors follow this format:

```json
{
  "error": "Error message",
  "code": "ERROR_CODE",
  "details": {
    "field": "carMiles",
    "message": "Must be a positive number"
  }
}
```

---

## 📦 SDK Examples

### JavaScript/Node.js

```javascript
const API_URL = 'https://your-api-url.com';

async function calculateFootprint(data) {
  const response = await fetch(`${API_URL}/api/calculate-impact`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data)
  });
  
  return await response.json();
}

// Usage
const result = await calculateFootprint({
  carMiles: 100,
  electricity: 500,
  // ... other fields
});
```

### Python

```python
import requests

API_URL = 'https://your-api-url.com'

def calculate_footprint(data):
    response = requests.post(
        f'{API_URL}/api/calculate-impact',
        json=data
    )
    return response.json()

# Usage
result = calculate_footprint({
    'carMiles': 100,
    'electricity': 500,
    # ... other fields
})
```

### cURL

```bash
curl -X POST https://your-api-url.com/api/calculate-impact \
  -H "Content-Type: application/json" \
  -d '{
    "carMiles": 100,
    "electricity": 500,
    "diet": "mixed"
  }'
```

---

## 🧪 Testing

Interactive API documentation available at:
**https://your-api-url.com/docs** (after deployment)

---

## 📞 Support

For API support or questions:
- GitHub Issues: https://github.com/technest078-cmyk/hack2skill/issues
- Email: support@carbon.ai

---

## 📄 License

API usage is governed by the MIT License.

---

**Last Updated:** June 2026
**Version:** 1.0.0

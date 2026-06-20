import pytest
from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

class TestHealthEndpoints:
    """Test health and status endpoints"""
    
    def test_root_endpoint(self):
        """Test root endpoint returns API info"""
        response = client.get("/")
        assert response.status_code == 200
        data = response.json()
        assert "message" in data
        assert "EcoPulse" in data["message"]
    
    def test_health_check(self):
        """Test health check endpoint"""
        response = client.get("/health")
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "healthy"
    
    def test_api_test_endpoint(self):
        """Test API test endpoint"""
        response = client.get("/api/test")
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "success"


class TestCarbonCalculation:
    """Test carbon footprint calculation endpoints"""
    
    def test_calculate_impact_valid_data(self):
        """Test carbon calculation with valid data"""
        payload = {
            "carMiles": 100,
            "publicTransport": 50,
            "flights": 2,
            "electricity": 300,
            "heating": 150,
            "showerMinutes": 10,
            "laundry": 4,
            "diet": "mixed",
            "recycling": "sometimes"
        }
        response = client.post("/api/calculate-impact", json=payload)
        assert response.status_code == 200
        data = response.json()
        assert "carbon" in data
        assert "water" in data
        assert data["carbon"] > 0
    
    def test_calculate_impact_empty_data(self):
        """Test carbon calculation with empty data"""
        payload = {}
        response = client.post("/api/calculate-impact", json=payload)
        assert response.status_code == 200
        data = response.json()
        assert data["carbon"] >= 0
    
    def test_calculate_impact_missing_fields(self):
        """Test carbon calculation with missing fields"""
        payload = {
            "carMiles": 50
        }
        response = client.post("/api/calculate-impact", json=payload)
        # Should handle missing fields gracefully
        assert response.status_code in [200, 422]


class TestAIAdvisor:
    """Test AI advisor endpoints"""
    
    def test_ai_advisor_basic(self):
        """Test basic AI advisor query"""
        payload = {
            "message": "How can I reduce my carbon footprint?"
        }
        response = client.post("/api/ai-advisor", json=payload)
        assert response.status_code == 200
        data = response.json()
        assert "message" in data
        assert len(data["message"]) > 0
    
    def test_ai_advisor_empty_query(self):
        """Test AI advisor with empty query"""
        payload = {
            "message": ""
        }
        response = client.post("/api/ai-advisor", json=payload)
        assert response.status_code in [200, 422]
    
    def test_ai_advisor_advanced(self):
        """Test advanced AI advisor"""
        payload = {
            "message": "transportation tips"
        }
        response = client.post("/api/ai-advisor-advanced", json=payload)
        assert response.status_code == 200
        data = response.json()
        assert "message" in data


class TestPredictions:
    """Test prediction endpoints"""
    
    def test_predict_impact(self):
        """Test carbon prediction"""
        payload = {
            "historicalData": [
                {"month": "Jan", "carbon": 300},
                {"month": "Feb", "carbon": 280},
                {"month": "Mar", "carbon": 260},
                {"month": "Apr", "carbon": 250}
            ],
            "targetMonths": 6
        }
        response = client.post("/api/predict-impact", json=payload)
        assert response.status_code == 200
        data = response.json()
        assert "predictions" in data
        assert "insights" in data
        assert len(data["predictions"]) == 6
    
    def test_predict_impact_insufficient_data(self):
        """Test prediction with insufficient data"""
        payload = {
            "historicalData": [
                {"month": "Jan", "carbon": 300}
            ],
            "targetMonths": 6
        }
        response = client.post("/api/predict-impact", json=payload)
        # Should handle gracefully
        assert response.status_code in [200, 422]


class TestBenchmarking:
    """Test benchmarking endpoints"""
    
    def test_benchmark_comparison(self):
        """Test benchmark comparison"""
        payload = {
            "carbon": 250,
            "water": 3000,
            "score": 75
        }
        response = client.post("/api/benchmark", json=payload)
        assert response.status_code == 200
        data = response.json()
        assert "comparisons" in data
        assert "ranking" in data
    
    def test_benchmark_below_average(self):
        """Test benchmark for below average user"""
        payload = {
            "carbon": 150,
            "water": 2000,
            "score": 85
        }
        response = client.post("/api/benchmark", json=payload)
        assert response.status_code == 200
        data = response.json()
        assert data["comparisons"]["global"]["carbonDifference"] < 0


class TestChallenges:
    """Test challenge endpoints"""
    
    def test_get_challenges(self):
        """Test getting challenges list"""
        response = client.get("/api/challenges")
        assert response.status_code == 200
        data = response.json()
        assert "active" in data
        assert len(data["active"]) > 0
    
    def test_challenges_structure(self):
        """Test challenges have correct structure"""
        response = client.get("/api/challenges")
        data = response.json()
        challenge = data["active"][0]
        assert "id" in challenge
        assert "title" in challenge
        assert "description" in challenge
        assert "points" in challenge


class TestAnalytics:
    """Test analytics endpoints"""
    
    def test_get_analytics(self):
        """Test getting platform analytics"""
        response = client.get("/api/analytics")
        assert response.status_code == 200
        data = response.json()
        assert "platformStats" in data
        assert "topPerformers" in data
        assert "trending" in data
    
    def test_analytics_values(self):
        """Test analytics return positive values"""
        response = client.get("/api/analytics")
        data = response.json()
        assert data["platformStats"]["totalUsers"] > 0
        assert data["platformStats"]["totalCarbonSaved"] > 0


class TestDashboard:
    """Test dashboard endpoints"""
    
    def test_dashboard_endpoint(self):
        """Test dashboard data endpoint"""
        response = client.get("/api/dashboard/test_user_123")
        assert response.status_code == 200
        data = response.json()
        assert "monthlyData" in data
        assert "currentStats" in data
        assert "badges" in data
    
    def test_dashboard_stats_structure(self):
        """Test dashboard stats structure"""
        response = client.get("/api/dashboard/test_user_123")
        data = response.json()
        stats = data["currentStats"]
        assert "carbon" in stats
        assert len(data["monthlyData"]) > 0


# Performance Tests
class TestPerformance:
    """Test API performance"""
    
    def test_response_time_health(self):
        """Test health endpoint response time"""
        import time
        start = time.time()
        response = client.get("/health")
        duration = time.time() - start
        assert response.status_code == 200
        assert duration < 1.0  # Should respond within 1 second
    
    def test_response_time_calculation(self):
        """Test calculation endpoint response time"""
        import time
        payload = {
            "carMiles": 100,
            "publicTransport": 50,
            "flights": 2,
            "electricity": 300,
            "heating": 150,
            "showerMinutes": 10,
            "laundry": 4,
            "diet": "mixed",
            "recycling": "sometimes"
        }
        start = time.time()
        response = client.post("/api/calculate-impact", json=payload)
        duration = time.time() - start
        assert response.status_code == 200
        assert duration < 2.0  # Should calculate within 2 seconds


# Run tests with: pytest test_main.py -v
# Run with coverage: pytest test_main.py --cov=main --cov-report=html

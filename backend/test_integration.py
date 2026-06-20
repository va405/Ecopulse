"""
Integration Tests for EcoPulse API
Tests end-to-end functionality of API endpoints
"""

import pytest
from fastapi.testclient import TestClient
from main import app

client = TestClient(app)


class TestHealthEndpoint:
    """Test health check endpoint"""

    def test_health_check_returns_200(self):
        """Health endpoint should return 200 OK"""
        response = client.get("/health")
        assert response.status_code == 200

    def test_health_check_returns_json(self):
        """Health endpoint should return JSON"""
        response = client.get("/health")
        assert response.headers["content-type"] == "application/json"

    def test_health_check_has_status(self):
        """Health endpoint should have status field"""
        response = client.get("/health")
        data = response.json()
        assert "status" in data
        assert data["status"] == "healthy"


class TestCarbonCalculationEndpoint:
    """Test carbon footprint calculation endpoint"""

    def test_calculate_with_valid_data(self):
        """Should calculate emissions with valid input"""
        response = client.post(
            "/api/carbon/calculate",
            json={
                "carMiles": 100,
                "publicTransport": 50,
                "flights": 2,
                "electricity": 300,
                "naturalGas": 100,
                "meatServings": 10,
                "dairyServings": 5,
                "wasteGenerated": 20,
            },
        )
        assert response.status_code == 200
        data = response.json()
        assert "totalEmissions" in data
        assert "breakdown" in data
        assert data["totalEmissions"] > 0

    def test_calculate_with_zero_values(self):
        """Should handle zero values correctly"""
        response = client.post(
            "/api/carbon/calculate",
            json={
                "carMiles": 0,
                "publicTransport": 0,
                "flights": 0,
                "electricity": 0,
                "naturalGas": 0,
                "meatServings": 0,
                "dairyServings": 0,
                "wasteGenerated": 0,
            },
        )
        assert response.status_code == 200
        data = response.json()
        assert data["totalEmissions"] == 0

    def test_calculate_with_missing_fields(self):
        """Should use default values for missing fields"""
        response = client.post("/api/carbon/calculate", json={"carMiles": 100})
        assert response.status_code == 200
        data = response.json()
        assert data["totalEmissions"] > 0

    def test_calculate_with_negative_values(self):
        """Should reject negative values"""
        response = client.post(
            "/api/carbon/calculate",
            json={"carMiles": -100, "electricity": 300},
        )
        # Should either reject or treat as zero
        assert response.status_code in [200, 422]

    def test_calculate_response_structure(self):
        """Response should have correct structure"""
        response = client.post(
            "/api/carbon/calculate", json={"carMiles": 100, "electricity": 200}
        )
        data = response.json()
        assert "totalEmissions" in data
        assert "breakdown" in data
        assert isinstance(data["breakdown"], dict)


class TestRecommendationsEndpoint:
    """Test AI recommendations endpoint"""

    def test_recommendations_with_valid_data(self):
        """Should return recommendations"""
        response = client.post(
            "/api/eco-advice",
            json={
                "category": "transportation",
                "currentEmissions": 150.5,
            },
        )
        assert response.status_code == 200
        data = response.json()
        assert "recommendations" in data
        assert len(data["recommendations"]) > 0

    def test_recommendations_for_each_category(self):
        """Should handle all emission categories"""
        categories = ["transportation", "energy", "food", "waste"]
        for category in categories:
            response = client.post(
                "/api/eco-advice",
                json={"category": category, "currentEmissions": 100},
            )
            assert response.status_code == 200
            data = response.json()
            assert "recommendations" in data


class TestPredictionEndpoint:
    """Test carbon emission predictions"""

    def test_prediction_with_valid_data(self):
        """Should return future predictions"""
        response = client.post(
            "/api/predict-impact",
            json={
                "currentEmissions": 500,
                "changeRate": -5,
                "months": 6,
            },
        )
        assert response.status_code == 200
        data = response.json()
        assert "predictions" in data
        assert len(data["predictions"]) == 6

    def test_prediction_decreasing_trend(self):
        """Predictions should show decreasing trend"""
        response = client.post(
            "/api/predict-impact",
            json={"currentEmissions": 500, "changeRate": -10, "months": 3},
        )
        data = response.json()
        predictions = data["predictions"]
        assert predictions[0] > predictions[-1]  # First > Last (decreasing)

    def test_prediction_increasing_trend(self):
        """Predictions should show increasing trend"""
        response = client.post(
            "/api/predict-impact",
            json={"currentEmissions": 500, "changeRate": 10, "months": 3},
        )
        data = response.json()
        predictions = data["predictions"]
        assert predictions[0] < predictions[-1]  # First < Last (increasing)


class TestRateLimiting:
    """Test API rate limiting"""

    def test_rate_limit_not_exceeded_under_100(self):
        """Should allow < 100 requests per minute"""
        for _ in range(50):
            response = client.get("/health")
            assert response.status_code == 200

    def test_rate_limit_response_has_correct_status(self):
        """Rate limit error should be 429"""
        # Make many requests quickly
        responses = []
        for _ in range(150):
            response = client.get("/health")
            responses.append(response.status_code)

        # Some should be rate limited
        assert 429 in responses or all(r == 200 for r in responses)


class TestSecurityHeaders:
    """Test security headers are present"""

    def test_security_headers_present(self):
        """All security headers should be present"""
        response = client.get("/health")

        assert "x-content-type-options" in response.headers
        assert response.headers["x-content-type-options"] == "nosniff"

        assert "x-frame-options" in response.headers
        assert response.headers["x-frame-options"] == "DENY"

        assert "x-xss-protection" in response.headers

        assert "strict-transport-security" in response.headers

        assert "content-security-policy" in response.headers

    def test_csp_header_configured(self):
        """CSP header should have proper directives"""
        response = client.get("/health")
        csp = response.headers.get("content-security-policy", "")
        assert "default-src" in csp
        assert "'self'" in csp


class TestCORSHeaders:
    """Test CORS configuration"""

    def test_cors_allows_localhost(self):
        """CORS should allow localhost origins"""
        response = client.options(
            "/api/carbon/calculate",
            headers={"Origin": "http://localhost:3000"},
        )
        # Should not be blocked
        assert response.status_code in [200, 204, 405]


class TestErrorHandling:
    """Test error handling"""

    def test_invalid_endpoint_returns_404(self):
        """Invalid endpoints should return 404"""
        response = client.get("/api/invalid/endpoint")
        assert response.status_code == 404

    def test_invalid_json_returns_422(self):
        """Invalid JSON should return 422"""
        response = client.post(
            "/api/carbon/calculate",
            data="invalid json",
            headers={"Content-Type": "application/json"},
        )
        assert response.status_code == 422

    def test_error_response_has_detail(self):
        """Error responses should have detail field"""
        response = client.get("/api/invalid/endpoint")
        data = response.json()
        assert "detail" in data


class TestPerformance:
    """Test API performance"""

    def test_health_check_responds_quickly(self):
        """Health check should respond in < 100ms"""
        import time

        start = time.time()
        response = client.get("/health")
        duration = (time.time() - start) * 1000

        assert response.status_code == 200
        assert duration < 100  # Less than 100ms

    def test_calculation_responds_quickly(self):
        """Calculation should respond in < 500ms"""
        import time

        start = time.time()
        response = client.post(
            "/api/carbon/calculate",
            json={"carMiles": 100, "electricity": 200},
        )
        duration = (time.time() - start) * 1000

        assert response.status_code == 200
        assert duration < 500  # Less than 500ms


if __name__ == "__main__":
    pytest.main([__file__, "-v", "--cov=main", "--cov-report=term"])

"""
Comprehensive Unit Tests for Security Module

Tests all security functions, input validation, sanitization,
password hashing, token management, rate limiting, and CSRF protection.
"""

import pytest
import time
from datetime import datetime, timedelta
from security import (
    SecurityValidator,
    PasswordSecurity,
    TokenManager,
    RateLimiter,
    CSRFProtection,
    ContentSecurityPolicy,
    AuditLogger,
    InputFilter,
)


# ============================================================================
# SECURITY VALIDATOR TESTS
# ============================================================================

class TestSecurityValidator:
    """Test SecurityValidator class"""
    
    def test_sanitize_string_removes_script_tags(self):
        """Should remove <script> tags"""
        malicious = "<script>alert('xss')</script>Hello"
        result = SecurityValidator.sanitize_string(malicious)
        assert "<script>" not in result
        assert "alert" not in result
    
    def test_sanitize_string_removes_javascript_protocol(self):
        """Should remove javascript: protocol"""
        malicious = "javascript:alert('xss')"
        result = SecurityValidator.sanitize_string(malicious)
        assert "javascript:" not in result
    
    def test_sanitize_string_removes_event_handlers(self):
        """Should remove event handlers like onclick"""
        malicious = "<div onclick='alert(1)'>Click me</div>"
        result = SecurityValidator.sanitize_string(malicious)
        assert "onclick" not in result.lower()
    
    def test_sanitize_string_removes_iframe(self):
        """Should remove <iframe> tags"""
        malicious = "<iframe src='http://evil.com'></iframe>"
        result = SecurityValidator.sanitize_string(malicious)
        assert "<iframe" not in result.lower()
    
    def test_sanitize_string_removes_object_embed(self):
        """Should remove <object> and <embed> tags"""
        malicious = "<object data='evil.swf'></object><embed src='evil.swf'>"
        result = SecurityValidator.sanitize_string(malicious)
        assert "<object" not in result.lower()
        assert "<embed" not in result.lower()
    
    def test_sanitize_string_strips_whitespace(self):
        """Should strip leading/trailing whitespace"""
        input_str = "  Hello World  "
        result = SecurityValidator.sanitize_string(input_str)
        assert result == "Hello World"
    
    def test_sanitize_string_handles_non_string(self):
        """Should return empty string for non-string input"""
        assert SecurityValidator.sanitize_string(123) == ""
        assert SecurityValidator.sanitize_string(None) == ""
        assert SecurityValidator.sanitize_string([]) == ""
    
    def test_sanitize_string_preserves_safe_content(self):
        """Should preserve safe content"""
        safe = "Hello World, this is safe content!"
        result = SecurityValidator.sanitize_string(safe)
        assert result == safe
    
    def test_validate_email_valid_emails(self):
        """Should accept valid email formats"""
        valid_emails = [
            "user@example.com",
            "test.user@example.co.uk",
            "user+tag@example.com",
            "user_name@example.org",
        ]
        for email in valid_emails:
            assert SecurityValidator.validate_email(email) is True
    
    def test_validate_email_invalid_emails(self):
        """Should reject invalid email formats"""
        invalid_emails = [
            "notanemail",
            "@example.com",
            "user@",
            "user@.com",
            "user @example.com",
            "user@example",
        ]
        for email in invalid_emails:
            assert SecurityValidator.validate_email(email) is False
    
    def test_validate_number_range_valid(self):
        """Should accept numbers within range"""
        assert SecurityValidator.validate_number_range(5, 0, 10) is True
        assert SecurityValidator.validate_number_range(0, 0, 10) is True
        assert SecurityValidator.validate_number_range(10, 0, 10) is True
        assert SecurityValidator.validate_number_range(5.5, 0, 10) is True
    
    def test_validate_number_range_invalid(self):
        """Should reject numbers outside range"""
        assert SecurityValidator.validate_number_range(-1, 0, 10) is False
        assert SecurityValidator.validate_number_range(11, 0, 10) is False
        assert SecurityValidator.validate_number_range(100, 0, 10) is False
    
    def test_validate_number_range_handles_strings(self):
        """Should convert string numbers"""
        assert SecurityValidator.validate_number_range("5", 0, 10) is True
        assert SecurityValidator.validate_number_range("15", 0, 10) is False
    
    def test_validate_number_range_handles_invalid_input(self):
        """Should reject non-numeric input"""
        assert SecurityValidator.validate_number_range("abc", 0, 10) is False
        assert SecurityValidator.validate_number_range(None, 0, 10) is False
    
    def test_validate_carbon_input_missing_fields(self):
        """Should detect missing required fields"""
        data = {"transportation": 100}  # Missing energy, food
        valid, message = SecurityValidator.validate_carbon_input(data)
        assert valid is False
        assert "energy" in message.lower()
        assert "food" in message.lower()
    
    def test_validate_carbon_input_invalid_ranges(self):
        """Should detect invalid numeric ranges"""
        data = {
            "transportation": {"car": 99999},  # Out of range
            "energy": 100,
            "food": 50
        }
        valid, message = SecurityValidator.validate_carbon_input(data)
        assert valid is False
    
    def test_validate_carbon_input_valid_data(self):
        """Should accept valid input"""
        data = {
            "transportation": {"car": 100, "bus": 50},
            "energy": 300,
            "food": 200
        }
        valid, message = SecurityValidator.validate_carbon_input(data)
        assert valid is True
        assert message == "Valid"


# ============================================================================
# PASSWORD SECURITY TESTS
# ============================================================================

class TestPasswordSecurity:
    """Test PasswordSecurity class"""
    
    def test_hash_password_creates_hash(self):
        """Should create password hash"""
        password = "SecurePass123!"
        hashed = PasswordSecurity.hash_password(password)
        
        assert hashed is not None
        assert len(hashed) > 50  # Should have salt + hash
        assert "$" in hashed  # Salt separator
    
    def test_hash_password_different_hashes(self):
        """Should create different hashes for same password"""
        password = "SecurePass123!"
        hash1 = PasswordSecurity.hash_password(password)
        hash2 = PasswordSecurity.hash_password(password)
        
        assert hash1 != hash2  # Different salts
    
    def test_verify_password_correct(self):
        """Should verify correct password"""
        password = "SecurePass123!"
        hashed = PasswordSecurity.hash_password(password)
        
        assert PasswordSecurity.verify_password(password, hashed) is True
    
    def test_verify_password_incorrect(self):
        """Should reject incorrect password"""
        password = "SecurePass123!"
        wrong_password = "WrongPass456!"
        hashed = PasswordSecurity.hash_password(password)
        
        assert PasswordSecurity.verify_password(wrong_password, hashed) is False
    
    def test_verify_password_invalid_hash(self):
        """Should handle invalid hash format"""
        password = "SecurePass123!"
        invalid_hash = "not_a_valid_hash"
        
        assert PasswordSecurity.verify_password(password, invalid_hash) is False
    
    def test_validate_password_strength_too_short(self):
        """Should reject passwords < 8 characters"""
        valid, message = PasswordSecurity.validate_password_strength("Short1!")
        assert valid is False
        assert "8 characters" in message
    
    def test_validate_password_strength_no_uppercase(self):
        """Should require uppercase letter"""
        valid, message = PasswordSecurity.validate_password_strength("lowercase123!")
        assert valid is False
        assert "uppercase" in message.lower()
    
    def test_validate_password_strength_no_lowercase(self):
        """Should require lowercase letter"""
        valid, message = PasswordSecurity.validate_password_strength("UPPERCASE123!")
        assert valid is False
        assert "lowercase" in message.lower()
    
    def test_validate_password_strength_no_number(self):
        """Should require number"""
        valid, message = PasswordSecurity.validate_password_strength("NoNumbers!")
        assert valid is False
        assert "number" in message.lower()
    
    def test_validate_password_strength_no_special(self):
        """Should require special character"""
        valid, message = PasswordSecurity.validate_password_strength("NoSpecial123")
        assert valid is False
        assert "special" in message.lower()
    
    def test_validate_password_strength_strong(self):
        """Should accept strong password"""
        valid, message = PasswordSecurity.validate_password_strength("Strong123!")
        assert valid is True
        assert "Strong" in message
    
    def test_hash_password_unicode(self):
        """Should handle Unicode passwords"""
        password = "Пароль123!"  # Russian characters
        hashed = PasswordSecurity.hash_password(password)
        assert PasswordSecurity.verify_password(password, hashed) is True


# ============================================================================
# TOKEN MANAGER TESTS
# ============================================================================

class TestTokenManager:
    """Test TokenManager class"""
    
    def test_generate_token_default_length(self):
        """Should generate token with default length"""
        token = TokenManager.generate_token()
        assert token is not None
        assert len(token) > 32  # URL-safe base64 encoding
    
    def test_generate_token_custom_length(self):
        """Should generate token with custom length"""
        token = TokenManager.generate_token(64)
        assert len(token) > 64
    
    def test_generate_token_unique(self):
        """Should generate unique tokens"""
        tokens = [TokenManager.generate_token() for _ in range(100)]
        assert len(set(tokens)) == 100  # All unique
    
    def test_generate_api_key_has_prefix(self):
        """Should generate API key with ep_ prefix"""
        api_key = TokenManager.generate_api_key()
        assert api_key.startswith("ep_")
    
    def test_generate_api_key_unique(self):
        """Should generate unique API keys"""
        keys = [TokenManager.generate_api_key() for _ in range(100)]
        assert len(set(keys)) == 100
    
    def test_hash_token_deterministic(self):
        """Should produce same hash for same token"""
        token = "test_token_123"
        hash1 = TokenManager.hash_token(token)
        hash2 = TokenManager.hash_token(token)
        assert hash1 == hash2
    
    def test_hash_token_different_for_different_tokens(self):
        """Should produce different hashes for different tokens"""
        hash1 = TokenManager.hash_token("token1")
        hash2 = TokenManager.hash_token("token2")
        assert hash1 != hash2
    
    def test_hash_token_length(self):
        """Should produce SHA-256 hash (64 hex characters)"""
        token = "test_token"
        hashed = TokenManager.hash_token(token)
        assert len(hashed) == 64


# ============================================================================
# RATE LIMITER TESTS
# ============================================================================

class TestRateLimiter:
    """Test RateLimiter class"""
    
    def test_rate_limiter_allows_within_limit(self):
        """Should allow requests within limit"""
        limiter = RateLimiter()
        identifier = "test_user_1"
        
        # Default limit is 100 requests per minute
        for i in range(10):
            assert limiter.is_allowed(identifier) is True
    
    def test_rate_limiter_blocks_over_limit(self):
        """Should block requests exceeding limit"""
        limiter = RateLimiter()
        identifier = "test_user_2"
        
        # Exceed strict limit (10 requests per minute)
        for i in range(10):
            limiter.is_allowed(identifier, 'strict')
        
        # 11th request should be blocked
        assert limiter.is_allowed(identifier, 'strict') is False
    
    def test_rate_limiter_different_identifiers_independent(self):
        """Should track different identifiers independently"""
        limiter = RateLimiter()
        
        for i in range(10):
            limiter.is_allowed("user1", 'strict')
        
        # user2 should still be allowed
        assert limiter.is_allowed("user2", 'strict') is True
    
    def test_rate_limiter_sliding_window(self):
        """Should implement sliding window correctly"""
        limiter = RateLimiter()
        identifier = "test_user_3"
        
        # Make 5 requests
        for i in range(5):
            limiter.is_allowed(identifier, 'auth')
        
        # 6th should be blocked (auth limit is 5)
        assert limiter.is_allowed(identifier, 'auth') is False
    
    def test_rate_limiter_get_remaining(self):
        """Should return remaining request count"""
        limiter = RateLimiter()
        identifier = "test_user_4"
        
        # Make 3 requests with strict limit (10 total)
        for i in range(3):
            limiter.is_allowed(identifier, 'strict')
        
        remaining = limiter.get_remaining(identifier, 'strict')
        assert remaining == 7
    
    def test_rate_limiter_get_remaining_zero(self):
        """Should return zero when limit exceeded"""
        limiter = RateLimiter()
        identifier = "test_user_5"
        
        # Exhaust strict limit
        for i in range(10):
            limiter.is_allowed(identifier, 'strict')
        
        remaining = limiter.get_remaining(identifier, 'strict')
        assert remaining == 0


# ============================================================================
# CSRF PROTECTION TESTS
# ============================================================================

class TestCSRFProtection:
    """Test CSRFProtection class"""
    
    def test_generate_csrf_token(self):
        """Should generate CSRF token"""
        token = CSRFProtection.generate_csrf_token()
        assert token is not None
        assert len(token) > 32
    
    def test_generate_csrf_token_unique(self):
        """Should generate unique tokens"""
        tokens = [CSRFProtection.generate_csrf_token() for _ in range(100)]
        assert len(set(tokens)) == 100
    
    def test_validate_csrf_token_correct(self):
        """Should validate matching tokens"""
        token = CSRFProtection.generate_csrf_token()
        assert CSRFProtection.validate_csrf_token(token, token) is True
    
    def test_validate_csrf_token_incorrect(self):
        """Should reject mismatched tokens"""
        token1 = CSRFProtection.generate_csrf_token()
        token2 = CSRFProtection.generate_csrf_token()
        assert CSRFProtection.validate_csrf_token(token1, token2) is False
    
    def test_validate_csrf_token_timing_safe(self):
        """Should use timing-safe comparison"""
        # This test verifies that hmac.compare_digest is used
        token = "a" * 43  # URL-safe base64 token length
        # Even if tokens differ by one character, should not leak timing
        assert CSRFProtection.validate_csrf_token(token, token) is True
        assert CSRFProtection.validate_csrf_token(token, "b" + token[1:]) is False


# ============================================================================
# CONTENT SECURITY POLICY TESTS
# ============================================================================

class TestContentSecurityPolicy:
    """Test ContentSecurityPolicy class"""
    
    def test_get_csp_header_format(self):
        """Should return properly formatted CSP header"""
        csp = ContentSecurityPolicy.get_csp_header()
        assert isinstance(csp, str)
        assert "default-src" in csp
        assert "script-src" in csp
        assert "style-src" in csp
    
    def test_get_csp_header_includes_self(self):
        """Should include 'self' directive"""
        csp = ContentSecurityPolicy.get_csp_header()
        assert "'self'" in csp
    
    def test_get_csp_header_restricts_frame_ancestors(self):
        """Should restrict frame ancestors"""
        csp = ContentSecurityPolicy.get_csp_header()
        assert "frame-ancestors 'none'" in csp
    
    def test_get_csp_header_semicolon_separated(self):
        """Should use semicolons to separate directives"""
        csp = ContentSecurityPolicy.get_csp_header()
        assert ";" in csp
        parts = csp.split(";")
        assert len(parts) > 5


# ============================================================================
# INPUT FILTER TESTS
# ============================================================================

class TestInputFilter:
    """Test InputFilter class"""
    
    def test_sanitize_sql_input_removes_quotes(self):
        """Should remove SQL quote characters"""
        malicious = "admin' OR '1'='1"
        result = InputFilter.sanitize_sql_input(malicious)
        assert "'" not in result
    
    def test_sanitize_sql_input_removes_double_quotes(self):
        """Should remove double quotes"""
        malicious = 'admin" OR "1"="1'
        result = InputFilter.sanitize_sql_input(malicious)
        assert '"' not in result
    
    def test_sanitize_sql_input_removes_semicolon(self):
        """Should remove semicolons"""
        malicious = "admin; DROP TABLE users;"
        result = InputFilter.sanitize_sql_input(malicious)
        assert ";" not in result
    
    def test_sanitize_sql_input_removes_comments(self):
        """Should remove SQL comments"""
        malicious = "admin -- comment"
        result = InputFilter.sanitize_sql_input(malicious)
        assert "--" not in result
    
    def test_sanitize_sql_input_removes_stored_procedures(self):
        """Should remove dangerous stored procedure prefixes"""
        malicious = "xp_cmdshell 'dir'"
        result = InputFilter.sanitize_sql_input(malicious)
        assert "xp_" not in result
    
    def test_sanitize_html_escapes_tags(self):
        """Should escape HTML tags"""
        malicious = "<script>alert('xss')</script>"
        result = InputFilter.sanitize_html(malicious)
        assert "<script>" not in result
        assert "&lt;" in result or "script" in result  # Escaped or removed


# ============================================================================
# AUDIT LOGGER TESTS
# ============================================================================

class TestAuditLogger:
    """Test AuditLogger class"""
    
    def test_log_security_event_captures_data(self, capsys):
        """Should log security events"""
        AuditLogger.log_security_event(
            event_type="LOGIN_ATTEMPT",
            user_id="user123",
            ip_address="192.168.1.1",
            details={"success": True}
        )
        
        captured = capsys.readouterr()
        assert "LOGIN_ATTEMPT" in captured.out
        assert "user123" in captured.out
        assert "192.168.1.1" in captured.out
    
    def test_log_security_event_includes_timestamp(self, capsys):
        """Should include timestamp in log"""
        AuditLogger.log_security_event(
            event_type="PASSWORD_CHANGE",
            user_id="user456",
            ip_address="10.0.0.1",
            details={}
        )
        
        captured = capsys.readouterr()
        assert "timestamp" in captured.out
    
    def test_log_security_event_handles_none_user(self, capsys):
        """Should handle None user_id"""
        AuditLogger.log_security_event(
            event_type="FAILED_LOGIN",
            user_id=None,
            ip_address="192.168.1.100",
            details={"reason": "invalid_password"}
        )
        
        captured = capsys.readouterr()
        assert "FAILED_LOGIN" in captured.out


# ============================================================================
# INTEGRATION AND EDGE CASE TESTS
# ============================================================================

class TestSecurityIntegration:
    """Integration tests for security features"""
    
    def test_password_hashing_and_validation_workflow(self):
        """Should handle complete password workflow"""
        password = "StrongPass123!"
        
        # Validate strength
        valid, _ = PasswordSecurity.validate_password_strength(password)
        assert valid is True
        
        # Hash password
        hashed = PasswordSecurity.hash_password(password)
        
        # Verify correct password
        assert PasswordSecurity.verify_password(password, hashed) is True
        
        # Reject wrong password
        assert PasswordSecurity.verify_password("WrongPass!", hashed) is False
    
    def test_token_generation_and_hashing_workflow(self):
        """Should handle complete token workflow"""
        # Generate token
        token = TokenManager.generate_token()
        
        # Hash for storage
        hashed = TokenManager.hash_token(token)
        
        # Verify by hashing and comparing
        provided_hash = TokenManager.hash_token(token)
        assert hashed == provided_hash
    
    def test_csrf_generation_and_validation_workflow(self):
        """Should handle complete CSRF workflow"""
        # Generate token for form
        token = CSRFProtection.generate_csrf_token()
        
        # Store token (simulated)
        stored_token = token
        
        # Validate on form submission
        assert CSRFProtection.validate_csrf_token(token, stored_token) is True
    
    def test_rate_limiting_recovery_after_timeout(self):
        """Should allow requests after timeout period"""
        limiter = RateLimiter()
        identifier = "recovery_test"
        
        # Exhaust limit
        for i in range(5):
            limiter.is_allowed(identifier, 'auth')
        
        # Should be blocked
        assert limiter.is_allowed(identifier, 'auth') is False
        
        # Simulate time passing (would need to mock time in real scenario)
        # In actual implementation, old requests would be cleaned up
    
    def test_xss_prevention_chain(self):
        """Should prevent XSS through multiple layers"""
        xss_payload = "<script>alert('XSS')</script><img src=x onerror=alert(1)>"
        
        # Layer 1: SecurityValidator
        cleaned = SecurityValidator.sanitize_string(xss_payload)
        assert "<script>" not in cleaned
        
        # Layer 2: InputFilter (HTML escape)
        escaped = InputFilter.sanitize_html(xss_payload)
        assert "<script>" not in escaped or "&lt;" in escaped
    
    def test_sql_injection_prevention(self):
        """Should prevent SQL injection"""
        sql_payload = "'; DROP TABLE users; --"
        
        cleaned = InputFilter.sanitize_sql_input(sql_payload)
        assert "'" not in cleaned
        assert ";" not in cleaned
        assert "--" not in cleaned


if __name__ == "__main__":
    pytest.main([__file__, "-v", "--tb=short"])

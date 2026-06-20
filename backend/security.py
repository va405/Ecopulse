"""
Advanced Security Module for EcoPulse
Implements comprehensive security measures
"""

import hashlib
import secrets
import re
from typing import Optional, Dict, Any
from datetime import datetime, timedelta
import hmac


class SecurityValidator:
    """Input validation and sanitization"""
    
    @staticmethod
    def sanitize_string(input_str: str) -> str:
        """Remove potentially dangerous characters"""
        if not isinstance(input_str, str):
            return ""
        
        # Remove script tags and dangerous patterns
        dangerous_patterns = [
            r'<script[^>]*>.*?</script>',
            r'javascript:',
            r'on\w+\s*=',
            r'<iframe',
            r'<object',
            r'<embed',
        ]
        
        clean_str = input_str
        for pattern in dangerous_patterns:
            clean_str = re.sub(pattern, '', clean_str, flags=re.IGNORECASE)
        
        return clean_str.strip()
    
    @staticmethod
    def validate_email(email: str) -> bool:
        """Validate email format"""
        pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
        return bool(re.match(pattern, email))
    
    @staticmethod
    def validate_number_range(value: float, min_val: float, max_val: float) -> bool:
        """Validate number is within acceptable range"""
        try:
            num = float(value)
            return min_val <= num <= max_val
        except (ValueError, TypeError):
            return False
    
    @staticmethod
    def validate_carbon_input(data: Dict[str, Any]) -> tuple[bool, str]:
        """Validate carbon calculation input"""
        errors = []
        
        # Check for required fields
        required_fields = ['transportation', 'energy', 'food']
        for field in required_fields:
            if field not in data:
                errors.append(f"Missing required field: {field}")
        
        # Validate numeric ranges
        if 'transportation' in data:
            for key, value in data['transportation'].items():
                if not SecurityValidator.validate_number_range(value, 0, 10000):
                    errors.append(f"Invalid transportation value: {key}")
        
        if errors:
            return False, "; ".join(errors)
        
        return True, "Valid"


class PasswordSecurity:
    """Password hashing and validation"""
    
    @staticmethod
    def hash_password(password: str) -> str:
        """Hash password with salt using SHA-256"""
        salt = secrets.token_hex(32)
        pwd_hash = hashlib.pbkdf2_hmac(
            'sha256',
            password.encode('utf-8'),
            salt.encode('utf-8'),
            100000  # iterations
        )
        return f"{salt}${pwd_hash.hex()}"
    
    @staticmethod
    def verify_password(password: str, stored_hash: str) -> bool:
        """Verify password against stored hash"""
        try:
            salt, pwd_hash = stored_hash.split('$')
            computed_hash = hashlib.pbkdf2_hmac(
                'sha256',
                password.encode('utf-8'),
                salt.encode('utf-8'),
                100000
            )
            return hmac.compare_digest(computed_hash.hex(), pwd_hash)
        except:
            return False
    
    @staticmethod
    def validate_password_strength(password: str) -> tuple[bool, str]:
        """Validate password meets security requirements"""
        if len(password) < 8:
            return False, "Password must be at least 8 characters"
        
        if not re.search(r'[A-Z]', password):
            return False, "Password must contain uppercase letter"
        
        if not re.search(r'[a-z]', password):
            return False, "Password must contain lowercase letter"
        
        if not re.search(r'\d', password):
            return False, "Password must contain number"
        
        if not re.search(r'[!@#$%^&*(),.?":{}|<>]', password):
            return False, "Password must contain special character"
        
        return True, "Strong password"


class TokenManager:
    """Secure token generation and validation"""
    
    @staticmethod
    def generate_token(length: int = 32) -> str:
        """Generate cryptographically secure random token"""
        return secrets.token_urlsafe(length)
    
    @staticmethod
    def generate_api_key() -> str:
        """Generate API key with prefix"""
        prefix = "ep_"  # EcoPulse
        token = secrets.token_urlsafe(32)
        return f"{prefix}{token}"
    
    @staticmethod
    def hash_token(token: str) -> str:
        """Hash token for storage"""
        return hashlib.sha256(token.encode()).hexdigest()


class RateLimiter:
    """Advanced rate limiting with sliding window"""
    
    def __init__(self):
        self.requests: Dict[str, list] = {}
        self.limits = {
            'default': (100, 60),      # 100 requests per minute
            'strict': (10, 60),         # 10 requests per minute
            'auth': (5, 300),           # 5 attempts per 5 minutes
        }
    
    def is_allowed(self, identifier: str, limit_type: str = 'default') -> bool:
        """Check if request is allowed under rate limit"""
        max_requests, window_seconds = self.limits.get(limit_type, self.limits['default'])
        
        current_time = datetime.now()
        window_start = current_time - timedelta(seconds=window_seconds)
        
        # Initialize or clean old requests
        if identifier not in self.requests:
            self.requests[identifier] = []
        
        # Remove old requests outside window
        self.requests[identifier] = [
            req_time for req_time in self.requests[identifier]
            if req_time > window_start
        ]
        
        # Check limit
        if len(self.requests[identifier]) >= max_requests:
            return False
        
        # Add current request
        self.requests[identifier].append(current_time)
        return True
    
    def get_remaining(self, identifier: str, limit_type: str = 'default') -> int:
        """Get remaining requests in current window"""
        max_requests, _ = self.limits.get(limit_type, self.limits['default'])
        current_count = len(self.requests.get(identifier, []))
        return max(0, max_requests - current_count)


class CSRFProtection:
    """CSRF token generation and validation"""
    
    @staticmethod
    def generate_csrf_token() -> str:
        """Generate CSRF token"""
        return secrets.token_urlsafe(32)
    
    @staticmethod
    def validate_csrf_token(token: str, stored_token: str) -> bool:
        """Validate CSRF token"""
        return hmac.compare_digest(token, stored_token)


class ContentSecurityPolicy:
    """CSP header generator"""
    
    @staticmethod
    def get_csp_header() -> str:
        """Generate Content Security Policy header"""
        policy = {
            "default-src": ["'self'"],
            "script-src": ["'self'", "'unsafe-inline'"],
            "style-src": ["'self'", "'unsafe-inline'"],
            "img-src": ["'self'", "data:", "https:"],
            "font-src": ["'self'", "data:"],
            "connect-src": ["'self'"],
            "frame-ancestors": ["'none'"],
            "base-uri": ["'self'"],
            "form-action": ["'self'"],
        }
        
        return "; ".join([
            f"{key} {' '.join(values)}"
            for key, values in policy.items()
        ])


class AuditLogger:
    """Security audit logging"""
    
    @staticmethod
    def log_security_event(
        event_type: str,
        user_id: Optional[str],
        ip_address: str,
        details: Dict[str, Any]
    ) -> None:
        """Log security-related events"""
        log_entry = {
            "timestamp": datetime.now().isoformat(),
            "event_type": event_type,
            "user_id": user_id,
            "ip_address": ip_address,
            "details": details,
        }
        
        # In production, send to logging service
        print(f"SECURITY LOG: {log_entry}")


class InputFilter:
    """SQL injection and XSS prevention"""
    
    @staticmethod
    def sanitize_sql_input(value: str) -> str:
        """Prevent SQL injection"""
        dangerous_chars = ["'", '"', ";", "--", "/*", "*/", "xp_", "sp_"]
        clean_value = value
        
        for char in dangerous_chars:
            clean_value = clean_value.replace(char, "")
        
        return clean_value
    
    @staticmethod
    def sanitize_html(html: str) -> str:
        """Remove potentially dangerous HTML"""
        # Remove all HTML tags except safe ones
        safe_tags = ['b', 'i', 'u', 'p', 'br', 'strong', 'em']
        
        # This is a simple implementation
        # In production, use libraries like bleach
        import html as html_module
        return html_module.escape(html)


# Singleton instances
security_validator = SecurityValidator()
password_security = PasswordSecurity()
token_manager = TokenManager()
rate_limiter = RateLimiter()
csrf_protection = CSRFProtection()
csp = ContentSecurityPolicy()
audit_logger = AuditLogger()
input_filter = InputFilter()


# Export main classes
__all__ = [
    'SecurityValidator',
    'PasswordSecurity',
    'TokenManager',
    'RateLimiter',
    'CSRFProtection',
    'ContentSecurityPolicy',
    'AuditLogger',
    'InputFilter',
]

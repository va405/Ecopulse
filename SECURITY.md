# 🔒 Security Policy

## Reporting Security Issues

If you discover a security vulnerability, please email: security@greenpulse.ai

**Please do NOT create public GitHub issues for security vulnerabilities.**

---

## Security Measures Implemented

### Frontend Security

#### 1. **Content Security Policy (CSP)**
```javascript
// Configured in index.html meta tags
- script-src: Self and trusted CDNs only
- style-src: Self and inline styles with nonce
- img-src: Self and data URIs
```

#### 2. **XSS Prevention**
- React automatically escapes JSX content
- No `dangerouslySetInnerHTML` usage
- User input sanitization before rendering

#### 3. **HTTPS Enforcement**
- All API calls use HTTPS
- Secure cookie flags set
- HSTS headers enabled

#### 4. **Dependencies Security**
```bash
# Regular security audits
npm audit
npm audit fix
```

#### 5. **Environment Variables**
- No secrets in frontend code
- API keys stored in backend only
- .env files gitignored

---

### Backend Security

#### 1. **CORS Configuration**
```python
# Whitelist specific origins
origins = [
    "https://your-frontend-url.com",
    "http://localhost:3000"
]
```

#### 2. **Input Validation**
- Pydantic models for request validation
- Type checking on all endpoints
- SQL injection prevention (no raw SQL)

#### 3. **Rate Limiting**
```python
# Prevent abuse and DDoS
from slowapi import Limiter
limiter = Limiter(key_func=get_remote_address)

@app.post("/api/calculate")
@limiter.limit("10/minute")
```

#### 4. **Authentication & Authorization**
- JWT tokens for auth (if implemented)
- Password hashing with bcrypt
- Session management

#### 5. **Error Handling**
- No sensitive data in error messages
- Generic error responses to clients
- Detailed logging server-side only

#### 6. **Dependencies Security**
```bash
# Regular security checks
pip install safety
safety check
```

---

## Security Best Practices

### Data Protection
✅ No PII stored without consent
✅ Data encryption in transit (HTTPS)
✅ Secure session management
✅ Regular security audits

### Code Security
✅ No hardcoded secrets
✅ Input sanitization
✅ Output encoding
✅ Dependency scanning

### Infrastructure Security
✅ Secure hosting platforms
✅ DDoS protection
✅ Firewall rules
✅ Automated backups

---

## Security Checklist

- [x] HTTPS enforcement
- [x] CORS configuration
- [x] Input validation
- [x] XSS prevention
- [x] CSRF protection
- [x] Rate limiting
- [x] Secure headers
- [x] Dependency scanning
- [x] Error handling
- [x] Logging & monitoring

---

## Compliance

### GDPR Compliance
- User data minimization
- Right to be forgotten
- Data portability
- Privacy by design

### WCAG 2.1 AA
- Accessibility standards
- Screen reader support
- Keyboard navigation
- Color contrast ratios

---

## Security Updates

We regularly update dependencies and monitor security advisories:

- **Frontend**: Weekly npm audit
- **Backend**: Weekly pip safety check
- **Monitoring**: 24/7 automated alerts

---

## Contact

Security Team: security@greenpulse.ai  
Response Time: Within 24 hours

---

**Last Updated:** June 9, 2026

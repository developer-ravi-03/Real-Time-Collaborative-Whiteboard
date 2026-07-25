# API Rate Limiting

> **Project:** SyncBoard
> **Document:** API Rate Limiting
> **Version:** 1.0
> **API Version:** v1

---

# 1. Overview

This document defines the rate limiting strategy for all SyncBoard APIs.

The objectives are:

- Protect APIs from abuse
- Prevent brute-force attacks
- Ensure fair resource usage
- Improve platform stability
- Support future horizontal scaling

Rate limits are enforced per authenticated user where possible. Public endpoints are rate-limited by client IP.

---

# 2. Rate Limiting Strategy

The application uses different limits based on endpoint type.

Categories:

- Public APIs
- Authentication APIs
- Workspace APIs
- Board APIs
- Board Object APIs
- Comment APIs
- Notification APIs
- Upload APIs
- Export APIs

---

# 3. Standard Limits

| Category           |        Limit | Time Window |
| ------------------ | -----------: | ----------: |
| Public APIs        |  60 requests |    1 minute |
| Authenticated APIs | 300 requests |    1 minute |
| Workspace APIs     | 120 requests |    1 minute |
| Board APIs         | 300 requests |    1 minute |
| Board Object APIs  | 600 requests |    1 minute |
| Comment APIs       | 180 requests |    1 minute |
| Notification APIs  | 120 requests |    1 minute |

These values may be adjusted based on production usage.

---

# 4. Authentication Limits

Authentication-related endpoints require stricter limits.

| Endpoint           |           Limit |
| ------------------ | --------------: |
| Sign In            | 10 / 10 minutes |
| Sign Up            |  5 / 10 minutes |
| Password Reset     |        5 / hour |
| Email Verification |        5 / hour |

Authentication is handled by Clerk, which also provides built-in abuse protection.

---

# 5. File Upload Limits

Maximum upload size:

- Images: 10 MB
- PDFs: 20 MB
- Other supported files: 25 MB

Upload frequency:

- 20 uploads per minute per user

---

# 6. Export Limits

| Export Type |   Limit |
| ----------- | ------: |
| PNG         | 20/hour |
| PDF         | 20/hour |
| JSON        | 50/hour |

Future export formats will follow similar policies.

---

# 7. Bulk Operation Limits

Bulk endpoints protect the server from excessively large requests.

Maximum objects per request:

- Bulk Create: 200
- Bulk Update: 500
- Bulk Delete: 500

Requests exceeding these limits return `413 Payload Too Large` or `422 Unprocessable Entity` as appropriate.

---

# 8. WebSocket Connection Limits

Future Socket.IO limits:

- Maximum active connections per user: 5
- Maximum board subscriptions: 20
- Maximum concurrent editing sessions: 10

Connections exceeding these limits may be rejected.

---

# 9. Rate Limit Headers

Successful responses should include:

```
X-RateLimit-Limit
X-RateLimit-Remaining
X-RateLimit-Reset
```

When supported by the chosen rate-limiting middleware.

---

# 10. Rate Limit Exceeded Response

HTTP Status

```
429 Too Many Requests
```

Example

```json
{
  "success": false,
  "message": "Rate limit exceeded. Please try again later.",
  "data": null,
  "meta": {
    "retryAfter": 60
  },
  "errors": [
    {
      "code": "RATE_LIMIT_EXCEEDED",
      "message": "Too many requests."
    }
  ]
}
```

---

# 11. Abuse Prevention

The platform monitors:

- Excessive API requests
- Repeated authentication failures
- Excessive uploads
- Export abuse
- Automated scraping attempts

Suspicious activity may trigger temporary blocks or additional verification.

---

# 12. Monitoring

The following metrics should be tracked:

- Requests per minute
- 429 responses
- Authentication failures
- Upload failures
- Export requests
- Socket connection counts

These metrics help identify abuse patterns and capacity issues.

---

# 13. Future Enhancements

Future versions may include:

- Redis-backed distributed rate limiting
- Adaptive rate limits based on user plans
- Burst allowances
- Organization-level quotas
- IP reputation checks
- CAPTCHA for suspicious activity

---

# 14. Conclusion

Rate limiting is a key security and reliability mechanism. By defining limits for different API categories and preparing for distributed enforcement, SyncBoard provides a scalable foundation that protects the platform while maintaining a good user experience.

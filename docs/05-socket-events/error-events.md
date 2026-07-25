# Socket Error Events

> **Project:** SyncBoard
> **Document:** Socket Error Events
> **Version:** 1.0

---

# 1. Overview

This document defines the standard error protocol for all Socket.IO communication in SyncBoard.

Every server-side error must follow a consistent structure to ensure predictable client behavior and easier debugging.

---

# 2. Error Flow

```
Client Event
      │
      ▼
Validation
      │
Authentication
      │
Authorization
      │
Business Logic
      │
Persistence
      │
Error?
      │
      ▼
server:error
```

---

# 3. Standard Error Event

Server Event

```
server:error
```

Payload

```json
{
  "success": false,
  "error": {
    "code": "OBJECT_NOT_FOUND",
    "message": "The requested object does not exist.",
    "retryable": false
  },
  "eventId": "550e8400-e29b-41d4-a716-446655440000",
  "timestamp": "2026-07-25T15:30:00Z"
}
```

---

# 4. Error Categories

## Authentication

- UNAUTHORIZED
- TOKEN_EXPIRED

---

## Authorization

- FORBIDDEN
- ACCESS_DENIED

---

## Validation

- VALIDATION_ERROR
- INVALID_PAYLOAD
- INVALID_UUID

---

## Resource

- BOARD_NOT_FOUND
- OBJECT_NOT_FOUND
- COMMENT_NOT_FOUND
- WORKSPACE_NOT_FOUND
- NOTIFICATION_NOT_FOUND

---

## Business Logic

- OBJECT_LOCKED
- VERSION_CONFLICT
- DUPLICATE_OPERATION

---

## Rate Limiting

- RATE_LIMIT_EXCEEDED

---

## Internal

- DATABASE_ERROR
- INTERNAL_SERVER_ERROR

---

# 5. Retry Strategy

## Retryable

- CONNECTION_FAILED
- DATABASE_TIMEOUT
- TEMPORARY_NETWORK_FAILURE

Client should retry using exponential backoff.

---

## Non-Retryable

- VALIDATION_ERROR
- FORBIDDEN
- OBJECT_NOT_FOUND
- BOARD_NOT_FOUND

Client should display the error and stop retrying.

---

# 6. Client Recovery

Recommended behavior

| Error                 | Action                        |
| --------------------- | ----------------------------- |
| TOKEN_EXPIRED         | Refresh session and reconnect |
| VERSION_CONFLICT      | Request latest object state   |
| RATE_LIMIT_EXCEEDED   | Retry after delay             |
| VALIDATION_ERROR      | Correct input                 |
| INTERNAL_SERVER_ERROR | Show generic error            |

---

# 7. Error Broadcasting

Errors are never broadcast to other users.

Always emit only to:

```
socket.id
```

---

# 8. Logging

Every error should log:

- Event name
- Error code
- User ID
- Socket ID
- Processing time
- Stack trace (internal only)

Sensitive data must never appear in logs.

---

# 9. Security

Never expose:

- SQL errors
- Stack traces
- Internal implementation details
- JWT contents
- Database structure

Only return user-safe messages.

---

# 10. Future Enhancements

- Localized error messages
- Error analytics
- Automatic issue reporting
- Error correlation IDs
- Distributed tracing

---

# 11. Conclusion

A standardized error protocol ensures reliable client recovery, improves debugging, and maintains consistent behavior across all realtime features.

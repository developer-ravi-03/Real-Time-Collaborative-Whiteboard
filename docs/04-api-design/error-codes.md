# API Error Codes

> **Project:** SyncBoard  
> **Document:** API Error Codes  
> **Version:** 1.0  
> **API Version:** v1

---

# 1. Overview

This document defines the standardized error handling strategy for all SyncBoard APIs.

Every API error must include:

- HTTP Status Code
- Application Error Code
- Human-readable Message
- Optional Error Details

The purpose of this document is to ensure:

- Consistent API behavior
- Predictable frontend error handling
- Better debugging
- Easier monitoring
- Standardized logging

---

# 2. Standard Error Response

Every failed request follows the response format below.

```json
{
  "success": false,
  "message": "Validation failed.",
  "data": null,
  "meta": {},
  "errors": [
    {
      "code": "VALIDATION_ERROR",
      "field": "name",
      "message": "Board name is required."
    }
  ]
}
```

---

# 3. Error Categories

Errors are grouped into the following categories:

| Category       | Description                   |
| -------------- | ----------------------------- |
| Authentication | Login & identity errors       |
| Authorization  | Permission errors             |
| Validation     | Invalid input                 |
| Resource       | Resource not found            |
| Conflict       | Duplicate or conflicting data |
| Business Logic | Application rules             |
| Rate Limiting  | Too many requests             |
| File Upload    | Upload failures               |
| Database       | Database failures             |
| Internal       | Unexpected server errors      |

---

# 4. HTTP Status Codes

| HTTP Code | Meaning               |
| --------- | --------------------- |
| 200       | Success               |
| 201       | Resource Created      |
| 204       | No Content            |
| 400       | Bad Request           |
| 401       | Unauthorized          |
| 403       | Forbidden             |
| 404       | Not Found             |
| 409       | Conflict              |
| 422       | Unprocessable Entity  |
| 429       | Too Many Requests     |
| 500       | Internal Server Error |
| 503       | Service Unavailable   |

---

# 5. Authentication Errors

| Error Code          | HTTP | Message                           |
| ------------------- | ---- | --------------------------------- |
| AUTH_REQUIRED       | 401  | Authentication required.          |
| INVALID_TOKEN       | 401  | Invalid authentication token.     |
| TOKEN_EXPIRED       | 401  | Authentication token has expired. |
| SESSION_EXPIRED     | 401  | User session has expired.         |
| INVALID_CREDENTIALS | 401  | Invalid credentials.              |

---

# 6. Authorization Errors

| Error Code                | HTTP | Message                                 |
| ------------------------- | ---- | --------------------------------------- |
| ACCESS_DENIED             | 403  | Access denied.                          |
| WORKSPACE_ACCESS_DENIED   | 403  | You are not a member of this workspace. |
| BOARD_ACCESS_DENIED       | 403  | You do not have access to this board.   |
| OWNER_PERMISSION_REQUIRED | 403  | Workspace owner permission required.    |
| INSUFFICIENT_PERMISSIONS  | 403  | Insufficient permissions.               |

---

# 7. Validation Errors

| Error Code              | HTTP | Message                    |
| ----------------------- | ---- | -------------------------- |
| VALIDATION_ERROR        | 400  | Validation failed.         |
| INVALID_REQUEST_BODY    | 400  | Invalid request body.      |
| INVALID_QUERY_PARAMETER | 400  | Invalid query parameter.   |
| INVALID_ROUTE_PARAMETER | 400  | Invalid route parameter.   |
| REQUIRED_FIELD_MISSING  | 400  | Required field is missing. |
| INVALID_UUID            | 400  | Invalid UUID format.       |

---

# 8. Resource Errors

| Error Code             | HTTP | Message                 |
| ---------------------- | ---- | ----------------------- |
| USER_NOT_FOUND         | 404  | User not found.         |
| WORKSPACE_NOT_FOUND    | 404  | Workspace not found.    |
| BOARD_NOT_FOUND        | 404  | Board not found.        |
| BOARD_OBJECT_NOT_FOUND | 404  | Board object not found. |
| COMMENT_NOT_FOUND      | 404  | Comment not found.      |
| NOTIFICATION_NOT_FOUND | 404  | Notification not found. |
| ATTACHMENT_NOT_FOUND   | 404  | Attachment not found.   |

---

# 9. Conflict Errors

| Error Code                | HTTP | Message                             |
| ------------------------- | ---- | ----------------------------------- |
| EMAIL_ALREADY_EXISTS      | 409  | Email already exists.               |
| WORKSPACE_ALREADY_EXISTS  | 409  | Workspace already exists.           |
| BOARD_ALREADY_EXISTS      | 409  | Board already exists.               |
| MEMBER_ALREADY_EXISTS     | 409  | User is already a workspace member. |
| INVITATION_ALREADY_EXISTS | 409  | Invitation already exists.          |

---

# 10. Business Logic Errors

| Error Code                  | HTTP | Message                      |
| --------------------------- | ---- | ---------------------------- |
| WORKSPACE_LIMIT_REACHED     | 422  | Workspace limit reached.     |
| BOARD_LIMIT_REACHED         | 422  | Board limit reached.         |
| INVITATION_EXPIRED          | 422  | Invitation has expired.      |
| INVITATION_ALREADY_ACCEPTED | 422  | Invitation already accepted. |
| INVALID_BOARD_STATE         | 422  | Invalid board state.         |
| VERSION_RESTORE_FAILED      | 422  | Version restoration failed.  |

---

# 11. File Upload Errors

| Error Code                  | HTTP | Message                      |
| --------------------------- | ---- | ---------------------------- |
| FILE_TOO_LARGE              | 413  | File exceeds maximum size.   |
| INVALID_FILE_TYPE           | 415  | Unsupported file type.       |
| FILE_UPLOAD_FAILED          | 500  | File upload failed.          |
| STORAGE_SERVICE_UNAVAILABLE | 503  | Storage service unavailable. |

---

# 12. Rate Limit Errors

| Error Code              | HTTP | Message                                    |
| ----------------------- | ---- | ------------------------------------------ |
| RATE_LIMIT_EXCEEDED     | 429  | Too many requests. Please try again later. |
| TOO_MANY_LOGIN_ATTEMPTS | 429  | Too many login attempts.                   |
| TOO_MANY_UPLOADS        | 429  | Upload rate exceeded.                      |

---

# 13. Database Errors

| Error Code               | HTTP | Message                      |
| ------------------------ | ---- | ---------------------------- |
| DATABASE_ERROR           | 500  | Database operation failed.   |
| FOREIGN_KEY_VIOLATION    | 500  | Invalid resource reference.  |
| UNIQUE_CONSTRAINT_FAILED | 409  | Duplicate value detected.    |
| TRANSACTION_FAILED       | 500  | Database transaction failed. |

---

# 14. Internal Server Errors

| Error Code            | HTTP | Message                          |
| --------------------- | ---- | -------------------------------- |
| INTERNAL_SERVER_ERROR | 500  | An unexpected error occurred.    |
| SERVICE_UNAVAILABLE   | 503  | Service temporarily unavailable. |
| UNKNOWN_ERROR         | 500  | Unknown server error.            |

---

# 15. Validation Error Example

```json
{
  "success": false,
  "message": "Validation failed.",
  "data": null,
  "meta": {},
  "errors": [
    {
      "code": "REQUIRED_FIELD_MISSING",
      "field": "name",
      "message": "Workspace name is required."
    }
  ]
}
```

---

# 16. Resource Not Found Example

```json
{
  "success": false,
  "message": "Board not found.",
  "data": null,
  "meta": {},
  "errors": [
    {
      "code": "BOARD_NOT_FOUND",
      "message": "No board exists with the provided ID."
    }
  ]
}
```

---

# 17. Logging Guidelines

Every server-side error log should include:

- Request ID
- User ID (if authenticated)
- HTTP Method
- Endpoint
- HTTP Status Code
- Application Error Code
- Timestamp
- Execution Time

Sensitive data such as passwords, JWTs, API keys, and personal information must never be logged.

---

# 18. Frontend Error Handling Guidelines

The frontend should:

- Display user-friendly error messages.
- Avoid exposing internal server details.
- Redirect to login on `401 Unauthorized`.
- Show a permission screen for `403 Forbidden`.
- Show a "Not Found" page for `404`.
- Retry idempotent requests for temporary `503` errors where appropriate.
- Display inline validation messages for `400` responses.

---

# 19. Monitoring & Alerting

The following errors should trigger monitoring alerts:

- DATABASE_ERROR
- INTERNAL_SERVER_ERROR
- SERVICE_UNAVAILABLE
- FILE_UPLOAD_FAILED
- TRANSACTION_FAILED

These events should be tracked through the application's logging and monitoring system.

---

# 20. Future Enhancements

The error handling system is designed to support:

- Localization (multi-language error messages)
- Error documentation links
- Trace IDs
- Correlation IDs
- Error analytics
- Automatic retry hints

---

# 21. Conclusion

A centralized error code system ensures consistent API behavior, improves frontend integration, simplifies debugging, and provides a scalable foundation for monitoring and future platform growth.

Every SyncBoard API must return errors defined in this document.

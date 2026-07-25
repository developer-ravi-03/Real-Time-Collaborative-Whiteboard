# API Design Guidelines

> **Project:** SyncBoard
> **Document:** API Design Guidelines
> **Version:** 1.0
> **API Version:** v1

---

# 1. Purpose

This document defines the API design standards for SyncBoard.

Every API endpoint, request, response, validation rule, and authentication mechanism must comply with these guidelines to ensure consistency, maintainability, scalability, and security.

These standards apply to:

- REST APIs
- Route Handlers
- Future Public APIs
- Internal Services

---

# 2. Design Principles

The SyncBoard API follows these principles:

- REST-first architecture
- Resource-oriented URLs
- Stateless communication
- Consistent request/response format
- Secure by default
- Predictable error handling
- Strong input validation
- Backward compatibility
- Versioned APIs

---

# 3. API Base URL

## Development

```
/api/v1
```

Example

```
GET /api/v1/workspaces
```

---

## Production

```
https://api.syncboard.app/v1
```

---

# 4. API Versioning

Every endpoint must include an API version.

Example

```
/api/v1/boards
```

Future versions:

```
/api/v2/boards
/api/v3/boards
```

Breaking changes require a new version.

---

# 5. Resource Naming

Resources use:

- lowercase
- plural nouns
- kebab-case (when required)

Good

```
/workspaces
/boards
/comments
/notifications
```

Bad

```
/Workspace
/getBoards
/CreateBoard
```

---

# 6. HTTP Methods

| Method | Purpose          |
| ------ | ---------------- |
| GET    | Read data        |
| POST   | Create resource  |
| PUT    | Replace resource |
| PATCH  | Partial update   |
| DELETE | Delete resource  |

Examples

```
GET /boards
POST /boards
PATCH /boards/{id}
DELETE /boards/{id}
```

---

# 7. URL Structure

Resources should be hierarchical.

Example

```
/workspaces
/workspaces/{workspaceId}

/workspaces/{workspaceId}/boards

/boards/{boardId}

/boards/{boardId}/comments

/comments/{commentId}
```

Avoid verbs in URLs.

Wrong

```
/createBoard
/getWorkspace
/deleteComment
```

Correct

```
POST /boards
GET /workspaces
DELETE /comments/{id}
```

---

# 8. Route Parameters

Route parameters use UUIDs.

Example

```
GET /boards/{boardId}
```

Parameter naming:

```
workspaceId
boardId
commentId
objectId
userId
```

---

# 9. Query Parameters

Query parameters are used for:

- Pagination
- Search
- Filtering
- Sorting

Example

```
GET /boards?page=1&limit=20

GET /boards?search=design

GET /boards?sort=updatedAt

GET /boards?order=desc
```

---

# 10. Request Headers

Required headers:

```
Authorization: Bearer <JWT>

Content-Type: application/json

Accept: application/json
```

Optional:

```
X-Request-ID

X-Client-Version
```

---

# 11. Authentication

Authentication is handled using Clerk.

Protected routes require:

```
Authorization: Bearer <JWT>
```

Public routes:

- Login
- Signup
- Health Check

Everything else requires authentication.

---

# 12. Authorization

Authentication identifies the user.

Authorization determines what the user can access.

Example permissions:

Workspace Owner

- Full Access

Editor

- Create
- Edit
- Comment

Viewer

- Read Only

Every protected endpoint must verify permissions before executing business logic.

---

# 13. Request Validation

Every request must be validated using Zod.

Validation applies to:

- Body
- Params
- Query
- Headers (where applicable)

Invalid requests return:

```
400 Bad Request
```

---

# 14. UUID Policy

Primary identifiers use UUID v4.

Never expose database internals.

Good

```
550e8400-e29b-41d4-a716-446655440000
```

Never use incremental IDs.

---

# 15. Pagination

Collection endpoints support pagination.

Query Parameters

```
?page=1

?limit=20
```

Default

```
page=1

limit=20
```

Maximum

```
limit=100
```

---

# 16. Sorting

Example

```
GET /boards

?sort=createdAt

?order=desc
```

Supported:

- createdAt
- updatedAt
- name

---

# 17. Searching

Example

```
GET /boards?search=design
```

Search must be:

- Case insensitive
- Trim whitespace
- Escape unsafe characters

---

# 18. Filtering

Example

```
GET /boards?visibility=private

GET /notifications?read=false
```

Multiple filters may be combined.

---

# 19. File Uploads

Uploads use:

```
multipart/form-data
```

Supported:

Images

Documents

PDF

Future:

Video

Audio

Maximum file size will be enforced by the upload service.

---

# 20. Response Standards

All responses follow the standard defined in:

```
response-format.md
```

Do not return inconsistent JSON structures.

---

# 21. Status Codes

| Code | Meaning               |
| ---- | --------------------- |
| 200  | Success               |
| 201  | Resource Created      |
| 204  | No Content            |
| 400  | Validation Error      |
| 401  | Unauthorized          |
| 403  | Forbidden             |
| 404  | Not Found             |
| 409  | Conflict              |
| 422  | Unprocessable Entity  |
| 429  | Too Many Requests     |
| 500  | Internal Server Error |

---

# 22. Error Handling

Errors must:

- Be human-readable
- Include machine-readable codes
- Never expose stack traces
- Never leak database information

Detailed format:

```
error-codes.md
```

---

# 23. Idempotency

GET

Safe

PUT

Idempotent

DELETE

Idempotent

POST

Not idempotent unless explicitly supported.

---

# 24. Rate Limiting

Sensitive endpoints:

- Login
- Invitations
- File Upload
- Board Export

Must be rate limited.

Details:

```
rate-limits.md
```

---

# 25. Logging

Every request should log:

- Request ID
- User ID
- Route
- Method
- Status Code
- Response Time

Sensitive information must never be logged.

---

# 26. Security

Every endpoint must:

- Validate authentication
- Validate authorization
- Validate input
- Sanitize user input
- Prevent SQL Injection
- Prevent XSS
- Prevent CSRF where applicable
- Enforce HTTPS in production

---

# 27. Performance

API endpoints should:

- Return only required fields
- Avoid N+1 queries
- Use database indexes
- Support pagination
- Optimize joins

---

# 28. Deprecation Policy

Deprecated endpoints:

- Remain available during transition.
- Include deprecation warnings.
- Document replacement endpoints.

Breaking changes require a new API version.

---

# 29. Documentation Requirements

Every endpoint must include:

- Purpose
- HTTP Method
- URL
- Authentication
- Permissions
- Request Parameters
- Request Body
- Success Response
- Error Responses
- Example Request
- Example Response

---

# 30. Folder Structure

```
app/
└── api/
    └── v1/
        ├── auth/
        ├── workspaces/
        ├── boards/
        ├── board-objects/
        ├── comments/
        ├── notifications/
        └── uploads/
```

---

# 31. Future Enhancements

The API architecture is designed to support:

- Webhooks
- Public API Keys
- GraphQL Gateway
- OpenAPI / Swagger
- API Analytics
- SDK Generation
- Mobile Clients
- Third-Party Integrations

---

# 32. Conclusion

These guidelines establish a consistent, secure, and scalable API architecture for SyncBoard. Every current and future endpoint must follow these standards to ensure predictable behavior, maintainability, and long-term compatibility across frontend, backend, and external integrations.

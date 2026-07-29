# API Development

> **Project:** SyncBoard
> **Document:** API Development
> **Phase:** 10 - Development
> **Version:** 2.0
> **Status:** Final (Architecture Frozen)

---

# 1. Overview

This document defines the API development standards for the SyncBoard backend.

The backend is built using **Node.js**, **Express.js**, **TypeScript**, **Prisma ORM**, and **PostgreSQL**.

All APIs must follow a consistent architecture, naming convention, request/response format, validation strategy, logging, monitoring, and security practices.

The API layer acts as the bridge between the frontend and the business logic implemented in the Service Layer.

---

# 2. Objectives

After implementing this document, the backend should provide:

- RESTful APIs
- Consistent response format
- Request validation
- Authentication
- Authorization
- Pagination
- Filtering
- Sorting
- Error handling
- API versioning
- Logging
- Monitoring
- Scalable architecture

---

# 3. Backend Architecture

SyncBoard follows a **Layered (Clean) Architecture**.

```
Client (Next.js)

↓

Express Router

↓

Middleware

↓

Validation (Zod)

↓

Controller

↓

Service

↓

Repository

↓

Prisma ORM

↓

PostgreSQL
```

### Layer Responsibilities

### Express Router

- Defines API endpoints
- Maps routes to controllers
- Registers middleware

---

### Middleware

Responsible for:

- Authentication
- Authorization
- Logging
- Error handling
- Rate limiting
- Request parsing

---

### Validation

Validate:

- Request Body
- Query Parameters
- Route Parameters
- Headers (where required)

Only valid requests reach the controller.

---

### Controller

Responsible for:

- Receiving requests
- Calling services
- Returning HTTP responses

Controllers must never contain business logic.

---

### Service

Contains all business logic.

Examples:

- Create Workspace
- Create Board
- Invite User
- Delete Shape
- Move Objects
- Share Board

---

### Repository

Responsible only for database operations.

Uses Prisma to communicate with PostgreSQL.

Repositories must never contain business rules.

---

### Prisma ORM

Provides:

- Type-safe queries
- Migrations
- Database access
- Transactions

---

### PostgreSQL

Stores:

- Users
- Workspaces
- Boards
- Shapes
- Comments
- Notifications
- Activity Logs

Business logic should never exist inside routes or controllers.

---

# 4. Backend Folder Structure

```
backend/

src/

config/

controllers/

routes/

services/

repositories/

middleware/

validations/

sockets/

types/

utils/

constants/

prisma/

server.ts
```

### Folder Responsibilities

**config/**

- Environment
- Database
- Application configuration

**controllers/**

- HTTP request handlers

**routes/**

- API route definitions

**services/**

- Business logic

**repositories/**

- Database access

**middleware/**

- Authentication
- Authorization
- Logging
- Error handling

**validations/**

- Zod schemas

**sockets/**

- Socket.IO events
- Rooms
- Presence
- Realtime collaboration

**types/**

- Shared TypeScript types

**utils/**

- Helper functions

**constants/**

- Enums
- Messages
- API constants

---

# 5. REST Conventions

Create

POST

Read

GET

Update

PATCH

Delete

DELETE

Avoid verbs in endpoint names.

✅ Good

POST /api/v1/boards

❌ Bad

POST /api/v1/createBoard

---

# 6. URL Naming

Use plural resources.

Examples

/api/v1/workspaces

/api/v1/boards

/api/v1/comments

/api/v1/users

Nested resources

/api/v1/workspaces/:workspaceId/boards

/api/v1/boards/:boardId/comments

---

# 7. Request Validation

Every request must be validated using **Zod**.

Validate:

- Body
- Query
- Params
- Headers (where required)

Reject invalid requests before reaching the Controller.

---

# 8. Authentication

Protected APIs require:

```
Client

↓

Clerk Authentication

↓

JWT Token

↓

Express Authentication Middleware

↓

Authenticated User
```

Unauthenticated requests return:

401 Unauthorized

---

# 9. Authorization

Verify:

- Workspace membership
- Board access
- User ownership
- Role permissions

Authorization is implemented inside the Service Layer.

---

# 10. Request Format

Example

```json
{
  "title": "Sprint Planning",
  "description": "Q1 Sprint Board"
}
```

Use JSON unless uploading files.

---

# 11. Response Format

Successful response

```json
{
  "success": true,
  "data": {},
  "message": "Board created successfully."
}
```

Error response

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Title is required."
  }
}
```

All APIs must return a consistent response structure.

---

# 12. HTTP Status Codes

200 OK

201 Created

204 No Content

400 Bad Request

401 Unauthorized

403 Forbidden

404 Not Found

409 Conflict

422 Unprocessable Entity

429 Too Many Requests

500 Internal Server Error

---

# 13. Pagination

Support

?page=1

&limit=20

Response

```json
{
  "data": [],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "totalPages": 8
  }
}
```

Future support

- Cursor Pagination

---

# 14. Filtering

Examples

?status=active

?role=owner

?workspace=abc123

---

# 15. Sorting

Examples

?sort=createdAt

?order=desc

Supported fields

- Created Date
- Updated Date
- Name
- Relevance

---

# 16. API Versioning

Current version

v1

Examples

/api/v1/workspaces

/api/v1/boards

Future versions must remain backward compatible whenever possible.

---

# 17. Rate Limiting

Protect APIs against abuse.

Apply limits to

- Authentication
- Search
- File Upload
- Public APIs

Future implementation:

- Redis
- express-rate-limit

---

# 18. Error Handling

Centralized Express Error Middleware handles:

- Validation Errors
- Authentication Errors
- Authorization Errors
- Prisma Errors
- Database Errors
- Unexpected Exceptions

Never expose stack traces to clients.

---

# 19. Logging

Log:

- Incoming Requests
- Response Status
- Execution Time
- Authentication Failures
- Critical Errors

Never log:

- Passwords
- JWT Tokens
- API Keys
- Secrets

---

# 20. Monitoring

Track:

- API Latency
- Error Rate
- Request Volume
- Slow Endpoints
- Database Performance
- Socket Connections

---

# 21. Documentation

Every endpoint must include:

- Purpose
- Method
- URL
- Authentication
- Request Schema
- Response Schema
- Error Responses

Future:

- OpenAPI (Swagger)

---

# 22. Security

- Validate all input
- Sanitize user input
- Prevent SQL Injection
- Prevent XSS
- Prevent CSRF (where applicable)
- Apply Rate Limiting
- Enforce Authentication
- Enforce Authorization
- Return generic error messages

---

# 23. Testing

Verify:

- CRUD Operations
- Validation
- Authentication
- Authorization
- Pagination
- Filtering
- Sorting
- Error Handling
- Performance

Future:

- Unit Tests
- Integration Tests
- API Tests

---

# 24. Best Practices

- Keep routes minimal.
- Keep controllers thin.
- Put business logic in services.
- Keep repositories database-focused.
- Validate every request.
- Return consistent responses.
- Version public APIs.
- Follow separation of concerns.

---

# 25. Verification Checklist

Before proceeding:

- Express server configured
- Folder structure created
- Routes implemented
- Controllers implemented
- Services implemented
- Repositories implemented
- Validation implemented
- Authentication middleware working
- Authorization verified
- Central error handler configured
- Logging configured
- API documentation generated
- Tests passing

---

# 26. Expected Outcome

At the end of this module:

- The backend follows a scalable layered architecture.
- Every API is secure, documented, and maintainable.
- Validation, authentication, and authorization are enforced.
- Controllers remain lightweight.
- Business logic is centralized in services.
- Database access is isolated in repositories.
- The backend is fully prepared for Socket.IO realtime collaboration.

# API Design

> **Project:** SyncBoard  
> **Version:** 1.0

---

# Overview

This directory defines the REST API specification for SyncBoard.

The API documentation serves as the contract between the frontend and backend teams. Every endpoint, request, response, validation rule, and error format must follow the standards defined here.

The APIs are designed to be:

- RESTful
- Stateless
- Secure
- Predictable
- Versionable
- Easy to consume
- Frontend-friendly

---

# Technology

Backend

- Next.js Route Handlers
- TypeScript

Authentication

- Clerk Authentication

Database

- PostgreSQL
- Prisma ORM

Validation

- Zod

Realtime

- Socket.IO

---

# API Base URL

Development

```
/api
```

Production

```
https://api.syncboard.app
```

(Current deployment URL will be finalized during deployment.)

---

# API Versioning

Current Version

```
v1
```

Example

```
/api/v1/workspaces
```

Future versions will follow semantic versioning.

Examples

```
/api/v2/workspaces
/api/v3/workspaces
```

---

# Authentication

Protected endpoints require a valid Clerk session.

Authentication uses:

- Bearer Token
- Clerk JWT

Example

Authorization:

```
Bearer <token>
```

---

# Response Format

Every endpoint must follow the common response structure defined in:

```
response-format.md
```

---

# Error Handling

All API errors follow the standard error specification in:

```
error-codes.md
```

---

# Validation

Every request body, query parameter, and route parameter must be validated using Zod before reaching business logic.

---

# Rate Limiting

Sensitive endpoints such as authentication, invitations, and uploads will enforce rate limits.

Details are documented in:

```
rate-limits.md
```

---

# API Modules

The API is organized into the following modules:

- Authentication
- Workspaces
- Boards
- Board Objects
- Comments
- Notifications

Additional modules may be added as the application grows.

---

# Design Principles

The SyncBoard API follows these principles:

- REST-first design
- Resource-oriented endpoints
- Consistent naming conventions
- Predictable status codes
- Idempotent operations where applicable
- Strong input validation
- Secure by default

---

# Next Steps

The following documents define the implementation details of each API module.

1. API Guidelines
2. Response Format
3. Error Codes
4. Authentication APIs
5. Workspace APIs
6. Board APIs
7. Board Object APIs
8. Comment APIs
9. Notification APIs
10. Rate Limiting

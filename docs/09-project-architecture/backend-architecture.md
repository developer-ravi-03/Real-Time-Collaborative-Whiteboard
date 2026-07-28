# Backend Architecture

> **Project:** SyncBoard
> **Document:** Backend Architecture
> **Version:** 1.0

---

# 1. Overview

This document defines the backend architecture for SyncBoard.

The backend is built using **Next.js Route Handlers**, **Socket.IO**, **Prisma ORM**, and **PostgreSQL** following a layered architecture inspired by Clean Architecture principles.

The objectives are:

- Scalability
- Maintainability
- Testability
- Security
- Separation of Concerns

---

# 2. Backend Technology Stack

Framework

- Next.js 15 Route Handlers

Language

- TypeScript

Realtime

- Socket.IO

Database

- PostgreSQL

ORM

- Prisma ORM

Authentication

- Clerk

Validation

- Zod

Storage

- Cloudinary

Future

- Redis
- Background Workers

---

# 3. Layered Architecture

The backend follows four primary layers.

```
Request
   │
Route Handler
   │
Controller
   │
Service
   │
Repository
   │
Prisma ORM
   │
PostgreSQL
```

Each layer has a single responsibility.

---

# 4. Request Flow

Every API request follows this lifecycle.

```
Client Request
      │
Authentication
      │
Validation
      │
Route Handler
      │
Controller
      │
Service
      │
Repository
      │
Database
      │
Response
```

This ensures consistency across all endpoints.

---

# 5. Route Handlers

Responsibilities:

- Receive HTTP requests
- Parse request data
- Call controllers
- Return HTTP responses

Route handlers should never contain business logic.

Example structure:

```
app/api/

boards/

route.ts

workspace/

route.ts
```

---

# 6. Controllers

Controllers are responsible for:

- Request validation
- Calling services
- Formatting responses
- Handling expected errors

Controllers should remain thin and delegate business logic to services.

---

# 7. Service Layer

The Service Layer contains all business logic.

Examples:

- Create workspace
- Invite member
- Create board
- Add comment
- Upload file

Services may:

- Call multiple repositories
- Perform authorization checks
- Execute transactions
- Emit Socket.IO events

Services must not contain raw Prisma queries.

---

# 8. Repository Layer

Repositories are responsible for:

- CRUD operations
- Prisma queries
- Database transactions
- Data mapping

Repositories should not contain business rules.

---

# 9. Database Access

All database access must go through Prisma.

Never access Prisma directly from:

- Route Handlers
- Controllers
- UI Components
- Socket Handlers

Only repositories communicate with Prisma.

---

# 10. Validation

All incoming data must be validated using Zod.

Validation occurs before business logic executes.

Validation includes:

- Request body
- Query parameters
- Route parameters
- Socket payloads

---

# 11. Authentication

Authentication is handled using Clerk.

Responsibilities:

- Verify identity
- Retrieve current user
- Protect private routes
- Secure Socket.IO connections

Unauthenticated requests should return:

401 Unauthorized

---

# 12. Authorization

Authorization determines what an authenticated user can do.

Examples:

- Workspace Owner
- Admin
- Member
- Guest

Permissions should be enforced in the Service Layer.

---

# 13. Error Handling

Use centralized error handling.

Expected errors:

- Validation errors
- Unauthorized
- Forbidden
- Not Found
- Conflict

Unexpected errors:

- Database failures
- External service failures
- Internal exceptions

Never expose internal implementation details to clients.

---

# 14. Logging

Log:

- Incoming requests
- Authentication failures
- API errors
- Database errors
- Socket events
- Critical operations

Sensitive information must never be logged.

---

# 15. Socket.IO Integration

Socket.IO follows the same architecture.

```
Socket Event

↓

Authentication

↓

Validation

↓

Service Layer

↓

Repository

↓

Database

↓

Broadcast Event
```

Business logic remains inside services.

---

# 16. Transactions

Use Prisma transactions for operations involving multiple database changes.

Examples:

- Creating a workspace with default roles
- Deleting a board and related resources
- Accepting an invitation

Transactions ensure data consistency.

---

# 17. Security

Backend security includes:

- HTTPS
- Input validation
- Rate limiting
- Secure headers
- RBAC
- SQL injection protection (Prisma)
- Secret management

---

# 18. Scalability

The architecture supports:

- Redis
- Horizontal scaling
- Background jobs
- Event queues
- Read replicas
- Microservices (future)

---

# 19. Best Practices

- Keep route handlers thin.
- Keep controllers lightweight.
- Place business logic only in services.
- Place database logic only in repositories.
- Validate all external input.
- Use dependency injection where beneficial.
- Keep modules loosely coupled.

---

# 20. Conclusion

The SyncBoard backend architecture provides a modular, scalable, and secure foundation. By separating routing, business logic, and data access into dedicated layers, the backend remains easy to maintain, test, and extend as the platform evolves.

# Service Layer

> **Project:** SyncBoard
> **Document:** Service Layer
> **Version:** 1.0

---

# 1. Overview

The Service Layer contains all business logic for SyncBoard.

It acts as the bridge between controllers (or route handlers) and repositories, ensuring that business rules are centralized and reusable.

The goals of the Service Layer are:

- Encapsulate business logic
- Coordinate repositories
- Enforce business rules
- Improve testability
- Reduce duplication

---

# 2. Position in the Architecture

```
Client
   │
Route Handler
   │
Controller
   │
Service Layer
   │
Repository Layer
   │
Prisma ORM
   │
PostgreSQL
```

---

# 3. Responsibilities

Services are responsible for:

- Business logic
- Authorization checks
- Validation orchestration
- Calling repositories
- Managing transactions
- Coordinating multiple resources
- Triggering realtime events
- Calling external services

Services should never return raw database models directly to the client.

---

# 4. What Belongs in a Service

Examples:

- Create Workspace
- Rename Workspace
- Invite Member
- Remove Member
- Create Board
- Delete Board
- Duplicate Board
- Add Comment
- Upload File
- Send Notification

If the logic represents a business rule, it belongs in a service.

---

# 5. What Does NOT Belong

Services should NOT contain:

- HTTP request parsing
- HTTP response formatting
- JSX
- React logic
- Prisma queries
- SQL statements

These responsibilities belong to other layers.

---

# 6. Service Structure

```
services/

workspace/

workspace.service.ts

board/

board.service.ts

canvas/

canvas.service.ts

comment/

comment.service.ts
```

Each feature owns its own service.

---

# 7. Service Flow

Example:

```
Create Board

↓

Validate User

↓

Check Workspace Permission

↓

Create Board

↓

Create Default Canvas

↓

Emit Socket Event

↓

Return Result
```

A single service may coordinate multiple repositories and external systems.

---

# 8. Repository Interaction

Services communicate with repositories only.

Example:

```
BoardService

↓

BoardRepository

↓

WorkspaceRepository

↓

UserRepository
```

Repositories should never call services.

---

# 9. Transactions

Services manage transactions when multiple database operations must succeed or fail together.

Example:

```
Create Workspace

↓

Create Workspace Record

↓

Create Default Board

↓

Assign Owner Role

↓

Commit Transaction
```

Rollback automatically if any step fails.

---

# 10. Authorization

Authorization belongs in the Service Layer.

Examples:

- Is workspace owner?
- Can edit board?
- Can invite members?
- Can delete comments?

Unauthorized operations should throw appropriate domain errors.

---

# 11. Validation

Validation flow:

```
Request

↓

Zod Validation

↓

Service

↓

Repository
```

Services may perform additional business validations beyond schema validation.

Examples:

- Workspace name must be unique.
- User cannot invite themselves.
- Board limit not exceeded.

---

# 12. External Integrations

Services coordinate with external providers such as:

- Clerk
- Cloudinary
- Email service (future)
- AI service (future)
- Redis (future)

External APIs should never be called directly from controllers.

---

# 13. Socket.IO Integration

Services publish realtime events after successful operations.

Example:

```
Create Comment

↓

Save Comment

↓

Emit Comment Created Event

↓

Connected Clients Update
```

Realtime events should only be emitted after successful persistence.

---

# 14. Error Handling

Services throw domain-specific errors.

Examples:

- WorkspaceNotFoundError
- PermissionDeniedError
- BoardLimitExceededError
- DuplicateWorkspaceNameError

Controllers translate these into HTTP responses.

---

# 15. Logging

Important business operations should be logged.

Examples:

- Workspace created
- Member invited
- Board deleted
- File uploaded

Sensitive information must never be logged.

---

# 16. Testing

Service tests should verify:

- Business rules
- Authorization
- Transactions
- Repository interaction
- Error handling

Repositories should be mocked during unit testing.

---

# 17. Best Practices

- Keep services focused.
- One service per feature.
- One public method per use case.
- Keep controllers thin.
- Never access Prisma directly.
- Reuse services instead of duplicating logic.
- Keep methods small and readable.

---

# 18. Future Enhancements

The Service Layer is designed to support:

- Background jobs
- Event-driven architecture
- CQRS
- Domain events
- Microservices
- AI-powered workflows

without major refactoring.

---

# 19. Conclusion

The Service Layer is the heart of the SyncBoard backend. By centralizing business logic and coordinating repositories, transactions, authorization, and realtime events, it provides a scalable and maintainable foundation for every feature in the application.

# Prisma Development

> **Project:** SyncBoard
> **Document:** Prisma Development
> **Phase:** 10 - Development
> **Version:** 1.0

---

# 1. Overview

This document defines the Prisma ORM implementation standards for SyncBoard.

Prisma is responsible for:

- Database schema management
- Type-safe database queries
- Migrations
- Relationships
- Transactions
- Seeding
- Query optimization

Every database interaction should pass through the Repository Layer using Prisma Client.

---

# 2. Objectives

After implementing this module, SyncBoard should provide:

- Centralized database access
- Type-safe queries
- Reliable migrations
- Optimized relationships
- Transaction support
- Soft delete support
- Seed data
- Repository integration
- Scalable schema management

---

# 3. Architecture

```
Controller

↓

Service

↓

Repository

↓

Prisma Client

↓

PostgreSQL
```

Repositories should be the only layer that directly interacts with Prisma Client.

---

# 4. Project Structure

```
prisma/

schema.prisma

migrations/

seed.ts

src/

generated/

repositories/

lib/

prisma.ts
```

Keep all Prisma-related configuration inside the `prisma/` directory.

---

# 5. Prisma Client

Create a singleton Prisma Client instance.

Responsibilities:

- Prevent multiple database connections
- Reuse connections during development
- Provide application-wide access

All repositories should import this shared client.

---

# 6. Schema Organization

Primary models:

```
User

Workspace

WorkspaceMember

Board

Shape

Comment

Notification

File

UserSettings
```

Future models:

```
Template

ActivityLog

AuditLog

AIRequest

Webhook
```

---

# 7. Relationships

Examples:

```
Workspace

↓

Boards

↓

Shapes

↓

Comments
```

```
User

↓

Workspace Membership

↓

Notifications

↓

Settings
```

Use explicit relations with meaningful names where necessary.

---

# 8. Naming Conventions

Models:

```
PascalCase
```

Fields:

```
camelCase
```

Enums:

```
UPPER_SNAKE_CASE
```

Table names should follow Prisma defaults unless a custom mapping is required.

---

# 9. Migrations

Migration workflow:

```
Update Schema

↓

Generate Migration

↓

Review SQL

↓

Apply Migration

↓

Commit Migration
```

Never edit applied migration files manually.

---

# 10. Development Commands

Generate Prisma Client

```bash
npx prisma generate
```

Create Migration

```bash
npx prisma migrate dev --name create_board_module
```

Deploy Migrations

```bash
npx prisma migrate deploy
```

Open Prisma Studio

```bash
npx prisma studio
```

Reset Database (Development Only)

```bash
npx prisma migrate reset
```

---

# 11. Repository Integration

Repositories should expose methods such as:

```
create()

findById()

findMany()

update()

delete()

exists()
```

Repositories must not contain business rules.

---

# 12. Transactions

Use transactions for operations involving multiple writes.

Examples:

- Create workspace + owner membership
- Delete board + related entities
- Transfer workspace ownership
- Invite multiple members

Use interactive transactions where business logic depends on intermediate results.

---

# 13. Soft Delete

Models requiring soft delete should include:

```
deletedAt DateTime?
```

Deleted records should be excluded from normal queries.

Permanent deletion should be reserved for cleanup jobs or administrative actions.

---

# 14. Indexing Strategy

Create indexes for:

- Foreign keys
- Frequently filtered columns
- Search fields
- Unique identifiers

Examples:

```
workspaceId

boardId

createdAt

email
```

Review query performance before adding composite indexes.

---

# 15. Query Optimization

Guidelines:

- Select only required fields
- Use pagination
- Avoid unnecessary joins
- Minimize nested queries
- Prevent N+1 query problems

Prefer explicit `select` over returning entire records when possible.

---

# 16. Pagination

Support:

Offset pagination

```
skip

take
```

Future:

Cursor pagination

```
cursor

take
```

Choose the appropriate strategy based on dataset size.

---

# 17. Seeding

Seed data should include:

- Demo users
- Sample workspaces
- Example boards
- Shapes
- Comments
- Notifications

Keep seed data deterministic for consistent development environments.

---

# 18. Error Handling

Handle:

- Unique constraint violations
- Foreign key violations
- Missing records
- Transaction failures
- Connection errors

Translate Prisma errors into application-specific exceptions.

---

# 19. Performance

Optimize using:

- Connection pooling
- Query batching
- Efficient indexes
- Lazy loading where appropriate
- Transactions only when required

Monitor slow queries regularly.

---

# 20. Security

- Never expose raw database errors.
- Validate all data before persistence.
- Restrict database access through repositories.
- Use parameterized queries via Prisma.
- Protect sensitive fields from unnecessary exposure.

---

# 21. Testing

Verify:

- CRUD operations
- Relationships
- Transactions
- Soft delete behavior
- Migrations
- Seed scripts
- Constraint handling
- Repository methods

Use an isolated test database.

---

# 22. Best Practices

- One shared Prisma Client instance.
- Keep schema readable and modular.
- Review generated migrations.
- Use transactions carefully.
- Avoid raw SQL unless absolutely necessary.
- Keep repositories focused on persistence.

---

# 23. Verification Checklist

Before proceeding:

- Prisma configured
- Client singleton created
- Schema finalized
- Migrations applied
- Seed script working
- Repository layer integrated
- Transactions tested
- Indexes reviewed
- Prisma Studio verified

---

# 24. Expected Outcome

At the end of this module:

- SyncBoard has a robust and type-safe database layer.
- Repositories provide clean access to PostgreSQL.
- Migrations and schema evolution are well managed.
- The project is ready to implement centralized validation standards across APIs, services, and realtime events.

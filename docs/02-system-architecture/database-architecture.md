# Database Architecture

> **Project:** SyncBoard  
> **Document:** Database Architecture  
> **Version:** 1.0  
> **Database:** PostgreSQL 17  
> **ORM:** Prisma ORM

---

# 1. Overview

The Database Architecture defines how SyncBoard stores, manages, secures, and retrieves relational data required for real-time collaboration.

The architecture is designed around PostgreSQL with Prisma ORM, providing ACID-compliant transactions, strong referential integrity, high performance, and long-term scalability.

This document establishes the database principles, relational model, indexing strategy, transaction management, security considerations, and scalability approach for the entire application.

---

# 2. Architecture Goals

The database architecture is designed with the following objectives:

- High Performance
- ACID Compliance
- Strong Referential Integrity
- Horizontal Read Scalability
- Efficient Query Execution
- Reliable Transactions
- Easy Maintenance
- Future Extensibility

---

# 3. Technology Stack

| Layer              | Technology             |
| ------------------ | ---------------------- |
| Database           | PostgreSQL 17          |
| ORM                | Prisma ORM             |
| Migration Tool     | Prisma Migrate         |
| Connection Pooling | PgBouncer (Production) |
| Cache (Future)     | Redis                  |
| Object Storage     | Cloudinary             |

---

# 4. Why PostgreSQL?

PostgreSQL was selected because SyncBoard contains highly relational data.

Examples include:

- Users ↔ Workspaces
- Workspaces ↔ Members
- Workspaces ↔ Boards
- Boards ↔ Objects
- Boards ↔ Comments
- Boards ↔ Versions
- Users ↔ Notifications

These relationships are naturally represented using relational tables and foreign keys.

PostgreSQL also provides:

- ACID transactions
- Strong consistency
- Advanced indexing
- JSON support when needed
- Excellent scalability
- Mature ecosystem

---

# 5. High-Level Data Model

```text
Users
   │
   ├────────────── owns ──────────────► Workspaces
   │                                      │
   │                                      ▼
   │                              Workspace Members
   │                                      │
   │                                      ▼
   │                                   Boards
   │                                      │
   ┌──────────────┬──────────────┬──────────────┬──────────────┐
   ▼              ▼              ▼              ▼
BoardObjects   Comments      Versions     ActivityLogs
   │
   ▼
Attachments

Users
 │
 └──────────────► Notifications
```

---

# 6. Core Tables

The primary database tables include:

- users
- workspaces
- workspace_members
- invitations
- boards
- board_objects
- comments
- notifications
- activity_logs
- board_versions
- attachments

Future tables may include:

- templates
- integrations
- api_keys
- audit_logs

---

# 7. Relationship Model

## User

A user can:

- Own multiple workspaces
- Join multiple workspaces
- Create multiple boards
- Comment on boards
- Receive notifications

Relationship:

```text
User (1) ───────────────► (N) Workspace
```

---

## Workspace

Each workspace contains:

- Members
- Boards
- Invitations

Relationship:

```text
Workspace (1)
      │
      ├────────► Members (N)
      ├────────► Boards (N)
      └────────► Invitations (N)
```

---

## Board

Each board contains:

- Canvas Objects
- Comments
- Version History
- Activity Records

Relationship:

```text
Board (1)
     │
     ├────────► Objects
     ├────────► Comments
     ├────────► Versions
     └────────► Activity Logs
```

---

# 8. Primary Keys

Every table uses UUID as the primary key.

Example:

```sql
id UUID PRIMARY KEY DEFAULT gen_random_uuid()
```

Benefits:

- Globally unique identifiers
- Safe distributed generation
- Difficult to enumerate
- Better security than incremental IDs

---

# 9. Foreign Key Strategy

Relationships are enforced using foreign keys.

Examples:

```text
boards.workspace_id
        │
        ▼
workspaces.id
```

```text
comments.board_id
        │
        ▼
boards.id
```

```text
workspace_members.user_id
        │
        ▼
users.id
```

Foreign keys guarantee referential integrity.

---

# 10. Common Table Structure

Most tables should contain:

```text
id
created_at
updated_at
created_by
updated_by
```

Where applicable:

```text
deleted_at
deleted_by
is_deleted
```

This provides consistency across the schema.

---

# 11. Indexing Strategy

Indexes should be created on frequently queried columns.

### Users

- email (Unique)
- clerk_user_id (Unique)

### Workspaces

- owner_id
- slug (Unique)

### Workspace Members

- workspace_id
- user_id

Composite Index:

(workspace_id, user_id)

### Boards

- workspace_id
- updated_at

### Board Objects

- board_id
- type

### Comments

- board_id
- created_at

### Notifications

- user_id
- is_read

Indexes should be reviewed regularly based on query execution plans.

---

# 12. Constraints

The schema should enforce:

- Primary Keys
- Foreign Keys
- Unique Constraints
- NOT NULL Constraints
- CHECK Constraints where appropriate

Examples:

- Email must be unique.
- Workspace slug must be unique.
- User role must be valid.
- Board name cannot be empty.

---

# 13. Transaction Strategy

Transactions are required for operations involving multiple tables.

Examples:

- Workspace creation
- Accepting invitations
- Board deletion
- Version restoration
- Member removal

Transactions should remain short and atomic.

---

# 14. Soft Delete Strategy

Important resources should use soft deletion.

Common fields:

```text
is_deleted
deleted_at
deleted_by
```

Advantages:

- Recovery
- Auditing
- Safer data management

---

# 15. Audit Fields

Administrative operations should record:

- User
- Action
- Resource
- Timestamp
- IP Address (optional)
- User Agent (optional)

Audit data supports debugging and compliance requirements.

---

# 16. Backup & Recovery

The database should support:

- Daily automated backups
- Point-in-time recovery
- Backup verification
- Secure off-site storage
- Disaster recovery testing

---

# 17. Performance Optimization

Performance strategies include:

- Proper indexing
- Query optimization
- Connection pooling
- Pagination
- Prepared statements
- Efficient joins
- Batch operations
- Future caching with Redis

---

# 18. Security Considerations

Database security includes:

- Encrypted connections (TLS)
- Principle of least privilege
- Role-based access
- Secure credentials
- Parameterized queries
- SQL injection prevention through Prisma
- Regular backups

---

# 19. Scalability Strategy

The architecture supports:

- Read Replicas
- Connection Pooling
- Query Optimization
- Partitioning (Future)
- Horizontal Read Scaling
- Redis Caching
- Independent Storage Scaling

---

# 20. Design Principles

The database architecture follows:

- Normalized relational design (3NF where appropriate)
- Strong referential integrity
- Minimal redundancy
- Predictable table structure
- Explicit relationships
- UUID-based identifiers
- ACID-compliant transactions

---

# 21. Conclusion

The PostgreSQL-based database architecture provides a robust foundation for SyncBoard's collaborative platform. By combining relational modeling, Prisma ORM, foreign key constraints, efficient indexing, and transactional consistency, the database is well-equipped to support real-time collaboration, future feature growth, and enterprise-scale deployments.

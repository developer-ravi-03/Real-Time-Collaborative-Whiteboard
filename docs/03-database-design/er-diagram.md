# Entity Relationship Diagram (ERD)

> **Project:** SyncBoard  
> **Document:** Entity Relationship Diagram  
> **Version:** 1.0  
> **Database:** PostgreSQL 17  
> **ORM:** Prisma ORM

---

# 1. Overview

This document defines the logical data model of SyncBoard by identifying the primary entities, their ownership, relationships, and cardinality.

The ERD serves as the foundation for the PostgreSQL database schema and ensures consistent data modeling across the application.

This document is intentionally implementation-independent. Column definitions, indexes, constraints, and Prisma models are covered separately in `schema-design.md`.

---

# 2. Design Goals

The entity model is designed to achieve:

- Clear ownership hierarchy
- Strong referential integrity
- Minimal data redundancy
- Scalable relationships
- Predictable query patterns
- Easy maintenance
- Future extensibility

---

# 3. Core Entities

SyncBoard consists of the following primary entities:

| Entity          | Purpose                                                  |
| --------------- | -------------------------------------------------------- |
| User            | Represents an authenticated application user             |
| Workspace       | Top-level collaboration space                            |
| WorkspaceMember | Associates users with workspaces and roles               |
| Invitation      | Pending workspace invitations                            |
| Board           | Collaborative whiteboard within a workspace              |
| BoardObject     | Shapes, text, images, sticky notes, connectors, drawings |
| Comment         | Threaded discussions on boards                           |
| Attachment      | Files attached to boards or comments                     |
| BoardVersion    | Snapshot of board state                                  |
| Notification    | User notifications                                       |
| ActivityLog     | Records significant user actions                         |

---

# 4. High-Level Entity Relationship Diagram

```text
                                   +----------------+
                                   |     Users      |
                                   +----------------+
                                      │
                 ┌────────────────────┼────────────────────┐
                 │                    │                    │
                 │                    │                    │
                 ▼                    ▼                    ▼
          +---------------+   +----------------+   +----------------+
          | Workspaces    |   | Notifications  |   | Activity Logs  |
          +---------------+   +----------------+   +----------------+
                 │
                 │
                 ▼
      +-----------------------+
      | Workspace Members     |
      +-----------------------+
                 │
                 ▼
          +---------------+
          |    Boards     |
          +---------------+
          │      │      │
          │      │      │
          ▼      ▼      ▼
 +---------------+ +-------------+ +----------------+
 | Board Objects | |  Comments   | | Board Versions |
 +---------------+ +-------------+ +----------------+
         │
         ▼
 +----------------+
 | Attachments    |
 +----------------+
```

---

# 5. Ownership Hierarchy

The ownership hierarchy follows a strict parent-child structure.

```text
User
 │
 ▼
Workspace
 │
 ▼
Board
 │
 ├────────► Board Objects
 ├────────► Comments
 ├────────► Versions
 ├────────► Attachments
 └────────► Activity Logs
```

This hierarchy ensures predictable deletion, authorization, and data access.

---

# 6. Relationship Summary

| Parent Entity | Child Entity    | Relationship |
| ------------- | --------------- | ------------ |
| User          | Workspace       | One-to-Many  |
| User          | Notification    | One-to-Many  |
| User          | ActivityLog     | One-to-Many  |
| Workspace     | WorkspaceMember | One-to-Many  |
| Workspace     | Invitation      | One-to-Many  |
| Workspace     | Board           | One-to-Many  |
| Board         | BoardObject     | One-to-Many  |
| Board         | Comment         | One-to-Many  |
| Board         | BoardVersion    | One-to-Many  |
| Board         | Attachment      | One-to-Many  |

---

# 7. Cardinality

## User → Workspace

```text
One User
     │
     ▼
Many Workspaces
```

---

## Workspace → WorkspaceMember

```text
One Workspace
      │
      ▼
Many Members
```

---

## Workspace → Board

```text
One Workspace
      │
      ▼
Many Boards
```

---

## Board → BoardObject

```text
One Board
     │
     ▼
Many Objects
```

---

## Board → Comment

```text
One Board
     │
     ▼
Many Comments
```

---

## Board → Version

```text
One Board
     │
     ▼
Many Versions
```

---

## User → Notification

```text
One User
     │
     ▼
Many Notifications
```

---

## User → Activity Log

```text
One User
     │
     ▼
Many Activity Records
```

---

# 8. Aggregate Boundaries

Each aggregate has a single root entity.

| Aggregate           | Root Entity |
| ------------------- | ----------- |
| User Aggregate      | User        |
| Workspace Aggregate | Workspace   |
| Board Aggregate     | Board       |

### Workspace Aggregate

Contains:

- Workspace
- Workspace Members
- Invitations

---

### Board Aggregate

Contains:

- Board
- Board Objects
- Comments
- Attachments
- Versions
- Activity Logs

Each aggregate should be modified through its root entity to maintain consistency.

---

# 9. Referential Integrity

The application relies on PostgreSQL foreign key constraints to maintain data integrity.

Key principles include:

- Every Board belongs to one Workspace.
- Every Board Object belongs to one Board.
- Every Comment belongs to one Board.
- Every Workspace Member references both a User and a Workspace.
- Every Notification belongs to one User.

Invalid references must not exist in the database.

---

# 10. Lifecycle Rules

The following lifecycle rules apply:

- A Workspace cannot exist without an Owner.
- A Board cannot exist without a Workspace.
- A Board Object cannot exist without a Board.
- Notifications are user-specific.
- Comments are scoped to a Board.
- Versions belong to a single Board.

Deletion behavior (CASCADE, RESTRICT, SET NULL) is defined in `relationships.md`.

---

# 11. Future Expansion

The data model is designed to support future entities without breaking existing relationships.

Potential future entities include:

- Templates
- Organizations
- Teams
- API Keys
- Integrations
- Webhooks
- AI Sessions
- Presentation Sessions

These entities can be integrated while preserving the existing ownership hierarchy.

---

# 12. Design Principles

The ER model follows these principles:

- Single source of truth
- Strong ownership hierarchy
- Minimal redundancy
- Explicit relationships
- Aggregate-oriented design
- High cohesion
- Low coupling

---

# 13. Conclusion

The Entity Relationship Diagram establishes the logical structure of SyncBoard's relational database. It defines the primary entities, ownership hierarchy, and cardinality while remaining independent of implementation details.

The next document, `relationships.md`, specifies foreign keys, cascade rules, update behavior, and delete behavior for every relationship.

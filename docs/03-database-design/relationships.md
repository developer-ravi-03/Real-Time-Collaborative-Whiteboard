# Database Relationships

> **Project:** SyncBoard  
> **Document:** Database Relationships  
> **Version:** 1.0  
> **Database:** PostgreSQL 17  
> **ORM:** Prisma ORM

---

# 1. Overview

This document defines the relationships between the core database entities in SyncBoard. It specifies relationship types, foreign keys, cascade rules, update behavior, and business constraints.

These relationships ensure strong referential integrity while supporting a scalable and maintainable relational database design.

---

# 2. Relationship Principles

The database follows these principles:

- Every child entity must reference a valid parent.
- Foreign key constraints are enforced by PostgreSQL.
- Cascading operations are used only where appropriate.
- Ownership relationships are explicit.
- Many-to-Many relationships use junction tables.
- Business rules are enforced at both the application and database layers.

---

# 3. User → Workspace

## Relationship

**One User → Many Workspaces (1:N)**

A user can own multiple workspaces.

A workspace has exactly one owner.

### Foreign Key

```text
workspaces.owner_id
      │
      ▼
users.id
```

| Property    | Value               |
| ----------- | ------------------- |
| Type        | One-to-Many         |
| Required    | Yes                 |
| Foreign Key | workspaces.owner_id |
| On Update   | CASCADE             |
| On Delete   | RESTRICT            |

### Business Rules

- Every workspace must have one owner.
- Ownership cannot be null.
- Ownership transfer must occur before deleting an owner account.

---

# 4. User ↔ WorkspaceMember

## Relationship

**Many Users ↔ Many Workspaces (M:N)**

Implemented using the `workspace_members` junction table.

```text
Users
   │
   ▼
workspace_members
   ▲
   │
Workspaces
```

### Foreign Keys

```text
workspace_members.user_id
        │
        ▼
users.id

workspace_members.workspace_id
        │
        ▼
workspaces.id
```

| Property       | Value             |
| -------------- | ----------------- |
| Type           | Many-to-Many      |
| Junction Table | workspace_members |
| On Update      | CASCADE           |
| On Delete      | CASCADE           |

### Business Rules

- A user may belong to multiple workspaces.
- A workspace may contain multiple users.
- Each user can appear only once per workspace.
- Role is stored in the junction table.

Unique Constraint:

```text
(workspace_id, user_id)
```

---

# 5. Workspace → Invitation

## Relationship

**One Workspace → Many Invitations (1:N)**

Each invitation belongs to one workspace.

### Foreign Key

```text
invitations.workspace_id
        │
        ▼
workspaces.id
```

| Property  | Value       |
| --------- | ----------- |
| Type      | One-to-Many |
| Required  | Yes         |
| On Update | CASCADE     |
| On Delete | CASCADE     |

### Business Rules

- Invitations expire after a configured duration.
- Accepted invitations are archived.
- Expired invitations cannot be reused.

---

# 6. Workspace → Board

## Relationship

**One Workspace → Many Boards (1:N)**

Each board belongs to exactly one workspace.

### Foreign Key

```text
boards.workspace_id
        │
        ▼
workspaces.id
```

| Property  | Value       |
| --------- | ----------- |
| Type      | One-to-Many |
| Required  | Yes         |
| On Update | CASCADE     |
| On Delete | CASCADE     |

### Business Rules

- A board cannot exist outside a workspace.
- Board names should be unique within the same workspace.

---

# 7. Board → BoardObject

## Relationship

**One Board → Many Board Objects (1:N)**

Each drawable object belongs to one board.

### Foreign Key

```text
board_objects.board_id
          │
          ▼
boards.id
```

| Property  | Value       |
| --------- | ----------- |
| Type      | One-to-Many |
| Required  | Yes         |
| On Update | CASCADE     |
| On Delete | CASCADE     |

### Business Rules

- Objects cannot exist independently.
- Deleting a board removes all associated objects.

---

# 8. Board → Comment

## Relationship

**One Board → Many Comments (1:N)**

### Foreign Key

```text
comments.board_id
      │
      ▼
boards.id
```

| Property  | Value       |
| --------- | ----------- |
| Type      | One-to-Many |
| Required  | Yes         |
| On Update | CASCADE     |
| On Delete | CASCADE     |

### Business Rules

- Comments belong to a single board.
- Comments may optionally reference a specific board object.

---

# 9. Board → Attachment

## Relationship

**One Board → Many Attachments (1:N)**

### Foreign Key

```text
attachments.board_id
        │
        ▼
boards.id
```

| Property  | Value       |
| --------- | ----------- |
| Type      | One-to-Many |
| Required  | Yes         |
| On Update | CASCADE     |
| On Delete | CASCADE     |

---

# 10. Board → BoardVersion

## Relationship

**One Board → Many Versions (1:N)**

### Foreign Key

```text
board_versions.board_id
          │
          ▼
boards.id
```

| Property  | Value       |
| --------- | ----------- |
| Type      | One-to-Many |
| Required  | Yes         |
| On Update | CASCADE     |
| On Delete | CASCADE     |

### Business Rules

- Versions are immutable.
- A restore operation creates a new active state without modifying historical versions.

---

# 11. User → Notification

## Relationship

**One User → Many Notifications (1:N)**

### Foreign Key

```text
notifications.user_id
         │
         ▼
users.id
```

| Property  | Value       |
| --------- | ----------- |
| Type      | One-to-Many |
| Required  | Yes         |
| On Update | CASCADE     |
| On Delete | CASCADE     |

### Business Rules

- Notifications are private to the recipient.
- Users can mark notifications as read without deleting them.

---

# 12. User → ActivityLog

## Relationship

**One User → Many Activity Logs (1:N)**

### Foreign Key

```text
activity_logs.user_id
        │
        ▼
users.id
```

| Property  | Value       |
| --------- | ----------- |
| Type      | One-to-Many |
| Required  | Yes         |
| On Update | CASCADE     |
| On Delete | SET NULL    |

### Business Rules

- Activity history should remain available for auditing even if a user account is removed.
- If a user is deleted, the activity record is retained with a null user reference where permitted.

---

# 13. Relationship Summary

| Parent    | Child           | Type | FK           | On Delete |
| --------- | --------------- | ---- | ------------ | --------- |
| User      | Workspace       | 1:N  | owner_id     | RESTRICT  |
| User      | WorkspaceMember | M:N  | user_id      | CASCADE   |
| Workspace | WorkspaceMember | 1:N  | workspace_id | CASCADE   |
| Workspace | Invitation      | 1:N  | workspace_id | CASCADE   |
| Workspace | Board           | 1:N  | workspace_id | CASCADE   |
| Board     | BoardObject     | 1:N  | board_id     | CASCADE   |
| Board     | Comment         | 1:N  | board_id     | CASCADE   |
| Board     | Attachment      | 1:N  | board_id     | CASCADE   |
| Board     | BoardVersion    | 1:N  | board_id     | CASCADE   |
| User      | Notification    | 1:N  | user_id      | CASCADE   |
| User      | ActivityLog     | 1:N  | user_id      | SET NULL  |

---

# 14. Cascade Strategy

The database follows these cascade rules:

### CASCADE

Used for dependent entities:

- Workspace → Boards
- Board → Objects
- Board → Comments
- Board → Versions
- Board → Attachments

### RESTRICT

Used for ownership:

- User → Workspace

### SET NULL

Used for historical records:

- User → ActivityLog

---

# 15. Referential Integrity

PostgreSQL foreign key constraints ensure:

- No orphan records.
- Valid parent-child relationships.
- Consistent updates.
- Safe deletions.

Application-level validation complements database constraints by enforcing business-specific rules.

---

# 16. Conclusion

The relationship model establishes a clear ownership hierarchy and enforces strong referential integrity across SyncBoard's relational database. It balances data consistency, auditability, and scalability while providing a solid foundation for the Prisma schema and SQL table definitions documented in `schema-design.md`.

---

# Database Schema Design

> **Project:** SyncBoard
> **Document:** Database Schema Design
> **Version:** 1.0
> **Database:** PostgreSQL 17
> **ORM:** Prisma ORM

---

# 1. Overview

This document defines the implementation-ready relational schema for SyncBoard. It specifies the database tables, columns, constraints, indexes, relationships, and naming conventions that will be used throughout the application.

This document serves as the source of truth for database implementation using PostgreSQL and Prisma ORM.

---

# 2. Database Naming Conventions

The following conventions shall be followed consistently.

## Tables

- Use lowercase snake_case.
- Use plural nouns.

Examples:

- users
- workspaces
- workspace_members
- boards
- board_objects

---

## Columns

Use snake_case.

Examples:

- created_at
- updated_at
- owner_id
- workspace_id

---

## Primary Keys

Every table uses UUID.

Example:

```sql
id UUID PRIMARY KEY DEFAULT gen_random_uuid()
```

---

## Foreign Keys

Foreign keys use the format:

```
<parent>_id
```

Examples:

- workspace_id
- board_id
- user_id

---

## Timestamps

Every mutable table includes:

- created_at
- updated_at

Soft-deletable tables additionally include:

- deleted_at
- deleted_by
- is_deleted

---

# 3. Standard Audit Fields

Unless otherwise specified, each table includes:

| Column     | Type        |
| ---------- | ----------- |
| created_at | TIMESTAMPTZ |
| updated_at | TIMESTAMPTZ |
| created_by | UUID        |
| updated_by | UUID        |

---

# 4. Core Tables

The initial version of SyncBoard consists of the following tables:

1. users
2. workspaces
3. workspace_members
4. invitations
5. boards
6. board_objects
7. comments
8. attachments
9. notifications
10. board_versions
11. activity_logs

---

# 5. Table Design Template

Each table in this document follows the same structure:

- Purpose
- Columns
- Constraints
- Foreign Keys
- Indexes
- Relationships
- Prisma Model
- SQL Definition
- Example Record
- Notes

---

# 6. Table Specifications

The following sections define each table individually.

---

## 6.1 users

### Purpose

Stores authenticated user accounts.

### Primary Key

```
id UUID
```

### Relationships

- Owns Workspaces
- Member of Workspaces
- Receives Notifications
- Creates Comments

---

## 6.2 workspaces

Purpose:

Top-level collaboration space.

Relationships:

- Owner → User
- Contains Boards
- Contains Members

---

## 6.3 workspace_members

Purpose:

Maps users to workspaces and stores their role.

Relationships:

- User
- Workspace

Composite Unique Constraint:

```
(workspace_id, user_id)
```

---

## 6.4 boards

Purpose:

Collaborative whiteboard.

Relationships:

- Workspace
- Objects
- Comments
- Versions

---

## 6.5 board_objects

Purpose:

Stores every drawable object.

Supported object types:

- Rectangle
- Circle
- Line
- Arrow
- Sticky Note
- Text
- Image
- Connector
- Freehand Drawing

---

## 6.6 comments

Purpose:

Stores threaded discussions.

---

## 6.7 attachments

Purpose:

Stores uploaded files.

---

## 6.8 notifications

Purpose:

Stores user notifications.

---

## 6.9 board_versions

Purpose:

Stores board snapshots.

---

## 6.10 activity_logs

Purpose:

Stores audit events.

---

# 7. Global Constraints

The database enforces:

- Primary Keys
- Foreign Keys
- Unique Constraints
- NOT NULL Constraints
- CHECK Constraints

---

# 8. Global Indexing Strategy

Indexes include:

- email
- clerk_user_id
- owner_id
- workspace_id
- board_id
- user_id
- updated_at

Composite indexes are added where appropriate.

---

# 9. Transaction Boundaries

Transactions are required for:

- Workspace creation
- Invitation acceptance
- Member removal
- Board deletion
- Version restoration

---

# 10. Soft Delete Policy

Soft deletion applies to:

- Workspaces
- Boards
- Board Objects
- Comments
- Attachments

Users are never physically deleted without an explicit administrative workflow.

---

# 11. Migration Strategy

Database schema changes are managed through Prisma Migrate.

Rules:

- Never modify production tables manually.
- Every schema change requires a migration.
- Rollback procedures should be documented.
- Migrations must be tested in staging before production.

---

# 12. Conclusion

This schema design provides the implementation blueprint for SyncBoard's PostgreSQL database. The following implementation artifacts will be derived directly from this specification:

- Prisma Schema
- SQL Migrations
- Database Seed Scripts
- Repository Layer
- Query Optimization

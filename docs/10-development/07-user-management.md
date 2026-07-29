# User Management

> **Project:** SyncBoard
> **Document:** User Management
> **Phase:** 10 - Development
> **Version:** 1.0

---

# 1. Overview

This document defines how authenticated users are managed within SyncBoard.

Clerk is the source of authentication, while PostgreSQL stores application-specific user information.

Responsibilities include:

- User synchronization
- Profile management
- User preferences
- Avatar management
- Activity tracking
- Role assignment
- Account lifecycle

---

# 2. Objectives

After completing this module, SyncBoard should support:

- Automatic user creation
- User profile management
- Avatar synchronization
- User preferences
- Account settings
- Activity tracking
- Soft deletion
- Role management
- User search

---

# 3. Architecture

```
User

↓

Clerk

↓

Webhook

↓

User Service

↓

User Repository

↓

PostgreSQL
```

---

# 4. User Lifecycle

```
Sign Up

↓

Clerk User Created

↓

Webhook Triggered

↓

Create Database User

↓

User Active

↓

Profile Updates

↓

Delete Request

↓

Soft Delete
```

---

# 5. User Model

Suggested fields:

```
id

clerkId

email

username

firstName

lastName

displayName

avatarUrl

bio

role

status

lastLoginAt

createdAt

updatedAt

deletedAt
```

---

# 6. User Status

Possible values:

```
ACTIVE

INACTIVE

SUSPENDED

DELETED
```

Only ACTIVE users can access SyncBoard.

---

# 7. Roles

Application roles:

```
USER

ADMIN

SUPER_ADMIN
```

Workspace permissions are handled separately.

---

# 8. Profile Management

Users can update:

- Display Name
- Bio
- Avatar
- Time Zone
- Language

Sensitive authentication fields remain managed by Clerk.

---

# 9. User Preferences

Suggested preferences:

```
Theme

Language

Notifications

Timezone

Date Format

Email Preferences
```

Store preferences in the database.

---

# 10. Avatar Handling

Avatar source:

```
Clerk

↓

Cloudinary (optional future)

↓

Application
```

Fallback avatar should be generated if no image exists.

---

# 11. User Synchronization

Sync events:

- User Created
- User Updated
- User Deleted

Webhooks should update PostgreSQL automatically.

---

# 12. Service Layer

Responsibilities:

- Create user
- Update profile
- Update preferences
- Find user
- Search users
- Soft delete account

Business rules belong here.

---

# 13. Repository Layer

Responsibilities:

- CRUD operations
- Efficient queries
- Pagination
- Filtering
- Searching

No business logic.

---

# 14. API Endpoints

Examples:

```
GET    /api/users/me

PATCH  /api/users/me

GET    /api/users/:id

GET    /api/users/search

DELETE /api/users/me
```

---

# 15. User Search

Support searching by:

- Name
- Username
- Email (admin only)

Future enhancements:

- Full-text search
- Fuzzy matching

---

# 16. Activity Tracking

Track:

- Last login
- Profile updates
- Account creation
- Workspace joins
- Workspace leaves

Audit logs should remain immutable.

---

# 17. Soft Delete

Deleting an account should:

```
Mark deletedAt

↓

Deactivate account

↓

Retain historical references
```

Avoid hard deletion unless legally required.

---

# 18. Security

- Validate ownership before updates.
- Never expose sensitive fields.
- Sanitize profile input.
- Restrict admin-only operations.
- Protect search endpoints.

---

# 19. Testing

Verify:

- User creation
- Profile updates
- Preference updates
- Avatar updates
- Search
- Soft deletion
- Unauthorized access
- Webhook synchronization

---

# 20. Best Practices

- Keep Clerk as the authentication authority.
- Store only application-specific data.
- Never duplicate authentication logic.
- Validate all profile updates.
- Prefer soft deletion.

---

# 21. Verification Checklist

Before proceeding:

- User schema created
- Webhooks configured
- User service implemented
- Repository implemented
- Profile API working
- Preferences saved
- Search working
- Soft deletion verified

---

# 22. Expected Outcome

At the end of this step:

- Every authenticated Clerk user is synchronized with PostgreSQL.
- User profiles and preferences are fully managed.
- The application is ready for workspaces, boards, permissions, and collaboration.

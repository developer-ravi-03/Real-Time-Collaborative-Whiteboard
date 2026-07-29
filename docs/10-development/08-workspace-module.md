# Workspace Module

> **Project:** SyncBoard
> **Document:** Workspace Module
> **Phase:** 10 - Development
> **Version:** 1.0

---

# 1. Overview

The Workspace Module is the primary organizational unit in SyncBoard.

Every board, member, invitation, permission, and collaborative resource belongs to a workspace.

This module provides:

- Workspace creation
- Workspace management
- Member management
- Invitations
- Roles & permissions
- Workspace settings
- Ownership transfer
- Soft deletion

---

# 2. Objectives

After implementing this module, users should be able to:

- Create workspaces
- Edit workspace details
- Delete workspaces
- Invite members
- Accept invitations
- Remove members
- Change member roles
- Transfer ownership
- Leave workspaces

---

# 3. Workspace Architecture

```
User

↓

Workspace

↓

Boards

↓

Canvas

↓

Shapes

↓

Comments

↓

Realtime
```

Every feature is scoped to a workspace.

---

# 4. Database Models

## Workspace

Suggested fields:

```
id

name

slug

description

logoUrl

ownerId

visibility

createdAt

updatedAt

deletedAt
```

---

## WorkspaceMember

```
id

workspaceId

userId

role

joinedAt
```

---

## WorkspaceInvitation

```
id

workspaceId

email

role

token

status

expiresAt

createdAt
```

---

# 5. Workspace Roles

Supported roles:

```
OWNER

ADMIN

MEMBER

VIEWER
```

---

# 6. Permissions Matrix

| Action             | Owner | Admin | Member | Viewer |
| ------------------ | :---: | :---: | :----: | :----: |
| View Workspace     |  ✅   |  ✅   |   ✅   |   ✅   |
| Create Board       |  ✅   |  ✅   |   ✅   |   ❌   |
| Delete Board       |  ✅   |  ✅   |   ❌   |   ❌   |
| Invite Members     |  ✅   |  ✅   |   ❌   |   ❌   |
| Remove Members     |  ✅   |  ✅   |   ❌   |   ❌   |
| Change Roles       |  ✅   |  ❌   |   ❌   |   ❌   |
| Delete Workspace   |  ✅   |  ❌   |   ❌   |   ❌   |
| Transfer Ownership |  ✅   |  ❌   |   ❌   |   ❌   |

---

# 7. Workspace Creation Flow

```
User

↓

Create Workspace

↓

Validate Input

↓

Generate Slug

↓

Save Workspace

↓

Add Owner as Member

↓

Return Workspace
```

---

# 8. Workspace Settings

Editable settings:

- Name
- Description
- Logo
- Visibility
- Default Board Permissions

---

# 9. Member Invitation Flow

```
Invite Member

↓

Generate Token

↓

Store Invitation

↓

Send Email

↓

Accept Invitation

↓

Create Membership

↓

Delete Invitation
```

Expired invitations cannot be accepted.

---

# 10. Joining a Workspace

A user joins by:

- Invitation link
- Email invitation

Future:

- Public workspaces
- Join request approval

---

# 11. Leaving a Workspace

Rules:

Owner cannot leave until:

- Ownership transferred
- Workspace deleted

Members may leave anytime.

---

# 12. Ownership Transfer

Flow:

```
Owner

↓

Select New Owner

↓

Update Membership

↓

Transfer Ownership

↓

Notify Members
```

Only one owner exists at a time.

---

# 13. Workspace Visibility

Supported options:

```
PRIVATE

PUBLIC (Future)

ORGANIZATION (Future)
```

Initially, SyncBoard supports private workspaces only.

---

# 14. Service Layer

WorkspaceService responsibilities:

- Create workspace
- Update workspace
- Delete workspace
- Invite member
- Remove member
- Transfer ownership
- Change role
- Search workspaces

---

# 15. Repository Layer

WorkspaceRepository responsibilities:

- CRUD operations
- Member queries
- Invitation queries
- Pagination
- Search

Repositories contain no business logic.

---

# 16. API Endpoints

Workspace:

```
POST   /api/workspaces

GET    /api/workspaces

GET    /api/workspaces/:id

PATCH  /api/workspaces/:id

DELETE /api/workspaces/:id
```

Members:

```
GET    /api/workspaces/:id/members

POST   /api/workspaces/:id/invitations

DELETE /api/workspaces/:id/members/:memberId

PATCH  /api/workspaces/:id/members/:memberId
```

Invitations:

```
POST   /api/invitations/accept

POST   /api/invitations/reject
```

---

# 17. Authorization Rules

Every request must verify:

- Authenticated user
- Workspace membership
- Required role
- Resource ownership (if applicable)

Authorization must be enforced in the Service Layer.

---

# 18. Search

Support searching by:

- Name
- Slug

Future enhancements:

- Description
- Tags
- Full-text search

---

# 19. Activity Logging

Track:

- Workspace created
- Workspace updated
- Member invited
- Member removed
- Role changed
- Ownership transferred
- Workspace deleted

Audit records should be immutable.

---

# 20. Notifications

Trigger notifications for:

- Invitation received
- Invitation accepted
- Member joined
- Member removed
- Ownership transferred

---

# 21. Security

- Validate all input with Zod.
- Verify permissions before every action.
- Prevent duplicate memberships.
- Prevent duplicate invitations.
- Validate invitation expiry.
- Use secure random tokens.

---

# 22. Testing

Verify:

- Workspace creation
- Workspace update
- Workspace deletion
- Member invitation
- Invitation acceptance
- Member removal
- Role updates
- Ownership transfer
- Unauthorized access
- Duplicate invitations

---

# 23. Best Practices

- One owner per workspace.
- Keep authorization in the Service Layer.
- Use transactions for multi-step operations.
- Log important actions.
- Soft delete workspaces.

---

# 24. Verification Checklist

Before proceeding:

- Workspace schema created
- Member schema created
- Invitation schema created
- Workspace service implemented
- Repository implemented
- APIs working
- Authorization verified
- Activity logging implemented

---

# 25. Expected Outcome

At the end of this module:

- Users can create and manage workspaces.
- Members can collaborate securely.
- Roles and permissions are enforced.
- Invitations and ownership transfers work correctly.
- The application is ready to implement Boards, Canvas, and Realtime Collaboration.

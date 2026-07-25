# Workspace APIs

> **Project:** SyncBoard
> **Document:** Workspace APIs
> **Version:** 1.0
> **API Version:** v1

---

# 1. Overview

The Workspace module is the foundation of SyncBoard.

Every board belongs to exactly one workspace.

A workspace contains:

- Members
- Boards
- Invitations
- Activity Logs

Only authenticated users can create or access workspaces.

---

# 2. Resource Model

Workspace

```
Workspace
│
├── Owner
├── Members
├── Boards
├── Invitations
└── Activity Logs
```

---

# 3. Workspace Roles

| Role   | Description            |
| ------ | ---------------------- |
| Owner  | Full control           |
| Editor | Can create/edit boards |
| Viewer | Read-only access       |

---

# 4. Permissions Matrix

| Action           | Owner | Editor | Viewer |
| ---------------- | :---: | :----: | :----: |
| View Workspace   |  ✅   |   ✅   |   ✅   |
| Update Workspace |  ✅   |   ❌   |   ❌   |
| Delete Workspace |  ✅   |   ❌   |   ❌   |
| Invite Members   |  ✅   |   ✅   |   ❌   |
| Remove Members   |  ✅   |   ❌   |   ❌   |
| Create Boards    |  ✅   |   ✅   |   ❌   |
| Leave Workspace  | ✅\*  |   ✅   |   ✅   |

\*Owner must transfer ownership before leaving.

---

# 5. Endpoint Summary

| Method | Endpoint                                     | Purpose              |
| ------ | -------------------------------------------- | -------------------- |
| GET    | /workspaces                                  | List user workspaces |
| POST   | /workspaces                                  | Create workspace     |
| GET    | /workspaces/{workspaceId}                    | Workspace details    |
| PATCH  | /workspaces/{workspaceId}                    | Update workspace     |
| DELETE | /workspaces/{workspaceId}                    | Delete workspace     |
| GET    | /workspaces/{workspaceId}/members            | List members         |
| POST   | /workspaces/{workspaceId}/members            | Add member           |
| PATCH  | /workspaces/{workspaceId}/members/{memberId} | Update member role   |
| DELETE | /workspaces/{workspaceId}/members/{memberId} | Remove member        |
| POST   | /workspaces/{workspaceId}/leave              | Leave workspace      |
| POST   | /workspaces/{workspaceId}/transfer-ownership | Transfer ownership   |

---

# 6. Create Workspace

## Endpoint

```
POST /api/v1/workspaces
```

Authentication

- Required

Permission

- Any authenticated user

Request Body

```json
{
  "name": "Product Team",
  "description": "Internal product collaboration",
  "icon": "🚀"
}
```

Validation Rules

- Name required
- Name length: 3–60 characters
- Description optional
- Icon optional

Success

```
201 Created
```

Business Rules

- Creator becomes Owner.
- Creator is automatically added as a workspace member.
- Default workspace settings are created.
- Activity log entry is generated.

---

# 7. Get User Workspaces

## Endpoint

```
GET /api/v1/workspaces
```

Authentication

Required

Query Parameters

| Parameter | Description                |
| --------- | -------------------------- |
| page      | Pagination                 |
| limit     | Page size                  |
| search    | Search by name             |
| sort      | createdAt, updatedAt, name |
| order     | asc, desc                  |

Success

```
200 OK
```

Returns all workspaces where the authenticated user is a member.

---

# 8. Get Workspace

## Endpoint

```
GET /api/v1/workspaces/{workspaceId}
```

Authentication

Required

Permission

Workspace Member

Returns

- Workspace details
- Member count
- Board count
- Current user role

---

# 9. Update Workspace

## Endpoint

```
PATCH /api/v1/workspaces/{workspaceId}
```

Permission

Owner only

Editable Fields

- Name
- Description
- Icon

Business Rules

- Name must remain unique for the owner (optional rule).
- Changes are recorded in the activity log.

---

# 10. Delete Workspace

## Endpoint

```
DELETE /api/v1/workspaces/{workspaceId}
```

Permission

Owner only

Business Rules

Deleting a workspace also deletes:

- Boards
- Board Objects
- Comments
- Invitations
- Activity Logs
- Notifications (workspace-scoped)

Deletion follows the cascade strategy defined in the database documentation.

---

# 11. Members APIs

## List Members

```
GET /api/v1/workspaces/{workspaceId}/members
```

Returns:

- User
- Role
- Joined Date

---

## Invite Member

```
POST /api/v1/workspaces/{workspaceId}/members
```

Request

```json
{
  "email": "user@example.com",
  "role": "EDITOR"
}
```

Business Rules

- Email must exist in Clerk or an invitation is created.
- Duplicate invitations are not allowed.

---

## Update Member Role

```
PATCH /api/v1/workspaces/{workspaceId}/members/{memberId}
```

Permission

Owner only

Allowed Roles

- EDITOR
- VIEWER

Owner role cannot be assigned through this endpoint.

---

## Remove Member

```
DELETE /api/v1/workspaces/{workspaceId}/members/{memberId}
```

Permission

Owner only

Business Rules

- Owner cannot remove themselves.
- Last owner cannot be removed.

---

# 12. Leave Workspace

## Endpoint

```
POST /api/v1/workspaces/{workspaceId}/leave
```

Business Rules

- Editors and Viewers may leave directly.
- Owner must transfer ownership first.

---

# 13. Transfer Ownership

## Endpoint

```
POST /api/v1/workspaces/{workspaceId}/transfer-ownership
```

Request

```json
{
  "newOwnerId": "550e8400-e29b-41d4-a716-446655440000"
}
```

Business Rules

- New owner must already be a workspace member.
- Ownership transfer is atomic (transaction).
- Activity log is created.
- Notification is sent to both users.

---

# 14. Validation Rules

Workspace Name

- Required
- Trim whitespace
- 3–60 characters

Description

- Maximum 500 characters

Icon

- Optional
- Emoji or image reference

---

# 15. Activity Logging

The following actions generate activity logs:

- Workspace Created
- Workspace Updated
- Member Added
- Member Removed
- Role Changed
- Ownership Transferred
- Workspace Deleted

---

# 16. Security Considerations

- Verify JWT before every request.
- Verify workspace membership.
- Validate role permissions.
- Prevent IDOR attacks by checking ownership.
- Sanitize user input.

---

# 17. Performance Considerations

- Paginate workspace lists.
- Index `owner_id`.
- Index `workspace_id`.
- Cache workspace membership (future Redis support).
- Avoid N+1 queries using Prisma includes/selects.

---

# 18. Future Enhancements

- Workspace templates
- Workspace archive
- Workspace analytics
- Workspace branding
- Organization support
- Workspace quotas

---

# 19. Conclusion

The Workspace API provides the core collaboration functionality of SyncBoard. It manages workspace lifecycle, membership, ownership, and permissions while ensuring secure access and maintaining a consistent collaboration model.

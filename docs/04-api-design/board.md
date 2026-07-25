# Board APIs

> **Project:** SyncBoard
> **Document:** Board APIs
> **Version:** 1.0
> **API Version:** v1

---

# 1. Overview

A Board is the primary collaborative workspace inside a Workspace.

Users collaborate on boards in real-time by creating, editing, moving, deleting, and organizing objects on an infinite canvas.

Each board belongs to exactly one workspace.

---

# 2. Resource Hierarchy

Workspace
└── Board
├── Objects
├── Comments
├── Attachments
├── Versions
└── Activity Logs

---

# 3. Board Properties

A board contains:

- Name
- Description
- Visibility
- Background
- Created By
- Created At
- Updated At
- Last Opened At
- Workspace ID

---

# 4. Permissions Matrix

| Action          | Owner | Editor | Viewer |
| --------------- | :---: | :----: | :----: |
| View Board      |  ✅   |   ✅   |   ✅   |
| Create Board    |  ✅   |   ✅   |   ❌   |
| Update Board    |  ✅   |   ✅   |   ❌   |
| Delete Board    |  ✅   |   ❌   |   ❌   |
| Duplicate Board |  ✅   |   ✅   |   ❌   |
| Export Board    |  ✅   |   ✅   |   ✅   |
| Restore Version |  ✅   |   ✅   |   ❌   |

---

# 5. Endpoint Summary

| Method | Endpoint                         | Purpose                |
| ------ | -------------------------------- | ---------------------- |
| GET    | /workspaces/{workspaceId}/boards | List boards            |
| POST   | /workspaces/{workspaceId}/boards | Create board           |
| GET    | /boards/{boardId}                | Get board              |
| PATCH  | /boards/{boardId}                | Update board           |
| DELETE | /boards/{boardId}                | Delete board           |
| POST   | /boards/{boardId}/duplicate      | Duplicate board        |
| POST   | /boards/{boardId}/archive        | Archive board          |
| POST   | /boards/{boardId}/restore        | Restore archived board |
| GET    | /boards/{boardId}/versions       | Version history        |
| POST   | /boards/{boardId}/export         | Export board           |

---

# 6. Create Board

## Endpoint

POST /api/v1/workspaces/{workspaceId}/boards

### Authentication

Required

### Authorization

Owner or Editor

### Request Body

```json
{
  "name": "Sprint Planning",
  "description": "Planning board for Sprint 15",
  "background": "grid"
}
```

### Validation

- Name required
- 3–100 characters
- Description optional
- Background optional

### Business Rules

- Board belongs to one workspace.
- Creator becomes board creator.
- Empty canvas is initialized.
- Activity log entry is created.

### Success

201 Created

---

# 7. Get Boards

Endpoint

GET /api/v1/workspaces/{workspaceId}/boards

Query Parameters

| Parameter | Description                |
| --------- | -------------------------- |
| page      | Pagination                 |
| limit     | Page size                  |
| search    | Search by board name       |
| sort      | createdAt, updatedAt, name |
| order     | asc, desc                  |

Returns

- Board list
- Object count
- Member count
- Last updated

---

# 8. Get Board

Endpoint

GET /api/v1/boards/{boardId}

Returns

- Board Details
- Workspace
- Current User Role
- Board Settings

---

# 9. Update Board

Endpoint

PATCH /api/v1/boards/{boardId}

Editable Fields

- Name
- Description
- Background

Business Rules

- Only Owner or Editor.
- Activity log generated.
- updatedAt refreshed.

---

# 10. Delete Board

Endpoint

DELETE /api/v1/boards/{boardId}

Permission

Owner only

Cascade Deletes

- Objects
- Comments
- Attachments
- Versions
- Activities

---

# 11. Duplicate Board

Endpoint

POST /api/v1/boards/{boardId}/duplicate

Business Rules

Creates

- New Board
- Copies all objects
- Copies comments (optional future feature)
- Copies board settings

Does NOT copy

- Activity logs
- Notifications

---

# 12. Archive Board

Endpoint

POST /api/v1/boards/{boardId}/archive

Purpose

Soft delete board.

Archived boards:

- Hidden from normal list
- Restorable
- Cannot be edited

---

# 13. Restore Board

Endpoint

POST /api/v1/boards/{boardId}/restore

Permission

Owner

Restores archived board.

---

# 14. Version History

Endpoint

GET /api/v1/boards/{boardId}/versions

Returns

- Version ID
- Created By
- Timestamp
- Summary

---

# 15. Export Board

Endpoint

POST /api/v1/boards/{boardId}/export

Supported Formats

- PNG
- PDF
- JSON

Future

- SVG
- PPTX

---

# 16. Validation Rules

Board Name

- Required
- Trim whitespace
- 3–100 chars

Description

- Max 1000 chars

Background

Allowed values

- blank
- grid
- dots

---

# 17. Activity Logging

Generate logs for:

- Board Created
- Board Updated
- Board Deleted
- Board Archived
- Board Restored
- Board Exported
- Board Duplicated

---

# 18. Performance Considerations

- Paginate board list
- Lazy-load board objects
- Use object count instead of full object fetch
- Cache board metadata (future Redis)
- Optimize Prisma queries using select/include

---

# 19. Security Considerations

- Verify workspace membership
- Verify board ownership where required
- Prevent IDOR attacks
- Validate all UUID parameters
- Sanitize user input

---

# 20. Future Enhancements

- Favorite Boards
- Starred Boards
- Recent Boards
- Board Templates
- Public Share Links
- Password Protected Boards
- Board Analytics
- AI-generated Boards

---

# 21. Conclusion

The Board API manages the lifecycle of collaborative boards within a workspace. It provides secure CRUD operations, version history, export functionality, and establishes the foundation for real-time collaboration on the SyncBoard infinite canvas.

# 11. User Roles

SyncBoard uses Role-Based Access Control (RBAC) to ensure that users have the appropriate level of access within a workspace.

## 11.1 Role Hierarchy

```text
Owner
   │
   ▼
Admin
   │
   ▼
Editor
   │
   ▼
Viewer
```

---

## 11.2 Owner

The Owner is the creator of the workspace and has complete control over all resources.

### Permissions

- Create Workspace
- Edit Workspace
- Delete Workspace
- Invite Members
- Remove Members
- Promote/Demote Roles
- Create Boards
- Delete Boards
- Manage Workspace Settings
- Transfer Ownership
- View Activity Logs
- Manage Billing (Future)
- Export All Boards

---

## 11.3 Admin

Admins help manage the workspace.

### Permissions

- Invite Members
- Remove Editors/Viewers
- Create Boards
- Delete Boards
- Archive Boards
- Restore Boards
- Manage Workspace Settings
- View Activity Logs

Restrictions:

- Cannot delete workspace
- Cannot transfer ownership
- Cannot remove owner

---

## 11.4 Editor

Editors are responsible for creating and modifying content.

### Permissions

- Create Boards
- Edit Boards
- Draw
- Add Images
- Add Text
- Use Document Mode
- Use Infinite Canvas
- Share Boards
- Export Boards
- Comment

Restrictions

- Cannot delete workspace
- Cannot manage roles
- Cannot change workspace settings

---

## 11.5 Viewer

Viewers have read-only access.

### Permissions

- Open Boards
- Zoom
- Pan
- Read Comments
- Download Shared Files (if allowed)

Restrictions

- Cannot Draw
- Cannot Edit
- Cannot Delete
- Cannot Invite Members

---

# 12. Permission Matrix

| Feature          | Owner | Admin | Editor |             Viewer             |
| ---------------- | :---: | :---: | :----: | :----------------------------: |
| Create Workspace |  ✅   |  ❌   |   ❌   |               ❌               |
| Delete Workspace |  ✅   |  ❌   |   ❌   |               ❌               |
| Invite Members   |  ✅   |  ✅   |   ❌   |               ❌               |
| Manage Roles     |  ✅   |  ❌   |   ❌   |               ❌               |
| Create Board     |  ✅   |  ✅   |   ✅   |               ❌               |
| Edit Board       |  ✅   |  ✅   |   ✅   |               ❌               |
| Delete Board     |  ✅   |  ✅   |   ❌   |               ❌               |
| Draw             |  ✅   |  ✅   |   ✅   |               ❌               |
| Comment          |  ✅   |  ✅   |   ✅   |               ✅               |
| Export           |  ✅   |  ✅   |   ✅   | Viewer permission configurable |
| View Activity    |  ✅   |  ✅   |   ❌   |               ❌               |

---

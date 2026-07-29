# Board Module

> **Project:** SyncBoard
> **Document:** Board Module
> **Phase:** 10 - Development
> **Version:** 1.0

---

# 1. Overview

The Board Module is the primary workspace resource where collaboration takes place.

A board acts as a container for:

- Canvas
- Shapes
- Comments
- Attachments
- Activity History
- Realtime Collaboration

Every board belongs to exactly one workspace.

---

# 2. Objectives

After implementing this module, users should be able to:

- Create boards
- Update board details
- Archive boards
- Restore archived boards
- Delete boards
- Duplicate boards
- Favorite boards
- View recent boards
- Share boards with workspace members

---

# 3. Architecture

```
Workspace

↓

Board

↓

Canvas

↓

Shapes

↓

Comments

↓

Attachments

↓

Realtime Events
```

---

# 4. Database Model

## Board

Suggested fields:

```
id

workspaceId

createdBy

title

description

thumbnailUrl

icon

visibility

isFavorite

isArchived

createdAt

updatedAt

deletedAt
```

---

# 5. Relationships

```
Workspace

↓

Boards

↓

Canvas

↓

Shapes

↓

Comments
```

Deleting a workspace should soft-delete all related boards.

---

# 6. Board Lifecycle

```
Create

↓

Edit

↓

Collaborate

↓

Archive

↓

Restore

↓

Delete
```

Soft deletion is preferred over permanent deletion.

---

# 7. Board Creation Flow

```
User

↓

Validate Request

↓

Verify Workspace Access

↓

Create Board

↓

Create Empty Canvas

↓

Record Activity

↓

Return Board
```

---

# 8. Board Visibility

Supported values:

```
PRIVATE

WORKSPACE
```

Future support:

```
PUBLIC

LINK_SHARED
```

Initially, boards are visible only to workspace members.

---

# 9. Board Templates

Users may create boards from:

- Blank Board
- Kanban Template
- Meeting Notes
- Brainstorming
- Mind Map
- Sprint Planning

Templates improve onboarding and productivity.

---

# 10. Favorite Boards

Users can mark boards as favorites.

Benefits:

- Quick access
- Personalized dashboard
- Faster navigation

Favorites are user-specific.

---

# 11. Recent Boards

Track recently opened boards.

Store:

```
userId

boardId

lastOpenedAt
```

Display the most recently accessed boards on the dashboard.

---

# 12. Board Duplication

Duplicate:

- Metadata
- Canvas
- Shapes
- Comments (optional)
- Settings

Do not duplicate activity history.

---

# 13. Board Archiving

Archived boards:

- Remain accessible
- Become read-only (optional)
- Are excluded from default listings

Users can restore archived boards.

---

# 14. Board Deletion

Deleting a board should:

```
Soft Delete

↓

Hide from UI

↓

Retain References
```

Permanent deletion may be implemented through scheduled cleanup.

---

# 15. Service Layer

BoardService responsibilities:

- Create board
- Update board
- Archive board
- Restore board
- Delete board
- Duplicate board
- Favorite board
- List recent boards

---

# 16. Repository Layer

BoardRepository responsibilities:

- CRUD operations
- Pagination
- Filtering
- Searching
- Favorite queries
- Recent board queries

Business rules belong in the service layer.

---

# 17. API Endpoints

Boards:

```
POST   /api/boards

GET    /api/boards

GET    /api/boards/:id

PATCH  /api/boards/:id

DELETE /api/boards/:id
```

Favorites:

```
POST   /api/boards/:id/favorite

DELETE /api/boards/:id/favorite
```

Archive:

```
PATCH /api/boards/:id/archive

PATCH /api/boards/:id/restore
```

Duplicate:

```
POST /api/boards/:id/duplicate
```

---

# 18. Authorization

Verify:

- Authentication
- Workspace membership
- Board permissions
- Ownership (when required)

Every request must be authorized in the service layer.

---

# 19. Activity Logging

Track:

- Board created
- Board updated
- Board archived
- Board restored
- Board duplicated
- Board deleted
- Favorite added
- Favorite removed

Activity history should be immutable.

---

# 20. Notifications

Notify relevant users when:

- Board shared
- Board archived
- Board restored
- Board ownership changes (future)

---

# 21. Search

Search boards by:

- Title
- Description

Future support:

- Tags
- Content indexing
- Full-text search

---

# 22. Security

- Validate all input with Zod.
- Prevent unauthorized access.
- Restrict archive/delete actions.
- Protect board metadata.
- Prevent duplicate favorite entries.

---

# 23. Testing

Verify:

- Board creation
- Board update
- Archive/restore
- Deletion
- Duplication
- Favorite management
- Recent boards
- Unauthorized access
- Workspace isolation

---

# 24. Best Practices

- Keep board metadata lightweight.
- Use pagination for board lists.
- Log all significant actions.
- Soft delete by default.
- Separate board metadata from canvas data.

---

# 25. Verification Checklist

Before proceeding:

- Board schema created
- Board service implemented
- Board repository implemented
- CRUD APIs working
- Favorite functionality working
- Archive/restore working
- Activity logging implemented
- Authorization verified

---

# 26. Expected Outcome

At the end of this module:

- Users can create and manage boards.
- Boards belong to workspaces.
- Favorites and recent boards improve navigation.
- Board lifecycle is fully implemented.
- The application is ready to build the Canvas Module, where realtime drawing and collaboration begin.

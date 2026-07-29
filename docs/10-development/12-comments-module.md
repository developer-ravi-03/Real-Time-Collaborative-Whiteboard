# Comments Module

> **Project:** SyncBoard
> **Document:** Comments Module
> **Phase:** 10 - Development
> **Version:** 1.0

---

# 1. Overview

The Comments Module enables users to communicate and collaborate directly within a board.

Comments are contextual, meaning they can be attached to:

- A board
- A specific shape
- A canvas position

This module provides:

- Comment creation
- Threaded discussions
- Mentions
- Reactions
- Comment resolution
- Attachments
- Realtime updates
- Notifications

---

# 2. Objectives

After implementing this module, users should be able to:

- Add comments
- Reply to comments
- Mention team members
- Edit comments
- Delete comments
- Resolve discussions
- React with emojis
- Attach files
- Receive notifications
- View live updates

---

# 3. Architecture

```
Workspace

↓

Board

↓

Comment Thread

↓

Comments

↓

Replies

↓

Mentions

↓

Notifications

↓

Realtime Sync
```

---

# 4. Database Models

## Comment

Suggested fields:

```
id

boardId

shapeId (nullable)

parentId (nullable)

authorId

content

x

y

status

createdAt

updatedAt

deletedAt
```

---

## CommentReaction

```
id

commentId

userId

emoji

createdAt
```

---

## CommentMention

```
id

commentId

mentionedUserId

createdAt
```

---

# 5. Comment Types

Supported types:

```
Board Comment

Shape Comment

Canvas Comment
```

Future:

```
File Comment

Voice Comment
```

---

# 6. Comment Lifecycle

```
Create

↓

Edit

↓

Reply

↓

Resolve

↓

Archive

↓

Delete
```

Soft deletion is preferred to preserve discussion history.

---

# 7. Threaded Discussions

Each comment can have:

- Multiple replies
- Nested conversation (single-level threads recommended)
- Resolution status

Threads keep discussions organized.

---

# 8. Mentions

Support:

```
@username
```

Flow:

```
Type "@"

↓

Search Workspace Members

↓

Select User

↓

Store Mention

↓

Send Notification
```

Only workspace members can be mentioned.

---

# 9. Reactions

Supported reactions:

```
👍

❤️

🎉

🚀

👀

😂
```

Users can add or remove reactions.

Only one reaction of the same type per user is allowed.

---

# 10. Comment Resolution

A discussion may be:

```
OPEN

↓

RESOLVED

↓

REOPENED
```

Resolved comments remain visible for audit purposes.

---

# 11. Attachments

Allow attachments such as:

- Images
- PDFs
- Documents

Files should be uploaded to Cloudinary (or another configured storage service) and referenced in the comment.

---

# 12. Service Layer

CommentService responsibilities:

- Create comment
- Update comment
- Delete comment
- Reply
- Resolve
- Reopen
- Add reaction
- Remove reaction
- Handle mentions

Business rules belong here.

---

# 13. Repository Layer

CommentRepository responsibilities:

- CRUD operations
- Thread retrieval
- Pagination
- Mention queries
- Reaction queries

Repositories should not contain business logic.

---

# 14. API Endpoints

Comments:

```
POST   /api/comments

GET    /api/comments

PATCH  /api/comments/:id

DELETE /api/comments/:id
```

Replies:

```
POST   /api/comments/:id/replies
```

Resolution:

```
PATCH /api/comments/:id/resolve

PATCH /api/comments/:id/reopen
```

Reactions:

```
POST   /api/comments/:id/reactions

DELETE /api/comments/:id/reactions
```

---

# 15. Permissions

Verify:

- Authenticated user
- Workspace membership
- Board access
- Comment ownership (where applicable)

Admins may moderate any comment within their workspace.

---

# 16. Notifications

Generate notifications for:

- New comment
- New reply
- Mention
- Comment resolved
- Comment reopened

Notification delivery is handled by the Notification Module.

---

# 17. Realtime Integration

Synchronize:

- Comment creation
- Comment edits
- Replies
- Resolution
- Reactions
- Deletion

Updates should appear instantly for all connected collaborators.

---

# 18. Activity Logging

Track:

- Comment created
- Comment edited
- Comment deleted
- Reply added
- Comment resolved
- Mention created

Activity logs should be immutable.

---

# 19. Security

- Validate all input using Zod.
- Sanitize rich-text content.
- Prevent XSS attacks.
- Restrict unauthorized edits.
- Verify attachment ownership.

---

# 20. Performance

Optimize by:

- Lazy loading long threads
- Cursor-based pagination
- Efficient mention lookup
- Batched notification creation
- Realtime event throttling

---

# 21. Testing

Verify:

- Comment creation
- Replies
- Mentions
- Emoji reactions
- Resolution flow
- Attachments
- Realtime updates
- Authorization
- Soft deletion

---

# 22. Best Practices

- Prefer threaded discussions.
- Keep comments contextual.
- Preserve audit history.
- Use soft deletion.
- Notify only relevant users.
- Minimize unnecessary realtime broadcasts.

---

# 23. Verification Checklist

Before proceeding:

- Comment schema created
- Reaction schema created
- Mention schema created
- Comment service implemented
- Repository implemented
- APIs working
- Notifications integrated
- Realtime updates verified

---

# 24. Expected Outcome

At the end of this module:

- Users can discuss work directly within the board.
- Threaded conversations improve collaboration.
- Mentions and notifications keep teammates informed.
- Reactions provide lightweight feedback.
- The application is ready for the Realtime Sync Engine, enabling seamless multi-user collaboration.

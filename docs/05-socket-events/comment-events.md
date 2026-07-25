# Comment Socket Events

> **Project:** SyncBoard
> **Document:** Comment Socket Events
> **Version:** 1.0

---

# 1. Overview

This document defines all realtime events related to comments.

Comments enable collaborative discussion on:

- Boards
- Canvas Objects

Unlike presence events, comments are persistent and stored in the database.

---

# 2. Event Flow

```
Client
    │
client:comment:*
    │
    ▼
Socket Server
    │
Authentication
Authorization
Validation
Persistence
Notification
    │
    ▼
server:comment:*
    │
    ▼
Board Room
```

---

# 3. Event Summary

| Client Event           | Server Event             | Persisted |
| ---------------------- | ------------------------ | --------- |
| client:comment:create  | server:comment:created   | Yes       |
| client:comment:update  | server:comment:updated   | Yes       |
| client:comment:delete  | server:comment:deleted   | Yes       |
| client:comment:reply   | server:comment:replied   | Yes       |
| client:comment:resolve | server:comment:resolved  | Yes       |
| client:comment:reopen  | server:comment:reopened  | Yes       |
| client:comment:mention | server:comment:mentioned | Yes       |

---

# 4. Create Comment

Client Event

```
client:comment:create
```

Payload

```json
{
  "boardId": "board-123",
  "objectId": "object-456",
  "content": "Can we move this section to the left?"
}
```

Server Actions

- Authenticate user
- Validate permissions
- Create comment
- Persist to database
- Detect mentions
- Broadcast update
- Trigger notifications

Broadcast

```
server:comment:created
```

---

# 5. Update Comment

Client Event

```
client:comment:update
```

Editable Fields

- Content

Only the author (or workspace owner/admin, depending on RBAC) may edit a comment.

Broadcast

```
server:comment:updated
```

---

# 6. Delete Comment

Client Event

```
client:comment:delete
```

Server Actions

- Soft delete comment
- Preserve audit history
- Broadcast deletion

Broadcast

```
server:comment:deleted
```

---

# 7. Reply to Comment

Client Event

```
client:comment:reply
```

Payload

```json
{
  "parentCommentId": "comment-001",
  "content": "I'll update it today."
}
```

Replies remain part of the same discussion thread.

Broadcast

```
server:comment:replied
```

---

# 8. Resolve Comment

Client Event

```
client:comment:resolve
```

Purpose

Mark a discussion as completed.

Broadcast

```
server:comment:resolved
```

---

# 9. Reopen Comment

Client Event

```
client:comment:reopen
```

Purpose

Resume discussion on a resolved comment.

Broadcast

```
server:comment:reopened
```

---

# 10. Mentions

Mentions are detected during comment creation or updates.

Example

```text
@alice
@bob
```

Server Actions

- Validate mentioned users
- Create mention records
- Trigger notifications

Broadcast

```
server:comment:mentioned
```

---

# 11. Authorization

Every comment event validates:

- Authenticated user
- Workspace membership
- Board access
- Comment ownership (where applicable)

---

# 12. Broadcasting Rules

Broadcast to

```
board:{boardId}
```

Mention notifications are delivered only to the affected users.

---

# 13. Acknowledgements

Success

```json
{
  "success": true,
  "message": "Comment created successfully."
}
```

Failure

```json
{
  "success": false,
  "error": {
    "code": "COMMENT_NOT_FOUND",
    "message": "Comment not found."
  }
}
```

---

# 14. Error Codes

Supported errors

- UNAUTHORIZED
- FORBIDDEN
- COMMENT_NOT_FOUND
- OBJECT_NOT_FOUND
- VALIDATION_ERROR
- RATE_LIMIT_EXCEEDED

---

# 15. Logging

Log

- Event name
- Comment ID
- Parent Comment ID (if reply)
- Board ID
- Object ID (optional)
- User ID
- Processing time

---

# 16. Performance

- Broadcast only changed data.
- Lazy-load long comment threads.
- Batch notification creation when many users are mentioned.

---

# 17. Future Enhancements

- Emoji reactions
- Rich text comments
- File attachments
- Voice comments
- AI-generated summaries
- Thread subscriptions

---

# 18. Conclusion

Comment events provide realtime discussion capabilities for boards and objects. By integrating persistence, mentions, and notifications, they support collaborative review while maintaining a scalable event-driven architecture.

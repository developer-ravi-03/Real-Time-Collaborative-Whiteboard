# Notification Socket Events

> **Project:** SyncBoard
> **Document:** Notification Socket Events
> **Version:** 1.0

---

# 1. Overview

This document defines all realtime events related to user notifications.

Notifications inform users about important events that require attention.

Examples include:

- Workspace invitations
- Comment mentions
- Comment replies
- Board sharing
- Ownership transfers
- Assignment updates
- System announcements

Notifications are persisted in the database and delivered instantly using Socket.IO.

---

# 2. Event Flow

```
Business Event

↓

Notification Service

↓

Persist Notification

↓

Socket.IO

↓

User Room

↓

Recipient
```

The Notification Service is responsible for generating and dispatching notifications.

---

# 3. Event Summary

| Server Event                | Purpose                          |
| --------------------------- | -------------------------------- |
| server:notification:new     | Deliver a new notification       |
| server:notification:updated | Update an existing notification  |
| server:notification:read    | Notification marked as read      |
| server:notification:unread  | Notification marked as unread    |
| server:notification:deleted | Notification removed             |
| server:notification:count   | Update unread notification count |

Only read/unread actions require client requests.

---

# 4. New Notification

Server Event

```
server:notification:new
```

Payload

```json
{
  "notificationId": "notif-001",
  "type": "COMMENT_MENTION",
  "title": "You were mentioned",
  "message": "Alice mentioned you in Board Planning.",
  "resource": {
    "type": "COMMENT",
    "id": "comment-123"
  },
  "createdAt": "2026-07-25T15:00:00Z",
  "read": false
}
```

Delivered only to:

```
user:{userId}
```

---

# 5. Mark as Read

Client Event

```
client:notification:read
```

Payload

```json
{
  "notificationId": "notif-001"
}
```

Server Actions

- Verify ownership
- Update database
- Broadcast updated state to all active sessions of the same user

Server Event

```
server:notification:read
```

---

# 6. Mark as Unread

Client Event

```
client:notification:unread
```

Purpose

Restore a notification to the unread state.

Broadcast

```
server:notification:unread
```

---

# 7. Delete Notification

Client Event

```
client:notification:delete
```

Server Actions

- Verify ownership
- Soft delete notification
- Broadcast deletion

Server Event

```
server:notification:deleted
```

---

# 8. Unread Count Synchronization

Server Event

```
server:notification:count
```

Payload

```json
{
  "unreadCount": 8
}
```

Keeps notification badges synchronized across:

- Browser tabs
- Desktop
- Mobile

---

# 9. Notification Types

Supported types include:

- WORKSPACE_INVITATION
- WORKSPACE_ROLE_UPDATED
- BOARD_SHARED
- BOARD_ARCHIVED
- COMMENT_CREATED
- COMMENT_REPLY
- COMMENT_MENTION
- TASK_ASSIGNED
- OWNERSHIP_TRANSFER
- SYSTEM

Future types may be added without breaking existing clients.

---

# 10. Authorization

Every notification event verifies:

- Authenticated user
- Notification ownership

Users can never access another user's notifications.

---

# 11. Broadcasting Rules

Notifications are never broadcast to board or workspace rooms.

Always deliver to:

```
user:{userId}
```

If the user has multiple active sessions, all sessions receive the update.

---

# 12. Acknowledgements

Success

```json
{
  "success": true,
  "message": "Notification updated successfully."
}
```

Failure

```json
{
  "success": false,
  "error": {
    "code": "NOTIFICATION_NOT_FOUND",
    "message": "Notification not found."
  }
}
```

---

# 13. Error Codes

Supported errors

- UNAUTHORIZED
- FORBIDDEN
- NOTIFICATION_NOT_FOUND
- VALIDATION_ERROR
- RATE_LIMIT_EXCEEDED

---

# 14. Logging

Each notification event logs:

- Event name
- Notification ID
- User ID
- Notification type
- Socket ID
- Processing time
- Success / Failure

---

# 15. Performance

- Batch notification creation where appropriate.
- Broadcast only to affected users.
- Synchronize unread counts incrementally.
- Avoid sending duplicate notifications.

---

# 16. Future Enhancements

- Push notifications
- Email notifications
- SMS notifications
- Notification preferences
- Scheduled reminders
- Snooze notifications
- Digest summaries

---

# 17. Conclusion

Notification events provide a reliable realtime communication channel for user-specific updates. By routing notifications through the Notification Service and delivering them to user rooms, SyncBoard maintains scalability, consistency, and extensibility across multiple client sessions.

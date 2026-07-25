# Notification APIs

> **Project:** SyncBoard
> **Document:** Notification APIs
> **Version:** 1.0
> **API Version:** v1

---

# 1. Overview

The Notification module keeps users informed about important events across workspaces and boards.

Notifications are delivered through:

- In-App Notifications (v1)
- Realtime Socket Notifications (Phase 5)
- Email Notifications (Future)
- Push Notifications (Future)

Every notification belongs to exactly one user.

---

# 2. Notification Sources

Notifications may be generated from:

- Workspace Invitations
- Workspace Membership Changes
- Ownership Transfer
- Board Creation
- Board Updates
- Board Comments
- Comment Mentions
- Comment Replies
- Version Restored
- System Announcements

---

# 3. Notification Types

| Type                  | Description                     |
| --------------------- | ------------------------------- |
| INVITATION            | Workspace invitation            |
| INVITATION_ACCEPTED   | Invitation accepted             |
| MEMBER_ADDED          | User added to workspace         |
| MEMBER_REMOVED        | User removed                    |
| ROLE_CHANGED          | Workspace role updated          |
| BOARD_CREATED         | Board created                   |
| BOARD_UPDATED         | Board updated                   |
| COMMENT_CREATED       | New comment                     |
| COMMENT_REPLY         | Reply received                  |
| COMMENT_MENTION       | User mentioned                  |
| OWNERSHIP_TRANSFERRED | Workspace ownership transferred |
| VERSION_RESTORED      | Board version restored          |
| SYSTEM                | System notification             |

---

# 4. Notification Status

Every notification has one of the following states:

- UNREAD
- READ
- ARCHIVED

---

# 5. Permissions Matrix

| Action               | Owner | Editor | Viewer |
| -------------------- | :---: | :----: | :----: |
| View Notifications   |  ✅   |   ✅   |   ✅   |
| Mark Read            |  ✅   |   ✅   |   ✅   |
| Mark All Read        |  ✅   |   ✅   |   ✅   |
| Archive Notification |  ✅   |   ✅   |   ✅   |
| Delete Notification  |  ✅   |   ✅   |   ✅   |

Users can only access their own notifications.

---

# 6. Endpoint Summary

| Method | Endpoint                                | Purpose              |
| ------ | --------------------------------------- | -------------------- |
| GET    | /notifications                          | List notifications   |
| GET    | /notifications/{notificationId}         | Get notification     |
| PATCH  | /notifications/{notificationId}/read    | Mark as read         |
| PATCH  | /notifications/read-all                 | Mark all as read     |
| PATCH  | /notifications/{notificationId}/archive | Archive notification |
| DELETE | /notifications/{notificationId}         | Delete notification  |

---

# 7. List Notifications

## Endpoint

GET /api/v1/notifications

Authentication

Required

Query Parameters

| Parameter | Description            |
| --------- | ---------------------- |
| page      | Pagination             |
| limit     | Page size              |
| status    | unread, read, archived |
| type      | Notification type      |
| sort      | createdAt              |

Returns:

- Notification list
- Total unread count
- Pagination metadata

---

# 8. Get Notification

Endpoint

GET /api/v1/notifications/{notificationId}

Returns complete notification details.

Only the owner of the notification may access it.

---

# 9. Mark Notification as Read

Endpoint

PATCH /api/v1/notifications/{notificationId}/read

Business Rules

- Updates status to READ.
- Updates `readAt` timestamp.
- Idempotent operation.

---

# 10. Mark All as Read

Endpoint

PATCH /api/v1/notifications/read-all

Marks all unread notifications for the authenticated user as READ.

---

# 11. Archive Notification

Endpoint

PATCH /api/v1/notifications/{notificationId}/archive

Business Rules

- Updates status to ARCHIVED.
- Archived notifications remain searchable.
- Archived notifications are hidden from the default list.

---

# 12. Delete Notification

Endpoint

DELETE /api/v1/notifications/{notificationId}

Business Rules

- Permanently removes the notification.
- Cannot be recovered.

---

# 13. Notification Payload

Example

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440010",
  "type": "COMMENT_MENTION",
  "title": "You were mentioned",
  "message": "John mentioned you in Sprint Planning.",
  "status": "UNREAD",
  "resource": {
    "type": "COMMENT",
    "id": "550e8400-e29b-41d4-a716-446655440011"
  },
  "createdAt": "2026-07-25T12:30:00Z"
}
```

---

# 14. Validation Rules

- Notification IDs must be valid UUIDs.
- Users cannot modify notifications belonging to others.
- Invalid status values are rejected.

---

# 15. Activity Logging

Generate logs for:

- Notification Read
- Notification Archived
- Notification Deleted

Notification creation is logged by the originating module (Workspace, Board, Comment, etc.).

---

# 16. Security Considerations

- Verify JWT before every request.
- Ensure notification ownership.
- Prevent notification enumeration.
- Return only authorized resources.
- Validate all UUID parameters.

---

# 17. Performance Considerations

- Paginate notification lists.
- Index `userId`, `status`, and `createdAt`.
- Batch mark-all updates.
- Cache unread notification count (future Redis support).

---

# 18. Future Enhancements

- Realtime delivery with Socket.IO
- Email notifications
- Push notifications
- Notification preferences
- Snooze notifications
- Notification grouping
- Notification search
- Notification categories

---

# 19. Conclusion

The Notification API provides a centralized system for delivering collaboration events across SyncBoard. It supports efficient notification management today while providing a scalable foundation for realtime delivery and future communication channels.

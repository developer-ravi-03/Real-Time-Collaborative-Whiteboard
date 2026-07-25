# Comment APIs

> **Project:** SyncBoard
> **Document:** Comment APIs
> **Version:** 1.0
> **API Version:** v1

---

# 1. Overview

Comments enable asynchronous collaboration between workspace members by allowing discussions directly on boards or specific board objects.

Comments support:

- General board discussions
- Object-specific discussions
- Threaded replies
- User mentions
- Comment resolution
- Reactions (future)

Every comment belongs to one board and may optionally be linked to a board object.

---

# 2. Resource Hierarchy

Workspace
└── Board
├── Board Object (optional)
└── Comment
└── Reply

---

# 3. Permissions Matrix

| Action             | Owner | Editor | Viewer |
| ------------------ | :---: | :----: | :----: |
| View Comments      |  ✅   |   ✅   |   ✅   |
| Create Comment     |  ✅   |   ✅   |   ✅   |
| Reply to Comment   |  ✅   |   ✅   |   ✅   |
| Edit Own Comment   |  ✅   |   ✅   |   ✅   |
| Delete Own Comment |  ✅   |   ✅   |   ✅   |
| Delete Any Comment |  ✅   |   ❌   |   ❌   |
| Resolve Comment    |  ✅   |   ✅   |   ❌   |

---

# 4. Endpoint Summary

| Method | Endpoint                                       | Purpose          |
| ------ | ---------------------------------------------- | ---------------- |
| GET    | /boards/{boardId}/comments                     | List comments    |
| POST   | /boards/{boardId}/comments                     | Create comment   |
| GET    | /boards/{boardId}/comments/{commentId}         | Get comment      |
| PATCH  | /boards/{boardId}/comments/{commentId}         | Update comment   |
| DELETE | /boards/{boardId}/comments/{commentId}         | Delete comment   |
| POST   | /boards/{boardId}/comments/{commentId}/reply   | Reply to comment |
| POST   | /boards/{boardId}/comments/{commentId}/resolve | Resolve comment  |
| POST   | /boards/{boardId}/comments/{commentId}/reopen  | Reopen comment   |

---

# 5. Create Comment

## Endpoint

POST /api/v1/boards/{boardId}/comments

Authentication

Required

Authorization

Workspace Member

Request Body

```json
{
  "boardObjectId": "550e8400-e29b-41d4-a716-446655440001",
  "content": "Please align this section with the design system."
}
```

### Business Rules

- `boardObjectId` is optional.
- If omitted, the comment belongs to the board.
- Mentions (`@username`) are detected automatically.
- Mentioned users receive notifications.
- Activity log is generated.

---

# 6. Get Comments

Endpoint

GET /api/v1/boards/{boardId}/comments

Query Parameters

| Parameter | Description            |
| --------- | ---------------------- |
| page      | Pagination             |
| limit     | Page size              |
| resolved  | true / false           |
| objectId  | Filter by board object |

Returns:

- Comments
- Replies
- Author
- Resolution status
- Created timestamp

---

# 7. Update Comment

Endpoint

PATCH /api/v1/boards/{boardId}/comments/{commentId}

Editable Fields

- Content

Business Rules

- Only the comment author may edit.
- Edited timestamp is updated.
- Edit history is not retained in v1.

---

# 8. Delete Comment

Endpoint

DELETE /api/v1/boards/{boardId}/comments/{commentId}

Business Rules

- Authors may delete their own comments.
- Owners may delete any comment.
- Replies are deleted with the parent comment.

---

# 9. Reply to Comment

Endpoint

POST /api/v1/boards/{boardId}/comments/{commentId}/reply

Request Body

```json
{
  "content": "Agreed. I'll update it today."
}
```

Replies are nested under the parent comment.

---

# 10. Resolve Comment

Endpoint

POST /api/v1/boards/{boardId}/comments/{commentId}/resolve

Business Rules

- Only Owner or Editor.
- Marks the discussion as completed.
- Generates an activity log.
- Sends notifications to participants.

---

# 11. Reopen Comment

Endpoint

POST /api/v1/boards/{boardId}/comments/{commentId}/reopen

Allows a previously resolved discussion to continue.

---

# 12. Validation Rules

Content

- Required
- Trim whitespace
- Maximum 5000 characters
- HTML is not allowed
- Markdown support (future)

---

# 13. Mention System

Supported format

```
@username
```

Business Rules

- Mentioned users must belong to the workspace.
- Duplicate mentions generate a single notification.
- Invalid mentions are ignored.

---

# 14. Activity Logging

Generate logs for:

- Comment Created
- Comment Updated
- Comment Deleted
- Comment Resolved
- Comment Reopened
- Reply Added

---

# 15. Security Considerations

- Verify workspace membership.
- Verify board access.
- Prevent XSS by sanitizing content.
- Validate referenced board object IDs.
- Prevent unauthorized comment modification.

---

# 16. Performance Considerations

- Paginate comment lists.
- Load replies efficiently.
- Index `boardId` and `boardObjectId`.
- Fetch author details using optimized Prisma queries.

---

# 17. Future Enhancements

- Emoji reactions
- Rich text editor
- File attachments
- Comment history
- AI-generated summaries
- Comment search
- Pin comments

---

# 18. Conclusion

The Comment API enables structured discussions around boards and board objects. It supports collaboration through threaded conversations, mentions, and comment resolution while providing a scalable foundation for realtime collaboration and future enhancements.

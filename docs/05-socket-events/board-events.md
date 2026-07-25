# Board Socket Events

> **Project:** SyncBoard
> **Document:** Board Socket Events
> **Version:** 1.0

---

# 1. Overview

This document defines all realtime events related to board lifecycle and board-level collaboration.

These events synchronize board state between connected clients.

Board events **do not** synchronize canvas objects. Those are covered in `object-events.md`.

---

# 2. Event Flow

```
Client
    │
client:board:*
    │
    ▼
Socket Server
    │
Authentication
Authorization
Validation
Persistence (if required)
    │
    ▼
server:board:*
    │
    ▼
Board Room
```

---

# 3. Event Summary

| Client Event         | Server Event          | Purpose                 |
| -------------------- | --------------------- | ----------------------- |
| client:board:join    | server:board:joined   | Join board room         |
| client:board:leave   | server:board:left     | Leave board room        |
| client:board:update  | server:board:updated  | Update board metadata   |
| client:board:archive | server:board:archived | Archive board           |
| client:board:restore | server:board:restored | Restore board           |
| client:board:sync    | server:board:synced   | Synchronize board state |

---

# 4. Join Board

## Client Event

```
client:board:join
```

Payload

```json
{
  "boardId": "550e8400-e29b-41d4-a716-446655440001"
}
```

Authorization

- User must belong to the workspace.
- User must have access to the board.

Server Actions

- Verify JWT.
- Verify board access.
- Leave previous board room (if any).
- Join `board:{boardId}` room.
- Update socket context.

Server Response

```
server:board:joined
```

Example

```json
{
  "boardId": "550e8400-e29b-41d4-a716-446655440001",
  "joinedAt": "2026-07-25T13:00:00Z"
}
```

---

# 5. Leave Board

## Client Event

```
client:board:leave
```

Payload

```json
{
  "boardId": "550e8400-e29b-41d4-a716-446655440001"
}
```

Server Actions

- Leave board room.
- Stop presence updates.
- Clear current board from socket context.

Broadcast

```
server:board:left
```

---

# 6. Update Board

## Client Event

```
client:board:update
```

Purpose

Update board metadata such as:

- Name
- Description
- Background

Authorization

Owner or Editor.

Server Response

```
server:board:updated
```

Broadcast Scope

```
board:{boardId}
```

---

# 7. Archive Board

## Client Event

```
client:board:archive
```

Authorization

Owner only.

Server Actions

- Archive board.
- Remove active editing sessions.
- Notify connected users.

Broadcast

```
server:board:archived
```

---

# 8. Restore Board

## Client Event

```
client:board:restore
```

Authorization

Owner only.

Broadcast

```
server:board:restored
```

---

# 9. Board Synchronization

## Client Event

```
client:board:sync
```

Purpose

Request the latest board state after:

- Reconnection
- Missed events
- Version mismatch

Server Response

```
server:board:synced
```

Payload

```json
{
  "boardId": "550e8400-e29b-41d4-a716-446655440001",
  "version": 42,
  "updatedAt": "2026-07-25T13:05:12Z"
}
```

---

# 10. Authorization Rules

Every board event validates:

- Authenticated user
- Workspace membership
- Board existence
- Board permissions

Requests failing validation are rejected.

---

# 11. Broadcasting Rules

Broadcast only to:

```
board:{boardId}
```

Never broadcast board events globally.

---

# 12. Acknowledgement Format

Success

```json
{
  "success": true,
  "message": "Board updated successfully."
}
```

Failure

```json
{
  "success": false,
  "error": {
    "code": "BOARD_NOT_FOUND",
    "message": "Board not found."
  }
}
```

---

# 13. Error Codes

Possible errors:

- UNAUTHORIZED
- FORBIDDEN
- BOARD_NOT_FOUND
- VALIDATION_ERROR
- RATE_LIMIT_EXCEEDED

---

# 14. Logging

Every board event logs:

- Event name
- Board ID
- Workspace ID
- User ID
- Socket ID
- Processing time
- Success or failure

---

# 15. Performance Considerations

- Broadcast only changed metadata.
- Avoid redundant updates.
- Use room-based broadcasting.
- Throttle repeated metadata updates.

---

# 16. Future Enhancements

- Board locking
- Read-only mode
- Live board thumbnails
- Board analytics
- Collaborative board settings

---

# 17. Conclusion

Board socket events manage the realtime lifecycle of boards, including joining, leaving, metadata updates, synchronization, and archival. They establish the board-level communication protocol used by all connected clients.

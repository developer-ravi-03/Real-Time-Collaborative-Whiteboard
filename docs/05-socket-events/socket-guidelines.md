# Socket Guidelines

> **Project:** SyncBoard
> **Document:** Socket Guidelines
> **Version:** 1.0

---

# 1. Overview

This document defines the global standards for all Socket.IO communication used by SyncBoard.

Every realtime event must follow the rules defined here.

The objectives are:

- Consistency
- Scalability
- Predictability
- Security
- Maintainability

---

# 2. Communication Model

Communication always follows this flow:

```
Client
    │
client:* Event
    │
    ▼
Socket.IO Server
    │
Validation
Authentication
Authorization
Business Logic
Persistence
    │
server:* Event
    │
    ▼
Connected Clients
```

The server is always the source of truth.

Clients never update shared state directly.

---

# 3. Event Naming Convention

Direction-based namespaces are mandatory.

Client → Server

```
client:board:create
client:board:update

client:object:create
client:object:update

client:comment:create
client:presence:update
```

Server → Client

```
server:board:created
server:board:updated

server:object:created
server:object:updated

server:comment:created
server:presence:updated
```

Rules

- lowercase
- colon-separated
- verb at end
- singular resource names

---

# 4. Event Structure

Every event follows the same structure.

Example

```json
{
  "eventId": "550e8400-e29b-41d4-a716-446655440000",
  "timestamp": "2026-07-25T12:30:00Z",
  "payload": {}
}
```

---

# 5. Payload Rules

Payloads must:

- Use JSON only
- Use camelCase
- Use UUIDs
- Avoid deeply nested objects
- Contain only required data

Large binary data must never be transmitted over Socket.IO.

Use Cloudinary URLs instead.

---

# 6. Event Lifecycle

```
Client

↓

Emit Event

↓

Server Validation

↓

Authentication

↓

Authorization

↓

Business Logic

↓

Database Transaction

↓

Broadcast Event

↓

Acknowledgement
```

---

# 7. Acknowledgements

Events requiring confirmation use acknowledgements.

Example

Client

```text
client:object:update
```

Server

```json
{
  "success": true,
  "message": "Object updated successfully."
}
```

Failure

```json
{
  "success": false,
  "error": {
    "code": "OBJECT_NOT_FOUND",
    "message": "Object does not exist."
  }
}
```

---

# 8. Authentication

Every socket connection must be authenticated.

Authentication occurs once during connection.

The authenticated user is attached to the socket context.

Unauthenticated sockets cannot join rooms.

---

# 9. Authorization

Every event must verify permissions.

Examples

Before updating object

Verify:

- Workspace membership
- Board access
- User role

Authorization is never trusted from the client.

---

# 10. Rooms

SyncBoard uses Socket.IO rooms.

Room Types

Workspace Room

```
workspace:{workspaceId}
```

Board Room

```
board:{boardId}
```

User Room

```
user:{userId}
```

Users may belong to multiple rooms simultaneously.

---

# 11. Broadcasting

Never broadcast globally.

Preferred order:

```
Board Room

↓

Workspace Room

↓

User Room
```

Only affected users receive updates.

---

# 12. Reliability

Server acknowledgements should confirm:

- Accepted
- Rejected
- Validation failed
- Authorization failed

Clients should retry only idempotent operations where appropriate.

---

# 13. Ordering

Updates affecting the same object should preserve order.

Each mutable resource should include:

- version
- updatedAt

Future:

- operation sequence numbers

---

# 14. Error Handling

Socket errors use standardized codes.

Examples

```
UNAUTHORIZED

FORBIDDEN

VALIDATION_ERROR

BOARD_NOT_FOUND

OBJECT_NOT_FOUND

RATE_LIMIT_EXCEEDED
```

Errors follow the API error code documentation.

---

# 15. Performance

Recommendations

- Batch updates
- Compress payloads where appropriate
- Avoid duplicate broadcasts
- Debounce cursor updates
- Throttle presence updates

---

# 16. Security

Never trust:

- IDs
- Roles
- Permissions
- Coordinates
- Payloads

Everything is validated server-side.

---

# 17. Logging

Each event log should include:

- Event Name
- User ID
- Workspace ID
- Board ID
- Socket ID
- Processing Time
- Success / Failure

---

# 18. Future Enhancements

This protocol supports:

- Redis Adapter
- Horizontal Scaling
- Event Replay
- Offline Sync
- Event Compression
- Distributed Workers

---

# 19. Conclusion

These guidelines establish a consistent realtime communication standard across SyncBoard. Every Socket.IO event defined in this project must follow these conventions to ensure secure, scalable, and maintainable collaboration.

# Socket Connection Lifecycle

> **Project:** SyncBoard
> **Document:** Socket Connection Lifecycle
> **Version:** 1.0

---

# 1. Overview

This document defines the complete lifecycle of a Socket.IO connection in SyncBoard.

Every client connection follows the same sequence from initial connection to disconnection.

The objectives are:

- Secure authentication
- Reliable room management
- Stable reconnection
- Session recovery
- Proper resource cleanup

---

# 2. Connection Flow

```
Application Starts
        │
        ▼
User Authenticated (Clerk)
        │
        ▼
Initialize Socket Client
        │
        ▼
Socket Handshake
        │
        ▼
JWT Verification
        │
        ▼
Socket Authenticated
        │
        ▼
Join User Room
        │
        ▼
Join Workspace Room(s)
        │
        ▼
Join Active Board Room
        │
        ▼
Realtime Collaboration
        │
        ▼
Heartbeat
        │
        ▼
Disconnect / Reconnect
```

---

# 3. Socket Initialization

The frontend creates a Socket.IO connection only after:

- Clerk session exists
- User profile is loaded
- Access token is available

No anonymous socket connections are allowed.

---

# 4. Authentication Flow

Client sends JWT during the Socket.IO handshake.

Example:

```json
{
  "token": "<Clerk JWT>"
}
```

Server verifies:

- JWT validity
- Session status
- User existence
- User account state

If verification succeeds:

- Attach user to socket context
- Assign socket ID
- Continue connection

Otherwise:

- Reject connection

---

# 5. User Context

Each authenticated socket maintains:

- User ID
- Clerk ID
- Current Workspace IDs
- Current Board ID (if any)
- Connected At
- Last Activity Time

This context is stored only for the lifetime of the connection.

---

# 6. Room Strategy

Users may join multiple rooms.

### User Room

```
user:{userId}
```

Purpose:

- Personal notifications
- Invitation updates
- Account-specific events

---

### Workspace Room

```
workspace:{workspaceId}
```

Purpose:

- Membership updates
- Workspace events
- Board creation events

---

### Board Room

```
board:{boardId}
```

Purpose:

- Object updates
- Cursor presence
- Live comments
- Selection updates

---

# 7. Room Join Flow

```
Socket Connected
       │
       ▼
Join User Room
       │
       ▼
Join Workspace Rooms
       │
       ▼
User Opens Board
       │
       ▼
Join Board Room
```

Leaving a board automatically removes the socket from the previous board room.

---

# 8. Heartbeat

The server periodically verifies active connections.

Heartbeat is used to:

- Detect disconnected clients
- Update presence
- Release stale board locks
- Maintain connection health

Socket.IO's built-in ping/pong mechanism is used.

---

# 9. Reconnection Strategy

If the connection is interrupted:

```
Disconnect
      │
      ▼
Retry Connection
      │
      ▼
Authenticate Again
      │
      ▼
Restore Rooms
      │
      ▼
Resume Collaboration
```

Clients should use exponential backoff for reconnect attempts.

---

# 10. Session Recovery

After reconnection:

- Rejoin user room
- Rejoin workspace rooms
- Rejoin active board room
- Request latest board state if needed

The server remains the source of truth.

---

# 11. Multi-Tab Support

A user may have multiple browser tabs open.

Each tab has:

- Independent socket connection
- Unique socket ID

All sockets for the same user join the same:

```
user:{userId}
```

room.

Presence tracking should account for multiple active connections.

---

# 12. Disconnect Handling

Disconnect reasons may include:

- Browser closed
- User signed out
- Network interruption
- Server restart
- Idle timeout

Cleanup tasks:

- Leave board room
- Update presence
- Release temporary resources
- Stop cursor broadcasting

---

# 13. Authorization

Joining a room requires permission checks.

Workspace Room

Verify:

- Workspace membership

Board Room

Verify:

- Board access
- Workspace membership

Unauthorized joins are rejected.

---

# 14. Error Handling

Common connection errors:

| Code              | Description      |
| ----------------- | ---------------- |
| UNAUTHORIZED      | Invalid JWT      |
| TOKEN_EXPIRED     | Session expired  |
| FORBIDDEN         | No room access   |
| ROOM_NOT_FOUND    | Invalid room     |
| CONNECTION_FAILED | Handshake failed |

Errors follow the standard Socket error format.

---

# 15. Logging

Every connection should log:

- Socket ID
- User ID
- IP Address
- Connected At
- Disconnected At
- Disconnect Reason
- Rooms Joined

Sensitive information such as JWTs must never be logged.

---

# 16. Performance Considerations

- Reuse existing Socket.IO namespaces.
- Avoid unnecessary room joins.
- Remove sockets from rooms immediately on disconnect.
- Minimize room broadcasts.

---

# 17. Future Enhancements

The lifecycle supports:

- Redis Adapter
- Horizontal scaling
- Sticky sessions
- Offline synchronization
- Session resume
- Connection analytics

---

# 18. Conclusion

The Socket Connection Lifecycle establishes a secure and consistent foundation for realtime communication in SyncBoard. It ensures authenticated connections, reliable room management, graceful reconnection, and proper cleanup while supporting future scalability.

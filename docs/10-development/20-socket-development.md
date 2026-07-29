# Socket.IO Development

> **Project:** SyncBoard
> **Document:** Socket.IO Development
> **Phase:** 10 - Development
> **Version:** 2.0
> **Status:** Final (Architecture Frozen)

---

# 1. Overview

This document defines the realtime communication architecture for SyncBoard.

SyncBoard uses **Socket.IO** with **Node.js**, **Express.js**, and **TypeScript** to provide realtime collaboration across the application.

Socket.IO powers collaborative features such as:

- Live Whiteboard
- Live Cursor
- User Presence
- Live Chat
- Shape Synchronization
- Notifications
- Board Activity

---

# 2. Objectives

After implementing this module, the backend should support:

- Low latency communication
- Room-based collaboration
- User presence
- Live cursor movement
- Shape synchronization
- Realtime chat
- Notifications
- Connection recovery
- Automatic reconnection
- Scalable event architecture

---

# 3. Architecture

```
Next.js Client

↓

Socket.IO Client

↓

Express.js Server

↓

Socket.IO Server

↓

Socket Middleware

↓

Socket Controllers

↓

Socket Services

↓

Prisma ORM

↓

PostgreSQL
```

Realtime communication is completely independent of the REST API layer.

---

# 4. Folder Structure

```
backend/

src/

sockets/

index.ts

handlers/

board.handler.ts

cursor.handler.ts

chat.handler.ts

presence.handler.ts

notification.handler.ts

rooms/

middlewares/

events/

types/
```

---

# 5. Responsibilities

### Socket Server

Responsible for:

- Managing connections
- Registering events
- Broadcasting updates
- Managing rooms

---

### Socket Middleware

Responsible for:

- Authentication
- Authorization
- Logging
- Validation
- Rate limiting

---

### Socket Handlers

Responsible for:

- Receiving events
- Calling services
- Sending responses

Business logic should never exist inside socket handlers.

---

### Socket Services

Responsible for:

- Board synchronization
- Cursor synchronization
- Chat logic
- Notifications
- User presence

---

# 6. Authentication

Connection Flow

```
Client

↓

Clerk JWT

↓

Socket.IO Handshake

↓

JWT Verification

↓

Authenticated Socket
```

Unauthenticated sockets must be rejected immediately.

---

# 7. Authorization

Verify:

- Workspace membership
- Board membership
- User permissions
- Room access

Every event must verify permissions before execution.

---

# 8. Rooms

Each collaborative resource uses its own room.

Examples

```
workspace:{workspaceId}

board:{boardId}

chat:{boardId}
```

Users only receive events from rooms they have joined.

---

# 9. Supported Events

Client → Server

```
board:join

board:leave

shape:create

shape:update

shape:delete

cursor:move

chat:send

notification:read
```

---

Server → Client

```
board:joined

board:left

shape:created

shape:updated

shape:deleted

cursor:update

chat:received

notification:new
```

---

# 10. Event Naming

Use namespaces.

Examples

```
board:create

board:update

board:delete

cursor:move

chat:send

notification:new
```

Avoid generic event names like:

```
update

send

data
```

---

# 11. Payload Validation

Every socket event must be validated using **Zod**.

Validate:

- Event payload
- IDs
- Coordinates
- Shape data

Reject invalid payloads before reaching services.

---

# 12. Connection Lifecycle

```
Connect

↓

Authenticate

↓

Join Rooms

↓

Exchange Events

↓

Disconnect

↓

Reconnect
```

Handle unexpected disconnections gracefully.

---

# 13. Broadcasting Strategy

Use:

```
socket.emit()

socket.broadcast.emit()

io.to(room).emit()

socket.to(room).emit()
```

Choose the appropriate broadcasting method depending on the event.

---

# 14. User Presence

Track:

- Online users
- Active board
- Current workspace
- Last activity
- Typing status

Presence should update automatically.

---

# 15. Cursor Synchronization

Broadcast:

- Cursor X
- Cursor Y
- User ID
- User Color

Cursor updates should be lightweight and frequent.

---

# 16. Shape Synchronization

Supported operations

- Create
- Update
- Delete
- Move
- Resize
- Rotate

All updates should be propagated to connected users in realtime.

---

# 17. Chat

Support:

- Send message
- Edit message
- Delete message
- Typing indicator
- Read receipts

Messages should be persisted using PostgreSQL.

---

# 18. Notifications

Realtime notifications for:

- Board invitations
- Comments
- Mentions
- Workspace updates

Notifications should also be stored in the database.

---

# 19. Error Handling

Handle:

- Invalid payload
- Unauthorized access
- Forbidden actions
- Database failures
- Unexpected exceptions

Return structured error events.

---

# 20. Logging

Log:

- Connections
- Disconnections
- Authentication failures
- Room joins
- Room leaves
- Critical socket errors

Never log sensitive information.

---

# 21. Monitoring

Track:

- Active connections
- Concurrent users
- Event throughput
- Event latency
- Failed events
- Reconnection rate

These metrics help identify realtime bottlenecks.

---

# 22. Security

- Authenticate every socket
- Validate every payload
- Verify room access
- Prevent event spam
- Apply rate limiting
- Disconnect malicious clients

---

# 23. Testing

Verify:

- Connection
- Authentication
- Authorization
- Room joining
- Shape synchronization
- Cursor synchronization
- Chat
- Notifications
- Reconnection
- Performance

---

# 24. Best Practices

- Keep handlers thin.
- Put business logic in services.
- Validate every event.
- Authenticate every connection.
- Broadcast only required data.
- Avoid large payloads.
- Use rooms efficiently.

---

# 25. Verification Checklist

Before proceeding:

- Socket.IO server configured
- Authentication working
- Room management implemented
- Event validation implemented
- Handlers implemented
- Services implemented
- Logging configured
- Monitoring configured
- Tests passing

---

# 26. Expected Outcome

At the end of this module:

- SyncBoard supports reliable realtime collaboration.
- Events are secure, validated, and scalable.
- Business logic is isolated in services.
- Socket communication integrates cleanly with the Express.js backend.

# Socket Architecture

> **Project:** SyncBoard
> **Document:** Socket Architecture
> **Version:** 1.0

---

# 1. Overview

This document defines the realtime communication architecture of SyncBoard.

SyncBoard uses Socket.IO to provide low-latency bidirectional communication between connected clients and the server.

The architecture is designed for:

- Realtime collaboration
- High scalability
- Low latency
- Secure communication
- Horizontal scaling

---

# 2. Objectives

The Socket.IO architecture should provide:

- Live collaboration
- Presence tracking
- Cursor synchronization
- Board updates
- Comment synchronization
- Notifications
- Reliable reconnection

---

# 3. Architecture

```
Client

↓

Socket.IO Client

↓

Authentication

↓

Socket.IO Server

↓

Event Handler

↓

Service Layer

↓

Repository

↓

Prisma

↓

Database

↓

Broadcast

↓

Connected Clients
```

Business logic must never exist inside socket event handlers.

---

# 4. Connection Lifecycle

```
Client Connect

↓

Authentication

↓

Socket Registration

↓

Join Rooms

↓

Exchange Events

↓

Heartbeat

↓

Disconnect

↓

Cleanup
```

---

# 5. Authentication

Every socket connection must be authenticated.

Authentication uses Clerk session verification.

Unauthenticated connections should be rejected immediately.

---

# 6. Room Strategy

Clients should join rooms based on the resources they access.

Examples:

```
workspace:{workspaceId}

board:{boardId}

user:{userId}
```

Room isolation prevents unnecessary event broadcasting.

---

# 7. Event Naming

Events follow a consistent naming convention.

Format:

```
domain:action
```

Examples:

```
board:create

board:update

board:delete

canvas:update

comment:create

cursor:move

notification:new

presence:update
```

Avoid generic event names.

---

# 8. Event Flow

```
Client Event

↓

Validation

↓

Authorization

↓

Service Layer

↓

Repository

↓

Database

↓

Broadcast

↓

Other Clients
```

Database persistence should occur before broadcasting.

---

# 9. Payload Validation

Every socket payload must be validated with Zod.

Validate:

- IDs
- Coordinates
- Messages
- Board updates
- Comments

Invalid payloads should be rejected with an appropriate acknowledgement.

---

# 10. Acknowledgements

Critical events should use acknowledgements.

Example:

```
Client

↓

Emit

↓

Server

↓

Success

OR

Failure
```

This ensures reliable communication.

---

# 11. Presence System

Presence tracks active users.

Examples:

- Online users
- Active workspace
- Active board
- Last activity

Presence should update automatically on connect and disconnect.

---

# 12. Cursor Synchronization

Realtime cursor updates include:

- Cursor position
- User identity
- Selected tool
- Cursor color

Cursor events should not be stored in the database.

---

# 13. Realtime Collaboration

Realtime synchronization includes:

- Shape creation
- Shape updates
- Shape deletion
- Selection changes
- Canvas viewport
- Live comments

The server remains the source of truth.

---

# 14. Notifications

Socket.IO delivers:

- Member joined
- Board updated
- Comment added
- Mention received
- Invitation accepted

Notifications should also be persisted when appropriate.

---

# 15. Reconnection Strategy

On reconnection:

1. Re-authenticate
2. Restore rooms
3. Resync board state
4. Resume collaboration

Clients should recover gracefully after temporary network interruptions.

---

# 16. Error Handling

Handle:

- Invalid payloads
- Unauthorized access
- Missing resources
- Rate limits
- Internal server errors

Errors should use a standardized response format.

---

# 17. Performance

Optimize by:

- Broadcasting only to relevant rooms
- Compressing large payloads
- Debouncing high-frequency events
- Batching updates when possible

Avoid broadcasting to all connected clients.

---

# 18. Security

The socket layer must enforce:

- Authentication
- Authorization
- Input validation
- Rate limiting
- Event whitelisting

Never trust client-provided data.

---

# 19. Horizontal Scaling

Future scaling includes:

- Redis Adapter
- Multiple Socket.IO servers
- Load balancing
- Distributed event broadcasting

The event architecture should remain unchanged when scaling horizontally.

---

# 20. Monitoring

Monitor:

- Active connections
- Connection duration
- Event frequency
- Event failures
- Latency
- Reconnection rate

Use these metrics to identify performance bottlenecks.

---

# 21. Best Practices

- Keep socket handlers lightweight.
- Delegate business logic to services.
- Validate every payload.
- Broadcast only after successful persistence.
- Use rooms for isolation.
- Avoid unnecessary events.

---

# 22. Future Enhancements

The architecture supports:

- Voice collaboration
- Video collaboration
- Collaborative whiteboard editing
- Shared cursors
- AI-powered realtime assistance
- Event replay

---

# 23. Conclusion

The SyncBoard Socket.IO architecture provides a secure, scalable, and maintainable foundation for realtime collaboration. By separating transport, business logic, and persistence, the system remains efficient and ready for future growth.

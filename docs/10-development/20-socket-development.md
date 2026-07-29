# Socket Development

> **Project:** SyncBoard
> **Document:** Socket Development
> **Phase:** 10 - Development
> **Version:** 1.0

---

# 1. Overview

This document defines the Socket.IO implementation standards used throughout SyncBoard.

The socket layer enables low-latency communication between connected clients and powers:

- Live collaboration
- Presence indicators
- Cursor sharing
- Shape synchronization
- Comment synchronization
- Notifications
- Activity updates

The socket infrastructure should remain modular, scalable, and secure.

---

# 2. Objectives

After implementing this module, SyncBoard should support:

- Secure socket connections
- Authenticated clients
- Workspace rooms
- Board rooms
- Event acknowledgements
- Automatic reconnection
- Error handling
- Event versioning
- Scalable architecture

---

# 3. Architecture

```
Client

↓

Socket.IO Client

↓

Socket.IO Server

↓

Socket Manager

↓

Event Handlers

↓

Services

↓

Repositories

↓

Database
```

Business logic should never exist directly inside socket event handlers.

---

# 4. Folder Structure

```
src/

socket/

server.ts

client.ts

index.ts

events/

handlers/

middleware/

rooms/

utils/

types/
```

Separate infrastructure from application logic.

---

# 5. Socket Server Initialization

Responsibilities:

- Initialize Socket.IO
- Configure CORS
- Register middleware
- Register event handlers
- Start heartbeat
- Handle disconnects

The server should be initialized once during application startup.

---

# 6. Socket Client

Client responsibilities:

- Establish connection
- Authenticate
- Join rooms
- Listen for events
- Emit actions
- Reconnect automatically

The client should expose a reusable singleton instance.

---

# 7. Authentication

Authentication flow:

```
Client

↓

Clerk Session Token

↓

Socket Handshake

↓

Verify Token

↓

Attach User Context

↓

Connection Accepted
```

Reject unauthenticated connections immediately.

---

# 8. Connection Lifecycle

```
Connect

↓

Authenticate

↓

Join Rooms

↓

Exchange Events

↓

Heartbeat

↓

Disconnect

↓

Reconnect
```

The lifecycle should be predictable and fault tolerant.

---

# 9. Room Management

Supported room types:

```
workspace:{workspaceId}

board:{boardId}
```

Users may belong to multiple workspace rooms but only active board rooms as required.

---

# 10. Event Registration

Organize events by module.

Examples:

```
board.events.ts

shape.events.ts

comment.events.ts

notification.events.ts

presence.events.ts
```

Avoid registering all events in a single file.

---

# 11. Event Naming

Use consistent namespaced events.

Examples:

```
board:join

board:leave

shape:create

shape:update

shape:delete

comment:create

cursor:move

notification:new
```

Event names should remain stable.

---

# 12. Event Acknowledgements

Critical events should use acknowledgements.

Example flow:

```
Client

↓

Emit Event

↓

Server Processes

↓

Success

↓

Acknowledgement Returned
```

Clients can retry if no acknowledgement is received.

---

# 13. Middleware

Socket middleware responsibilities:

- Authentication
- Authorization
- Rate limiting
- Payload validation
- Logging

Every incoming event should pass through middleware.

---

# 14. Error Handling

Return structured socket errors.

Example:

```json
{
  "code": "UNAUTHORIZED",
  "message": "Authentication required."
}
```

Never expose internal implementation details.

---

# 15. Heartbeats

Use heartbeat intervals to:

- Detect stale connections
- Remove inactive users
- Maintain presence accuracy

Heartbeat intervals should balance responsiveness and network usage.

---

# 16. Reconnection

Client strategy:

```
Disconnect

↓

Retry

↓

Reconnect

↓

Authenticate

↓

Rejoin Rooms

↓

Request Latest State
```

Use exponential backoff to avoid reconnect storms.

---

# 17. Logging

Log:

- Connections
- Disconnections
- Failed authentication
- Room joins
- Room leaves
- Critical event failures

Avoid logging sensitive payload data.

---

# 18. Performance

Optimize by:

- Broadcasting only to relevant rooms
- Compressing large payloads
- Debouncing cursor updates
- Batching frequent events
- Reusing socket instances

Do not broadcast globally unless absolutely necessary.

---

# 19. Scalability

Future scaling strategy:

```
Socket.IO

↓

Redis Adapter

↓

Multiple Node Servers

↓

Load Balancer
```

Sticky sessions should be configured when scaling horizontally.

---

# 20. Security

- Authenticate every connection.
- Authorize every event.
- Validate payloads with Zod.
- Apply rate limiting.
- Prevent unauthorized room joins.
- Disconnect malicious clients.

Never trust client-provided identifiers.

---

# 21. Testing

Verify:

- Connection establishment
- Authentication
- Room joining
- Event acknowledgements
- Reconnection
- Presence updates
- Broadcast behavior
- Unauthorized access
- High concurrency

---

# 22. Debugging

Monitor:

- Active sockets
- Room membership
- Event frequency
- Failed events
- Connection duration
- Reconnection attempts

Structured logging simplifies troubleshooting.

---

# 23. Best Practices

- Keep socket handlers lightweight.
- Delegate business logic to services.
- Use namespaces consistently.
- Broadcast only necessary events.
- Keep payloads compact.
- Version event contracts if breaking changes occur.

---

# 24. Verification Checklist

Before proceeding:

- Socket server initialized
- Client configured
- Authentication working
- Middleware implemented
- Rooms working
- Event handlers registered
- Reconnection verified
- Logging enabled
- Performance targets achieved

---

# 25. Expected Outcome

At the end of this module:

- SyncBoard has a production-ready Socket.IO infrastructure.
- Connections are authenticated and secure.
- Events are modular and maintainable.
- The socket layer is scalable for future Redis-based horizontal deployment.
- The project is ready to implement database access with Prisma.

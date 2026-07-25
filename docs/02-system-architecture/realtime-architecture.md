# Real-Time Architecture

> **Project:** SyncBoard  
> **Document:** Real-Time Architecture  
> **Version:** 1.0

---

# 1. Overview

The Real-Time Architecture defines how SyncBoard enables multiple users to collaborate simultaneously on the same board with minimal latency while maintaining consistency, reliability, and security.

It describes the communication model, connection lifecycle, synchronization strategy, conflict handling, and scalability considerations for real-time collaboration.

---

# 2. Goals

The real-time subsystem aims to provide:

- Low-latency collaboration
- Live synchronization
- High consistency
- Reliable event delivery
- Automatic recovery
- Secure communication
- Horizontal scalability

---

# 3. Communication Model

SyncBoard uses two communication mechanisms:

| Communication         | Purpose                                       |
| --------------------- | --------------------------------------------- |
| REST API              | CRUD operations, authentication, file uploads |
| WebSocket (Socket.IO) | Real-time collaboration                       |

REST is used for persistent operations while WebSockets handle live collaboration events.

---

# 4. High-Level Architecture

```text
                Browser A
                     │
                Socket.IO Client
                     │
                     │
─────────────────────┼─────────────────────
                     │
              WebSocket Gateway
                     │
        ┌────────────┼────────────┐
        ▼            ▼            ▼
 Presence      Collaboration   Event Router
 Service          Service
        │            │
        └────────────┼────────────┘
                     ▼
               Database / Cache
                     │
─────────────────────┼─────────────────────
                     │
               Socket.IO Clients
      Browser B   Browser C   Browser D
```

---

# 5. Connection Lifecycle

```text
Client Opens Application
           │
           ▼
Authenticate User
           │
           ▼
Establish WebSocket Connection
           │
           ▼
Join Workspace Room
           │
           ▼
Join Board Room
           │
           ▼
Receive Live Events
           │
           ▼
Disconnect / Reconnect
```

---

# 6. Room Management

Rooms isolate collaboration traffic.

### Workspace Room

Used for:

- Member presence
- Workspace notifications
- Invitations

Example:

```text
workspace:<workspaceId>
```

---

### Board Room

Used for:

- Canvas updates
- Cursor positions
- Comments
- Object editing
- Version events

Example:

```text
board:<boardId>
```

---

# 7. Event Categories

The real-time system supports the following event groups:

## Connection Events

- connect
- disconnect
- reconnect
- heartbeat

---

## Presence Events

- user:join
- user:leave
- presence:update

---

## Cursor Events

- cursor:move
- cursor:hide

---

## Board Events

- board:join
- board:leave
- board:update

---

## Object Events

- object:create
- object:update
- object:delete
- object:lock
- object:unlock

---

## Comment Events

- comment:create
- comment:update
- comment:delete
- comment:resolve

---

## Notification Events

- notification:new
- notification:read

---

## Version Events

- version:create
- version:restore

---

# 8. Event Flow

Example object update flow:

```text
User A
   │
   ▼
Move Object
   │
   ▼
Socket Client
   │
   ▼
Socket Gateway
   │
   ▼
Authentication
   │
   ▼
Validation
   │
   ▼
Collaboration Service
   │
   ▼
Persist Changes
   │
   ▼
Broadcast
   │
   ├────► User B
   ├────► User C
   └────► User D
```

---

# 9. Presence Management

The presence system tracks:

- Online users
- Active board members
- User status
- Last activity
- Current board

Presence updates should be lightweight and frequent enough to provide an accurate collaboration experience.

---

# 10. Live Cursor Synchronization

Cursor synchronization includes:

- Cursor position
- User identifier
- Display color
- User name
- Active selection (optional)

Cursor updates should not be permanently stored.

---

# 11. Object Synchronization

Each object update should include:

- Object ID
- Board ID
- Operation type
- Updated properties
- Timestamp
- Actor ID

The server validates updates before broadcasting them.

---

# 12. Conflict Resolution

The system should minimize editing conflicts by:

- Server-side validation
- Object locking where appropriate
- Optimistic UI updates
- Ordered event processing
- Version tracking

Conflicting operations should produce deterministic results.

---

# 13. Offline & Reconnection

When connectivity is interrupted:

- Detect disconnection.
- Attempt automatic reconnection.
- Rejoin workspace and board rooms.
- Synchronize missed updates.
- Restore collaboration state.

---

# 14. Event Acknowledgements

Critical operations should use acknowledgements.

Examples:

- Object creation
- Object deletion
- Version restoration
- Comment creation

Acknowledgements confirm successful server processing.

---

# 15. Rate Limiting

The server should protect against excessive event traffic.

Examples:

- Cursor updates
- Drawing events
- Chat events
- Presence updates

High-frequency events may be throttled or batched.

---

# 16. Error Handling

Common real-time errors include:

- Authentication failure
- Authorization failure
- Invalid payload
- Board not found
- Connection timeout
- Event processing failure

Errors should be returned using a consistent event format.

---

# 17. Security Considerations

The real-time layer should enforce:

- Authenticated socket connections
- Authorization per room
- Event validation
- Payload sanitization
- Rate limiting
- Secure WebSocket transport (WSS)

---

# 18. Scalability Strategy

The architecture should support:

- Multiple Socket.IO server instances
- Shared adapter for cross-instance event propagation
- Stateless application servers
- Load balancing with sticky sessions where required
- Distributed caching (future)

---

# 19. Monitoring

The following metrics should be monitored:

- Active socket connections
- Events per second
- Average event latency
- Failed events
- Reconnection rate
- Room occupancy
- Broadcast duration

---

# 20. Design Principles

The real-time subsystem follows:

- Event-driven architecture
- Separation of concerns
- Minimal event payloads
- Server authority
- Predictable event naming
- Reliable synchronization

---

# 21. Conclusion

The Real-Time Architecture provides the foundation for SyncBoard's collaborative experience by enabling efficient, secure, and scalable communication between connected users. It ensures consistent synchronization while supporting future growth in user count, board complexity, and collaboration features.

---

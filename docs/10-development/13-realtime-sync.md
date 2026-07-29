# Realtime Sync

> **Project:** SyncBoard
> **Document:** Realtime Sync
> **Phase:** 10 - Development
> **Version:** 1.0

---

# 1. Overview

The Realtime Sync Module enables multiple users to collaborate on the same board simultaneously.

It is responsible for:

- Live collaboration
- Presence detection
- Cursor sharing
- Shape synchronization
- Comment synchronization
- Conflict resolution
- Reconnection
- Event broadcasting

The implementation uses **Socket.IO** with a server-authoritative synchronization model.

---

# 2. Objectives

After implementing this module, SyncBoard should support:

- Multiple users editing one board
- Live cursor movement
- Instant shape updates
- Presence indicators
- User join/leave events
- Automatic reconnection
- Optimistic UI
- Reliable event delivery
- Low latency collaboration

---

# 3. High-Level Architecture

```
Users

↓

Socket.IO Client

↓

Socket.IO Server

↓

Realtime Service

↓

Board Room

↓

Event Dispatcher

↓

Database
```

The server acts as the source of truth for synchronized state.

---

# 4. Connection Lifecycle

```
User Opens Board

↓

Authenticate Socket

↓

Join Workspace

↓

Join Board Room

↓

Receive Initial State

↓

Realtime Collaboration

↓

Disconnect

↓

Reconnect
```

---

# 5. Authentication

Every socket connection must be authenticated.

Flow:

```
Client

↓

Clerk Session Token

↓

Socket Handshake

↓

Verify Token

↓

Accept / Reject Connection
```

Unauthenticated sockets must be rejected.

---

# 6. Room Management

Socket rooms:

```
workspace:{workspaceId}

board:{boardId}
```

Each connected client joins:

- Workspace room
- Active board room

This limits unnecessary broadcasts.

---

# 7. Presence System

Track:

- Online users
- Current board
- Active tool
- Cursor position
- Last activity

Presence should update frequently without overwhelming the network.

---

# 8. Cursor Synchronization

Broadcast:

```
User ID

Cursor X

Cursor Y

Timestamp
```

Cursor events:

- Join
- Move
- Leave

Cursor updates should **not** be persisted.

---

# 9. Event Types

Supported events:

```
board:join

board:leave

shape:create

shape:update

shape:delete

comment:create

comment:update

comment:delete

cursor:move

presence:update

history:undo

history:redo
```

Event names should remain stable across client and server.

---

# 10. Event Flow

```
Client Action

↓

Socket Emit

↓

Server Validation

↓

Business Logic

↓

Database Update

↓

Broadcast

↓

Client State Update
```

The server validates every incoming event before broadcasting.

---

# 11. Optimistic Updates

Client workflow:

```
User Action

↓

Immediate UI Update

↓

Send Event

↓

Server Confirmation

↓

Keep or Roll Back
```

Optimistic rendering improves responsiveness.

---

# 12. Conflict Resolution

Potential conflicts:

- Simultaneous movement
- Simultaneous edits
- Deletion during editing
- Concurrent styling

Initial strategy:

- Last Write Wins (LWW)

Future improvements:

- Operational Transformation (OT)
- CRDT

---

# 13. Event Validation

Every event should verify:

- Authentication
- Workspace membership
- Board access
- Payload schema
- Resource existence

Invalid events must be rejected without affecting other clients.

---

# 14. Reconnection

On disconnect:

```
Connection Lost

↓

Retry

↓

Reconnect

↓

Re-authenticate

↓

Rejoin Rooms

↓

Sync Latest State
```

The client should automatically attempt reconnection with exponential backoff.

---

# 15. Synchronization Strategy

Realtime synchronization:

- Shape creation
- Shape updates
- Shape deletion
- Comments
- Reactions
- Presence
- Cursor movement

Do not synchronize:

- Hover state
- Local selection
- Context menus

These remain client-local.

---

# 16. Event Ordering

Each event should include:

```
eventId

boardId

userId

timestamp

version
```

This enables:

- Ordering
- Deduplication
- Debugging

---

# 17. Scalability

Design considerations:

- Room-based broadcasting
- Horizontal scaling
- Redis adapter (future)
- Load balancing
- Sticky sessions

The architecture should support thousands of concurrent users.

---

# 18. Error Handling

Possible errors:

- Authentication failure
- Invalid payload
- Unauthorized access
- Missing board
- Network interruption

Clients should receive structured error events.

---

# 19. Security

- Authenticate every socket.
- Authorize every action.
- Validate all payloads with Zod.
- Rate-limit socket events.
- Prevent event spoofing.
- Never trust client data.

---

# 20. Performance

Optimize by:

- Batching updates
- Event throttling
- Debouncing cursor events
- Compressing payloads
- Avoiding unnecessary broadcasts

Cursor updates should be lightweight and frequent.

---

# 21. Monitoring

Track:

- Active connections
- Active rooms
- Event throughput
- Average latency
- Failed events
- Reconnection count

These metrics help identify performance bottlenecks.

---

# 22. Testing

Verify:

- User joins
- User leaves
- Live shape updates
- Cursor synchronization
- Comment synchronization
- Conflict handling
- Network interruptions
- Reconnection
- Unauthorized socket access
- High concurrency

---

# 23. Best Practices

- Keep events small.
- Validate everything server-side.
- Broadcast only necessary updates.
- Avoid storing transient UI state.
- Separate transport logic from business logic.
- Design event names consistently.

---

# 24. Verification Checklist

Before proceeding:

- Socket server implemented
- Authentication working
- Rooms implemented
- Presence system working
- Cursor sync working
- Shape sync working
- Comment sync working
- Reconnection verified
- Performance targets achieved

---

# 25. Expected Outcome

At the end of this module:

- Multiple users can collaborate on the same board in real time.
- Live cursor movement and presence indicators work smoothly.
- Shape and comment updates are synchronized instantly.
- Connections recover automatically after interruptions.
- The realtime engine is secure, scalable, and ready for production deployment.

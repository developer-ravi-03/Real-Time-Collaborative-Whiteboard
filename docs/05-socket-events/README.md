# Socket Event Design

> **Project:** SyncBoard
> **Document:** Socket Event Design
> **Version:** 1.0

---

# 1. Overview

This module defines the real-time communication protocol used by SyncBoard.

SyncBoard allows multiple users to collaborate simultaneously on the same board. To ensure consistent behavior across clients, all Socket.IO events are documented before implementation.

The Socket protocol complements the REST API.

General rule:

- REST APIs manage resource lifecycle.
- Socket events synchronize real-time state.

---

# 2. Objectives

The realtime layer provides:

- Multi-user collaboration
- Live object updates
- Presence awareness
- Cursor sharing
- Comment synchronization
- Notification delivery
- Conflict handling
- Low latency communication

---

# 3. Architecture

```

Client A
│
├────────────┐
│            │
▼            ▼

Socket.IO Server

▲            ▲
│            │
├────────────┘

Client B

```

REST remains the source of truth.

Socket events synchronize changes after authorization.

---

# 4. Communication Model

SyncBoard uses an event-driven architecture.

Each event contains:

- Event Name
- Payload
- Validation Rules
- Authorization Rules
- Acknowledgement
- Error Response

---

# 5. Event Categories

The protocol is divided into the following modules:

| Module         | Description                    |
| -------------- | ------------------------------ |
| Connection     | Connect, disconnect, reconnect |
| Authentication | Authenticate socket            |
| Presence       | Online users, cursors          |
| Board          | Join, leave, updates           |
| Objects        | CRUD synchronization           |
| Comments       | Live discussions               |
| Notifications  | Live alerts                    |
| Errors         | Socket-specific errors         |

---

# 6. Design Principles

The realtime protocol follows these principles:

- Event names are stable.
- Events are version independent.
- Payloads are JSON.
- Authorization is always server-side.
- Clients never trust each other.
- The server is authoritative.

---

# 7. Relationship with REST APIs

REST API

- Create board
- Delete board
- Create object
- Update object

↓

Socket

- board:created
- board:deleted
- object:created
- object:updated

REST performs the operation.

Socket informs connected clients.

---

# 8. Ordering

Events affecting the same resource must be processed in order.

Where applicable:

- Sequence numbers
- Timestamps
- Version numbers

are used to detect stale updates.

---

# 9. Future Support

The protocol is designed for:

- Horizontal scaling
- Redis adapter
- Multiple Socket.IO servers
- Offline synchronization
- Event replay

---

# 10. Conclusion

The Socket protocol forms the realtime backbone of SyncBoard and works alongside the REST API to provide a fast, scalable, and consistent collaborative experience.

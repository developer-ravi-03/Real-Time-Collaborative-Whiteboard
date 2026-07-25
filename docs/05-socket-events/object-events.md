# Object Socket Events

> **Project:** SyncBoard
> **Document:** Object Socket Events
> **Version:** 1.0

---

# 1. Overview

Object Events synchronize every modification performed on a board's infinite canvas.

Unlike REST APIs, these events are designed for low-latency realtime collaboration between multiple users.

The server remains the authoritative source of truth.

---

# 2. Event Categories

Object events are divided into two groups.

## Persistent Events

These events are stored in the database.

- Create Object
- Update Object
- Delete Object
- Bulk Update
- Bulk Delete
- Lock Object
- Unlock Object
- Layer Change

---

## Transient Events

These events are **not persisted**.

- Cursor Move
- Selection Change
- Drag Preview
- Resize Preview
- Rotation Preview
- Typing Indicator

Transient events exist only while users are actively collaborating.

---

# 3. Event Summary

| Client Event              | Server Event                    | Persistence |
| ------------------------- | ------------------------------- | ----------- |
| client:object:create      | server:object:created           | Yes         |
| client:object:update      | server:object:updated           | Yes         |
| client:object:delete      | server:object:deleted           | Yes         |
| client:object:bulk-update | server:object:bulk-updated      | Yes         |
| client:object:bulk-delete | server:object:bulk-deleted      | Yes         |
| client:object:lock        | server:object:locked            | Yes         |
| client:object:unlock      | server:object:unlocked          | Yes         |
| client:object:layer       | server:object:layer-changed     | Yes         |
| client:object:selection   | server:object:selection-updated | No          |
| client:object:drag        | server:object:dragging          | No          |
| client:object:resize      | server:object:resizing          | No          |
| client:object:rotate      | server:object:rotating          | No          |

---

# 4. Create Object

Client Event

```
client:object:create
```

Example

```json
{
  "boardId": "550e8400-e29b-41d4-a716-446655440001",
  "type": "STICKY_NOTE",
  "position": {
    "x": 120,
    "y": 240
  },
  "size": {
    "width": 220,
    "height": 180
  },
  "payload": {
    "text": "Sprint Goal"
  }
}
```

Server Actions

- Authenticate
- Authorize
- Validate payload
- Create object
- Assign version
- Persist to database
- Broadcast

Broadcast

```
server:object:created
```

---

# 5. Update Object

Client Event

```
client:object:update
```

Editable Fields

- Position
- Size
- Rotation
- Opacity
- Payload
- Lock state

Every update increments the object's version number.

---

# 6. Delete Object

Client Event

```
client:object:delete
```

Server

- Delete object
- Remove connectors
- Broadcast deletion

---

# 7. Bulk Update

Client Event

```
client:object:bulk-update
```

Purpose

Supports:

- Multi-select move
- Group resize
- Multi-edit
- Alignment operations

Example

```json
{
  "transactionId": "550e8400-e29b-41d4-a716-446655440099",
  "operations": [
    {
      "objectId": "obj-1",
      "changes": {
        "x": 300,
        "y": 420
      }
    },
    {
      "objectId": "obj-2",
      "changes": {
        "x": 500,
        "y": 420
      }
    }
  ]
}
```

All operations execute atomically.

---

# 8. Selection Events

Client Event

```
client:object:selection
```

Purpose

Share active selection with collaborators.

Example

```json
{
  "objectIds": ["obj-1", "obj-2"]
}
```

Not stored in database.

---

# 9. Drag Events

Client Event

```
client:object:drag
```

Purpose

Realtime drag preview.

Broadcast frequency should be throttled (≈30–60 FPS).

Final object position is saved through `client:object:update`.

---

# 10. Resize Events

Client Event

```
client:object:resize
```

Transient only.

Final dimensions are persisted after resize ends.

---

# 11. Rotate Events

Client Event

```
client:object:rotate
```

Transient.

Persist only on completion.

---

# 12. Lock / Unlock

Client Events

```
client:object:lock

client:object:unlock
```

Permission

Owner or Editor.

Locked objects cannot be modified until unlocked.

---

# 13. Layer Change

Client Event

```
client:object:layer
```

Supported operations

- Bring To Front
- Send To Back
- Bring Forward
- Send Backward

---

# 14. Version Control

Every object includes:

- version
- updatedAt

Clients must send the last known version.

The server detects stale updates.

---

# 15. Conflict Resolution

If two users edit the same object:

1. Validate object version.
2. Reject stale updates.
3. Return latest object state.
4. Client reconciles local state.

Future versions may adopt CRDT or Operational Transform.

---

# 16. Optimistic UI

The client may update the local canvas immediately.

The server then:

- Confirms the update
- Rejects invalid updates
- Sends authoritative state

---

# 17. Authorization

Every event verifies:

- Authenticated user
- Workspace membership
- Board membership
- User role
- Object existence

---

# 18. Broadcasting Rules

Persistent events:

Broadcast to

```
board:{boardId}
```

excluding the originating socket when appropriate.

Transient events:

Broadcast only to active collaborators on the same board.

---

# 19. Performance Guidelines

- Batch related updates.
- Throttle drag/resize/rotate events.
- Avoid broadcasting unchanged properties.
- Compress payloads where beneficial.
- Minimize database writes for transient actions.

---

# 20. Logging

Log persistent events only.

Include:

- Event name
- Object ID
- Board ID
- User ID
- Transaction ID
- Processing time

Transient events are not logged unless debugging is enabled.

---

# 21. Future Enhancements

- Group/Ungroup
- Snap-to-grid
- Smart guides
- CRDT support
- Operational Transform
- Object history
- AI-assisted object generation

---

# 22. Conclusion

Object Events define the realtime synchronization protocol for SyncBoard's infinite canvas. By separating persistent and transient events, supporting optimistic UI, and using version-based conflict detection, the protocol provides a scalable foundation for collaborative editing.

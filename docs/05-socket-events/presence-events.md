# Presence Socket Events

> **Project:** SyncBoard
> **Document:** Presence Socket Events
> **Version:** 1.0

---

# 1. Overview

Presence events synchronize user activity in realtime without persisting data.

These events enable collaborators to see:

- Online users
- Live cursors
- Active selections
- Viewport positions
- User activity states
- Typing indicators

Presence information exists only during an active socket session.

---

# 2. Presence Architecture

```
User Action
      │
      ▼
Transient Socket Event
      │
      ▼
Validation
      │
      ▼
Broadcast to Board Room
      │
      ▼
Other Collaborators
```

No database writes occur.

---

# 3. Event Summary

| Client Event              | Server Event              | Persisted |
| ------------------------- | ------------------------- | --------- |
| client:presence:join      | server:presence:joined    | No        |
| client:presence:leave     | server:presence:left      | No        |
| client:presence:cursor    | server:presence:cursor    | No        |
| client:presence:selection | server:presence:selection | No        |
| client:presence:viewport  | server:presence:viewport  | No        |
| client:presence:typing    | server:presence:typing    | No        |
| client:presence:idle      | server:presence:idle      | No        |

---

# 4. Join Presence

Client Event

```
client:presence:join
```

Purpose

Announce that a user has entered the board.

Server Broadcast

```
server:presence:joined
```

Payload

```json
{
  "userId": "user-123",
  "boardId": "board-456",
  "joinedAt": "2026-07-25T14:00:00Z"
}
```

---

# 5. Leave Presence

Client Event

```
client:presence:leave
```

Triggered when:

- User closes the board
- Disconnect occurs
- User signs out

Server Broadcast

```
server:presence:left
```

---

# 6. Cursor Updates

Client Event

```
client:presence:cursor
```

Purpose

Broadcast live cursor movement.

Example

```json
{
  "x": 1542,
  "y": 832
}
```

Guidelines

- Do not persist.
- Throttle to approximately 30–60 FPS.
- Broadcast only to collaborators on the same board.

---

# 7. Selection Updates

Client Event

```
client:presence:selection
```

Purpose

Display which objects another user has selected.

Example

```json
{
  "objectIds": ["obj-1", "obj-2"]
}
```

Selections disappear when the user deselects objects or disconnects.

---

# 8. Viewport Synchronization

Client Event

```
client:presence:viewport
```

Purpose

Share the visible canvas region.

Example

```json
{
  "x": 200,
  "y": 500,
  "zoom": 1.5
}
```

Use Cases

- "Follow user" mode
- Presenter mode
- Collaboration awareness

---

# 9. Typing Indicator

Client Event

```
client:presence:typing
```

Purpose

Show that a collaborator is actively editing text.

Example

```json
{
  "objectId": "obj-1",
  "typing": true
}
```

Typing indicators automatically expire after a short timeout if no updates are received.

---

# 10. Idle Status

Client Event

```
client:presence:idle
```

States

- ACTIVE
- IDLE
- AWAY

Idle detection is managed by the client based on user activity.

---

# 11. Presence State

Each connected collaborator maintains:

```text
User Presence
├── User ID
├── Board ID
├── Cursor Position
├── Selected Objects
├── Viewport
├── Activity State
├── Typing State
└── Last Seen
```

This information is held only in server memory.

---

# 12. Authorization

Presence events require:

- Authenticated socket
- Board membership
- Joined board room

Unauthorized clients cannot receive or broadcast presence updates.

---

# 13. Broadcasting Rules

Broadcast only to:

```
board:{boardId}
```

Do not broadcast globally.

The originating client may be excluded where appropriate.

---

# 14. Rate Limiting

Recommended limits

| Event     | Recommendation    |
| --------- | ----------------- |
| Cursor    | 30–60 updates/sec |
| Viewport  | 10 updates/sec    |
| Selection | On change only    |
| Typing    | On state change   |
| Idle      | On state change   |

Excessive updates should be throttled on the client.

---

# 15. Performance

- Never persist presence events.
- Batch rapid updates where practical.
- Compress payloads if necessary.
- Remove stale presence immediately on disconnect.

---

# 16. Error Handling

Possible errors

- UNAUTHORIZED
- FORBIDDEN
- BOARD_NOT_FOUND
- RATE_LIMIT_EXCEEDED

Presence failures should not interrupt other realtime functionality.

---

# 17. Logging

Presence events are not logged by default.

Optional debug logging may include:

- Event name
- User ID
- Board ID
- Timestamp

High-frequency cursor events should never be stored in production logs.

---

# 18. Future Enhancements

- User follow mode
- Live laser pointer
- Voice activity indicators
- Collaborative presentations
- Team awareness heatmaps

---

# 19. Conclusion

Presence events provide realtime collaboration awareness without affecting persistent board data. By separating transient presence information from stored object data, SyncBoard achieves responsive collaboration while minimizing database load.

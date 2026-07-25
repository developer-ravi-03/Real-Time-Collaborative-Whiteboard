# Socket Event Versioning

> **Project:** SyncBoard
> **Document:** Socket Event Versioning
> **Version:** 1.0

---

# 1. Overview

This document defines how Socket.IO events evolve over time while maintaining compatibility between clients and servers.

The objectives are:

- Backward compatibility
- Safe protocol evolution
- Predictable upgrades
- Zero-downtime deployments

---

# 2. Design Principles

Socket event contracts should be stable.

Breaking changes must never be introduced without versioning.

Whenever possible:

- Add new fields instead of modifying existing ones.
- Never change the meaning of an existing field.
- Never reuse event names with different payloads.

---

# 3. Event Version Strategy

Each event belongs to a protocol version.

Current version

```
v1
```

Future versions

```
v2
v3
...
```

The server may support multiple versions during migration periods.

---

# 4. Payload Evolution

### Allowed Changes

- Add optional fields
- Add new event types
- Extend enums (if clients can safely ignore unknown values)

Example

Version 1

```json
{
  "objectId": "obj-1",
  "x": 100,
  "y": 200
}
```

Version 2

```json
{
  "objectId": "obj-1",
  "x": 100,
  "y": 200,
  "rotation": 45
}
```

Older clients can ignore the new field.

---

### Breaking Changes

Avoid:

- Renaming fields
- Removing required fields
- Changing field types
- Changing event semantics

If unavoidable, introduce a new protocol version.

---

# 5. Event Metadata

Every server event should include metadata.

Example

```json
{
  "eventId": "550e8400-e29b-41d4-a716-446655440000",
  "version": "v1",
  "timestamp": "2026-07-25T16:00:00Z",
  "payload": {}
}
```

---

# 6. Compatibility Rules

| Client | Server          | Result              |
| ------ | --------------- | ------------------- |
| v1     | v1              | ✅ Supported        |
| v1     | v2 (compatible) | ✅ Supported        |
| v2     | v1              | ⚠️ Limited features |
| v3     | v1              | ❌ Unsupported      |

Servers should reject unsupported protocol versions with a clear error.

---

# 7. Deprecation Policy

Before removing an event:

1. Mark it as deprecated.
2. Document the replacement.
3. Maintain support during the deprecation period.
4. Remove it only in the next major protocol version.

Example

```
Deprecated

client:object:move

Replacement

client:object:update
```

---

# 8. Feature Detection

Clients should not assume every server supports every feature.

The server may expose supported capabilities during connection.

Example

```json
{
  "protocolVersion": "v1",
  "features": ["bulk-update", "presence", "comments"]
}
```

This allows gradual rollout of new functionality.

---

# 9. Deployment Strategy

Recommended deployment order:

1. Deploy server with backward compatibility.
2. Roll out updated clients.
3. Monitor adoption.
4. Remove deprecated behavior in the next major version.

This minimizes downtime and incompatibility.

---

# 10. Logging

Log:

- Client protocol version
- Server protocol version
- Compatibility warnings
- Deprecated event usage

These metrics help plan future upgrades.

---

# 11. Future Enhancements

The versioning strategy supports:

- API negotiation
- Feature flags
- Experimental events
- Canary deployments
- Enterprise plugin extensions

---

# 12. Conclusion

Socket event versioning ensures that SyncBoard can evolve without breaking existing clients. By introducing protocol versions, maintaining backward compatibility, and following a clear deprecation policy, the realtime architecture remains stable and scalable over time.

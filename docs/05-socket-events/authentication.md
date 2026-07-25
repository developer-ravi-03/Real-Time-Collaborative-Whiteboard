# Socket Authentication

> **Project:** SyncBoard
> **Document:** Socket Authentication
> **Version:** 1.0

---

# 1. Overview

This document defines the authentication and authorization process for all Socket.IO connections.

The objectives are:

- Secure realtime communication
- Single identity source (Clerk)
- Consistent authorization
- Protection against unauthorized connections
- Scalable authentication architecture

---

# 2. Authentication Flow

```
Browser
    │
    ▼
User Authenticated (Clerk)
    │
    ▼
Generate Session Token
    │
    ▼
Socket.IO Handshake
    │
    ▼
Verify JWT
    │
    ▼
Load User
    │
    ▼
Create Socket Context
    │
    ▼
Connection Accepted
```

---

# 3. Handshake Authentication

During connection, the client sends the Clerk JWT in the authentication payload.

Example:

```json
{
  "auth": {
    "token": "<clerk-jwt>"
  }
}
```

The token is transmitted only during the initial handshake.

---

# 4. Server Verification

The server validates:

- JWT signature
- Token expiration
- Clerk session
- User existence
- User account status

If validation succeeds:

- Connection is accepted.
- User context is attached to the socket.

Otherwise:

- Connection is rejected with `UNAUTHORIZED`.

---

# 5. Socket Context

Each authenticated socket stores:

```text
Socket Context
├── socketId
├── userId
├── clerkId
├── email
├── displayName
├── avatarUrl
├── connectedAt
└── currentBoardId (optional)
```

This context is available to all event handlers during the lifetime of the connection.

---

# 6. Authorization Model

Authentication confirms **who the user is**.

Authorization determines **what the user can do**.

Every incoming event must verify:

- Workspace membership
- Board membership
- User role
- Required permissions

No client-provided role information is trusted.

---

# 7. Token Expiration

If the session expires while connected:

1. Server rejects future privileged events.
2. Client receives an authentication error.
3. Client refreshes the session through Clerk.
4. Client reconnects with a new token.

---

# 8. Re-authentication

Clients must reconnect after obtaining a refreshed token.

The server does not allow replacing the authentication context on an existing socket.

This keeps connection state simple and secure.

---

# 9. Failed Authentication

Connections are rejected when:

- JWT is missing.
- JWT is invalid.
- JWT is expired.
- User no longer exists.
- User account is disabled.

Example error:

```json
{
  "success": false,
  "error": {
    "code": "UNAUTHORIZED",
    "message": "Authentication failed."
  }
}
```

---

# 10. Authorization Checks

Before joining a board:

Verify:

- Workspace membership
- Board access
- Board exists

Before modifying objects:

Verify:

- Editor or Owner role
- Object belongs to board
- Object is not locked (if applicable)

---

# 11. Multi-Device Support

A user may connect from:

- Desktop
- Laptop
- Mobile
- Multiple browser tabs

Each connection has:

- Unique socket ID
- Shared user identity
- Independent lifecycle

---

# 12. Security Rules

The server must never trust:

- User IDs from payloads
- Workspace IDs without verification
- Roles sent by the client
- Object ownership claims

All permissions are resolved from the database.

---

# 13. Logging

Authentication logs include:

- Socket ID
- User ID
- Authentication result
- Timestamp
- IP address
- User agent

JWTs and other sensitive credentials must never be logged.

---

# 14. Future Enhancements

The authentication architecture supports:

- Multi-factor authentication (MFA)
- Device management
- Session revocation
- Single Sign-On (SSO)
- Organization-level authentication
- Audit trails

---

# 15. Conclusion

The Socket Authentication layer ensures that every realtime connection is securely authenticated through Clerk and consistently authorized using SyncBoard's RBAC model. It provides a scalable foundation for secure collaboration across boards and workspaces.

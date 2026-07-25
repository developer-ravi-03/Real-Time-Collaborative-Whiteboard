# Authentication API

> **Project:** SyncBoard  
> **Document:** Authentication APIs  
> **Version:** 1.0  
> **API Version:** v1

---

# 1. Overview

This document defines the authentication and authorization architecture for SyncBoard.

Authentication is handled by **Clerk**, while application-specific authorization (workspace roles and permissions) is handled within the SyncBoard backend.

Goals:

- Secure authentication
- Stateless APIs
- Fine-grained authorization
- Workspace-level RBAC
- Production-ready security

---

# 2. Authentication Architecture

```
                Browser
                    │
                    ▼
          Clerk Authentication
                    │
                    ▼
        Clerk Session / JWT Token
                    │
Authorization: Bearer <JWT>
                    │
                    ▼
      Next.js Authentication Middleware
                    │
                    ▼
         JWT Verification (Clerk)
                    │
                    ▼
      SyncBoard Authorization Layer
                    │
                    ▼
             Route Handler
                    │
                    ▼
           Prisma + PostgreSQL
```

---

# 3. Authentication Flow

1. User signs in using Clerk.
2. Clerk creates a secure session.
3. Client receives a valid session.
4. Client sends JWT with every protected request.
5. Backend verifies JWT.
6. Backend loads the user.
7. Backend checks workspace permissions.
8. Request proceeds.

---

# 4. Public Routes

Authentication is **not required** for:

| Endpoint          | Method                                            |
| ----------------- | ------------------------------------------------- |
| `/api/v1/health`  | GET                                               |
| `/api/v1/auth/me` | GET (returns unauthenticated state if no session) |

All other application APIs require authentication.

---

# 5. Protected Routes

Authentication is required for:

- Workspaces
- Boards
- Board Objects
- Comments
- Notifications
- Attachments
- Board Versions

---

# 6. User Identity

Each authenticated user is identified by:

- Clerk User ID
- Email
- Display Name
- Avatar

The `users` table stores the corresponding application profile and references the Clerk user.

---

# 7. Authorization (RBAC)

Workspace permissions are role-based.

| Role   | Permissions             |
| ------ | ----------------------- |
| Owner  | Full access             |
| Editor | Create, update, comment |
| Viewer | Read-only               |

Authorization is evaluated **after** successful authentication.

---

# 8. Authentication Middleware

Every protected request passes through middleware.

Responsibilities:

- Verify JWT
- Reject unauthenticated requests
- Attach authenticated user to request context
- Forward request to authorization layer

---

# 9. Authorization Flow

```
Incoming Request
        │
        ▼
Authenticated?
        │
   Yes / No
        │
        ▼
Load Workspace Membership
        │
        ▼
Determine User Role
        │
        ▼
Permission Check
        │
        ▼
Allow / Deny
```

---

# 10. Authentication Endpoints

Although Clerk manages sign-in and sign-up, SyncBoard exposes endpoints for retrieving authenticated user information.

## Get Current User

### Endpoint

```
GET /api/v1/auth/me
```

Authentication Required:

Yes

Response:

```json
{
  "success": true,
  "message": "Authenticated user fetched successfully.",
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "clerkId": "user_xxxxxxxxx",
    "email": "john@example.com",
    "name": "John Doe",
    "imageUrl": "https://..."
  },
  "meta": {},
  "errors": null
}
```

---

# 11. Authentication Errors

| HTTP | Error Code    |
| ---- | ------------- |
| 401  | AUTH_REQUIRED |
| 401  | INVALID_TOKEN |
| 401  | TOKEN_EXPIRED |
| 403  | ACCESS_DENIED |

---

# 12. Session Lifecycle

```
Sign In
    │
    ▼
Session Created
    │
    ▼
Authenticated Requests
    │
    ▼
Session Expires / User Signs Out
    │
    ▼
401 Unauthorized
```

---

# 13. Security Best Practices

The authentication system follows these principles:

- JWT verification on every protected request
- HTTPS in production
- Server-side authorization checks
- No sensitive information in responses
- Least-privilege access
- Role validation before business logic

---

# 14. Future Enhancements

The authentication architecture supports future features such as:

- Multi-factor authentication (MFA)
- Organization support
- SSO (Google, GitHub, Microsoft)
- Session management dashboard
- Device management
- Audit logs

---

# 15. Conclusion

The SyncBoard authentication system combines Clerk for secure identity management with an application-level RBAC authorization layer. This approach provides a scalable, secure, and maintainable foundation for protecting application resources.

# Authentication

> **Project:** SyncBoard
> **Document:** Authentication
> **Phase:** 10 - Development
> **Version:** 1.0

---

# 1. Overview

This document describes the complete authentication implementation for SyncBoard using **Clerk**.

Authentication responsibilities include:

- User registration
- User login
- Session management
- Route protection
- Role-based authorization
- User synchronization
- Secure logout

---

# 2. Objectives

After completing this document, SyncBoard should support:

- Email & Password Sign Up
- Email & Password Sign In
- Google OAuth
- GitHub OAuth
- Session Management
- Protected Routes
- Public Routes
- User Profile
- User Synchronization with Database
- Role-Based Access Control (RBAC)

---

# 3. Why Clerk?

Reasons for choosing Clerk:

- Production-ready authentication
- Excellent Next.js support
- App Router compatible
- Secure session management
- Built-in OAuth providers
- User profile management
- Webhooks
- Organization support (future)
- Excellent developer experience

---

# 4. Authentication Flow

```
User

↓

Sign In / Sign Up

↓

Clerk Authentication

↓

Session Created

↓

Middleware Validation

↓

Protected Route

↓

Application
```

---

# 5. Clerk Project Setup

1. Create an account at Clerk.
2. Create a new application.
3. Choose authentication providers:
   - Email
   - Google
   - GitHub
4. Copy API keys.

---

# 6. Install Clerk

```bash
npm install @clerk/nextjs
```

---

# 7. Environment Variables

Add the following variables:

```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=

CLERK_SECRET_KEY=
```

Optional:

```env
CLERK_WEBHOOK_SECRET=
```

---

# 8. Wrap the Application

Update the root layout.

```tsx
<ClerkProvider>{children}</ClerkProvider>
```

This enables Clerk throughout the application.

---

# 9. Configure Middleware

Create:

```
middleware.ts
```

Protect private routes.

Example protected areas:

```
/dashboard

/workspace

/board

/settings

/profile
```

Public routes:

```
/

/sign-in

/sign-up
```

---

# 10. Authentication Pages

Create:

```
app/

(sign-in)/

(sign-up)/
```

Use Clerk's prebuilt components.

```
<SignIn />

<SignUp />
```

---

# 11. Session Management

Access authenticated user:

```tsx
const { user } = useUser();
```

Server-side:

```tsx
auth();
```

Use server-side authentication whenever possible.

---

# 12. Route Protection

Protected pages should verify:

- User authenticated
- Session valid
- Required permissions

Redirect unauthenticated users to:

```
/sign-in
```

---

# 13. User Synchronization

After first login:

```
Clerk User

↓

Webhook

↓

Create User

↓

PostgreSQL
```

Store:

- Clerk ID
- Name
- Email
- Avatar
- Created At

The database should never become the source of authentication truth.

---

# 14. Role-Based Access Control

Supported roles:

```
Owner

Admin

Member

Viewer
```

Permissions should be enforced in the Service Layer.

Never rely on client-side authorization.

---

# 15. User Profile

Provide profile management using Clerk.

Features:

- Update name
- Update avatar
- Change password
- Manage connected accounts
- Delete account

---

# 16. Logout

Use Clerk logout functionality.

Expected flow:

```
Logout

↓

Session Destroyed

↓

Redirect Home
```

---

# 17. Webhooks

Configure webhook endpoint.

Purpose:

- User created
- User updated
- User deleted

Sync changes to PostgreSQL.

---

# 18. Testing

Verify:

- Sign Up
- Sign In
- Google Login
- GitHub Login
- Logout
- Session persistence
- Protected routes
- Unauthorized access
- User synchronization

---

# 19. Security Best Practices

- Never expose secret keys.
- Validate sessions server-side.
- Protect every private route.
- Use HTTPS in production.
- Rotate secrets periodically.
- Verify webhook signatures.

---

# 20. Common Issues

### Invalid Publishable Key

Check:

```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
```

---

### Secret Key Missing

Verify:

```
CLERK_SECRET_KEY
```

---

### Middleware Loop

Ensure public routes are excluded from protection.

---

### Session Not Updating

Restart development server after modifying environment variables.

---

# 21. Verification Checklist

Before continuing:

- Clerk project created
- Environment variables configured
- Clerk installed
- Middleware configured
- Sign In working
- Sign Up working
- OAuth providers working
- Protected routes verified
- User synchronization verified

---

# 22. Expected Outcome

At the end of this step:

- Authentication is fully functional.
- Sessions are securely managed.
- Protected routes are enforced.
- User records are synchronized with PostgreSQL.
- The application is ready to implement user management, workspaces, and collaborative features.

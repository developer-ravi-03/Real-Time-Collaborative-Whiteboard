# Routing Architecture

> **Project:** SyncBoard
> **Document:** Routing Architecture
> **Version:** 1.0

---

# 1. Overview

This document defines the routing strategy for SyncBoard.

The application uses the **Next.js 15 App Router** with route groups, nested layouts, dynamic routes, and middleware to create a scalable and maintainable navigation system.

The routing architecture aims to provide:

- Clear URL hierarchy
- Secure navigation
- Reusable layouts
- Feature isolation
- Excellent developer experience

---

# 2. Routing Principles

The routing system follows these principles:

- Use App Router
- Group routes by feature
- Prefer nested layouts
- Keep URLs meaningful
- Protect private routes
- Minimize duplicated layouts

---

# 3. Root Structure

```
app/

├── (marketing)/
├── (auth)/
├── (dashboard)/
├── api/
├── layout.tsx
├── page.tsx
├── loading.tsx
├── error.tsx
└── not-found.tsx
```

---

# 4. Public Routes

Public routes do not require authentication.

Examples:

```
/

/about

/pricing

/contact
```

---

# 5. Authentication Routes

```
(auth)/

sign-in/

sign-up/

forgot-password/

verify-email/
```

Only unauthenticated users should access these pages.

Authenticated users should be redirected appropriately.

---

# 6. Protected Dashboard Routes

```
(dashboard)/

dashboard/

workspace/

settings/

notifications/
```

Authentication is required.

Middleware should prevent unauthorized access.

---

# 7. Dynamic Routes

Workspace

```
/workspace/[workspaceId]
```

Board

```
/workspace/[workspaceId]/board/[boardId]
```

Future

```
/workspace/[workspaceId]/templates/[templateId]
```

Dynamic segments should represent unique resource identifiers.

---

# 8. Nested Layouts

```
Root Layout

↓

Dashboard Layout

↓

Workspace Layout

↓

Board Layout

↓

Page
```

Each layout provides shared UI such as navigation bars, sidebars, breadcrumbs, and providers.

---

# 9. Route Groups

Use route groups to organize application sections without affecting the URL.

Example:

```
(marketing)

(auth)

(dashboard)
```

This improves code organization while keeping clean URLs.

---

# 10. Middleware

Middleware responsibilities include:

- Authentication checks
- Authorization checks
- Redirect handling
- Route protection
- Request preprocessing

Protected routes should never be accessible without valid authentication.

---

# 11. Navigation Strategy

Primary navigation includes:

- Dashboard
- Workspaces
- Boards
- Notifications
- Settings

Secondary navigation is feature-specific and provided by nested layouts.

---

# 12. Loading States

Each major route should define loading UI using `loading.tsx`.

Loading indicators should be:

- Consistent
- Lightweight
- Non-blocking

---

# 13. Error Handling

Use route-level error boundaries with `error.tsx`.

Handle:

- Data loading failures
- Unexpected exceptions
- Permission errors

Provide clear recovery options for users.

---

# 14. Not Found Handling

Unknown routes should render `not-found.tsx`.

Examples:

- Invalid workspace ID
- Deleted board
- Unknown URL

Display a helpful message and navigation back to a valid page.

---

# 15. Route Naming

Guidelines:

- Use lowercase
- Use kebab-case where needed
- Keep URLs descriptive
- Avoid abbreviations

Examples:

```
/workspace

/board

/user-settings
```

---

# 16. API Routes

API endpoints are organized separately.

Example:

```
app/api/

auth/

workspaces/

boards/

comments/

notifications/

files/
```

API routes should mirror business features.

---

# 17. Future Enhancements

Future routing capabilities may include:

- Parallel Routes
- Intercepting Routes
- Organization-level routing
- AI assistant routes
- Plugin routes

The architecture should support these additions without restructuring.

---

# 18. Best Practices

- Keep layouts reusable.
- Use middleware for security.
- Avoid deeply nested URLs.
- Use dynamic routes only when necessary.
- Keep navigation predictable.
- Separate UI routes from API routes.

---

# 19. Conclusion

The SyncBoard routing architecture provides a scalable, secure, and maintainable navigation system using the Next.js App Router. By combining route groups, nested layouts, middleware, and dynamic routes, the application remains organized and ready for future expansion.

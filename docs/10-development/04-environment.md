# Environment Configuration

> **Project:** SyncBoard
> **Document:** Environment Configuration
> **Phase:** 10 - Development
> **Version:** 1.0

---

# 1. Overview

This document defines how environment variables are managed in SyncBoard.

The objectives are:

- Secure secret management
- Centralized configuration
- Environment isolation
- Easy deployment
- Production readiness

Environment variables should never be hardcoded into the application.

---

# 2. Environment Strategy

SyncBoard uses different environment files for different stages.

```
.env.example

.env.local

.env.development

.env.production
```

Purpose:

- `.env.example` → Template for contributors
- `.env.local` → Local development (ignored by Git)
- `.env.development` → Shared development configuration
- `.env.production` → Production deployment

---

# 3. Git Ignore

Ensure the following files are ignored:

```
.env

.env.local

.env.development

.env.production
```

Only commit:

```
.env.example
```

---

# 4. Create Environment Files

Project root:

```
syncboard/

├── .env.example
├── .env.local
└── ...
```

---

# 5. Application Variables

```env
NODE_ENV=development

NEXT_PUBLIC_APP_URL=http://localhost:3000

NEXT_PUBLIC_APP_NAME=SyncBoard
```

---

# 6. Database Variables

```env
DATABASE_URL=
```

Example:

```
postgresql://username:password@localhost:5432/syncboard
```

Do not commit real credentials.

---

# 7. Clerk Variables

```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=

CLERK_SECRET_KEY=
```

Optional:

```env
CLERK_WEBHOOK_SECRET=
```

---

# 8. Cloudinary Variables

```env
CLOUDINARY_CLOUD_NAME=

CLOUDINARY_API_KEY=

CLOUDINARY_API_SECRET=
```

---

# 9. Socket Configuration

```env
NEXT_PUBLIC_SOCKET_URL=http://localhost:3000
```

Future production example:

```
https://socket.syncboard.com
```

---

# 10. Feature Flags

Future feature toggles:

```env
ENABLE_AI=false

ENABLE_ANALYTICS=false

ENABLE_NOTIFICATIONS=true
```

Feature flags allow functionality to be enabled without code changes.

---

# 11. Logging Variables

```env
LOG_LEVEL=info
```

Possible values:

```
trace

debug

info

warn

error
```

---

# 12. Security Variables

Future secrets:

```env
JWT_SECRET=

ENCRYPTION_KEY=

WEBHOOK_SECRET=
```

These should never be exposed to the client.

---

# 13. Public vs Private Variables

Variables beginning with:

```
NEXT_PUBLIC_
```

are exposed to the browser.

Everything else remains server-only.

Example:

Public:

```env
NEXT_PUBLIC_APP_URL
```

Private:

```env
DATABASE_URL
```

Never expose secrets using `NEXT_PUBLIC_`.

---

# 14. Environment Validation

Create:

```
src/lib/env.ts
```

Use Zod to validate required variables.

Example:

```ts
import { z } from "zod";

export const envSchema = z.object({
  DATABASE_URL: z.string().url(),
  NEXT_PUBLIC_APP_URL: z.string().url(),
});
```

Validate during application startup to fail fast if configuration is missing.

---

# 15. Example .env.example

```env
NODE_ENV=development

NEXT_PUBLIC_APP_NAME=SyncBoard

NEXT_PUBLIC_APP_URL=http://localhost:3000

DATABASE_URL=

NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=

CLERK_SECRET_KEY=

CLOUDINARY_CLOUD_NAME=

CLOUDINARY_API_KEY=

CLOUDINARY_API_SECRET=

NEXT_PUBLIC_SOCKET_URL=http://localhost:3000
```

Use placeholders instead of real values.

---

# 16. Deployment Variables

Production platforms (Coolify, Vercel, etc.) should store variables using their built-in secret management systems.

Do not upload `.env.production` to the repository.

---

# 17. Common Issues

### Missing Environment Variable

Error:

```
undefined
```

Solution:

- Check `.env.local`
- Restart the development server
- Verify variable names

---

### Variable Not Available in Browser

Only variables prefixed with:

```
NEXT_PUBLIC_
```

are accessible on the client.

---

### Invalid Configuration

Validate all required variables using the environment schema before application startup.

---

# 18. Best Practices

- Never commit secrets.
- Rotate credentials periodically.
- Validate environment variables.
- Use descriptive names.
- Keep `.env.example` up to date.
- Use platform secret managers in production.

---

# 19. Verification Checklist

Before continuing:

- `.env.local` created
- `.env.example` created
- Database URL configured
- Clerk keys added
- Cloudinary keys added
- Environment validation implemented
- Development server starts successfully

---

# 20. Expected Outcome

At the end of this step:

- Environment files are properly organized.
- Sensitive values remain secure.
- Configuration is centralized and validated.
- The project is ready for authentication, database integration, and external services.

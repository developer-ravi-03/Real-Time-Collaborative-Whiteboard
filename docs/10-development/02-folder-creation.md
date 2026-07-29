# Folder Creation

> **Project:** SyncBoard
> **Document:** Folder Creation
> **Phase:** 10 - Development
> **Version:** 1.0

---

# 1. Overview

This document defines the official directory structure for SyncBoard.

The goals are:

- Feature-based organization
- Clear separation of concerns
- Easy scalability
- Predictable file locations
- Maintainable architecture

Every developer should follow this structure consistently.

---

# 2. High-Level Structure

```
syncboard/

├── docs/
├── public/
├── prisma/
├── scripts/
├── src/
├── tests/
├── .github/
├── package.json
├── tsconfig.json
├── next.config.ts
└── README.md
```

---

# 3. Source Directory

```
src/

├── app/
├── components/
├── features/
├── services/
├── repositories/
├── lib/
├── hooks/
├── store/
├── providers/
├── types/
├── utils/
├── constants/
├── validations/
├── config/
├── styles/
├── middleware/
└── generated/
```

---

# 4. App Directory

```
app/

├── (auth)/
├── (dashboard)/
├── api/
├── globals.css
├── layout.tsx
├── loading.tsx
├── error.tsx
├── not-found.tsx
└── page.tsx
```

Responsibilities:

- Routing
- Layouts
- Route Groups
- API Route Handlers
- Error boundaries
- Loading UI

Business logic should remain outside the `app` directory.

---

# 5. Components

```
components/

├── ui/
├── layout/
├── shared/
├── feedback/
├── forms/
└── icons/
```

Purpose:

- Reusable UI
- Shared components
- Generic layouts

No business logic.

---

# 6. Features

Organize by feature.

```
features/

workspace/
board/
task/
comment/
notification/
profile/
settings/
```

Each feature contains:

```
board/

components/

hooks/

services/

repository/

types/

schemas/

utils/
```

Everything related to one feature stays together.

---

# 7. Services

```
services/

auth/

storage/

socket/

email/

cache/

logger/
```

Responsibilities:

- Business services
- Third-party integrations
- Shared application logic

---

# 8. Repositories

```
repositories/

workspace/

board/

task/

user/
```

Responsibilities:

- Prisma queries
- Data access
- Database abstraction

No business logic.

---

# 9. Library

```
lib/

prisma.ts

cloudinary.ts

clerk.ts

socket.ts

auth.ts

env.ts
```

Contains singleton clients and shared integrations.

---

# 10. Hooks

```
hooks/

useDebounce.ts

useSocket.ts

useCurrentUser.ts

useTheme.ts
```

Reusable React hooks only.

---

# 11. Store

```
store/

ui.store.ts

theme.store.ts

notification.store.ts
```

Contains Zustand stores.

Server state belongs in TanStack Query, not Zustand.

---

# 12. Providers

```
providers/

ThemeProvider.tsx

QueryProvider.tsx

SocketProvider.tsx

ClerkProvider.tsx
```

Global React providers.

---

# 13. Types

```
types/

api.ts

auth.ts

board.ts

task.ts

user.ts
```

Shared TypeScript types and interfaces.

---

# 14. Utilities

```
utils/

formatDate.ts

generateSlug.ts

debounce.ts

download.ts
```

Pure utility functions with no side effects.

---

# 15. Constants

```
constants/

routes.ts

roles.ts

permissions.ts

limits.ts
```

Centralized application constants.

---

# 16. Validations

```
validations/

auth.ts

board.ts

task.ts
```

Zod schemas and validation logic.

---

# 17. Configuration

```
config/

app.ts

auth.ts

storage.ts

socket.ts
```

Centralized configuration modules.

Never access `process.env` directly outside this layer.

---

# 18. Styles

```
styles/

globals.css

animations.css

variables.css
```

Global styling resources.

Component-specific styles should remain within components when needed.

---

# 19. Middleware

```
middleware/

auth.ts

permissions.ts

rateLimit.ts
```

Shared middleware logic used across the application.

---

# 20. Generated

```
generated/

prisma/

types/
```

Contains generated code.

Never edit generated files manually.

---

# 21. Testing

```
tests/

unit/

integration/

e2e/

fixtures/

mocks/
```

Keep production code separate from test code.

---

# 22. Scripts

```
scripts/

seed.ts

cleanup.ts

migrate.ts
```

Automation and maintenance scripts.

---

# 23. Public Assets

```
public/

images/

icons/

fonts/

favicon.ico
```

Static assets only.

---

# 24. Best Practices

- Group code by feature whenever possible.
- Keep shared code inside dedicated shared directories.
- Avoid deeply nested folders.
- Do not mix UI with business logic.
- Keep imports predictable.
- Delete unused files promptly.

---

# 25. Verification Checklist

Before proceeding:

- All top-level folders created
- Source directories match this structure
- Feature modules organized consistently
- Shared utilities separated
- No business logic inside UI components
- No generated files modified manually

---

# 26. Expected Outcome

After completing this step, the SyncBoard project will have a clean, scalable, and production-ready directory structure that supports modular development and aligns with the architectural decisions made in earlier phases.

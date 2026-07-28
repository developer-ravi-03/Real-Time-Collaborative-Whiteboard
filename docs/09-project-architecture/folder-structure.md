# Folder Structure

> **Project:** SyncBoard
> **Document:** Folder Structure
> **Version:** 1.0

---

# 1. Overview

This document defines the directory structure of the SyncBoard project.

The project follows a **feature-first architecture**, where related files are grouped by business feature instead of file type. This improves maintainability, scalability, and team collaboration.

---

# 2. Architecture Principles

The folder structure follows these principles:

- Feature-first organization
- Separation of concerns
- High cohesion
- Low coupling
- Reusable shared modules
- Clear naming conventions
- Easy scalability

---

# 3. Root Directory

```
syncboard/
│
├── app/
├── components/
├── features/
├── lib/
├── hooks/
├── providers/
├── services/
├── repositories/
├── prisma/
├── public/
├── styles/
├── types/
├── utils/
├── validations/
├── middleware.ts
├── package.json
├── tsconfig.json
└── next.config.ts
```

---

# 4. App Directory

```
app/
│
├── (auth)/
├── (dashboard)/
├── api/
├── layout.tsx
├── page.tsx
├── loading.tsx
├── error.tsx
├── not-found.tsx
└── globals.css
```

Responsibilities:

- Routing
- Layouts
- Server Components
- Route Handlers

---

# 5. Components

```
components/
│
├── ui/
├── common/
├── layouts/
├── forms/
├── feedback/
├── navigation/
└── canvas/
```

Contains reusable UI components shared across features.

---

# 6. Features

```
features/
│
├── auth/
├── users/
├── workspaces/
├── boards/
├── canvas/
├── comments/
├── notifications/
├── files/
├── search/
└── settings/
```

Each feature contains:

```
feature-name/
│
├── components/
├── hooks/
├── services/
├── repository/
├── validations/
├── types/
├── utils/
└── index.ts
```

---

# 7. Services

```
services/
│
├── auth/
├── board/
├── workspace/
├── canvas/
├── notification/
└── file/
```

Responsibilities:

- Business logic
- Cross-feature operations
- Transaction coordination

---

# 8. Repositories

```
repositories/
│
├── auth.repository.ts
├── board.repository.ts
├── workspace.repository.ts
├── user.repository.ts
└── comment.repository.ts
```

Responsibilities:

- Database access
- Prisma queries
- CRUD operations

Repositories must never contain business logic.

---

# 9. Prisma

```
prisma/
│
├── schema.prisma
├── migrations/
└── seed.ts
```

Responsibilities:

- Database schema
- Migrations
- Seeding

---

# 10. Hooks

```
hooks/
│
├── useAuth.ts
├── useSocket.ts
├── useDebounce.ts
├── useTheme.ts
└── useMediaQuery.ts
```

Contains reusable React hooks.

---

# 11. Providers

```
providers/
│
├── QueryProvider.tsx
├── ClerkProvider.tsx
├── ThemeProvider.tsx
└── SocketProvider.tsx
```

Contains global application providers.

---

# 12. Utilities

```
utils/
│
├── date.ts
├── string.ts
├── format.ts
├── constants.ts
└── helpers.ts
```

Pure utility functions without business logic.

---

# 13. Types

```
types/
│
├── api.ts
├── auth.ts
├── board.ts
├── canvas.ts
└── user.ts
```

Shared TypeScript definitions.

---

# 14. Validations

```
validations/
│
├── auth.ts
├── board.ts
├── workspace.ts
└── comment.ts
```

Contains shared Zod schemas.

---

# 15. Public

```
public/
│
├── icons/
├── images/
├── fonts/
└── favicon.ico
```

Static assets served directly.

---

# 16. Naming Conventions

Folders:

- kebab-case

Files:

- PascalCase for React components
- camelCase for utilities
- kebab-case for route folders

Examples:

```
BoardCard.tsx
useBoard.ts
board.repository.ts
board.service.ts
```

---

# 17. Import Rules

Preferred:

- Absolute imports
- Path aliases
- Barrel exports where appropriate

Avoid:

- Deep relative imports
- Circular dependencies

---

# 18. Scalability

The folder structure supports:

- New features
- Shared modules
- Microservices (future)
- Plugin architecture
- AI integrations

without major restructuring.

---

# 19. Best Practices

- Keep features isolated.
- Share only reusable code.
- Avoid duplicated utilities.
- Keep components focused.
- Limit folder nesting.
- Export through index files where appropriate.

---

# 20. Conclusion

This folder structure provides a clear, scalable, and maintainable foundation for SyncBoard. By organizing the project around business features and well-defined layers, developers can build, test, and extend the application efficiently as it evolves.

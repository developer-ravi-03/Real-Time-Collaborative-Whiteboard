# Installation

> **Project:** SyncBoard
> **Document:** Installation
> **Phase:** 10 - Development
> **Version:** 1.0

---

# 1. Overview

This document describes every dependency required to develop SyncBoard.

The goal is to install all packages in a structured manner while keeping the project organized and avoiding unnecessary dependencies.

Dependencies are grouped by purpose so they can be maintained easily.

---

# 2. Objectives

After completing this document, the project should have:

- Next.js installed
- TypeScript configured
- Tailwind CSS configured
- shadcn/ui installed
- Prisma configured
- Clerk installed
- Zustand installed
- TanStack Query installed
- Socket.IO installed
- React Hook Form configured
- Zod configured
- Framer Motion installed
- Cloudinary SDK installed

---

# 3. Installation Strategy

Install packages in the following order:

1. Core Framework
2. UI Libraries
3. Form Handling
4. State Management
5. Database
6. Authentication
7. Realtime
8. File Upload
9. Utility Packages
10. Developer Tools

Installing dependencies in a logical order makes troubleshooting easier.

---

# 4. Core Framework

These packages should already exist after creating the project.

```bash
npm install next react react-dom
```

Development dependencies:

```bash
npm install -D typescript @types/react @types/node
```

Verify:

```bash
npm list next react
```

---

# 5. UI Libraries

## Tailwind CSS

Already installed by Create Next App.

Verify:

```bash
npm list tailwindcss
```

---

## shadcn/ui

Initialize:

```bash
npx shadcn@latest init
```

Recommended options:

```
Style            → Default
Base Color       → Slate
CSS Variables    → Yes
React Server Components → Yes
```

Install common components:

```bash
npx shadcn@latest add button
npx shadcn@latest add input
npx shadcn@latest add card
npx shadcn@latest add dialog
npx shadcn@latest add dropdown-menu
npx shadcn@latest add avatar
npx shadcn@latest add sheet
npx shadcn@latest add toast
```

---

## Icons

```bash
npm install lucide-react
```

---

## Animation

```bash
npm install framer-motion
```

---

# 6. Form Handling

Install:

```bash
npm install react-hook-form
```

Validation:

```bash
npm install zod
```

Resolver:

```bash
npm install @hookform/resolvers
```

---

# 7. State Management

Install Zustand:

```bash
npm install zustand
```

Install TanStack Query:

```bash
npm install @tanstack/react-query
```

Developer tools:

```bash
npm install @tanstack/react-query-devtools
```

---

# 8. Database

Install Prisma:

```bash
npm install prisma @prisma/client
```

Initialize:

```bash
npx prisma init
```

---

# 9. Authentication

Install Clerk:

```bash
npm install @clerk/nextjs
```

Future packages (optional):

```bash
npm install svix
```

---

# 10. Realtime Communication

Server:

```bash
npm install socket.io
```

Client:

```bash
npm install socket.io-client
```

---

# 11. File Upload

Install Cloudinary SDK:

```bash
npm install cloudinary
```

---

# 12. Utility Packages

Environment validation:

```bash
npm install dotenv
```

Date utilities:

```bash
npm install date-fns
```

Unique IDs:

```bash
npm install uuid
```

Class merging:

```bash
npm install clsx tailwind-merge
```

Conditional class utility:

```bash
npm install class-variance-authority
```

---

# 13. Developer Tools

Type definitions:

```bash
npm install -D @types/uuid
```

Environment typing:

```bash
npm install -D @types/node
```

---

# 14. Optional Packages

These will be introduced when required:

Caching:

```bash
npm install redis
```

Background jobs:

```bash
npm install inngest
```

Analytics:

```bash
npm install @vercel/analytics
```

Monitoring:

```bash
npm install @sentry/nextjs
```

Do not install optional packages until the corresponding module is implemented.

---

# 15. Verify Installation

Run:

```bash
npm ls
```

Ensure there are no missing dependencies.

Run:

```bash
npm run dev
```

The application should start without errors.

---

# 16. package.json Review

Verify that:

- Dependencies are grouped logically.
- No duplicate packages exist.
- No unused packages are installed.
- Version conflicts are resolved.

---

# 17. Common Issues

### Dependency conflict

Delete:

```text
node_modules
package-lock.json
```

Then reinstall:

```bash
npm install
```

---

### Prisma initialization fails

Verify:

- Node.js version
- Internet connection
- Write permissions

Then retry:

```bash
npx prisma init
```

---

### shadcn initialization fails

Ensure:

- Tailwind CSS is configured
- TypeScript is enabled
- App Router is enabled

---

### React Query DevTools warning

Only enable DevTools in development.

Do not include them in production builds.

---

# 18. Best Practices

- Install only required packages.
- Keep dependencies updated.
- Remove unused packages regularly.
- Prefer official libraries.
- Review package licenses before adding new dependencies.

---

# 19. Verification Checklist

Before continuing:

- Core framework installed
- Tailwind CSS verified
- shadcn/ui initialized
- Prisma initialized
- Clerk installed
- Zustand installed
- TanStack Query installed
- Socket.IO installed
- Cloudinary installed
- Development server runs successfully

---

# 20. Expected Outcome

At the end of this step, SyncBoard will have all essential libraries required for frontend, backend, authentication, database access, realtime collaboration, form handling, validation, state management, and file uploads.

The project is now ready for environment configuration in the next phase.

# Coding Standards

> **Project:** SyncBoard
> **Document:** Coding Standards
> **Version:** 1.0

---

# 1. Overview

This document defines the coding standards for the SyncBoard project.

The objectives are:

- Consistent code style
- High readability
- Maintainability
- Scalability
- Easy collaboration
- Production-ready quality

Every contributor should follow these standards.

---

# 2. General Principles

Follow these principles:

- Write readable code
- Keep functions small
- Prefer composition over inheritance
- Avoid duplication (DRY)
- Follow SOLID principles
- Keep business logic separate from UI

Code should be written for humans first and machines second.

---

# 3. TypeScript Standards

Always:

- Enable strict mode
- Avoid `any`
- Prefer interfaces for object contracts
- Use type aliases where appropriate
- Type every function parameter
- Type every return value for public APIs

Example:

```ts
interface Board {
  id: string;
  title: string;
}
```

---

# 4. Naming Conventions

### Components

PascalCase

```
BoardCard.tsx
WorkspaceSidebar.tsx
CommentPanel.tsx
```

### Hooks

camelCase

```
useBoard.ts
useCanvas.ts
```

### Utilities

camelCase

```
formatDate.ts
generateSlug.ts
```

### Constants

UPPER_SNAKE_CASE

```
MAX_UPLOAD_SIZE
DEFAULT_PAGE_SIZE
```

### Variables

camelCase

```
workspaceId
currentUser
```

---

# 5. File Organization

Feature-first organization.

```
features/

board/

components/

hooks/

services/

repository/

types/

utils/

validations/
```

Related files should remain together.

---

# 6. React Standards

Prefer:

- Functional Components
- Server Components by default
- Client Components only when necessary
- Composition
- Custom Hooks

Avoid:

- Large components
- Deep prop drilling
- Unnecessary state

---

# 7. Next.js Standards

Use:

- App Router
- Route Groups
- Nested Layouts
- Server Actions (when appropriate)
- Route Handlers

Prefer server-side rendering unless client interactivity is required.

---

# 8. State Management

Use:

React State

- Local component state

Zustand

- UI state

TanStack Query

- Server state

Socket.IO

- Realtime state

Never duplicate the same state across multiple stores.

---

# 9. API Standards

API endpoints should:

- Be RESTful
- Return consistent responses
- Use proper HTTP status codes
- Validate requests with Zod

Response format:

```json
{
  "success": true,
  "data": {}
}
```

Error format:

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human readable message"
  }
}
```

---

# 10. Service Layer Standards

Services should:

- Contain business logic
- Remain framework-independent
- Be testable
- Use repositories only

Avoid HTTP-specific code.

---

# 11. Repository Standards

Repositories should:

- Use Prisma only
- Return typed results
- Avoid business logic
- Keep queries efficient

One repository per entity.

---

# 12. Error Handling

Always:

- Throw custom errors
- Handle errors centrally
- Log server-side failures
- Return safe client responses

Never expose internal stack traces to users.

---

# 13. Logging

Log:

- Important business events
- Security events
- Performance issues
- Errors

Do not log:

- Passwords
- Tokens
- Secrets
- Personal sensitive data

---

# 14. Comments

Write comments only when necessary.

Prefer self-explanatory code.

Good comments explain:

- Why
- Business rules
- Complex algorithms

Avoid comments that merely repeat the code.

---

# 15. Documentation

Every major module should include:

- Purpose
- Public API
- Usage examples
- Important constraints

Keep documentation synchronized with implementation.

---

# 16. Git Workflow

Branch naming:

```
feature/board-sharing

bugfix/socket-reconnect

refactor/service-layer

docs/api-design
```

Commit message format:

```
feat: add board duplication

fix: resolve socket reconnect issue

docs: update API documentation

refactor: simplify board service
```

Follow Conventional Commits.

---

# 17. Code Review Checklist

Reviewers should verify:

- Correctness
- Readability
- Performance
- Security
- Accessibility
- Test coverage
- Documentation updates

Every pull request should receive at least one review before merging.

---

# 18. Formatting

Use:

- ESLint
- Prettier

Automate formatting with:

- Husky
- lint-staged

Code should pass all linting and formatting checks before commit.

---

# 19. Testing Standards

New features should include:

- Unit tests
- Integration tests (where applicable)
- Updated end-to-end tests for user-facing behavior

Bug fixes should include regression tests whenever possible.

---

# 20. Security Standards

Always:

- Validate input
- Sanitize output where necessary
- Authorize protected actions
- Use environment variables for secrets
- Follow least privilege

Security is everyone's responsibility.

---

# 21. Performance Standards

Before merging:

- Avoid unnecessary re-renders
- Check bundle impact
- Optimize queries
- Review caching opportunities

Measure before optimizing.

---

# 22. Accessibility Standards

Every UI component should support:

- Keyboard navigation
- Visible focus states
- Semantic HTML
- Appropriate ARIA attributes
- Sufficient color contrast

Accessibility should be considered during development, not added later.

---

# 23. Best Practices

- Keep code simple.
- Prefer readability over cleverness.
- Reuse existing utilities.
- Write meaningful names.
- Test business logic.
- Document architectural decisions.

---

# 24. Future Enhancements

Future improvements include:

- Automated architecture validation
- AI-assisted code reviews
- Stricter lint rules
- Performance budget enforcement
- Automated accessibility testing

---

# 25. Conclusion

The SyncBoard coding standards establish a consistent engineering foundation for the project. Following these guidelines ensures that the codebase remains clean, maintainable, secure, and scalable as the application evolves.

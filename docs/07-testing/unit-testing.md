# Unit Testing

> **Project:** SyncBoard
> **Document:** Unit Testing
> **Version:** 1.0

---

# 1. Overview

Unit testing verifies the smallest testable parts of the application in complete isolation.

A unit may include:

- Utility functions
- React components
- Custom hooks
- Services
- Validators
- Business logic
- Socket event handlers

The objective is to ensure every unit behaves correctly regardless of the rest of the application.

---

# 2. Objectives

Unit tests should:

- Verify business logic
- Prevent regressions
- Document expected behavior
- Enable safe refactoring
- Execute quickly
- Remain independent

---

# 3. Testing Stack

| Purpose           | Tool                  |
| ----------------- | --------------------- |
| Test Runner       | Vitest                |
| Assertions        | Vitest                |
| Component Testing | React Testing Library |
| Mocking           | vi.mock()             |
| API Mocking       | MSW                   |
| Coverage          | @vitest/coverage-v8   |

---

# 4. Folder Structure

Tests should be colocated with the code they verify.

Example:

```

src/
features/
boards/
components/
BoardCard.tsx
BoardCard.test.tsx

services/
board.service.ts
board.service.test.ts

hooks/
useBoard.ts
useBoard.test.ts

utils/
date.ts
date.test.ts

```

---

# 5. Naming Convention

Component Tests

```

ComponentName.test.tsx

```

Hook Tests

```

useHookName.test.ts

```

Utility Tests

```

functionName.test.ts

```

Service Tests

```

serviceName.test.ts

```

---

# 6. What Should Be Unit Tested

## Utilities

Examples:

- Date formatting
- Validation helpers
- String formatting
- Permission helpers

---

## React Components

Verify:

- Rendering
- Props
- User interactions
- Disabled states
- Loading states
- Error states

---

## Custom Hooks

Verify:

- Initial state
- State updates
- Side effects
- Cleanup

---

## Services

Verify:

- Business logic
- Data transformation
- Validation
- Error handling

Database access should be mocked.

---

## Validation Schemas

Every Zod schema should be tested for:

- Valid input
- Invalid input
- Edge cases

---

## Socket Handlers

Verify:

- Event validation
- Authorization
- Payload processing
- Error responses

Socket connections should be mocked.

---

# 7. Mocking Strategy

Mock external dependencies only.

Examples:

- Database
- Cloudinary
- Clerk
- Socket.IO
- Fetch requests
- Browser APIs

Avoid mocking internal business logic unless necessary.

---

# 8. Test Structure

Every unit test should follow the **AAA Pattern**.

Arrange

Prepare required data and mocks.

Act

Execute the functionality.

Assert

Verify the expected outcome.

---

# 9. Test Naming

Use descriptive names.

Good:

```

should create a new board successfully

```

```

should reject invalid workspace id

```

Bad:

```

test board

```

```

works correctly

```

---

# 10. Coverage Goals

Minimum targets:

| Area       | Target |
| ---------- | ------ |
| Utilities  | 95%    |
| Services   | 90%    |
| Hooks      | 90%    |
| Components | 80%    |
| Validators | 100%   |

Overall project target:

```

90%+

```

Coverage should be viewed as a quality indicator, not the primary objective.

---

# 11. Best Practices

- Test behavior instead of implementation details.
- Keep each test independent.
- Avoid shared mutable state.
- Prefer real user interactions over internal method calls.
- Keep tests small and focused.
- One logical assertion per test when practical.

---

# 12. Anti-Patterns

Avoid:

- Testing third-party libraries
- Testing framework internals
- Overusing mocks
- Snapshot testing for dynamic UI
- Large, multi-purpose tests

---

# 13. Continuous Integration

All unit tests must run automatically during CI.

Requirements:

- No failing tests
- Coverage threshold satisfied
- Fast execution (<2 minutes preferred)

Pull requests must not be merged if unit tests fail.

---

# 14. Future Enhancements

Future improvements may include:

- Mutation testing
- Visual component testing
- AI-assisted test generation

---

# 15. Conclusion

Unit testing forms the foundation of SyncBoard's testing strategy. By thoroughly testing individual units in isolation, the project maintains high reliability, simplifies refactoring, and reduces the likelihood of defects reaching production.

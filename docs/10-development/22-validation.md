# Validation

> **Project:** SyncBoard
> **Document:** Validation
> **Phase:** 10 - Development
> **Version:** 1.0

---

# 1. Overview

This document defines the validation standards for SyncBoard.

Validation ensures:

- Correct data
- Secure inputs
- Consistent API behavior
- Reliable business logic
- Improved developer experience

All validation should be centralized, reusable, and type-safe using Zod.

---

# 2. Objectives

After implementing this module, SyncBoard should provide:

- Shared validation schemas
- Client-side validation
- Server-side validation
- Socket event validation
- Environment validation
- Custom validators
- Standardized validation errors

---

# 3. Architecture

```
Client Input

↓

React Hook Form

↓

Zod Schema

↓

API

↓

Zod Validation

↓

Service

↓

Repository

↓

Database
```

Every external input must be validated before business logic executes.

---

# 4. Folder Structure

```
src/

validations/

auth/

workspace/

board/

shape/

comment/

notification/

search/

settings/

file/

common/

index.ts
```

Each feature owns its validation schemas.

---

# 5. Validation Layers

Validation occurs at multiple layers:

```
Frontend

↓

API

↓

Socket Events

↓

Environment Variables

↓

Database Constraints
```

Each layer serves a different purpose and complements the others.

---

# 6. Client-Side Validation

Use:

- React Hook Form
- Zod Resolver

Validate:

- Required fields
- Input length
- Formats
- User-friendly constraints

Provide immediate feedback without waiting for the server.

---

# 7. Server-Side Validation

Every API route validates:

- Request body
- Route parameters
- Query parameters
- Headers (when required)

Never trust client-side validation alone.

---

# 8. Socket Validation

Validate every socket payload before processing.

Examples:

```
shape:create

shape:update

comment:create

cursor:move

notification:read
```

Reject invalid events before reaching services.

---

# 9. Environment Validation

Validate all environment variables during startup.

Examples:

```
DATABASE_URL

CLERK_SECRET_KEY

JWT_SECRET

CLOUDINARY_API_KEY

NEXT_PUBLIC_APP_URL
```

Fail fast if required configuration is missing.

---

# 10. Common Validation Rules

Examples:

Strings

- Required
- Minimum length
- Maximum length
- Trim whitespace

Numbers

- Minimum value
- Maximum value
- Positive only

Arrays

- Maximum items
- Unique elements

Dates

- Valid date
- Future/Past checks where applicable

---

# 11. Authentication Validation

Validate:

- Email
- Session token
- User ID
- Role
- Invitation token

Authentication-specific validation should remain separate from business validation.

---

# 12. Workspace Validation

Validate:

- Workspace name
- Description
- Visibility
- Member limits

Example rules:

Workspace Name

```
Minimum: 3 characters

Maximum: 100 characters
```

---

# 13. Board Validation

Validate:

- Title
- Description
- Visibility
- Favorite status

Board titles should not be empty after trimming whitespace.

---

# 14. Shape Validation

Validate:

- Coordinates
- Width
- Height
- Rotation
- Color
- Layer index

Prevent invalid canvas state before persistence.

---

# 15. Comment Validation

Validate:

- Content
- Attachments
- Mentions

Comments containing only whitespace should be rejected.

---

# 16. File Validation

Validate:

- MIME type
- Extension
- File size
- Filename
- Upload limits

Reject unsupported file types before upload.

---

# 17. Search Validation

Validate:

- Query length
- Filters
- Sorting options
- Pagination

Limit excessively long search queries.

---

# 18. Custom Validators

Reusable validators:

```
Email

UUID

Slug

Hex Color

URL

Timezone

Language Code
```

Centralize custom validators to avoid duplication.

---

# 19. Error Formatting

Use a consistent error format.

Example:

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Board title is required.",
    "field": "title"
  }
}
```

Avoid exposing internal implementation details.

---

# 20. Security

- Sanitize user input.
- Trim unnecessary whitespace.
- Reject unknown fields where appropriate.
- Limit payload sizes.
- Validate before authorization checks when possible.

Validation is the first layer of defense, not the only one.

---

# 21. Performance

Optimize by:

- Reusing schemas
- Avoiding duplicate validation
- Validating only changed fields during updates
- Using shared schema composition

Keep validation fast and deterministic.

---

# 22. Testing

Verify:

- Valid input
- Invalid input
- Missing fields
- Boundary values
- Large payloads
- File validation
- Socket payload validation
- Environment validation

Include both positive and negative test cases.

---

# 23. Best Practices

- Define schemas close to their feature.
- Reuse common validators.
- Share schemas between frontend and backend when possible.
- Keep validation declarative.
- Return consistent error messages.
- Avoid business logic inside validation schemas.

---

# 24. Verification Checklist

Before proceeding:

- Validation folders created
- Shared schemas implemented
- React Hook Form integrated
- API validation working
- Socket validation implemented
- Environment validation verified
- Error formatting standardized
- Tests passing

---

# 25. Expected Outcome

At the end of this module:

- Every input entering SyncBoard is validated consistently.
- Validation logic is reusable across frontend, backend, and realtime communication.
- Errors are predictable and user-friendly.
- The project is ready to establish comprehensive testing standards.

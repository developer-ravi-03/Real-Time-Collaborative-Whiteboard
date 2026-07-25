# API Response Format

> **Project:** SyncBoard
> **Document:** API Response Format
> **Version:** 1.0
> **API Version:** v1

---

# 1. Overview

This document defines the standard response structure for all SyncBoard REST APIs.

Every endpoint must return a consistent JSON structure regardless of success or failure.

Goals:

- Consistency
- Predictability
- Easy frontend integration
- Better debugging
- Standardized error handling

---

# 2. General Response Structure

Every response follows this structure:

```json
{
  "success": true,
  "message": "Operation completed successfully.",
  "data": {},
  "meta": {},
  "errors": null
}
```

---

# 3. Response Fields

| Field   | Type                    | Required | Description                             |
| ------- | ----------------------- | -------- | --------------------------------------- |
| success | boolean                 | Yes      | Indicates whether the request succeeded |
| message | string                  | Yes      | Human-readable message                  |
| data    | object \| array \| null | Yes      | Requested resource(s)                   |
| meta    | object                  | Optional | Pagination or additional metadata       |
| errors  | object \| array \| null | Yes      | Validation or business errors           |

---

# 4. Successful Response

## Example

```json
{
  "success": true,
  "message": "Workspace created successfully.",
  "data": {
    "id": "7d8f7f7b-3d5e-4b7a-8f8d-a5d6d5e9d2b1",
    "name": "Product Team"
  },
  "meta": {},
  "errors": null
}
```

---

# 5. Collection Response

When returning multiple resources:

```json
{
  "success": true,
  "message": "Boards fetched successfully.",
  "data": [
    {
      "id": "board_1",
      "name": "Sprint Planning"
    },
    {
      "id": "board_2",
      "name": "Design Review"
    }
  ],
  "meta": {},
  "errors": null
}
```

---

# 6. Pagination Response

Paginated endpoints include metadata.

Example:

```json
{
  "success": true,
  "message": "Boards fetched successfully.",
  "data": [...],
  "meta": {
    "page": 1,
    "limit": 20,
    "totalItems": 154,
    "totalPages": 8,
    "hasNextPage": true,
    "hasPreviousPage": false
  },
  "errors": null
}
```

---

# 7. Empty Response

If no data exists:

```json
{
  "success": true,
  "message": "No boards found.",
  "data": [],
  "meta": {},
  "errors": null
}
```

---

# 8. Create Response

HTTP Status

```
201 Created
```

Example

```json
{
  "success": true,
  "message": "Board created successfully.",
  "data": {
    "id": "board_uuid",
    "name": "New Board"
  },
  "meta": {},
  "errors": null
}
```

---

# 9. Update Response

HTTP Status

```
200 OK
```

Example

```json
{
  "success": true,
  "message": "Board updated successfully.",
  "data": {
    "id": "board_uuid",
    "name": "Updated Board"
  },
  "meta": {},
  "errors": null
}
```

---

# 10. Delete Response

HTTP Status

```
204 No Content
```

For `204 No Content`, no response body should be returned.

If a response body is required, use:

```
200 OK
```

Example:

```json
{
  "success": true,
  "message": "Board deleted successfully.",
  "data": null,
  "meta": {},
  "errors": null
}
```

---

# 11. Validation Error Response

HTTP Status

```
400 Bad Request
```

Example

```json
{
  "success": false,
  "message": "Validation failed.",
  "data": null,
  "meta": {},
  "errors": [
    {
      "field": "name",
      "message": "Board name is required."
    }
  ]
}
```

---

# 12. Unauthorized Response

HTTP Status

```
401 Unauthorized
```

```json
{
  "success": false,
  "message": "Authentication required.",
  "data": null,
  "meta": {},
  "errors": null
}
```

---

# 13. Forbidden Response

HTTP Status

```
403 Forbidden
```

```json
{
  "success": false,
  "message": "You do not have permission to perform this action.",
  "data": null,
  "meta": {},
  "errors": null
}
```

---

# 14. Not Found Response

HTTP Status

```
404 Not Found
```

```json
{
  "success": false,
  "message": "Board not found.",
  "data": null,
  "meta": {},
  "errors": null
}
```

---

# 15. Conflict Response

HTTP Status

```
409 Conflict
```

Example:

```json
{
  "success": false,
  "message": "Workspace name already exists.",
  "data": null,
  "meta": {},
  "errors": null
}
```

---

# 16. Internal Server Error

HTTP Status

```
500 Internal Server Error
```

```json
{
  "success": false,
  "message": "Something went wrong.",
  "data": null,
  "meta": {},
  "errors": null
}
```

---

# 17. Error Object Structure

Validation errors use:

```json
{
  "field": "email",
  "message": "Email is invalid."
}
```

Business logic errors may include:

```json
{
  "code": "WORKSPACE_LIMIT_EXCEEDED",
  "message": "Workspace limit reached."
}
```

---

# 18. Metadata Structure

The `meta` object may contain:

- Pagination
- Sorting
- Filtering
- Search information
- Processing time
- Request ID

Example

```json
{
  "page": 1,
  "limit": 20,
  "totalItems": 100,
  "totalPages": 5,
  "requestId": "req_123456789"
}
```

---

# 19. Response Rules

All APIs must:

- Return valid JSON.
- Use UTF-8 encoding.
- Return correct HTTP status codes.
- Include `message`.
- Include `success`.
- Never expose stack traces.
- Never expose SQL queries.
- Never expose sensitive information.

---

# 20. Future Extensions

The response format is designed to support:

- Cursor-based pagination
- API version metadata
- Trace IDs
- Performance metrics
- Localization
- Partial success responses

---

# 21. Conclusion

A consistent response format improves maintainability, simplifies frontend integration, and provides predictable behavior across the SyncBoard platform. Every API endpoint must comply with this specification.

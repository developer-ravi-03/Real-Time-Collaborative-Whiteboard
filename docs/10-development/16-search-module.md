# Search

> **Project:** SyncBoard
> **Document:** Search
> **Phase:** 10 - Development
> **Version:** 1.0

---

# 1. Overview

The Search Module provides a centralized search experience across the entire SyncBoard application.

Users should be able to quickly find:

- Workspaces
- Boards
- Users
- Comments
- Uploaded Files
- Shapes (future)
- Templates (future)

The search system should be fast, secure, and permission-aware.

---

# 2. Objectives

After implementing this module, users should be able to:

- Perform global search
- Search within a workspace
- Search boards
- Search comments
- Search uploaded files
- Search users
- Filter results
- Sort results
- View recent searches
- Receive autocomplete suggestions

---

# 3. Architecture

```
Search Input

↓

Search API

↓

Search Service

↓

Repositories

↓

Database

↓

Filtered Results

↓

Search UI
```

---

# 4. Search Scope

Global Search includes:

```
Workspaces

Boards

Users

Comments

Files
```

Workspace Search includes:

```
Boards

Members

Comments

Files
```

---

# 5. Search Flow

```
User Types Query

↓

Validate Input

↓

Normalize Query

↓

Execute Search

↓

Filter Results

↓

Rank Results

↓

Return Response
```

---

# 6. Search Categories

Supported categories:

```
All

Workspaces

Boards

Users

Comments

Files
```

Future:

```
Shapes

Templates

Activity Logs
```

---

# 7. Search Filters

Allow filtering by:

- Workspace
- Board
- Creator
- Date
- File Type
- Role
- Status

Multiple filters may be combined.

---

# 8. Sorting

Support sorting by:

- Relevance
- Newest
- Oldest
- Alphabetical
- Recently Updated

Default sorting should prioritize relevance.

---

# 9. Full-Text Search

Enable full-text search for:

- Board titles
- Descriptions
- Comments
- File names
- User display names

Future enhancement:

- PostgreSQL Full-Text Search
- Elasticsearch / Meilisearch integration

---

# 10. Autocomplete

Display suggestions while typing.

Suggestions may include:

- Board names
- Workspace names
- User names
- Recent searches

Autocomplete should respond with minimal latency.

---

# 11. Recent Searches

Store per user:

```
id

userId

query

createdAt
```

Limit history to a configurable number (e.g., 10–20 searches).

---

# 12. Service Layer

SearchService responsibilities:

- Parse query
- Execute searches
- Merge results
- Rank relevance
- Apply filters
- Apply permissions

Business logic belongs here.

---

# 13. Repository Layer

Repositories provide search methods for:

- Workspace
- Board
- User
- Comment
- File

Each repository searches only its own entity.

---

# 14. API Endpoints

Global Search

```
GET /api/search
```

Autocomplete

```
GET /api/search/suggestions
```

Recent Searches

```
GET    /api/search/recent

DELETE /api/search/recent
```

---

# 15. Permissions

Every search result must respect access control.

Verify:

- Authentication
- Workspace membership
- Board permissions
- File visibility

Users should never see resources they cannot access.

---

# 16. Performance

Optimize by:

- Database indexes
- Pagination
- Debounced input
- Cached recent searches
- Cursor-based pagination
- Efficient ranking

Avoid scanning entire tables.

---

# 17. Search Ranking

Suggested priority:

1. Exact title matches
2. Prefix matches
3. Partial matches
4. Description matches
5. Comment content
6. File names

This improves perceived search quality.

---

# 18. Error Handling

Handle:

- Empty queries
- Invalid filters
- Excessive query length
- Database errors
- Unauthorized access

Return consistent API responses.

---

# 19. Security

- Validate search input with Zod.
- Sanitize queries.
- Rate-limit search requests.
- Prevent SQL injection.
- Enforce permission checks before returning results.

---

# 20. Testing

Verify:

- Global search
- Workspace search
- Board search
- User search
- Comment search
- File search
- Filters
- Sorting
- Autocomplete
- Permission enforcement

---

# 21. Best Practices

- Debounce client requests.
- Index searchable columns.
- Keep ranking logic centralized.
- Return only required fields.
- Highlight matched text in the UI.

---

# 22. Verification Checklist

Before proceeding:

- Search service implemented
- Repository search methods created
- Global search working
- Filters implemented
- Sorting implemented
- Autocomplete working
- Recent searches stored
- Permissions verified

---

# 23. Expected Outcome

At the end of this module:

- Users can quickly find relevant resources across SyncBoard.
- Search respects permissions and scales efficiently.
- Autocomplete and recent searches improve usability.
- The application is ready for implementing user settings and personalization.

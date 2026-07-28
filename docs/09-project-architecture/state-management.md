# State Management

> **Project:** SyncBoard
> **Document:** State Management
> **Version:** 1.0

---

# 1. Overview

This document defines how application state is managed throughout SyncBoard.

The application uses different state management solutions based on the type of state being managed. No single library is used for every scenario.

This approach improves:

- Performance
- Scalability
- Maintainability
- Predictability

---

# 2. State Categories

SyncBoard manages four primary types of state:

- UI State
- Server State
- Authentication State
- Realtime Collaborative State

Each category has different requirements and therefore uses different tools.

---

# 3. State Management Stack

React Context

Purpose

- Global Providers
- Theme
- Authentication Context

---

Zustand

Purpose

- UI State
- Local Global State

---

TanStack Query

Purpose

- Server State
- API Cache
- Background Refetching

---

Socket.IO

Purpose

- Realtime Synchronization
- Presence
- Live Updates

---

# 4. React Context

Use React Context only for truly global state.

Examples:

- Theme
- Authentication Provider
- Query Provider
- Socket Provider

Avoid storing frequently changing data inside Context.

---

# 5. Zustand

Use Zustand for client-side UI state.

Examples:

- Sidebar state
- Modal visibility
- Active board
- Selected shape
- Drawing tool
- Zoom level
- Canvas preferences

Example Store

```
Canvas Store

↓

Selected Tool

Zoom

Grid Visibility

Selection

History Position
```

Do not store API responses inside Zustand.

---

# 6. TanStack Query

TanStack Query manages all server state.

Examples:

- Current user
- Workspace list
- Boards
- Comments
- Members
- Notifications
- Search results

Responsibilities:

- Fetching
- Caching
- Background refetching
- Optimistic updates
- Pagination
- Infinite queries

---

# 7. Socket.IO State

Socket.IO handles live synchronization.

Examples:

- Cursor movement
- Shape updates
- Comments
- Presence
- Notifications
- Typing indicators

Socket.IO should never replace database persistence.

---

# 8. State Flow

```
Database

↓

API

↓

TanStack Query

↓

UI

↓

Socket Event

↓

Realtime Update

↓

UI Refresh
```

---

# 9. Optimistic Updates

Use optimistic updates for:

- Creating comments
- Creating boards
- Renaming boards
- Deleting items
- Notifications

Rollback changes if the server rejects the request.

---

# 10. Cache Strategy

TanStack Query cache rules:

Workspace

5 minutes

Boards

5 minutes

Members

10 minutes

Notifications

1 minute

Search

30 seconds

Frequently changing data should have shorter cache durations.

---

# 11. Synchronization Rules

Socket events should:

- Update cache
- Avoid duplicate requests
- Merge server changes
- Resolve conflicts

Realtime events should never bypass application validation.

---

# 12. Loading States

Every async operation should support:

- Initial Loading
- Background Refetching
- Empty State
- Error State

Users should always receive visual feedback.

---

# 13. Error Handling

Handle:

- Network failures
- Authentication expiration
- Socket disconnection
- API validation errors

Recovery strategies include:

- Retry
- Reconnect
- Cache fallback
- User notification

---

# 14. Performance

Optimize state by:

- Minimizing re-renders
- Memoizing selectors
- Lazy loading stores
- Splitting state logically
- Avoiding unnecessary Context updates

---

# 15. Best Practices

- Store UI state in Zustand.
- Store server state in TanStack Query.
- Store realtime events in Socket.IO.
- Keep Context lightweight.
- Never duplicate the same state across multiple stores.
- Invalidate queries after successful mutations.

---

# 16. Future Enhancements

Future improvements may include:

- Offline synchronization
- Conflict resolution
- Local persistence
- Background synchronization
- Cross-device session recovery

---

# 17. Conclusion

SyncBoard uses a hybrid state management architecture where each tool is responsible for a specific category of state. This approach provides predictable behavior, efficient rendering, and excellent scalability while supporting realtime collaboration.

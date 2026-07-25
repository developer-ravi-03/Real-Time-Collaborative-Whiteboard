# Board Object APIs

> **Project:** SyncBoard
> **Document:** Board Object APIs
> **Version:** 1.0
> **API Version:** v1

---

# 1. Overview

Board Objects are the visual elements placed on a board's infinite canvas.

Every drawable or interactive element is represented as a Board Object.

Examples include:

- Sticky Notes
- Text
- Rectangles
- Circles
- Diamonds
- Lines
- Arrows
- Images
- Frames
- Connectors

Each object belongs to exactly one board.

---

# 2. Resource Hierarchy

Workspace
└── Board
└── Board Object

---

# 3. Supported Object Types

| Type        | Description       |
| ----------- | ----------------- |
| TEXT        | Text block        |
| STICKY_NOTE | Sticky note       |
| RECTANGLE   | Rectangle shape   |
| CIRCLE      | Circle shape      |
| DIAMOND     | Diamond shape     |
| TRIANGLE    | Triangle shape    |
| LINE        | Straight line     |
| ARROW       | Directional arrow |
| IMAGE       | Uploaded image    |
| FRAME       | Container frame   |
| CONNECTOR   | Object connector  |

Future object types may be added without breaking existing APIs.

---

# 4. Object Properties

Every object contains common properties:

- id
- boardId
- type
- x
- y
- width
- height
- rotation
- scale
- zIndex
- opacity
- locked
- hidden
- createdBy
- createdAt
- updatedAt

Type-specific properties are stored in the object's payload.

---

# 5. Permissions Matrix

| Action             | Owner | Editor | Viewer |
| ------------------ | :---: | :----: | :----: |
| View Objects       |  ✅   |   ✅   |   ✅   |
| Create Object      |  ✅   |   ✅   |   ❌   |
| Update Object      |  ✅   |   ✅   |   ❌   |
| Delete Object      |  ✅   |   ✅   |   ❌   |
| Lock/Unlock Object |  ✅   |   ✅   |   ❌   |
| Change Layer       |  ✅   |   ✅   |   ❌   |

---

# 6. Endpoint Summary

| Method | Endpoint                             | Purpose       |
| ------ | ------------------------------------ | ------------- |
| GET    | /boards/{boardId}/objects            | List objects  |
| POST   | /boards/{boardId}/objects            | Create object |
| GET    | /boards/{boardId}/objects/{objectId} | Get object    |
| PATCH  | /boards/{boardId}/objects/{objectId} | Update object |
| DELETE | /boards/{boardId}/objects/{objectId} | Delete object |
| POST   | /boards/{boardId}/objects/bulk       | Bulk create   |
| PATCH  | /boards/{boardId}/objects/bulk       | Bulk update   |
| DELETE | /boards/{boardId}/objects/bulk       | Bulk delete   |

---

# 7. Create Object

## Endpoint

POST /api/v1/boards/{boardId}/objects

### Authentication

Required

### Authorization

Owner or Editor

### Request Example

```json
{
  "type": "STICKY_NOTE",
  "position": {
    "x": 320,
    "y": 180
  },
  "size": {
    "width": 220,
    "height": 180
  },
  "payload": {
    "text": "Sprint Goal",
    "color": "#FDE68A"
  }
}
```

### Business Rules

- Object belongs to one board.
- Initial zIndex is assigned automatically.
- Activity log is generated.
- Object is immediately available for collaboration.

---

# 8. Get Board Objects

Endpoint

GET /api/v1/boards/{boardId}/objects

Returns

- Object list
- Total count
- Board version
- Last updated timestamp

Objects should be returned ordered by `zIndex`.

---

# 9. Update Object

Endpoint

PATCH /api/v1/boards/{boardId}/objects/{objectId}

Editable fields include:

- Position
- Size
- Rotation
- Payload
- Layer
- Lock state
- Visibility

---

# 10. Delete Object

Endpoint

DELETE /api/v1/boards/{boardId}/objects/{objectId}

Business Rules

- Permanently removes the object.
- Associated connectors are removed.
- Activity log entry is created.

---

# 11. Bulk Operations

## Bulk Create

POST /api/v1/boards/{boardId}/objects/bulk

## Bulk Update

PATCH /api/v1/boards/{boardId}/objects/bulk

## Bulk Delete

DELETE /api/v1/boards/{boardId}/objects/bulk

Bulk APIs reduce network requests when multiple objects are modified simultaneously.

---

# 12. Layer Management

Objects use `zIndex` for rendering order.

Supported operations:

- Bring to Front
- Send to Back
- Bring Forward
- Send Backward

The backend maintains consistent layer ordering.

---

# 13. Object Locking

Locked objects:

- Cannot be moved
- Cannot be resized
- Cannot be rotated
- Cannot be deleted by Editors

Owners can always unlock objects.

---

# 14. Validation Rules

General

- UUIDs must be valid.
- Coordinates must be finite numbers.
- Width and height must be greater than zero.
- Rotation must be between 0 and 360 degrees.
- Opacity must be between 0 and 1.

Payload validation depends on the object type.

---

# 15. Activity Logging

Generate logs for:

- Object Created
- Object Updated
- Object Deleted
- Object Locked
- Object Unlocked
- Layer Changed

---

# 16. Performance Considerations

- Batch object updates where possible.
- Lazy-load images.
- Use pagination only for extremely large boards (future).
- Return only required fields for list requests.
- Optimize Prisma queries with `select`.

---

# 17. Security Considerations

- Verify board membership.
- Validate object ownership within the board.
- Prevent cross-board access.
- Sanitize user-provided text.
- Validate uploaded image references.

---

# 18. Future Enhancements

- Group/Ungroup Objects
- Smart Alignment Guides
- Snapping
- Object Templates
- Object Linking
- AI-generated Objects
- Rich Text Editing
- Custom Shapes

---

# 19. Conclusion

The Board Object API defines the lifecycle of all visual elements on a board. It provides scalable CRUD operations, supports efficient bulk updates, and establishes the foundation for realtime collaboration, canvas rendering, and future advanced editing capabilities.

# Shapes Module

> **Project:** SyncBoard
> **Document:** Shapes Module
> **Phase:** 10 - Development
> **Version:** 1.0

---

# 1. Overview

The Shapes Module defines every drawable object that can exist on the SyncBoard canvas.

Each shape is an independent entity with its own properties, behaviors, lifecycle, and rendering logic.

This module provides:

- Shape creation
- Shape editing
- Shape transformation
- Shape deletion
- Layer ordering
- Grouping
- Locking
- Styling
- Serialization
- Realtime synchronization support

---

# 2. Objectives

After implementing this module, users should be able to:

- Draw shapes
- Move shapes
- Resize shapes
- Rotate shapes
- Duplicate shapes
- Delete shapes
- Lock shapes
- Group shapes
- Change styling
- Arrange layers
- Copy and paste shapes

---

# 3. Architecture

```
Canvas

↓

Shape Manager

↓

Shape Model

↓

Renderer

↓

Selection

↓

History

↓

Realtime Sync
```

---

# 4. Supported Shape Types

Initial implementation:

```
Rectangle

Ellipse

Circle

Line

Arrow

Diamond

Triangle

Text

Sticky Note

Image

Freehand Drawing
```

Future support:

```
Table

Code Block

Chart

Frame

Connector

Video

Mind Map Node
```

---

# 5. Base Shape Model

Every shape should contain:

```
id

boardId

type

x

y

width

height

rotation

zIndex

opacity

visible

locked

createdBy

createdAt

updatedAt
```

---

# 6. Shape Style

Supported styling properties:

```
Fill Color

Stroke Color

Stroke Width

Border Style

Opacity

Corner Radius

Shadow

Font Family

Font Size

Font Weight

Text Color
```

Each shape type may support a subset of these properties.

---

# 7. Shape Lifecycle

```
Create

↓

Render

↓

Select

↓

Edit

↓

Transform

↓

Save

↓

Delete
```

All state-changing operations should be recorded in history.

---

# 8. Shape Creation

Flow:

```
Select Tool

↓

Pointer Down

↓

Pointer Move

↓

Pointer Up

↓

Create Shape

↓

Render

↓

Persist
```

Shapes should receive a unique identifier immediately after creation.

---

# 9. Shape Selection

Support:

- Single Selection
- Multi Selection
- Drag Selection
- Shift Selection
- Ctrl/Cmd Selection
- Select All

Selection is maintained on the client and is not persisted.

---

# 10. Shape Transformation

Supported transformations:

- Move
- Resize
- Rotate
- Flip Horizontal
- Flip Vertical

Transformation should preserve shape integrity and respect aspect ratio when required.

---

# 11. Layer Management

Arrange shapes using:

```
Bring Forward

Send Backward

Bring To Front

Send To Back
```

Rendering order is determined by `zIndex`.

---

# 12. Grouping

Users should be able to:

- Group multiple shapes
- Ungroup shapes
- Move grouped shapes
- Style grouped shapes

Groups should preserve the relative positions of child shapes.

---

# 13. Locking

Locked shapes:

- Cannot move
- Cannot resize
- Cannot rotate
- Cannot be edited

Only authorized users may unlock them.

---

# 14. Copy & Paste

Support:

- Copy
- Cut
- Paste
- Duplicate

Duplicated shapes should:

- Receive new IDs
- Preserve styles
- Offset slightly to remain visible

---

# 15. Shape Serialization

Shapes should be serializable to JSON.

Serialized data should include:

- Metadata
- Geometry
- Style
- Transform
- Relationships

Serialization enables persistence, export, and realtime synchronization.

---

# 16. Service Layer

ShapeService responsibilities:

- Create shape
- Update shape
- Delete shape
- Duplicate shape
- Group shapes
- Ungroup shapes
- Lock/Unlock shape

Business rules belong here.

---

# 17. Repository Layer

ShapeRepository responsibilities:

- CRUD operations
- Batch updates
- Layer queries
- Shape filtering
- Bulk deletion

Repositories should remain free of business logic.

---

# 18. API Endpoints

```
POST   /api/shapes

GET    /api/shapes

PATCH  /api/shapes/:id

DELETE /api/shapes/:id

POST   /api/shapes/duplicate

POST   /api/shapes/group

POST   /api/shapes/ungroup
```

Realtime updates will primarily use WebSockets rather than REST.

---

# 19. Performance

To maintain smooth interaction:

- Render only visible shapes
- Batch updates
- Memoize components
- Use viewport culling
- Avoid unnecessary re-renders
- Support thousands of shapes efficiently

---

# 20. Realtime Integration

Synchronize:

- Shape creation
- Updates
- Movement
- Resize
- Rotation
- Style changes
- Deletion

Client state should be updated optimistically before server confirmation.

---

# 21. History Integration

Every operation should generate a reversible command.

Supported actions:

- Create
- Delete
- Move
- Resize
- Rotate
- Style Change
- Group
- Ungroup

These commands enable Undo and Redo functionality.

---

# 22. Security

- Validate all incoming shape data.
- Verify workspace membership.
- Enforce board permissions.
- Restrict modifications to locked shapes.
- Sanitize text-based content.

---

# 23. Testing

Verify:

- Shape creation
- Shape editing
- Move
- Resize
- Rotation
- Layer ordering
- Grouping
- Locking
- Copy & paste
- Realtime synchronization
- Undo/Redo

---

# 24. Best Practices

- Keep rendering separate from business logic.
- Use immutable updates.
- Design shapes to be extensible.
- Batch database operations.
- Keep rendering independent of persistence.

---

# 25. Verification Checklist

Before proceeding:

- Shape schema created
- Shape renderer implemented
- Selection system working
- Layer management implemented
- Grouping functional
- Locking implemented
- History integration complete
- Realtime events verified

---

# 26. Expected Outcome

At the end of this module:

- Users can create and manipulate rich graphical objects.
- Shapes are efficiently rendered and persisted.
- Transformations, grouping, and styling work seamlessly.
- The application is ready to implement Comments and advanced Realtime Collaboration.

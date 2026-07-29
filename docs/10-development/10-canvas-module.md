# Canvas Module

> **Project:** SyncBoard
> **Document:** Canvas Module
> **Phase:** 10 - Development
> **Version:** 1.0

---

# 1. Overview

The Canvas Module is the heart of SyncBoard.

It provides the infinite drawing surface where users collaborate in real time.

Everything rendered on a board exists inside the canvas.

The canvas is responsible for:

- Infinite workspace
- Rendering
- Viewport management
- Zoom & Pan
- Object selection
- Layer management
- Shape rendering
- Grid system
- History integration
- Realtime synchronization

---

# 2. Objectives

After implementing this module, users should be able to:

- Open a board
- View an infinite canvas
- Zoom in/out
- Pan in every direction
- Navigate smoothly
- Render thousands of objects efficiently
- Select objects
- Move around the workspace
- Maintain smooth performance

---

# 3. Architecture

```
Workspace

↓

Board

↓

Canvas

↓

Viewport

↓

Layers

↓

Shapes

↓

Renderer

↓

Realtime
```

---

# 4. Canvas Components

The canvas consists of:

```
Canvas

├── Background
├── Grid
├── Viewport
├── Layers
├── Shape Renderer
├── Selection Layer
├── Interaction Layer
└── Overlay Layer
```

Each layer has a dedicated responsibility.

---

# 5. Coordinate System

The canvas uses a world coordinate system.

```
Origin

(0,0)
```

Every object stores:

```
x

y

width

height

rotation
```

Rendering converts world coordinates into screen coordinates.

---

# 6. Infinite Canvas

The canvas should behave as infinite.

Instead of expanding endlessly, only the visible viewport is rendered.

Benefits:

- Better performance
- Unlimited workspace
- Lower memory usage

---

# 7. Viewport

Viewport state:

```
x

y

zoom

width

height
```

The viewport determines which objects are visible.

---

# 8. Zoom

Supported range:

```
10%

↓

400%
```

Zoom should:

- Center around cursor
- Animate smoothly
- Preserve object positions

---

# 9. Pan

Users can pan using:

- Middle mouse button
- Space + Drag
- Trackpad gestures

Panning changes only the viewport.

Objects remain unchanged.

---

# 10. Grid System

Support:

- Dot Grid
- Square Grid
- No Grid

Future:

- Isometric Grid

Grid visibility can be toggled.

---

# 11. Snapping

Support snapping to:

- Grid
- Guides
- Other Shapes
- Center Lines

Snapping should be optional.

---

# 12. Layers

Rendering order:

```
Background

↓

Grid

↓

Shapes

↓

Selection

↓

Comments

↓

UI Overlay
```

Higher layers always appear above lower ones.

---

# 13. Shape Rendering

The renderer should:

- Draw only visible objects
- Skip hidden layers
- Batch updates
- Minimize redraws

Rendering should be independent of business logic.

---

# 14. Selection System

Support:

- Single selection
- Multi-selection
- Drag selection
- Shift selection
- Select all

Selection state belongs to the client.

---

# 15. Interaction Layer

Handle:

- Click
- Double Click
- Drag
- Resize
- Rotate
- Context Menu

Interaction events should be translated into actions.

---

# 16. Canvas State

Store:

```
Viewport

Selection

Active Tool

Zoom

Pan

Grid

Snap
```

Persistent objects are stored separately.

---

# 17. Persistence

Persist:

- Shapes
- Connections
- Layers

Do not persist:

- Viewport
- Selection
- Hover State

Those remain session-specific.

---

# 18. Performance Strategy

Optimize by:

- Viewport culling
- Lazy rendering
- Object batching
- Memoization
- RequestAnimationFrame

Never redraw the entire canvas unnecessarily.

---

# 19. Realtime Integration

Canvas events:

```
Move

Resize

Rotate

Create

Delete

Select

Update
```

Only persistent changes should be synchronized.

---

# 20. History Integration

Canvas actions integrate with:

- Undo
- Redo
- Action History

Each user action should create a reversible command.

---

# 21. Accessibility

Support:

- Keyboard navigation
- Zoom shortcuts
- High contrast mode
- Screen reader announcements where appropriate

---

# 22. Testing

Verify:

- Infinite scrolling
- Zoom behavior
- Pan behavior
- Grid rendering
- Selection
- Layer order
- Performance with many objects
- Viewport calculations

---

# 23. Best Practices

- Separate rendering from business logic.
- Keep viewport calculations lightweight.
- Render only visible objects.
- Use immutable state updates.
- Minimize re-renders.

---

# 24. Verification Checklist

Before proceeding:

- Infinite canvas implemented
- Viewport management working
- Zoom and pan functional
- Grid rendering complete
- Selection system working
- Layer system implemented
- Performance targets met

---

# 25. Expected Outcome

At the end of this module:

- Users have a smooth, infinite canvas.
- Viewport navigation is fully functional.
- Rendering is optimized.
- The foundation is ready for the Shapes Module, where drawing tools and editable objects will be implemented.

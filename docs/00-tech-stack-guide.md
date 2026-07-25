# 📚 Tech Stack Guide - SyncBoard

> **Project:** SyncBoard - Real-Time Collaborative Whiteboard
> **Tagline:** Collaborate. Create. Connect.
> **Version:** 1.0
> **Author:** Ravi
> **Purpose:** This document explains every technology used in the project, why it was selected, where it will be used, its advantages, disadvantages, and possible alternatives.

---

# 📌 Why this document?

Before writing a single line of code, every engineer should understand **why** a technology is being used.

This document answers questions like:

- Why Next.js?
- Why TypeScript?
- Why PostgreSQL?
- Why Konva?
- Why Socket.IO?

The goal is **not just to build the project**, but to understand every engineering decision behind it.

---

# 🏗️ Final Tech Stack

| Category         | Technology             |
| ---------------- | ---------------------- |
| Frontend         | Next.js                |
| Language         | TypeScript             |
| Styling          | Tailwind CSS           |
| State Management | Zustand                |
| Canvas Engine    | Konva.js               |
| Authentication   | Clerk                  |
| Forms            | React Hook Form        |
| Validation       | Zod                    |
| Icons            | Lucide React           |
| Animation        | Framer Motion          |
| Backend          | Node.js                |
| API Framework    | Express.js             |
| Realtime         | Socket.IO              |
| Database         | PostgreSQL             |
| ORM              | Prisma                 |
| Storage          | Cloudinary (Later)     |
| Deployment       | Vercel + Render + Neon |

---

# 1️⃣ Next.js

## What is Next.js?

Next.js is a React framework developed by Vercel.

React helps us build UI.

Next.js provides production-ready architecture such as routing, rendering, optimization and deployment support.

---

## Why are we using it?

Our project contains much more than just a whiteboard.

It contains

- Landing Page
- Dashboard
- Authentication
- Workspace
- Settings
- Profile
- Whiteboard
- Documentation

Managing all of these becomes much easier using Next.js.

---

## Where will we use it?

Frontend only.

---

## Advantages

- File-based Routing
- Fast Performance
- Excellent TypeScript Support
- Optimized Images
- Easy Deployment
- Huge Community
- Production Ready

---

## Disadvantages

- Learning Curve
- More concepts than React alone

---

## Alternative

React + Vite

---

## Decision

✅ **Selected**

---

# 2️⃣ TypeScript

## What is TypeScript?

TypeScript is JavaScript with static types.

---

## Why are we using it?

Our project will become very large.

Large projects become difficult to maintain using plain JavaScript.

TypeScript helps detect errors before running the application.

---

## Where will we use it?

- Frontend
- Backend
- API Types
- Socket Events
- Database Models

---

## Advantages

- Compile-time Error Checking
- Better Auto Completion
- Easier Refactoring
- Better Code Maintenance
- Cleaner Architecture

---

## Disadvantages

- Slight Learning Curve
- Slightly More Code

---

## Decision

✅ **Selected**

---

# 3️⃣ Tailwind CSS

## What is Tailwind CSS?

Tailwind CSS is a Utility First CSS Framework.

Instead of writing custom CSS classes, we directly use utility classes.

Example

```html
<div class="flex items-center justify-between p-4"></div>
```

---

## Why are we using it?

- Faster UI Development
- Consistent Design
- Responsive Layout
- Easy Maintenance

---

## Where?

Entire Frontend

---

## Advantages

- Very Fast
- Mobile Friendly
- Reusable
- Huge Ecosystem

---

## Disadvantages

- Long Class Names

---

## Decision

✅ **Selected**

---

# 4️⃣ Zustand

## What is Zustand?

A lightweight State Management library.

---

## Why are we using it?

Many data need to be shared across components.

Example

- Selected Tool
- Zoom Level
- Theme
- Current User
- Current Board
- Active Page

---

## Why not Redux?

Redux is powerful but requires more boilerplate.

Zustand is simpler while providing everything we need.

---

## Advantages

- Lightweight
- Easy API
- High Performance
- Minimal Boilerplate

---

## Disadvantages

- Smaller Ecosystem than Redux

---

## Decision

✅ **Selected**

---

# 5️⃣ Konva.js

## What is Konva.js?

Konva is a Canvas Rendering Library.

It provides

- Shapes
- Layers
- Events
- Transformations
- Dragging
- Selection

without building everything manually.

---

## Why are we using it?

Building a whiteboard using the HTML Canvas API from scratch would take months.

Konva already provides the building blocks we need.

---

## Where?

Canvas Engine

---

## Advantages

- Excellent React Integration
- Fast Rendering
- Layer Support
- Easy Shape Manipulation
- Great Documentation

---

## Disadvantages

- Less flexible than building a custom engine from scratch

---

## Why not Fabric.js?

Konva offers a cleaner React experience and better control over rendering and interaction.

---

## Decision

✅ **Selected**

---

# 6️⃣ Socket.IO

## What is Socket.IO?

Socket.IO is a real-time communication library.

---

## Why are we using it?

A collaborative whiteboard requires instant synchronization.

Examples

- Live Drawing
- Live Cursor
- Live Chat
- User Presence
- Shape Updates

---

## Advantages

- Automatic Reconnection
- Room Support
- Reliable Communication
- Easy API

---

## Disadvantages

- Requires a server
- Slightly more overhead than raw WebSockets

---

## Decision

✅ **Selected**

---

# 7️⃣ Clerk

## What is Clerk?

Authentication Platform.

---

## Why are we using it?

Authentication is security-critical.

Instead of building login from scratch, Clerk provides

- Email Login
- Google Login
- Session Management
- User Profiles
- Secure Authentication

---

## Advantages

- Production Ready
- Secure
- Beautiful UI
- Easy Integration

---

## Disadvantages

- Vendor Dependency

---

## Future

Can be replaced with Custom JWT Authentication.

---

## Decision

✅ **Selected**

---

# 8️⃣ PostgreSQL

## What is PostgreSQL?

A Relational Database Management System.

---

## Why are we using it?

Our project contains many relationships.

Example

```
Workspace
    ↓
Boards
    ↓
Pages
    ↓
Objects
    ↓
Comments
    ↓
Versions
```

This structure fits relational databases very well.

---

## Advantages

- ACID Compliant
- Excellent Relationships
- Industry Standard
- Reliable
- Scalable

---

## Disadvantages

- Requires structured schema

---

## Why not MongoDB?

MongoDB is excellent for flexible documents.

However, our application contains complex relationships, permissions, and collaboration data that fit PostgreSQL better.

---

## Decision

✅ **Selected**

---

# 9️⃣ Prisma

## What is Prisma?

A modern ORM for TypeScript.

---

## Why are we using it?

Instead of writing SQL manually

```ts
await prisma.board.findMany();
```

Prisma provides

- Type Safety
- Auto Completion
- Database Migrations
- Cleaner Queries

---

## Advantages

- Easy Database Access
- Type Safe
- Great Developer Experience
- Migration Support

---

## Disadvantages

- Learning Schema Syntax

---

## Decision

✅ **Selected**

---

# 🔟 Node.js

## What is Node.js?

JavaScript Runtime.

---

## Why are we using it?

Using JavaScript/TypeScript across the entire stack means developers only need one language.

---

## Advantages

- Huge Ecosystem
- Fast Development
- Excellent Community
- Great for Realtime Apps

---

## Decision

✅ **Selected**

---

# 1️⃣1️⃣ Express.js

## What is Express?

Backend Framework for Node.js.

---

## Responsibilities

- REST APIs
- Authentication APIs
- Board APIs
- Workspace APIs
- File Upload
- Socket Integration

---

## Advantages

- Lightweight
- Stable
- Huge Community
- Flexible

---

## Disadvantages

- Minimal by default

---

## Decision

✅ **Selected**

---

# 1️⃣2️⃣ React Hook Form

## Purpose

Managing Forms efficiently.

Examples

- Login
- Signup
- Create Board
- Profile
- Settings

---

## Advantages

- High Performance
- Less Re-rendering
- Easy Validation

---

## Decision

✅ **Selected**

---

# 1️⃣3️⃣ Zod

## Purpose

Schema Validation.

Used for validating

- Emails
- Passwords
- Board Names
- Workspace Names
- API Payloads

---

## Advantages

- Type Safe
- Reusable
- Easy Integration

---

## Decision

✅ **Selected**

---

# 1️⃣4️⃣ Lucide React

## Purpose

Professional Icons.

Used throughout the application.

---

## Advantages

- Modern Icons
- Lightweight
- Tree Shakable

---

## Decision

✅ **Selected**

---

# 1️⃣5️⃣ Framer Motion

## Purpose

Professional UI Animations.

Used for

- Sidebar Animation
- Modal Animation
- Tooltips
- Dropdowns
- Loading Screens
- Page Transitions

---

## Advantages

- Smooth Animations
- Easy API
- Production Ready

---

## Disadvantages

- Slight Bundle Size Increase

---

## Decision

✅ **Selected**

---

# 🚀 Why this Tech Stack?

Every technology has been selected based on the following principles:

- Scalability
- Maintainability
- Performance
- Production Readiness
- Developer Experience
- Large Community Support

We are **not choosing libraries because they are popular**.

We are choosing them because they solve specific problems in this project.

---

# 🎯 Final Architecture

```
Next.js (Frontend)
        │
        ▼
REST API + Socket.IO
        │
        ▼
Node.js + Express
        │
        ▼
Prisma ORM
        │
        ▼
PostgreSQL (Neon)
```

---

# 📌 Engineering Principle

> **"Every technology should solve a problem. Never use a library just because it is popular."**

This document should be updated whenever a new technology is introduced or an existing technology is replaced.

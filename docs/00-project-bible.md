# 📖 SyncBoard Project Bible

> **Project Name:** SyncBoard
> **Tagline:** _Collaborate. Create. Connect._

---

# Purpose

The Project Bible is the single source of truth for engineering decisions, development standards, workflows, and long-term project goals.

Every contributor should read this document before writing code.

---

# 1. Project Vision

Build a production-ready real-time collaborative whiteboard platform that combines:

- Infinite Canvas
- Document Mode
- Real-Time Collaboration
- Modern UI
- Scalable Architecture
- AI-ready Foundation

The objective is not only to build a working application but to create software that follows professional engineering practices.

---

# 2. Project Goals

- Build a scalable SaaS application
- Write clean and maintainable code
- Follow modular architecture
- Document every important decision
- Use industry-standard tools and practices
- Produce a portfolio-quality project

---

# 3. Engineering Principles

## 3.1 User First

Every feature should solve a real user problem.

Never build features only because they are technically interesting.

---

## 3.2 Simplicity

Prefer simple solutions over clever solutions.

Readable code is more valuable than complicated code.

---

## 3.3 Scalability

Every module should be designed so it can grow without major rewrites.

---

## 3.4 Performance

Optimize only after measuring, but never ignore performance.

Drawing and collaboration should remain smooth.

---

## 3.5 Maintainability

Code should be easy to modify six months later.

Avoid unnecessary complexity.

---

## 3.6 Consistency

Naming, formatting, architecture, and coding style should remain consistent across the project.

---

# 4. Documentation Rules

Every important feature must be documented before implementation.

Documentation comes before code.

Required documentation:

- Product Requirements
- Architecture
- Database Design
- API Design
- Socket Events
- Testing Strategy
- Deployment Guide

---

# 5. Development Workflow

Every feature follows the same lifecycle.

```text
Idea
    ↓
Requirements
    ↓
Architecture
    ↓
Database Design
    ↓
API Design
    ↓
UI Design
    ↓
Implementation
    ↓
Testing
    ↓
Code Review
    ↓
Documentation Update
    ↓
Deployment
```

Skipping steps is discouraged.

---

# 6. Git Workflow

Recommended branch strategy:

```text
main
│
├── develop
│
├── feature/authentication
├── feature/workspace
├── feature/whiteboard
├── feature/document-mode
├── feature/socket
├── feature/export
└── bugfix/*
```

For this project, working directly on `main` is acceptable during early development if the project is maintained by a single developer.

As the project grows, feature branches should be used.

---

# 7. Commit Message Convention

Use meaningful commit messages.

Examples:

```text
feat: add workspace creation
```

```text
feat: implement document mode
```

```text
fix: resolve socket synchronization issue
```

```text
docs: update API documentation
```

```text
refactor: split canvas into reusable components
```

---

# 8. Folder Organization Rules

Every folder should have a clear responsibility.

Example:

```text
frontend/
```

Contains only frontend code.

```text
backend/
```

Contains only backend code.

```text
docs/
```

Contains only documentation.

Business logic should never be mixed with UI components.

---

# 9. Code Quality Standards

Code should be:

- Readable
- Modular
- Reusable
- Testable
- Well Named

Avoid:

- Giant components
- Deep nesting
- Duplicate code
- Magic numbers
- Unused variables

---

# 10. Naming Conventions

## Components

```text
WorkspaceCard.tsx
```

---

## Hooks

```text
useBoard.ts
```

---

## Stores

```text
boardStore.ts
```

---

## Services

```text
workspace.service.ts
```

---

## Controllers

```text
workspace.controller.ts
```

---

## Routes

```text
workspace.routes.ts
```

---

## Prisma Models

Use PascalCase.

Example:

```text
Workspace
```

```text
Board
```

```text
User
```

---

# 11. Project Architecture Principles

The application should follow separation of concerns.

Frontend

- UI
- State
- API Calls
- Routing

Backend

- Routes
- Controllers
- Services
- Database

Database

- PostgreSQL
- Prisma ORM

Realtime

- Socket.IO

Each layer should have a single responsibility.

---

# 12. Technology Decisions

The following technologies have been approved for the project.

| Layer            | Technology      |
| ---------------- | --------------- |
| Frontend         | Next.js         |
| Language         | TypeScript      |
| Styling          | Tailwind CSS    |
| State Management | Zustand         |
| Canvas           | Konva.js        |
| Authentication   | Clerk           |
| Forms            | React Hook Form |
| Validation       | Zod             |
| Icons            | Lucide React    |
| Animation        | Framer Motion   |
| Backend          | Node.js         |
| API Framework    | Express.js      |
| Realtime         | Socket.IO       |
| Database         | PostgreSQL      |
| ORM              | Prisma          |

Detailed reasoning for each choice is available in:

`docs/00-tech-stack-guide.md`

---

# 13. Definition of Done (DoD)

A feature is considered complete only if:

- Requirements are implemented.
- Code is reviewed.
- No known critical bugs remain.
- Documentation is updated.
- Responsive behavior is verified.
- TypeScript has no errors.
- Build succeeds.
- Tests pass (when available).

---

# 14. Long-Term Roadmap

Development will progress in phases.

- Phase 1 – Documentation
- Phase 2 – Project Setup
- Phase 3 – Authentication
- Phase 4 – Workspace
- Phase 5 – Whiteboard Engine
- Phase 6 – Real-Time Collaboration
- Phase 7 – Export & Sharing
- Phase 8 – AI Features
- Phase 9 – Production Deployment

---

# 15. Future Improvements

Potential future enhancements include:

- Offline Mode
- Plugin System
- AI Whiteboard Assistant
- OCR
- Voice Notes
- Meeting Summaries
- Presentation Mode
- Mobile Applications

---

# 16. Final Engineering Rule

> **Never compromise maintainability for short-term speed.**

Every architectural decision should support long-term scalability, readability, and reliability.

If there is uncertainty between two approaches, choose the one that results in cleaner architecture and easier maintenance.

---

# Revision History

| Version | Date      | Changes               |
| ------- | --------- | --------------------- |
| 1.0     | July 2026 | Initial Project Bible |

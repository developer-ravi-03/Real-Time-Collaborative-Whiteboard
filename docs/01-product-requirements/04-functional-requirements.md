# 14. Functional Requirements

## 14.1 Overview

Functional Requirements define what the system **must** do. Each requirement is assigned a unique identifier (FR-XXX) to ensure traceability throughout development, testing, and future maintenance.

Each Functional Requirement includes:

- **ID**
- **Module**
- **Description**
- **Priority**
- **Status**

Priority Levels:

- **High** – Required for MVP
- **Medium** – Important but can follow MVP
- **Low** – Future enhancement

Status:

- Planned
- In Progress
- Completed
- Deferred

---

# Module 1 – Authentication

| ID     | Requirement                   | Priority | Status  |
| ------ | ----------------------------- | -------- | ------- |
| FR-001 | User can register using email | High     | Planned |
| FR-002 | User can login securely       | High     | Planned |
| FR-003 | Google authentication         | High     | Planned |
| FR-004 | Logout support                | High     | Planned |
| FR-005 | Session management            | High     | Planned |
| FR-006 | Forgot password               | Medium   | Planned |
| FR-007 | Reset password                | Medium   | Planned |
| FR-008 | Email verification            | Medium   | Planned |
| FR-009 | Update profile                | High     | Planned |
| FR-010 | Change password               | Medium   | Planned |

---

# Module 2 – Workspace

| ID     | Requirement             | Priority | Status  |
| ------ | ----------------------- | -------- | ------- |
| FR-011 | Create workspace        | High     | Planned |
| FR-012 | Edit workspace          | High     | Planned |
| FR-013 | Delete workspace        | High     | Planned |
| FR-014 | Invite members          | High     | Planned |
| FR-015 | Remove members          | High     | Planned |
| FR-016 | Assign user roles       | High     | Planned |
| FR-017 | Transfer ownership      | Medium   | Planned |
| FR-018 | Archive workspace       | Medium   | Planned |
| FR-019 | Workspace activity logs | Medium   | Planned |
| FR-020 | Workspace search        | Medium   | Planned |

---

# Module 3 – Board Management

| ID     | Requirement            | Priority | Status  |
| ------ | ---------------------- | -------- | ------- |
| FR-021 | Create board           | High     | Planned |
| FR-022 | Rename board           | High     | Planned |
| FR-023 | Duplicate board        | Medium   | Planned |
| FR-024 | Delete board           | High     | Planned |
| FR-025 | Archive board          | Medium   | Planned |
| FR-026 | Restore archived board | Medium   | Planned |
| FR-027 | Favorite board         | Low      | Planned |
| FR-028 | Search boards          | Medium   | Planned |
| FR-029 | Board thumbnail        | Medium   | Planned |
| FR-030 | Recent boards list     | Medium   | Planned |

---

# Module 4 – Infinite Canvas

| ID     | Requirement              | Priority | Status  |
| ------ | ------------------------ | -------- | ------- |
| FR-031 | Infinite panning         | High     | Planned |
| FR-032 | Infinite zoom            | High     | Planned |
| FR-033 | Unlimited objects        | High     | Planned |
| FR-034 | Grid support             | Medium   | Planned |
| FR-035 | Snap to grid             | Medium   | Planned |
| FR-036 | Background customization | Medium   | Planned |
| FR-037 | Zoom controls            | High     | Planned |
| FR-038 | Mini-map (Navigator)     | Low      | Planned |
| FR-039 | Fit to screen            | Medium   | Planned |
| FR-040 | Reset viewport           | Medium   | Planned |

---

# Module 5 – Document Mode

| ID     | Requirement                               | Priority | Status  |
| ------ | ----------------------------------------- | -------- | ------- |
| FR-041 | Create pages                              | High     | Planned |
| FR-042 | Delete pages                              | High     | Planned |
| FR-043 | Duplicate pages                           | Medium   | Planned |
| FR-044 | Reorder pages                             | High     | Planned |
| FR-045 | Page numbering                            | High     | Planned |
| FR-046 | Page thumbnails                           | Medium   | Planned |
| FR-047 | Print support                             | Medium   | Planned |
| FR-048 | PDF generation                            | High     | Planned |
| FR-049 | Fixed page sizes                          | High     | Planned |
| FR-050 | Multiple paper formats (A4, Letter, etc.) | Low      | Planned |

---

# Module 6 – Drawing Engine

| ID     | Requirement               | Priority | Status  |
| ------ | ------------------------- | -------- | ------- |
| FR-051 | Pencil tool               | High     | Planned |
| FR-052 | Pen tool                  | High     | Planned |
| FR-053 | Highlighter tool          | Medium   | Planned |
| FR-054 | Eraser tool               | High     | Planned |
| FR-055 | Rectangle tool            | High     | Planned |
| FR-056 | Circle tool               | High     | Planned |
| FR-057 | Ellipse tool              | Medium   | Planned |
| FR-058 | Line tool                 | High     | Planned |
| FR-059 | Arrow tool                | High     | Planned |
| FR-060 | Diamond tool              | Medium   | Planned |
| FR-061 | Polygon tool              | Low      | Planned |
| FR-062 | Text tool                 | High     | Planned |
| FR-063 | Sticky notes              | High     | Planned |
| FR-064 | Image upload              | High     | Planned |
| FR-065 | Shape resizing            | High     | Planned |
| FR-066 | Shape rotation            | Medium   | Planned |
| FR-067 | Shape grouping            | Medium   | Planned |
| FR-068 | Shape locking             | Medium   | Planned |
| FR-069 | Layer ordering            | High     | Planned |
| FR-070 | Duplicate selected object | High     | Planned |

---

# Module 7 – Editing

| ID     | Requirement             | Priority | Status  |
| ------ | ----------------------- | -------- | ------- |
| FR-071 | Multi-select objects    | High     | Planned |
| FR-072 | Copy objects            | High     | Planned |
| FR-073 | Paste objects           | High     | Planned |
| FR-074 | Cut objects             | High     | Planned |
| FR-075 | Undo                    | High     | Planned |
| FR-076 | Redo                    | High     | Planned |
| FR-077 | Delete selected objects | High     | Planned |
| FR-078 | Keyboard shortcuts      | High     | Planned |
| FR-079 | Alignment tools         | Medium   | Planned |
| FR-080 | Distribution tools      | Medium   | Planned |

---

# Module 8 – Collaboration

| ID     | Requirement                      | Priority | Status  |
| ------ | -------------------------------- | -------- | ------- |
| FR-081 | Real-time synchronization        | High     | Planned |
| FR-082 | Live cursor tracking             | High     | Planned |
| FR-083 | User presence indicators         | High     | Planned |
| FR-084 | Join/Leave notifications         | Medium   | Planned |
| FR-085 | Shared editing                   | High     | Planned |
| FR-086 | Conflict handling                | High     | Planned |
| FR-087 | Board locking during maintenance | Low      | Planned |
| FR-088 | User activity indicators         | Medium   | Planned |
| FR-089 | Live board updates               | High     | Planned |
| FR-090 | Collaboration history            | Medium   | Planned |

---

# Module 9 – Comments

| ID     | Requirement           | Priority | Status  |
| ------ | --------------------- | -------- | ------- |
| FR-091 | Add comments          | Medium   | Planned |
| FR-092 | Reply to comments     | Medium   | Planned |
| FR-093 | Resolve comments      | Medium   | Planned |
| FR-094 | Mention users         | Low      | Planned |
| FR-095 | Comment notifications | Medium   | Planned |

---

# Module 10 – Export & Import

| ID     | Requirement          | Priority | Status  |
| ------ | -------------------- | -------- | ------- |
| FR-096 | Export PNG           | High     | Planned |
| FR-097 | Export JPEG          | High     | Planned |
| FR-098 | Export PDF           | High     | Planned |
| FR-099 | Export selected area | Medium   | Planned |
| FR-100 | Import images        | High     | Planned |

---

# Module 11 – Notifications

| ID     | Requirement                        | Priority | Status  |
| ------ | ---------------------------------- | -------- | ------- |
| FR-101 | Workspace invitation notifications | Medium   | Planned |
| FR-102 | Comment notifications              | Medium   | Planned |
| FR-103 | Board shared notifications         | Medium   | Planned |
| FR-104 | Collaboration notifications        | Medium   | Planned |
| FR-105 | System notifications               | Low      | Planned |

---

# Module 12 – Version History

| ID     | Requirement              | Priority | Status  |
| ------ | ------------------------ | -------- | ------- |
| FR-106 | Save board versions      | Medium   | Planned |
| FR-107 | View version history     | Medium   | Planned |
| FR-108 | Restore previous version | Medium   | Planned |
| FR-109 | Version timestamps       | Medium   | Planned |
| FR-110 | Version author tracking  | Medium   | Planned |

---

# Module 13 – Security

| ID     | Requirement                | Priority | Status  |
| ------ | -------------------------- | -------- | ------- |
| FR-111 | Role-based access control  | High     | Planned |
| FR-112 | Secure API authorization   | High     | Planned |
| FR-113 | Validate all user inputs   | High     | Planned |
| FR-114 | Protect private workspaces | High     | Planned |
| FR-115 | Secure file uploads        | High     | Planned |

---

# Module 14 – Settings

| ID     | Requirement                     | Priority | Status  |
| ------ | ------------------------------- | -------- | ------- |
| FR-116 | Theme switching                 | Medium   | Planned |
| FR-117 | Keyboard shortcut customization | Low      | Planned |
| FR-118 | Language support                | Low      | Planned |
| FR-119 | Notification preferences        | Medium   | Planned |
| FR-120 | Account preferences             | Medium   | Planned |

---

# 15. Functional Requirement Summary

| Category         |              Total Requirements |
| ---------------- | ------------------------------: |
| Authentication   |                              10 |
| Workspace        |                              10 |
| Board Management |                              10 |
| Infinite Canvas  |                              10 |
| Document Mode    |                              10 |
| Drawing Engine   |                              20 |
| Editing          |                              10 |
| Collaboration    |                              10 |
| Comments         |                               5 |
| Export & Import  |                               5 |
| Notifications    |                               5 |
| Version History  |                               5 |
| Security         |                               5 |
| Settings         |                               5 |
| **Total**        | **120 Functional Requirements** |

---

# 16. Requirement Traceability

Every development sprint, API endpoint, database table, and test case should reference one or more Functional Requirement IDs. This ensures:

- Full traceability from requirements to implementation.
- Easier testing and validation.
- Simpler maintenance as the product evolves.

For example:

| Sprint   | Covered Requirements |
| -------- | -------------------- |
| Sprint 1 | FR-001 → FR-020      |
| Sprint 2 | FR-021 → FR-050      |
| Sprint 3 | FR-051 → FR-080      |
| Sprint 4 | FR-081 → FR-120      |

---

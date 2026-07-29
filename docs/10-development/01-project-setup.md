# Project Setup

> **Project:** SyncBoard
> **Document:** Project Setup
> **Phase:** 10 - Development
> **Version:** 1.0

---

# 1. Overview

This document describes how to initialize the SyncBoard project.

The objective is to create a clean, scalable, and production-ready development environment that follows the architecture defined in previous phases.

---

# 2. Prerequisites

Ensure the following software is installed before starting.

## Operating System

Supported:

- Windows 11
- Ubuntu 22.04+
- macOS Sonoma+

---

## Node.js

Required version:

```
>=22 LTS
```

Verify installation:

```bash
node -v
```

---

## npm

Required:

```
>=10
```

Verify:

```bash
npm -v
```

---

## Git

Required:

```
>=2.45
```

Verify:

```bash
git --version
```

---

## Visual Studio Code

Recommended extensions:

- ESLint
- Prettier
- Tailwind CSS IntelliSense
- Prisma
- GitLens
- Error Lens
- Docker
- EditorConfig
- Markdown All in One

---

# 3. Repository

Create a GitHub repository.

Recommended name:

```
syncboard
```

Repository settings:

- Private during development
- Initialize with README
- Add MIT License (optional)
- Enable Issues
- Enable Discussions (optional)

---

# 4. Clone Repository

```bash
git clone https://github.com/<username>/syncboard.git

cd syncboard
```

---

# 5. Initialize Next.js

Create the application using:

```bash
npx create-next-app@latest .
```

Choose the following options:

```
TypeScript      → Yes

ESLint          → Yes

Tailwind CSS    → Yes

src/ directory  → Yes

App Router      → Yes

Turbopack       → Yes

Import Alias    → @/*
```

---

# 6. Verify Installation

Run:

```bash
npm run dev
```

Expected output:

```
Local:

http://localhost:3000
```

The default Next.js page should load successfully.

---

# 7. Git Initialization

Create the first commit.

```bash
git add .

git commit -m "chore: initialize Next.js project"

git push origin main
```

---

# 8. Initial Project Structure

The project should resemble:

```
syncboard/

├── src/
├── public/
├── package.json
├── tsconfig.json
├── next.config.ts
├── eslint.config.mjs
├── postcss.config.mjs
└── README.md
```

Do not create additional folders yet. They will be added in the next step.

---

# 9. Verification Checklist

Before proceeding:

- Node.js installed
- npm installed
- Git installed
- Repository created
- Next.js initialized
- Development server running
- Initial commit pushed

All items should be completed successfully.

---

# 10. Common Issues

### Node version mismatch

Update Node.js to the required LTS version.

---

### npm install fails

Delete:

```
node_modules
package-lock.json
```

Then run:

```bash
npm install
```

---

### Port 3000 already in use

Run:

```bash
npm run dev -- --port 3001
```

Or stop the application using port 3000.

---

### Git authentication issues

Verify:

- GitHub authentication
- SSH key or Personal Access Token
- Repository permissions

---

# 11. Best Practices

- Use the latest LTS version of Node.js.
- Commit only working code.
- Keep the default Next.js configuration until customization is required.
- Avoid installing unnecessary packages during initialization.
- Push the initial commit before making structural changes.

---

# 12. Expected Outcome

At the end of this step, you should have:

- A GitHub repository
- A fresh Next.js application
- TypeScript configured
- Tailwind CSS configured
- ESLint enabled
- App Router enabled
- A running development server
- A clean Git history

This forms the foundation for all subsequent development work.

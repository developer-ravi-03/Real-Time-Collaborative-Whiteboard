# Git Workflow

> **Project:** SyncBoard
> **Document:** Git Workflow
> **Phase:** 10 - Development
> **Version:** 1.0

---

# 1. Overview

This document defines the official Git workflow for SyncBoard.

The objectives are:

- Maintain a clean Git history
- Enable safe collaboration
- Simplify code reviews
- Support continuous integration
- Ensure traceable changes

All contributors should follow this workflow.

---

# 2. Workflow Strategy

SyncBoard follows **GitHub Flow**.

```
main

↓

feature branch

↓

Pull Request

↓

Review

↓

Merge

↓

Deploy
```

The `main` branch should always remain deployable.

---

# 3. Branch Protection

Protect the following branch:

```
main
```

Rules:

- No direct commits
- Pull Request required
- Status checks required
- At least one approval
- Resolve conversations before merge

---

# 4. Branch Naming Convention

### Feature

```
feature/authentication

feature/workspace

feature/whiteboard

feature/comments
```

### Bug Fix

```
bugfix/socket-reconnect

bugfix/upload-validation
```

### Refactor

```
refactor/service-layer

refactor/database
```

### Documentation

```
docs/api-design

docs/deployment
```

### Chore

```
chore/update-dependencies

chore/eslint
```

---

# 5. Creating a Branch

Always update `main` first.

```bash
git checkout main

git pull origin main
```

Create a feature branch:

```bash
git checkout -b feature/authentication
```

---

# 6. Commit Strategy

Follow **Conventional Commits**.

Format:

```
type(scope): description
```

Examples:

```
feat(auth): add Clerk authentication

fix(socket): reconnect after disconnect

docs(api): update endpoint documentation

refactor(board): simplify board service

test(canvas): add unit tests

style(ui): format dashboard layout

chore(deps): update Prisma
```

---

# 7. Commit Rules

Every commit should:

- Be small
- Build successfully
- Pass linting
- Be logically complete
- Have a meaningful message

Avoid mixing unrelated changes.

---

# 8. Pull Requests

A pull request should include:

- Summary
- Related issue
- Screenshots (if UI changes)
- Testing performed
- Checklist completion

---

# 9. Pull Request Checklist

Before opening a PR:

- Code compiles
- ESLint passes
- Tests pass
- Documentation updated
- No merge conflicts
- No debug code
- No commented-out code

---

# 10. Code Review

Reviewers should verify:

- Correctness
- Architecture
- Security
- Performance
- Accessibility
- Maintainability
- Documentation

Feedback should be constructive and actionable.

---

# 11. Merge Strategy

Preferred merge method:

```
Squash and Merge
```

Benefits:

- Cleaner history
- One commit per feature
- Easier rollbacks

---

# 12. Release Tags

Tag stable releases.

Examples:

```
v0.1.0

v0.2.0

v1.0.0
```

Create a tag:

```bash
git tag v0.1.0

git push origin v0.1.0
```

---

# 13. Hotfix Workflow

For urgent production issues:

```
main

↓

hotfix/login-error

↓

Review

↓

Merge

↓

Deploy
```

Hotfixes should follow the same review process whenever possible.

---

# 14. Synchronizing with Main

Keep your branch up to date:

```bash
git checkout main

git pull origin main

git checkout feature/authentication

git merge main
```

Resolve conflicts promptly.

---

# 15. Git Hooks

Use Husky to automate checks.

Suggested hooks:

- pre-commit
- commit-msg
- pre-push

---

# 16. Lint-Staged

Run checks only on staged files.

Example tasks:

- ESLint
- Prettier
- Type checking (where practical)

---

# 17. Ignored Files

Do not commit:

```
node_modules/

.next/

.env.local

.env.production

coverage/

dist/
```

---

# 18. Recovery

Undo the last commit (keep changes):

```bash
git reset --soft HEAD~1
```

Discard local changes:

```bash
git restore .
```

View history:

```bash
git log --oneline
```

---

# 19. Best Practices

- Commit frequently.
- Push regularly.
- Rebase or merge main often.
- Keep commits focused.
- Review code before pushing.
- Never force-push shared branches unless agreed by the team.

---

# 20. Verification Checklist

Before merging:

- Branch updated
- Commits follow Conventional Commits
- Pull Request created
- Review completed
- CI checks passed
- Documentation updated
- Feature verified

---

# 21. Expected Outcome

After following this workflow:

- Git history remains clean.
- Every feature is traceable.
- Collaboration is consistent.
- Releases are easier to manage.
- Code quality is maintained throughout the project.

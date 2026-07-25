# Typography

> **Project:** SyncBoard
> **Document:** Typography
> **Version:** 1.0

---

# 1. Overview

Typography defines the visual hierarchy and readability of SyncBoard.

The goal is to create a clean, modern, and accessible reading experience across dashboards, whiteboards, dialogs, forms, and documentation.

Every text element in the application should follow this system.

---

# 2. Design Philosophy

The typography system follows these principles:

- Clear hierarchy
- Consistent spacing
- Excellent readability
- Minimal font variations
- Accessibility-first
- Responsive scaling

---

# 3. Font Family

## Primary Font

Geist

Uses:

- UI
- Navigation
- Dashboard
- Forms
- Buttons
- Dialogs

---

## Monospace Font

Geist Mono

Uses:

- Code
- IDs
- Keyboard shortcuts
- Debug panels
- Technical information

---

# 4. Font Weights

| Weight   | Value | Usage      |
| -------- | ----- | ---------- |
| Regular  | 400   | Paragraphs |
| Medium   | 500   | Labels     |
| Semibold | 600   | Buttons    |
| Bold     | 700   | Headings   |

Avoid using more than four font weights.

---

# 5. Font Scale

| Style      | Size | Weight |
| ---------- | ---- | ------ |
| Display    | 48px | 700    |
| H1         | 36px | 700    |
| H2         | 30px | 700    |
| H3         | 24px | 600    |
| H4         | 20px | 600    |
| H5         | 18px | 600    |
| H6         | 16px | 600    |
| Body Large | 18px | 400    |
| Body       | 16px | 400    |
| Body Small | 14px | 400    |
| Caption    | 12px | 400    |

---

# 6. Line Height

| Text    | Line Height |
| ------- | ----------- |
| Display | 56px        |
| H1      | 44px        |
| H2      | 40px        |
| H3      | 32px        |
| Body    | 24px        |
| Small   | 20px        |

Maintain comfortable spacing to improve readability.

---

# 7. Letter Spacing

| Text     | Letter Spacing |
| -------- | -------------- |
| Display  | -2%            |
| Headings | -1%            |
| Body     | 0              |
| Caption  | 1%             |

Negative tracking is used only for large headings.

---

# 8. Text Hierarchy

Primary

- Headings
- Titles

Secondary

- Descriptions
- Labels

Muted

- Metadata
- Helper text
- Empty states

Disabled

- Inactive controls

---

# 9. Text Alignment

Default:

Left aligned

Exceptions:

- Numeric values
- Statistics
- Charts

Never justify paragraphs.

---

# 10. Responsive Typography

### Mobile

Reduce heading sizes by one level.

Example

Desktop

```
H1 → 36px
```

Mobile

```
H1 → 30px
```

Body text remains 16px for readability.

---

# 11. Button Typography

Primary Button

- 16px
- Semibold

Secondary Button

- 16px
- Medium

Icon Button

- Icon only
- Accessible label required

---

# 12. Form Typography

Input Text

16px

Placeholder

16px

Labels

14px Medium

Helper Text

12px

Error Text

12px Medium

---

# 13. Code Typography

Use:

Geist Mono

Size

14px

Line Height

20px

Never use proportional fonts for code snippets.

---

# 14. Accessibility

Requirements:

- Minimum body size: 16px
- Avoid long uppercase text
- Maintain WCAG contrast ratios
- Preserve readable line lengths (60–80 characters where applicable)

---

# 15. Best Practices

- Limit heading levels on a page.
- Use bold sparingly.
- Avoid underlined text except for links.
- Use sentence case for UI labels.
- Use title case only for page titles where appropriate.

---

# 16. Future Enhancements

Supports:

- Localization
- RTL languages
- User font scaling
- Accessibility preferences

---

# 17. Conclusion

The SyncBoard typography system establishes a clear visual hierarchy using Geist and Geist Mono. Consistent font sizing, spacing, and weights ensure a professional, readable, and accessible experience across the application.

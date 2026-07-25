# Spacing System

> **Project:** SyncBoard
> **Document:** Spacing System
> **Version:** 1.0

---

# 1. Overview

The spacing system establishes consistent spacing across the entire application.

Every layout, card, modal, form, toolbar, and component must use this spacing scale.

The system is based on an **8-point grid**, ensuring visual consistency and easy implementation with Tailwind CSS.

---

# 2. Design Principles

The spacing system follows these principles:

- Consistent rhythm
- Predictable layouts
- Responsive scaling
- Minimal arbitrary values
- Tailwind-compatible spacing

---

# 3. Base Grid

The foundation is:

```
8px
```

Small adjustments may use:

```
4px
```

Avoid arbitrary spacing values such as:

❌ 13px

❌ 19px

❌ 27px

---

# 4. Spacing Scale

| Token | Value | Tailwind |
| ----- | ----- | -------- |
| XS    | 4px   | 1        |
| SM    | 8px   | 2        |
| MD    | 16px  | 4        |
| LG    | 24px  | 6        |
| XL    | 32px  | 8        |
| 2XL   | 48px  | 12       |
| 3XL   | 64px  | 16       |
| 4XL   | 96px  | 24       |

---

# 5. Layout Spacing

## Page Padding

Desktop

```
32px
```

Tablet

```
24px
```

Mobile

```
16px
```

---

## Section Spacing

Between major sections

```
48px
```

---

## Card Padding

Default

```
24px
```

Compact

```
16px
```

Large

```
32px
```

---

## Sidebar

Horizontal Padding

```
16px
```

Navigation Item Gap

```
8px
```

Section Gap

```
24px
```

---

# 6. Component Spacing

Buttons

Horizontal

```
16px
```

Vertical

```
10px
```

---

Inputs

Internal Padding

```
12px
```

Gap Between Label & Input

```
8px
```

Gap Between Inputs

```
16px
```

---

Dialogs

Outer Padding

```
24px
```

Header Gap

```
16px
```

Footer Gap

```
24px
```

---

Cards

Content Padding

```
24px
```

Gap Between Elements

```
16px
```

---

# 7. Grid & Flex Layouts

Card Grid

Desktop

```
24px gap
```

Tablet

```
16px gap
```

Mobile

```
16px gap
```

---

Flex Layout

Default Gap

```
16px
```

Compact Gap

```
8px
```

Large Gap

```
24px
```

---

# 8. Canvas Layout

Toolbar Height

```
64px
```

Left Toolbar Width

```
72px
```

Right Properties Panel

```
320px
```

Canvas Padding

```
16px
```

Floating Toolbar Gap

```
12px
```

---

# 9. Responsive Rules

Desktop

Use full spacing scale.

Tablet

Reduce large spacing by one level.

Mobile

Prioritize compact layouts.

Maintain minimum touch target spacing.

---

# 10. Accessibility

Maintain at least:

- 44×44px touch targets
- Clear separation between interactive elements
- Consistent spacing around focus rings

---

# 11. Tailwind Mapping

| Spacing | Tailwind |
| ------- | -------- |
| 4px     | p-1      |
| 8px     | p-2      |
| 12px    | p-3      |
| 16px    | p-4      |
| 20px    | p-5      |
| 24px    | p-6      |
| 32px    | p-8      |
| 48px    | p-12     |
| 64px    | p-16     |
| 96px    | p-24     |

---

# 12. Best Practices

- Use spacing tokens instead of custom values.
- Prefer whitespace over unnecessary borders.
- Keep layouts visually balanced.
- Align components to the spacing grid.
- Maintain consistent gaps across similar components.

---

# 13. Future Enhancements

Supports:

- Compact density mode
- Comfortable density mode
- Touch-first layouts
- White-label customization

---

# 14. Conclusion

The SyncBoard spacing system provides a consistent layout rhythm built on an 8-point grid. By combining predictable spacing tokens with Tailwind CSS utilities, the interface remains clean, scalable, and easy to maintain.

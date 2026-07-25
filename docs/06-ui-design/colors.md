# Color System

> **Project:** SyncBoard
> **Document:** Color System
> **Version:** 1.0

---

# 1. Overview

The SyncBoard color system establishes a consistent visual identity across the application.

The palette is designed to be:

- Modern
- Accessible
- Professional
- Minimal
- Collaboration-focused

Every UI element must use colors from this document.

---

# 2. Design Philosophy

The color system follows these principles:

- One primary brand color
- Neutral interface
- Minimal visual noise
- High readability
- Excellent dark mode support

---

# 3. Brand Colors

## Primary

Purpose

- Primary buttons
- Active states
- Links
- Selected objects
- Focus indicators

```
Blue
#3B82F6
```

---

## Secondary

Purpose

- Secondary actions
- Badges
- UI accents

```
Indigo
#6366F1
```

---

## Accent

Purpose

- Highlights
- AI features
- Premium interactions

```
Violet
#8B5CF6
```

---

# 4. Semantic Colors

## Success

```
Green
#22C55E
```

Uses

- Saved
- Completed
- Online users

---

## Warning

```
Amber
#F59E0B
```

Uses

- Unsaved changes
- Caution
- Archive warning

---

## Error

```
Red
#EF4444
```

Uses

- Validation errors
- Delete actions
- Failures

---

## Information

```
Sky
#0EA5E9
```

Uses

- Tips
- Information
- Updates

---

# 5. Neutral Palette

| Name       | Light   | Dark    |
| ---------- | ------- | ------- |
| Background | #FFFFFF | #09090B |
| Surface    | #F8FAFC | #18181B |
| Card       | #FFFFFF | #27272A |
| Border     | #E4E4E7 | #3F3F46 |
| Divider    | #F1F5F9 | #27272A |

---

# 6. Text Colors

## Light Theme

Primary

```
#18181B
```

Secondary

```
#52525B
```

Muted

```
#71717A
```

Disabled

```
#A1A1AA
```

---

## Dark Theme

Primary

```
#FAFAFA
```

Secondary

```
#D4D4D8
```

Muted

```
#A1A1AA
```

Disabled

```
#71717A
```

---

# 7. Canvas Colors

## Light Mode

Canvas

```
#FFFFFF
```

Grid

```
#F1F5F9
```

Selection

```
#3B82F6
```

Selection Fill

```
rgba(59,130,246,0.15)
```

---

## Dark Mode

Canvas

```
#18181B
```

Grid

```
#27272A
```

Selection

```
#60A5FA
```

Selection Fill

```
rgba(96,165,250,0.20)
```

---

# 8. Status Indicators

Online

```
#22C55E
```

Offline

```
#71717A
```

Busy

```
#EF4444
```

Away

```
#F59E0B
```

---

# 9. Notification Colors

Mention

```
Blue
```

Comment

```
Indigo
```

Invitation

```
Green
```

Warning

```
Amber
```

Error

```
Red
```

---

# 10. Interactive States

Hover

Increase surface contrast slightly.

Active

Use primary brand color.

Focused

Use visible blue focus ring.

Disabled

Reduce opacity.

Loading

Skeleton placeholders.

---

# 11. Accessibility

Requirements

- WCAG AA contrast
- Visible focus indicators
- Do not rely on color alone
- Pair colors with icons or labels where necessary

---

# 12. Tailwind Token Mapping

Primary

```
primary
```

Secondary

```
secondary
```

Muted

```
muted
```

Accent

```
accent
```

Destructive

```
destructive
```

Border

```
border
```

Background

```
background
```

Foreground

```
foreground
```

Card

```
card
```

Popover

```
popover
```

---

# 13. Future Enhancements

The color system supports:

- Brand customization
- Enterprise themes
- White-label deployments
- High-contrast accessibility mode
- Seasonal themes

---

# 14. Conclusion

The SyncBoard color system combines a neutral interface with a focused blue brand identity to create a clean, modern, and accessible collaboration experience. Consistent use of these colors ensures visual harmony across dashboards, whiteboards, and realtime collaboration features.

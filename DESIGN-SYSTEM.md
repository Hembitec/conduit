# Design System

## Design Philosophy
**Swiss Modernism 2.0** — Grid-based, mathematical spacing, clean hierarchy, high contrast, minimal decoration. One accent color only. Typography-driven.

---

## Typography

### Font Pairing: Editorial Modern
- **Headings**: Libre Bodoni (serif) — editorial elegance, magazine feel
- **Body**: Public Sans (sans-serif) — clean, readable, professional

### Import
```css
@import url('https://fonts.googleapis.com/css2?family=Libre+Bodoni:wght@400;500;600;700&family=Public+Sans:wght@300;400;500;600;700&display=swap');
```

### Tailwind Config
```css
/* In globals.css */
--font-heading: 'Libre Bodoni', serif;
--font-body: 'Public Sans', sans-serif;
```

### Type Scale
| Element | Font | Weight | Size | Line Height |
|---------|------|--------|------|-------------|
| H1 | Libre Bodoni | 700 | 2.5rem (40px) | 1.2 |
| H2 | Libre Bodoni | 600 | 2rem (32px) | 1.25 |
| H3 | Libre Bodoni | 600 | 1.5rem (24px) | 1.3 |
| H4 | Public Sans | 600 | 1.25rem (20px) | 1.4 |
| Body | Public Sans | 400 | 1rem (16px) | 1.6 |
| Small | Public Sans | 400 | 0.875rem (14px) | 1.5 |
| Caption | Public Sans | 500 | 0.75rem (12px) | 1.4 |

### Article Content Typography
| Element | Style |
|---------|-------|
| Article H1 | 2rem, 700, margin-bottom 1rem |
| Article H2 | 1.5rem, 600, margin-top 2rem, margin-bottom 0.75rem |
| Article H3 | 1.25rem, 600, margin-top 1.5rem, margin-bottom 0.5rem |
| Article P | 1.125rem, 400, line-height 1.8, margin-bottom 1rem |
| Article max-width | 65ch (optimal reading width) |

---

## Color System (CSS Variables Only)

**IMPORTANT**: The actual color values below are placeholders. They will be replaced when final brand colors are provided. The structure and variable names must NOT change.

### Light Mode
```css
:root {
  --background: 0 0% 98%;         /* #FAFAFA — paper white */
  --foreground: 240 10% 4%;       /* #09090B — near black */
  --card: 0 0% 100%;              /* #FFFFFF — pure white cards */
  --card-foreground: 240 10% 4%;  /* #09090B */
  --popover: 0 0% 100%;
  --popover-foreground: 240 10% 4%;
  --primary: 240 6% 10%;          /* #18181B — dark primary */
  --primary-foreground: 0 0% 98%;
  --secondary: 240 5% 96%;        /* #F4F4F5 */
  --secondary-foreground: 240 6% 10%;
  --muted: 240 5% 96%;
  --muted-foreground: 240 4% 46%; /* #71717A */
  --accent: 330 81% 60%;          /* #EC4899 — accent (CTA) */
  --accent-foreground: 0 0% 100%;
  --destructive: 0 84% 60%;
  --destructive-foreground: 0 0% 98%;
  --border: 240 5% 90%;           /* #E4E4E7 */
  --input: 240 5% 90%;
  --ring: 330 81% 60%;            /* Matches accent */
  --radius: 0.5rem;
}
```

### Dark Mode
```css
.dark {
  --background: 240 10% 4%;       /* #09090B */
  --foreground: 0 0% 98%;         /* #FAFAFA */
  --card: 240 6% 10%;             /* #18181B */
  --card-foreground: 0 0% 98%;
  --popover: 240 6% 10%;
  --popover-foreground: 0 0% 98%;
  --primary: 0 0% 98%;
  --primary-foreground: 240 6% 10%;
  --secondary: 240 4% 16%;
  --secondary-foreground: 0 0% 98%;
  --muted: 240 4% 16%;
  --muted-foreground: 240 5% 65%;
  --accent: 330 81% 60%;
  --accent-foreground: 0 0% 100%;
  --destructive: 0 63% 31%;
  --destructive-foreground: 0 0% 98%;
  --border: 240 4% 16%;
  --input: 240 4% 16%;
  --ring: 330 81% 60%;
}
```

### Usage Rules
- **NEVER** use hex, rgb, or hsl directly in `.tsx` files
- **ALWAYS** use Tailwind classes that reference CSS variables: `bg-primary`, `text-foreground`, `border-border`
- The accent color is used ONLY for: CTAs, active states, focus rings, links
- The primary color is used for: main text, headings, important UI elements
- Muted is used for: secondary text, timestamps, placeholders

---

## Spacing System (8px Grid)

| Token | Value | Use |
|-------|-------|-----|
| `--space-1` | 0.25rem (4px) | Tight inner padding |
| `--space-2` | 0.5rem (8px) | Default gap, padding |
| `--space-3` | 0.75rem (12px) | Form field padding |
| `--space-4` | 1rem (16px) | Card padding, section gap |
| `--space-6` | 1.5rem (24px) | Section padding |
| `--space-8` | 2rem (32px) | Large section gap |
| `--space-12` | 3rem (48px) | Page section gap |
| `--space-16` | 4rem (64px) | Hero spacing |

### Rule
All spacing must use multiples of 4px. No arbitrary values like `13px` or `7px`.

---

## Border Radius

| Token | Value | Use |
|-------|-------|-----|
| `--radius` | 0.5rem (8px) | Default (cards, inputs, buttons) |
| `--radius-sm` | calc(var(--radius) - 2px) | Small elements |
| `--radius-lg` | calc(var(--radius) + 2px) | Large containers |
| `--radius-full` | 9999px | Avatars, pills |

---

## Shadows

| Token | Use |
|-------|-----|
| `shadow-sm` | Subtle elevation (cards) |
| `shadow-md` | Dropdowns, popovers |
| `shadow-lg` | Modals, dialogs |
| None | Landing page, editorial content |

### Rule
Use shadows sparingly. The design philosophy favors borders over shadows.

---

## Icons

### Library: Lucide React
Already in the codebase. Consistent, clean, MIT licensed.

### Rules
- **NEVER** use emoji as UI icons
- **ALWAYS** use Lucide icons (`import { Icon } from "lucide-react"`)
- Size: `w-4 h-4` (16px) for inline, `w-5 h-5` (20px) for buttons, `w-6 h-6` (24px) for standalone
- Color: inherit from parent text color unless specifically overridden

---

## Animation

### Timing
| Type | Duration | Use |
|------|----------|-----|
| Micro | 150ms | Button hover, toggle |
| Standard | 200-250ms | Card hover, dropdown open |
| Page | 300ms | Page transitions, modal open |

### Rules
- Use `transition-colors duration-200` for hover states
- Use Framer Motion for page transitions and scroll reveals
- Respect `prefers-reduced-motion` — disable all animations if user prefers
- Never animate layout properties (width, height, margin) — only transform and opacity

---

## Responsive Breakpoints

| Breakpoint | Width | Target |
|------------|-------|--------|
| `sm` | 640px | Large phones |
| `md` | 768px | Tablets |
| `lg` | 1024px | Small laptops |
| `xl` | 1280px | Desktops |
| `2xl` | 1440px | Large screens |

### Dashboard Layout
- Mobile (< 768px): Sidebar hidden, hamburger menu
- Tablet (768-1024px): Collapsed sidebar (icons only)
- Desktop (> 1024px): Full sidebar (icons + labels)

### Content Width
- Article reading: `max-w-3xl` (768px)
- Dashboard content: `max-w-7xl` (1280px)
- Landing page sections: `max-w-6xl` (1152px)

---

## Pre-Delivery Checklist

Before any page is considered "done":

### Visual
- [ ] No hardcoded colors in the file
- [ ] No emoji icons (Lucide only)
- [ ] Hover states don't cause layout shift
- [ ] Both light and dark mode tested
- [ ] Borders visible in both modes

### Interaction
- [ ] All clickable elements have `cursor-pointer`
- [ ] Hover feedback on every interactive element
- [ ] Transitions are 150-300ms
- [ ] Focus states visible for keyboard navigation

### Responsive
- [ ] Tested at 375px, 768px, 1024px, 1440px
- [ ] No horizontal scroll on mobile
- [ ] Sidebar collapses properly on mobile

### Accessibility
- [ ] All images have alt text
- [ ] All form inputs have labels
- [ ] Color is not the only indicator
- [ ] `prefers-reduced-motion` respected

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

**FINAL COLORS**: Sage Green & Terracotta theme implemented. These are the production color values for the blog CMS. The structure and variable names must NOT change.

### Light Mode - Sage Green & Terracotta Theme
```css
@theme {
  --color-background: hsl(45 25% 96%);        /* #F5F1E8 — warm cream */
  --color-foreground: hsl(25 15% 15%);        /* #2C2416 — soft charcoal */
  --color-card: hsl(45 25% 98%);              /* #FAF7F0 — lighter cream */
  --color-card-foreground: hsl(25 15% 15%);
  --color-popover: hsl(45 25% 98%);
  --color-popover-foreground: hsl(25 15% 15%);
  --color-primary: hsl(180 15% 35%);          /* #4A6B5A — sage green */
  --color-primary-foreground: hsl(45 25% 96%);
  --color-secondary: hsl(45 20% 92%);         /* #E8EAE5 — light sage */
  --color-secondary-foreground: hsl(180 15% 35%);
  --color-muted: hsl(45 15% 88%);             /* #DADCD5 — subtle sage */
  --color-muted-foreground: hsl(25 10% 45%);  /* #6B5D4F — medium charcoal */
  --color-accent: hsl(15 65% 65%);            /* #C67E5B — warm terracotta */
  --color-accent-foreground: hsl(45 25% 96%);
  --color-destructive: hsl(0 84% 60%);
  --color-destructive-foreground: hsl(45 25% 96%);
  --color-border: hsl(45 15% 85%);            /* #E0E5DD — soft borders */
  --color-input: hsl(45 25% 96%);
  --color-ring: hsl(180 15% 35%);             /* Matches primary */
  --radius: 0.5rem;
}
```

### Dark Mode - Sage Green & Terracotta Theme
```css
.dark {
  --color-background: hsl(25 15% 8%);         /* #1A1612 — dark charcoal */
  --color-foreground: hsl(45 25% 92%);        /* #F5F1E8 — light cream */
  --color-card: hsl(25 15% 12%);              /* #2C2416 — darker charcoal */
  --color-card-foreground: hsl(45 25% 92%);
  --color-popover: hsl(25 15% 12%);
  --color-popover-foreground: hsl(45 25% 92%);
  --color-primary: hsl(170 20% 60%);          /* #7BA89A — lighter sage */
  --color-primary-foreground: hsl(25 15% 8%);
  --color-secondary: hsl(25 15% 18%);         /* #3A342C — medium charcoal */
  --color-secondary-foreground: hsl(170 20% 60%);
  --color-muted: hsl(25 15% 22%);             /* #4A433A — subtle dark */
  --color-muted-foreground: hsl(45 15% 65%);  /* #B5ACA0 — muted light */
  --color-accent: hsl(10 55% 70%);            /* #D8997B — muted terracotta */
  --color-accent-foreground: hsl(25 15% 8%);
  --color-destructive: hsl(0 63% 31%);
  --color-destructive-foreground: hsl(45 25% 92%);
  --color-border: hsl(25 15% 25%);            /* #5A5247 — dark borders */
  --color-input: hsl(25 15% 18%);
  --color-ring: hsl(170 20% 60%);             /* Matches primary */
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

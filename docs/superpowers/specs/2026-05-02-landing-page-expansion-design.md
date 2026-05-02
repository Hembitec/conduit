# Design Spec: Conduit Landing Page Expansion

**Date:** 2026-05-02  
**Topic:** Landing Page Redesign (Phase 9)  
**Status:** Draft

## 1. Vision & Purpose
Transform the current "thin" landing page into a comprehensive, high-fidelity showcase of Conduit's capabilities. The goal is to demonstrate that Conduit is a professional-grade content engine, not just a simple blog.

## 2. Approach: Feature-First Showcase
The page will be organized into 10 distinct, high-impact sections, each highlighting a specific pillar of the application. We will use advanced animations (Framer Motion, MagicUI) and interactive visual components.

## 3. Section-by-Section Design

### 1. Hero Section (The Hook)
*   **Visual:** Large, bold typography using `AnimatedGradientText`.
*   **Copy:** "Write once. Publish everywhere." or "The Content Engine for Modern Writers."
*   **Action:** Primary "Get Started" and secondary "View Demo" buttons.

### 2. Interactive Dashboard Showcase
*   **Visual:** Simulated Dashboard UI with "Border Beam" animation.
*   **Interaction:** Floating analytics cards that update their numbers on scroll/hover.
*   **Purpose:** Instant proof of the clean, professional CMS interface.

### 3. The "Focused Writing" Editor
*   **Visual:** A close-up view of the TipTap editor UI.
*   **Highlights:** Auto-save indicator (pulsing green), Markdown support, and R2 drag-and-drop image uploads.
*   **Copy:** Focus on "Distraction-free environment."

### 4. How It Works (3-Step Flow)
*   **Visual:** Three animated cards: 1. Create, 2. Publish, 3. Scale.
*   **Connectivity:** A subtle "data flow" line connecting the steps.

### 5. Insight Engine (Analytics)
*   **Visual:** A beautiful, animated bar chart (simulating Recharts).
*   **Features:** Mention view tracking, reading time, and engagement trends.

### 6. Total Portability (The API Section)
*   **Visual:** The "Visual Integration" graphic we designed.
*   **Concept:** Conduit as the central hub feeding a Portfolio, Docs site, and Mobile App.
*   **Copy:** Highlight the `GET /api/blog/all` endpoint and SaaS scoping.

### 7. Built-in SEO Suite
*   **Visual:** A checklist or grid of technical SEO features.
*   **Items:** Dynamic Sitemaps, RSS Feeds, JSON-LD, and Robots.txt.
*   **Copy:** "Optimized for Google, out of the box."

### 8. Engagement & Community
*   **Visual:** A split section showing the Newsletter signup and Comment moderation UI.
*   **Purpose:** Show that Conduit helps build and manage an audience.

### 9. Technical Excellence (The Stack)
*   **Visual:** Logos/icons of Convex, Next.js, Cloudflare R2, and React 19.
*   **Copy:** "Built on the edge for zero latency and infinite scale."

### 10. Final Call to Action & Footer
*   **Visual:** High-contrast dark section with a big "Start Your Journey" button.
*   **Footer:** Links to CMS, Auth, and social channels.

## 4. Technical Implementation Details
*   **Animation Library:** `framer-motion` for reveal-on-scroll and entry animations.
*   **Visual Effects:** `magicui` for "Border Beam" and "Animated Gradient Text".
*   **Responsive Strategy:** Each section will be built with a `max-w-6xl` container, optimized for mobile (375px) through desktop (1440px).
*   **Performance:** Images will use `next/image` for WebP optimization; CSS variables will ensure zero hardcoded colors.

## 5. Success Criteria
*   The landing page tells a complete story of the product.
*   The API features are clearly explained through the visual graphic.
*   The page feels "alive" through subtle, purposeful animations.
*   Responsive layout is flawless with zero horizontal scrolling.

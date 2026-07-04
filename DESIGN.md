# Design System: Darlington Wosa Art & Frames Ltd

This document serves as the proposed comprehensive Design System (DESIGN.md equivalent) for the Darlington Wosa Art & Frames Ltd platform. It defines the visual and interaction foundation needed to achieve a premium, futuristic luxury experience that feels like an Apple-tier digital art gallery, with Awwwards-quality interactive execution.

---

## 1. Colour System

We are using a deeply immersive, high-contrast dark theme to allow the artwork to stand out, accented by premium gold.
* **Background (Base)**: `#000000` (True Black) – provides a void-like, infinite canvas feel.
* **Surface (Elevated)**: `#0A0A0A` to `#111111` – ultra-subtle off-blacks for cards and overlays.
* **Primary Accent (Gold)**: `#9E651B` – used strictly for interactive elements, narrative brush strokes, and luxury highlights.
* **Secondary Accent**: `#C88D3D` (Lighter gold for hover glows and fine particle effects).
* **Text (Primary)**: `#FFFFFF` (Pure White) – for hero headings and critical UI labels.
* **Text (Secondary)**: `#A3A3A3` (Muted Gray) – for body copy (ensuring ≥4.5:1 contrast).

## 2. Typography System

* **Display/Headings**: *Outfit* or *Clash Display* (Geometric, clean, modern). Used for high-impact hero text and artwork titles.
* **Body/UI**: *Inter* or *SF Pro* (Clean, legible, neutral). Used for descriptions, forms, and dashboard data.

## 3. Spacing & Layout System

* **Base Unit**: `8px` scale.
* **Layout Grid**: 12-column CSS Grid. Max container width: `1800px` (for cinematic ultra-wide exhibition).
* **Section Rhythm**: Massive breathing room. `160px` to `240px` (`10rem` - `15rem`) between major sections to let the art breathe.

## 4. Border Radius & Shadows (Revised)

Moving away from harsh corporate lines, the geometry is softer and more tactile.
* **Border Radius**: Artistic and organic.
  * Buttons/Inputs: `4px` to `6px` for a soft, tactile, high-end product feel.
  * Cards/Gallery images: Soft, natural edges (e.g., `8px`) or organic, slightly asymmetrical curves (e.g., `border-radius: 3px 8px 4px 6px` on specific creative overlays) to mimic the slight imperfection of hand-cut paper or stretched canvas.
  * Structural lines: Often replaced by "painted" SVG underlines or charcoal smudges rather than CSS borders.
* **Shadow System**: 
  * *Hover Glow*: `0 0 30px rgba(158, 101, 27, 0.15)` (Subtle, blooming gold aura).
  * *Elevation*: Created via 1px glassmorphic borders (`rgba(255,255,255,0.05)`) and backdrop blurring.

---

## 5. Artistic Object System

A library of high-fidelity, interactive digital assets deployed throughout the interface to simulate a physical creative workspace.
* **Tools**: Realistic 3D or high-res 2D pencils, graphite sticks, charcoal pieces, fine brushes, and palette knives. These act as scroll-triggered conductors (e.g., a pencil drawing a line that becomes a section divider).
* **Particles & Textures**: Floating charcoal dust (slowly rotating particles reacting to mouse movement on dark backgrounds), liquid paint splashes (fluid section transitions), and canvas grain overlays.
* **Frame Pieces**: Wooden molding, glass glints, and matte boards that fly in and assemble dynamically.

---

## 6. Homepage Scroll Narrative (The Journey)

The homepage is not a stack of UI sections; it is a chronological journey of creation.
* **Phase 1: The Hero Experience (Creation)**
  * The screen loads as a textured, deep dark canvas. 
  * A hyper-realistic pencil (or charcoal) enters and begins rapidly sketching lines on the screen in real-time.
  * The sketch fluidly crossfades into a vibrant, finished painting.
  * A dynamic brush stroke sweeps across, unmasking the brand text: *"Darlington Wosa Art & Frames"*, establishing immediate awe.
* **Phase 2: The Framing Process (Scroll 1)**
  * As the user scrolls down, the finished artwork scales down slightly into 3D space.
  * Individual frame pieces (wood, matte, glass) fly in from the edges of the screen, assembling themselves seamlessly around the artwork.
* **Phase 3: The Exhibition (Scroll 2)**
  * The newly framed artwork moves deeper into a virtual gallery space, hanging itself on a wall.
  * The camera pans to reveal the functional platform: the "Featured Artworks" and "Services" grid, smoothly transitioning the user from the narrative into the browsing and booking experience.

---

## 7. Motion Design Specification

*This is the core of the "alive" feeling, targeting Awwwards-level execution.*

* **Easing Curves**: 
  * UI Elements: `cubic-bezier(0.16, 1, 0.3, 1)` (Expo Out) - snappy but smooth.
  * Narrative Shifts: `cubic-bezier(0.76, 0, 0.24, 1)` (Expo In-Out) - dramatic, theatrical pacing.
* **Loading States**: "Canvas Preparation." Instead of a spinner, the screen shows a subtle canvas texture fading in, with a single drop of gold paint expanding to reveal the site.
* **Hover States**: 
  * *Artworks*: Slow internal scale (`1.05` over `1.5s`), revealing a subtle gold backlight (`box-shadow`).
  * *Text/Links*: Hovering triggers a "brush stroke" SVG reveal underneath the text, rather than a generic CSS underline.
* **Page Transitions**: "Ink Spread." Navigating between routes uses a custom WebGL or SVG fluid mask that looks like black ink spreading across the screen, clearing to reveal the next page.
* **Scroll Interactions**:
  * Utilize smooth scrolling (e.g., Lenis) for fluid interpolation.
  * Elements are "drawn" or "unmasked" into view; nothing simply fades in.
  * Deep Z-axis parallax on floating charcoal dust particles.
  * Art tools move alongside the user's scroll position, interacting with UI elements as they pass by.
* **Micro-interactions**: 
  * Clicking a button feels tactile, like pressing into canvas.
  * Forms validate with a fluid, organic checkmark drawn dynamically in real-time.

---

## 8. Component Specifications

### Buttons
* **Primary**: Black background, soft `6px` radius, 1px Gold border (`#9E651B`), White text. On hover, a gold liquid fill effect sweeps across. Transition: `0.4s ease-out`.
* **Secondary**: Transparent background, 1px subtle white/gray border.
* **Text Link**: White text with a painted gold underline that unmasks left-to-right on hover.

### Forms (Booking & Contact)
* **Inputs**: Underline-only inputs, drawn dynamically on focus. No harsh bounding boxes. On focus, the underline glows Gold (`#9E651B`) and the label floats up elegantly.
* **UX**: Extremely minimal, spacious fields. "Apple checkout" level of frictionless UI.

### Cards (Services/Articles)
* **Design**: Soft `8px` radius. Frameless imagery floating above a title and description. 
* **Interaction**: Hovering triggers a subtle gold glow and a "charcoal dust" cursor trail effect over the card. No nested cards.

### Gallery Components
* **Grid**: Masonry or horizontal scroll "exhibition" tracks. 
* **Museum Mode**: Clicking an artwork expands it full-screen via the Web Animations API (seamless layout transition), fading all UI out to focus entirely on the art.

### Dashboard Components (Customer Portal)
* **Layout**: Fixed sidebar navigation with a spacious, breathable main content area.
* **Data**: Minimalist tables and artistic progress trackers for framing/art projects. Status indicators use subtle glowing dots (Gold for 'In Progress', White for 'Completed').

### Booking Components
* **Flow**: Step-by-step progressive disclosure wizard. Only one decision per screen (e.g., 1. Select Service, 2. Upload Reference, 3. Timeline). 
* **UI**: Large, comfortable tap targets, with smooth lateral sliding transitions between steps.

---

## 9. Progressive Enhancement & Performance Resilience

All artistic motion and visual effects are implemented strictly as progressive enhancements to ensure the platform remains accessible and high-performing globally.
* **Core Usability Guarantee**: Conversions, forms, and portfolio browsing will NEVER be blocked by or depend on an animation completing. Content must be present in the DOM and readable immediately.
* **JavaScript Delayed/Failed**: A robust CSS-only fallback layout ensures the site is 100% usable (no invisible elements perpetually waiting for JS to unhide them).
* **WebGL/Canvas Failures**: 3D objects and fluid shaders gracefully degrade to high-quality static assets or standard CSS transitions.
* **Low-Power Devices**: The site will detect hardware frame rates (or utilize connection hints) and automatically disable particle physics and heavy shaders on low-tier mobile devices to preserve battery and maintain a silky 60fps scroll.
* **Reduced Motion**: Respects `prefers-reduced-motion: reduce` OS settings. The chronological scroll narrative converts into an elegant, static museum-style layout with simple opacity crossfades instead of deep parallax, scale effects, or flying objects.

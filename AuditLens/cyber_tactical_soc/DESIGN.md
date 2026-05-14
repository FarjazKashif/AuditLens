---
name: Cyber-Tactical SOC
colors:
  surface: '#131315'
  surface-dim: '#131315'
  surface-bright: '#39393b'
  surface-container-lowest: '#0e0e10'
  surface-container-low: '#1c1b1d'
  surface-container: '#201f22'
  surface-container-high: '#2a2a2c'
  surface-container-highest: '#353437'
  on-surface: '#e5e1e4'
  on-surface-variant: '#bbc9cd'
  inverse-surface: '#e5e1e4'
  inverse-on-surface: '#313032'
  outline: '#859397'
  outline-variant: '#3c494c'
  surface-tint: '#2fd9f4'
  primary: '#8aebff'
  on-primary: '#00363e'
  primary-container: '#22d3ee'
  on-primary-container: '#005763'
  inverse-primary: '#006877'
  secondary: '#adc6ff'
  on-secondary: '#002e6a'
  secondary-container: '#0566d9'
  on-secondary-container: '#e6ecff'
  tertiary: '#ffd6a3'
  on-tertiary: '#462b00'
  tertiary-container: '#ffb13b'
  on-tertiary-container: '#6e4600'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#a2eeff'
  primary-fixed-dim: '#2fd9f4'
  on-primary-fixed: '#001f25'
  on-primary-fixed-variant: '#004e5a'
  secondary-fixed: '#d8e2ff'
  secondary-fixed-dim: '#adc6ff'
  on-secondary-fixed: '#001a42'
  on-secondary-fixed-variant: '#004395'
  tertiary-fixed: '#ffddb5'
  tertiary-fixed-dim: '#ffb957'
  on-tertiary-fixed: '#2a1800'
  on-tertiary-fixed-variant: '#643f00'
  background: '#131315'
  on-background: '#e5e1e4'
  surface-variant: '#353437'
typography:
  headline-lg:
    fontFamily: Geist
    fontSize: 32px
    fontWeight: '600'
    lineHeight: '1.2'
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Geist
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.2'
  headline-sm:
    fontFamily: Geist
    fontSize: 18px
    fontWeight: '600'
    lineHeight: '1.4'
  body-lg:
    fontFamily: Geist
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.5'
  body-md:
    fontFamily: Geist
    fontSize: 14px
    fontWeight: '400'
    lineHeight: '1.5'
  body-sm:
    fontFamily: Geist
    fontSize: 13px
    fontWeight: '400'
    lineHeight: '1.4'
  data-mono:
    fontFamily: JetBrains Mono
    fontSize: 13px
    fontWeight: '450'
    lineHeight: '1.5'
  code-sm:
    fontFamily: JetBrains Mono
    fontSize: 11px
    fontWeight: '400'
    lineHeight: '1.2'
  label-caps:
    fontFamily: JetBrains Mono
    fontSize: 10px
    fontWeight: '700'
    lineHeight: '1'
    letterSpacing: 0.05em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  unit: 4px
  gutter: 16px
  margin-mobile: 16px
  margin-desktop: 24px
  sidebar-width: 260px
  pane-min-width: 320px
---

## Brand & Style

This design system is built for high-stakes cybersecurity environments where precision, speed, and vigilance are paramount. The brand personality is "The Command Center"—authoritative, technical, and hyper-focused. It targets security analysts and SOC operators who require high information density without cognitive overload.

The visual style is a fusion of **Technical Minimalism** and **Modern Glassmorphism**. It utilizes a dark-mode-first approach to reduce eye strain during long shifts, punctuated by neon accents that draw immediate attention to critical threats. The interface should feel like a "live system," utilizing subtle animations and glowing indicators to signal real-time data processing.

## Colors

The palette is anchored in deep blacks and charcoals to establish a canvas of "infinite depth." 

- **Primary Accent:** Neon Cyan (#22d3ee) is used for active states, primary actions, and "all clear" indicators. It should have a subtle outer glow (0 0 8px rgba(34, 211, 238, 0.4)) when used in critical UI elements.
- **Surface Tiers:** Use #09090b for global backgrounds and #18181b for elevated containers or cards.
- **Semantic Severity:** 
    - **Critical (Red):** Used only for immediate threats and high-priority alerts.
    - **Warning (Orange):** Used for suspicious activity requiring investigation.
    - **Elevated (Yellow):** Used for minor anomalies.
- **Technical Blue:** Muted blue highlights are used for selection states and secondary data visualizations to differentiate from primary cyan actions.

## Typography

This design system utilizes a dual-font strategy. **Geist** handles the structural UI, providing a modern, legible, and "clean-room" aesthetic. For all technical data, logs, IP addresses, and system metrics, **JetBrains Mono** is used to ensure maximum character differentiation and a professional, terminal-inspired feel.

Typography is scaled for high-density layouts. Headers are kept tight and efficient, while labels use all-caps monospace to denote metadata categories. Use `data-mono` for any string that an analyst might need to copy-paste or compare character-by-character.

## Layout & Spacing

The layout philosophy centers on a **Flexible Split-Pane Model**, allowing analysts to resize panels for side-by-side log investigation and graph analysis. 

- **Grid:** A 12-column fluid grid is used for dashboard views, while investigation views utilize a dynamic layout with 1px dividers.
- **Rhythm:** An 8px base unit (4px for compact components) ensures tight alignment. 
- **Density:** Components are "Compact" by default. Internal padding within cards should be 16px, but list items in logs should be 4px to 8px to maximize visible rows.
- **Breakpoints:**
    - Mobile (<768px): Single pane view, collapsed sidebar.
    - Tablet (768px - 1280px): Dual pane (List/Detail).
    - Desktop (>1280px): Multi-pane (Navigation / Feed / Analysis / Intelligence).

## Elevation & Depth

This design system avoids traditional drop shadows in favor of **Tonal Layering** and **Glassmorphism**.

1.  **Surfaces:** The base layer is pure black (#09090b). Secondary containers use #18181b with a 1px border of `white/10`.
2.  **Glass Effect:** Modals, dropdowns, and floating toolbars must use `backdrop-blur: 12px` and a semi-transparent background (e.g., `rgba(24, 24, 27, 0.8)`).
3.  **Borders:** Depth is primarily defined by thin, high-precision borders. Use `rgba(255, 255, 255, 0.1)` for standard borders and `rgba(34, 211, 238, 0.3)` for active or "focused" states.
4.  **Grid Overlays:** Technical cards should feature a subtle, low-opacity background grid pattern (e.g., 20px squares in `rgba(255, 255, 255, 0.02)`) to reinforce the "instrumentation" feel.

## Shapes

The shape language is "Soft-Technical." Elements use a consistent **4px (0.25rem)** border radius. This provides a professional, modern look that remains disciplined and structured. 

- **Buttons & Inputs:** 4px radius.
- **Cards & Panes:** 6px radius.
- **Status Indicators:** Fully circular (pill) for "Live" lights, but square-with-radius for severity chips.
- **Selection Brackets:** For active table rows, use a 2px vertical "accent bar" on the left instead of fully rounding the row corners.

## Components

- **Technical Buttons:** Small height (32px), JetBrains Mono text, 1px border. Primary buttons use a subtle cyan glow on hover.
- **Glowing Status Indicators:** Small 8px circles. For "Live" status, apply a CSS pulse animation. 
    - *Critical:* Red glow pulse.
    - *Healthy:* Cyan solid.
- **Technical Cards:** Feature a header row with a `label-caps` title and a 1px bottom border. Backgrounds may include a subtle dot-matrix or grid pattern.
- **Input Fields:** Dark background (#09090b), 1px border (#white/10). On focus, the border changes to Cyan with a 2px outer glow. Use monospace for text entry.
- **Severity Chips:** Small, rectangular badges with low-opacity background fills (15% opacity) and 100% opacity text of the same semantic color.
- **Split-Pane Dividers:** 1px width, color #27272a. Feature a small 4-dot "handle" icon in the center for resizability.
- **Timeline Logs:** A vertical list where the timestamp is in `code-sm` (muted grey) and the event message is in `data-mono`. High-priority lines receive a full-width subtle red tint.
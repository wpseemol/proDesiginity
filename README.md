# esignity PRO · Design System & Component Reference

![Version](https://img.shields.io/badge/version-1.0.0-purple)
![Theme](https://img.shields.io/badge/theme-Modern%20Dark%20UI-blueviolet)

> **Organization:** esignity PRO
> **Repository Type:** Brand Identity, UI System, and Frontend Component Reference

---

## 📖 About This Repository

This repository serves as the **master reference** for the esignity PRO brand identity. It contains the core design schema, CSS variables, and fundamental UI components.

Use this README to manually style new web pages, or **pass this file directly to AI agents** to ensure all future generated code, designs, or content strictly adhere to our distinct aesthetic: _Dark Mode, Glassmorphism, and the Purple-Blue Gradient Identity._

---

## 🎨 Thematic Color Schema (The esignity PRO Palette)

These are the master CSS variables for our organization. All UI components should strictly adhere to these definitions.

### CSS Variables (`:root`)

You can embed this directly into the `:root` of any CSS file to instantly apply our theme:

```css
:root {
    /* Backgrounds */
    --bg-dark: #0b0d17; /* Deep black-blue primary background */

    /* Brand Gradients & Base Colors */
    --primary-purple: #7c3aed; /* Base purple (left side of gradient) */
    --primary-blue: #3b82f6; /* Base blue (right side of gradient) */
    --brand-orange: #f97316; /* Accent color (matches the dot on the 'i' in logo) */

    /* Text & Typography */
    --text-white: #ffffff; /* Headlines & primary text */
    --text-muted: #94a3b8; /* Body text & secondary descriptions */

    /* Glassmorphism Effects */
    --glass-bg: rgba(255, 255, 255, 0.03); /* Subtle glass base overlay */
    --glass-border: rgba(255, 255, 255, 0.08); /* Glass border thickness */
}
```

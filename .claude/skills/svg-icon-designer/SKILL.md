---
name: svg-icon-designer
description: Design high-quality SVG icon sets in a medical/dental technical illustration style. Use this skill whenever you need to create, design, or generate SVG icons, icon sets, or pictograms — especially for medical, dental, healthcare, or scientific applications. Also use when the user mentions icon design, SVG icons, custom icon sets, or wants visually detailed (not minimal/outline) icons. The style produced is semi-realistic medical illustration with fill regions, anatomical detail lines, and professional quality — not simple line/outline icons.
---

# SVG Icon Designer — Medical Technical Illustration Style

## Design Philosophy

These icons sit between minimal line icons and full illustration. Think of the kind of technical diagrams you see in dental textbooks, surgical instrument manuals, or medical device interfaces: anatomically grounded, structured, clear at small sizes, but with enough visual richness to convey professional medical context.

The goal is that a dental professional looks at these icons and immediately recognizes the anatomical structure or clinical action — not just an abstract shape that needs a label to decode.

## Style Rules

### Visual Weight
- Use **fill + stroke** combination. Solid fill regions for primary shapes, stroke for outlines and detail lines.
- Primary shapes should have a fill opacity of 0.08–0.15 (subtle tint) with a 1.5–2px stroke. This creates depth without heaviness.
- Detail lines (fissures, roots, surfaces) use 0.8–1px stroke with reduced opacity (0.3–0.5).
- Small accent dots or marks use filled circles with full or near-full opacity.

### Anatomy Over Abstraction
- When an icon represents a dental arch, draw recognizable tooth silhouettes with cusps — not just a smooth arc.
- When representing occlusion, show the relationship between upper and lower arches with contact points.
- When representing a tool or action, anchor it to a dental context (e.g., a scanner tip near a tooth surface, not a floating abstract shape).

### Color System
Use this palette. It avoids the BMW-style cold blue and goes for a warmer, more clinical feel:

- `--icon-primary`: #2d4a5e (dark teal — main stroke and fill base)
- `--icon-secondary`: #5a8a9e (medium teal — secondary elements, lighter strokes)
- `--icon-accent`: #e8734a (warm coral — highlights, active states, important markers)
- `--icon-fill-light`: rgba(45, 74, 94, 0.10) (very subtle fill for primary regions)
- `--icon-fill-mid`: rgba(45, 74, 94, 0.18) (slightly stronger fill for emphasis areas)
- `--icon-detail`: rgba(45, 74, 94, 0.35) (detail lines — fissures, roots, texture)
- `--icon-bg`: #f5f5f0 (warm off-white for preview backgrounds)
- `--icon-bg-dark`: #1e2a33 (dark teal-navy for dark mode preview)

When generating SVG markup, use these colors directly (not CSS variables, since the SVGs should be self-contained). For the `currentColor` approach, the primary stroke should use `currentColor` and fills should use the rgba values — this allows CSS color override while keeping the fills.

### Technical Specs
- **ViewBox**: 24 24 (standard)
- **Stroke width**: 1.6px for primary outlines, 0.9px for detail lines, 2.2px for emphasis
- **Stroke-linecap**: round
- **Stroke-linejoin**: round
- **No shadows, no gradients, no blur filters** — depth comes from fill opacity layers and line weight contrast, not effects.

## Icon Construction Process

When generating icons, follow this sequence:

### 1. Analyze the Icon Request
For each icon name/description, identify:
- What anatomical structure or clinical action does it represent?
- What is the most recognizable view/angle? (occlusal, buccal, mesial, cross-section, etc.)
- What level of detail is appropriate at 24x24? (Some detail must be simplified but key features preserved)

### 2. Build the Primary Shape
Start with the main silhouette as a filled+stroked path. This should be immediately recognizable even at small sizes.

### 3. Add Anatomical Detail
Layer in the secondary detail lines — tooth cusps, fissure patterns, root outlines, surface contours. These use thinner strokes and lower opacity.

### 4. Add Accent Marks
Small filled circles, accent strokes, or coral-colored highlights that draw attention to the key feature of the icon (e.g., the scan path, the contact point, the undercut region).

### 5. Verify at Size
Ensure the icon is legible at 16px, 20px, 24px, and 32px. If detail lines disappear at 16px, reduce the number of detail elements rather than making them thicker.

## SVG File Structure

Each SVG file should be self-contained:

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="none">
  <!-- Primary shape: fill tint + stroke -->
  <path d="..." fill="rgba(45,74,94,0.10)" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
  <!-- Detail lines -->
  <path d="..." stroke="currentColor" stroke-width="0.9" opacity="0.35" stroke-linecap="round" stroke-linejoin="round"/>
  <!-- Accent -->
  <circle cx="..." cy="..." r="0.8" fill="#e8734a"/>
</svg>
```

For icon sprite sheets (symbol definitions), wrap in `<symbol>`:

```svg
<symbol id="icon-name" viewBox="0 0 24 24" fill="none">
  ...
</symbol>
```

## Output Requirements

When the user requests icons:

1. **Create individual SVG files** in the specified output directory, one file per icon.
2. **Create an HTML preview page** (`preview.html`) in the same directory that shows:
   - All icons in a grid
   - Each icon displayed at 16px, 20px, 24px, 32px, and 48px
   - Both light background (#f5f5f0) and dark background (#1e2a33) previews
   - Icon name label below each
   - Active/hover state preview (icon on coral accent background)
3. If the user is working with an existing project, also offer to create a sprite sheet `<svg>` block that can be embedded inline.

## Common Dental Icon Reference

These are frequently needed icons for dental scanner applications. Use them as reference for anatomical accuracy:

| Icon | Description | Key Visual Elements |
|------|-------------|-------------------|
| **maxilla** | Upper dental arch (occlusal view) | Horseshoe shape opening downward, individual tooth cusps visible as rounded bumps along inner edge, broader at molars |
| **mandible** | Lower dental arch (occlusal view) | Narrower U-shape opening upward, tooth cusps as bumps along inner edge, more parallel at premolar-molar region |
| **occlusion** | Bite/occlusal relationship | Lateral or anterior view showing upper and lower arches in contact, or cross-section showing cusp-fossa relationship with contact points |
| **smart-scan** | AI-guided scanning | Scanner probe tip near tooth surface with scan path arc, suggests intelligent coverage |
| **tissue-filter** | Soft tissue removal | Tooth silhouette with gingival overlay being separated/filtered, suggests layer distinction |
| **crop** | Region selection | Dental arch with a rectangular or elliptical selection over a specific area |
| **undercut** | Undercut detection | Cross-section of tooth crown showing undercut areas (the narrow part below the wider top), typically marked with accent color |
| **quality-check** | Scan quality verification | Dental arch with coverage indicator (grid or percentage), suggests completeness assessment |
| **screenshot** | Capture current view | Camera frame with dental arch silhouette visible inside |
| **scanner** | Handheld scanner device | Scanner wand/probe shape with scanning tip and body |

## Anatomical Accuracy Notes

- **Maxillary arch** is wider and more parabolic. Molars are larger. The arch opens toward the bottom in occlusal view.
- **Mandibular arch** is narrower, more U-shaped, with more parallel posterior segments. Opens toward the top in occlusal view.
- **Occlusal surfaces** have distinct cusp patterns: molars have 4-5 cusps, premolars have 2, canines have 1 prominent cusp, incisors have a flat edge.
- **Buccal view** of occlusion shows the cheek-side profile: upper cusps hang down, lower cusps point up, they interdigitate.
- **Cross-sections** are useful for undercut, root, and internal structure icons.

When in doubt about anatomy, prioritize recognizability over anatomical precision. A dental professional should see the icon and think "yes, that's an upper arch" or "that's a buccal cross-section" — not "what is that shape supposed to be?"

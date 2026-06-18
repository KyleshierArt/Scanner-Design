# Scanner UI Style Guide

Last updated: 2026-06-18

## Design Direction

The visual direction follows Apple's design language: refined, softly rounded, high-clarity, and museum-grade. It should feel like premium clinical software with an Apple-level attention to surface, depth, and typographic precision.

Inspired by: Apple design system (see `awesome-design-md/apple/DESIGN.md`)

Keywords:

- Apple Action Blue
- pill-shaped buttons and badges
- 600/400 weight contrast
- frosted glass surfaces
- negative letter-spacing
- rounded corners (8-18px)
- subtle depth via backdrop blur and shadows

Avoid:

- rectangular (0px radius) buttons or cards;
- uppercase labels with letter-spacing (BMW holdover);
- heavy ink borders for focus states;
- solid black overlays without blur;
- competing accent colors;
- light body text (always 600 for UI labels, 400 for body);
- small icon-only controls without state labels or tooltips.

## Layout Principles

The scan view uses a canvas-first floating overlay pattern. The dark canvas fills the entire viewport — no full-width or full-height chrome bands. All UI elements float over the canvas as frosted-glass panels with consistent visual treatment.

Patient list view uses a traditional sidebar + detail layout with a top bar (this is a different interaction mode).

Scan view zones:

1. Floating header chip (top-left): back button, app brand, case name, save action.
2. Floating window controls (top-right): minimize, maximize, close.
3. Floating stage bar (top-center): pill-shaped stage tabs (Maxilla, Mandible, Occlusion, Complete).
4. Floating tool palette (left): vertical icon strip with device status.
5. Dark canvas (full viewport): 3D scan preview, grid, guidance overlay.
6. Camera preview (bottom-right): live camera feed, resizable.
7. Bottom center: scan controls and progress overlay.

All floating overlays share the same visual language: `rgba(0,0,0,0.55)` background, `backdrop-filter: blur(20px)`, `border-radius: 18px` (or pill), subtle `1px rgba(255,255,255,0.08)` border. This creates a consistent frosted-glass-on-dark aesthetic that matches how Medit and 3Shape present their scan workspaces.

## First Layout Hypothesis

Target initial viewport: 1440 x 900 and 1920 x 1080.

- Canvas: fills viewport edge-to-edge, dark (#1d1d1f) background.
- Header chip: floats top-left with 17px margin, frosted glass.
- Window controls: floats top-right with 17px margin, frosted glass.
- Stage bar: floats top-center with 17px top margin, frosted pill container.
- Tool palette: floats left with 17px left margin, 72px top offset, frosted glass.
- Camera preview: anchored bottom right, around 320 x 220; resizable.
- Bottom center controls: floating scan operations, pill-shaped actions.
- Guidance pill: floating above scan controls, frosted dark glass.

## Color Tokens

Apple-inspired palette:

- `--color-brand`: #0066cc (Apple Action Blue — single primary action color)
- `--color-brand-strong`: #0055b3 (pressed state)
- `--color-brand-soft`: #e8f1fb (light brand tint for backgrounds)
- `--color-brand-focus`: #0071e3 (hover/focus state)
- `--color-brand-on-dark`: #2997ff (blue on dark surfaces)
- `--color-danger`: #dc2626
- `--color-warning`: #f59e0b
- `--color-success`: #22c55e
- `--color-canvas`: #ffffff (pure white base)
- `--color-canvas-dark`: #1d1d1f (Apple dark — scan canvas only)
- `--color-canvas-parchment`: #f5f5f7 (Apple signature light grey)
- `--color-surface`: #ffffff (white card)
- `--color-surface-muted`: #f5f5f7 (soft grey)
- `--color-surface-strong`: #e8e8ed (heavier grey)
- `--color-surface-pearl`: #fafafc (near-white)
- `--color-border`: #e0e0e0 (1px dividers)
- `--color-border-strong`: #c0c0c0 (emphasis borders)
- `--color-text`: #1d1d1f (ink — primary/display)
- `--color-text-body`: #333333 (running text)
- `--color-text-muted`: #7a7a7a (secondary text)
- `--color-text-subtle`: #999999 (disabled/fine print)
- `--color-disabled`: #d2d2d7

Notes:

- Apple Blue (#0066cc) is the single brand action color. Do not add competing accent colors.
- Depth comes from backdrop-blur, subtle shadows, and parchment/white layering — never from heavy borders or ink outlines.
- Use red only for destructive or scan-critical warnings.

## Typography

SF Pro Display / Text as the type system (system-ui fallback):

```css
font-family: "SF Pro Display", "SF Pro Text", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
```

Suggested scale (Apple signature: 600 display vs 400 body with negative tracking):

- Page/case title: 17px, 600, -0.374px tracking.
- Stage label: 15px, 600 (active) / 400 (inactive), -0.224px tracking.
- Body/description: 17px, 400 (Regular — Apple editorial voice), -0.374px tracking.
- Helper text: 14px, 400, -0.224px tracking.
- Status badges/labels: 14px, 600, 0 tracking.
- Button labels: 17px, 400 (pill buttons) or 300 (hero pills), 0 tracking.

Keep text short. In chairside use, guidance should be scannable in one glance.

Negative letter-spacing at display sizes is the Apple typographic signature — it creates a tighter, more refined reading experience.

## Components

### Stage Navigation

Default stages:

- Maxilla
- Mandible
- Occlusion
- Complete

Each stage needs these states:

- pending;
- active;
- scanned;
- warning;
- disabled.

Stage navigation uses pill-shaped tabs on a parchment background. Active state gets inverted fill (dark background, white text). Scanned state gets green text on soft green background. Do not rely only on color.

### Tool Buttons

Tool buttons need clear states:

- default;
- hover;
- pressed;
- selected (brand blue fill, white icon);
- disabled.

Use 44px minimum hit target. Rounded corners (8px radius). Selected tool gets solid brand-blue background with rounded corners. For first demo, use tooltips for icon buttons.

### Scanner Status

Status should always be visible:

- Not connected;
- Ready;
- Scanning;
- Paused;
- Processing;
- Complete;
- Error.

Prefer a small status card in the left rail/footer area plus a compact top indicator.

### Canvas

The canvas should be visually quiet:

- dark background (#1d1d1f);
- subtle grid lines only if useful;
- central placeholder model or outline;
- scan guidance overlay near the active area;
- no heavy chrome around the 3D view.

### Camera Preview

Use a dark/black frame with a clean label:

- "Live Camera"
- frame count / FPS if useful;
- screenshot and enlarge actions.

The preview should be present but not dominate the 3D model. Rounded corners (11px radius). Subtle shadow for depth separation.

### Dialogs

Dialogs should be concise and refined:

- title (600 weight, negative tracking);
- one-sentence explanation (400 weight);
- primary action on the right — pill button, brand blue;
- destructive actions red — pill button;
- cancel remains visually secondary — grey pill button.
- Input fields: rounded corners (8px), 44px height, brand blue focus ring.
- Frosted glass overlay with blur.

First dialogs:

- Save Case;
- Edit Case Name;
- Delete Unsaved Scan Data;
- Scanner Not Connected;
- Complete Scan.

## Interaction Tone

The UI should guide the operator with direct instructions:

- "Scan the upper arch from the molar."
- "Scanner connected. Press the scanner button or click Start."
- "Occlusion alignment is ready."
- "Remove excess soft tissue before completing."

Avoid vague copy like:

- "Something went wrong."
- "Prepare for scanning."
- "These are the hints."

## Research Takeaways To Preserve

- Medit exposes Maxilla, Mandible, and Occlusion as default scan stages and allows workflow stage management.
- Shining 3D scan interface explicitly separates camera window, guide, progress bar, preview, operations, scan frames/time, and tools.
- Medit occlusion guidance emphasizes scanning 3-4 teeth, auto/manual alignment, and not assessing occlusion before proper analysis.
- 3Shape documentation emphasizes guided workflows and scan strategy because poor scan order creates quality and post-processing issues.

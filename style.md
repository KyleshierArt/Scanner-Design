# Scanner UI Style Guide

Last updated: 2026-06-12

## Design Direction

The visual direction should be a calm clinical desktop workstation: precise, spacious, low-noise, and strongly guided. It should feel like professional medical/dental software rather than a consumer SaaS dashboard.

Keywords:

- clinical
- precise
- guided
- clean
- low cognitive load
- Windows desktop friendly
- high contrast for operator focus

Avoid:

- decorative gradients;
- oversized marketing-style cards;
- too many shadows;
- purple/AI-dashboard styling;
- hiding critical scan status behind subtle UI;
- small icon-only controls without state labels or tooltips.

## Layout Principles

Use a stable four-zone workspace:

1. Top bar: app identity, case name, scan stages, completion action.
2. Left rail: mode tools and current scanner status.
3. Center canvas: 3D scan preview placeholder and scan guidance overlay.
4. Right/bottom floating area: live camera preview and contextual controls.

The center scan canvas should dominate the screen. Tooling should be visible but secondary. During active scanning, the UI should reduce unnecessary visual competition around the model.

## First Layout Hypothesis

Target initial viewport: 1440 x 900 and 1920 x 1080.

- Top app bar: 48-56 px height.
- Stage bar: integrated into top area or immediately below it, using large stage pills.
- Left rail: 72 px collapsed icon rail, with an optional 260-320 px contextual panel when a tool is active.
- Main canvas: flexible, light neutral background.
- Camera preview: anchored bottom right, around 320 x 220 on 1440-width screens; resizable later.
- Bottom center controls: compact scan operations, only primary operations visible.

## Color Tokens

Initial palette:

- `--color-brand`: #0F67B1
- `--color-brand-strong`: #084F8F
- `--color-brand-soft`: #E7F2FF
- `--color-accent`: #21A0A0
- `--color-danger`: #D64545
- `--color-warning`: #D98A16
- `--color-success`: #1F9D62
- `--color-canvas`: #F6F8FA
- `--color-surface`: #FFFFFF
- `--color-surface-muted`: #EEF3F7
- `--color-border`: #D7E1EA
- `--color-border-strong`: #AFC4D8
- `--color-text`: #18212B
- `--color-text-muted`: #667789
- `--color-disabled`: #A8B3BE

Notes:

- Blue remains appropriate because existing assets and historical UI use blue, and clinical device software commonly uses blue for trust/status.
- Use teal only for active scan/acquisition emphasis, not as a second competing brand color.
- Use red only for destructive or scan-critical warnings.

## Typography

Use system fonts for Windows compatibility:

```css
font-family: "Inter", "Segoe UI", Arial, sans-serif;
```

Suggested scale:

- Page/case title: 16-18 px, 600.
- Stage label: 14-15 px, 600.
- Body: 13-14 px, 400.
- Helper text: 12-13 px, 400.
- Status badges: 12 px, 600.

Keep text short. In chairside use, guidance should be scannable in one glance.

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

Stage buttons should combine an icon, stage name, and state mark. Do not rely only on color.

### Tool Buttons

Tool buttons need clear states:

- default;
- hover;
- pressed;
- selected;
- disabled;
- warning/attention.

Use 48-56 px minimum hit target. For first demo, use labels in the expanded panel and tooltips for collapsed icon buttons.

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

- neutral light background;
- subtle grid or depth cue only if useful;
- central placeholder model or outline;
- scan guidance overlay near the active area;
- no heavy chrome around the 3D view.

### Camera Preview

Use a dark or black frame with a clear label:

- "Live Camera"
- frame count / FPS if useful;
- screenshot and enlarge actions.

The preview should be present but not dominate the 3D model.

### Dialogs

Dialogs should be concise and high-confidence:

- title;
- one-sentence explanation;
- primary action on the right;
- destructive actions red;
- cancel remains visually secondary.

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

## Style Questions For Review

- Should the demo be closer to the existing blue/white legacy UI, or more modern with a darker canvas and lighter controls?
- Should the left rail remain visible at all times, or collapse during active scanning?
- Should stage navigation be top-centered like the current video, or left-to-right workflow across the entire top?
- Should the camera preview stay bottom right, or become a detachable panel?
- Should the app feel like a native Windows application or a modern web app running in a desktop shell?

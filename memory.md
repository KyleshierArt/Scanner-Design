# Scanner UI Redesign Memory

Last updated: 2026-06-12

## Project Goal

Build a fake web demo for an intraoral scanner desktop product. The real product connects to an intraoral scanning device and is installed on customers' Windows computers, but this project only needs a realistic front-end demo for reviewing layout, visual style, navigation, buttons, dialogs, and interaction flow.

The current priority is style and layout reconstruction. Functional behavior should generally follow the recorded product videos, but the demo can use mocked state and placeholder data. The central scanning animation / 3D reconstruction does not need to be implemented in this phase.

## Working Agreement

- Treat `design/video.mp4` and `design/video2.mp4` as the primary functional reference.
- Treat `design/Scanner X.pdf` as historical reference only. It contains useful workflow hints but may not match the current feature set.
- Use web implementation as the design medium, not static UI images.
- Keep assets exportable later: SVG icons, component screenshots, fixed viewport screenshots, and CSS design tokens.
- Keep decisions in this file so work can continue across machines.

## Existing Local Assets

- `design/Scanner X.pdf`: 24-page historical UI design file.
- `design/video.mp4`: recorded current implementation, 951 x 512, about 6m54s.
- `design/video2.mp4`: recorded current implementation, 956 x 544, about 7m42s.
- `images/crop.svg`: crop tool icon.
- `images/delete.svg`: delete tool icon.
- `images/screenshot.svg`: screenshot tool icon.
- `images/挖洞默认.png`: hole / undercut tool default state.
- `images/挖洞选中.png`: hole / undercut tool selected state.
- `images/挖洞禁用.png`: hole / undercut tool disabled state.
- `logo.ai`: likely source logo file.

## Product Context

This is a chairside intraoral scanning application for dental clinics or labs. The user is usually operating next to a patient, with one hand on the scanner and limited tolerance for complex UI operations. The UI should prioritize:

- fast recognition of the current scan stage;
- clear device connection / scanning state;
- large click targets for touch or mouse use;
- visible scan guidance and warnings;
- minimal interruption during active scanning;
- easy recovery from common states such as disconnected scanner, failed alignment, trimming, deletion, and save/complete.

## Typical Industry Workflow

Common public documentation from Medit, Shining 3D, and 3Shape shows similar workflow concepts:

- scan stages commonly include Maxilla, Mandible, and Occlusion;
- some products allow additional stages such as pre-op scan, scan body, denture, edentulous, face scan, or additional data;
- the scan screen usually combines a 3D preview, live camera/endoscope window, stage progress, operation buttons, and contextual guidance;
- occlusion/bite alignment is usually treated as a guided stage with automatic alignment and sometimes manual alignment fallback;
- modern scanners add AI cleanup, refined scan, auto bite optimization, screenshot/annotation, and configurable scan order.

Reference links:

- Medit stage management: https://support.medit.com/hc/en-us/articles/8821600296729--Stage-management
- Medit occlusion workflow: https://support.medit.com/hc/en-us/articles/360040009771--Occlusion
- Shining 3D scan interface: https://docs.shining3d.com/intraoralscan/3.5.4/aoralscanl-simple/en-us/scaninterface/
- Shining 3D scan parameters: https://docs.shining3d.com/intraoralscan/3.5.6/aoralscan3/en-us/settingscanparameter/
- 3Shape TRIOS / Unite updates: https://www.3shape.com/en/software-updates/trios-and-unite
- 3Shape scan strategy: https://support.3shape.com/products-trios-and-accessories-trios-3-how-to/correct-full-trios-scan-scanning-strategy

## Current Demo Scope

First demo should include:

- Main scan workspace.
- Top case bar with app mark, case name, basic window actions.
- Stage navigation: Maxilla, Mandible, Occlusion, Complete.
- Left tool rail / contextual panel.
- Main scan canvas placeholder.
- Camera preview window placeholder.
- Primary actions: start/pause, reset/retry, screenshot, trim, delete, hole/undercut-related tool, complete.
- Device status: disconnected, connected, scanning, paused, completed.
- Dialogs: edit/save case, delete confirmation, disconnected scanner notice, complete confirmation.

Out of scope for first demo:

- real scanner integration;
- real 3D reconstruction;
- real STL/PLY/OBJ import/export;
- patient database;
- cloud sync;
- advanced settings;
- detailed clinical toolkits.

## Design Direction

BMW corporate design system applied to clinical scanner UI:

- Primary color: BMW Blue #1c69d4 (single action color)
- Canvas: white (#ffffff) base, dark navy (#1a2129) scan canvas
- Typography: Inter 700 display + 300 body (BMW Type Next Latin substitute)
- Rectangular: 0px radius on buttons, cards, inputs, badges
- No shadows: depth from color-block contrast only
- Uppercase labels with letter-spacing for badges, tabs, status indicators
- Reference: `awesome-design-md/bmw/DESIGN.md`

## Open Questions

- Product brand name and logo usage: use existing `logo.ai` or create temporary mark?
- Final target resolution: likely Windows desktop, but should we optimize for 1920 x 1080 first?
- Language: English UI, Chinese UI, or bilingual?
- Should the demo visually resemble the existing product enough for users to recognize it, or should it be a stronger redesign break?
- Which buttons in the videos are mandatory for first review?
- Does "挖洞" mean undercut check, hole filling, erase hole, or another dental-specific operation in this product?

## Next Implementation Direction

Continue building in `scanner-demo/` using plain HTML, CSS, and JavaScript. Start with static mocked state and deterministic component layout. Keep the UI deterministic so screenshots can later be exported for developers.

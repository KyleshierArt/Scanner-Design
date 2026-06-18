# Scanner X — Icon Inventory

## 1. Scan Stages (StageNav)

| ID | Label | Size | State Variants | Usage |
|----|-------|------|----------------|-------|
| `icon-maxilla` | Maxilla | 22px | `icon-maxilla-filled` (active) | Stage pill icon |
| `icon-mandible` | Mandible | 22px | `icon-mandible-filled` (active) | Stage pill icon |
| `icon-occlusion` | Occlusion | 22px | `icon-occlusion-filled` (active) | Stage pill icon |
| `icon-check-circle` | Complete | 22px | — | Stage pill icon (also used when a stage is scanned) |

## 2. Left Rail Tools

| ID | Label | Size | Usage |
|----|-------|------|-------|
| `icon-crop` | Crop | 22px | Trim scan data |
| `icon-undercut` | Undercut Check | 22px | Detect undercut areas |
| `icon-bite-check` | Bite Check | 22px | Verify occlusal contacts |
| `icon-implant` | Implant | 22px | Place implant fixtures |
| `icon-camera` | Screenshot | 22px | Save view snapshot |
| `icon-lock` | Lock | 22px | Lock scan data |
| `icon-trash` | Delete | 22px | Delete scan data |

## 3. Scan Controls

| ID | Label | Size | State Variants | Usage |
|----|-------|------|----------------|-------|
| `icon-play` | Start Scan | 22px | `icon-pause` (scanning) | Primary scan button |
| `icon-rotate-ccw` | Reset | 18px | — | Reset scan data |
| `icon-trash` | Delete | 18px | — | Delete current stage data |
| `icon-send` | Send to Lab | 18px | — | Export completed case |

## 4. TopBar (Scan View)

| ID | Label | Size | Usage |
|----|-------|------|-------|
| `icon-arrow-left` | Back | 18px | Return to patient list |
| `icon-pencil` | Edit | 14px | Edit case name |
| `icon-save` | Save | 18px | Save case |
| `icon-minus` | Minimize | 18px | Window control |
| `icon-square` | Maximize | 18px | Window control |
| `icon-x` | Close | 18px | Window control |

## 5. Patient List

| ID | Label | Size | Usage |
|----|-------|------|-------|
| `icon-plus` | Add | 18px | Add patient / New Scan |
| `icon-search` | Search | 18px | Search patients, empty state |
| `icon-more-v` | More | 18px | Patient card overflow menu |
| `icon-pencil` | Edit | 18px | Edit patient (menu item) |
| `icon-trash` | Delete | 18px | Delete patient (menu item) |

## 6. Device Status

| ID | Label | Size | State Variants | Usage |
|----|-------|------|----------------|-------|
| `icon-unlink` | Offline | 18px | `icon-link` (connected) | Left rail bottom, scanner badge |

## 7. Camera Preview

| ID | Label | Size | State Variants | Usage |
|----|-------|------|----------------|-------|
| `icon-camera` | Live Camera | 14px | — | Camera header label |
| `icon-camera` | Screenshot | 18px | — | Camera screenshot button |
| `icon-maximize` | Enlarge | 18px | `icon-minimize` (enlarged) | Camera resize toggle |

## 8. Scan Gallery Cards

| ID | Label | Size | Usage |
|----|-------|------|-------|
| `icon-maxilla` | Scan preview | 28px | Placeholder icon in scan card thumbnail |

---

## Unused (can remove)

- `icon-wand` — was Smart Scan tool, no longer used
- `icon-leaf` — was Tissue Filter tool, no longer used
- `icon-shield` — was Quality Check tool, no longer used

---

## Icons that need design improvement

The following icons were created as quick placeholders and should be revisited with the `/svg-icon-designer` skill for a more professional, semi-realistic medical illustration style:

| ID | Current Quality | Notes |
|----|----------------|-------|
| `icon-bite-check` | Placeholder | Needs proper occlusion contact visualization |
| `icon-implant` | Placeholder | Needs anatomical implant fixture shape |
| `icon-undercut` | Rough | Needs clearer undercut detection metaphor |
| `icon-crop` | Basic | Could be more specific to dental scan trimming |
| `icon-lock` | Generic | Standard lock icon, adequate but not dental-specific |

---

## Summary

| Group | Count |
|-------|-------|
| Scan Stages | 4 (7 with filled variants) |
| Left Rail Tools | 7 |
| Scan Controls | 4 (5 with pause variant) |
| TopBar | 6 |
| Patient List | 5 |
| Device Status | 2 |
| Camera Preview | 3 (4 with minimize variant) |
| Scan Gallery | 1 |
| **Total unique** | **27** |
| **Total with variants** | **35** |
| **Unused (removable)** | **3** |

# CNC Guide — Lowrider V4

A step-by-step CNC machining guide PWA tailored for the V1 Engineering Lowrider V4 with Jackpot CNC controller and AMB/Kress 800 FME-Q spindle.

**Live app:** https://karel314.github.io/cnc-guide/

## What It Does

A browser-based tool you use next to your CNC machine. Four screens:

- **Home** — Quick access to New Job wizard and Reference, plus safety reminders
- **New Job (Wizard)** — 5-step guided workflow:
  1. Pick your material (wood, plywood, MDF, plastics, aluminum, foam)
  2. Pick your operation (profile, pocket, V-carve, drill, surface, engrave)
  3. Get a bit recommendation from your inventory — with a "better bit available" suggestion if a bit you don't own would be more suitable
  4. Get a complete settings card (Kress dial position, feed rate, plunge rate, depth per pass, tabs, CAM notes)
  5. Interactive workflow checklist (CAM setup → machine setup → safety check → run → finishing) with checkboxes that auto-advance phases
- **My Bits** — Your bit inventory with add/edit/delete. Persisted in localStorage.
- **Reference** — Quick-access tables: Kress speed dial chart, Jackpot G-code commands, chip quality guide, Z-probe procedure, V1E golden rule starting settings, workholding methods, collet reference

## Smart Bit Recommendations

The app scores every bit you own (0–10) against a master catalog of 16 common CNC bit types, based on the operation and material. If a bit you don't own would score higher, it shows a "Better bit available" card with a visual score comparison — so you know what to consider buying.

Master catalog covers: upcut, downcut, compression, O-flute, V-bits (30°/60°/90°), ball nose, surfacing, and straight flute in common sizes.

## Machine Setup

This app is configured for:

| Component | Model |
|-----------|-------|
| CNC Machine | V1 Engineering Lowrider V4 |
| Controller | Jackpot CNC (ESP32, FluidNC) |
| Spindle | AMB/Kress 800 FME-Q (800W, 10k–29k RPM, manual dial) |
| CAM Software | Estlcam and/or MillMage |

## File Structure

```
cnc-guide-app/
├── index.html          # Single-page app with all 4 screens
├── app.js              # Wizard logic, bit scoring engine, checklist
├── style.css           # Responsive styling
├── sw.js               # Service worker for offline PWA
├── manifest.json       # PWA manifest
├── data/
│   ├── bits.json       # Default bit inventory (5 starter bits)
│   ├── materials.json  # Material definitions with feeds & speeds per bit
│   └── all-bits.json   # Master catalog of 16 common CNC bits with suitability scores
└── icons/
    ├── icon-192.png
    └── icon-512.png
```

## Running Locally

```bash
cd cnc-guide-app
python3 -m http.server 8766
# Open http://localhost:8766
```

## Adding Bits

Click **+ Add Bit** on the My Bits screen. Fill in name, type, shank size, cutting diameter, flutes, coating, and notes. Bits are saved to localStorage and immediately available in the wizard recommendations.

## Companion: Claude Skill

There is also a Claude Code skill (`/cnc-guide`) that acts as an AI-powered CNC expert for this exact machine setup. Use it for:

- Troubleshooting ("my cuts are burning, what's wrong?")
- Unusual material/operation combinations
- Detailed explanations of why specific settings are recommended
- Conversational step-by-step guidance with adaptive follow-up

The skill lives at `~/.claude/skills/cnc-guide/` with reference docs for machine specs, feeds & speeds, bit guide, bit inventory, and workflow checklists.

## Offline Support

The app works offline after the first visit. The service worker caches all assets. Force-refresh with **Cmd+Shift+R** (Mac) or **Ctrl+Shift+R** (Windows/Linux) after updates.

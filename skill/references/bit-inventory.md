# My Bit Inventory (Static Fallback)

**NOTE:** This is a static snapshot. The live, up-to-date inventory is managed in the CNC Guide PWA
and should be fetched via WebFetch from: https://karel314.github.io/cnc-guide/data/bits.json
Only use this file if WebFetch fails.

## Current Inventory

| Karel NR | Name | Qty | Shank | Cut Dia | Flute Length | Flutes | Coating | Type | Best For |
|----------|------|-----|-------|---------|-------------|--------|---------|------|----------|
| 1 | 1/4" Downcut Finisher | 2x | 1/4" (6.35mm) | 1/4" (6.35mm) | 25.4mm (1") | 2 | DLC | Downcut spiral | Pocketing in hard wood, clean top edges, profile cuts where tabs aren't needed (chips hold part down) |
| 2 | 1/8" Downcut | 2x | 1/8" (3.175mm) | 2mm | 12mm | 2 | DLC | Downcut spiral | Detail work, small pockets, clean top surface on plywood, engraving |
| 3 | 1/8" Upcut | 10x | 1/8" (3.175mm) | 1/8" (3.175mm) | 17mm | 2 | Nano Blue | Upcut spiral | General purpose, drilling, through-cuts, chip evacuation, deep pockets. Your workhorse bit. |
| 4 | 8mm 60-degree V-Bit | 2x | 8mm | 8mm (60 deg cone) | 6.9mm | 3 | Nano coating | V-bit chamfer | V-carving, lettering, engraving, chamfering edges, inlay work |
| 5 | 1" Surfacing Bit | 3x | 1/4" (6.35mm) | 1" (25.4mm) | 1/4" (6.35mm) | 3 | None | Surfacing / fly cutter | Flattening spoilboard, surfacing epoxy pours, flattening large areas |
| 15 | 1/8" 90-degree V-Bit | ~8x | 1/8" (3.175mm) | 1/8" (3.175mm) | — | 1 | None | V-bit (single flute) | Normal/small 90-deg V-carving & engraving. Max clean depth ~1.6mm (dia/2). Dial 3, feed 800 / plunge 150 in softwood/ply. Send true V-carving to Estlcam. |

## To-Buy Wishlist (not yet owned)

Tracked in the app with `owned: false`. Sourced from the **SpeTool EU store** (verify each SKU there — it's a different, mostly-metric catalog from the US site):

| NR | Bit | Priority | EU SKU | Notes |
|----|-----|----------|--------|-------|
| 6 | 6mm Compression | Medium | W02504 (6mm dia / 8mm shank / 24mm CL) | Clean both faces, NO bearing. Needs a full-depth finishing pass over ~0.4mm radial to beat a plain downcut; only worth it when both faces show. 8mm shank uses the owned 8mm collet. |
| 10 | 90-degree V-Bit | Medium | W06509 (6mm dia, 6mm shank, 3FL) | Only for BOLD/wide lettering the 1/8" (NR15) can't reach. |

Remaining wishlist (NR 7,8,9,11,12,13,14) still to be sourced on the EU store; NR8/9 (3D ballnose) deferred until a 3D CAM workflow exists. See the app's `data/bits.json` for the live list.

## Collets Needed

Based on the inventory, the user needs these collets for the Kress 800 FME-Q:

| Collet Size | For Bits | Status |
|-------------|----------|--------|
| 3.175mm (1/8") | NR 2, NR 3 | NEEDED — check if owned |
| 6.35mm (1/4") | NR 1, NR 5 | NEEDED — check if owned |
| 8mm | NR 4 | INCLUDED with Kress |

## Quick Selection Guide

When the user describes a job, recommend from their inventory:

| Job Type | Recommended Bit (Karel NR) | Why |
|----------|---------------------------|-----|
| Profile/through-cut in wood/plywood | NR 3 (1/8" upcut) or NR 1 (1/4" downcut) | Upcut for chip clearing; downcut if top surface matters |
| Pocket in hardwood | NR 1 (1/4" downcut) | Chips stay in pocket, clean surface |
| Pocket in softwood/MDF | NR 3 (1/8" upcut) | Good chip evacuation, fine detail |
| Large pocket | NR 1 (1/4" downcut) first, NR 2 (1/8" downcut) for corners | Faster removal with 1/4", detail with 1/8" |
| Drilling holes | NR 3 (1/8" upcut) | Upcut clears chips from holes |
| V-carving / lettering | NR 4 (60-deg V-bit) | Your only V-bit; 60 deg is versatile |
| Engraving (shallow) | NR 2 (1/8" downcut) or NR 4 (V-bit) | Downcut for line engraving, V-bit for V-carve |
| Flatten spoilboard | NR 5 (1" surfacing) | Purpose-built for surfacing |
| Epoxy river table flatten | NR 5 (1" surfacing) | Large flat coverage |

## What's Missing (Future Purchases)

The user currently does NOT own:
- **Compression bit** — needed for clean both-sides cuts in plywood (currently using downcut or upcut separately)
- **O-flute / single-flute for plastics** — needed if cutting acrylic or HDPE (the upcut bits will work but aren't ideal)
- **Ball nose** — needed for 3D carving / sculpted surfaces
- **90-degree V-bit** — useful for wider/bolder lettering (only has 60-degree)
- **Smaller V-bits (30 deg)** — for very fine detail engraving

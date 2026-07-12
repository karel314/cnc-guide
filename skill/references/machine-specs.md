# Machine Reference: Lowrider V4 + Jackpot + Kress 800 FME-Q

## V1 Engineering Lowrider V4

- **Type:** Open-source DIY CNC router, belt-driven, 2.5-axis
- **Frame:** 3D-printed parts on 1" EMT conduit rails (29.5mm, 30mm, or 32mm OD)
- **XZ Plates:** Aluminum, 6.5mm thick
- **THIS BUILD: X 610mm x Y 1220mm, Z 50mm usable. Homes to the FRONT LEFT corner.**
  (Half-sheet machine. Use these numbers, not the generic maximums below.)
- **Working area (design max):** User-configurable, up to full 4x8 ft sheet (1220x2440mm)
- **Z travel:** ~100mm total, ~50mm usable cutting depth (100mm with drop table)
- **Z leadscrews:** T8, 145mm+, 4-start, 2mm pitch (8mm/rev)
- **Z linear rails:** 4x MGN12H, 150mm
- **Stepper resolution:** 100 steps/mm (X/Y), 400 steps/mm (Z) with TMC2209
- **Machining tolerance:** +/-0.2-0.3mm achievable, +/-0.1-0.2mm with careful work
- **Rigidity:** Most rigid near the table surface. Substantially stiffer than V3 due to larger 1" EMT rails. Rigidity decreases as Z rises.
- **Capable materials:** Wood, plywood, MDF, plastics, foam, soft aluminum (with care)
- **NOT suitable for:** Steel, stainless, titanium, heavy cuts
- **Auto-squaring:** 5 endstops standard (X, dual-Y, dual-Z) for automatic squaring and Z-leveling at homing
- **Tool mount:** Accepts any tool with diameter up to 69mm. Tool-free router removal (no loosening mount screws).

### Key V4 Improvements (vs V3)
- Larger 1" EMT rails (vs 3/4") — significantly more beam stiffness
- 50mm usable Z depth (vs 38mm)
- More robust Y connection
- JPlate extended wings for better dust protection
- Tool-free router removal from mount
- Improved strut plate system with locking screws

### Known Limitations
- Belt-driven Y-axis has some inherent backlash
- 3D-printed parts are the weakest link — poor layer adhesion or low infill reduces rigidity
- EMT conduit quality varies; bent or rusty tubes affect accuracy
- Practical speed ceiling ~4000-6000 mm/min (drift risk above this)
- Aluminum is at the machine's limit — requires very conservative settings
- Keep cutting force around 9 lbs / 4 kg maximum

---

## Jackpot CNC Controller

- **Firmware:** FluidNC (GRBL-compatible, ESP32-based)
- **Config:** Plain-text YAML file, no compilation needed
- **Interface:** Built-in WiFi Web UI (ESP3D-based) -- connect phone/tablet/PC via WiFi
- **Alternative senders:** CNCjs (USB serial), any GRBL-compatible sender
- **Stepper drivers:** 6x TMC2209
- **Probe port:** GPIO 36 (last input port)
- **Probe hardware:** XYZ touch probe block (conductive metal block, normally-open switch). Wired signal + ground only (NO 5V). Previously a V1E Tiny Touch Plate (0.5mm) — now upgraded to an XYZ probe. Config is identical for both: `pin: gpio.36:low`. Only the probe offset value changes.

### FluidTouch Pendant — the primary machine interface

The user has a **FluidTouch** touchscreen pendant (jeyeager65/FluidTouch on an Elecrow CrowPanel
7" ESP32-S3). It connects to FluidNC over **WiFi/WebSocket** (port 81 on FluidNC v3.x, port 80 on
v4.0+) — not USB.

**This is how jobs are actually run.** FluidTouch browses G-code files on the FluidNC SD card,
FluidNC flash, or the panel's own SD card, and tells the Jackpot to run one. The controller
executes the file itself — nothing is streamed from a PC, so a WiFi drop or a sleeping laptop
cannot stall a job mid-cut.

It provides: jogging (buttons + analog joystick), homing, automated probing, file browsing, job
start/pause/stop, feed override, and up to 9 file-based macros per machine.

**Consequence for CAM:** MillMage/Estlcam are used to *generate files*, not to drive the machine.
See `references/millmage-setup.md`. Never have a PC sender and FluidTouch both sending commands
at the same time — FluidNC accepts both channels and they will interleave.

### Essential Commands

| Command | Function |
|---------|----------|
| `$H` | Home all axes |
| `$HX` / `$HY` / `$HZ` | Home individual axis |
| `$X` | Clear alarm / unlock |
| `G92 X0 Y0 Z0` | Set current position as work zero (volatile) |
| `G10 L20 P1 X0 Y0 Z0` | Set work coordinate zero (persistent in G54) |
| `G28.1` | Store current position as G28 position |
| `G28` | Move to stored G28 position |
| `G38.2 Z-25 F100` | Probe Z downward at 100mm/min |
| `$J=X10 F500` | Jog X +10mm at 500mm/min |
| `$#` | Show all coordinate offsets |
| `?` | Status report (position, state) |
| `!` | Feed hold (pause) |
| `~` | Cycle start / resume |
| `Ctrl+X` | Soft reset |

### Z-Probe Procedure (XYZ touch probe)

The user uses an **XYZ touch probe block**. For Z, place the block ON TOP of the
workpiece and probe down onto its top surface. The Z offset = the **measured height
of the block** (measure with calipers — cheap blocks vary). This replaces the old
Tiny Touch Plate's fixed 0.5mm.

1. Clip the ground wire to the bit, place the block on the workpiece top
2. **Verify wiring first:** touch the clip to the block by hand, send `?`, confirm
   `Pn:P` appears in the status (then clears on release)
3. Probe with a two-stage macro:
   ```gcode
   G21 G91
   G38.2 Z-25 F150        ; fast seek
   G0 Z2                  ; back off
   G38.2 Z-4 F40          ; slow, accurate
   G90
   G10 L20 P1 Z[BLOCK_HEIGHT]   ; e.g. Z10 — NOT a G38 P-word; set zero AFTER probing
   G0 Z15
   ```
4. Result: Z0 = top of workpiece. Probe success reported as `[PRB:X,Y,Z:1]`
5. Remove the block and ground wire

**Note:** `G38.2` does NOT take a P-word for plate thickness in FluidNC/GRBL. Always
set the offset separately with `G10 L20 P1 Z[height]` after the probe completes.

X/Y probing is possible with the block but limited on FluidNC/Jackpot (no edge-find
routine). Recommend Z-only probing; set X/Y manually. Full guide:
`references/xyz-probe-fluidnc.md`.

---

## AMB/Kress 800 FME-Q Spindle

- **Power:** 800W
- **RPM range:** 10,000 - 29,000 (no-load)
- **Speed control:** Manual dial (1-6), NOT VFD/controller-managed
- **Collet included:** 8mm
- **Available collets:** 3mm, 3.175mm (1/8"), 4mm, 6mm, 6.35mm (1/4"), 8mm, 10mm
- **Collet system:** Proprietary AMB/Kress (not ER). ER16 adapters available.
- **Clamping diameter:** 43mm
- **Weight:** 1.4 kg

### Speed Dial Reference

| Dial | RPM (no-load) | Typical Use |
|------|---------------|-------------|
| 1 | ~10,000 | Aluminum, plastics, large bits (>12mm) |
| 1.5 | ~11,900 | Delrin, soft plastics |
| 2 | ~13,800 | General wood with 1/4" bits, hardwood |
| 2.5 | ~15,700 | Plywood, MDF with 1/4" bits |
| 3 | ~17,600 | General wood with 1/8" bits |
| 3.5 | ~19,500 | Softwood, faster cuts |
| 4 | ~21,400 | Fine detail / engraving |
| 4.5 | ~23,300 | V-carving with small V-bits |
| 5 | ~25,200 | Fine engraving, very small bits (<2mm) |
| 6 | ~29,000 | Rarely needed; very small bits or PCB work |

**Rule of thumb:** You will spend most of your time between dial 1 and 3. Higher speeds are rarely beneficial on a hobby router and often counterproductive.

**CRITICAL:** The Kress spindle is manually controlled. The Jackpot controller does NOT start or stop it. You must turn the dial yourself before starting any job, and turn it off when done.

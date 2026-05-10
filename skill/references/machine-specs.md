# Machine Reference: Lowrider V4 + Jackpot + Kress 800 FME-Q

## V1 Engineering Lowrider V4

- **Type:** Open-source DIY CNC router, belt-driven, 2.5-axis
- **Frame:** 3D-printed parts on 1" EMT conduit rails (29.5mm, 30mm, or 32mm OD)
- **XZ Plates:** Aluminum, 6.5mm thick
- **Working area:** User-configurable, up to full 4x8 ft sheet (1220x2440mm)
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

### Z-Probe Procedure
1. Clip ground wire to the bit
2. Place touchplate on workpiece surface
3. Send `G38.2 Z-25 F100 P[thickness]` (thickness = touchplate thickness in mm)
4. Bit probes down until contact, Z zero is set at workpiece top
5. Probe result reported as `[PRB:X,Y,Z:1]` (1 = success)
6. Remove touchplate and ground wire

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
